# 🚀 Langkah Selanjutnya Setelah Clone Repository

## ✅ Yang Sudah Selesai
- [x] Repository di-clone via Git ✅
- [x] Folder `ml-prediction` ada ✅

---

## 🎯 Langkah Selanjutnya

### **Step 1: Masuk ke Folder `ml-prediction`**

**Di Bash console PythonAnywhere, ketik:**

```bash
cd ml-prediction
```

**Note**: Pastikan spelling benar: `ml-prediction` (bukan `ml-predction`)

**Verifikasi**:
```bash
pwd
ls -la
```

**Harus muncul**:
- Folder `api/`
- Folder `src/`
- File `requirements.txt`
- dll

---

### **Step 2: Install Dependencies**

```bash
pip install --user -r requirements.txt
```

**Tunggu** sampai selesai (2-5 menit)

**Atau install manual jika requirements.txt tidak ada**:
```bash
pip install --user fastapi uvicorn pandas numpy scikit-learn
```

---

### **Step 3: Verifikasi Install**

```bash
python3.10 -c "import fastapi; print('FastAPI OK')"
python3.10 -c "import uvicorn; print('Uvicorn OK')"
```

**Harus muncul** "OK" untuk kedua command ✅

---

### **Step 4: Test Import API**

```bash
python3.10 -c "from api.prediction_api import app; print('API import OK')"
```

**Jika error**, cek error message dan fix sesuai

---

### **Step 5: Pastikan Web App Sudah Dibuat**

1. **Buka Web tab** di PythonAnywhere
2. **Cek** apakah web app sudah ada
3. **Jika belum**, buat web app (lihat `BUAT_WEB_APP_PERTAMA_KALI.md`)

---

### **Step 6: Configure WSGI File**

1. **Web** tab → **Code** section → **Edit `wsgi.py`**
2. **Paste kode** dari `pythonanywhere-wsgi.py`
3. **Ganti username** dengan username PythonAnywhere Anda
4. **Save**

---

### **Step 7: Reload Web App**

1. **Web** tab → **Klik "Reload"** (tombol hijau)
2. **Tunggu** sampai status jadi "Running"

---

### **Step 8: Test API**

1. **Buka**: `https://nicocode.pythonanywhere.com/docs`
2. **Harus muncul Swagger UI** → **Berhasil!** ✅

---

## 📋 Quick Commands

**Di Bash console PythonAnywhere:**

```bash
# 1. Masuk ke folder API
cd ~/indonesia-fire-monitor/ml-prediction

# 2. Install dependencies
pip install --user -r requirements.txt

# 3. Test import
python3.10 -c "from api.prediction_api import app; print('OK')"

# 4. Cek file ada
ls -la api/prediction_api.py
ls -la data/models/
```

---

## 🚨 Jika Ada Error

### **Error: "No module named 'fastapi'"**
→ **Fix**: `pip install --user fastapi uvicorn`

### **Error: "No such file or directory"**
→ **Fix**: Cek path benar, cek folder ada

### **Error: "cannot import name 'app'"**
→ **Fix**: Cek WSGI file, cek import path

---

## ✅ Checklist

- [ ] Masuk ke folder `ml-prediction` ✅
- [ ] Install dependencies
- [ ] Test import berhasil
- [ ] Web app sudah dibuat
- [ ] WSGI file di-configure
- [ ] Web app di-reload
- [ ] Test `/docs` berhasil

---

**Lanjut install dependencies dan configure web app!** 🚀
