#!/usr/bin/env python3
"""
Script Training Pipeline untuk Prediksi Hotspot 2 Hari Ke Depan
Menggunakan LSTM (Deep Learning) dan Random Forest

Usage:
    python train_models.py --collect-data --days 365
    python train_models.py --train --model-type both
    python train_models.py --full-pipeline  # Langsung semua
"""

import argparse
import os
import sys
from datetime import datetime, timedelta

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from data_collection import collect_historical_data
from feature_engineering import prepare_features
from model_training import train_models


def create_directories():
    """Create necessary directories"""
    dirs = [
        'data/raw',
        'data/processed',
        'data/models',
        'data/predictions'
    ]
    
    for dir_path in dirs:
        os.makedirs(dir_path, exist_ok=True)
        print(f"✅ Created directory: {dir_path}")


def collect_data(days=365, output_file='data/raw/hotspots.csv'):
    """Collect historical hotspot data"""
    print(f"\n📊 Collecting historical data ({days} days)...")
    print("=" * 60)
    
    try:
        df = collect_historical_data(days_back=days, output_file=output_file)
        
        if len(df) == 0:
            print("\n⚠️ Warning: No data collected!")
            print("   This might be due to:")
            print("   - NASA API key not configured")
            print("   - Network issues")
            print("   - No hotspots in the specified period")
            return False
        
        print(f"\n✅ Collected {len(df)} hotspots")
        return True
    
    except Exception as e:
        print(f"\n❌ Error collecting data: {e}")
        return False


def prepare_features_step(input_file='data/raw/hotspots.csv', 
                          output_file='data/processed/features.csv',
                          prediction_days=1):
    """Prepare features for training"""
    print(f"\n🔧 Preparing features for {prediction_days}-day prediction...")
    print("=" * 60)
    
    try:
        if not os.path.exists(input_file):
            print(f"❌ Input file not found: {input_file}")
            print("   Please collect data first using --collect-data")
            return False
        
        df = prepare_features(input_file, output_file, prediction_days=prediction_days)
        
        if len(df) == 0:
            print("\n❌ No data after feature engineering")
            return False
        
        # Check target distribution
        if 'target' in df.columns:
            target_dist = df['target'].value_counts()
            print(f"\n📈 Target distribution:")
            print(f"   Class 0 (No fire): {target_dist.get(0, 0)}")
            print(f"   Class 1 (Fire): {target_dist.get(1, 0)}")
            
            if target_dist.get(1, 0) < 10:
                print("\n⚠️ Warning: Very few positive samples!")
                print("   Model might have difficulty learning")
        
        print(f"\n✅ Features prepared: {len(df)} samples")
        return True
    
    except Exception as e:
        print(f"\n❌ Error preparing features: {e}")
        import traceback
        traceback.print_exc()
        return False


def train_models_step(data_file='data/processed/features.csv',
                      model_dir='data/models',
                      model_type='both'):
    """Train models"""
    print(f"\n🧠 Training {model_type} models...")
    print("=" * 60)
    
    try:
        if not os.path.exists(data_file):
            print(f"❌ Features file not found: {data_file}")
            print("   Please prepare features first using --prepare-features")
            return False
        
        results = train_models(data_file, model_dir, model_type)
        
        # Check results
        if model_type in ['rf', 'both']:
            if 'random_forest' not in results:
                print("\n⚠️ Random Forest training failed or incomplete")
            else:
                print("\n✅ Random Forest model trained successfully")
        
        if model_type in ['lstm', 'both']:
            if 'lstm' not in results:
                print("\n⚠️ LSTM training failed or incomplete")
            else:
                print("\n✅ LSTM model trained successfully")
        
        return len(results) > 0
    
    except Exception as e:
        print(f"\n❌ Error training models: {e}")
        import traceback
        traceback.print_exc()
        return False


def full_pipeline(days=365, model_type='both'):
    """Run full training pipeline"""
    print("\n" + "=" * 60)
    print("🚀 Full Training Pipeline - Prediksi Hotspot 2 Hari Ke Depan")
    print("=" * 60)
    
    # Create directories
    create_directories()
    
    # Step 1: Collect data
    if not collect_data(days=days):
        print("\n❌ Pipeline stopped: Data collection failed")
        return False
    
    # Step 2: Prepare features
    if not prepare_features_step(prediction_days=1):
        print("\n❌ Pipeline stopped: Feature engineering failed")
        return False
    
    # Step 3: Train models
    if not train_models_step(model_type=model_type):
        print("\n❌ Pipeline stopped: Model training failed")
        return False
    
    print("\n" + "=" * 60)
    print("✅ Training Pipeline Completed Successfully!")
    print("=" * 60)
    print("\n📋 Next steps:")
    print("   1. Start the prediction API:")
    print("      python api/prediction_api.py")
    print("   2. Use the models in your frontend application")
    print("   3. Monitor model performance and retrain periodically")
    
    return True


def main():
    parser = argparse.ArgumentParser(
        description='Training Pipeline untuk Prediksi Hotspot 2 Hari Ke Depan',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Full pipeline dengan data 365 hari
  python train_models.py --full-pipeline --days 365
  
  # Hanya collect data
  python train_models.py --collect-data --days 180
  
  # Hanya train models
  python train_models.py --train --model-type lstm
  
  # Prepare features saja
  python train_models.py --prepare-features
        """
    )
    
    parser.add_argument('--collect-data', action='store_true',
                       help='Collect historical data')
    parser.add_argument('--prepare-features', action='store_true',
                       help='Prepare features from raw data')
    parser.add_argument('--train', action='store_true',
                       help='Train models')
    parser.add_argument('--full-pipeline', action='store_true',
                       help='Run full pipeline (collect -> features -> train)')
    
    parser.add_argument('--days', type=int, default=365,
                       help='Number of days of historical data to collect (default: 365)')
    parser.add_argument('--model-type', type=str, 
                       choices=['rf', 'lstm', 'both'], default='both',
                       help='Model type to train (default: both)')
    parser.add_argument('--input', type=str, 
                       default='data/raw/hotspots.csv',
                       help='Input data file')
    parser.add_argument('--output', type=str,
                       default='data/processed/features.csv',
                       help='Output features file')
    
    args = parser.parse_args()
    
    # Run full pipeline
    if args.full_pipeline:
        success = full_pipeline(days=args.days, model_type=args.model_type)
        sys.exit(0 if success else 1)
    
    # Create directories first
    create_directories()
    
    # Run individual steps
    success = True
    
    if args.collect_data:
        success = collect_data(days=args.days, output_file=args.input) and success
    
    if args.prepare_features:
        success = prepare_features_step(
            input_file=args.input,
            output_file=args.output,
            prediction_days=2
        ) and success
    
    if args.train:
        success = train_models_step(
            data_file=args.output,
            model_type=args.model_type
        ) and success
    
    if not any([args.collect_data, args.prepare_features, args.train]):
        parser.print_help()
        sys.exit(1)
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()

