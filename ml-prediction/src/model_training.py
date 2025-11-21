"""
Model Training untuk Hotspot Prediction 2 Hari Ke Depan
Mendukung: LSTM (Deep Learning) dan Random Forest
"""
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score, roc_auc_score
from sklearn.preprocessing import StandardScaler
import pickle
import os
from datetime import datetime
import json

# TensorFlow imports (optional - only needed for LSTM)
try:
    import tensorflow as tf
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import LSTM, Dense, Dropout, BatchNormalization
    from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
    from tensorflow.keras.optimizers import Adam
    TENSORFLOW_AVAILABLE = True
except ImportError:
    TENSORFLOW_AVAILABLE = False
    print("⚠️ Warning: TensorFlow tidak tersedia. LSTM training akan dilewati.")
    print("   Untuk menggunakan LSTM, install TensorFlow atau gunakan Python 3.9-3.11")


def prepare_tabular_features(df):
    """Prepare features untuk Random Forest (tabular data)"""
    feature_cols = [
        'latitude', 'longitude',
        'brightness', 'count_last_1d', 'count_last_3d', 'count_last_7d', 'count_last_14d',
        'avg_brightness_last_7d', 'max_brightness_last_7d',
        'month', 'day_of_year', 'week_of_year',
        'is_dry_season', 'is_rainy_season', 'is_weekend',
        'hotspot_trend_7d'
    ]
    
    # Filter columns yang ada
    available_features = [col for col in feature_cols if col in df.columns]
    
    X = df[available_features].fillna(0)
    y = df['target']
    
    return X, y, available_features


def prepare_lstm_sequences(df, sequence_length=7):
    """Prepare sequences untuk LSTM"""
    try:
        from .feature_engineering import create_sequences
    except ImportError:
        from feature_engineering import create_sequences
    
    sequences, targets, locations = create_sequences(df, sequence_length=sequence_length, prediction_days=1)
    
    return sequences, targets, locations


def train_random_forest(X, y, model_dir='data/models'):
    """Train Random Forest model"""
    print("\n🌲 Training Random Forest Model...")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print(f"   Train set: {len(X_train)} samples")
    print(f"   Test set: {len(X_test)} samples")
    print(f"   Class distribution - Train: {y_train.value_counts().to_dict()}")
    print(f"   Class distribution - Test: {y_test.value_counts().to_dict()}")
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model dengan parameter yang lebih baik untuk mengurangi overfitting
    # Reduce max_depth dan increase min_samples untuk better generalization
    model = RandomForestClassifier(
        n_estimators=300,  # Increase trees for better performance
        max_depth=15,  # Reduce from 20 to prevent overfitting
        min_samples_split=10,  # Increase from 5 for better generalization
        min_samples_leaf=4,  # Increase from 2 for better generalization
        max_features='sqrt',  # Use sqrt features to reduce overfitting
        class_weight='balanced',  # Handle class imbalance
        random_state=42,
        n_jobs=-1,
        oob_score=True  # Out-of-bag score for validation
    )
    
    print("   Training model...")
    model.fit(X_train_scaled, y_train)
    
    # Print out-of-bag score for validation
    if hasattr(model, 'oob_score_') and model.oob_score_:
        print(f"   Out-of-Bag Score (validation): {model.oob_score_:.4f}")
    
    # Evaluate
    y_pred = model.predict(X_test_scaled)
    y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
    
    accuracy = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_pred_proba)
    
    print(f"\n✅ Random Forest Results:")
    print(f"   Accuracy: {accuracy:.4f}")
    print(f"   F1 Score: {f1:.4f}")
    print(f"   ROC AUC: {auc:.4f}")
    if hasattr(model, 'oob_score_') and model.oob_score_:
        print(f"   OOB Score: {model.oob_score_:.4f} (untuk validasi overfitting)")
    
    # Check for overfitting
    y_train_pred = model.predict(X_train_scaled)
    train_accuracy = accuracy_score(y_train, y_train_pred)
    print(f"\n   Overfitting Check:")
    print(f"   Train Accuracy: {train_accuracy:.4f}")
    print(f"   Test Accuracy: {accuracy:.4f}")
    print(f"   Difference: {abs(train_accuracy - accuracy):.4f}")
    if train_accuracy - accuracy > 0.05:
        print(f"   ⚠️ Warning: Possible overfitting detected (train accuracy much higher than test)")
    
    print(f"\n   Classification Report:")
    print(classification_report(y_test, y_pred))
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print(f"\n   Top 10 Features:")
    print(feature_importance.head(10).to_string(index=False))
    
    # Save model
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, 'random_forest_1day.pkl')
    scaler_path = os.path.join(model_dir, 'rf_scaler_1day.pkl')
    
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    
    with open(scaler_path, 'wb') as f:
        pickle.dump(scaler, f)
    
    # Save metadata
    metadata = {
        'model_type': 'random_forest',
        'prediction_days': 1,
        'accuracy': float(accuracy),
        'f1_score': float(f1),
        'roc_auc': float(auc),
        'features': list(X.columns),
        'trained_at': datetime.now().isoformat()
    }
    
    with open(os.path.join(model_dir, 'rf_metadata_1day.json'), 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"\n💾 Model saved to {model_path}")
    
    return model, scaler, metadata


