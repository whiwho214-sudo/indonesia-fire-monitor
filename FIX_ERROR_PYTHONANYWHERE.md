# 🔧 Fix Error "Something went wrong" di PythonAnywhere

## ❌ Masalah
Saat akses `https://nicocode.pythonanywhere.com/docs`, muncul error:
**"Something went wrong :-("** dengan "Unhandled Exception"

**Artinya**: Ada error di code atau konfigurasi!

---

## 🔍 Step 1: Cek Error Logs

### **Cara Cek Error Logs:**

1. **PythonAnywhere** → **Web** tab
2. **Scroll ke bawah** → **"Error log"** section
3. **Klik link** error log (biasanya `nicocode.pythonanywhere.com.error.log`)
4. **Baca error message** di log

**Error log akan menunjukkan** masalah sebenarnya!

---

## 🚨 Common Errors & Fix

### **Error 1: ImportError / ModuleNotFoundError**

**Gejala**: Error "No module named 'fastapi'" atau module lain

**Fix**:
1. **Buka Bash console** (Files tab → Open Bash console)
2. **Navigate ke folder**:
```bash
cd ~/indonesia-fire-monitor/ml-prediction
```
3. **Install dependencies**:
```bash
pip install --user fastapi uvicorn pandas numpy scikit-learn
```

**Atau install dari requirements.txt**:
```bash
pip install --user -r requirements.txt
```

---

### **Error 2: Path Error / File Not Found**

**Gejala**: Error "No such file or directory" atau "cannot find module"

**Fix**:
1. **Cek path** di Web app configuration benar:
   ```
   /home/nicocode/indonesia-fire-monitor/ml-prediction
   ```
2. **Cek** folder ada:
```bash
ls -la /home/nicocode/indonesia-fire-monitor/ml-prediction
```
3. **Jika tidak ada**, clone repository:
```bash
cd ~
git clone https://github.com/whiwho214-sudo/indonesia-fire-monitor.git
```

---

### **Error 3: WSGI Configuration Error**

**Gejala**: Error di WSGI file atau import error

**Fix**:
1. **Web** tab → **Code** section → **Edit `wsgi.py`**
2. **Pastikan** kode benar:
```python
import sys
import os

username = 'nicocode'  # GANTI dengan username Anda!

path = f'/home/{username}/indonesia-fire-monitor/ml-prediction'
if path not in sys.path:
    sys.path.insert(0, path)

os.chdir(path)

try:
    from api.prediction_api import app
    application = app
except Exception as e:
    def application(environ, start_response):
        status = '500 Internal Server Error'
        headers = [('Content-type', 'text/plain')]
        start_response(status, headers)
        return [f'Error: {str(e)}\nPath: {path}'.encode()]
```
3. **Ganti username** dengan username Anda
4. **Save** → **Reload**

---

### **Error 4: Model File Not Found**

**Gejala**: Error "FileNotFoundError" untuk model file

**Fix**:
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

## 🧪 Debug Step-by-Step

### **Step 1: Cek Error Log**
1. **Web** tab → **Error log** section
2. **Baca** error message
3. **Copy** error message untuk analisis

### **Step 2: Cek Path**
```bash
# Di Bash console
ls -la /home/nicocode/indonesia-fire-monitor/ml-prediction
ls -la /home/nicocode/indonesia-fire-monitor/ml-prediction/api
```

**Harus muncul** file dan folder ✅

### **Step 3: Test Import**
```bash
# Di Bash console
cd ~/indonesia-fire-monitor/ml-prediction
python3.10 -c "from api.prediction_api import app; print('OK')"
```

**Jika error**, fix sesuai error message

### **Step 4: Cek Dependencies**
```bash
pip list | grep -i fastapi
pip list | grep -i uvicorn
```

**Harus ada** fastapi dan uvicorn ✅

---

## 🚀 Quick Fix Checklist

- [ ] Cek error log di Web tab
- [ ] Baca error message
- [ ] Fix sesuai error:
  - [ ] Missing module → Install dependencies
  - [ ] Path error → Fix path
  - [ ] Import error → Fix import
  - [ ] Model not found → Cek model files
- [ ] Reload web app
- [ ] Test lagi

---

## 💡 Tips Debug

1. **Error log adalah kunci** - Baca dengan teliti
2. **Test import** di Bash console sebelum reload
3. **Cek path** selalu benar
4. **Install dependencies** dengan `--user` flag

---

## 📋 Common Error Messages

### **"ModuleNotFoundError: No module named 'fastapi'"**
→ **Fix**: `pip install --user fastapi uvicorn`

### **"FileNotFoundError: [Errno 2] No such file or directory"**
→ **Fix**: Cek path benar, cek file ada

### **"ImportError: cannot import name 'app' from 'api.prediction_api'"**
→ **Fix**: Cek WSGI file, cek import path

### **"AttributeError: 'FastAPI' object has no attribute 'application'"**
→ **Fix**: WSGI file harus set `application = app`

---

## ✅ Setelah Fix

1. **Reload web app**
2. **Test**: `https://nicocode.pythonanywhere.com/docs`
3. **Harus muncul Swagger UI** → **Berhasil!** ✅

---

**Cek error log dulu untuk tahu masalahnya!** 🔍
