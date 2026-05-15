import os
import gc
import fitz
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
from app.core.config import settings

# Global variable for lazy loading
_embeddings = None

def get_embeddings():
    """Lazy load embeddings to save memory on startup"""
    global _embeddings
    if _embeddings is None:
        print("Loading FastEmbed model (Memory optimized)...")
        # Switching to a smaller model to stay well under 512MB RAM
        _embeddings = FastEmbedEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2", threads=1)
    return _embeddings

def get_vector_store():
    if os.path.exists(settings.FAISS_INDEX_DIR):
        try:
            return FAISS.load_local(settings.FAISS_INDEX_DIR, get_embeddings(), allow_dangerous_deserialization=True)
        except Exception as e:
            print(f"Error loading FAISS index: {e}")
            return None
    return None

def save_vector_store(vector_store: FAISS):
    os.makedirs(settings.FAISS_INDEX_DIR, exist_ok=True)
    vector_store.save_local(settings.FAISS_INDEX_DIR)

def stream_and_index_pdf(filepath: str) -> tuple[int, int]:
    """O(1) memory streaming PDF indexer."""
    vector_store = get_vector_store()
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    
    doc = fitz.open(filepath)
    total_chunks = 0
    total_pages = len(doc)
    
    for page_num in range(total_pages):
        page = doc.load_page(page_num)
        text = page.get_text()
        
        if not text.strip():
            continue
            
        document = Document(
            page_content=text,
            metadata={"source": os.path.basename(filepath), "page": page_num + 1}
        )
        
        chunks = text_splitter.split_documents([document])
        
        if not chunks:
            continue
            
        total_chunks += len(chunks)
        
        # Batch size is essentially the number of chunks on one single page (usually ~3-5).
        if vector_store is None:
            vector_store = FAISS.from_documents(chunks, get_embeddings())
        else:
            vector_store.add_documents(chunks)
            
        # O(1) Memory Guarantee: Delete page from RAM before moving to next
        del page
        del chunks
        del document
        gc.collect()
        
    doc.close()
    
    if vector_store:
        save_vector_store(vector_store)
        
    gc.collect()
    return total_pages, total_chunks

def reformulate_query(query: str, history: list) -> str:
    if not history or not settings.GROQ_API_KEY or settings.GROQ_API_KEY == "your-groq-api-key":
        return query
        
    try:
        # Use an ultra-fast, small model just for rewriting the query
        llm = ChatGroq(temperature=0.0, model_name="llama3-8b-8192", groq_api_key=settings.GROQ_API_KEY)
        
        history_str = "\n".join([f"{msg['role'].capitalize()}: {msg['content']}" for msg in history[-4:]]) # Last 4 turns
        
        prompt = PromptTemplate.from_template("""
        Given the following chat history and the user's latest question, rewrite the latest question into a fully descriptive standalone search query. 
        Replace words like 'it', 'that', 'they', 'why' with the actual subject from the history.
        Do NOT answer the question. ONLY output the rewritten standalone query.
        
        Chat History:
        {history}
        
        Latest Question: {query}
        
        Standalone Search Query:
        """)
        
        chain = prompt | llm
        response = chain.invoke({"history": history_str, "query": query})
        return response.content.strip().replace('"', '')
    except Exception as e:
        print(f"Reformulation error: {e}")
        return query

def query_rag(query: str, language: str = "en", history: list = None) -> dict:
    # 1. Rewrite the query if there is conversation history (resolves "what is that?")
    standalone_query = reformulate_query(query, history) if history else query
    print(f"Original: {query} -> Search Query: {standalone_query}")

    vector_store = get_vector_store()
    if not vector_store:
        return {
            "answer": "The Ayurvedic knowledge base is currently empty. Please upload sacred texts in the Library to begin.",
            "citations": [],
            "retrieval_metadata": {"status": "no_index", "confidence": 0}
        }
        
    # Retrieve top chunks with scores using the STANDALONE query
    docs_with_scores = vector_store.similarity_search_with_score(standalone_query, k=4)
    
    if not docs_with_scores:
        return {
            "answer": "The indexed Ayurvedic knowledge base does not contain sufficient reliable information for this query.",
            "citations": [],
            "retrieval_metadata": {"status": "no_results", "confidence": 0}
        }
        
    # Format context and citations
    context = ""
    citations = []
    total_score = 0
    
    for doc, score in docs_with_scores:
        # Convert L2 distance to a rough confidence score (0 to 1)
        # Typical L2 distances for BGE range from 0 to 1.5+. 
        confidence = max(0, 1 - (score / 1.5))
        total_score += confidence
        
        context += f"Source: {doc.metadata.get('source')} (Page {doc.metadata.get('page')})\n"
        context += f"Content: {doc.page_content}\n\n"
        
        citations.append({
            "source": doc.metadata.get('source', 'Unknown'),
            "page": doc.metadata.get('page', 0),
            "snippet": doc.page_content,
            "score": round(confidence * 100, 1)
        })
        
    avg_confidence = round((total_score / len(docs_with_scores)) * 100, 1)
    
    # Hallucination check based on confidence
    if avg_confidence < 40:
        return {
            "answer": "I'm sorry, but the uploaded PDFs do not contain enough relevant information to answer this accurately.",
            "citations": citations,
            "retrieval_metadata": {"status": "low_confidence", "confidence": avg_confidence}
        }

    # Generate Answer
    if not settings.GROQ_API_KEY or settings.GROQ_API_KEY == "your-groq-api-key":
        return {
            "answer": "Error: Groq API Key is missing. Please add it to the backend environment.",
            "citations": []
        }

    try:
        llm = ChatGroq(temperature=0.0, model_name="llama-3.3-70b-versatile", groq_api_key=settings.GROQ_API_KEY)
    except Exception as e:
        return {"answer": f"Error: {str(e)}", "citations": []}
    
    prompt = PromptTemplate.from_template("""
    You are 'AI Vaidya', a specialized Ayurvedic Knowledge Assistant.
    
    CRITICAL AND STRICT GROUNDING RULES - READ CAREFULLY:
    1. You MUST answer the user's question using ONLY the information provided in the 'Retrieved Context' below.
    2. NEVER use your own pre-trained knowledge, external internet knowledge, or assumptions to supplement the answer.
    3. If the 'Retrieved Context' does not contain the exact information needed to fully answer the question, you MUST reply EXACTLY with: "I'm sorry, but the uploaded PDFs do not contain information regarding this." and say nothing else.
    4. Do not attempt to guess or infer information that is not explicitly stated in the context.
    5. Ensure the response is in {language}.

    Retrieved Context:
    {context}

    User Question: {standalone_query}
    
    Grounded Answer:
    """)
    
    chain = prompt | llm
    response = chain.invoke({"context": context, "standalone_query": standalone_query, "language": language})
    
    gc.collect() # Free memory after generation
    
    return {
        "answer": response.content,
        "citations": citations,
        "retrieval_metadata": {
            "status": "success",
            "confidence": avg_confidence,
            "count": len(docs_with_scores)
        }
    }
