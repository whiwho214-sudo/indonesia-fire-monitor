# 🐍 Panduan Lengkap Deploy API ke PythonAnywhere

## 📋 Daftar Isi
1. [Daftar Akun](#1-daftar-akun)
2. [Upload Code](#2-upload-code)
3. [Install Dependencies](#3-install-dependencies)
4. [Buat Web App](#4-buat-web-app)
5. [Konfigurasi FastAPI](#5-konfigurasi-fastapi)
6. [Test API](#6-test-api)
7. [Set di Vercel](#7-set-di-vercel)

---

## 1. Daftar Akun

### **Step 1.1: Buka Website**
1. **Buka browser** → https://www.pythonanywhere.com/
2. **Klik tombol** "Sign up for free" (di kanan atas)

### **Step 1.2: Pilih Plan**
1. **Pilih "Beginner"** (gratis, no card)
2. **Jangan pilih** "Hacker" atau "Web Developer" (berbayar)

### **Step 1.3: Isi Form**
1. **Username**: Pilih username (akan jadi subdomain)
   - Contoh: `indonesiafire` → URL jadi `indonesiafire.pythonanywhere.com`
   - **PENTING**: Username ini akan dipakai di konfigurasi nanti!
2. **Email**: Masukkan email valid
3. **Password**: Buat password kuat
4. **Klik "Register"**

### **Step 1.4: Verify Email**
1. **Cek inbox email** Anda
2. **Klik link verifikasi** dari PythonAnywhere
3. **Login** ke dashboard

---

## 2. Upload Code via Git (RECOMMENDED - Tidak Ada Limit 100MB!)

#### **Step 2.1: Buka Bash Console**
1. **Di dashboard PythonAnywhere**, klik tab **"Files"**
2. **Scroll ke bawah**, klik **"Open Bash console here"**
3. **Terminal akan terbuka** di browser

#### **Step 2.2: Clone Repository**
**Di Bash console, ketik:**

```bash
cd ~
git clone https://github.com/whiwho214-sudo/indonesia-fire-monitor.git
```

**Tunggu sampai selesai** (beberapa detik)

#### **Step 2.3: Verifikasi**
```bash
ls -la indonesia-fire-monitor
```

**Harus muncul** folder dan file project

---

### **Cara 2: Via Files Tab (Manual Upload)**

#### **Step 2.1: Zip Folder Local**
1. **Di komputer Anda**, zip folder `ml-prediction`
2. **Nama file**: `ml-prediction.zip`

#### **Step 2.2: Upload ke PythonAnywhere**
1. **Files** tab di PythonAnywhere
2. **Klik "Upload a file"**
3. **Pilih** file `ml-prediction.zip`
4. **Tunggu upload selesai**

#### **Step 2.3: Extract**
1. **Buka Bash console**
2. **Ketik**:
```bash
cd ~
unzip ml-prediction.zip
```

---

## 3. Install Dependencies

### **Step 3.1: Buka Bash Console**
1. **Files** tab → **"Open Bash console here"**

### **Step 3.2: Navigate ke Folder**
```bash
cd ~/indonesia-fire-monitor/ml-prediction
```

### **Step 3.3: Create Virtual Environment**
```bash
python3.10 -m venv venv
```

**Tunggu beberapa detik**

### **Step 3.4: Activate Virtual Environment**
```bash
source venv/bin/activate
```

**Prompt akan berubah** jadi `(venv) $`

### **Step 3.5: Install Dependencies**
```bash
pip install --user -r requirements.txt
```

**Tunggu sampai selesai** (2-5 menit)

**Jika `requirements.txt` tidak ada, install manual:**
```bash
pip install --user fastapi uvicorn pandas numpy scikit-learn
```

---

## 4. Buat Web App

### **Step 4.1: Buka Web Tab**
1. **Klik tab "Web"** di dashboard PythonAnywhere

### **Step 4.2: Add New Web App**
1. **Klik tombol** "Add a new web app" (hijau)
2. **Klik "Next"** (skip domain, pakai subdomain gratis)

### **Step 4.3: Pilih Framework**
1. **Pilih "Flask"** (kita akan konfigurasi untuk FastAPI nanti)
2. **Klik "Next"**

### **Step 4.4: Pilih Python Version**
1. **Pilih "Python 3.10"** (atau versi terbaru yang ada)
2. **Klik "Next"**

### **Step 4.5: Set Path**
1. **Path to your code**: 
   ```
   /home/yourusername/indonesia-fire-monitor/ml-prediction
   ```
   **GANTI `yourusername` dengan username PythonAnywhere Anda!**
   
   **Contoh jika username Anda `indonesiafire`:**
   ```
   /home/indonesiafire/indonesia-fire-monitor/ml-prediction
   ```

2. **Klik "Next"**
3. **Klik "Finish"**

---

## 5. Konfigurasi FastAPI

### **Step 5.1: Buka WSGI File**
1. **Web** tab → Scroll ke **"Code"** section
2. **Klik link** `wsgi.py` (atau file yang ada di sana)

### **Step 5.2: Edit WSGI File**
**Hapus semua isi file**, lalu **paste kode ini**:

```python
import sys
import os

# GANTI 'yourusername' dengan username PythonAnywhere Anda!
username = 'yourusername'

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
        error_msg += f'Sys path: {sys.path}\n'
        return [error_msg.encode()]
```

**PENTING**: Ganti `'yourusername'` dengan username PythonAnywhere Anda!

**Contoh jika username `indonesiafire`:**
```python
username = 'indonesiafire'
```

### **Step 5.3: Save**
1. **Klik "Save"** (tombol hijau di bawah editor)

---

## 6. Reload & Test

### **Step 6.1: Reload Web App**
1. **Web** tab → Scroll ke atas
2. **Klik tombol hijau "Reload"** (di kanan atas)
3. **Tunggu** beberapa detik sampai status jadi "Running"

### **Step 6.2: Test API**
1. **Buka tab baru** di browser
2. **Akses**: `https://yourusername.pythonanywhere.com/docs`
   
   **Ganti `yourusername` dengan username Anda!**
   
   **Contoh**: `https://indonesiafire.pythonanywhere.com/docs`

3. **Harus muncul** Swagger UI dengan API endpoints → **Berhasil!** ✅

### **Step 6.3: Test Health Check**
1. **Akses**: `https://yourusername.pythonanywhere.com/`
2. **Harus muncul** response JSON atau message OK

---

## 7. Set di Vercel

### **Step 7.1: Copy URL PythonAnywhere**
**URL format**: `https://yourusername.pythonanywhere.com`

**Contoh**: `https://indonesiafire.pythonanywhere.com`

### **Step 7.2: Buka Vercel Dashboard**
1. **Login** ke https://vercel.com/
2. **Pilih project**: `indonesia-fire-monitor`
3. **Settings** → **Environment Variables**

### **Step 7.3: Update Environment Variable**
1. **Cari** variable `VITE_PREDICTION_API_URL`
2. **Klik edit** (icon pensil)
3. **Ganti value** dengan URL PythonAnywhere:
   ```
   https://yourusername.pythonanywhere.com
   ```
4. **Save**

### **Step 7.4: Redeploy Website**
1. **Deployments** tab
2. **Klik 3 dots** (⋯) di deployment terbaru
3. **Redeploy**
4. **Tunggu 2-3 menit**

### **Step 7.5: Test Website**
1. **Buka website Vercel**
2. **Aktifkan layer "Predictions"**
3. **Error hilang dan prediksi muncul!** ✅

---

## 🚨 Troubleshooting

### **Problem 1: Import Error**

**Gejala**: Error "No module named 'fastapi'"

**Fix**:
1. **Buka Bash console**
2. **Navigate ke folder**:
```bash
cd ~/indonesia-fire-monitor/ml-prediction
source venv/bin/activate
```
3. **Install dependencies**:
```bash
pip install --user fastapi uvicorn pandas numpy scikit-learn
```

---

### **Problem 2: Path Error**

**Gejala**: Error "No such file or directory"

**Fix**:
1. **Cek path** di WSGI file benar
2. **Buka Bash console**, cek path:
```bash
ls -la /home/yourusername/indonesia-fire-monitor/ml-prediction
```
3. **Update path** di WSGI file jika salah

---

### **Problem 3: 500 Internal Server Error**

**Gejala**: Error 500 saat akses API

**Fix**:
1. **Web** tab → Scroll ke **"Error log"** section
2. **Baca error message** di log
3. **Fix sesuai error**:
   - Missing module → Install dependencies
   - Path error → Fix path di WSGI
   - Import error → Check file structure

---

### **Problem 4: CORS Error**

**Gejala**: Error "CORS policy" di browser

**Fix**:
1. **Cek** file `ml-prediction/api/prediction_api.py`
2. **Pastikan** ada CORS middleware:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
3. **Reload** web app

---

## 📋 Checklist Lengkap

### **Setup PythonAnywhere:**
- [ ] Account created
- [ ] Email verified
- [ ] Code uploaded (via Git atau Files)
- [ ] Dependencies installed
- [ ] Web app created
- [ ] WSGI file configured
- [ ] Username di-update di WSGI file ✅
- [ ] Web app reloaded
- [ ] Test `/docs` endpoint berhasil
- [ ] Test health check berhasil

### **Setup Vercel:**
- [ ] Environment variable di-update
- [ ] Value = URL PythonAnywhere ✅
- [ ] Website redeployed
- [ ] Test prediction berhasil

---

## 💡 Tips Penting

1. **Username PythonAnywhere** harus sama di:
   - Path di Web app configuration
   - WSGI file (`username = 'yourusername'`)
   - URL untuk test

2. **Test API langsung** sebelum set di Vercel:
   - `/docs` → Swagger UI
   - `/` → Health check
   - `/api/predictions/grid` → Test endpoint

3. **Monitor error logs** di Web tab untuk debug

4. **Keep code updated** via Git:
```bash
cd ~/indonesia-fire-monitor
git pull
```

---

## 🎯 Quick Reference

**URL Format:**
```
https://yourusername.pythonanywhere.com
```

**Path Format:**
```
/home/yourusername/indonesia-fire-monitor/ml-prediction
```

**WSGI File Location:**
```
Web tab → Code section → wsgi.py
```

**Error Logs:**
```
Web tab → Error log section
```

---

## ✅ Setelah Setup

**Website akan:**
- ✅ API return JSON (bukan HTML)
- ✅ Prediction muncul di map
- ✅ Semua fitur berfungsi
- ✅ Tidak ada error

**Total waktu: ~20 menit!** 🚀

---

**PythonAnywhere = Solusi gratis tanpa kartu yang reliable!** 🎉
