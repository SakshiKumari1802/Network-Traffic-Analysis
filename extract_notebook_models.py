"""
Extract ML Models from Jupyter Notebook
This script searches for saved model objects in a Jupyter notebook
"""

import json
import base64
import os
from pathlib import Path


def extract_models_from_notebook(notebook_path):
    """
    Extract model pkl files from notebook execution outputs
    """
    print(f"Loading notebook: {notebook_path}")

    try:
        with open(notebook_path, 'r', encoding='utf-8') as f:
            notebook = json.load(f)
    except Exception as e:
        print(f"Error loading notebook: {e}")
        return False

    cells = notebook.get('cells', [])
    model_names = ['scaler', 'pca', 'iso', 'model', 'iso_forest']
    found_models = []

    print(f"\nSearching through {len(cells)} cells...\n")

    # Look for model saving code in code cells
    for i, cell in enumerate(cells):
        if cell.get('cell_type') == 'code':
            source = ''.join(cell.get('source', []))

            for model_name in model_names:
                if f'joblib.dump' in source and model_name in source:
                    print(f"📍 Found model saving code in cell {i}: {model_name}")
                    found_models.append(model_name)

                if f'pickle.dump' in source and model_name in source:
                    print(f"📍 Found pickle code in cell {i}: {model_name}")
                    found_models.append(model_name)

    print(f"\n✓ Search complete. Found references to {len(set(found_models))} models")
    print("\nModels found in notebook:")
    for model in set(found_models):
        print(f"  - {model}")

    if found_models:
        print("\n💡 Tip: To extract the actual model files:")
        print("  1. Run the notebook to completion: jupyter nbconvert --to notebook --execute khushi.ipynb")
        print("  2. The models should be saved by the notebook's joblib.dump() calls")
        print("  3. Copy .pkl files to backend/ directory")

    return len(found_models) > 0


def check_notebook_structure(notebook_path):
    """
    Analyze notebook structure and ML components
    """
    print(f"\n📊 NOTEBOOK ANALYSIS: {notebook_path}\n")

    try:
        with open(notebook_path, 'r', encoding='utf-8') as f:
            notebook = json.load(f)
    except Exception as e:
        print(f"Error: {e}")
        return

    cells = notebook.get('cells', [])
    code_cells = [c for c in cells if c.get('cell_type') == 'code']
    markdown_cells = [c for c in cells if c.get('cell_type') == 'markdown']

    print(f"Total cells: {len(cells)}")
    print(f"  - Code cells: {len(code_cells)}")
    print(f"  - Markdown cells: {len(markdown_cells)}")

    # Scan for ML components
    all_code = '\n'.join(''.join(c.get('source', [])) for c in code_cells)

    components = {
        'StandardScaler': 'StandardScaler' in all_code,
        'PCA': 'PCA' in all_code,
        'IsolationForest': 'IsolationForest' in all_code,
        'RandomForestClassifier': 'RandomForestClassifier' in all_code,
        'RandomForest': 'RandomForest' in all_code,
        'XGBoost': 'XGBoost' in all_code,
        'Model saving (joblib)': 'joblib.dump' in all_code,
        'SMOTE': 'SMOTE' in all_code,
        'LabelEncoder': 'LabelEncoder' in all_code,
    }

    print("\n🔧 ML Components:")
    for component, found in components.items():
        status = "✓" if found else "✗"
        print(f"  {status} {component}")

    # Extract first markdown cell (usually has description)
    if markdown_cells:
        first_md = ''.join(markdown_cells[0].get('source', []))
        if first_md.strip():
            print(f"\n📝 Notebook Description:\n  {first_md[:200]}...")


if __name__ == "__main__":
    import sys

    notebook_file = "c:\\Users\\LENOVO\\Downloads\\Khushi (1).ipynb"

    # Check if file exists
    if not os.path.exists(notebook_file):
        print(f"❌ Notebook not found: {notebook_file}")
        sys.exit(1)

    # Analyze notebook
    check_notebook_structure(notebook_file)

    # Try to extract models
    print("\n" + "="*60)
    print("SEARCHING FOR MODEL EXPORTS")
    print("="*60)
    extract_models_from_notebook(notebook_file)

    print("\n" + "="*60)
    print("NEXT STEPS")
    print("="*60)
    print("""
1. If models are already saved in notebook:
   - Check output/ directory or download directory
   - Copy .pkl files to backend/

2. If models need to be generated:
   - Run: python generate_models.py --data <dataset_path>
   - Or use dummy models: python generate_models.py

3. Verify models:
   - ls -lh backend/*.pkl
   """)
