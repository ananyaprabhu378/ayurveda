import os
import gc
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
        _embeddings = FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5", threads=1)
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

def process_and_index_document(pages_data: list):
    documents = []
    for data in pages_data:
        doc = Document(
            page_content=data['text'],
            metadata={"source": data['source'], "page": data['page']}
        )
        documents.append(doc)

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    
    chunks = text_splitter.split_documents(documents)
    
    vector_store = get_vector_store()
    if vector_store is None:
        vector_store = FAISS.from_documents(chunks, get_embeddings())
    else:
        vector_store.add_documents(chunks)
        
    save_vector_store(vector_store)
    gc.collect() # Free memory after indexing
    return len(chunks)

def query_rag(query: str, language: str = "en") -> dict:
    vector_store = get_vector_store()
    if not vector_store:
        return {
            "answer": "The Ayurvedic knowledge base is currently empty. Please upload sacred texts in the Library to begin.",
            "citations": [],
            "retrieval_metadata": {"status": "no_index", "confidence": 0}
        }
        
    # Retrieve top chunks with scores (FAISS returns L2 distance, lower is better)
    docs_with_scores = vector_store.similarity_search_with_score(query, k=4)
    
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
    if avg_confidence < 30:
        return {
            "answer": "The indexed Ayurvedic knowledge base does not contain sufficient reliable information for this query. The semantic match confidence is too low to provide a grounded response.",
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
        llm = ChatGroq(temperature=0.1, model_name="llama-3.3-70b-versatile", groq_api_key=settings.GROQ_API_KEY)
    except Exception as e:
        return {"answer": f"Error: {str(e)}", "citations": []}
    
    prompt = PromptTemplate.from_template("""
    You are 'AI Vaidya', a specialized Ayurvedic Knowledge Assistant.
    
    STRICT GROUNDING RULES:
    1. Answer the question ONLY using the provided retrieved context.
    2. NEVER use external internet knowledge or generic AI training data to supplement the answer.
    3. If the answer is not explicitly contained within the context, state: "The indexed Ayurvedic knowledge base does not contain sufficient information to answer this accurately."
    4. Provide a technical, expert Ayurvedic perspective based strictly on the texts.
    5. Do NOT mention "Based on the provided context" in every sentence; make it a natural but strictly grounded response.
    6. Ensure the response is in {language}.

    Retrieved Context:
    {context}

    User Question: {query}
    
    Grounded Answer:
    """)
    
    chain = prompt | llm
    response = chain.invoke({"context": context, "query": query, "language": language})
    
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
