@echo off
REM Network Traffic IDS - Setup & Test (Windows)

setlocal enabledelayedexpansion

cls
echo ==================================================
echo NETWORK TRAFFIC IDS - SETUP ^& TEST (Windows)
echo ==================================================

REM Navigate to backend
cd backend

REM Create virtual environment
echo.
echo [1/5] Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo [2/5] Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo [3/5] Installing dependencies...
pip install -q -r requirements.txt

REM Generate models
echo [4/5] Generating ML models...
cd ..
python create_placeholder_models.py
cd backend

REM Test API
echo [5/5] Starting FastAPI server...
echo.
echo API will be available at: http://localhost:8000
echo Documentation at: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

uvicorn main:app --reload --host 0.0.0.0 --port 8000

pause
