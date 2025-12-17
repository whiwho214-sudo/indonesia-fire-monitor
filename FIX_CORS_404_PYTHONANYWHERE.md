# 🔧 Fix CORS & 404 Error di PythonAnywhere

## ❌ Masalah dari Screenshot

**Error 1: CORS Policy**
```
Access to XMLHttpRequest at 'https://nicocode.pythonanywhere.com/api/predictions/grid...' 
from origin 'https://indonesia-fire-monitor.vercel.app' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present
```

**Error 2: 404 Not Found**
```
GET https://nicocode.pythonanywhere.com/api/predictions/grid?bbox=... 
net::ERR_FAILED 404 (Not Found)
```

---

## ✅ Solusi: Fix CORS & Endpoint

### **Step 1: Update Code CORS (SUDAH DIPERBAIKI ✅)**

Saya sudah update code untuk fix CORS. Sekarang perlu:

1. **Push code ke GitHub**:
```bash
git add .
git commit -m "Fix CORS for PythonAnywhere"
git push
```

2. **Pull di PythonAnywhere**:
```bash
cd ~/indonesia-fire-monitor
git pull
```

---

### **Step 2: Fix Endpoint Path (Jika Masih 404)**

**Cek endpoint di PythonAnywhere:**

1. **Buka**: `https://nicocode.pythonanywhere.com/docs`
2. **Cek** apakah endpoint `/api/predictions/grid` ada di Swagger UI

**Jika tidak ada**, kemungkinan:
- API belum reload setelah update code
- Path endpoint salah

**Fix:**
1. **Reload web app** di PythonAnywhere (Web tab → Reload)
2. **Test lagi** `/docs` endpoint

---

### **Step 3: Test API Langsung**

**Buka di browser:**
```
https://nicocode.pythonanywhere.com/api/predictions/grid?bbox=95,-11,141,6&date=2025-12-18&grid_size=0.5
```

**Harus return JSON**, bukan 404.

**Jika masih 404:**
- Cek error logs di PythonAnywhere Web tab
- Cek apakah API running
- Cek path endpoint di code

---

### **Step 4: Reload Web App**

1. **PythonAnywhere** → **Web** tab
2. **Klik "Reload"** (tombol hijau)
3. **Tunggu** sampai status jadi "Running"
4. **Test lagi** di website Vercel

---

## 🚨 Troubleshooting Detail

### **Problem 1: CORS Masih Error**

**Gejala**: Masih muncul CORS error di console

**Fix**:
1. **Pastikan** code sudah di-update (CORS middleware)
2. **Pull** code terbaru di PythonAnywhere:
```bash
cd ~/indonesia-fire-monitor
git pull
```
3. **Reload** web app
4. **Clear browser cache** (Ctrl+Shift+Delete)
5. **Test lagi**

---

### **Problem 2: 404 Not Found**

**Gejala**: Endpoint tidak ditemukan

**Fix**:
1. **Cek** endpoint ada di `/docs`:
   - Buka: `https://nicocode.pythonanywhere.com/docs`
   - Cari endpoint `/api/predictions/grid`
   - Harus ada di list

2. **Jika tidak ada**:
   - Cek error logs di PythonAnywhere
   - Cek apakah code sudah di-pull
   - Cek apakah API running

3. **Test root endpoint**:
   ```
   https://nicocode.pythonanywhere.com/
   ```
   Harus return response OK

---

### **Problem 3: API Tidak Running**

**Gejala**: Semua endpoint return error

**Fix**:
1. **Web** tab → **Error log** section
2. **Baca error message**
3. **Fix sesuai error**:
   - Missing module → Install dependencies
   - Import error → Fix import path
   - Path error → Fix path di WSGI

---

## 🧪 Test Checklist

### **Test 1: API Health**
```
https://nicocode.pythonanywhere.com/
```
✅ Harus return JSON atau message OK

### **Test 2: API Docs**
```
https://nicocode.pythonanywhere.com/docs
```
✅ Harus muncul Swagger UI dengan semua endpoints

### **Test 3: Grid Endpoint**
```
https://nicocode.pythonanywhere.com/api/predictions/grid?bbox=95,-11,141,6&date=2025-12-18&grid_size=0.5
```
✅ Harus return JSON dengan predictions (bukan 404)

### **Test 4: CORS**
**Di browser console Vercel:**
```javascript
fetch('https://nicocode.pythonanywhere.com/api/predictions/grid?bbox=95,-11,141,6&date=2025-12-18&grid_size=0.5')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```
✅ Harus return data, tidak ada CORS error

---

## 📋 Checklist Fix

- [ ] Code CORS di-update (sudah ✅)
- [ ] Code di-push ke GitHub
- [ ] Code di-pull di PythonAnywhere
- [ ] Web app di-reload
- [ ] Test `/docs` endpoint berhasil
- [ ] Test `/api/predictions/grid` tidak 404
- [ ] Test CORS dari Vercel berhasil
- [ ] Website Vercel redeployed
- [ ] Test prediction berhasil

---

## 🚀 Quick Fix Steps

```
1. Push code ke GitHub (dari komputer)
   git add .
   git commit -m "Fix CORS"
   git push

2. Pull di PythonAnywhere
   cd ~/indonesia-fire-monitor
   git pull

3. Reload web app
   Web tab → Reload

4. Test API
   https://nicocode.pythonanywhere.com/docs

5. Test dari Vercel
   Buka website → Test prediction
```

---

## ✅ Setelah Fix

**Error akan hilang jika:**
- ✅ CORS dikonfigurasi dengan benar
- ✅ Endpoint `/api/predictions/grid` ada dan jalan
- ✅ API running di PythonAnywhere
- ✅ Website Vercel sudah redeploy

**Prediksi akan muncul!** 🎉

---

**Total waktu fix: ~5 menit!** 🚀
