# 🔧 Setup Environment Variables: Render & Vercel

## 📋 Dua Tempat Set Environment Variables

### 1. **Render.com** (Untuk API Backend)
### 2. **Vercel** (Untuk Website Frontend)

---

## 🚀 1. Environment Variables di Render (API)

### **Apakah Perlu Set di Render?**

**Biasanya TIDAK perlu**, karena:
- ✅ Render otomatis set `PORT` environment variable
- ✅ API code sudah handle `os.environ.get("PORT")`
- ✅ Tidak ada API keys yang perlu di-hide

### **Jika Perlu Set (Opsional):**

**Contoh kasus:**
- Ada API key eksternal yang perlu di-hide
- Ada database connection string
- Ada config khusus

**Cara Set:**
1. **Di halaman Environment Variables Render** (yang sedang Anda buka)
2. **Klik "Add Environment Variable"**
3. **Isi**:
   - **NAME**: Nama variable (contoh: `DATABASE_URL`)
   - **VALUE**: Nilai variable
4. **Save**

**Untuk API Prediction ini:**
- **TIDAK perlu** set environment variables di Render
- **Biarkan kosong** atau langsung **"Deploy Web Service"**

---

## 🌐 2. Environment Variables di Vercel (Website Frontend)

### **INI YANG PENTING!** ⚠️

**Setelah API di Render selesai deploy:**

### Step 1: Dapatkan URL Render
1. **Render Dashboard** → **Web Service** Anda
2. **Copy URL** yang muncul, contoh:
   ```
   https://indonesia-fire-monitor-api.onrender.com
   ```

### Step 2: Set di Vercel
1. **Buka Vercel Dashboard**
2. **Pilih project**: `indonesia-fire-monitor`
3. **Settings** → **Environment Variables**
4. **Klik "+ Add"** atau **"New Variable"**
5. **Isi**:
   - **Name**: `VITE_PREDICTION_API_URL`
   - **Value**: `https://indonesia-fire-monitor-api.onrender.com` (URL Render Anda)
   - **Environment**: Centang semua (Production, Preview, Development)
6. **Save**

### Step 3: Redeploy Website
1. **Deployments** tab
2. **Redeploy** (tombol 3 dots di deployment terbaru)
3. **Tunggu 2-3 menit**
4. **Test website** → API error hilang! 🎉

---

## 📋 Checklist Lengkap

### Render (API):
- [ ] Web Service created
- [ ] Root Directory = `ml-prediction` ✅
- [ ] Build Command = `pip install -r requirements.txt` ✅
- [ ] Start Command = `uvicorn api.prediction_api:app --host 0.0.0.0 --port $PORT` ✅
- [ ] Environment Variables = **Kosong** (tidak perlu) ✅
- [ ] Deploy successful ✅
- [ ] URL Render di-copy ✅

### Vercel (Website):
- [ ] Environment Variable `VITE_PREDICTION_API_URL` di-set ✅
- [ ] Value = URL Render ✅
- [ ] Environment = All (Production, Preview, Development) ✅
- [ ] Website redeployed ✅
- [ ] Test prediction berhasil ✅

---

## 🎯 Langkah Selanjutnya (Sekarang)

### **Di Render (Halaman yang Sedang Dibuka):**

1. **Jika tidak perlu environment variables**:
   - **Klik "Deploy Web Service"** (tombol hitam di bawah)
   - **Tunggu deploy selesai** (5-10 menit)

2. **Jika perlu set environment variables**:
   - **Klik "Add Environment Variable"**
   - **Isi NAME dan VALUE**
   - **Klik "Deploy Web Service"**

### **Setelah Deploy Selesai:**

1. **Copy URL Render** (akan muncul di dashboard)
2. **Buka Vercel Dashboard**
3. **Set environment variable** `VITE_PREDICTION_API_URL`
4. **Redeploy website**
5. **Selesai!** 🎉

---

## 💡 Tips

### **Render Environment Variables:**
- **Tidak perlu** untuk API prediction ini
- **Biarkan kosong** atau langsung deploy
- **PORT** otomatis di-set oleh Render

### **Vercel Environment Variables:**
- **WAJIB** set `VITE_PREDICTION_API_URL`
- **Format**: `https://your-api.onrender.com` (dengan https://)
- **Jangan** pakai `http://localhost:8000`

---

## 🧪 Test Setelah Setup

### **Test API Render:**
1. **Buka URL Render** di browser
2. **Tambahkan `/docs`**: `https://your-api.onrender.com/docs`
3. **Harus muncul** Swagger UI → API berhasil!

### **Test Website Vercel:**
1. **Buka website Vercel**
2. **Aktifkan layer "Predictions"**
3. **Check browser console** (F12)
4. **Tidak ada error** → Berhasil! ✅

---

## 🚨 Troubleshooting

### **Error: "Cannot connect to API"**
- **Check URL** di Vercel environment variable sudah benar
- **Check API Render** masih running (tidak sleep)
- **Check CORS** di API Render allow origin Vercel

### **Error: "API timeout"**
- **Render free tier sleep** setelah 15 menit idle
- **First request** setelah sleep mungkin lambat (cold start)
- **Tunggu 30 detik** untuk cold start

---

## ✅ Quick Action (Sekarang)

**Di halaman Render yang sedang dibuka:**

1. **Klik "Deploy Web Service"** (tombol hitam di bawah)
2. **Tunggu deploy selesai** (5-10 menit)
3. **Copy URL Render** setelah deploy
4. **Set di Vercel** environment variables
5. **Redeploy website** → Done! 🚀

---

**Setelah deploy Render selesai, lanjut set environment variable di Vercel!** 🎯
