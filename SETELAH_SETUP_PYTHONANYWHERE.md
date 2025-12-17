# ✅ Setelah Setup PythonAnywhere - Langkah Selanjutnya

## 🎯 Checklist: Apa yang Sudah Selesai?

- [x] PythonAnywhere account created
- [x] Repository cloned via Git
- [x] Dependencies installed
- [x] Web app created
- [x] WSGI configured
- [x] Web app reloaded
- [x] Test `/docs` endpoint berhasil

---

## 🚀 Langkah Selanjutnya (5 Menit)

### **Step 1: Copy URL PythonAnywhere**

**URL format:**
```
https://yourusername.pythonanywhere.com
```

**Contoh jika username Anda `indonesiafire`:**
```
https://indonesiafire.pythonanywhere.com
```

**Copy URL ini!** (akan dipakai di Step 2)

---

### **Step 2: Set di Vercel Environment Variables**

1. **Buka Vercel Dashboard**
   - Login ke https://vercel.com/
   - Pilih project: `indonesia-fire-monitor`

2. **Buka Settings**
   - Klik **"Settings"** tab
   - Klik **"Environment Variables"** di menu kiri

3. **Update Variable**
   - **Cari** variable `VITE_PREDICTION_API_URL`
   - **Klik icon pensil** (edit) atau **"Add"** jika belum ada
   - **Ganti Value** dengan URL PythonAnywhere:
     ```
     https://yourusername.pythonanywhere.com
     ```
   - **Environment**: Centang semua (Production, Preview, Development)
   - **Save**

---

### **Step 3: Redeploy Website**

1. **Deployments** tab
2. **Klik 3 dots** (⋯) di deployment terbaru
3. **Pilih "Redeploy"**
4. **Tunggu 2-3 menit** sampai deploy selesai

---

### **Step 4: Test Website**

1. **Buka website Vercel**
   - URL: `https://indonesia-fire-monitor.vercel.app`
   - Atau URL custom Anda

2. **Aktifkan layer "Predictions"**
   - Toggle switch "Prediksi (1 Hari)"
   - Harus aktif (centang biru)

3. **Tunggu beberapa detik**
   - Loading indicator akan muncul
   - Map akan menampilkan prediksi (titik merah/orange/kuning)

4. **Check browser console** (F12)
   - Tidak ada error → **Berhasil!** ✅
   - Ada error → Lihat troubleshooting di bawah

---

## ✅ Verifikasi Semua Berjalan

### **Test 1: API PythonAnywhere**
1. **Buka**: `https://yourusername.pythonanywhere.com/docs`
2. **Harus muncul** Swagger UI → API jalan ✅

### **Test 2: API Health Check**
1. **Buka**: `https://yourusername.pythonanywhere.com/`
2. **Harus return** JSON atau message OK → API sehat ✅

### **Test 3: Website Vercel**
1. **Buka website Vercel**
2. **Aktifkan "Predictions" layer**
3. **Prediksi muncul di map** → Website jalan ✅

---

## 🚨 Troubleshooting

### **Problem 1: Prediction Tidak Muncul**

**Gejala**: Layer aktif tapi tidak ada prediksi di map

**Fix**:
1. **Check browser console** (F12) untuk error
2. **Check** environment variable sudah di-set dengan benar
3. **Check** website sudah redeploy setelah set variable
4. **Test API** langsung: `https://yourusername.pythonanywhere.com/docs`

---

### **Problem 2: Error "Cannot connect to API"**

**Gejala**: Error connection di website

**Fix**:
1. **Check** URL PythonAnywhere benar (dengan `https://`)
2. **Check** API PythonAnywhere masih running (test `/docs`)
3. **Check** environment variable sudah di-set
4. **Clear browser cache** (Ctrl+Shift+Delete)

---

### **Problem 3: CORS Error**

**Gejala**: Error "CORS policy" di console

**Fix**:
1. **Check** `prediction_api.py` sudah ada CORS middleware
2. **Pastikan** `allow_origins=["*"]`
3. **Reload** web app di PythonAnywhere

---

## 📋 Final Checklist

### **PythonAnywhere:**
- [ ] API jalan (test `/docs`)
- [ ] Health check OK
- [ ] URL di-copy

### **Vercel:**
- [ ] Environment variable di-set
- [ ] Value = URL PythonAnywhere ✅
- [ ] Website redeployed
- [ ] Test prediction berhasil

### **Website:**
- [ ] Tidak ada error di console
- [ ] Prediction muncul di map
- [ ] Semua fitur berfungsi

---

## 🎯 Quick Summary

```
1. Copy URL PythonAnywhere
   → https://yourusername.pythonanywhere.com

2. Set di Vercel
   → Environment Variables
   → VITE_PREDICTION_API_URL = URL PythonAnywhere
   → Save

3. Redeploy Website
   → Deployments → Redeploy

4. Test
   → Buka website
   → Aktifkan Predictions
   → Done! ✅
```

---

## 💡 Tips

1. **Simpan URL PythonAnywhere** di notes (akan berguna nanti)
2. **Monitor error logs** di PythonAnywhere Web tab jika ada masalah
3. **Test API** langsung sebelum set di Vercel
4. **Clear browser cache** setelah redeploy

---

## ✅ Setelah Semua Selesai

**Website akan fully functional dengan:**
- ✅ Hotspot data dari NASA
- ✅ ML Prediction dari PythonAnywhere
- ✅ AQI data (mock)
- ✅ Weather data (mock)

**Semua API jalan!** 🎉

---

**Total waktu: ~5 menit untuk langkah selanjutnya!** 🚀
