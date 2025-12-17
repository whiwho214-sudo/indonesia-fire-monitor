# ⚡ Quick Fix: API Error di Website Vercel

## ✅ Yang Sudah Diperbaiki

Saya sudah update code untuk:
1. ✅ **Error message lebih jelas** untuk production
2. ✅ **Auto-detect** apakah di production atau development
3. ✅ **Troubleshooting guide** yang berbeda untuk production vs development

## 🚀 Langkah Selanjutnya (Pilih Salah Satu)

### Opsi 1: Deploy API ke Railway (RECOMMENDED - 15 menit)

#### Step 1: Deploy API
1. **Buka**: https://railway.app/
2. **Login dengan GitHub**
3. **New Project** → **Deploy from GitHub**
4. **Repository**: `indonesia-fire-monitor`
5. **Root Directory**: `ml-prediction` ⚠️ PENTING!
6. **Deploy** → Tunggu 10 menit
7. **Copy URL Railway** (contoh: `https://abc123.up.railway.app`)

#### Step 2: Set di Vercel
1. **Vercel Dashboard** → Project `indonesia-fire-monitor`
2. **Settings** → **Environment Variables**
3. **Add**:
   ```
   Name: VITE_PREDICTION_API_URL
   Value: https://your-railway-url.railway.app
   ```
4. **Save**

#### Step 3: Redeploy
1. **Deployments** → **Redeploy** (tombol 3 dots)
2. **Tunggu 2-3 menit**
3. **Test website** → Error hilang! 🎉

---

### Opsi 2: Push Update Code (5 menit)

**Update code sudah siap**, tinggal push:

```bash
git add .
git commit -m "Fix API error message for production"
git push
```

**Vercel akan auto-deploy** dengan error message yang lebih baik!

---

## 📋 Checklist

### Jika Deploy API:
- [ ] Railway account created
- [ ] API deployed (root: ml-prediction)
- [ ] URL Railway di-copy
- [ ] Environment variable set di Vercel
- [ ] Website redeployed
- [ ] Test prediction berhasil

### Jika Cuma Update Code:
- [ ] Code committed
- [ ] Pushed ke GitHub
- [ ] Vercel auto-deploy
- [ ] Error message lebih jelas sekarang

---

## 🧪 Test Setelah Fix

1. **Buka website Vercel**
2. **Aktifkan layer "Predictions"**
3. **Check error message**:
   - **Production**: Akan kasih instruksi setup Railway
   - **Development**: Akan kasih instruksi run API local

---

## 💡 Tips

- **CORS**: Pastikan Railway API allow origin Vercel
- **Timeout**: Railway free tier mungkin sleep setelah idle
- **Logs**: Check Railway logs jika ada error

---

**Setelah fix, website akan fully functional!** 🚀
