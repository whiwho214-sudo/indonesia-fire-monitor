# 🚀 Quick Start: Hotspot Prediction

## Langkah Cepat (30 Menit Setup)

### Step 1: Install Python Dependencies
```bash
# Di terminal, masuk ke folder ml-prediction
cd ml-prediction

# Buat virtual environment
python -m venv venv

# Aktifkan (Windows)
venv\Scripts\activate

# Install minimal dependencies
pip install pandas numpy requests
```

### Step 2: Kumpulkan Data (Jalankan SEKARANG!)
```bash
# Data collection - ini butuh waktu lama, jalankan SEKARANG!
python src/data_collection.py --days 365 --output data/raw/hotspots.csv
```

**Catatan:**
- Script ini akan jalan beberapa jam/hari karena rate limit NASA API
- Biarkan berjalan di background
- Sambil menunggu, lanjut ke step berikutnya

### Step 3: Install ML Libraries (Setelah data terkumpul)
```bash
# Install TensorFlow (atau PyTorch)
pip install tensorflow scikit-learn matplotlib

# Atau install semua sekaligus
pip install -r requirements.txt
```

---

## Next Steps Setelah Data Ready

### 1. Explore Data
```python
import pandas as pd
df = pd.read_csv('data/raw/hotspots.csv')
print(df.head())
print(df.info())
print(df.describe())
```

### 2. Simple Baseline Model
Buat file `ml-prediction/quick_baseline.py`:

```python
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Load data
df = pd.read_csv('data/raw/hotspots.csv')

# Simple feature engineering
df['day_of_year'] = pd.to_datetime(df['acq_date']).dt.dayofyear
df['month'] = pd.to_datetime(df['acq_date']).dt.month

# Prepare features & target
X = df[['latitude', 'longitude', 'day_of_year', 'month']]
y = (df['confidence'] == 'h').astype(int)  # High confidence = hotspot

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Evaluate
accuracy = model.score(X_test, y_test)
print(f"Accuracy: {accuracy:.2%}")

# Save model
import joblib
joblib.dump(model, 'data/models/baseline_rf.pkl')
```

### 3. Test Prediction
```python
# Load model
model = joblib.load('data/models/baseline_rf.pkl')

# Predict
prediction = model.predict([[-2.5, 118.0, 100, 4]])  # lat, lon, day_of_year, month
probability = model.predict_proba([[-2.5, 118.0, 100, 4]])

print(f"Prediction: {prediction[0]}")
print(f"Probability: {probability[0]}")
```

---

## Tips

1. **Mulai dengan Data Collection** - Ini yang paling lama
2. **Start Simple** - Baseline model dulu, baru deep learning
3. **Iterate** - Improve model step by step
4. **Document** - Save notes, experiments, results

---

## Checklist

- [ ] Python installed
- [ ] Virtual environment created
- [ ] Data collection running
- [ ] Wait for data...
- [ ] Install ML libraries
- [ ] Train baseline model
- [ ] Evaluate results
- [ ] Improve model

Good luck! 🎯

