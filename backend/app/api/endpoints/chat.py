from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.metadata import ChatHistory
from app.schemas.document import ChatQuery, ChatResponse
from app.services.rag_service import query_rag

router = APIRouter()

@router.post("/", response_model=ChatResponse)
def chat_with_vaidya(query: ChatQuery, db: Session = Depends(get_db)):
    # Fetch recent history for context BEFORE saving the new query
    history_records = db.query(ChatHistory).filter(ChatHistory.session_id == query.session_id).order_by(ChatHistory.created_at.desc()).limit(4).all()
    history_records.reverse() # Put in chronological order
    history_list = [{"role": msg.role, "content": msg.content} for msg in history_records]

    # Save User Query
    user_msg = ChatHistory(
        session_id=query.session_id,
        role="user",
        content=query.query,
        user_id=query.user_id
    )
    db.add(user_msg)
    db.commit()
    
    # RAG
    try:
        response_data = query_rag(query.query, language=query.language, history=history_list)
    except Exception as e:
        print(f"Chat API Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"The ancient link is shaky: {str(e)}")
        
    # Save Assistant Response
    assistant_msg = ChatHistory(
        session_id=query.session_id,
        role="assistant",
        content=response_data["answer"],
        user_id=query.user_id
    )
    db.add(assistant_msg)
    db.commit()

    
    return ChatResponse(
        answer=response_data["answer"],
        citations=response_data["citations"],
        language=query.language or "en",
        retrieval_metadata=response_data.get("retrieval_metadata")
    )

@router.get("/history/{session_id}")
def get_chat_history(session_id: str, db: Session = Depends(get_db)):
    return db.query(ChatHistory).filter(ChatHistory.session_id == session_id).order_by(ChatHistory.created_at.asc()).all()
