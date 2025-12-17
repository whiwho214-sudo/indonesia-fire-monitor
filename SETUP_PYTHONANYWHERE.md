# 🐍 Setup API di PythonAnywhere (Gratis, No Card!)

## 🎯 Tujuan
Deploy API prediction ke PythonAnywhere agar bisa diakses dari website Vercel.

**Keuntungan:**
- ✅ **Gratis** tanpa kartu kredit
- ✅ **Khusus Python** - Perfect untuk FastAPI
- ✅ **Tidak ada warning page**
- ✅ **Stable** untuk production
- ⚠️ Limit: 1 web app, 512MB storage

---

## 🚀 Step-by-Step Setup

### **Step 1: Daftar PythonAnywhere (2 Menit)**

1. **Buka**: https://www.pythonanywhere.com/
2. **Klik "Sign up for free"**
3. **Pilih "Beginner account"** (gratis)
4. **Isi form**:
   - Username (akan jadi subdomain)
   - Email
   - Password
5. **Verify email** (cek inbox)
6. **Login** ke dashboard

---

### **Step 2: Upload Code (5 Menit)**

#### **Option A: Via Git (Recommended)**

1. **Files** tab → **Open Bash console**
2. **Clone repository**:
```bash
cd ~
git clone https://github.com/whiwho214-sudo/indonesia-fire-monitor.git
cd indonesia-fire-monitor/ml-prediction
```

#### **Option B: Via Files Tab (Manual)**

1. **Files** tab
2. **Upload** folder `ml-prediction`:
   - Klik "Upload a file"
   - Upload semua file dari folder `ml-prediction`
   - Atau zip folder, upload, lalu extract

---

### **Step 3: Install Dependencies (3 Menit)**

1. **Files** tab → **Open Bash console**
2. **Navigate ke folder**:
```bash
cd ~/indonesia-fire-monitor/ml-prediction
```

3. **Create virtual environment**:
```bash
python3.10 -m venv venv
source venv/bin/activate
```

4. **Install dependencies**:
```bash
pip install --user -r requirements.txt
```

**Atau install manual jika requirements.txt tidak ada:**
```bash
pip install --user fastapi uvicorn pandas numpy scikit-learn
```

---

### **Step 4: Create Web App (5 Menit)**

1. **Web** tab → **Add a new web app**
2. **Next** (skip domain, pakai subdomain gratis)
3. **Choose framework**: **Flask** (kita akan konfigurasi untuk FastAPI)
4. **Python version**: **Python 3.10**
5. **Path**: `/home/yourusername/indonesia-fire-monitor/ml-prediction`
6. **Finish**

---

### **Step 5: Configure untuk FastAPI (5 Menit)**

1. **Web** tab → **Files** section
2. **Klik file** `wsgi.py` (atau buat baru)
3. **Edit** dengan kode ini:

```python
import sys
import os

# Add path to project
path = '/home/yourusername/indonesia-fire-monitor/ml-prediction'
if path not in sys.path:
    sys.path.insert(0, path)

# Change to project directory
os.chdir(path)

# Import FastAPI app
from api.prediction_api import app

# WSGI entry point
application = app
```

**Ganti `yourusername` dengan username PythonAnywhere Anda!**

4. **Save**

---

### **Step 6: Configure Static Files (Opsional)**

1. **Web** tab → **Static files** section
2. **URL**: `/static/`
3. **Directory**: `/home/yourusername/indonesia-fire-monitor/ml-prediction/static`
4. **Save**

---

### **Step 7: Reload Web App**

1. **Web** tab
2. **Klik "Reload"** button (hijau)
3. **Tunggu** beberapa detik
4. **Cek status** → Harus "Running"

---

### **Step 8: Test API**

1. **Buka URL**: `https://yourusername.pythonanywhere.com/docs`
2. **Harus muncul** Swagger UI → API jalan! ✅

**Atau test endpoint**:
```
https://yourusername.pythonanywhere.com/
```

---

### **Step 9: Set di Vercel (1 Menit)**

1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. **Edit** `VITE_PREDICTION_API_URL`:
   - **Value**: `https://yourusername.pythonanywhere.com`
   - **Save**
3. **Redeploy** website

---

## 📋 Checklist

- [ ] PythonAnywhere account created
- [ ] Code uploaded (via Git atau Files)
- [ ] Dependencies installed
- [ ] Web app created
- [ ] WSGI file configured untuk FastAPI
- [ ] Web app reloaded
- [ ] Test `/docs` endpoint berhasil
- [ ] URL di-set di Vercel
- [ ] Website redeployed
- [ ] Test prediction berhasil

---

## 🚨 Troubleshooting

### **Problem 1: Import Error**

**Gejala**: Error "No module named 'fastapi'"

**Fix**:
```bash
# Install di Bash console
pip install --user fastapi uvicorn
```

### **Problem 2: Path Error**

**Gejala**: Error "No such file or directory"

**Fix**:
1. **Cek path** di WSGI file benar
2. **Cek** file ada di Files tab
3. **Update path** di WSGI file

### **Problem 3: CORS Error**

**Gejala**: Error "CORS policy" di browser

**Fix**:
1. **Cek** `prediction_api.py` sudah ada CORS middleware
2. **Pastikan** `allow_origins=["*"]`
3. **Reload** web app

### **Problem 4: 500 Internal Server Error**

**Gejala**: Error 500 saat akses API

**Fix**:
1. **Check error logs** di Web tab → **Error log**
2. **Cek** dependencies sudah terinstall
3. **Cek** model file ada
4. **Cek** WSGI configuration

---

## 💡 Tips

1. **Monitor error logs** di Web tab untuk debug
2. **Test API** langsung sebelum set di Vercel
3. **Keep code updated** via Git
4. **Check storage** (free tier limit 512MB)

---

## 🧪 Test API

**Setelah deploy, test:**

1. **Health check**:
```
https://yourusername.pythonanywhere.com/
```

2. **API docs**:
```
https://yourusername.pythonanywhere.com/docs
```

3. **Test endpoint**:
```
https://yourusername.pythonanywhere.com/api/predictions/grid?bbox=95,-11,141,6&date=2024-12-20&grid_size=0.5
```

**Harus return JSON** (bukan HTML) → Perfect! ✅

---

## ✅ Setelah Setup

**Website akan:**
- ✅ API return JSON (bukan HTML)
- ✅ Prediction muncul di map
- ✅ Semua fitur berfungsi
- ✅ Tidak ada error

**Total waktu: ~20 menit!** 🚀

---

## 📚 Resources

- **PythonAnywhere Docs**: https://help.pythonanywhere.com/
- **FastAPI on PythonAnywhere**: https://help.pythonanywhere.com/pages/Flask/
- **Error Logs**: Web tab → Error log section

---

**PythonAnywhere = Solusi gratis tanpa kartu!** 🎉
