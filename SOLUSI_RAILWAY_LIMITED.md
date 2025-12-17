# 🚨 Solusi: Railway Limited Access - Hanya Bisa Deploy Database

## ❌ Masalah
Railway menampilkan:
- **"Limited Access"** - Account hanya bisa deploy database
- **"There is no active deployment"** - Tidak bisa deploy web service/API

**Penyebab**: Railway free trial terbatas hanya untuk database, bukan web services.

---

## 🎯 Solusi: Gunakan Platform Alternatif (GRATIS)

### 🥇 Opsi 1: Render.com (RECOMMENDED - Gratis!)

#### ✅ Keuntungan:
- ✅ **Gratis** untuk web services
- ✅ **Auto-deploy** dari GitHub
- ✅ **Support Python/FastAPI**
- ✅ **SSL certificate** gratis
- ⚠️ Sleep setelah 15 menit tidak aktif (free tier)

#### 🚀 Cara Deploy ke Render:

**Step 1: Daftar Render**
1. **Buka**: https://render.com/
2. **Sign Up** dengan GitHub
3. **Authorize Render** untuk akses repository

**Step 2: Create Web Service**
1. **Dashboard** → **"New +"** → **"Web Service"**
2. **Connect GitHub repository**: `indonesia-fire-monitor`
3. **Configure**:
   - **Name**: `indonesia-fire-monitor-api` (atau nama lain)
   - **Root Directory**: `ml-prediction` ⚠️ PENTING!
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api.prediction_api:app --host 0.0.0.0 --port $PORT`
4. **Plan**: Pilih **"Free"**
5. **Klik "Create Web Service"**

**Step 3: Tunggu Deploy**
- **Build time**: 5-10 menit
- **Check logs** untuk progress
- **Tunggu sampai "Live"**

**Step 4: Dapatkan URL**
- **Setelah deploy sukses**, URL akan muncul di dashboard
- **Format**: `https://indonesia-fire-monitor-api.onrender.com`
- **Copy URL ini**

**Step 5: Set di Vercel**
1. **Vercel Dashboard** → **Environment Variables**
2. **Add**: `VITE_PREDICTION_API_URL` = URL Render Anda
3. **Save** → **Redeploy**

---

### 🥈 Opsi 2: Fly.io (Gratis dengan Limit)

#### ✅ Keuntungan:
- ✅ **Gratis** dengan limit
- ✅ **No sleep** (tetap running)
- ✅ **Global edge network**
- ⚠️ Limit: 3 shared VMs, 160GB outbound data

#### 🚀 Cara Deploy ke Fly.io:

**Step 1: Install Fly CLI**
```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex
```

**Step 2: Login**
```bash
fly auth login
```

**Step 3: Deploy**
```bash
cd ml-prediction
fly launch
```

**Step 4: Follow prompts**
- App name: `indonesia-fire-monitor-api`
- Region: Pilih terdekat (Singapore)
- PostgreSQL: No (kita tidak butuh)
- Redis: No

**Step 5: Get URL**
```bash
fly info
```
URL akan muncul, contoh: `https://indonesia-fire-monitor-api.fly.dev`

---

### 🥉 Opsi 3: PythonAnywhere (Khusus Python)

#### ✅ Keuntungan:
- ✅ **Gratis** untuk Python apps
- ✅ **Khusus Python** (perfect untuk FastAPI)
- ⚠️ Limit: 1 web app, 512MB storage

#### 🚀 Cara Deploy:

1. **Daftar**: https://www.pythonanywhere.com/
2. **Create Web App** → **Flask** (bisa pakai untuk FastAPI)
3. **Upload code** via Git atau manual
4. **Configure** untuk FastAPI
5. **Get URL**: `https://yourusername.pythonanywhere.com`

---

### 🎯 Opsi 4: Upgrade Railway (Berbayar)

Jika mau tetap pakai Railway:
1. **Railway Dashboard** → **Settings** → **Billing**
2. **Upgrade** ke paid plan ($5/bulan minimum)
3. **Deploy service** setelah upgrade

---

## 🚀 REKOMENDASI: Render.com

**Kenapa Render?**
- ✅ Gratis untuk web services
- ✅ Mudah setup (5 menit)
- ✅ Auto-deploy dari GitHub
- ✅ SSL gratis
- ✅ Perfect untuk FastAPI

**Minus:**
- ⚠️ Sleep setelah 15 menit idle (free tier)
- ⚠️ First request setelah sleep mungkin lambat (cold start)

---

## 📋 Checklist Deploy ke Render

- [ ] Render account created
- [ ] Web Service created
- [ ] Root Directory = `ml-prediction` ✅
- [ ] Build Command = `pip install -r requirements.txt` ✅
- [ ] Start Command = `uvicorn api.prediction_api:app --host 0.0.0.0 --port $PORT` ✅
- [ ] Deploy successful
- [ ] URL Render di-copy
- [ ] Environment variable set di Vercel
- [ ] Website redeployed
- [ ] Test API berhasil

---

## 🔧 Fix Render Sleep Issue (Opsional)

**Jika API sleep setelah 15 menit:**

### Option 1: Keep-Alive Script
Buat script untuk ping API setiap 10 menit:
```javascript
// Di Vercel, bisa pakai cron job atau external service
setInterval(() => {
  fetch('https://your-api.onrender.com/')
}, 600000) // 10 menit
```

### Option 2: Upgrade Render (Berbayar)
- **Starter Plan**: $7/bulan - No sleep

---

## 🧪 Test API Render

**Setelah deploy:**
1. **Buka URL**: `https://your-api.onrender.com/docs`
2. **Harus muncul** Swagger UI
3. **Test endpoint**: `/api/predictions/grid`
4. **Jika berhasil** → Set di Vercel!

---

## 💡 Tips

1. **Render free tier sleep** setelah 15 menit idle
2. **First request** setelah sleep mungkin lambat (cold start ~30 detik)
3. **Keep-alive** bisa pakai external service (UptimeRobot, dll)
4. **Monitor logs** di Render dashboard untuk debug

---

## ✅ Quick Start Render (5 Menit)

1. **Daftar Render** → https://render.com/
2. **New Web Service** → Connect GitHub
3. **Root Directory**: `ml-prediction`
4. **Start Command**: `uvicorn api.prediction_api:app --host 0.0.0.0 --port $PORT`
5. **Deploy** → Copy URL
6. **Set di Vercel** → Done! 🎉

---

**Setelah deploy ke Render, API akan bisa diakses dan website Vercel akan fully functional!** 🚀
