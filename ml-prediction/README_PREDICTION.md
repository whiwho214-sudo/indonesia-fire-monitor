# 🔮 Sistem Prediksi Hotspot 2 Hari Ke Depan

Sistem prediksi hotspot menggunakan **Deep Learning (LSTM)** dan **Random Forest** untuk memprediksi titik kebakaran selanjutnya selama **2 hari ke depan**.

## 📋 Fitur

- ✅ **Deep Learning (LSTM)**: Model neural network untuk temporal prediction
- ✅ **Random Forest**: Model machine learning untuk tabular prediction  
- ✅ **Prediksi 2 Hari**: Memprediksi hotspot untuk 2 hari ke depan
- ✅ **Feature Engineering**: Temporal dan spatial features
- ✅ **FastAPI Endpoint**: REST API untuk predictions
- ✅ **Visualization**: Tampilan prediksi di map

## 🚀 Quick Start

### 1. Setup Environment

```bash
cd ml-prediction

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Collect Historical Data

```bash
# Collect data untuk 365 hari terakhir
python src/data_collection.py --days 365 --output data/raw/hotspots.csv
```

**Note**: Pastikan file `data/raw/hotspots.csv` sudah ada dengan data historis hotspot.

### 3. Feature Engineering

```bash
# Create features untuk prediksi 2 hari ke depan
python src/feature_engineering.py --input data/raw/hotspots.csv --output data/processed/features.csv --days 2
```

### 4. Train Models

```bash
# Train both models (Random Forest + LSTM)
python src/model_training.py --data data/processed/features.csv --model-type both

# Atau train salah satu saja:
python src/model_training.py --data data/processed/features.csv --model-type rf   # Random Forest only
python src/model_training.py --data data/processed/features.csv --model-type lstm  # LSTM only
```

### 5. Run Prediction API

```bash
# Start FastAPI server
python api/prediction_api.py
```

API akan berjalan di `http://localhost:8000`

### 6. Test Prediction

```bash
# Test single location prediction
python src/prediction.py --date 2024-12-15 --model-type both --output data/predictions/predictions.csv
```

## 📊 Model Details

### Random Forest Model

- **Input**: Tabular features (latitude, longitude, temporal features)
- **Output**: Probability (0-1) dan risk level (low/medium/high)
- **Features**: 
  - Spatial: latitude, longitude, grid location
  - Temporal: count_last_Xd, avg_brightness, trends
  - Seasonal: month, day_of_year, is_dry_season

### LSTM Model (Deep Learning)

- **Input**: Sequences of 7 days historical data
- **Architecture**: 
  - 2 LSTM layers (128 units, 64 units)
  - Dropout layers untuk prevent overfitting
  - Dense layers untuk output
- **Output**: Probability (0-1) untuk hotspot dalam 2 hari ke depan

## 🔌 API Endpoints

### 1. Single Location Prediction

```bash
POST /api/predict
```

Request:
```json
{
  "latitude": -2.5,
  "longitude": 118.0,
  "date": "2024-12-15",
  "model_type": "both",
  "historical_data": []
}
```

Response:
```json
{
  "latitude": -2.5,
  "longitude": 118.0,
  "date": "2024-12-15T00:00:00",
  "predictions": {
    "random_forest": {
      "probability": 0.75,
      "risk_level": "high",
      "confidence": 0.75,
      "model": "random_forest"
    },
    "lstm": {
      "probability": 0.68,
      "risk_level": "medium",
      "confidence": 0.68,
      "model": "lstm"
    },
    "combined": {
      "probability": 0.715,
      "risk_level": "high",
      "confidence": 0.715,
      "rf_probability": 0.75,
      "lstm_probability": 0.68
    }
  }
}
```

### 2. Grid Prediction

```bash
GET /api/predictions/grid?bbox=95,-11,141,6&date=2024-12-15&model_type=both&grid_size=0.2
```

Returns predictions untuk seluruh area dalam bounding box.

### 3. Model Status

```bash
GET /api/models/status
```

Returns status dari models yang tersedia.

## 🎨 Frontend Integration

Prediksi sudah terintegrasi dengan frontend React:

1. **Toggle Predictions Layer**: Aktifkan layer "Prediksi (2 Hari)" di sidebar
2. **Visualization**: Prediksi ditampilkan dengan border putus-putus untuk membedakan dari hotspot aktual
3. **Color Coding**: 
   - Merah: Risiko Tinggi (>70%)
   - Amber: Risiko Sedang (40-70%)
   - Kuning: Risiko Rendah (<40%)

## 📁 File Structure

```
ml-prediction/
├── data/
│   ├── raw/              # Raw hotspot data
│   ├── processed/        # Processed features
│   ├── models/           # Trained models
│   └── predictions/      # Prediction results
├── src/
│   ├── data_collection.py      # Collect historical data
│   ├── feature_engineering.py # Feature engineering
│   ├── model_training.py       # Train models
│   └── prediction.py           # Make predictions
├── api/
│   └── prediction_api.py       # FastAPI endpoint
└── requirements.txt
```

## ⚙️ Configuration

### Environment Variables

```bash
# .env file
VITE_PREDICTION_API_URL=http://localhost:8000
```

### Model Parameters

Edit `src/model_training.py` untuk customize:
- Sequence length (LSTM): default 7 days
- Prediction days: default 2 days
- Grid size: default 0.1 degrees
- Model architecture (LSTM layers, units, etc.)

## 🐛 Troubleshooting

### Model Not Found

Jika error "Model not found":
1. Pastikan sudah train models: `python src/model_training.py`
2. Check file exists: `data/models/random_forest_2day.pkl` dan `data/models/lstm_2day.h5`

### Insufficient Data

Jika error "Insufficient historical data":
- Collect lebih banyak data historis (minimal 30 hari)
- Run: `python src/data_collection.py --days 365`

### API Connection Error

Jika frontend tidak bisa connect ke API:
- Check API server running: `python api/prediction_api.py`
- Check CORS settings di `api/prediction_api.py`
- Check `VITE_PREDICTION_API_URL` di `.env`

## 📈 Model Performance

Setelah training, check model performance:
- Random Forest: Accuracy, F1 Score, ROC AUC
- LSTM: Validation loss, accuracy, AUC

Metrics disimpan di `data/models/*_metadata_2day.json`

## 🔄 Retrain Models

Untuk retrain models dengan data terbaru:

```bash
# 1. Collect new data
python src/data_collection.py --days 365 --output data/raw/hotspots.csv

# 2. Feature engineering
python src/feature_engineering.py --input data/raw/hotspots.csv --output data/processed/features.csv --days 2

# 3. Retrain
python src/model_training.py --data data/processed/features.csv --model-type both
```

## 📝 Notes

- **Prediction Days**: Fixed untuk 2 hari ke depan (bisa diubah di feature_engineering.py)
- **Grid Size**: Default 0.2 untuk performance (bisa diubah untuk akurasi lebih tinggi)
- **Model Type**: Gunakan "both" untuk ensemble prediction (lebih akurat)

## 🎯 Next Steps

1. ✅ Collect historical data
2. ✅ Feature engineering
3. ✅ Train models
4. ✅ Deploy API
5. ✅ Visualize predictions di frontend

Sistem prediksi siap digunakan! 🔥

