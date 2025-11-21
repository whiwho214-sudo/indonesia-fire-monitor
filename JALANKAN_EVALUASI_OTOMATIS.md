# 🔍 Cara Menjalankan Evaluasi Model Secara Otomatis

## Cara Cepat (Recommended)

### Windows (.bat)
**Double-click file ini:**
```
JALANKAN_EVALUASI_OTOMATIS.bat
```

### Windows PowerShell (.ps1)
**Double-click atau right-click → Run with PowerShell:**
```
JALANKAN_EVALUASI_OTOMATIS.ps1
```

## Cara Manual

### 1. Masuk ke Folder ml-prediction
```powershell
cd ml-prediction
```

### 2. Aktifkan Virtual Environment
```powershell
.\venv\Scripts\Activate.ps1
```

### 3. Jalankan Evaluasi
```powershell
# Evaluasi dengan data 7 hari terakhir (cepat)
python evaluate_model.py --days 7

# Evaluasi dengan data 30 hari terakhir (lebih akurat)
python evaluate_model.py --days 30

# Evaluasi dengan data 90 hari terakhir (paling akurat, tapi lebih lama)
python evaluate_model.py --days 90
```

## Apa yang Dilakukan Script Evaluasi?

Script `evaluate_model.py` akan:
1. ✅ Load model yang sudah dilatih
2. ✅ Load actual hotspots dari data terbaru
3. ✅ Generate predictions untuk lokasi actual hotspots
4. ✅ Bandingkan prediksi dengan actual
5. ✅ Hitung metrics:
   - **Accuracy**: Seberapa akurat model secara keseluruhan
   - **Precision**: Seberapa banyak prediksi yang benar dari semua prediksi positif
   - **Recall**: Seberapa banyak actual hotspots yang berhasil diprediksi
   - **F1 Score**: Balance antara precision dan recall
   - **ROC AUC**: Area under ROC curve
6. ✅ Berikan rekomendasi improvement

## Interpretasi Hasil

### Accuracy (Akurasi)
- **> 80%**: Sangat baik ✅
- **70-80%**: Baik ✅
- **50-70%**: Perlu improvement ⚠️
- **< 50%**: Sangat tidak akurat ❌ → **Wajib retrain**

### Precision (Presisi)
- **> 70%**: Baik (sedikit false positives) ✅
- **50-70%**: Cukup ⚠️
- **< 50%**: Banyak false positives ❌ → **Increase threshold atau retrain**

### Recall (Recall)
- **> 70%**: Baik (tidak banyak miss) ✅
- **50-70%**: Cukup ⚠️
- **< 50%**: Banyak miss actual hotspots ❌ → **Lower threshold atau retrain**

### F1 Score
- **> 0.7**: Baik ✅
- **0.5-0.7**: Cukup ⚠️
- **< 0.5**: Perlu improvement ❌

## Setelah Evaluasi

### Jika Akurasi Rendah (< 50%)

**Wajib retrain model:**

```powershell
# Collect data lebih banyak (2 tahun)
python train_models.py --collect-data --days 730

# Prepare features
python train_models.py --prepare-features

# Train model
python train_models.py --train --model-type rf

# Atau full pipeline
python train_models.py --full-pipeline --days 730 --model-type rf
```

### Jika Precision Rendah (< 50%)

**Banyak false positives:**
- Increase prediction threshold di `ml-prediction/src/prediction.py`
- Atau retrain dengan lebih banyak negative samples

### Jika Recall Rendah (< 50%)

**Banyak miss actual hotspots:**
- Lower prediction threshold di `ml-prediction/src/prediction.py`
- Atau retrain dengan lebih banyak positive samples

### Jika Semua Metrics Baik

**Continue monitoring:**
- Evaluasi secara berkala (mingguan/bulanan)
- Retrain jika accuracy menurun
- Collect data baru secara berkala

## Tips

1. **Evaluate secara berkala**: Evaluasi setiap minggu/bulan untuk monitor performance
2. **Compare dengan baseline**: Bandingkan hasil dengan model sebelumnya
3. **Track over time**: Catat hasil evaluasi untuk melihat trend
4. **Retrain jika perlu**: Jika accuracy menurun, retrain dengan data terbaru

## Troubleshooting

### Error: "Hotspots file not found"
**Solusi:**
```powershell
# Collect data dulu
python train_models.py --collect-data --days 30
```

### Error: "Model not found"
**Solusi:**
```powershell
# Train model dulu
python train_models.py --full-pipeline --days 365 --model-type rf
```

### Error: "No actual hotspots found"
**Solusi:**
- Coba dengan `--days 30` atau `--days 90` untuk lebih banyak data
- Atau collect data lebih baru:
```powershell
python train_models.py --collect-data --days 30
```

