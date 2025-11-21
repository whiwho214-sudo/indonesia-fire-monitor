# 🗺️ Roadmap Implementasi Deep Learning Prediction

## Phase 1: Persiapan & Setup (Week 1)

### ✅ Step 1.1: Setup Python Environment
```bash
# Install Python 3.9+ (jika belum ada)
# Download dari: https://www.python.org/downloads/

# Buat virtual environment
cd ml-prediction
python -m venv venv

# Aktifkan virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### ✅ Step 1.2: Kumpulkan Historical Data (Priority!)
**Ini yang paling penting dan butuh waktu lama!**

```bash
# Run data collection script
python src/data_collection.py --days 365 --output data/raw/hotspots.csv
```

**Catatan:**
- NASA API punya rate limit (1000 requests/day)
- Untuk 1 tahun data, butuh beberapa hari
- Simpan data di folder `data/raw/`
- Pastikan data lengkap: lat, lon, date, brightness, confidence, dll

### ✅ Step 1.3: Verifikasi Data
```python
import pandas as pd

df = pd.read_csv('data/raw/hotspots.csv')
print(f"Total hotspots: {len(df)}")
print(f"Date range: {df['acq_date'].min()} to {df['acq_date'].max()}")
print(f"Columns: {df.columns.tolist()}")
print(df.head())
```

**Checklist:**
- [ ] Minimal 365 hari data (1 tahun)
- [ ] Minimal 10,000+ hotspots
- [ ] Data lengkap (tidak banyak NaN)
- [ ] Date range sesuai

---

## Phase 2: Feature Engineering (Week 2)

### ✅ Step 2.1: Buat Script Feature Engineering
Buat file `ml-prediction/src/feature_engineering.py`

**Features yang perlu dibuat:**
1. **Temporal Features:**
   - Lag features (hotspot 1, 3, 7, 14 hari sebelumnya)
   - Rolling statistics (mean, max, std)
   - Day of year, month, day of week
   - Seasonal indicators

2. **Spatial Features:**
   - Grid-based density (hotspot dalam radius 10km, 20km, 50km)
   - Distance ke hotspot terdekat
   - Clustering features

3. **Weather Features (jika ada):**
   - Temperature, humidity, wind speed
   - Rainfall, dry days count
   - Fire Weather Index

### ✅ Step 2.2: Create Training Dataset
- Buat grid Indonesia (0.1° x 0.1°)
- Label setiap grid: 1 jika ada hotspot, 0 jika tidak
- Features untuk setiap grid point
- Split: train (70%), validation (15%), test (15%)

**Target:**
File `data/processed/training_data.csv` dengan format:
- latitude, longitude, date
- feature_1, feature_2, ..., feature_n
- target (0 atau 1)

---

## Phase 3: Baseline Model (Week 3)

### ✅ Step 3.1: Train Random Forest (Baseline)
Buat file `ml-prediction/src/model_training.py`

**Mengapa Random Forest dulu?**
- Cepat untuk training
- Mudah diinterpretasikan
- Bisa lihat feature importance
- Baseline untuk comparison

**Expected Result:**
- Accuracy: 60-70% (acceptable untuk start)
- Precision/Recall: bisa dilihat feature importance
- Model file: `data/models/baseline_rf.pkl`

### ✅ Step 3.2: Evaluate Baseline Model
- Confusion matrix
- Feature importance analysis
- Error analysis (dimana model salah?)

---

## Phase 4: Deep Learning Models (Week 4-6)

### ✅ Step 4.1: LSTM Model (Temporal)
**Use Case:** Prediksi berdasarkan pola historis hotspot

```python
# Simple LSTM untuk time series
- Input: Sequence hotspot 7-30 hari terakhir
- Output: Probability hotspot besok
- Architecture: LSTM layers + Dense
```

**File:** `ml-prediction/src/model_training.py` (tambahkan LSTM)

### ✅ Step 4.2: CNN Model (Spatial)
**Use Case:** Pattern recognition untuk area rawan

```python
# CNN untuk spatial pattern
- Input: Grid-based heatmap dengan features
- Output: Probability map
- Architecture: Conv2D layers + Dense
```

### ✅ Step 4.3: Hybrid Model (LSTM + CNN)
**Use Case:** Best of both worlds

```python
# Combine temporal + spatial
- Input: Sequence + spatial features
- Output: Enhanced prediction
- Architecture: LSTM branch + CNN branch → Merge
```

**Target:**
- Accuracy: 70-80% (target yang bagus!)
- Model files: `data/models/lstm.h5`, `data/models/cnn.h5`, `data/models/hybrid.h5`

---

## Phase 5: Prediction API (Week 7)

### ✅ Step 5.1: Setup FastAPI Backend
Buat file `ml-prediction/api/prediction_api.py`

**Endpoints:**
- `POST /api/predict` - Single prediction
- `GET /api/predictions/grid` - Batch prediction untuk area
- `POST /api/train` - Trigger retraining

### ✅ Step 5.2: Load Model & Inference
```python
# Load trained model
model = tf.keras.models.load_model('data/models/hybrid.h5')

