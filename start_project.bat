@echo off
echo Starting HospIntel Platform...

echo 1. Starting Python Backend Server...
start cmd /k "cd HospitalIQ\backend && .\venv\Scripts\activate && uvicorn app.main:app --reload"

echo 2. Starting React Frontend Server...
start cmd /k "cd HospitalIQ\frontend && node node_modules\vite\bin\vite.js"

echo Both servers are starting up! 
echo The frontend will be available at http://localhost:5173
echo You can close this window.
