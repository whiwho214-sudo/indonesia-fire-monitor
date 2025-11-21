# 🚀 CARA CEPAT: Jalankan Prediction API

## ⚡ Cara Paling Mudah

**Double-click file ini:**
```
ml-prediction\RUN_TRAINING_AND_API.ps1
```

Script akan otomatis:
1. ✅ Cek apakah model sudah ada
2. ✅ Jika belum ada → jalankan training (10-30 menit)
3. ✅ Setelah training selesai → jalankan API otomatis
4. ✅ API akan berjalan di http://localhost:8000

---

## 🔧 Jika Muncul Error PowerShell Execution Policy

Jalankan di PowerShell sebagai Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Kemudian double-click script lagi.

---

## 📋 Manual (Jika Script Tidak Bekerja)

### Langkah 1: Training Model
Buka PowerShell di folder `ml-prediction`:
```powershell
.\venv\Scripts\python.exe train_models.py --full-pipeline --days 365 --model-type rf
```

**Tunggu sampai selesai!** (10-30 menit)

### Langkah 2: Jalankan API
Setelah training selesai, di terminal yang sama atau terminal baru:
```powershell
.\venv\Scripts\python.exe api\prediction_api.py
```

**Jangan tutup terminal ini!** Biarkan API tetap berjalan.

---

## ✅ Verifikasi

Buka browser dan kunjungi:
```
http://localhost:8000/api/models/status
```

Jika muncul JSON, API sudah berjalan! ✅

---

## 🎯 Quick Start

**Sekarang: Double-click `RUN_TRAINING_AND_API.ps1`**

Script akan menangani semuanya secara otomatis! 🚀

