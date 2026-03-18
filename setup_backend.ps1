# Network Traffic IDS - Quick Setup (PowerShell)
# Run this in PowerShell from the project directory

Write-Host "=================================================="
Write-Host "Network Traffic IDS - Backend Setup" -ForegroundColor Green
Write-Host "=================================================="

# Navigate to backend
cd backend

# Remove old venv if it exists
if (Test-Path "venv") {
    Write-Host "Removing old virtual environment..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force venv
}

# Create new venv
Write-Host "`nCreating new virtual environment..." -ForegroundColor Cyan
python -m venv venv

# Activate venv
Write-Host "Activating virtual environment..." -ForegroundColor Cyan
& "venv\Scripts\Activate.ps1"

# Upgrade pip
Write-Host "Upgrading pip..." -ForegroundColor Cyan
python -m pip install --quiet --upgrade pip setuptools wheel

# Install requirements
Write-Host "Installing dependencies (this may take 1-2 minutes)..." -ForegroundColor Cyan
pip install --quiet -r requirements.txt

Write-Host "`nDependencies installed successfully!" -ForegroundColor Green

# Start server
Write-Host "`n=================================================="
Write-Host "Starting FastAPI Server" -ForegroundColor Green
Write-Host "=================================================="
Write-Host "API will be available at: http://localhost:8000" -ForegroundColor Yellow
Write-Host "API Documentation: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
