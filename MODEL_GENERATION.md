# Model Generation Guide

## Overview

The ML pipeline in your `Khushi (1).ipynb` notebook contains:
- ✅ StandardScaler for feature preprocessing
- ✅ PCA for dimensionality reduction
- ✅ IsolationForest for anomaly detection
- ✅ RandomForest + XGBoost for attack classification

You need to **extract the trained models** and save them as `.pkl` files for the backend.

## Option 1: Generate Models from Your Data (Recommended)

If you have the UNSW_NB15 dataset:

```bash
# From the project root directory
python generate_models.py --data /path/to/UNSW_NB15_dataset.parquet
```

Or if your data is in CSV format:
```bash
python generate_models.py --data /path/to/UNSW_NB15_dataset.csv
```

This will:
1. Load and preprocess the data
2. Train all 5 models (StandardScaler, PCA, IsolationForest, RandomForest, XGBoost)
3. Save them to `backend/` directory as `.pkl` files

## Option 2: Extract Models from Notebook Execution

If the notebook has already been run and models are saved:

```bash
# 1. Check if model variables exist in notebook cells
jupyter nbconvert --to notebook --execute "Khushi (1).ipynb"

# 2. Extract model objects from notebook outputs
python extract_notebook_models.py
```

## Option 3: Quick Testing (Dummy Models)

For testing the API without real data:

```bash
python generate_models.py
```

This generates placeholder models that:
- ✓ Pass API validation
- ✓ Allow you to test endpoints
- ⚠️ Won't provide real predictions

## Expected Output

After running any option, you should have:

```
backend/
├── scaler.pkl           (StandardScaler model)
├── pca.pkl              (PCA dimensionality reduction)
├── iso.pkl              (Isolation Forest anomaly detector)
└── model.pkl            (RandomForest classifier)
```

## Verify Models

```bash
# Check if models were created
ls -lh backend/*.pkl

# Test if models load correctly
python -c "
import joblib
for model in ['scaler', 'pca', 'iso', 'model']:
    try:
        m = joblib.load(f'backend/{model}.pkl')
        print(f'✓ {model}.pkl loaded successfully')
    except Exception as e:
        print(f'✗ {model}.pkl failed: {e}')
"
```

## Running the Backend

Once models are saved:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Test the API:
```bash
curl http://localhost:8000/health
```

## Next Steps

1. Choose an option above to generate models
2. Verify models are created in `backend/` directory
3. Run backend with `uvicorn main:app --reload`
4. Start frontend with `npm start`
5. Test at http://localhost:3000

## Troubleshooting

**"Models not loading":**
- Check file permissions: `chmod +x backend/*.pkl`
- Verify model file sizes: `ls -lh backend/`
- Check Python version matches (use 3.8+)

**"UNSW dataset not found":**
- Download from: https://www.unsw.adfa.edu.au/unsw-canberra-cyber/cybersecurity-datasets/
- Place in project root or provide path to `generate_models.py`

**"XGBoost import error":**
- Install: `pip install xgboost`
- Then regenerate models

---

For issues or questions, check `generate_models.py` comments or review the notebook cells for reference.
