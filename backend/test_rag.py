import os
import sys

# Add the current directory to sys.path to import app
sys.path.append(os.path.join(os.getcwd(), "app"))
# Also add backend directory
sys.path.append(os.getcwd())

from app.services.rag_service import query_rag
from app.core.config import settings

def test():
    print(f"FAISS_INDEX_DIR: {settings.FAISS_INDEX_DIR}")
    print(f"GROQ_API_KEY: {settings.GROQ_API_KEY}")
    
    query = "What is Ayurveda?"
    try:
        print(f"Querying: {query}")
        result = query_rag(query)
        print("Result:")
        print(result["answer"])
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test()
