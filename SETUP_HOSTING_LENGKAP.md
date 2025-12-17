# 🚀 Setup Hosting Lengkap: Semua API Jalan

## 🎯 Tujuan
Hosting website di **Vercel** dengan **SEMUA API berjalan**:
- ✅ NASA FIRMS API (hotspot data)
- ✅ ML Prediction API (machine learning)
- ✅ AQI Data (air quality)
- ✅ Weather Data

---

## 📋 Arsitektur Hosting

```
┌─────────────────┐
│   Vercel        │  ← Frontend (React)
│   (Website)     │  ← NASA API (direct)
└────────┬────────┘
         │
         │ API Call
         ▼
┌─────────────────┐
│   Render.com    │  ← ML Prediction API (Python/FastAPI)
│   (Backend API) │
└─────────────────┘
```

---

## 🚀 LANGKAH SETUP (10 Menit)

### **Step 1: Deploy ML API ke Render (5 menit)**

#### 1.1. Daftar Render
1. **Buka**: https://render.com/
2. **Sign Up** dengan GitHub (gratis, no card)
3. **Authorize Render**

#### 1.2. Create Web Service
1. **Dashboard** → **"New +"** → **"Web Service"**
2. **Connect GitHub**: Pilih `indonesia-fire-monitor`
3. **Configure**:
   ```
   Name: indonesia-fire-monitor-api
   Root Directory: ml-prediction  ⚠️ PENTING!
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn api.prediction_api:app --host 0.0.0.0 --port $PORT
   Plan: Free
   ```
4. **Klik "Create Web Service"**
5. **Tunggu deploy** (5-10 menit)

#### 1.3. Dapatkan URL
- **Setelah deploy sukses**, URL muncul di dashboard
- **Format**: `https://indonesia-fire-monitor-api.onrender.com`
- **Copy URL ini** (akan dipakai di Step 2)

#### 1.4. Test API
- **Buka**: `https://your-api.onrender.com/docs`
- **Harus muncul** Swagger UI → API berhasil! ✅

---

### **Step 2: Setup Vercel Environment Variables (2 menit)**

#### 2.1. Buka Vercel Dashboard
1. **Login** ke https://vercel.com/
2. **Pilih project**: `indonesia-fire-monitor`
3. **Settings** → **Environment Variables**

#### 2.2. Set Prediction API URL
1. **Klik "+ Add"** atau **"New Variable"**
2. **Isi**:
   ```
   Name: VITE_PREDICTION_API_URL
   Value: https://indonesia-fire-monitor-api.onrender.com
   Environment: All (Production, Preview, Development)
   ```
3. **Save**

#### 2.3. Set NASA API Key (Opsional)
1. **Klik "+ Add"** lagi
2. **Isi**:
   ```
   Name: VITE_NASA_MAP_KEY
   Value: 28a847cd248c2272dc9b58b20e74fa9f
   Environment: All
   ```
3. **Save** (atau skip, sudah ada default di code)

---

### **Step 3: Redeploy Website (1 menit)**

1. **Deployments** tab di Vercel
2. **Klik 3 dots** di deployment terbaru
3. **Redeploy**
4. **Tunggu 2-3 menit**

---

### **Step 4: Test Semua Fitur (2 menit)**

1. **Buka website Vercel**
2. **Test setiap fitur**:
   - ✅ **Hotspot Layer**: Aktifkan → Harus muncul titik-titik api
   - ✅ **Prediction Layer**: Aktifkan → Harus muncul prediksi
   - ✅ **AQI Layer**: Aktifkan → Harus muncul data AQI
   - ✅ **Weather Layer**: Aktifkan → Harus muncul data cuaca

3. **Check browser console** (F12):
   - ✅ Tidak ada error
   - ✅ Semua API call berhasil

---

## ✅ Checklist Lengkap

### **Render (ML API):**
- [ ] Render account created
- [ ] Web Service created
- [ ] Root Directory = `ml-prediction` ✅
- [ ] Build Command = `pip install -r requirements.txt` ✅
- [ ] Start Command = `uvicorn api.prediction_api:app --host 0.0.0.0 --port $PORT` ✅
- [ ] Plan = Free ✅
- [ ] Deploy successful
- [ ] URL Render di-copy
- [ ] Test `/docs` endpoint berhasil

