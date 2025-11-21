# 🔥 CARA JALANKAN PREDICTION API

## ⚠️ PENTING: API HARUS BERJALAN!

API **harus berjalan** sebelum Anda bisa menggunakan fitur prediksi di aplikasi.

---

## 🚀 CARA CEPAT (REKOMENDASI)

### Windows:
**Double-click file: `RUN_API.bat`**

Script ini akan:
- ✅ Memeriksa virtual environment
- ✅ Memeriksa model
- ✅ Menjalankan API secara otomatis

**JANGAN TUTUP WINDOW TERSEBUT!** Biarkan tetap terbuka.

---

## 📋 CARA MANUAL

### Langkah 1: Buka PowerShell/Command Prompt
Buka PowerShell atau Command Prompt di folder **ROOT project** (bukan di ml-prediction).

### Langkah 2: Masuk ke folder ml-prediction
```powershell
cd ml-prediction
```

### Langkah 3: Jalankan API
**Opsi A - Menggunakan python.exe langsung:**
```powershell
.\venv\Scripts\python.exe api\prediction_api.py
```

**Opsi B - Mengaktifkan venv dulu:**
```powershell
.\venv\Scripts\Activate.ps1
python api\prediction_api.py
```

### Langkah 4: Pastikan API berjalan
Anda akan melihat pesan:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

✅ **Jika melihat pesan ini, API sudah berjalan!**

---

## 🧪 TEST API BERJALAN ATAU TIDAK

### Cara 1: Buka di Browser
Buka browser dan kunjungi:
```
http://localhost:8000
```

Harus muncul JSON dengan info API seperti:
```json
{
  "message": "Hotspot Prediction API",
  "version": "1.0.0",
  "endpoints": {...}
}
```

### Cara 2: Test dari Browser Console
1. Buka aplikasi React
2. Tekan **F12** untuk membuka console
3. Ketik: `window.testPredictionAPI()`
4. Lihat hasilnya di console

---

## ❌ TROUBLESHOOTING

### Error: "Port 8000 already in use"
**Solusi:**
1. Cari process yang menggunakan port 8000:
   ```powershell
   netstat -ano | findstr :8000
   ```
2. Tutup process tersebut atau gunakan port lain

### Error: "Module not found"
**Solusi:**
```powershell
cd ml-prediction
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

### Error: "Model not found"
**Solusi:**
Anda perlu menjalankan training terlebih dahulu:
```powershell
cd ml-prediction
.\venv\Scripts\python.exe train_models.py --full-pipeline --days 365 --model-type rf
```

### API berjalan tapi aplikasi tidak bisa connect
**Solusi:**
1. Pastikan API benar-benar berjalan (cek di browser: http://localhost:8000)
2. Cek firewall Windows
3. Coba restart API
4. Buka browser console (F12) dan jalankan: `window.testPredictionAPI()`

---

## ✅ CHECKLIST SEBELUM MENGGUNAKAN PREDIKSI

- [ ] API sudah berjalan di terminal
- [ ] Muncul pesan: `INFO: Uvicorn running on http://0.0.0.0:8000`
- [ ] Bisa akses http://localhost:8000 di browser
- [ ] Terminal API **MASIH TERBUKA** (jangan tutup!)
- [ ] Aplikasi React sudah terbuka di browser

---

## 📝 CATATAN

- **API harus terus berjalan** saat Anda menggunakan fitur prediksi
- Jangan tutup terminal/window yang menjalankan API
- Jika Anda menutup terminal, API akan berhenti dan fitur prediksi tidak akan bekerja
- Untuk production, gunakan process manager seperti PM2 atau systemd

---

## 🆘 MASIH ERROR?

1. **Cek console browser (F12)** - ada error apa?
2. **Cek terminal API** - ada error message?
3. **Test API langsung** - buka http://localhost:8000
4. **Cek firewall** - pastikan port 8000 tidak diblokir

