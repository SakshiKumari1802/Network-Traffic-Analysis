@echo off
REM Network Traffic IDS - Frontend Setup (Windows)

setlocal enabledelayedexpansion

cls
echo ==================================================
echo NETWORK TRAFFIC IDS - FRONTEND SETUP (Windows)
echo ==================================================

REM Navigate to frontend
cd frontend

REM Install dependencies
echo.
echo [1/3] Installing dependencies...
call npm install

REM Create .env file if it doesn't exist
echo [2/3] Creating environment file...
if not exist ".env" (
    echo REACT_APP_API_URL=http://localhost:8000 > .env
    echo Created .env file
) else (
    echo .env already exists
)

REM Start development server
echo [3/3] Starting React development server...
echo.
echo Frontend will be available at: http://localhost:3000
echo Make sure the backend is running on port 8000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start

pause
