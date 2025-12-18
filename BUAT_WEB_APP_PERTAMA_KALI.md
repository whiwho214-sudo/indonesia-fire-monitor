# 🚀 Buat Web App Pertama Kali di PythonAnywhere

## 🎯 Situasi
Di Web tab muncul: **"You have no web apps"**

**Artinya**: Belum ada web app yang dibuat. Kita perlu buat sekarang!

---

## ✅ Step-by-Step: Buat Web App

### **Step 1: Klik "Add a new web app"**

1. **Di halaman Web tab** yang Anda lihat
2. **Klik tombol biru** **"Add a new web app"** (ada plus icon)
3. **Halaman baru akan terbuka**

---

### **Step 2: Pilih Domain (Skip)**

1. **Akan muncul** pilihan domain
2. **Pilih** subdomain gratis: `nicocode.pythonanywhere.com` (atau username Anda)
3. **Klik "Next"**

---

### **Step 3: Pilih Framework**

1. **Akan muncul** pilihan framework:
   - Flask
   - Django
   - Web2py
   - dll

2. **Pilih "Flask"** (kita akan konfigurasi untuk FastAPI nanti)
3. **Klik "Next"**

---

### **Step 4: Pilih Python Version**

1. **Akan muncul** pilihan Python version:
   - Python 3.10
   - Python 3.9
   - dll

2. **Pilih "Python 3.10"** (atau versi terbaru yang ada)
3. **Klik "Next"**

---

### **Step 5: Set Path (PENTING!)**

1. **Akan muncul** form untuk path
2. **Isi "Path to your code"**:
   ```
   /home/nicocode/indonesia-fire-monitor/ml-prediction
   ```
   
   **GANTI `nicocode` dengan username PythonAnywhere Anda!**
   
   **Cara cek username**:
   - Lihat di pojok kanan atas dashboard
   - Atau lihat URL: `https://nicocode.pythonanywhere.com` → username = `nicocode`

3. **Klik "Next"**
4. **Klik "Finish"**

---

### **Step 6: Web App Created!**

**Setelah klik Finish**, web app akan dibuat dan Anda akan kembali ke Web tab.

**Sekarang akan muncul**:
- ✅ Web app list (ada 1 web app)
- ✅ Status: Running atau Stopped
- ✅ URL: `https://nicocode.pythonanywhere.com`

---

### **Step 7: Configure WSGI File**

1. **Di Web tab**, scroll ke bawah
2. **Cari section "Code"**
3. **Klik link** `wsgi.py` (atau file yang ada di sana)

4. **Hapus semua isi file**, paste kode ini:

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
        error_msg += f'Check if path exists and files are there.\n'
        return [error_msg.encode()]
```

5. **Ganti `'nicocode'`** dengan username PythonAnywhere Anda
6. **Klik "Save"** (tombol di bawah editor)

---

### **Step 8: Reload Web App**

1. **Scroll ke atas** di Web tab
2. **Cari tombol hijau "Reload"** (di kanan atas)
3. **Klik "Reload"**
4. **Tunggu** beberapa detik sampai status jadi **"Running"** (hijau)

---

### **Step 9: Test API**

1. **Buka tab baru** di browser
2. **Akses**: `https://nicocode.pythonanywhere.com/docs`
3. **Harus muncul Swagger UI** dengan API endpoints → **Berhasil!** ✅

**Jika masih "Coming Soon!"**:
- Tunggu 1-2 menit (kadang perlu waktu)
- Reload web app lagi
- Cek error logs

---

## 📋 Checklist Lengkap

- [ ] Klik "Add a new web app"
- [ ] Pilih subdomain (skip domain)
- [ ] Pilih Flask
- [ ] Pilih Python 3.10
- [ ] Set path: `/home/username/indonesia-fire-monitor/ml-prediction`
- [ ] Username di-update di path ✅
- [ ] Finish → Web app created
- [ ] Edit WSGI file
- [ ] Username di-update di WSGI ✅
- [ ] Save WSGI file
- [ ] Reload web app
- [ ] Test `/docs` berhasil

---

## 🚨 Troubleshooting

### **Problem 1: Path Error**

**Gejala**: Error "Path not found" atau 500 error

**Fix**:
1. **Buka Bash console** (Files tab → Open Bash console)
2. **Cek path**:
```bash
ls -la /home/nicocode/indonesia-fire-monitor/ml-prediction
```
3. **Jika tidak ada**, clone repository dulu:
```bash
cd ~
git clone https://github.com/whiwho214-sudo/indonesia-fire-monitor.git
```
4. **Update path** di Web app configuration

---

### **Problem 2: Masih "Coming Soon!"**

**Gejala**: Setelah buat web app, masih muncul "Coming Soon!"

**Fix**:
1. **Cek** web app status = "Running" (hijau)
2. **Cek** WSGI file sudah di-configure
3. **Reload** web app
4. **Tunggu** 1-2 menit
5. **Clear browser cache** (Ctrl+Shift+Delete)

---

### **Problem 3: Error 500**

**Gejala**: Error 500 saat akses API

**Fix**:
1. **Web** tab → Scroll ke **"Error log"** section
2. **Baca error message**
3. **Fix sesuai error**:
   - Missing module → Install dependencies di Bash console
   - Import error → Fix import path
   - Path error → Fix path

---

## 💡 Tips Penting

1. **Username PythonAnywhere** harus sama di:
   - Path di Web app: `/home/username/...`
   - WSGI file: `username = 'username'`
   - URL: `https://username.pythonanywhere.com`

2. **Pastikan code sudah di-clone** sebelum buat web app:
```bash
cd ~
git clone https://github.com/whiwho214-sudo/indonesia-fire-monitor.git
```

3. **Test langsung** setelah reload:
   - `/docs` → Swagger UI
   - `/` → Health check

---

## 🎯 Quick Summary

```
1. Klik "Add a new web app" (tombol biru)
2. Next → Flask → Python 3.10
3. Path: /home/nicocode/indonesia-fire-monitor/ml-prediction
4. Finish
5. Edit WSGI file (copy dari pythonanywhere-wsgi.py)
6. Ganti username di WSGI
7. Save → Reload
8. Test /docs → Harus muncul Swagger UI ✅
```

---

## ✅ Setelah Web App Dibuat

**API akan:**
- ✅ Bisa diakses di `https://nicocode.pythonanywhere.com/docs`
- ✅ Endpoint `/api/predictions/grid` jalan
- ✅ CORS sudah dikonfigurasi
- ✅ Website Vercel bisa akses

**Error akan hilang dan prediksi muncul!** 🎉

---

**Total waktu: ~10 menit untuk buat web app pertama kali!** 🚀
