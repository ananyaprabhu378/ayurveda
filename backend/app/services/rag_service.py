import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
from app.core.config import settings

# Initialize Embeddings
embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")

def get_vector_store():
    if os.path.exists(settings.FAISS_INDEX_DIR):
        try:
            return FAISS.load_local(settings.FAISS_INDEX_DIR, embeddings, allow_dangerous_deserialization=True)
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
        vector_store = FAISS.from_documents(chunks, embeddings)
    else:
        vector_store.add_documents(chunks)
        
    save_vector_store(vector_store)
    return len(chunks)

def query_rag(query: str, language: str = "en") -> dict:
    vector_store = get_vector_store()
    if not vector_store:
        return {"answer": "No documents have been indexed yet.", "citations": []}
        
    # Retrieve top chunks
    retriever = vector_store.as_retriever(search_kwargs={"k": 4})
    docs = retriever.invoke(query)
    
    if not docs:
        return {"answer": "I could not find any relevant information in the uploaded Ayurvedic texts.", "citations": []}
        
    # Format context
    context = ""
    citations = []
    for doc in docs:
        context += f"Source: {doc.metadata.get('source')} (Page {doc.metadata.get('page')})\n"
        context += f"Content: {doc.page_content}\n\n"
        citations.append({
            "source": doc.metadata.get('source', 'Unknown'),
            "page": doc.metadata.get('page', 0),
            "snippet": doc.page_content[:200] + "...",
            "score": 0.9 # Placeholder, FAISS returns L2 distance but we can compute confidence if needed
        })
        
    # Generate Answer
    if not settings.GROQ_API_KEY or settings.GROQ_API_KEY == "your-groq-api-key":
        return {
            "answer": "Error: Groq API Key is missing or invalid. Please update the GROQ_API_KEY in your backend/.env file with a valid key from https://console.groq.com/keys.",
            "citations": []
        }

    try:
        llm = ChatGroq(temperature=0.2, model_name="llama-3.3-70b-versatile", groq_api_key=settings.GROQ_API_KEY)
    except Exception as e:
        return {
            "answer": f"Error initializing AI model: {str(e)}",
            "citations": []
        }
    
    prompt = PromptTemplate.from_template("""
    You are 'AI Vaidya', an expert Ayurvedic AI assistant. 
    You must answer the user's question ONLY using the provided context from uploaded Ayurvedic texts.
    If the context does not contain the answer, politely refuse to answer and say: "Based on the uploaded Ayurvedic texts, I cannot find information regarding that."
    Never hallucinate or make up information.
    Start your answer with "Based on the uploaded Ayurvedic texts..." unless you are refusing to answer.
    The response should be in {language} language.

    Context:
    {context}

    Question: {query}
    
    Answer:
    """)
    
    chain = prompt | llm
    response = chain.invoke({"context": context, "query": query, "language": language})
    
    return {
        "answer": response.content,
        "citations": citations
    }
