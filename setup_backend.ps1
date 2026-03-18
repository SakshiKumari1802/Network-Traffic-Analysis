# Network Traffic IDS - Backend Setup (PowerShell)
# Run: .\setup_backend.ps1

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Network Traffic IDS - Backend" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan

# Go to backend directory
Push-Location backend

try {
    # Remove old venv
    if (Test-Path "venv") {
        Write-Host "Cleaning old environment..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force venv -ErrorAction SilentlyContinue
    }

    # Create venv
    Write-Host "Creating Python environment..." -ForegroundColor Cyan
    python -m venv venv

    # Activate
    Write-Host "Activating environment..." -ForegroundColor Cyan
    & "venv\Scripts\Activate.ps1"

    # Install deps
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    pip install -q --upgrade pip
    pip install -q -r requirements.txt

    Write-Host "`nSetup complete!" -ForegroundColor Green
    Write-Host "Starting server on http://localhost:8000..." -ForegroundColor Cyan
    Write-Host ""

    # Start server
    python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
}
finally {
    Pop-Location
}
