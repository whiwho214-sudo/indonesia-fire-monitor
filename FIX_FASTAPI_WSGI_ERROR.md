# 🔧 Fix FastAPI WSGI Error di PythonAnywhere

## ❌ Error yang Muncul

```
TypeError: FastAPI.__call__() missing 1 required positional argument: 'send'
```

**Penyebab**: FastAPI adalah ASGI application, bukan WSGI. PythonAnywhere pakai WSGI, jadi perlu adapter.

---

## ✅ Solusi: Install Mangum (ASGI-to-WSGI Adapter)

### **Step 1: Install Mangum**

**Di Bash console PythonAnywhere:**

```bash
cd ~/indonesia-fire-monitor/ml-prediction
pip install --user mangum
```

**Tunggu** sampai install selesai.

---

### **Step 2: Update WSGI File**

1. **Web** tab → **Code** section → **Edit `wsgi.py`**
2. **Hapus semua isi**, paste kode ini:

```python
import sys
import os

# GANTI 'nicocode' dengan username PythonAnywhere Anda!
username = 'nicocode'

# Add path to project
path = f'/home/{username}/indonesia-fire-monitor/ml-prediction'
if path not in sys.path:
    sys.path.insert(0, path)

# Change to project directory
os.chdir(path)

# Import FastAPI app
try:
    from api.prediction_api import app
    
    # FastAPI perlu ASGI-to-WSGI adapter
    from mangum import Mangum
    # Wrap FastAPI dengan Mangum untuk WSGI
    application = Mangum(app)
    
except ImportError as e:
    # Jika mangum tidak terinstall
    def application(environ, start_response):
        status = '500 Internal Server Error'
        headers = [('Content-type', 'text/plain')]
        start_response(status, headers)
        error_msg = f'Mangum not installed. Error: {str(e)}\n\n'
        error_msg += 'Run: pip install --user mangum\n'
        error_msg += 'Then reload web app.'
        return [error_msg.encode()]
        
except Exception as e:
    # Error handling lainnya
    def application(environ, start_response):
        status = '500 Internal Server Error'
        headers = [('Content-type', 'text/plain')]
        start_response(status, headers)
        error_msg = f'Error loading app: {str(e)}\n\n'
        error_msg += f'Path: {path}\n'
        return [error_msg.encode()]
```

3. **Ganti `'nicocode'`** dengan username PythonAnywhere Anda
4. **Save**

---

### **Step 3: Reload Web App**

1. **Web** tab → **Klik "Reload"** (tombol hijau)
2. **Tunggu** sampai status jadi "Running"

---

### **Step 4: Test API**

1. **Buka**: `https://nicocode.pythonanywhere.com/docs`
2. **Harus muncul Swagger UI** → **Berhasil!** ✅

---

## 🚨 Troubleshooting

### **Problem 1: Mangum Not Installed**

**Gejala**: Error "Mangum not installed"

**Fix**:
```bash
pip install --user mangum
```

**Lalu reload** web app.

---

### **Problem 2: Masih Error Setelah Install Mangum**

**Gejala**: Masih muncul TypeError

**Fix**:
1. **Cek** mangum terinstall:
```bash
pip list | grep mangum
```

2. **Pastikan** WSGI file sudah di-update dengan Mangum wrapper

3. **Reload** web app

---

### **Problem 3: Import Error**

**Gejala**: Error import mangum atau app

**Fix**:
1. **Install mangum**:
```bash
pip install --user mangum
```

2. **Test import**:
```bash
python3.10 -c "from mangum import Mangum; print('OK')"
python3.10 -c "from api.prediction_api import app; print('OK')"
```

---

## 📋 Checklist Fix

- [ ] Install mangum: `pip install --user mangum`
- [ ] Update WSGI file dengan Mangum wrapper
- [ ] Username di-update di WSGI file ✅
- [ ] Save WSGI file
- [ ] Reload web app
- [ ] Test `/docs` berhasil

---

## 🎯 Quick Fix

```bash
# 1. Install mangum
cd ~/indonesia-fire-monitor/ml-prediction
pip install --user mangum

# 2. Update WSGI file (copy dari pythonanywhere-wsgi-fixed.py)
# 3. Reload web app
# 4. Test /docs → Harus OK ✅
```

---

## ✅ Setelah Fix

**API akan:**
- ✅ Bisa diakses di `/docs`
- ✅ Endpoint `/api/predictions/grid` jalan
- ✅ CORS sudah dikonfigurasi
- ✅ Website Vercel bisa akses

**Error akan hilang!** 🎉

---

**Install mangum dan update WSGI file dengan Mangum wrapper!** 🚀