### **Vercel (Website):**
- [ ] Website sudah di Vercel ✅
- [ ] Environment variable `VITE_PREDICTION_API_URL` di-set
- [ ] Environment variable `VITE_NASA_MAP_KEY` di-set (opsional)
- [ ] Website redeployed
- [ ] Test semua fitur berhasil

### **NASA API:**
- [x] Sudah terintegrasi di code ✅
- [ ] API key di-set (opsional)

### **AQI & Weather:**
- [x] Mock data sudah ada ✅

---

## 🧪 Testing Checklist

### **Test 1: Hotspot Data**
- [ ] Aktifkan "Hotspots" layer
- [ ] Map menampilkan titik-titik api
- [ ] Popup muncul saat klik titik
- [ ] Data lengkap (lokasi, tanggal, confidence)

### **Test 2: Prediction API**
- [ ] Aktifkan "Predictions" layer
- [ ] Map menampilkan prediksi (warna merah/orange/kuning)
- [ ] Popup muncul saat klik prediksi
- [ ] Data lengkap (probabilitas, risk level)

### **Test 3: AQI Data**
- [ ] Aktifkan "AQI" layer
- [ ] Map menampilkan marker AQI
- [ ] Popup muncul saat klik marker
- [ ] Data lengkap (AQI, PM2.5, PM10)

### **Test 4: Weather Data**
- [ ] Aktifkan "Weather" layer
- [ ] Map menampilkan marker cuaca
- [ ] Popup muncul saat klik marker
- [ ] Data lengkap (suhu, kelembaban, angin)

---

## 🚨 Troubleshooting

### **Problem 1: Prediction API Tidak Jalan**
**Gejala**: Error "Cannot connect to API"

**Solusi**:
1. **Check** environment variable `VITE_PREDICTION_API_URL` sudah di-set
2. **Check** Render API masih running (tidak sleep)
3. **Check** URL benar (dengan `https://`)
4. **Test** URL Render di browser: `/docs` harus muncul

### **Problem 2: NASA API Tidak Jalan**
**Gejala**: Tidak ada hotspot data

**Solusi**:
1. **Check** API key sudah di-set (atau pakai default)
2. **Check** browser console untuk CORS error
3. **Test** NASA API langsung: `window.testNASAAPI()` di console

### **Problem 3: Render API Sleep**
**Gejala**: API lambat atau timeout

**Solusi**:
1. **Free tier sleep** setelah 15 menit idle
2. **First request** setelah sleep mungkin lambat (cold start ~30 detik)
3. **Tunggu** 30 detik untuk cold start
4. **Atau** upgrade Render ke paid plan (no sleep)

### **Problem 4: CORS Error**
**Gejala**: Error "CORS policy" di console

**Solusi**:
1. **Check** Render API CORS settings
2. **Pastikan** `allow_origins=["*"]` di `prediction_api.py`
3. **Redeploy** Render API

---

## 💡 Tips

1. **Monitor Render logs** untuk debug API
2. **Monitor Vercel logs** untuk debug frontend
3. **Check browser console** (F12) untuk error
4. **Test semua endpoints** sebelum production
5. **Keep-alive** Render API jika perlu (external service)

---

## 🎯 Setelah Setup

**Website akan fully functional dengan:**
- ✅ **Hotspot data** dari NASA FIRMS ✅
- ✅ **ML Prediction** dari Render API ✅
- ✅ **AQI data** (mock) ✅
- ✅ **Weather data** (mock) ✅

**Semua API jalan!** 🎉

---

## 📊 Monitoring

### **Render Dashboard:**
- **Logs**: Monitor API requests
- **Metrics**: CPU, Memory usage
- **Events**: Deployments, errors

### **Vercel Dashboard:**
- **Deployments**: History deploy
- **Analytics**: Traffic, performance
- **Functions**: Serverless function logs

---

## 🚀 Next Steps (Opsional)

1. **Upgrade Render** (jika perlu no-sleep)
2. **Integrate real AQI API** (aqicn.org)
3. **Integrate real Weather API** (openweathermap.org)
4. **Custom domain** untuk website
5. **Analytics** setup (Google Analytics, dll)

---

**Total waktu setup: ~10 menit!** 🚀

**Setelah setup, semua API akan jalan dan website fully functional!** ✅
