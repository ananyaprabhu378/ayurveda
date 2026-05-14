Start-Process powershell -ArgumentList "-NoExit -Command `"cd backend; .\venv\Scripts\activate; uvicorn app.main:app --reload --port 8000`""
Start-Process powershell -ArgumentList "-NoExit -Command `"cd frontend; npm run dev`""
Write-Host "AI Vaidya services started in separate windows." -ForegroundColor Green