def train_lstm(sequences, targets, model_dir='data/models', sequence_length=7):
    """Train LSTM (Deep Learning) model"""
    print("\n🧠 Training LSTM (Deep Learning) Model...")
    
    if not TENSORFLOW_AVAILABLE:
        print("❌ TensorFlow tidak tersedia. LSTM training dilewati.")
        print("   Install TensorFlow atau gunakan Python 3.9-3.11 untuk dukungan TensorFlow.")
        return None, None, None
    
    if len(sequences) == 0:
        print("⚠️ No sequences available for LSTM training")
        return None, None, None
    
    print(f"   Total sequences: {len(sequences)}")
    print(f"   Sequence shape: {sequences.shape}")
    print(f"   Target distribution: {np.bincount(targets.astype(int))}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        sequences, targets, test_size=0.2, random_state=42, stratify=targets
    )
    
    print(f"   Train set: {len(X_train)} sequences")
    print(f"   Test set: {len(X_test)} sequences")
    
    # Normalize sequences
    # Reshape untuk normalization
    n_features = X_train.shape[2]
    X_train_reshaped = X_train.reshape(-1, n_features)
    X_test_reshaped = X_test.reshape(-1, n_features)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train_reshaped)
    X_test_scaled = scaler.transform(X_test_reshaped)
    
    X_train_scaled = X_train_scaled.reshape(X_train.shape)
    X_test_scaled = X_test_scaled.reshape(X_test.shape)
    
    # Build LSTM model
    model = Sequential([
        LSTM(128, return_sequences=True, input_shape=(sequence_length, n_features)),
        Dropout(0.3),
        BatchNormalization(),
        LSTM(64, return_sequences=False),
        Dropout(0.3),
        BatchNormalization(),
        Dense(32, activation='relu'),
        Dropout(0.2),
        Dense(1, activation='sigmoid')
    ])
    
    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss='binary_crossentropy',
        metrics=['accuracy', 'AUC']
    )
    
    print("\n   Model Architecture:")
    model.summary()
    
    # Callbacks
    os.makedirs(model_dir, exist_ok=True)
    checkpoint_path = os.path.join(model_dir, 'lstm_1day_best.h5')
    
    callbacks = [
        EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True),
        ModelCheckpoint(checkpoint_path, monitor='val_loss', save_best_only=True)
    ]
    
    # Calculate class weights untuk handle imbalance
    from sklearn.utils.class_weight import compute_class_weight
    class_weights = compute_class_weight('balanced', classes=np.unique(y_train), y=y_train)
    class_weight_dict = {i: weight for i, weight in enumerate(class_weights)}
    
    print(f"   Class weights: {class_weight_dict}")
    
    # Train model
    print("\n   Training model...")
    history = model.fit(
        X_train_scaled, y_train,
        validation_data=(X_test_scaled, y_test),
        epochs=50,
        batch_size=32,
        callbacks=callbacks,
        class_weight=class_weight_dict,
        verbose=1
    )
    
    # Evaluate
    y_pred_proba = model.predict(X_test_scaled)
    y_pred = (y_pred_proba > 0.5).astype(int).flatten()
    
    accuracy = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_pred_proba.flatten())
    
    print(f"\n✅ LSTM Results:")
    print(f"   Accuracy: {accuracy:.4f}")
    print(f"   F1 Score: {f1:.4f}")
    print(f"   ROC AUC: {auc:.4f}")
    print(f"\n   Classification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save model
    model_path = os.path.join(model_dir, 'lstm_1day.h5')
    scaler_path = os.path.join(model_dir, 'lstm_scaler_1day.pkl')
    
    model.save(model_path)
    
    with open(scaler_path, 'wb') as f:
        pickle.dump(scaler, f)
    
    # Save metadata
    metadata = {
        'model_type': 'lstm',
        'prediction_days': 1,
        'sequence_length': sequence_length,
        'n_features': n_features,
        'accuracy': float(accuracy),
        'f1_score': float(f1),
        'roc_auc': float(auc),
        'trained_at': datetime.now().isoformat()
    }
    
    with open(os.path.join(model_dir, 'lstm_metadata_1day.json'), 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"\n💾 Model saved to {model_path}")
    
    return model, scaler, metadata


def train_models(data_file, model_dir='data/models', model_type='both'):
    """
    Train models untuk prediksi 2 hari ke depan
    
    Args:
        data_file: Path to processed features CSV
        model_dir: Directory untuk save models
        model_type: 'rf', 'lstm', or 'both'
    """
    print(f"📂 Loading processed data from {data_file}...")
    df = pd.read_csv(data_file)
    
    # Convert acq_date to datetime
    if 'acq_date' in df.columns:
        df['acq_date'] = pd.to_datetime(df['acq_date'], errors='coerce')
    
    print(f"   Total samples: {len(df)}")
    print(f"   Target distribution: {df['target'].value_counts().to_dict()}")
    
    results = {}
    
    # Train Random Forest
    if model_type in ['rf', 'both']:
        X, y, feature_names = prepare_tabular_features(df)
        rf_model, rf_scaler, rf_metadata = train_random_forest(X, y, model_dir)
        results['random_forest'] = {
            'model': rf_model,
            'scaler': rf_scaler,
            'metadata': rf_metadata,
            'feature_names': feature_names
        }
    
    # Train LSTM
    if model_type in ['lstm', 'both']:
        sequences, targets, locations = prepare_lstm_sequences(df, sequence_length=7)
        if len(sequences) > 0:
            lstm_model, lstm_scaler, lstm_metadata = train_lstm(sequences, targets, model_dir, sequence_length=7)
            if lstm_model is not None:
                results['lstm'] = {
                    'model': lstm_model,
                    'scaler': lstm_scaler,
                    'metadata': lstm_metadata,
                    'locations': locations
                }
    
    print("\n✅ Training completed!")
    return results


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Train models untuk hotspot prediction')
    parser.add_argument('--data', type=str, default='data/processed/features.csv', help='Processed features CSV')
    parser.add_argument('--model-dir', type=str, default='data/models', help='Model directory')
    parser.add_argument('--model-type', type=str, choices=['rf', 'lstm', 'both'], default='both', help='Model type to train')
    
    args = parser.parse_args()
    
    train_models(args.data, args.model_dir, args.model_type)

