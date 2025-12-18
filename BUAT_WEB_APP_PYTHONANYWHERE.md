# 🚀 Buat Web App di PythonAnywhere (Fix "Coming Soon!")

## ❌ Masalah
Saat akses `https://nicocode.pythonanywhere.com/docs`, muncul halaman **"Coming Soon!"**

**Artinya**: Web app belum dibuat atau belum dikonfigurasi!

---

## ✅ Solusi: Buat Web App

### **Step 1: Buka Web Tab**

1. **Login** ke PythonAnywhere dashboard
2. **Klik tab "Web"** (di menu atas)

---

### **Step 2: Add New Web App**

1. **Klik tombol hijau** **"Add a new web app"**
2. **Klik "Next"** (skip domain, pakai subdomain gratis)

---

### **Step 3: Pilih Framework**

1. **Pilih "Flask"** (kita akan konfigurasi untuk FastAPI nanti)
2. **Klik "Next"**

---

### **Step 4: Pilih Python Version**

1. **Pilih "Python 3.10"** (atau versi terbaru yang ada)
2. **Klik "Next"**

---

### **Step 5: Set Path (PENTING!)**

1. **Path to your code**: 
   ```
   /home/nicocode/indonesia-fire-monitor/ml-prediction
   ```
   
   **GANTI `nicocode` dengan username PythonAnywhere Anda jika berbeda!**
   
   **Cek username Anda** di dashboard PythonAnywhere (biasanya di pojok kanan atas)

2. **Klik "Next"**
3. **Klik "Finish"**

---

### **Step 6: Configure WSGI File**

1. **Web** tab → Scroll ke **"Code"** section
2. **Klik link** `wsgi.py` (atau file yang ada)

3. **Hapus semua isi**, paste kode ini:

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
    application = app
except Exception as e:
    # Error handling
    def application(environ, start_response):
        status = '500 Internal Server Error'
        headers = [('Content-type', 'text/plain')]
        start_response(status, headers)
        error_msg = f'Error loading app: {str(e)}\n\n'
        error_msg += f'Path: {path}\n'
        error_msg += f'Files in path: {os.listdir(path) if os.path.exists(path) else "Path not found"}\n'
        return [error_msg.encode()]
```

4. **Ganti `'nicocode'`** dengan username PythonAnywhere Anda
5. **Save**

---

### **Step 7: Reload Web App**

1. **Web** tab → Scroll ke atas
2. **Klik tombol hijau "Reload"** (di kanan atas)
3. **Tunggu** beberapa detik sampai status jadi **"Running"**

---

### **Step 8: Test API**

1. **Buka tab baru** di browser
2. **Akses**: `https://nicocode.pythonanywhere.com/docs`
3. **Harus muncul Swagger UI** → **Berhasil!** ✅

**Jika masih "Coming Soon!"**:
- Cek apakah web app sudah dibuat
- Cek apakah path benar
- Cek error logs di Web tab

---

## 🚨 Troubleshooting

### **Problem 1: Masih "Coming Soon!"**

**Gejala**: Setelah buat web app, masih muncul "Coming Soon!"

**Fix**:
1. **Cek** web app sudah dibuat (lihat di Web tab)
2. **Cek** path benar di web app configuration
3. **Cek** WSGI file sudah di-configure
4. **Reload** web app
5. **Tunggu** 1-2 menit (kadang perlu waktu)

---

### **Problem 2: Error 500**

**Gejala**: Error 500 saat akses API

**Fix**:
1. **Web** tab → **Error log** section
2. **Baca error message**
3. **Fix sesuai error**:
   - Missing module → Install dependencies
   - Path error → Fix path
   - Import error → Fix import

---

### **Problem 3: Path Error**

**Gejala**: Error "No such file or directory"

**Fix**:
1. **Buka Bash console**
2. **Cek path**:
```bash
ls -la /home/nicocode/indonesia-fire-monitor/ml-prediction
```
3. **Update path** di Web app configuration jika salah

---

## 📋 Checklist Buat Web App

- [ ] Web tab dibuka
- [ ] "Add a new web app" diklik
- [ ] Flask dipilih
- [ ] Python 3.10 dipilih
- [ ] Path di-set: `/home/username/indonesia-fire-monitor/ml-prediction`
- [ ] Username di-update di path ✅
- [ ] WSGI file di-configure
- [ ] Username di-update di WSGI file ✅
- [ ] Web app di-reload
- [ ] Test `/docs` berhasil (bukan "Coming Soon!")

---

## 🎯 Quick Steps

```
1. Web tab → Add a new web app
2. Flask → Python 3.10
3. Path: /home/nicocode/indonesia-fire-monitor/ml-prediction
4. Edit WSGI file (copy dari pythonanywhere-wsgi.py)
5. Ganti username di WSGI file
6. Reload
7. Test /docs → Harus muncul Swagger UI ✅
```

---

## ✅ Setelah Web App Dibuat

**API akan:**
- ✅ Bisa diakses di `https://nicocode.pythonanywhere.com/docs`
- ✅ Endpoint `/api/predictions/grid` jalan
- ✅ CORS sudah dikonfigurasi
- ✅ Website Vercel bisa akses

**Error akan hilang!** 🎉

---

**Total waktu: ~10 menit untuk buat web app!** 🚀
