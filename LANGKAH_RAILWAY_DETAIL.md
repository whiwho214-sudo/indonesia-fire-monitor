# 🚂 Langkah Detail Deploy API di Railway

## 🎯 Setelah Daftar Railway, Lakukan Ini:

### Step 1: Login dan Setup Awal
1. **Buka Railway.app** dan login dengan GitHub
2. **Klik "New Project"** di dashboard
3. **Pilih "Deploy from GitHub repo"**
4. **Connect GitHub account** jika belum (authorize Railway)

### Step 2: Pilih Repository
1. **Cari repository** `indonesia-fire-monitor`
2. **Klik repository** tersebut
3. **PENTING**: Pilih **"ml-prediction"** sebagai root directory
   - Jangan pilih root project, tapi folder `ml-prediction`
   - Railway akan detect ini sebagai Python project

### Step 3: Konfigurasi Environment
Railway akan otomatis detect, tapi pastikan:

1. **Build Command**: `pip install -r requirements.txt`
2. **Start Command**: `uvicorn api.prediction_api:app --host 0.0.0.0 --port $PORT`
3. **Environment Variables**:
   ```
   PORT = $PORT (otomatis)
   PYTHONPATH = /app
   ```

### Step 4: Deploy Process
1. **Klik "Deploy"** - Railway akan mulai build
2. **Tunggu proses** (5-15 menit pertama kali):
   - Installing dependencies
   - Building application
   - Starting server
3. **Lihat logs** untuk memastikan tidak ada error

### Step 5: Dapatkan URL API
1. Setelah deploy sukses, **klik tab "Settings"**
2. **Scroll ke "Domains"**
3. **Copy URL** (contoh: `https://ml-prediction-production-abc123.up.railway.app`)
4. **Test URL** dengan menambah `/docs` di akhir untuk melihat API documentation

## 🔧 Jika Ada Masalah di Railway

### Problem 1: Build Failed - Requirements Error
**Solusi**: Update requirements.txt
```bash
# Di folder ml-prediction, jalankan:
cd ml-prediction
pip freeze > requirements.txt
```

### Problem 2: Port Error
**Edit file**: `ml-prediction/api/prediction_api.py`
```python
import os
import uvicorn
from fastapi import FastAPI

app = FastAPI()

# ... kode API lainnya ...

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
```

### Problem 3: Model File Not Found
**Edit file**: `ml-prediction/api/prediction_api.py`
```python
import os
from pathlib import Path

# Fix path model
BASE_DIR = Path(__file__).parent.parent
MODEL_PATH = BASE_DIR / "data" / "models" / "random_forest_1day.pkl"

# Load dengan error handling
try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    print("✅ Model loaded successfully")
except Exception as e:
    print(f"❌ Error loading model: {e}")
```

## 🌐 Update Website dengan URL Railway

### Step 6: Update API URL di Website
1. **Edit file**: `src/services/api.js`
2. **Ganti URL**:
```javascript
// Ganti dengan URL Railway Anda
const API_BASE_URL = 'https://ml-prediction-production-abc123.up.railway.app';

export const apiService = {
  async getPrediction(data) {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};
```

### Step 7: Rebuild dan Upload Ulang
```bash
# Build ulang website
npm run build

# Upload ulang folder dist/ ke Infinity Free
```

## 🧪 Testing API Railway

### Test 1: Health Check
Buka di browser: `https://your-railway-url.railway.app/health`

### Test 2: API Documentation  
Buka di browser: `https://your-railway-url.railway.app/docs`

### Test 3: Prediction Endpoint
```bash
curl -X POST https://your-railway-url.railway.app/predict \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": -6.2088,
    "longitude": 106.8456,
    "date": "2024-01-15"
  }'
```

## 📊 Monitor Railway Deployment

### Dashboard Railway
1. **Deployments tab**: Lihat status deploy
2. **Metrics tab**: Monitor CPU/Memory usage
3. **Logs tab**: Debug jika ada error
4. **Settings tab**: Manage environment variables

### Free Tier Limits
- **Execution time**: 500 jam/bulan
- **Memory**: 512MB - 1GB  
- **Builds**: Unlimited
- **Bandwidth**: Unlimited

## 🚨 Troubleshooting Common Issues

### Issue: "Application failed to respond"
**Solusi**:
1. Check logs di Railway dashboard
2. Pastikan port binding benar
3. Verify start command

### Issue: "Module not found"  
**Solusi**:
1. Update requirements.txt
2. Redeploy project

### Issue: CORS Error dari Website
**Solusi**: Update CORS di `prediction_api.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Atau specify domain Infinity Free
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## ✅ Checklist Sukses

- [ ] Railway project created
- [ ] ml-prediction folder deployed  
- [ ] Build completed successfully
- [ ] API URL obtained
- [ ] Health endpoint accessible
- [ ] API docs (/docs) working
- [ ] Website updated with new URL
- [ ] Website rebuilt and uploaded
- [ ] End-to-end test successful

---

**🎉 API Railway siap digunakan!**

**Next**: Update website dengan URL baru dan test seluruh aplikasi.
