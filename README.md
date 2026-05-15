# AI VAIDYA

An Immersive AI-Powered Ayurvedic Knowledge Ecosystem.

## Features
- **Grounded RAG Pipeline**: Chat with an AI that answers ONLY from uploaded Ayurvedic texts or the local knowledge base.
- **Zero-Internet Answering**: Strictly no-internet search policy to ensure answers are derived solely from trusted Ayurvedic sources.
- **Semantic Retrieval Engine**: High-performance vector similarity search using FAISS and BGE embeddings via FastEmbed.
- **Explainable AI**: Real-time visualization of semantic confidence scores, retrieved chunks, and page-specific citations.
- **Hallucination Prevention**: Integrated confidence thresholding to prevent generating ungrounded information.
- **Web Speech API Voice Assistant**: Talk to the AI naturally with low-latency responses.
- **3D Knowledge Graph**: Interactive Force-directed graph of Ayurvedic concepts.
- **Immersive 3D Experience**: Cinematic Temple and Forest environments with particle effects and motion-blur interactions.
- **Highly Optimized Backend**: Strictly runs within 512MB RAM constraints (perfect for Render free tier) using single-threaded ONNX execution, FastEmbed, and lazy loading.

## Local Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.10+
- Groq API Key

### Backend Setup
1. `cd backend`
2. Create virtual environment: `python -m venv venv`
3. Activate virtual environment: `.\venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install dependencies: `pip install -r requirements.txt`
5. Copy `.env.example` to `.env` and add your `GROQ_API_KEY`.
6. Run the server: `uvicorn app.main:app --reload --port 8000`

### Frontend Setup
1. `cd frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

### Quick Start
You can run `start_all.ps1` from the root directory to start both backend and frontend simultaneously in separate windows.

## Deployment Guide

### Backend Deployment (Render)
The backend is highly optimized to run on **Render's Free Tier (512MB RAM)**. Thread pools are strictly limited to prevent Out-of-Memory (OOM) crashes.
1. Create a **New Web Service** on Render and connect your GitHub repository.
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `pip install -r requirements.txt`.
4. Set **Start Command** to `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
5. Add the following **Environment Variables**:
   - `GROQ_API_KEY`: Your Groq API key
   - `PYTHON_VERSION`: `3.10.0` (Recommended)
6. Click Deploy.

*(Note: Render's free tier uses ephemeral storage. Uploaded PDFs, SQLite DB, and FAISS indexes will reset on every deployment or server sleep unless you attach a persistent disk.)*

### Frontend Deployment (Vercel)
The frontend seamlessly connects to the backend and handles routing automatically.
1. Create a **New Project** on Vercel and import your GitHub repository.
2. Ensure the **Framework Preset** is set to `Next.js`.
3. Set the **Root Directory** to `frontend`.
4. Add the following **Environment Variable**:
   - `NEXT_PUBLIC_API_URL`: Your deployed Render backend URL (e.g., `https://ai-vaidya-backend.onrender.com`). Ensure there is no trailing slash.
5. Click Deploy.
