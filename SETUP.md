# Setup and Installation Guide

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- Git
- Docker (optional, for containerized deployment)

## Quick Start

### Option 0: Automated Setup (Windows - Recommended for First Time)

#### Run Backend
```bash
# Double-click or run in terminal:
setup_backend.bat
```

#### Run Frontend (in another terminal)
```bash
# Double-click or run in terminal:
setup_frontend.bat
```

This will:
1. Create virtual environment
2. Install dependencies
3. Generate ML models
4. Start the server

Then open: http://localhost:3000

---

### Option 1: Manual Setup (Recommended for Development)

#### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Note: You need to place the trained model files (.pkl) in this directory:
# - model.pkl (Classification model)
# - scaler.pkl (Feature scaler)
# - pca.pkl (PCA component)
# - iso.pkl (Isolation Forest model)
```

#### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env if needed (default API URL is http://localhost:8000)
```

#### 3. Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

---

### Option 2: Docker Setup

#### Prerequisites
- Docker
- Docker Compose

#### Running with Docker Compose

```bash
# From project root directory
docker-compose up --build
```

This will start:
- Backend on http://localhost:8000
- Frontend on http://localhost:3000

To stop:
```bash
docker-compose down
```

---

## Model Files Setup

The application requires four trained ML model files. These are automatically generated during setup or can be created manually:

### Auto-Generated Models (Testing/Development)

Model files are created automatically by the setup scripts:

```bash
# Windows:
python create_placeholder_models.py

# Linux/Mac:
python3 create_placeholder_models.py
```

This generates placeholder models suitable for:
- ✅ API testing
- ✅ Frontend development
- ✅ Architecture validation
- ✅ Learning the pipeline

### Production Models (Real Data)

For real predictions with your UNSW_NB15 dataset:

```bash
# If you have the dataset:
python generate_models.py --data /path/to/UNSW_NB15.parquet

# Or for CSV format:
python generate_models.py --data /path/to/UNSW_NB15.csv
```

### Model Files Location

All models should be in `backend/` directory:
- `model.pkl` - Classification model (RandomForest)
- `scaler.pkl` - StandardScaler for feature normalization
- `pca.pkl` - PCA model for dimensionality reduction
- `iso.pkl` - Isolation Forest for anomaly detection

Verify models are created:
```bash
ls -lh backend/*.pkl
```

---

### Generating Models from Your Notebook

If you have a trained notebook (like Khushi.ipynb), use the extraction script:

```bash
python extract_notebook_models.py
```

This will:
1. Analyze your notebook structure
2. Find trained model components
3. Show you how to export them

---

## Model Files Setup

## Testing the API

### Single Prediction Test

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "features": {
      "dur": 0.001,
      "sbytes": 200,
      "dbytes": 200,
      "sttl": 254,
      "dttl": 0,
      "sloss": 0,
      "dloss": 0,
      "service": "http",
      "sload": 800000.0,
      "dload": 800000.0,
      "spkts": 2,
      "dpkts": 0,
      "swin": 0,
      "dwin": 0,
      "stcpb": 0,
      "dtcpb": 0,
      "smeansz": 100,
      "dmeansz": 0,
      "trans_depth": 0,
      "res_bdy_len": 0,
      "sjit": 0.0,
      "djit": 0.0,
      "tcprpt": 0.0,
      "synack": 0.0,
      "ackdat": 0.0,
      "is_sm_ips_ports": 0,
      "ct_state_ttl": 0,
      "ct_flw_http_mthd": 0,
      "is_ftp_login": 0,
      "ct_ftp_cmd": 0,
      "ct_srv_src": 1,
      "ct_srv_dst": 1,
      "ct_dst_ltm": 1,
      "ct_src_ltm": 1,
      "ct_src_dport_ltm": 1,
      "ct_dst_sport_ltm": 1,
      "ct_dst_src_ltm": 1
    }
  }'
```

### Batch Prediction Test

```bash
curl -X POST "http://localhost:8000/predict-batch" \
  -F "file=@sample_data.csv"
```

### Health Check

```bash
curl http://localhost:8000/health
```

---

## Project Structure

```
network-traffic-ids/
├── backend/
│   ├── main.py                      # FastAPI application
│   ├── requirements.txt             # Python dependencies
│   ├── Dockerfile                   # Backend Docker configuration
│   ├── model.pkl                    # Classification model (add this)
│   ├── scaler.pkl                   # StandardScaler (add this)
│   ├── pca.pkl                      # PCA model (add this)
│   └── iso.pkl                      # Isolation Forest (add this)
├── frontend/
│   ├── package.json                 # Node dependencies
│   ├── postcss.config.js            # PostCSS configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── Dockerfile                   # Frontend Docker configuration
│   ├── public/
│   │   └── index.html               # HTML entry point
│   └── src/
│       ├── App.js                   # Main React component
│       ├── index.js                 # React entry point
│       ├── index.css                # Global styles
│       └── components/
│           ├── Dashboard.js         # Dashboard component
│           ├── PredictionForm.js    # Single prediction form
│           └── BatchUpload.js       # CSV upload component
├── .gitignore                       # Git ignore rules
├── docker-compose.yml               # Docker Compose configuration
├── SETUP.md                         # This file
└── sample_data.csv                  # Sample CSV for testing
```

---

## Troubleshooting

### Backend won't start
- Ensure Python 3.8+ is installed
- Check virtual environment is activated
- Verify all dependencies are installed: `pip install -r requirements.txt`
- Check that model files exist in the backend directory

### Frontend won't connect to backend
- Ensure backend is running on http://localhost:8000
- Check CORS is enabled (it is by default in main.py)
- Check the REACT_APP_API_URL environment variable
- Open browser console for error messages

### Models not loaded
- Ensure .pkl files are in the backend directory
- Check backend logs for loading errors
- Verify file permissions

### Port already in use
- Backend: Change port in uvicorn command: `--port 8001`
- Frontend: Set PORT environment variable: `PORT=3001 npm start`

---

## Performance Notes

- The ML pipeline includes PCA which reduces dimensionality from 43 to ~20 features
- Isolation Forest provides unsupervised anomaly detection
- Classification model identifies specific attack types
- Expected inference time: < 100ms per prediction
- Batch processing handles large CSV files efficiently

---

## Next Steps

1. Add trained ML models as described above
2. Test the API using provided curl examples
3. Customize feature fields if needed
4. Deploy using Docker Compose for production
5. Monitor API logs for performance insights

For questions or issues, check the API documentation at http://localhost:8000/docs
