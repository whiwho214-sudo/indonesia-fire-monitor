"""
Prediction Script untuk Hotspot Prediction 2 Hari Ke Depan
Mendukung: LSTM (Deep Learning) dan Random Forest
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import pickle
import os
import json

# Try to import tensorflow - make it optional
try:
    import tensorflow as tf
    TENSORFLOW_AVAILABLE = True
except ImportError:
    TENSORFLOW_AVAILABLE = False
    print("Warning: TensorFlow not available. LSTM predictions will not work.")
    print("Install TensorFlow with: pip install tensorflow")

from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler


def load_random_forest_model(model_dir='data/models'):
    """Load Random Forest model"""
    model_path = os.path.join(model_dir, 'random_forest_1day.pkl')
    scaler_path = os.path.join(model_dir, 'rf_scaler_1day.pkl')
    metadata_path = os.path.join(model_dir, 'rf_metadata_1day.json')
    
    if not os.path.exists(model_path):
        return None, None, None
    
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    
    with open(scaler_path, 'rb') as f:
        scaler = pickle.load(f)
    
    with open(metadata_path, 'r') as f:
        metadata = json.load(f)
    
    return model, scaler, metadata


def load_lstm_model(model_dir='data/models'):
    """Load LSTM model"""
    if not TENSORFLOW_AVAILABLE:
        print("Error: TensorFlow not available. Cannot load LSTM model.")
        return None, None, None
    
    model_path = os.path.join(model_dir, 'lstm_1day.h5')
    scaler_path = os.path.join(model_dir, 'lstm_scaler_1day.pkl')
    metadata_path = os.path.join(model_dir, 'lstm_metadata_1day.json')
    
    if not os.path.exists(model_path):
        return None, None, None
    
    model = tf.keras.models.load_model(model_path)
    
    with open(scaler_path, 'rb') as f:
        scaler = pickle.load(f)
    
    with open(metadata_path, 'r') as f:
        metadata = json.load(f)
    
    return model, scaler, metadata


def prepare_features_for_prediction(df, target_date, feature_names):
    """
    Prepare features untuk prediction pada tanggal tertentu
    """
    try:
        from .feature_engineering import extract_datetime_features, create_spatial_grid, create_temporal_features
    except ImportError:
        from feature_engineering import extract_datetime_features, create_spatial_grid, create_temporal_features
    
    # Extract datetime features
    df['acq_date'] = pd.to_datetime(df['acq_date'], errors='coerce')
    df = extract_datetime_features(df)
    
    # Create spatial grid
    df = create_spatial_grid(df, grid_size=0.1)
    
    # Create temporal features (menggunakan data historis)
    df = create_temporal_features(df, prediction_days=1)
    
    # Filter untuk tanggal target
    target_df = df[df['acq_date'] <= target_date].copy()
    
    # Group by grid location dan ambil data terakhir
    latest_data = target_df.groupby(['grid_lat', 'grid_lon']).last().reset_index()
    
    # Prepare features
    available_features = [col for col in feature_names if col in latest_data.columns]
    X = latest_data[available_features].fillna(0)
    
    # Add missing features
    for feature in feature_names:
        if feature not in latest_data.columns:
            X[feature] = 0
    
    # Reorder columns sesuai feature_names
    X = X[feature_names]
    
    return X, latest_data[['grid_lat', 'grid_lon']]


def predict_with_random_forest(latitude, longitude, target_date, historical_data, model_dir='data/models', skip_temporal=False):
    """
    Predict dengan Random Forest untuk lokasi dan tanggal tertentu
    """
    model, scaler, metadata = load_random_forest_model(model_dir)
    
    if model is None:
        return {
            'probability': 0.0,
            'risk_level': 'unknown',
            'confidence': 0.0,
            'model': 'random_forest',
            'error': 'Model not found'
        }
    
    # Prepare features
    feature_names = metadata['features']
    
    # Create prediction dataframe
    pred_df = pd.DataFrame([{
        'latitude': latitude,
        'longitude': longitude,
        'brightness': 0,
        'acq_date': target_date
    }])
    
    # Add historical data
    if historical_data is not None and len(historical_data) > 0:
        hist_df = pd.DataFrame(historical_data)
        hist_df['acq_date'] = pd.to_datetime(hist_df['acq_date'], errors='coerce')
        pred_df = pd.concat([hist_df, pred_df], ignore_index=True)
    
    # Prepare features
    try:
        if skip_temporal:
            # Skip temporal features untuk speed - use simple features only
            X_pred = pd.DataFrame([{
                'latitude': latitude,
                'longitude': longitude,
                'brightness': 0,
                'count_last_1d': 0,
                'count_last_3d': 0,
                'count_last_7d': 0,
                'count_last_14d': 0,
                'avg_brightness_last_7d': 0,
                'max_brightness_last_7d': 0,
                'month': target_date.month,
                'day_of_year': target_date.timetuple().tm_yday,
                'week_of_year': target_date.isocalendar()[1],
                'is_dry_season': 1 if 4 <= target_date.month <= 9 else 0,
                'is_rainy_season': 1 if target_date.month >= 10 or target_date.month <= 3 else 0,
                'is_weekend': 1 if target_date.weekday() >= 5 else 0,
                'hotspot_trend_7d': 0
            }])
            
            # Add missing features
            for feature in feature_names:
                if feature not in X_pred.columns:
                    X_pred[feature] = 0
            
            X_pred = X_pred[feature_names]
        else:
            X, locations = prepare_features_for_prediction(pred_df, target_date, feature_names)
            
            # Get features untuk lokasi target
            grid_lat = round(latitude / 0.1) * 0.1
            grid_lon = round(longitude / 0.1) * 0.1
            
            # Find matching grid or use first row
            mask = (locations['grid_lat'] == grid_lat) & (locations['grid_lon'] == grid_lon)
            
            if mask.any():
                X_pred = X[mask].iloc[0:1]
            else:
                # Create new features
                X_pred = pd.DataFrame([{
                'latitude': latitude,
                'longitude': longitude,
                'brightness': 0,
                'count_last_1d': 0,
                'count_last_3d': 0,
                'count_last_7d': 0,
                'count_last_14d': 0,
                'avg_brightness_last_7d': 0,
                'max_brightness_last_7d': 0,
                'month': target_date.month,
                'day_of_year': target_date.timetuple().tm_yday,
                'week_of_year': target_date.isocalendar()[1],
                'is_dry_season': 1 if 4 <= target_date.month <= 9 else 0,
                'is_rainy_season': 1 if target_date.month >= 10 or target_date.month <= 3 else 0,
                'is_weekend': 1 if target_date.weekday() >= 5 else 0,
                'hotspot_trend_7d': 0
            }])
            
            # Add missing features
            for feature in feature_names:
                if feature not in X_pred.columns:
                    X_pred[feature] = 0
            
            X_pred = X_pred[feature_names]
        
        # Scale features
        X_scaled = scaler.transform(X_pred)
        
        # Predict
        probability = model.predict_proba(X_scaled)[0, 1]
        prediction = model.predict(X_scaled)[0]
        
        # Risk level
        if probability >= 0.7:
            risk_level = 'high'
        elif probability >= 0.4:
            risk_level = 'medium'
        else:
            risk_level = 'low'
        
        return {
            'probability': float(probability),
            'risk_level': risk_level,
            'confidence': float(probability),
            'model': 'random_forest',
            'prediction': int(prediction)
        }
    
    except Exception as e:
        return {
            'probability': 0.0,
            'risk_level': 'unknown',
            'confidence': 0.0,
            'model': 'random_forest',
            'error': str(e)
        }


def predict_with_lstm(latitude, longitude, target_date, historical_data, model_dir='data/models'):
    """
    Predict dengan LSTM untuk lokasi dan tanggal tertentu
    """
    if not TENSORFLOW_AVAILABLE:
        return {
            'probability': 0.0,
            'risk_level': 'unknown',
            'confidence': 0.0,
            'model': 'lstm',
            'error': 'TensorFlow not available. Install TensorFlow with: pip install tensorflow'
        }
    
    model, scaler, metadata = load_lstm_model(model_dir)
    
    if model is None:
        return {
            'probability': 0.0,
            'risk_level': 'unknown',
            'confidence': 0.0,
            'model': 'lstm',
            'error': 'Model not found'
        }
    
    sequence_length = metadata['sequence_length']
    n_features = metadata['n_features']
    
    # Prepare historical sequence
    if historical_data is None or len(historical_data) < sequence_length:
        return {
            'probability': 0.0,
            'risk_level': 'low',
            'confidence': 0.0,
            'model': 'lstm',
            'error': 'Insufficient historical data'
        }
    
    # Create sequence
    hist_df = pd.DataFrame(historical_data)
    hist_df['acq_date'] = pd.to_datetime(hist_df['acq_date'], errors='coerce')
    hist_df = hist_df.sort_values('acq_date').tail(sequence_length)
    
    # Extract features
    feature_cols = ['brightness', 'count_last_1d', 'count_last_3d', 'count_last_7d',
                    'avg_brightness_last_7d', 'month', 'day_of_year', 'is_dry_season']
    
    # Filter to available columns
    available_cols = [col for col in feature_cols if col in hist_df.columns]
    
    # Create features
    for col in feature_cols:
        if col not in hist_df.columns:
            if col == 'brightness':
                hist_df[col] = 0
            elif col == 'month':
                hist_df[col] = hist_df['acq_date'].dt.month
            elif col == 'day_of_year':
                hist_df[col] = hist_df['acq_date'].dt.dayofyear
            elif col == 'is_dry_season':
                hist_df[col] = ((hist_df['acq_date'].dt.month >= 4) & 
                               (hist_df['acq_date'].dt.month <= 9)).astype(int)
            else:
                hist_df[col] = 0
    
    # Select and order features
    sequence_features = hist_df[feature_cols].fillna(0).values
    
    # Pad atau truncate jika perlu
    if len(sequence_features) < sequence_length:
        # Pad with zeros
        padding = np.zeros((sequence_length - len(sequence_features), n_features))
        sequence_features = np.vstack([padding, sequence_features])
    elif len(sequence_features) > sequence_length:
        # Take last N sequences
        sequence_features = sequence_features[-sequence_length:]
    
    # Reshape untuk LSTM
    sequence_features = sequence_features.reshape(1, sequence_length, n_features)
    
    # Normalize
    sequence_reshaped = sequence_features.reshape(-1, n_features)
    sequence_scaled = scaler.transform(sequence_reshaped)
    sequence_scaled = sequence_scaled.reshape(1, sequence_length, n_features)
    
    # Predict
    try:
        probability = model.predict(sequence_scaled, verbose=0)[0, 0]
        prediction = 1 if probability >= 0.5 else 0
        
        # Risk level
        if probability >= 0.7:
            risk_level = 'high'
        elif probability >= 0.4:
            risk_level = 'medium'
        else:
            risk_level = 'low'
        
        return {
            'probability': float(probability),
            'risk_level': risk_level,
            'confidence': float(probability),
            'model': 'lstm',
            'prediction': int(prediction)
        }
    
    except Exception as e:
        return {
            'probability': 0.0,
            'risk_level': 'unknown',
            'confidence': 0.0,
            'model': 'lstm',
            'error': str(e)
        }


def predict_future_hotspots(target_date, bbox=None, model_type='both', model_dir='data/models', grid_size=None):
    """
    Predict hotspots untuk tanggal tertentu dalam bounding box (1 hari ke depan)
    
    Args:
        target_date: Target date untuk prediction (datetime atau string)
        bbox: Bounding box [west, south, east, north] atau None untuk semua area
        model_type: 'rf', 'lstm', or 'both'
        model_dir: Model directory
        grid_size: Grid size in degrees (default: 0.15)
    """
    print(f"🔮 Starting prediction for {target_date}...")
    
    if isinstance(target_date, str):
        target_date = pd.to_datetime(target_date)
    
    # Generate grid points untuk prediction
    if bbox is None:
        # Default: Indonesia
        bbox = [95, -11, 141, 6]
    
    # Use grid size - balance between coverage dan speed
    # 0.15 = good balance, 0.2 = faster but less coverage
    if grid_size is None:
        grid_size = 0.15  # Default: good balance between coverage dan speed
    lats = np.arange(bbox[1], bbox[3], grid_size)
    lons = np.arange(bbox[0], bbox[2], grid_size)
    
    predictions = []
    
    print(f"🔮 Predicting hotspots for {target_date.date()}...")
    print(f"   Grid points: {len(lats) * len(lons)}")
    print(f"   Grid size: {grid_size} degrees")
    
    # Load models
    print(f"📦 Loading models...")
    try:
        rf_model, rf_scaler, rf_metadata = load_random_forest_model(model_dir) if model_type in ['rf', 'both'] else (None, None, None)
        print(f"✅ Random Forest model loaded: {rf_model is not None}")
    except Exception as e:
        print(f"❌ Error loading RF model: {e}")
        rf_model, rf_scaler, rf_metadata = None, None, None
    
    try:
        lstm_model, lstm_scaler, lstm_metadata = load_lstm_model(model_dir) if model_type in ['lstm', 'both'] else (None, None, None)
        print(f"✅ LSTM model loaded: {lstm_model is not None}")
    except Exception as e:
        print(f"❌ Error loading LSTM model: {e}")
        lstm_model, lstm_scaler, lstm_metadata = None, None, None
    
    if rf_model is None and lstm_model is None:
        print("⚠️ No models available! Returning empty predictions.")
        return []
    
    count = 0
    total_points = len(lats) * len(lons)
    
    # Limit maximum points untuk avoid timeout
    # Increase MAX_POINTS untuk lebih banyak predictions, tapi balance dengan speed
    MAX_POINTS = 500  # Increased from 200 untuk lebih banyak coverage
    
    if total_points > MAX_POINTS:
        # Better sampling: ambil sample yang merata di seluruh area
        # Jangan hanya ambil setiap N-th point karena bisa cuma dapat 1-2 baris
        # Gunakan strategy yang lebih baik: reduce grid density secara proporsional
        lat_step = max(1, len(lats) // int(np.sqrt(MAX_POINTS * len(lats) / len(lons))))
        lon_step = max(1, len(lons) // int(np.sqrt(MAX_POINTS * len(lons) / len(lats))))
        
        # Pastikan minimal dapat beberapa baris dan kolom
        lat_step = min(lat_step, len(lats) // 3)  # Max 3x reduction untuk minimal dapat beberapa baris
        lon_step = min(lon_step, len(lons) // 3)  # Max 3x reduction untuk minimal dapat beberapa kolom
        
        sampled_lats = lats[::lat_step]
        sampled_lons = lons[::lon_step]
        total_points = len(sampled_lats) * len(sampled_lons)
        
        print(f"   ⚠️ Too many points ({len(lats) * len(lons)}), sampling:")
        print(f"      Lats: {len(lats)} -> {len(sampled_lats)} (step: {lat_step})")
        print(f"      Lons: {len(lons)} -> {len(sampled_lons)} (step: {lon_step})")
        print(f"      Total sampled points: {total_points}")
        
        # Warn jika masih terlalu sedikit
        if len(sampled_lats) < 3 or len(sampled_lons) < 3:
            print(f"   ⚠️ Warning: Sampling terlalu agresif, hasil mungkin hanya beberapa titik")
    else:
        sampled_lats = lats
        sampled_lons = lons
    
    print(f"   Total points to process: {total_points}")
    
    # Skip LSTM for grid - too slow, use RF only
    use_model = 'rf' if rf_model is not None else None
    
    for lat in sampled_lats:
        for lon in sampled_lons:
            count += 1
            if count % 100 == 0 or count == total_points:
                print(f"   Progress: {count}/{total_points} ({count*100//total_points}%)...")
            
            pred_result = {
                'latitude': lat,
                'longitude': lon,
                'date': target_date.isoformat()
            }
            
            # Predict with Random Forest only (skip LSTM for speed)
            if rf_model is not None:
                try:
                    # Skip temporal features calculation untuk speed - use simple features only
                    # Load historical data once untuk seluruh grid, not per point
                    rf_pred = predict_with_random_forest(lat, lon, target_date, None, model_dir, skip_temporal=True)
                    pred_result['rf_probability'] = rf_pred.get('probability', 0)
                    pred_result['rf_risk'] = rf_pred.get('risk_level', 'low')
                    pred_result['probability'] = rf_pred.get('probability', 0)
                    pred_result['risk_level'] = rf_pred.get('risk_level', 'low')
                except Exception as e:
                    print(f"⚠️ Error at ({lat:.2f}, {lon:.2f}): {e}")
                    pred_result['rf_probability'] = 0
                    pred_result['rf_risk'] = 'low'
                    pred_result['probability'] = 0
                    pred_result['risk_level'] = 'low'
            else:
                pred_result['probability'] = 0
                pred_result['risk_level'] = 'low'
            
            predictions.append(pred_result)
    
    return predictions


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Predict hotspots 2 days ahead')
    parser.add_argument('--date', type=str, default=None, help='Target date (YYYY-MM-DD), default: tomorrow')
    parser.add_argument('--bbox', type=str, default=None, help='Bounding box (west,south,east,north)')
    parser.add_argument('--model-type', type=str, choices=['rf', 'lstm', 'both'], default='both')
    parser.add_argument('--output', type=str, default='data/predictions/predictions.csv')
    
    args = parser.parse_args()
    
    # Default: predict for 1 day ahead
    if args.date is None:
        target_date = datetime.now() + timedelta(days=1)
    else:
        target_date = pd.to_datetime(args.date)
    
    bbox = None
    if args.bbox:
        bbox = [float(x) for x in args.bbox.split(',')]
    
    predictions = predict_future_hotspots(target_date, bbox, args.model_type)
    
    # Save predictions
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    pd.DataFrame(predictions).to_csv(args.output, index=False)
    
    print(f"\n✅ Saved {len(predictions)} predictions to {args.output}")

