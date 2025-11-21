#!/usr/bin/env python3
"""
Script untuk evaluate model accuracy dengan data real
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
import sys

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from prediction import load_random_forest_model, predict_with_random_forest
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

def evaluate_model_with_actual_data(days_back=7, model_dir='data/models'):
    """
    Evaluate model dengan membandingkan prediksi dengan actual hotspots
    
    Args:
        days_back: Berapa hari ke belakang untuk evaluate (default: 7 hari)
        model_dir: Model directory
    """
    print(f"\n📊 Evaluating Model dengan Actual Data ({days_back} hari terakhir)")
    print("=" * 60)
    
    # Load model
    print("\n📦 Loading model...")
    try:
        rf_model, rf_scaler, rf_metadata = load_random_forest_model(model_dir)
        print(f"✅ Model loaded: {rf_metadata.get('accuracy', 'N/A')}")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return None
    
    # Load actual hotspots
    hotspots_file = 'data/raw/hotspots.csv'
    if not os.path.exists(hotspots_file):
        print(f"\n❌ Hotspots file not found: {hotspots_file}")
        print("   Please collect data first: python train_models.py --collect-data --days 30")
        return None
    
    print("\n📂 Loading actual hotspots...")
    df = pd.read_csv(hotspots_file)
    df['acq_date'] = pd.to_datetime(df['acq_date'], errors='coerce')
    
    # Filter untuk hari terakhir
    cutoff_date = datetime.now() - timedelta(days=days_back)
    recent_df = df[df['acq_date'] >= cutoff_date].copy()
    
    if len(recent_df) == 0:
        print(f"\n⚠️ No actual hotspots found in last {days_back} days")
        return None
    
    print(f"✅ Found {len(recent_df)} actual hotspots in last {days_back} days")
    
    # Generate predictions untuk actual hotspot locations
    print("\n🔮 Generating predictions...")
    predictions = []
    actuals = []
    
    for idx, row in recent_df.iterrows():
        lat = row['latitude']
        lon = row['longitude']
        acq_date = row['acq_date']
        
        # Predict untuk tanggal sebelum actual hotspot (to simulate real prediction)
        pred_date = acq_date - timedelta(days=1)
        
        try:
            pred_result = predict_with_random_forest(lat, lon, pred_date, None, model_dir)
            prob = pred_result.get('probability', 0)
            
            predictions.append(prob)
            actuals.append(1)  # Actual hotspot = 1
            
        except Exception as e:
            print(f"⚠️ Error predicting for ({lat}, {lon}): {e}")
            predictions.append(0)
            actuals.append(1)
    
    predictions = np.array(predictions)
    actuals = np.array(actuals)
    
    # Convert probabilities to binary predictions
    # Use threshold 0.3 for positive prediction
    pred_binary = (predictions >= 0.3).astype(int)
    
    # Calculate metrics
    accuracy = accuracy_score(actuals, pred_binary)
    precision = precision_score(actuals, pred_binary, zero_division=0)
    recall = recall_score(actuals, pred_binary, zero_division=0)
    f1 = f1_score(actuals, pred_binary, zero_division=0)
    auc = roc_auc_score(actuals, predictions)
    
    print(f"\n✅ Evaluation Results:")
    print(f"   Accuracy: {accuracy:.4f}")
    print(f"   Precision: {precision:.4f}")
    print(f"   Recall: {recall:.4f}")
    print(f"   F1 Score: {f1:.4f}")
    print(f"   ROC AUC: {auc:.4f}")
    
    # Confusion matrix
    cm = confusion_matrix(actuals, pred_binary)
    print(f"\n   Confusion Matrix:")
    print(f"   [[TN={cm[0,0]}, FP={cm[0,1]}]")
    print(f"    [FN={cm[1,0]}, TP={cm[1,1]}]]")
    
    # Analysis
    print(f"\n📈 Analysis:")
    print(f"   Total actual hotspots: {len(actuals)}")
    print(f"   Correctly predicted: {cm[1,1]} (True Positives)")
    print(f"   Missed: {cm[1,0]} (False Negatives)")
    print(f"   False alarms: {cm[0,1]} (False Positives)")
    
    # Probability distribution
    print(f"\n📊 Probability Distribution:")
    print(f"   Mean probability: {predictions.mean():.4f}")
    print(f"   Median probability: {np.median(predictions):.4f}")
    print(f"   Min probability: {predictions.min():.4f}")
    print(f"   Max probability: {predictions.max():.4f}")
    print(f"   Std probability: {predictions.std():.4f}")
    
    # Recommendations
    print(f"\n💡 Recommendations:")
    if accuracy < 0.5:
        print("   ⚠️ Accuracy < 50%: Model sangat tidak akurat!")
        print("   → Retrain model dengan lebih banyak data")
        print("   → Check feature engineering")
    elif accuracy < 0.7:
        print("   ⚠️ Accuracy < 70%: Model perlu improvement")
        print("   → Collect lebih banyak training data")
        print("   → Tune hyperparameters")
        print("   → Improve feature engineering")
    elif recall < 0.5:
        print("   ⚠️ Recall < 50%: Model miss banyak actual hotspots")
        print("   → Lower prediction threshold")
        print("   → Collect lebih banyak positive samples")
    elif precision < 0.5:
        print("   ⚠️ Precision < 50%: Banyak false positives")
        print("   → Increase prediction threshold")
        print("   → Improve model to reduce false alarms")
    else:
        print("   ✅ Model performs reasonably well")
        print("   → Continue monitoring")
        print("   → Retrain periodically with new data")
    
    return {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1': f1,
        'auc': auc,
        'confusion_matrix': cm,
        'predictions': predictions,
        'actuals': actuals
    }


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Evaluate model dengan actual data')
    parser.add_argument('--days', type=int, default=7, help='Days to evaluate (default: 7)')
    parser.add_argument('--model-dir', type=str, default='data/models', help='Model directory')
    
    args = parser.parse_args()
    
    result = evaluate_model_with_actual_data(days_back=args.days, model_dir=args.model_dir)
    
    if result:
        print("\n✅ Evaluation completed!")
    else:
        print("\n❌ Evaluation failed!")
        sys.exit(1)

