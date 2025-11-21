# ✅ Perubahan: Prediksi 1 Hari Ke Depan

Semua file sudah diubah dari prediksi **2 hari** menjadi **1 hari** ke depan.

## 📝 File yang Diubah

### Frontend:
- ✅ `src/App.jsx` - Mengubah target date dari +2 menjadi +1 hari
- ✅ `src/components/SidebarFilters.jsx` - Label "Prediksi (1 Hari)"
- ✅ `src/components/PredictionLayer.jsx` - Teks prediksi 1 hari
- ✅ `src/services/predictionService.js` - Function getPredictions1DayAhead

### Backend/ML:
- ✅ `ml-prediction/src/feature_engineering.py` - prediction_days=1
- ✅ `ml-prediction/src/model_training.py` - Nama file model: *_1day.*
- ✅ `ml-prediction/src/prediction.py` - Load model *_1day.*
- ✅ `ml-prediction/train_models.py` - prediction_days=1
- ✅ `ml-prediction/api/prediction_api.py` - Default +1 hari

## 🚀 Langkah Selanjutnya

**1. Hentikan training yang sedang berjalan** (jika ada) dengan Ctrl+C

**2. Hapus data/model lama** (jika sudah ada training sebelumnya):
```powershell
Remove-Item -Recurse -Force ml-prediction\data
```

**3. Jalankan training ulang**:
```powershell
cd ml-prediction
.\venv\Scripts\python.exe train_models.py --full-pipeline --days 365 --model-type rf
```

**4. Setelah training selesai, jalankan API**:
```powershell
.\venv\Scripts\python.exe api\prediction_api.py
```

**5. Test di frontend** - Refresh browser dan klik "Prediksi (1 Hari)"

---

**Catatan**: Model sekarang akan menyimpan dengan nama `*_1day.*` (bukan `*_2day.*`)

