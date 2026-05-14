from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI VAIDYA API"
    GROQ_API_KEY: str = ""
    DATABASE_URL: str = "sqlite:///./vaidya.db"
    UPLOAD_DIR: str = "uploads"
    FAISS_INDEX_DIR: str = "faiss_index"

    class Config:
        env_file = ".env"

settings = Settings()
