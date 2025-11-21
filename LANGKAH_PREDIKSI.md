# 📋 Langkah-Langkah Menjalankan Prediksi 2 Hari Ke Depan

## 🎯 Tujuan
Menjalankan API prediction sehingga fitur "Prediksi 2 Hari" bisa digunakan di aplikasi.

---

## ✅ Langkah 1: Cek Apakah Model Sudah Dilatih

**Buka terminal/PowerShell di direktori project**, lalu cek:

```powershell
cd ml-prediction
dir data\models
```

### Jika folder `data/models` kosong atau tidak ada file:
👉 **Anda perlu train model dulu** (lihat Langkah 2)

### Jika sudah ada file seperti:
- `random_forest_2day.pkl`
- `lstm_2day.h5`
- `rf_scaler_2day.pkl`
- `lstm_scaler_2day.pkl`

👉 **Langsung ke Langkah 3**

---

## 🧠 Langkah 2: Train Model (Hanya jika belum ada model)

**Butuh waktu 10-30 menit!**

```powershell
# 1. Masuk ke direktori ml-prediction
cd ml-prediction

# 2. Aktifkan virtual environment
venv\Scripts\activate

# 3. Install dependencies (jika belum)
pip install -r requirements.txt

# 4. Train model (INIJUGAH BUTUH WAKTU!)
python train_models.py --full-pipeline --days 365 --model-type both
```

**Tunggu sampai selesai!** Anda akan melihat output seperti:
```
✅ Random Forest Results:
   Accuracy: 0.85
   F1 Score: 0.78

✅ LSTM Results:
   Accuracy: 0.82
   F1 Score: 0.75

✅ Training Pipeline Completed Successfully!
```

---

## 🚀 Langkah 3: Jalankan Prediction API

**Buka terminal/PowerShell baru** (biarkan terminal training tetap jalan jika masih training):

```powershell
# 1. Masuk ke direktori ml-prediction
cd ml-prediction

# 2. Aktifkan virtual environment
venv\Scripts\activate

# 3. Jalankan API
python api/prediction_api.py
```

**Anda akan melihat output:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**JANGAN TUTUP TERMINAL INI!** Biarkan tetap berjalan.

---

## ✅ Langkah 4: Verifikasi API Berjalan

**Buka browser** dan kunjungi:
```
http://localhost:8000/api/models/status
```

Jika muncul JSON dengan info model, berarti API sudah berjalan! ✅

---

## 🎨 Langkah 5: Test di Frontend

1. **Kembali ke aplikasi React** (jika belum jalan, jalankan `npm run dev` di terminal lain)
2. **Refresh browser** (F5)
3. **Klik checkbox "Prediksi (2 Hari)"** di sidebar kiri
4. **Tunggu loading** (akan muncul spinner "Memuat prediksi 2 hari ke depan...")
5. **Prediksi akan muncul** di map dengan warna:
   - 🔴 Merah = Risiko Tinggi (≥70%)
   - 🟠 Orange = Risiko Sedang (40-70%)
   - 🟡 Kuning = Risiko Rendah (<40%)

---

## 🐛 Troubleshooting

### ❌ Error: "No module named 'fastapi'"

```powershell
cd ml-prediction
venv\Scripts\activate
pip install -r requirements.txt
```

### ❌ Error: "Model not found"

👉 Anda perlu train model dulu (Langkah 2)

### ❌ Error: "Port 8000 already in use"

```powershell
# Cari dan tutup aplikasi yang menggunakan port 8000
# Atau ubah port di api/prediction_api.py
```

### ❌ API jalan tapi tidak ada prediksi muncul

1. Cek console browser (F12) untuk error detail
2. Pastikan API benar-benar berjalan (cek `http://localhost:8000`)
3. Pastikan model sudah dilatih dengan baik

---

## 📝 Ringkasan Quick Start

**Jika model sudah ada:**
```powershell
cd ml-prediction
venv\Scripts\activate
python api/prediction_api.py
```

**Jika model belum ada:**
```powershell
cd ml-prediction
venv\Scripts\activate
pip install -r requirements.txt
python train_models.py --full-pipeline --days 365 --model-type both
# Setelah selesai:
python api/prediction_api.py
```

---

## 🎯 Checklist

- [ ] Virtual environment aktif
- [ ] Dependencies terinstall (`pip install -r requirements.txt`)
- [ ] Model sudah dilatih (atau sudah ada di `data/models/`)
- [ ] API prediction berjalan (`python api/prediction_api.py`)
- [ ] API bisa diakses (`http://localhost:8000/api/models/status`)
- [ ] Frontend refresh dan layer "Prediksi (2 Hari)" aktif

---

**Selamat mencoba! 🔥🔮**

