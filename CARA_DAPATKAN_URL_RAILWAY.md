# 🚂 Cara Deploy API ke Railway & Dapatkan URL

## 🎯 Tujuan
Deploy API Machine Learning ke Railway agar bisa diakses dari website Vercel.

---

## 📋 Step-by-Step Deploy ke Railway

### Step 1: Login Railway
1. **Buka browser** → https://railway.app/
2. **Klik "Login"** atau **"Start a New Project"**
3. **Pilih "Login with GitHub"**
4. **Authorize Railway** untuk akses repository GitHub Anda

### Step 2: Create New Project
1. **Di dashboard Railway**, klik **"New Project"** (tombol ungu)
2. **Pilih "Deploy from GitHub repo"**
3. **Cari repository**: `indonesia-fire-monitor`
4. **Klik repository** tersebut

### Step 3: Konfigurasi Project (PENTING!)
1. **Setelah repository dipilih**, Railway akan show konfigurasi
2. **PENTING**: Cari setting **"Root Directory"** atau **"Source"**
3. **Ganti dari `.` menjadi `ml-prediction`**
   - Ini penting karena API ada di folder `ml-prediction`, bukan root
4. **Build Command**: Railway akan auto-detect (biarkan default)
5. **Start Command**: Railway akan auto-detect (biarkan default)

### Step 4: Deploy
1. **Klik "Deploy"** atau biarkan Railway auto-deploy
2. **Tunggu proses build** (5-15 menit pertama kali):
   - Installing dependencies
   - Building application
   - Starting server
3. **Lihat logs** untuk memastikan tidak ada error

### Step 5: Dapatkan URL
1. **Setelah deploy sukses**, klik **tab "Settings"** di project
2. **Scroll ke bawah** ke section **"Domains"** atau **"Networking"**
3. **Copy URL** yang muncul, contoh:
   ```
   https://ml-prediction-production-abc123.up.railway.app
   ```
   atau
   ```
   https://indonesia-fire-monitor-production.up.railway.app
   ```

### Step 6: Test URL
1. **Buka URL** di browser
2. **Tambahkan `/docs`** di akhir untuk test API documentation:
   ```
   https://your-url.railway.app/docs
   ```
3. **Harus muncul** Swagger UI dengan API endpoints

---

## 🔧 Jika URL Tidak Muncul

### Problem 1: Deploy Masih Running
- **Tunggu sampai selesai** (lihat progress di dashboard)
- **Check logs** untuk error

### Problem 2: Build Failed
- **Check logs** di Railway dashboard
- **Pastikan** `requirements.txt` ada di folder `ml-prediction`
- **Pastikan** root directory = `ml-prediction`

### Problem 3: Port Error
- Railway otomatis set PORT via environment variable
- Pastikan API code pakai `os.environ.get("PORT")`

---

## 📝 Format URL yang Benar

URL Railway biasanya seperti ini:
```
https://[project-name]-[random-id].up.railway.app
```

**Contoh:**
```
https://ml-prediction-production-abc123.up.railway.app
https://indonesia-fire-monitor-production.up.railway.app
```

**JANGAN pakai:**
- ❌ `http://localhost:8000`
- ❌ `http://127.0.0.1:8000`
- ❌ URL tanpa `https://`

---

## 🎯 Setelah Dapat URL

### Copy URL Railway
Contoh: `https://ml-prediction-production-abc123.up.railway.app`

### Paste di Vercel Environment Variables
1. **Buka Vercel Dashboard**
2. **Project Settings** → **Environment Variables**
3. **Add New Variable**:
   - **Name**: `VITE_PREDICTION_API_URL`
   - **Value**: `https://ml-prediction-production-abc123.up.railway.app` (paste URL di sini)
   - **Environment**: Centang semua (Production, Preview, Development)
4. **Save**

### Redeploy Website
1. **Deployments** tab
2. **Redeploy** (tombol 3 dots)
3. **Tunggu 2-3 menit**
4. **Test website** → API error hilang! 🎉

---

## 🧪 Test API Railway

### Test 1: Health Check
Buka di browser:
```
https://your-railway-url.railway.app/
```

Harus muncul response JSON atau message "API is running"

### Test 2: API Documentation
Buka di browser:
```
https://your-railway-url.railway.app/docs
```

Harus muncul Swagger UI dengan semua endpoints

### Test 3: Test dari Website
1. **Buka website Vercel**
2. **Aktifkan layer "Predictions"**
3. **Check browser console** (F12)
4. **Tidak ada error** → Berhasil! ✅

---

## 🚨 Troubleshooting

### Error: "Cannot connect to API"
- **Check URL** sudah benar (dengan https://)
- **Check Railway** masih running (tidak sleep)
- **Check CORS** di API Railway allow origin Vercel

### Error: "API timeout"
- Railway free tier mungkin **sleep setelah idle**
- **Wake up** dengan akses URL di browser
- Atau upgrade ke paid tier

### Error: "Build failed"
- **Check logs** di Railway dashboard
- **Pastikan** `requirements.txt` lengkap
- **Pastikan** root directory = `ml-prediction`

---

## ✅ Checklist Deploy Railway

- [ ] Railway account created
- [ ] Repository connected
- [ ] Root directory = `ml-prediction` ✅
- [ ] Deploy successful
- [ ] URL Railway di-copy
- [ ] Test `/docs` endpoint berhasil
- [ ] URL di-set di Vercel environment variables
- [ ] Website redeployed
- [ ] Test end-to-end berhasil

---

## 💡 Tips

1. **Simpan URL Railway** di notes (akan berguna nanti)
2. **Check Railway logs** jika ada masalah
3. **Monitor usage** di Railway dashboard (free tier ada limit)
4. **Custom domain** bisa ditambahkan nanti (opsional)

---

**Setelah dapat URL Railway, paste ke Vercel environment variables dan website akan fully functional!** 🚀
