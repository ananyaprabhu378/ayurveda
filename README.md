# AI VAIDYA

An Immersive AI-Powered Ayurvedic Knowledge Ecosystem.

## Features
- **Upload Ayurvedic PDF Texts**: Built-in RAG pipeline using PyMuPDF and FAISS.
- **Intelligent RAG Chat**: Chat with an AI that answers ONLY from your uploaded texts, providing exact page citations.
- **Web Speech API Voice Assistant**: Talk to the AI naturally.
- **3D Knowledge Graph**: Interactive Force-directed graph of Ayurvedic concepts.
- **Multilingual**: Switch between English, Hindi, Kannada, and Sanskrit.
- **Stunning UI**: Custom "Mystical Ayurveda Forest" theme using Framer Motion, React Three Fiber, and Tailwind.

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