# Prepare features for prediction
features = prepare_features(lat, lon, date, weather)

# Predict
probability = model.predict(features)
```

### ✅ Step 5.3: Test API
```bash
# Run API server
cd ml-prediction
python api/prediction_api.py

# Test dengan curl
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"latitude": -2.5, "longitude": 118.0, "date": "2024-12-01"}'
```

---

## Phase 6: Frontend Integration (Week 8)

### ✅ Step 6.1: Create Prediction Layer Component
Buat file `src/components/PredictionLayer.jsx`

**Features:**
- Heatmap overlay untuk probability
- Toggle untuk show/hide prediction
- Color coding: green (low), yellow (medium), red (high)

### ✅ Step 6.2: Integrate dengan MapView
Update `src/components/MapView.jsx`

```jsx
// Add prediction layer
{layers.prediction && predictionData && (
  <PredictionLayer data={predictionData} />
)}
```

### ✅ Step 6.3: Add Prediction Toggle
Update `src/components/SidebarFilters.jsx`
- Toggle untuk "Prediksi Hotspot"
- Date picker untuk pilih tanggal prediksi

### ✅ Step 6.4: Prediction Dashboard
Buat file `src/components/PredictionDashboard.jsx`
- Accuracy metrics
- Model info
- Prediction confidence

---

## Phase 7: Deployment & Monitoring (Week 9+)

### ✅ Step 7.1: Model Deployment
- Deploy API ke server (AWS, GCP, atau VPS)
- Setup auto-reload model
- Environment variables untuk config

### ✅ Step 7.2: Monitoring
- Track prediction accuracy
- Monitor model performance
- Log prediction requests
- Alert jika accuracy drop

### ✅ Step 7.3: Retraining Schedule
- Automatic retraining monthly/quarterly
- Update model dengan data terbaru
- A/B testing untuk model baru

---

## 📋 Quick Start Checklist

### Hari 1-3: Setup & Data Collection
- [ ] Install Python & dependencies
- [ ] Run data collection (biarkan berjalan)
- [ ] Verifikasi data sudah terkumpul

### Hari 4-7: Feature Engineering
- [ ] Buat script feature engineering
- [ ] Generate training dataset
- [ ] Verify features benar

### Hari 8-10: Baseline Model
- [ ] Train Random Forest
- [ ] Evaluate & analyze
- [ ] Identify important features

### Hari 11-20: Deep Learning Models
- [ ] Train LSTM model
- [ ] Train CNN model (optional)
- [ ] Train Hybrid model
- [ ] Compare performance

### Hari 21-25: API Development
- [ ] Setup FastAPI
- [ ] Create prediction endpoints
- [ ] Test API dengan sample data

### Hari 26-30: Frontend Integration
- [ ] Create PredictionLayer component
- [ ] Integrate dengan map
- [ ] Add UI controls
- [ ] Test end-to-end

---

## 🚀 Immediate Action Items (Lakukan SEKARANG!)

### 1. Start Data Collection (PRIORITY!)
```bash
cd ml-prediction
python src/data_collection.py --days 365 --output data/raw/hotspots.csv
```

**Biarkan berjalan di background!** Ini butuh waktu karena rate limit API.

### 2. Install Dependencies
```bash
pip install pandas numpy scikit-learn tensorflow
```

### 3. Explore Data Structure
Buat notebook Jupyter untuk explore data yang sudah terkumpul.

---

## 📚 Resources

### Tutorial & Documentation
- TensorFlow Time Series: https://www.tensorflow.org/tutorials/structured_data/time_series
- LSTM untuk Prediction: https://machinelearningmastery.com/lstm-for-time-series-prediction/
- FastAPI Tutorial: https://fastapi.tiangolo.com/tutorial/

### Tools
- Jupyter Notebook: Untuk exploration & experimentation
- TensorBoard: Untuk visualize training
- Postman/Insomnia: Untuk test API

---

## ⚠️ Tips & Warnings

1. **Data is King!** - Kualitas model tergantung kualitas data
2. **Start Simple** - Baseline model dulu, baru deep learning
3. **Iterate Fast** - Train simple model dulu, optimize later
4. **Monitor Performance** - Track accuracy over time
5. **Save Everything** - Save models, data, experiments

---

## 🎯 Success Criteria

Model dianggap berhasil jika:
- ✅ Accuracy > 70%
- ✅ Precision > 65%
- ✅ Recall > 60%
- ✅ Inference time < 500ms
- ✅ Can predict 1 day ahead

Good luck! 🚀

