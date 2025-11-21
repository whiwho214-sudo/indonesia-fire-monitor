# 🚀 Cara Menjalankan Prediction API

## Quick Start

```bash
# 1. Masuk ke direktori ml-prediction
cd ml-prediction

# 2. Aktifkan virtual environment (jika belum)
venv\Scripts\activate  # Windows
# atau
source venv/bin/activate  # Linux/Mac

# 3. Jalankan API
python api/prediction_api.py
```

API akan berjalan di: `http://localhost:8000`

## Verifikasi API Berjalan

Buka browser dan kunjungi:
- `http://localhost:8000` - Halaman utama API
- `http://localhost:8000/api/models/status` - Status model

Jika berhasil, Anda akan melihat JSON response.

## Troubleshooting

### Problem: "No module named 'fastapi'"
**Solusi**: Install dependencies
```bash
pip install -r requirements.txt
```

### Problem: "Model not found"
**Solusi**: Pastikan model sudah dilatih
```bash
python train_models.py --full-pipeline --days 365 --model-type both
```

### Problem: Port 8000 sudah digunakan
**Solusi**: Ubah port di `prediction_api.py`:
```python
uvicorn.run(app, host="0.0.0.0", port=8001)  # Ganti ke port lain
```
Dan update `.env` di frontend:
```
VITE_PREDICTION_API_URL=http://localhost:8001
```

## Setup Lengkap (First Time)

Jika belum pernah setup:

```bash
# 1. Setup environment
cd ml-prediction
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# 2. Train models (butuh waktu 10-30 menit)
python train_models.py --full-pipeline --days 365 --model-type both

# 3. Jalankan API
python api/prediction_api.py
```

## Check Status

Setelah API berjalan, test dengan:
```bash
# Di terminal lain atau browser
curl http://localhost:8000/api/models/status
```

Atau buka di browser: `http://localhost:8000/api/models/status`

---

**Setelah API berjalan, refresh aplikasi frontend dan coba lagi!** 🔄

