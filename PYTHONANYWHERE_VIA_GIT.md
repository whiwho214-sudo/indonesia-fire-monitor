# 🚀 Deploy PythonAnywhere via Git (Paling Mudah!)

## ✅ Keuntungan Pakai Git
- ✅ **Tidak ada limit 100MB** - Clone langsung dari GitHub
- ✅ **Mudah update** - Cukup `git pull`
- ✅ **Semua file ada** - Tidak perlu exclude apa-apa
- ✅ **Lebih cepat** - Tidak perlu upload manual

---

## 🚀 Step-by-Step via Git

### **Step 1: Pastikan Code di GitHub**

**Cek di komputer Anda:**
```bash
git status
git push
```

**Pastikan** code sudah di-push ke GitHub.

---

### **Step 2: Login PythonAnywhere**

1. **Buka**: https://www.pythonanywhere.com/
2. **Login** ke dashboard

---

### **Step 3: Clone Repository (2 Menit)**

1. **Files** tab → **"Open Bash console here"**
2. **Di Bash console, ketik**:

```bash
cd ~
git clone https://github.com/whiwho214-sudo/indonesia-fire-monitor.git
```

3. **Tunggu** sampai clone selesai (1-2 menit)

4. **Verifikasi**:
```bash
ls -la indonesia-fire-monitor
```

**Harus muncul** folder dan file project ✅

---

### **Step 4: Navigate ke Folder API**

```bash
cd indonesia-fire-monitor/ml-prediction
ls -la
```

**Harus muncul** file API dan folder ✅

---

### **Step 5: Install Dependencies (3 Menit)**

```bash
# Create virtual environment (opsional, bisa skip)
python3.10 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --user -r requirements.txt
```

**Tunggu** sampai install selesai (2-5 menit)

---

### **Step 6: Buat Web App (5 Menit)**

1. **Web** tab → **"Add a new web app"**
2. **Next** (skip domain)
3. **Pilih "Flask"** → **Next**
4. **Pilih "Python 3.10"** → **Next**
5. **Path**: 
   ```
   /home/yourusername/indonesia-fire-monitor/ml-prediction
   ```
   **GANTI `yourusername` dengan username PythonAnywhere Anda!**
6. **Finish**

---

### **Step 7: Configure WSGI (3 Menit)**

1. **Web** tab → **Code** section → **Klik `wsgi.py`**
2. **Hapus semua isi**, paste ini:

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
    def application(environ, start_response):
        status = '500 Internal Server Error'
        headers = [('Content-type', 'text/plain')]
        start_response(status, headers)
        error_msg = f'Error: {str(e)}\nPath: {path}'
        return [error_msg.encode()]
```

3. **Ganti `yourusername`** dengan username Anda
4. **Save**

---

### **Step 8: Reload & Test (1 Menit)**

1. **Web** tab → **Klik "Reload"** (tombol hijau)
2. **Tunggu** sampai status jadi "Running"
3. **Test**: `https://yourusername.pythonanywhere.com/docs`
4. **Harus muncul** Swagger UI → **Berhasil!** ✅

---

### **Step 9: Set di Vercel (1 Menit)**

1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. **Update** `VITE_PREDICTION_API_URL`:
   - **Value**: `https://yourusername.pythonanywhere.com`
3. **Save** → **Redeploy**

---

## 📋 Checklist Lengkap

- [ ] Code sudah di GitHub ✅
- [ ] PythonAnywhere account created
- [ ] Repository cloned via Git
- [ ] Navigate ke `ml-prediction` folder
- [ ] Dependencies installed
- [ ] Web app created
- [ ] Path = `/home/yourusername/indonesia-fire-monitor/ml-prediction`
- [ ] WSGI file configured
- [ ] Username di-update di WSGI ✅
- [ ] Web app reloaded
- [ ] Test `/docs` berhasil
- [ ] URL di-set di Vercel
- [ ] Website redeployed
- [ ] Test prediction berhasil

---

## 🔄 Update Code (Mudah!)

**Setelah ada update code:**

1. **Push ke GitHub** (dari komputer Anda):
```bash
git add .
git commit -m "Update code"
git push
```

2. **Pull di PythonAnywhere**:
```bash
cd ~/indonesia-fire-monitor
git pull
```

3. **Reload web app** di PythonAnywhere dashboard

**Selesai!** ✅

---

## 🚨 Troubleshooting

### **Problem: Git Clone Gagal**

**Gejala**: Error "repository not found"

**Fix**:
1. **Cek** repository public di GitHub
2. **Atau** setup SSH key untuk private repo
3. **Atau** pakai HTTPS dengan personal access token

### **Problem: Path Error**

**Gejala**: Error "No such file or directory"

**Fix**:
1. **Cek path** di Web app configuration
2. **Cek** folder ada:
```bash
ls -la /home/yourusername/indonesia-fire-monitor/ml-prediction
```
3. **Update path** jika salah

---

## 💡 Tips

1. **Username PythonAnywhere** harus sama di:
   - Path di Web app
   - WSGI file
   - URL test

2. **Test API** langsung sebelum set di Vercel

3. **Monitor error logs** di Web tab untuk debug

4. **Update code** mudah dengan `git pull`

---

## ✅ Setelah Setup

**Website akan:**
- ✅ API return JSON
- ✅ Prediction muncul
- ✅ Semua fitur berfungsi
- ✅ Update mudah via Git

**Total waktu: ~15 menit!** 🚀

---

**Git = Solusi terbaik! Tidak ada limit dan mudah update!** 🎉
