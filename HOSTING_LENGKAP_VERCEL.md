# 🚀 Hosting Lengkap: Vercel + Semua API Jalan

## 🎯 Tujuan
Hosting website di Vercel dengan **SEMUA API berjalan**, termasuk:
- ✅ NASA FIRMS API (hotspot data)
- ✅ Prediction API (ML prediction)
- ✅ AQI Data (air quality)
- ✅ Weather Data

---

## 📋 Strategi Hosting

### **Opsi 1: Vercel Full Stack (RECOMMENDED)**

**Frontend**: Vercel (React)  
**API Backend**: Vercel Serverless Functions (Node.js)  
**ML API**: External (Render/Railway) atau Vercel Edge Functions

**Keuntungan:**
- ✅ Semua di satu platform
- ✅ Auto-deploy dari GitHub
- ✅ SSL gratis
- ✅ CDN global

---

### **Opsi 2: Hybrid (Paling Mudah)**

**Frontend**: Vercel  
**ML API**: Render.com (gratis)  
**NASA API**: Direct dari frontend (CORS enabled)

**Keuntungan:**
- ✅ Setup cepat
- ✅ Gratis semua
- ✅ Semua API jalan

---

## 🚀 SETUP LENGKAP: Opsi 2 (Hybrid - Recommended)

### **Part 1: Frontend di Vercel** (Sudah Ada ✅)

Website sudah di Vercel, tinggal setup API.

---

### **Part 2: ML Prediction API di Render**

#### **Step 1: Deploy API ke Render**
1. **Buka**: https://render.com/
2. **Sign Up** dengan GitHub (gratis, no card)
3. **New +** → **Web Service**
4. **Connect GitHub**: `indonesia-fire-monitor`
5. **Configure**:
   - **Name**: `indonesia-fire-monitor-api`
   - **Root Directory**: `ml-prediction` ⚠️ PENTING!
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api.prediction_api:app --host 0.0.0.0 --port $PORT`
   - **Plan**: **Free**
6. **Deploy** → Tunggu 5-10 menit
7. **Copy URL**: `https://indonesia-fire-monitor-api.onrender.com`

#### **Step 2: Set Environment Variable di Vercel**
1. **Vercel Dashboard** → Project `indonesia-fire-monitor`
2. **Settings** → **Environment Variables**
3. **Add**:
   - **Name**: `VITE_PREDICTION_API_URL`
   - **Value**: `https://indonesia-fire-monitor-api.onrender.com` (URL Render Anda)
   - **Environment**: All (Production, Preview, Development)
4. **Save**

#### **Step 3: Redeploy Website**
1. **Deployments** → **Redeploy** (tombol 3 dots)
2. **Tunggu 2-3 menit**
3. **Test** → Semua API jalan! 🎉

---

### **Part 3: NASA API (Sudah Jalan ✅)**

NASA FIRMS API sudah bisa diakses langsung dari frontend:
- ✅ **CORS enabled** oleh NASA
- ✅ **Tidak perlu backend proxy**
- ✅ **Sudah ada di code**: `src/services/api.js`

**Tinggal set API key di Vercel:**
1. **Environment Variables** di Vercel
2. **Add**:
   - **Name**: `VITE_NASA_MAP_KEY`
   - **Value**: `28a847cd248c2272dc9b58b20e74fa9f` (atau key Anda)
3. **Save** → Redeploy

---

### **Part 4: AQI & Weather Data (Mock Data)**

Saat ini menggunakan mock data. Jika mau real data:

#### **Option A: Pakai Mock Data (Sudah Ada)**
- ✅ Sudah jalan
- ✅ Tidak perlu setup tambahan

#### **Option B: Integrate Real API**
- **AQI**: https://aqicn.org/api/ (perlu API key)
- **Weather**: https://openweathermap.org/api (perlu API key)

**Setup:**
1. **Daftar** di provider API
2. **Dapatkan API key**
3. **Set di Vercel** environment variables
4. **Update code** untuk pakai real API

---

## 📋 Checklist Setup Lengkap

### **Vercel (Frontend):**
- [x] Website sudah di Vercel ✅
- [ ] Environment variable `VITE_PREDICTION_API_URL` di-set
- [ ] Environment variable `VITE_NASA_MAP_KEY` di-set (opsional)
- [ ] Website redeployed

### **Render (ML API):**
- [ ] Render account created
- [ ] Web Service created
- [ ] Root Directory = `ml-prediction` ✅
- [ ] Deploy successful
- [ ] URL Render di-copy
- [ ] Test `/docs` endpoint berhasil

### **NASA API:**
- [x] Sudah terintegrasi di code ✅
- [ ] API key di-set (opsional, sudah ada default)

### **AQI & Weather:**
- [x] Mock data sudah ada ✅
- [ ] Real API integrated (opsional)

---

## 🎯 Quick Setup (10 Menit)

### **1. Deploy API ke Render (5 menit)**
```
1. Buka render.com
2. New Web Service
3. Connect GitHub: indonesia-fire-monitor
4. Root Directory: ml-prediction
5. Deploy → Copy URL
```

### **2. Set di Vercel (2 menit)**
```
1. Vercel → Environment Variables
2. Add: VITE_PREDICTION_API_URL = URL Render
3. Save → Redeploy
```

### **3. Test (3 menit)**
```
1. Buka website Vercel
2. Test semua fitur:
   - Hotspot layer ✅
   - Prediction layer ✅
   - AQI layer ✅
   - Weather layer ✅
```

---

## 🚨 Troubleshooting

### **API Prediction Tidak Jalan**
- **Check**: Environment variable `VITE_PREDICTION_API_URL` sudah di-set
- **Check**: Render API masih running (tidak sleep)
- **Check**: CORS di Render API allow origin Vercel

### **NASA API Tidak Jalan**
- **Check**: API key sudah di-set (atau pakai default)
- **Check**: Browser console untuk CORS error
- **Check**: Network tab untuk request status

### **Render API Sleep**
- **Free tier sleep** setelah 15 menit idle
- **First request** setelah sleep mungkin lambat (cold start)
- **Solusi**: Upgrade Render atau setup keep-alive

---

## 💡 Tips

1. **Monitor Render logs** untuk debug API
2. **Monitor Vercel logs** untuk debug frontend
3. **Check browser console** (F12) untuk error
4. **Test semua endpoints** sebelum production

---

## ✅ Setelah Setup

**Website akan fully functional dengan:**
- ✅ Hotspot data dari NASA ✅
- ✅ ML Prediction dari Render ✅
- ✅ AQI data (mock) ✅
- ✅ Weather data (mock) ✅

**Semua API jalan!** 🎉

---

## 🎯 Next Steps

1. **Deploy API ke Render** (jika belum)
2. **Set environment variables di Vercel**
3. **Redeploy website**
4. **Test semua fitur**
5. **Monitor performance**

**Total waktu setup: ~10 menit!** 🚀
