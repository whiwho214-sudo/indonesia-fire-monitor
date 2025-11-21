# 🔮 Hotspot Prediction dengan Deep Learning

## Overview

Sistem prediksi hotspot menggunakan Deep Learning untuk memprediksi kemungkinan terjadi hotspot di lokasi tertentu berdasarkan pola historis dan faktor-faktor cuaca.

## Pendekatan yang Direkomendasikan

### 1. **LSTM (Long Short-Term Memory)**
   - **Use Case:** Prediksi time-series hotspot berdasarkan pola historis
   - **Input:** Sequence data hotspot 7-30 hari terakhir
   - **Output:** Probabilitas hotspot di grid area tertentu

### 2. **CNN (Convolutional Neural Network)**
   - **Use Case:** Pattern recognition spatial untuk identifikasi area rawan
   - **Input:** Grid-based heatmap (latitude, longitude) dengan features
   - **Output:** Probability map hotspot

### 3. **Hybrid Model (LSTM + CNN)**
   - **Use Case:** Menggabungkan temporal dan spatial patterns
   - **Input:** Historical sequence + spatial features
   - **Output:** Prediksi dengan akurasi lebih tinggi

### 4. **Random Forest / XGBoost (Baseline)**
   - **Use Case:** Baseline model untuk comparison
   - **Input:** Feature engineering dari historical data
   - **Output:** Probability classification

## Data yang Diperlukan

### 1. **Historical Hotspot Data** (sudah ada)
   - Latitude, Longitude
   - Brightness temperature
   - Confidence level
   - FRP (Fire Radiative Power)
   - Date & Time
   - Satellite source

### 2. **Weather Data** (perlu diintegrasikan)
   - Temperature
   - Humidity
   - Wind speed & direction
   - Rainfall
   - Dry days count

### 3. **Geographic Features** (perlu ditambahkan)
   - Land use type (forest, plantation, etc.)
   - Elevation
   - Slope
   - Distance to water
   - Distance to roads
   - Population density

### 4. **Temporal Features**
   - Day of year (seasonal pattern)
   - Day of week
   - Month
   - Historical hotspot frequency (lag features)

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────┐
│  Frontend (React)                                │
│  - Prediction Layer di Map                      │
│  - Risk Heatmap Overlay                          │
│  - Prediction Dashboard                         │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Backend API (Node.js/Python Flask)            │
│  - /api/predictions                             │
│  - /api/train-model                              │
│  - /api/model-status                            │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  ML Service (Python)                             │
│  - Model Training                                │
│  - Prediction Inference                          │
│  - Model Evaluation                              │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Data Pipeline                                   │
│  - Historical Data Collection                   │
│  - Feature Engineering                          │
│  - Data Preprocessing                            │
└─────────────────────────────────────────────────┘
```

## Implementation Steps

### Phase 1: Data Collection & Preparation
1. Collect historical hotspot data (min 1-2 tahun)
2. Integrate weather API (OpenWeatherMap, BMKG)
3. Extract geographic features
4. Create training dataset dengan label (1 = hotspot terjadi, 0 = tidak)

### Phase 2: Model Development
1. Baseline model (Random Forest/XGBoost)
2. LSTM model untuk temporal patterns
3. CNN model untuk spatial patterns
4. Hybrid model (LSTM + CNN)

### Phase 3: Model Training
1. Split data: 70% train, 15% validation, 15% test
2. Hyperparameter tuning
3. Cross-validation
4. Model evaluation (accuracy, precision, recall, F1-score)

### Phase 4: Deployment
1. API endpoint untuk prediksi
2. Batch prediction untuk grid area
3. Real-time inference
4. Model retraining schedule

### Phase 5: Frontend Integration
1. Prediction layer di map
2. Risk heatmap overlay
3. Alert system
4. Prediction dashboard

## Model Architecture Example

### LSTM Model (TensorFlow/Keras)
```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

model = Sequential([
    LSTM(128, return_sequences=True, input_shape=(timesteps, features)),
    Dropout(0.2),
    LSTM(64, return_sequences=True),
    Dropout(0.2),
    LSTM(32),
    Dropout(0.2),
    Dense(16, activation='relu'),
    Dense(1, activation='sigmoid')  # Binary classification
])
```

### CNN Model untuk Spatial Pattern
```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense

model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(height, width, channels)),
    MaxPooling2D((2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    Flatten(),
    Dense(128, activation='relu'),
    Dense(1, activation='sigmoid')
])
```

## Feature Engineering

### Temporal Features
- **Lag Features:** Jumlah hotspot 1, 3, 7, 14 hari sebelumnya
- **Rolling Statistics:** Mean, std, max hotspot dalam window
- **Temporal Encoding:** Day of year, month, day of week (sine/cosine)

### Spatial Features
- **Grid-based:** Divide area menjadi grid (0.1° x 0.1°)
- **Density:** Hotspot density dalam radius tertentu
- **Distance:** Distance ke hotspot terdekat
- **Cluster Features:** Hotspot cluster analysis

### Weather Features
- **Current:** Temperature, humidity, wind speed
- **Historical:** Moving average weather 7-30 hari
- **Anomaly:** Deviation dari seasonal average
- **Fire Weather Index:** Calculated FWI

## Model Evaluation Metrics

1. **Accuracy:** Overall correctness
2. **Precision:** True positives / (True positives + False positives)
3. **Recall:** True positives / (True positives + False negatives)
4. **F1-Score:** Harmonic mean of precision and recall
5. **AUC-ROC:** Area under ROC curve
6. **Confusion Matrix:** Detailed classification results

## Deployment Considerations

### Model Serving Options
1. **TensorFlow Serving:** For TensorFlow models
2. **ONNX Runtime:** Cross-platform inference
3. **FastAPI + PyTorch/TensorFlow:** Custom API
4. **AWS SageMaker / Google AI Platform:** Cloud ML service

### Performance Requirements
- **Latency:** < 500ms untuk real-time prediction
- **Throughput:** 100+ predictions/second
- **Model Size:** < 100MB untuk mobile deployment

### Monitoring
- **Model Performance:** Track accuracy over time
- **Data Drift:** Detect changes in data distribution
- **Prediction Distribution:** Monitor prediction statistics
- **A/B Testing:** Compare model versions

## Next Steps

1. **Create data collection script** untuk gather historical data
2. **Setup ML environment** (Python, TensorFlow/PyTorch)
3. **Build feature engineering pipeline**
4. **Train baseline model**
5. **Develop LSTM/CNN models**
6. **Create prediction API**
7. **Integrate dengan frontend**

## Resources

- **TensorFlow Tutorial:** Time series forecasting
- **PyTorch Lightning:** Rapid model development
- **Scikit-learn:** Baseline models & preprocessing
- **XGBoost:** Gradient boosting for tabular data
- **NASA FIRMS API:** Historical data access

## Notes

⚠️ **Important Considerations:**
- Model memerlukan data minimal 1-2 tahun untuk akurasi baik
- Weather data perlu diintegrasikan dengan API yang reliable
- Geographic features mungkin memerlukan data tambahan (satellite imagery)
- Model perlu retraining secara berkala (monthly/quarterly)
- Prediction accuracy akan bervariasi tergantung daerah (urban vs rural)

