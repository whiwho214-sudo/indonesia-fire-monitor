# 🔮 ML Hotspot Prediction Service

Service untuk memprediksi hotspot menggunakan Deep Learning.

## Struktur Project

```
ml-prediction/
├── data/
│   ├── raw/              # Raw data dari API
│   ├── processed/        # Preprocessed data
│   └── models/           # Saved models
├── notebooks/
│   ├── 01-data-collection.ipynb
│   ├── 02-feature-engineering.ipynb
│   ├── 03-model-training.ipynb
│   └── 04-model-evaluation.ipynb
├── src/
│   ├── data_collection.py
│   ├── feature_engineering.py
│   ├── model_training.py
│   ├── prediction.py
│   └── utils.py
├── api/
│   └── prediction_api.py  # FastAPI endpoint
├── requirements.txt
└── README.md
```

## Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# atau
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt
```

## Usage

### Quick Start (Recommended)

```bash
# Full pipeline: collect data + features + train models
python train_models.py --full-pipeline --days 365 --model-type both

# Jalankan API
python api/prediction_api.py
```

### Step by Step

#### 1. Collect Historical Data
```bash
python train_models.py --collect-data --days 365
# atau
python src/data_collection.py --days 365 --output data/raw/hotspots.csv
```

#### 2. Feature Engineering
```bash
python train_models.py --prepare-features
# atau
python src/feature_engineering.py --input data/raw/hotspots.csv --output data/processed/features.csv --days 2
```

#### 3. Train Models
```bash
# Train both models (LSTM + Random Forest)
python train_models.py --train --model-type both

# Atau train individual
python train_models.py --train --model-type lstm
python train_models.py --train --model-type rf

# atau langsung
python src/model_training.py --data data/processed/features.csv --model-type both
```

#### 4. Run Prediction API
```bash
python api/prediction_api.py
```

API akan berjalan di `http://localhost:8000`

Lihat `GUIDE_PREDIKSI_2_HARI.md` untuk dokumentasi lengkap.

## API Endpoints

### POST /api/predict
```json
{
  "latitude": -2.5,
  "longitude": 118.0,
  "date": "2024-12-01",
  "weather": {
    "temperature": 32,
    "humidity": 65,
    "wind_speed": 15
  }
}
```

Response:
```json
{
  "probability": 0.75,
  "risk_level": "high",
  "confidence": 0.82
}
```

### GET /api/predictions/grid
Returns prediction grid untuk area tertentu

### POST /api/train
Trigger model retraining

## Model Types

- `lstm`: LSTM (Deep Learning) untuk temporal prediction - mempelajari pola dari sequence data
- `rf`: Random Forest untuk baseline prediction - menggunakan fitur tabular
- `both`: Kombinasi LSTM + Random Forest - menggabungkan prediksi dari kedua model

## Features

✅ **Prediksi 2 Hari Ke Depan**: Memprediksi lokasi hotspot kebakaran 2 hari ke depan
✅ **Deep Learning (LSTM)**: Model deep learning untuk pattern recognition
✅ **Random Forest**: Ensemble model untuk robust prediction
✅ **Feature Engineering**: Fitur temporal dan spatial otomatis
✅ **REST API**: FastAPI untuk integrasi dengan frontend
✅ **Historical Data**: Menggunakan data historis untuk konteks prediksi

## Documentation

- **Quick Start**: `QUICK_START_PREDIKSI.md` - Panduan cepat 3 langkah
- **Complete Guide**: `GUIDE_PREDIKSI_2_HARI.md` - Dokumentasi lengkap

