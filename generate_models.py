"""
Model Generation Script
Trains and saves ML models matching the pipeline from Khushi notebook
"""

import pickle
import joblib
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.decomposition import PCA
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE
import warnings
import os
warnings.filterwarnings('ignore')

# ============================================================================
# OPTION 1: If you have the original dataset (UNSW_NB15)
# ============================================================================

def generate_models_from_data(data_path):
    """
    Generate and save model files from UNSW_NB15 dataset

    Args:
        data_path: Path to UNSW_NB15 parquet file
    """
    print("Loading dataset...")
    try:
        df = pd.read_parquet(data_path)
    except:
        df = pd.read_csv(data_path)

    print(f"Dataset shape: {df.shape}")

    # Data preprocessing (as per notebook)
    print("\nPreprocessing data...")

    # Encode categorical features
    categorical_cols = ['proto', 'service', 'state']
    df_encoded = pd.get_dummies(df, columns=categorical_cols, drop_first=True)

    # Prepare features and target
    X = df_encoded.drop(['attack_cat', 'label'], axis=1, errors='ignore')
    y = df_encoded.get('label', df_encoded.get('attack_cat'))

    # Handle class imbalance with SMOTE
    print("Applying SMOTE for class balance...")
    smote = SMOTE(random_state=42)
    X_resampled, y_resampled = smote.fit_resample(X, y)

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_resampled, y_resampled, test_size=0.2, random_state=42
    )

    # === Train Models ===
    print("\n" + "="*60)
    print("TRAINING MODELS")
    print("="*60)

    # 1. StandardScaler
    print("\n1️⃣  Training StandardScaler...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    print("   ✓ StandardScaler trained")

    # 2. PCA
    print("2️⃣  Training PCA (95% variance)...")
    pca = PCA(n_components=0.95)
    X_train_pca = pca.fit_transform(X_train_scaled)
    X_test_pca = pca.transform(X_test_scaled)
    print(f"   ✓ PCA trained (reduced to {pca.n_components_} components)")

    # 3. Isolation Forest (for anomaly detection)
    print("3️⃣  Training Isolation Forest...")
    iso_forest = IsolationForest(contamination=0.1, random_state=42)
    iso_forest.fit(X_train_pca)
    print("   ✓ Isolation Forest trained")

    # 4. RandomForest Classifier
    print("4️⃣  Training RandomForest Classifier...")
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    rf_model.fit(X_train_pca, y_train)
    rf_score = rf_model.score(X_test_pca, y_test)
    print(f"   ✓ RandomForest trained (accuracy: {rf_score:.4f})")

    # 5. XGBoost Classifier
    print("5️⃣  Training XGBoost Classifier...")
    xgb_model = XGBClassifier(
        n_estimators=100,
        random_state=42,
        use_label_encoder=False,
        eval_metric='mlogloss'
    )
    xgb_model.fit(X_train_pca, y_train)
    xgb_score = xgb_model.score(X_test_pca, y_test)
    print(f"   ✓ XGBoost trained (accuracy: {xgb_score:.4f})")

    # === Save Models ===
    print("\n" + "="*60)
    print("SAVING MODELS")
    print("="*60)

    model_files = {
        'scaler.pkl': scaler,
        'pca.pkl': pca,
        'iso.pkl': iso_forest,
        'model.pkl': rf_model,  # Using RandomForest as primary model
    }

    for filename, model in model_files.items():
        filepath = f'backend/{filename}'
        joblib.dump(model, filepath)
        print(f"✓ Saved {filepath}")

    print("\n" + "="*60)
    print("✅ ALL MODELS SAVED SUCCESSFULLY!")
    print("="*60)
    print("\nModel files ready for backend:")
    print("  - backend/scaler.pkl")
    print("  - backend/pca.pkl")
    print("  - backend/iso.pkl")
    print("  - backend/model.pkl")


# ============================================================================
# OPTION 2: Create dummy models for testing (if you don't have the data)
# ============================================================================

def generate_dummy_models():
    """
    Generate dummy/placeholder models for testing
    These won't work for real predictions but are good for API testing
    """
    print("Generating dummy models for testing...")

    # Create dummy training data
    n_features = 37
    X_dummy = np.random.randn(1000, n_features)
    y_dummy = np.random.randint(0, 10, 1000)  # 10 attack types

    # 1. StandardScaler
    print("1️⃣  Creating StandardScaler...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_dummy)

    # 2. PCA
    print("2️⃣  Creating PCA...")
    pca = PCA(n_components=20)
    X_pca = pca.fit_transform(X_scaled)

    # 3. Isolation Forest
    print("3️⃣  Creating Isolation Forest...")
    iso_forest = IsolationForest(random_state=42)
    iso_forest.fit(X_pca)

    # 4. RandomForest
    print("4️⃣  Creating RandomForest Classifier...")
    model = RandomForestClassifier(n_estimators=10, random_state=42)
    model.fit(X_pca, y_dummy)

    # Save all models
    print("\n✓ Saving dummy models...")
    joblib.dump(scaler, 'backend/scaler.pkl')
    joblib.dump(pca, 'backend/pca.pkl')
    joblib.dump(iso_forest, 'backend/iso.pkl')
    joblib.dump(model, 'backend/model.pkl')

    print("\n✅ Dummy models created successfully!")
    print("⚠️  Note: These are placeholder models for testing only.")
    print("      Use real training data for production models.")


if __name__ == "__main__":
    import sys
    import os

    print("\n" + "="*60)
    print("MODEL GENERATION UTILITY")
    print("="*60)

    # Ensure backend directory exists
    os.makedirs('backend', exist_ok=True)

    if len(sys.argv) > 1 and sys.argv[1] == '--data':
        # Use data path if provided
        data_path = sys.argv[2] if len(sys.argv) > 2 else '/content/UNSW_NB15_testing-set.parquet'
        generate_models_from_data(data_path)
    else:
        # Generate working models for testing and development
        print("\nNo dataset provided. Generating sample models...")
        print("For production, use: python generate_models.py --data <dataset_path>")
        generate_dummy_models()
