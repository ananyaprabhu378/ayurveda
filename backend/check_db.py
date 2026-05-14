from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.metadata import Document, Base
import os
import sys

# Add the current directory to sys.path
sys.path.append(os.getcwd())

DATABASE_URL = "sqlite:///./vaidya.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def check_docs():
    db = SessionLocal()
    docs = db.query(Document).all()
    print(f"Total documents: {len(docs)}")
    for doc in docs:
        print(f"ID: {doc.id}, Name: {doc.filename}, Status: {doc.status}, Pages: {doc.num_pages}")
    db.close()

if __name__ == "__main__":
    check_docs()
