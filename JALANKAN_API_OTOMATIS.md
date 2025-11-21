# 🚀 Cara Menjalankan API Secara Otomatis

## Opsi 1: Gunakan Script PowerShell (Recommended)

**Double-click file ini:**
```
ml-prediction\start_prediction_api.ps1
```

Atau jalankan di PowerShell:
```powershell
cd ml-prediction
.\start_prediction_api.ps1
```

Script ini akan:
1. ✅ Cek apakah virtual environment ada (buat jika belum)
2. ✅ Install dependencies jika perlu
3. ✅ Cek apakah model sudah dilatih
4. ✅ Jika model belum ada, jalankan training otomatis (10-30 menit)
5. ✅ Setelah training selesai, jalankan API otomatis

---

## Opsi 2: Gunakan Script Batch (.bat)

**Double-click file ini:**
```
ml-prediction\start_prediction_api.bat
```

---

## Opsi 3: Manual (Step by Step)

### Terminal 1 - Training (jika model belum ada):
```powershell
cd ml-prediction
.\venv\Scripts\python.exe train_models.py --full-pipeline --days 365 --model-type rf
```

### Terminal 2 - API (setelah training selesai):
```powershell
cd ml-prediction
.\venv\Scripts\python.exe api\prediction_api.py
```

---

## ⚠️ Catatan Penting

1. **Training membutuhkan waktu 10-30 menit** - Jangan tutup terminal saat training
2. **API harus tetap berjalan** - Jangan tutup terminal saat menggunakan prediksi
3. **Jika training error**, cek:
   - Internet connection aktif
   - NASA API key sudah dikonfigurasi
   - Virtual environment sudah diaktifkan

---

## ✅ Verifikasi API Berjalan

Buka browser dan kunjungi:
```
http://localhost:8000/api/models/status
```

Jika muncul JSON response, API sudah berjalan!

---

**Sekarang: Double-click `ml-prediction\start_prediction_api.ps1` atau jalankan di PowerShell!**

