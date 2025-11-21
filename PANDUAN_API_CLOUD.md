# 🌐 Panduan Deploy API Machine Learning ke Cloud

## 🎯 Pilihan Platform Cloud untuk API Python

### 1. Railway.app (RECOMMENDED - Gratis)
- ✅ Gratis dengan limit yang cukup
- ✅ Support Python/FastAPI
- ✅ Auto-deploy dari GitHub
- ✅ SSL certificate otomatis
- ⚠️ Limit: 500 jam/bulan, 1GB RAM

### 2. Render.com (Alternatif Bagus)
- ✅ Gratis dengan limit
- ✅ Support Python/FastAPI  
- ✅ Auto-deploy dari GitHub
- ⚠️ Limit: Sleep setelah 15 menit tidak aktif

### 3. PythonAnywhere (Khusus Python)
- ✅ Gratis dengan limit
- ✅ Khusus untuk Python
- ⚠️ Limit: 1 web app, 512MB storage

## 🚀 Deploy ke Railway.app (Step by Step)

### Step 1: Persiapan Repository
1. **Push code ke GitHub** (jika belum):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/indonesia-fire-monitor.git
   git push -u origin main
   ```

### Step 2: Setup Railway
1. **Daftar Railway**:
   - Kunjungi: https://railway.app/
   - Login dengan GitHub account

2. **Create New Project**:
   - Klik "New Project"
   - Pilih "Deploy from GitHub repo"
   - Pilih repository Anda
   - Pilih folder `ml-prediction` sebagai root directory

### Step 3: Konfigurasi Environment
1. **Set Environment Variables**:
   ```
   PORT=8000
   PYTHONPATH=/app
   ```

2. **Railway akan otomatis detect**:
   - `requirements.txt` untuk dependencies
   - `railway.json` untuk konfigurasi (sudah dibuat)

### Step 4: Deploy
1. Railway akan otomatis build dan deploy
2. Tunggu proses selesai (5-10 menit)
3. Dapatkan URL deployment (contoh: `https://your-app.railway.app`)

## 🔧 Update Konfigurasi Frontend

### Update API URL di Website
Edit file `src/services/api.js`:

```javascript
// Ganti dengan URL Railway deployment Anda
const API_BASE_URL = 'https://your-app-name.railway.app';

// Atau gunakan environment variable untuk flexibility
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-app-name.railway.app';
```

### Rebuild Website
```bash
npm run build
```

### Upload ulang ke Infinity Free
Upload file baru dari folder `dist/` ke Infinity Free.

## 🛠️ Troubleshooting API Deployment

### 1. Build Errors
**Error: Module not found**
```bash
# Pastikan requirements.txt lengkap
pip freeze > ml-prediction/requirements.txt
```

**Error: Port binding**
```python
# Pastikan di prediction_api.py menggunakan environment PORT
import os
port = int(os.environ.get("PORT", 8000))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=port)
```

### 2. CORS Issues
Update `ml-prediction/api/prediction_api.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://yourname.epizy.com",  # Infinity Free URL
        "http://localhost:5173",      # Local development
        "http://localhost:3000"       # Alternative local
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Model Loading Issues
Pastikan path model benar:

```python
import os
from pathlib import Path

# Get absolute path
BASE_DIR = Path(__file__).parent.parent
MODEL_PATH = BASE_DIR / "data" / "models" / "random_forest_1day.pkl"

# Load model
with open(MODEL_PATH, 'rb') as f:
    model = pickle.load(f)
```

## 📊 Alternative: Deploy ke Render.com

### Step 1: Daftar Render
1. Kunjungi: https://render.com/
2. Login dengan GitHub

### Step 2: Create Web Service
1. Klik "New +" → "Web Service"
2. Connect GitHub repository
3. Pilih folder `ml-prediction`

### Step 3: Konfigurasi
```
Build Command: pip install -r requirements.txt
Start Command: uvicorn api.prediction_api:app --host 0.0.0.0 --port $PORT
```

## 🔍 Testing API Deployment

### 1. Test API Endpoint
```bash
# Test health endpoint
curl https://your-app-name.railway.app/health

# Test prediction endpoint
curl -X POST https://your-app-name.railway.app/predict \
  -H "Content-Type: application/json" \
  -d '{"latitude": -6.2, "longitude": 106.8, "date": "2024-01-01"}'
```

### 2. Test dari Website
1. Buka website di Infinity Free
2. Check browser console untuk errors
3. Test fitur prediksi

## 💰 Cost Monitoring

### Railway.app Limits (Free Tier)
- **Execution Time**: 500 jam/bulan
- **Memory**: 512MB - 1GB
- **Bandwidth**: Unlimited
- **Sleep**: Tidak ada auto-sleep

### Render.com Limits (Free Tier)
- **Memory**: 512MB
- **Bandwidth**: 100GB/bulan
- **Sleep**: Setelah 15 menit tidak aktif
- **Build Time**: 500 menit/bulan

## 🚨 Production Considerations

### 1. Environment Variables
```
# Production settings
DEBUG=False
CORS_ORIGINS=https://yourname.epizy.com
MODEL_CACHE_SIZE=100
```

### 2. Logging
```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.get("/predict")
async def predict():
    logger.info("Prediction request received")
    # ... prediction logic
```

### 3. Error Handling
```python
from fastapi import HTTPException

@app.post("/predict")
async def predict(data: PredictionRequest):
    try:
        result = make_prediction(data)
        return result
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")
```

## ✅ Checklist Deployment

- [ ] Code pushed to GitHub
- [ ] Railway/Render account created
- [ ] API deployed successfully
- [ ] CORS configured
- [ ] Frontend updated with new API URL
- [ ] Website rebuilt and uploaded
- [ ] End-to-end testing completed
- [ ] Error monitoring setup

---

**🎉 API Anda siap digunakan di cloud!**
