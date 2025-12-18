# 🔍 Cek Error Log & Fix - Step by Step

## 🎯 Tujuan
Cek error log di PythonAnywhere untuk tahu masalah sebenarnya, lalu fix.

---

## 📋 Step 1: Cek Error Log (PENTING!)

### **Cara Cek:**

1. **PythonAnywhere Dashboard** → **Web** tab
2. **Scroll ke bawah** → Cari section **"Error log"**
3. **Klik link** error log:
   - `nicocode.pythonanywhere.com.error.log`
   - Atau link error log yang ada
4. **Baca error message** - Ini akan kasih tahu masalah sebenarnya!

**Copy error message** dan lihat di bawah untuk fix sesuai error.

---

## 🚨 Common Errors & Fix

### **Error 1: ModuleNotFoundError**

**Error message contoh:**
```
ModuleNotFoundError: No module named 'fastapi'
```

**Fix:**
```bash
# Di Bash console PythonAnywhere
cd ~/indonesia-fire-monitor/ml-prediction
pip install --user fastapi uvicorn pandas numpy scikit-learn
```

**Atau dari requirements.txt:**
```bash
pip install --user -r requirements.txt
```

---

### **Error 2: ImportError**

**Error message contoh:**
```
ImportError: cannot import name 'app' from 'api.prediction_api'
```

**Fix:**
1. **Cek** file `api/prediction_api.py` ada:
```bash
ls -la ~/indonesia-fire-monitor/ml-prediction/api/prediction_api.py
```

2. **Test import** di Bash console:
```bash
cd ~/indonesia-fire-monitor/ml-prediction
python3.10 -c "from api.prediction_api import app; print('OK')"
```

3. **Jika error**, cek error message dan fix

---

### **Error 3: FileNotFoundError**

**Error message contoh:**
```
FileNotFoundError: [Errno 2] No such file or directory: '.../models/random_forest_1day.pkl'
```

**Fix:**
1. **Cek** model file ada:
```bash
ls -la ~/indonesia-fire-monitor/ml-prediction/data/models/
```

2. **Harus ada**:
   - `random_forest_1day.pkl`
   - `rf_metadata_1day.json`
   - `rf_scaler_1day.pkl`

3. **Jika tidak ada**, pastikan code sudah di-clone lengkap

---

### **Error 4: Path Error**

**Error message contoh:**
```
OSError: [Errno 2] No such file or directory: '/home/nicocode/...'
```

**Fix:**
1. **Cek path** di Web app configuration benar
2. **Cek** folder ada:
```bash
ls -la /home/nicocode/indonesia-fire-monitor/ml-prediction
```

3. **Update path** jika salah

---

### **Error 5: WSGI Configuration Error**

**Error message contoh:**
```
AttributeError: 'FastAPI' object has no attribute 'application'
```

**Fix:**
1. **Web** tab → **Code** section → **Edit `wsgi.py`**
2. **Pastikan** ada baris:
```python
application = app
```
3. **Save** → **Reload**

---

## 🧪 Debug Commands

### **Test 1: Cek Dependencies**
```bash
pip list | grep -i fastapi
pip list | grep -i uvicorn
```

**Harus muncul** fastapi dan uvicorn ✅

### **Test 2: Test Import**
```bash
cd ~/indonesia-fire-monitor/ml-prediction
python3.10 -c "from api.prediction_api import app; print('Import OK')"
```

**Harus muncul** "Import OK" ✅

### **Test 3: Cek File Structure**
```bash
ls -la ~/indonesia-fire-monitor/ml-prediction/api/
ls -la ~/indonesia-fire-monitor/ml-prediction/data/models/
```

**Harus muncul** file-file yang diperlukan ✅

---

## 📋 Checklist Debug

- [ ] Error log di-baca
- [ ] Error message di-copy
- [ ] Fix sesuai error:
  - [ ] Missing module → Install dependencies
  - [ ] Import error → Fix import
  - [ ] Path error → Fix path
  - [ ] File not found → Cek file ada
  - [ ] WSGI error → Fix WSGI file
- [ ] Test import berhasil
- [ ] Reload web app
- [ ] Test `/docs` berhasil

---

## 🚀 Quick Fix Flow

```
1. Cek Error Log (Web tab → Error log)
   ↓
2. Baca Error Message
   ↓
3. Fix Sesuai Error:
   - ModuleNotFoundError → pip install
   - ImportError → Fix import
   - PathError → Fix path
   - FileNotFound → Cek file ada
   ↓
4. Test Import (python3.10 -c "...")
   ↓
5. Reload Web App
   ↓
6. Test /docs → Harus OK ✅
```

---

## 💡 Tips

1. **Error log adalah kunci** - Selalu baca dulu
2. **Test import** sebelum reload web app
3. **Cek path** selalu benar
4. **Install dependencies** dengan `--user` flag

---

## ✅ Setelah Fix

1. **Reload web app**
2. **Test**: `https://nicocode.pythonanywhere.com/docs`
3. **Harus muncul Swagger UI** → **Berhasil!** ✅

---

**Cek error log dulu untuk tahu masalahnya, lalu fix sesuai error!** 🔍
