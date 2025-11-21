# 🚀 Quick Start: Prediksi Hotspot 2 Hari Ke Depan

Panduan cepat untuk memulai menggunakan sistem prediksi hotspot dengan **LSTM (Deep Learning)** dan **Random Forest**.

## ⚡ Quick Start (3 Langkah)

### 1. Setup Environment

```bash
cd ml-prediction
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

### 2. Train Models

```bash
# Train model dengan data 365 hari (butuh waktu ~10-30 menit)
python train_models.py --full-pipeline --days 365 --model-type both
```

### 3. Jalankan API & Frontend

```bash
# Terminal 1: Jalankan API
python api/prediction_api.py

# Terminal 2: Jalankan Frontend
cd ..
npm run dev
```

## 🎯 Cara Menggunakan

1. **Buka aplikasi** di browser (biasanya `http://localhost:5173`)
2. **Aktifkan layer "Predictions"** di sidebar kiri
3. **Prediksi akan muncul** di map dengan warna:
   - 🔴 **Merah**: Risiko tinggi (probabilitas ≥ 70%)
   - 🟠 **Orange**: Risiko sedang (probabilitas 40-70%)
   - 🟡 **Kuning**: Risiko rendah (probabilitas < 40%)

## 📊 Informasi Prediksi

Prediksi menampilkan:
- **Lokasi** koordinat yang diprediksi
- **Tanggal prediksi** (2 hari ke depan dari hari ini)
- **Probabilitas** kemungkinan hotspot (0-100%)
- **Tingkat risiko** (Tinggi/Sedang/Rendah)
- **Model yang digunakan** (LSTM, Random Forest, atau kombinasi)

## 🔧 Troubleshooting

### Problem: "Model not found"
**Solusi**: Pastikan sudah menjalankan training terlebih dahulu:
```bash
python train_models.py --full-pipeline --days 365
```

### Problem: API tidak bisa diakses
**Solusi**: Pastikan API berjalan di terminal dan tidak ada error

### Problem: Tidak ada prediksi muncul
**Solusi**: 
- Check console browser untuk error
- Pastikan API URL sudah dikonfigurasi di `.env`
- Pastikan model sudah dilatih dengan data yang cukup

## 📚 Dokumentasi Lengkap

Lihat `GUIDE_PREDIKSI_2_HARI.md` untuk dokumentasi lengkap.

## ✅ Checklist

- [ ] Environment setup
- [ ] Models trained
- [ ] API running
- [ ] Frontend running
- [ ] Predictions layer enabled
- [ ] Predictions visible on map

---

**Selamat menggunakan! 🔥🔮**

