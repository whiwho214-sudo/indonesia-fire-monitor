# 🔧 Fix API Error di Vercel - Website Sudah Online!

## ❌ Masalah
Website sudah online di Vercel, tapi API masih mengarah ke `http://127.0.0.1:8000` (localhost) yang tidak bisa diakses dari internet.

## 🎯 Solusi: 2 Opsi

### Opsi 1: Deploy API ke Railway (RECOMMENDED - 15 menit)

#### Step 1: Deploy API ke Railway
1. **Buka**: https://railway.app/
2. **Login dengan GitHub**
3. **New Project** → **Deploy from GitHub**
4. **Pilih repository**: `indonesia-fire-monitor`
5. **PENTING**: Set **Root Directory** = `ml-prediction`
6. **Deploy** → Tunggu 10 menit
7. **Copy URL Railway** (contoh: `https://ml-prediction-production-abc123.up.railway.app`)

#### Step 2: Set Environment Variable di Vercel
1. **Buka Vercel Dashboard** → Pilih project `indonesia-fire-monitor`
2. **Settings** → **Environment Variables**
3. **Add New**:
   - **Name**: `VITE_PREDICTION_API_URL`
   - **Value**: `https://your-railway-url.railway.app` (URL dari Railway)
   - **Environment**: Production, Preview, Development (centang semua)
4. **Save**

#### Step 3: Redeploy Website
1. **Deployments** tab di Vercel
2. **Klik 3 dots** di deployment terbaru
3. **Redeploy**
4. **Tunggu 2-3 menit**

#### Step 4: Test
1. **Buka website** di Vercel
2. **Test fitur prediction**
3. **Check browser console** (F12) untuk error

---

### Opsi 2: Disable Prediction Sementara (Quick Fix - 5 menit)

Jika API belum siap, bisa disable fitur prediction dulu:

#### Step 1: Update Code
Edit file `src/components/PredictionLayer.jsx` atau komponen yang handle prediction, tambahkan check:

```javascript
// Di awal component
const isProduction = window.location.hostname !== 'localhost' && 
                     !window.location.hostname.includes('127.0.0.1')

// Di render atau logic
if (isProduction && !import.meta.env.VITE_PREDICTION_API_URL) {
  return (
    <div className="info-message">
      Fitur prediksi sedang dalam maintenance. Akan segera hadir!
    </div>
  )
}
```

#### Step 2: Push dan Deploy
```bash
git add .
git commit -m "Temporarily disable prediction in production"
git push
```
Vercel akan auto-deploy!

---

## 🚀 Quick Fix: Set Environment Variable di Vercel

### Cara Termudah (Tanpa Deploy API Dulu):

1. **Buka Vercel Dashboard**
2. **Project Settings** → **Environment Variables**
3. **Add**:
   ```
   Name: VITE_PREDICTION_API_URL
   Value: (kosongkan atau isi dengan URL API nanti)
   ```
4. **Save**
5. **Redeploy**

**Website akan tetap jalan**, hanya fitur prediction yang tidak aktif sampai API ready.

---

## 📋 Checklist Fix

### Jika Deploy API ke Railway:
- [ ] Railway account created
- [ ] API deployed di Railway
- [ ] URL Railway di-copy
- [ ] Environment variable set di Vercel
- [ ] Website redeployed
- [ ] Test prediction berhasil

### Jika Disable Sementara:
- [ ] Code updated untuk handle missing API
- [ ] Push ke GitHub
- [ ] Vercel auto-deploy
- [ ] Website tetap jalan tanpa error

---

## 🧪 Test API Railway

**Setelah API di Railway:**
1. **Health check**: `https://your-railway-url.railway.app/`
2. **API docs**: `https://your-railway-url.railway.app/docs`
3. **Test dari browser console**:
```javascript
// Di website Vercel, buka console (F12)
window.testPredictionAPI()
```

---

## 💡 Tips

1. **CORS**: Pastikan Railway API allow origin Vercel
2. **Timeout**: Railway free tier mungkin sleep setelah idle
3. **Logs**: Check Railway logs jika ada error
4. **Environment**: Pastikan environment variable di Vercel sudah benar

---

## 🎯 Recommended Workflow

1. **Deploy API ke Railway** (15 menit)
2. **Set environment variable di Vercel** (2 menit)
3. **Redeploy website** (3 menit)
4. **Test end-to-end** (5 menit)

**Total: ~25 menit untuk fix lengkap!**

---

**Setelah fix, website akan fully functional dengan API prediction!** 🚀
