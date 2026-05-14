import os
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.metadata import Document
from app.schemas.document import DocumentResponse
from app.services.pdf_service import extract_text_from_pdf, get_file_hash
from app.services.rag_service import process_and_index_document
from app.core.config import settings

router = APIRouter()

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    filepath = os.path.join(settings.UPLOAD_DIR, file.filename)
    
    with open(filepath, "wb") as f:
        f.write(await file.read())
        
    file_hash = get_file_hash(filepath)
    
    # Check if already exists
    existing = db.query(Document).filter(Document.file_hash == file_hash).first()
    if existing:
        return existing
        
    db_doc = Document(
        filename=file.filename,
        filepath=filepath,
        file_hash=file_hash,
        status="processing"
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    
    # Process in background
    background_tasks.add_task(process_pdf_background, db_doc.id, filepath, db)
    
    return db_doc

def process_pdf_background(doc_id: int, filepath: str, db: Session):
    db_doc = db.query(Document).filter(Document.id == doc_id).first()
    if not db_doc:
        return
        
    try:
        pages_data = extract_text_from_pdf(filepath)
        db_doc.num_pages = len(pages_data)
        
        # Index
        num_chunks = process_and_index_document(pages_data)
        
        db_doc.status = "indexed"
        db.commit()
    except Exception as e:
        print(f"Error processing document: {e}")
        db_doc.status = "failed"
        db.commit()

@router.get("/", response_model=list[DocumentResponse])
def get_documents(db: Session = Depends(get_db)):
    return db.query(Document).all()
