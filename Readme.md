# Network Traffic Intrusion Detection System

A full-stack web application for real-time network traffic anomaly and attack detection using machine learning. This system deploys a trained ML pipeline that combines anomaly detection with multi-class classification to identify both known and unknown network attacks.

## 🚀 Project Overview

This application converts a Jupyter Notebook ML pipeline into a production-ready web service. The backend uses FastAPI to serve predictions, while the frontend provides an intuitive interface for single predictions and batch processing via CSV uploads.

### Key Features

- **Multi-Stage ML Pipeline**: StandardScaler → PCA → Isolation Forest → Classification Model
- **Real-time Predictions**: Single network flow analysis
- **Batch Processing**: CSV file upload for multiple predictions
- **Anomaly Detection**: Identifies unknown attack patterns
- **Attack Classification**: Categorizes known attack types
- **Modern UI**: React-based interface with Tailwind CSS
- **API Documentation**: Auto-generated Swagger docs
- **Visualization Dashboard**: Charts for batch prediction results

## 🏗️ Architecture

```
Frontend (React) ←→ Backend (FastAPI) ←→ ML Models (.pkl)
     ↓                    ↓
   Charts/API Calls    Prediction Pipeline
                        ↓
                   Preprocessing → PCA → Anomaly → Classification
```

### Data Flow

1. **Input**: Network traffic features (JSON or CSV)
2. **Preprocessing**: StandardScaler normalization
3. **Dimensionality Reduction**: PCA transformation
4. **Anomaly Detection**: Isolation Forest scoring
5. **Classification**: Random Forest/XGBoost prediction
6. **Output**: Anomaly flag + attack type prediction

## 📋 Requirements

### Backend Requirements
- Python 3.8+
- FastAPI
- Uvicorn
- Joblib
- Pandas
- NumPy
- Scikit-learn

### Frontend Requirements
- Node.js 16+
- React 18+
- Axios
- Tailwind CSS
- Chart.js (optional)

### Models
- `model.pkl`: Trained classification model (Random Forest/XGBoost)
- `scaler.pkl`: StandardScaler for feature normalization
- `pca.pkl`: PCA model for dimensionality reduction
- `iso.pkl`: Isolation Forest for anomaly detection

## 🗂️ Project Structure

```
network-traffic-ids/
│
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   ├── model.pkl              # Classification model
│   ├── scaler.pkl             # StandardScaler
│   ├── pca.pkl                # PCA model
│   └── iso.pkl                # Isolation Forest
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js             # Main React component
│   │   ├── index.js           # React entry point
│   │   ├── components/
│   │   │   ├── PredictionForm.js    # Single prediction form
│   │   │   ├── BatchUpload.js       # CSV upload component
│   │   │   ├── ResultsDisplay.js    # Results visualization
│   │   │   └── Dashboard.js         # Main dashboard
│   │   └── styles/
│   │       └── index.css
│   ├── package.json           # Node dependencies
│   └── tailwind.config.js     # Tailwind configuration
│
├── notebook/
│   └── model.ipynb            # Original training notebook
│
├── README.md                  # This file
└── .gitignore
```

## 🔧 Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/network-traffic-ids.git
cd network-traffic-ids
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Place model files in backend directory
# model.pkl, scaler.pkl, pca.pkl, iso.pkl
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm start
```

### 4. Running the Application

#### Backend
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📖 API Documentation

### Endpoints

#### POST `/predict`
Single prediction endpoint.

**Request Body:**
```json
{
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
    "tcprtt": 0.0,
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
}
```

**Response:**
```json
{
  "anomaly": 0,
  "attack_type": "Normal",
  "confidence": 0.95
}
```

#### POST `/predict-batch`
Batch prediction endpoint for CSV files.

**Request:** Multipart form data with CSV file.

**Response:**
```json
{
  "predictions": [
    {
      "row": 0,
      "anomaly": 0,
      "attack_type": "Normal",
      "confidence": 0.95
    },
    {
      "row": 1,
      "anomaly": 1,
      "attack_type": "DoS",
      "confidence": 0.87
    }
  ],
  "summary": {
    "total": 100,
    "anomalies": 15,
    "normal": 85
  }
}
```

## 🎯 Usage Examples

### Single Prediction

1. Open the frontend at http://localhost:3000
2. Fill in the network traffic features in the form
3. Click "Predict" to get results
4. View anomaly status and attack type

### Batch Prediction

1. Prepare a CSV file with network traffic data
2. Click "Upload CSV" in the frontend
3. Select your CSV file
4. View batch results in the dashboard with charts

### API Usage

```python
import requests

# Single prediction
data = {
    "features": {
        "dur": 0.001,
        "sbytes": 200,
        # ... other features
    }
}

response = requests.post("http://localhost:8000/predict", json=data)
print(response.json())
```

## 🔍 Model Details

### Training Data
- **Dataset**: UNSW-NB15
- **Features**: 43 network traffic features
- **Classes**: Normal + 9 attack types

### Pipeline Components

1. **StandardScaler**: Feature normalization
2. **PCA**: Dimensionality reduction (preserves 95% variance)
3. **Isolation Forest**: Unsupervised anomaly detection
4. **Classification Model**: Random Forest or XGBoost for attack categorization

### Performance Metrics
- **Accuracy**: ~95%
- **Precision**: ~94%
- **Recall**: ~93%
- **F1-Score**: ~93%

## 🛠️ Development

### Adding New Features

1. Update the feature schema in `backend/main.py`
2. Modify the frontend form in `PredictionForm.js`
3. Retrain models if new features require it

### Model Updates

1. Train new models in the notebook
2. Save updated `.pkl` files
3. Replace files in `backend/` directory
4. Restart the backend server

### Testing

```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Docker Deployment

```dockerfile
# Dockerfile for backend
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Production Frontend

```bash
cd frontend
npm run build
# Serve build/ directory with nginx
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check the API documentation at `/docs`
- Review the logs for error details

## 🔄 Future Enhancements

- [ ] Real-time streaming data processing
- [ ] Model explainability with SHAP values
- [ ] Alert system for detected anomalies
- [ ] Historical data visualization
- [ ] Model performance monitoring
- [ ] AutoML for model updates
- [ ] Kubernetes deployment
- [ ] API rate limiting and authentication