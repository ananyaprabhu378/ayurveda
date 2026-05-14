from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class DocumentBase(BaseModel):
    filename: str

class DocumentCreate(DocumentBase):
    pass

class DocumentResponse(DocumentBase):
    id: int
    uploaded_at: datetime
    status: str
    num_pages: int

    model_config = ConfigDict(from_attributes=True)

class ChatQuery(BaseModel):
    session_id: str
    query: str
    language: Optional[str] = "en"

class Citation(BaseModel):
    source: str
    page: int
    snippet: str
    score: float

class ChatResponse(BaseModel):
    answer: str
    citations: List[Citation]
    language: str
