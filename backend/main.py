from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
from io import StringIO
import os

app = FastAPI(
    title="Network Traffic Anomaly Detection",
    description="Real-time network traffic anomaly and attack detection using ML",
    version="1.0.0"
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model paths
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(MODEL_DIR, "model.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")
PCA_PATH = os.path.join(MODEL_DIR, "pca.pkl")
ISO_PATH = os.path.join(MODEL_DIR, "iso.pkl")

# Global model variables
model = None
scaler = None
pca = None
iso_forest = None

# Feature names and expected order
FEATURE_NAMES = [
    'dur', 'sbytes', 'dbytes', 'sttl', 'dttl', 'sloss', 'dloss', 'service',
    'sload', 'dload', 'spkts', 'dpkts', 'swin', 'dwin', 'stcpb', 'dtcpb',
    'smeansz', 'dmeansz', 'trans_depth', 'res_bdy_len', 'sjit', 'djit',
    'tcprtt', 'synack', 'ackdat', 'is_sm_ips_ports', 'ct_state_ttl',
    'ct_flw_http_mthd', 'is_ftp_login', 'ct_ftp_cmd', 'ct_srv_src',
    'ct_srv_dst', 'ct_dst_ltm', 'ct_src_ltm', 'ct_src_dport_ltm',
    'ct_dst_sport_ltm', 'ct_dst_src_ltm'
]

ATTACK_TYPES = [
    'Normal', 'Generic', 'Exploits', 'Fuzzers', 'Backdoors',
    'Analysis', 'DoS', 'Reconnaissance', 'Shellcode', 'Worms'
]

def load_models():
    """Load all ML models from pickle files."""
    global model, scaler, pca, iso_forest
    try:
        if os.path.exists(MODEL_PATH):
            model = joblib.load(MODEL_PATH)
        if os.path.exists(SCALER_PATH):
            scaler = joblib.load(SCALER_PATH)
        if os.path.exists(PCA_PATH):
            pca = joblib.load(PCA_PATH)
        if os.path.exists(ISO_PATH):
            iso_forest = joblib.load(ISO_PATH)
    except Exception as e:
        print(f"Warning: Could not load models: {e}")

@app.on_event("startup")
async def startup_event():
    """Load models on startup."""
    load_models()

class PredictionRequest(BaseModel):
    """Request body for single prediction."""
    features: dict

class PredictionResponse(BaseModel):
    """Response body for single prediction."""
    anomaly: int
    attack_type: str
    confidence: float

class BatchPredictionResponse(BaseModel):
    """Response body for batch prediction."""
    predictions: list
    summary: dict

def prepare_features(features_dict: dict) -> np.ndarray:
    """
    Prepare features from dictionary to numpy array.
    Handles categorical features (service) by encoding.
    """
    features_array = []

    for feature_name in FEATURE_NAMES:
        if feature_name not in features_dict:
            raise ValueError(f"Missing feature: {feature_name}")

        value = features_dict[feature_name]

        # Handle service encoding (categorical)
        if feature_name == 'service':
            services = ['http', 'ftp', 'ssh', 'dns', 'smtp', 'ssl', 'other']
            try:
                features_array.append(float(services.index(str(value))))
            except ValueError:
                features_array.append(float(len(services)))  # unknown service
        else:
            features_array.append(float(value))

    return np.array(features_array).reshape(1, -1)

def make_prediction(features_array: np.ndarray) -> tuple:
    """
    Make prediction using the ML pipeline.
    Returns (anomaly, attack_type, confidence)
    """
    try:
        # Check if models are loaded
        if scaler is None or pca is None or iso_forest is None or model is None:
            raise RuntimeError("Models not loaded. Please ensure model files exist.")

        # Preprocessing: Scale features
        scaled_features = scaler.transform(features_array)

        # Dimensionality reduction: Apply PCA
        pca_features = pca.transform(scaled_features)

        # Anomaly detection: Isolation Forest
        anomaly_score = iso_forest.score_samples(pca_features)[0]
        anomaly = 1 if anomaly_score < -0.5 else 0  # Threshold for anomaly

        # Classification: Predict attack type
        probabilities = model.predict_proba(pca_features)[0]
        attack_idx = np.argmax(probabilities)
        confidence = float(probabilities[attack_idx])
        attack_type = ATTACK_TYPES[attack_idx]

        return anomaly, attack_type, confidence

    except Exception as e:
        raise RuntimeError(f"Prediction failed: {str(e)}")

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "Network Traffic Anomaly Detection API",
        "version": "1.0.0",
        "endpoints": {
            "single_prediction": "/predict",
            "batch_prediction": "/predict-batch",
            "documentation": "/docs"
        }
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Single prediction endpoint.
    Takes network traffic features and returns anomaly status and attack type.
    """
    try:
        features_array = prepare_features(request.features)
        anomaly, attack_type, confidence = make_prediction(features_array)

        return PredictionResponse(
            anomaly=anomaly,
            attack_type=attack_type,
            confidence=confidence
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@app.post("/predict-batch", response_model=BatchPredictionResponse)
async def predict_batch(file: UploadFile = File(...)):
    """
    Batch prediction endpoint.
    Accepts CSV file with network traffic data and returns predictions for all rows.
    """
    try:
        # Read CSV file
        contents = await file.read()
        df = pd.read_csv(StringIO(contents.decode('utf-8')))

        predictions = []

        # Make predictions for each row
        for idx, row in df.iterrows():
            try:
                features_dict = row.to_dict()
                features_array = prepare_features(features_dict)
                anomaly, attack_type, confidence = make_prediction(features_array)

                predictions.append({
                    "row": idx,
                    "anomaly": anomaly,
                    "attack_type": attack_type,
                    "confidence": confidence
                })
            except Exception as e:
                predictions.append({
                    "row": idx,
                    "anomaly": -1,
                    "attack_type": "Error",
                    "confidence": 0.0,
                    "error": str(e)
                })

        # Calculate summary
        anomalies = sum(1 for p in predictions if p.get("anomaly") == 1)
        normal = sum(1 for p in predictions if p.get("anomaly") == 0)

        return BatchPredictionResponse(
            predictions=predictions,
            summary={
                "total": len(predictions),
                "anomalies": anomalies,
                "normal": normal
            }
        )

    except pd.errors.ParserError as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV format: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    models_loaded = all([model is not None, scaler is not None, pca is not None, iso_forest is not None])

    return {
        "status": "healthy" if models_loaded else "degraded",
        "models_loaded": models_loaded
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
