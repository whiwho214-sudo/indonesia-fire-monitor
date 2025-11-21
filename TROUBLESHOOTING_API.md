# 🔧 Troubleshooting: API Tidak Terhubung

Jika API sudah berjalan di terminal tapi masih tidak terhubung dari aplikasi, ikuti langkah-langkah berikut:

## ✅ CHECKLIST PENTING

### 1. Pastikan API Benar-Benar Berjalan
Cek di terminal API, harus muncul:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### 2. Test API Langsung dari Browser
Buka browser dan kunjungi:
```
http://localhost:8000
```

**Harus muncul JSON seperti ini:**
```json
{
  "message": "Hotspot Prediction API",
  "version": "1.0.0",
  "endpoints": {...}
}
```

✅ **Jika bisa dibuka di browser** = API berjalan normal
❌ **Jika tidak bisa dibuka** = Ada masalah dengan API atau port

---

## 🧪 TEST DARI BROWSER CONSOLE

### Langkah 1: Buka Browser Console
1. Buka aplikasi React di browser
2. Tekan **F12** untuk membuka Developer Tools
3. Pilih tab **Console**

### Langkah 2: Test Koneksi
Ketik di console:
```javascript
window.testPredictionAPI()
```

### Hasil yang Diharapkan:
- ✅ **SUCCESS**: Muncul response dari API
- ❌ **ERROR**: Muncul error message

---

## 🔍 MENGANALISA ERROR

### Error: `ERR_CONNECTION_REFUSED`
**Penyebab**: API tidak berjalan atau port tidak bisa diakses

**Solusi**:
1. Pastikan API berjalan di terminal
2. Cek apakah ada error di terminal API
3. Coba akses `http://localhost:8000` di browser

### Error: `ERR_NETWORK` atau `Network Error`
**Penyebab**: Firewall memblokir atau masalah koneksi

**Solusi**:
1. Cek Windows Firewall
2. Coba restart API
3. Coba akses dari browser langsung

### Error: `CORS policy`
**Penyebab**: CORS di API tidak aktif (tapi sudah ada CORS middleware)

**Solusi**:
1. Pastikan CORS middleware aktif di API
2. Cek terminal API - ada error CORS?

### Error: `Timeout`
**Penyebab**: API terlalu lama memproses

**Solusi**:
1. Cek terminal API - apakah ada error saat processing?
2. Coba dengan `grid_size` yang lebih besar (misal 0.5)
3. Cek model - apakah model ada dan valid?

---

## 🔎 DEBUG DETAILED

### 1. Cek Log di Terminal API
Saat Anda klik checkbox "Prediksi" di aplikasi, **cek terminal API**:
- Apakah ada request masuk? (Harus muncul: `📥 Received request: ...`)
- Apakah ada error message?

### 2. Test dari File HTML
1. Buka file `TEST_API_CONNECTION.html` di browser
2. Klik tombol "Test Root Endpoint"
3. Lihat hasilnya

### 3. Test dengan curl (jika ada)
Buka terminal baru dan jalankan:
```powershell
curl http://localhost:8000/
```

Harus muncul JSON response.

---

## 🛠️ SOLUSI UMUM

### Solusi 1: Restart API
1. Tekan **Ctrl+C** di terminal API untuk stop
2. Jalankan lagi: `.\venv\Scripts\python.exe api\prediction_api.py`

### Solusi 2: Cek Port
Cek apakah port 8000 sudah digunakan:
```powershell
netstat -ano | findstr :8000
```

### Solusi 3: Cek Firewall
1. Buka Windows Defender Firewall
2. Pastikan Python tidak diblokir
3. Atau tambahkan exception untuk port 8000

### Solusi 4: Refresh Browser
1. Tekan **Ctrl+Shift+R** untuk hard refresh
2. Atau tutup dan buka browser lagi

### Solusi 5: Cek URL di Frontend
Buka browser console (F12) dan ketik:
```javascript
console.log('API URL:', import.meta.env.VITE_PREDICTION_API_URL || 'http://localhost:8000')
```

Harus muncul: `http://localhost:8000`

---

## 📋 LOG YANG HARUS MUNCUL DI TERMINAL API

Saat aplikasi mencoba connect, harus muncul di terminal API:

### Request Root Endpoint:
```
INFO:     127.0.0.1:XXXXX - "GET / HTTP/1.1" 200 OK
```

### Request Grid Endpoint:
```
📥 Received request: bbox=95,-11,141,6, date=2024-XX-XX, model_type=both, grid_size=0.2
INFO:     127.0.0.1:XXXXX - "GET /api/predictions/grid?bbox=... HTTP/1.1" 200 OK
```

### Jika Ada Error:
```
❌ Error in get_prediction_grid: ...
❌ Error type: ...
❌ Traceback: ...
```

---

## ⚠️ MASALAH UMUM

### Problem: API berjalan tapi tidak ada request masuk
**Penyebab**: Frontend tidak mengirim request atau URL salah

**Solusi**:
1. Buka browser console (F12)
2. Cek tab **Network**
3. Refresh dan klik checkbox "Prediksi"
4. Cari request ke `localhost:8000`
5. Cek apakah request dikirim atau tidak

### Problem: Request masuk tapi error 500
**Penyebab**: Error di API saat processing

**Solusi**:
1. Cek terminal API - ada error message?
2. Cek model - apakah ada di `data/models/random_forest_1day.pkl`?
3. Cek log error di terminal

### Problem: CORS Error
**Penyebab**: CORS tidak aktif (tapi sudah ada middleware)

**Solusi**:
1. Pastikan CORS middleware aktif di `prediction_api.py`
2. Cek apakah ada error CORS di terminal

---

## 🆘 MASIH TIDAK BISA?

Jika semua solusi di atas sudah dicoba tapi masih tidak bisa:

1. **Kirim screenshot** dari:
   - Terminal API (yang menjalankan API)
   - Browser Console (F12)
   - Error message di aplikasi

2. **Jalankan test**:
   - Buka `http://localhost:8000` di browser
   - Jalankan `window.testPredictionAPI()` di console
   - Kirim hasilnya

3. **Cek log**:
   - Copy semua log dari terminal API
   - Copy semua log dari browser console (tab Console dan Network)

