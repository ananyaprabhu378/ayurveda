from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.metadata import Document, ChatHistory, Base
import os
import sys

# Add the current directory to sys.path
sys.path.append(os.getcwd())

DATABASE_URL = "sqlite:///./vaidya.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def clear_db():
    db = SessionLocal()
    try:
        print("Clearing Document table...")
        db.query(Document).delete()
        print("Clearing ChatHistory table...")
        db.query(ChatHistory).delete()
        db.commit()
        print("Database cleared successfully.")
    except Exception as e:
        print(f"Error clearing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clear_db()
