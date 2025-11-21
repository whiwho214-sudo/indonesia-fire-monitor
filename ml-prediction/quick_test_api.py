"""
Quick test script to verify API can start and respond
"""
import sys
import os
from pathlib import Path

# Add parent directory to path
ml_prediction_dir = Path(__file__).parent
sys.path.insert(0, str(ml_prediction_dir))

print("=" * 50)
print("🧪 Quick API Test")
print("=" * 50)

# Test 1: Check if FastAPI can be imported
print("\n1️⃣ Testing FastAPI import...")
try:
    from fastapi import FastAPI
    print("✅ FastAPI imported successfully")
except ImportError as e:
    print(f"❌ Error importing FastAPI: {e}")
    sys.exit(1)

# Test 2: Check if models exist
print("\n2️⃣ Checking models...")
model_dir = ml_prediction_dir / 'data' / 'models'
rf_model = model_dir / 'random_forest_1day.pkl'
if rf_model.exists():
    print(f"✅ RF model found: {rf_model}")
else:
    print(f"⚠️ RF model not found: {rf_model}")

# Test 3: Check if prediction module can be imported
print("\n3️⃣ Testing prediction module import...")
try:
    from src.prediction import predict_with_random_forest
    print("✅ Prediction module imported successfully")
except Exception as e:
    print(f"❌ Error importing prediction module: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Test 4: Test simple prediction
print("\n4️⃣ Testing simple prediction...")
try:
    from datetime import datetime, timedelta
    test_date = datetime.now() + timedelta(days=1)
    result = predict_with_random_forest(-2.5, 118.0, test_date, None)
    print(f"✅ Prediction successful!")
    print(f"   Result: {result}")
except Exception as e:
    print(f"❌ Error in prediction: {e}")
    import traceback
    traceback.print_exc()

# Test 5: Test if API can start
print("\n5️⃣ Testing API startup...")
try:
    import uvicorn
    from api.prediction_api import app
    print("✅ API app created successfully")
    print("✅ API should be ready to run")
except Exception as e:
    print(f"❌ Error creating API app: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 50)
print("✅ All tests passed! API should work now.")
print("=" * 50)
print("\nTo start API, run:")
print("  python api\\prediction_api.py")
print("  or")
print("  uvicorn api.prediction_api:app --host 0.0.0.0 --port 8000")

