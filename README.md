# AI VAIDYA

An Immersive AI-Powered Ayurvedic Knowledge Ecosystem.

## Features
- **Grounded RAG Pipeline**: Chat with an AI that answers ONLY from uploaded Ayurvedic texts or the local knowledge base.
- **Zero-Internet Answering**: Strictly no-internet search policy to ensure answers are derived solely from trusted Ayurvedic sources.
- **Semantic Retrieval Engine**: High-performance vector similarity search using FAISS and BGE embeddings.
- **Explainable AI**: Real-time visualization of semantic confidence scores, retrieved chunks, and page-specific citations.
- **Hallucination Prevention**: Integrated confidence thresholding to prevent generating ungrounded information.
- **Web Speech API Voice Assistant**: Talk to the AI naturally with low-latency responses.
- **3D Knowledge Graph**: Interactive Force-directed graph of Ayurvedic concepts.
- **Immersive 3D Experience**: Cinematic Temple and Forest environments with particle effects and motion-blur interactions.

## Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.10+
- Groq API Key

### Backend Setup
1. `cd backend`
2. Create virtual environment: `python -m venv venv`
3. Activate virtual environment: `.\venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install dependencies: `pip install -r requirements.txt`
5. Copy `.env.example` to `.env` and add your Groq API Key.
6. Run the server: `uvicorn app.main:app --reload --port 8000`

### Frontend Setup
1. `cd frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

### Quick Start
You can run `start_all.ps1` from the root directory to start both backend and frontend simultaneously.
