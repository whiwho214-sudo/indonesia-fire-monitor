# ⚠️ Jika Training Terlalu Lama (>1 jam)

## Problem
Training sudah berjalan lebih dari 1 jam dan belum selesai. Ini biasanya karena:
- Algoritma terlalu lambat untuk data besar
- Memory usage tinggi
- CPU tidak cukup cepat

## ✅ Solusi: Reset dan Jalankan Ulang dengan Optimasi

### Langkah 1: Hentikan Proses yang Sedang Berjalan

Tekan `Ctrl+C` di terminal tempat training berjalan, atau tutup terminal.

### Langkah 2: Hapus Data yang Sudah Diproses (Opsional)

Jika ingin mulai dari awal:
```powershell
cd ml-prediction
Remove-Item -Recurse -Force data\processed -ErrorAction SilentlyContinue
```

### Langkah 3: Gunakan Versi Optimized

Kode sudah dioptimasi! Sekarang jalankan ulang:

```powershell
.\venv\Scripts\python.exe train_models.py --full-pipeline --days 365 --model-type rf
```

**Versi baru akan lebih cepat!** Estimasi waktu sekarang:
- Creating temporal features: **2-5 menit** (bukan 1 jam!)
- Total training: **10-15 menit**

### Langkah 4: Jika Masih Lambat - Kurangi Data

Jika masih lambat, kurangi jumlah hari data:

```powershell
# Coba dengan 180 hari (6 bulan) - lebih cepat
.\venv\Scripts\python.exe train_models.py --full-pipeline --days 180 --model-type rf
```

Atau bahkan 90 hari:
```powershell
.\venv\Scripts\python.exe train_models.py --full-pipeline --days 90 --model-type rf
```

---

## 🚀 Quick Fix - Restart dengan Optimized Code

1. **Hentikan proses** (Ctrl+C)
2. **Jalankan ulang:**
   ```powershell
   cd ml-prediction
   .\venv\Scripts\python.exe train_models.py --full-pipeline --days 365 --model-type rf
   ```

Sekarang akan jauh lebih cepat! ⚡

