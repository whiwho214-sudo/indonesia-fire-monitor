# 🎯 Cara Meningkatkan Akurasi Prediksi

## Masalah yang Mungkin Terjadi

1. **Overfitting**: Training accuracy tinggi (99%+) tapi prediksi tidak akurat
2. **Data Kurang**: Tidak cukup data training atau data tidak representative
3. **Feature Kurang Optimal**: Feature engineering perlu diperbaiki
4. **Model Parameter**: Parameter model perlu di-tune
5. **Threshold Tidak Optimal**: Prediction threshold terlalu tinggi/rendah

## 🔍 Step 1: Evaluate Model dengan Actual Data

Sebelum retrain, evaluasi model dengan data real:

```bash
# Masuk ke folder ml-prediction
cd ml-prediction

# Aktifkan virtual environment
.\venv\Scripts\Activate.ps1  # Windows

# Evaluate model dengan data 7 hari terakhir
python evaluate_model.py --days 7

# Atau lebih lama untuk evaluasi lebih akurat
python evaluate_model.py --days 30
```

Script ini akan:
- Load actual hotspots dari data terbaru
- Generate predictions untuk lokasi-lokasi actual hotspots
- Bandingkan prediksi dengan actual
- Hitung accuracy, precision, recall, F1, AUC
- Berikan rekomendasi improvement

**Lihat hasil evaluasi:**
- Accuracy < 50%: Model sangat tidak akurat → **Wajib retrain**
- Accuracy 50-70%: Model perlu improvement → **Retrain dengan lebih banyak data**
- Recall < 50%: Model miss banyak hotspots → **Lower threshold atau retrain**
- Precision < 50%: Banyak false positives → **Increase threshold atau retrain**

## Solusi

### 1. Re-train Model dengan Parameter Lebih Baik

Model sudah di-update dengan parameter yang lebih baik untuk mengurangi overfitting:
- `max_depth`: 15 (dari 20) - mengurangi overfitting
- `min_samples_split`: 10 (dari 5) - better generalization
- `min_samples_leaf`: 4 (dari 2) - better generalization
- `n_estimators`: 300 (dari 200) - lebih banyak trees
- `max_features`: 'sqrt' - mengurangi overfitting
- `oob_score`: True - untuk validasi

**Cara retrain:**

```bash
# Masuk ke folder ml-prediction
cd ml-prediction

# Aktifkan virtual environment
.\venv\Scripts\Activate.ps1  # Windows
# atau
source venv/bin/activate  # Linux/Mac

# Collect lebih banyak data (1 tahun lebih baik)
python train_models.py --collect-data --days 730  # 2 tahun

# Prepare features
python train_models.py --prepare-features

# Train model dengan parameter baru
python train_models.py --train --model-type rf
```

### 2. Collect Lebih Banyak Data

Data lebih banyak = model lebih akurat:

```bash
# Collect 2 tahun data (730 hari)
python train_models.py --collect-data --days 730

# Atau lebih lama untuk lebih akurat
python train_models.py --collect-data --days 1095  # 3 tahun
```

### 3. Full Pipeline Retrain

```bash
# Full pipeline dengan data 2 tahun
python train_models.py --full-pipeline --days 730 --model-type rf
```

### 4. Check Model Performance

Setelah retrain, cek:
- **Accuracy**: Seharusnya 80-95% (bukan 99%+ yang menunjukkan overfitting)
- **OOB Score**: Seharusnya mendekati test accuracy
- **Train vs Test Gap**: Seharusnya < 5%

### 5. Validasi dengan Data Real

Setelah retrain, test dengan prediksi real:
1. Jalankan API: `python api/prediction_api.py`
2. Test prediksi untuk beberapa lokasi yang diketahui
3. Bandingkan dengan actual hotspot yang muncul
4. Jika masih kurang akurat, collect lebih banyak data atau tune parameter lagi

## Tips

1. **Data Quality > Quantity**: Pastikan data yang dikumpulkan berkualitas
2. **Balance Classes**: Pastikan ada cukup positive samples (hotspots)
3. **Feature Engineering**: Pastikan features relevant untuk prediksi
4. **Regular Retraining**: Retrain model setiap 1-2 bulan dengan data terbaru
5. **Monitor Performance**: Track accuracy over time dan retrain jika menurun

## Troubleshooting

### Masalah: Accuracy masih rendah setelah retrain

**Solusi:**
- Collect lebih banyak data
- Check data quality (apakah ada noise atau missing data)
- Cek feature importance - mungkin perlu tambah features lain
- Try hyperparameter tuning

### Masalah: Model terlalu konservatif (selalu prediksi low risk)

**Solusi:**
- Check class imbalance - mungkin terlalu banyak negative samples
- Adjust threshold untuk prediction
- Gunakan `class_weight='balanced'` (sudah digunakan)
- Collect lebih banyak positive samples (hotspot events)

### Masalah: Model terlalu agresif (prediksi banyak false positives)

**Solusi:**
- Increase threshold untuk prediction
- Collect lebih banyak negative samples
- Reduce max_depth lebih lanjut
- Increase min_samples_split dan min_samples_leaf

## Next Steps

1. Retrain model dengan data lebih banyak (2-3 tahun)
2. Monitor accuracy dan overfitting metrics
3. Test dengan prediksi real
4. Adjust threshold jika perlu
5. Retrain secara berkala dengan data terbaru

