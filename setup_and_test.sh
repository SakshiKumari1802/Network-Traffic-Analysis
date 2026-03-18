#!/bin/bash

echo "=================================================="
echo "NETWORK TRAFFIC IDS - SETUP & TEST"
echo "=================================================="

# Navigate to backend
cd backend

# Create virtual environment
echo -e "\n[1/5] Creating virtual environment..."
python -m venv venv

# Activate virtual environment
echo "[2/5] Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install dependencies
echo "[3/5] Installing dependencies..."
pip install -q -r requirements.txt

# Generate models
echo "[4/5] Generating ML models..."
cd ..
python create_placeholder_models.py
cd backend

# Test API
echo "[5/5] Starting FastAPI server..."
echo "API will be available at: http://localhost:8000"
echo "Documentation at: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

uvicorn main:app --reload --host 0.0.0.0 --port 8000

