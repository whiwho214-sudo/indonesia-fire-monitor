# 🔮 Panduan Lengkap: Prediksi Hotspot 2 Hari Ke Depan

Panduan lengkap untuk menggunakan sistem prediksi hotspot 2 hari ke depan menggunakan **Deep Learning (LSTM)** dan **Random Forest**.

## 📋 Daftar Isi

1. [Overview](#overview)
2. [Instalasi](#instalasi)
3. [Training Model](#training-model)
4. [Menjalankan API](#menjalankan-api)
5. [Menggunakan di Frontend](#menggunakan-di-frontend)
6. [Troubleshooting](#troubleshooting)

## 🎯 Overview

Sistem ini menggunakan dua model Machine Learning untuk memprediksi lokasi hotspot kebakaran hutan 2 hari ke depan:

- **LSTM (Long Short-Term Memory)**: Deep Learning model untuk mempelajari pola temporal dari data historis
- **Random Forest**: Ensemble model untuk memprediksi berdasarkan fitur-fitur spatial dan temporal

### Cara Kerja

1. **Data Collection**: Mengumpulkan data hotspot historis dari NASA FIRMS API
2. **Feature Engineering**: Membuat fitur-fitur temporal (count hotspot dalam X hari terakhir, trend, dll) dan spatial (grid location)
3. **Model Training**: Melatih model LSTM dan Random Forest dengan data yang sudah diproses
4. **Prediction**: Menggunakan model yang sudah dilatih untuk memprediksi hotspot 2 hari ke depan

## 📦 Instalasi

### 1. Persiapan Environment

```bash
# Masuk ke direktori ml-prediction
cd ml-prediction

# Buat virtual environment
python -m venv venv

# Aktifkan virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Konfigurasi API Key

Pastikan NASA API key sudah dikonfigurasi di file `src/data_collection.py`:

```python
NASA_API_KEY = 'your_api_key_here'
```

Untuk mendapatkan API key gratis, kunjungi: https://firms.modaps.eosdis.nasa.gov/api/

## 🚀 Training Model

### Opsi 1: Full Pipeline (Recommended)

Jalankan semua proses sekaligus:

```bash
python train_models.py --full-pipeline --days 365 --model-type both
```

Ini akan:
1. ✅ Mengumpulkan data historis 365 hari terakhir
2. ✅ Membuat fitur-fitur untuk training
3. ✅ Melatih model LSTM dan Random Forest
4. ✅ Menyimpan model ke `data/models/`

### Opsi 2: Step by Step

Jika ingin menjalankan step by step:

#### Step 1: Kumpulkan Data Historis

```bash
python train_models.py --collect-data --days 365
```

Atau langsung:
```bash
python src/data_collection.py --days 365 --output data/raw/hotspots.csv
```

#### Step 2: Feature Engineering

```bash
python train_models.py --prepare-features
```

Atau langsung:
```bash
python src/feature_engineering.py --input data/raw/hotspots.csv --output data/processed/features.csv --days 2
```

#### Step 3: Train Models

```bash
# Train kedua model
python train_models.py --train --model-type both

# Atau train salah satu saja
python train_models.py --train --model-type lstm
python train_models.py --train --model-type rf
```

Atau langsung:
```bash
python src/model_training.py --data data/processed/features.csv --model-type both
```

### Output Training

Setelah training selesai, model akan disimpan di:
- `data/models/random_forest_2day.pkl` - Random Forest model
- `data/models/lstm_2day.h5` - LSTM model
- `data/models/rf_scaler_2day.pkl` - Scaler untuk Random Forest
- `data/models/lstm_scaler_2day.pkl` - Scaler untuk LSTM
- `data/models/*_metadata_2day.json` - Metadata model (accuracy, features, dll)

## 🌐 Menjalankan API

Setelah model sudah dilatih, jalankan prediction API:

```bash
python api/prediction_api.py
```

API akan berjalan di: `http://localhost:8000`

### Endpoints

#### 1. Status Model
```bash
GET http://localhost:8000/api/models/status
```

Response:
```json
{
  "random_forest": {
    "available": true,
    "metadata": {
      "accuracy": 0.85,
      "f1_score": 0.78,
      "roc_auc": 0.89
    }
  },
  "lstm": {
    "available": true,
    "metadata": {
      "accuracy": 0.82,
      "f1_score": 0.75,
      "roc_auc": 0.87
    }
  }
}
```

#### 2. Single Prediction
```bash
POST http://localhost:8000/api/predict
Content-Type: application/json

{
  "latitude": -2.5,
  "longitude": 118.0,
  "date": "2024-12-15",
  "model_type": "both"
}
```

#### 3. Grid Prediction (untuk area luas)
```bash
GET http://localhost:8000/api/predictions/grid?bbox=95,-11,141,6&date=2024-12-15&model_type=both&grid_size=0.2
```

## 💻 Menggunakan di Frontend

### 1. Konfigurasi Environment Variable

Buat file `.env` di root project:

```env
VITE_PREDICTION_API_URL=http://localhost:8000
```

### 2. Aktifkan Layer Prediksi

Di aplikasi React, toggle layer "Predictions" di sidebar. Aplikasi akan:
- Otomatis menghitung tanggal 2 hari ke depan
- Mengambil data hotspot historis untuk konteks
- Memanggil API prediction untuk mendapatkan prediksi
- Menampilkan prediksi di map dengan warna sesuai risk level

### 3. Interpretasi Hasil

- **Merah (High Risk)**: Probabilitas >= 70% - Area dengan risiko tinggi
- **Orange (Medium Risk)**: Probabilitas 40-70% - Area dengan risiko sedang
- **Kuning (Low Risk)**: Probabilitas < 40% - Area dengan risiko rendah

## 📊 Model Performance

### Metrics yang Diperhatikan

1. **Accuracy**: Seberapa akurat prediksi secara keseluruhan
2. **F1 Score**: Balance antara precision dan recall
3. **ROC AUC**: Kemampuan model membedakan class positif dan negatif

### Tips untuk Meningkatkan Performance

1. **Lebih banyak data**: Collect data lebih lama (365+ hari)
2. **Feature engineering**: Tambahkan fitur cuaca, topografi, dll
3. **Hyperparameter tuning**: Tune parameters model
4. **Ensemble**: Kombinasikan prediksi dari beberapa model
5. **Retraining**: Retrain model secara berkala dengan data terbaru

## 🔧 Troubleshooting

### Problem: No data collected

**Solusi**:
- Check NASA API key apakah valid
- Check koneksi internet
- Pastikan tidak ada firewall yang memblokir request

### Problem: Training error - Insufficient data

**Solusi**:
- Kumpulkan data lebih banyak (minimal 30 hari)
- Pastikan ada cukup positive samples (hotspot yang terjadi)

### Problem: Model accuracy rendah

**Solusi**:
- Collect lebih banyak data historis
- Check apakah target variable balance (jika terlalu imbalance, gunakan class_weight)
- Coba tune hyperparameters

### Problem: API tidak bisa load model

**Solusi**:
- Pastikan model sudah dilatih (`data/models/` ada filenya)
- Check path model di `prediction.py`
- Pastikan semua dependencies terinstall

### Problem: Frontend tidak menampilkan prediksi

**Solusi**:
- Check apakah API berjalan di `http://localhost:8000`
- Check console browser untuk error
- Pastikan environment variable `VITE_PREDICTION_API_URL` sudah dikonfigurasi
- Check network tab untuk melihat response dari API

## 📝 Workflow Lengkap

```bash
# 1. Setup (sekali saja)
cd ml-prediction
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# 2. Train models (sekali, atau saat retraining)
python train_models.py --full-pipeline --days 365 --model-type both

# 3. Jalankan API (setiap kali ingin menggunakan prediksi)
python api/prediction_api.py

# 4. Jalankan frontend (terminal baru)
cd ..
npm run dev
```

## 🎓 Advanced Usage

### Custom Prediction

Untuk membuat prediksi custom dengan data sendiri:

```python
from src.prediction import predict_with_random_forest, predict_with_lstm
from datetime import datetime, timedelta

target_date = datetime.now() + timedelta(days=2)
historical_data = [...]  # Your historical data

# Random Forest prediction
rf_result = predict_with_random_forest(
    latitude=-2.5,
    longitude=118.0,
    target_date=target_date,
    historical_data=historical_data
)

# LSTM prediction
lstm_result = predict_with_lstm(
    latitude=-2.5,
    longitude=118.0,
    target_date=target_date,
    historical_data=historical_data
)
```

### Batch Prediction

```python
from src.prediction import predict_future_hotspots

predictions = predict_future_hotspots(
    target_date=datetime.now() + timedelta(days=2),
    bbox=[95, -11, 141, 6],  # Indonesia
    model_type='both'
)
```

## 📚 Referensi

- NASA FIRMS API: https://firms.modaps.eosdis.nasa.gov/api/
- TensorFlow LSTM: https://www.tensorflow.org/api_docs/python/tf/keras/layers/LSTM
- Scikit-learn Random Forest: https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html

## ✅ Checklist Setup

- [ ] Python environment setup
- [ ] Dependencies installed
- [ ] NASA API key configured
- [ ] Historical data collected (min 30 days)
- [ ] Features prepared
- [ ] Models trained
- [ ] API running
- [ ] Frontend configured
- [ ] Predictions working

---

**Selamat menggunakan sistem prediksi hotspot! 🔥🔮**

