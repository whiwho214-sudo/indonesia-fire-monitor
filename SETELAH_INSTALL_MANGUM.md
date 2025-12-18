# ✅ Setelah Install Mangum - Langkah Selanjutnya

## ✅ Yang Sudah Selesai
- [x] Mangum terinstall ✅
- [x] Di folder `ml-prediction` ✅

---

## 🧪 Step 1: Test Import (Verifikasi)

**Di Bash console, ketik:**

```bash
python3.10 -c "from mangum import Mangum; print('Mangum OK')"
```

**Harus muncul**: `Mangum OK` ✅

**Jika tidak muncul**, coba:
```bash
python3.13 -c "from mangum import Mangum; print('Mangum OK')"
```

(PythonAnywhere mungkin pakai Python 3.13, bukan 3.10)

---

## 🔧 Step 2: Pastikan WSGI File Sudah Benar

1. **Web** tab → **Code** section → **Edit `wsgi.py`**
2. **Pastikan** kode seperti ini:

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
    from mangum import Mangum
    application = Mangum(app)
except ImportError as e:
    def application(environ, start_response):
        status = '500 Internal Server Error'
        headers = [('Content-type', 'text/plain')]
        start_response(status, headers)
        error_msg = f'Mangum not installed. Error: {str(e)}\n\n'
        error_msg += 'Run: pip install --user mangum\n'
        return [error_msg.encode()]
except Exception as e:
    def application(environ, start_response):
        status = '500 Internal Server Error'
        headers = [('Content-type', 'text/plain')]
        start_response(status, headers)
        return [f'Error: {str(e)}'.encode()]
```

3. **Ganti `'nicocode'`** dengan username Anda
4. **Save**

---

## 🔄 Step 3: Reload Web App

1. **Web** tab → **Scroll ke atas**
2. **Klik "Reload"** (tombol hijau)
3. **Tunggu** sampai status jadi **"Running"** (hijau)

---

## 🧪 Step 4: Test API

1. **Buka tab baru** di browser
2. **Akses**: `https://nicocode.pythonanywhere.com/docs`
3. **Harus muncul Swagger UI** dengan API endpoints → **Berhasil!** ✅

**Jika masih error**, cek error log di Web tab.

---

## 🚨 Troubleshooting

### **Problem 1: Masih "Mangum not installed"**

**Fix**:
1. **Cek** mangum terinstall:
```bash
pip list | grep mangum
```

2. **Pastikan** install di Python yang sama dengan web app:
   - Web app pakai Python 3.10 → Install dengan Python 3.10
   - Web app pakai Python 3.13 → Install dengan Python 3.13

3. **Cek** Python version web app:
   - Web tab → Lihat Python version yang dipilih

---

### **Problem 2: Import Error**

**Gejala**: Error "cannot import Mangum"

**Fix**:
1. **Test import** dengan Python version yang sama:
```bash
# Cek Python version web app dulu
# Lalu test dengan version yang sama
python3.10 -c "from mangum import Mangum; print('OK')"
# atau
python3.13 -c "from mangum import Mangum; print('OK')"
```

2. **Install mangum** dengan Python version yang sama:
```bash
python3.10 -m pip install --user mangum
# atau
python3.13 -m pip install --user mangum
```

---

### **Problem 3: Masih Error Setelah Reload**

**Fix**:
1. **Cek error log** di Web tab
2. **Baca error message**
3. **Fix sesuai error**

---

## 📋 Checklist Final

- [x] Mangum terinstall ✅
- [ ] Test import berhasil
- [ ] WSGI file sudah benar (pakai Mangum)
- [ ] Username di-update di WSGI ✅
- [ ] Web app di-reload
- [ ] Test `/docs` berhasil
- [ ] Swagger UI muncul ✅

---

## 🎯 Quick Action

```
1. Test import: python3.10 -c "from mangum import Mangum; print('OK')"
2. Pastikan WSGI file pakai Mangum wrapper
3. Reload web app
4. Test /docs → Harus OK ✅
```

---

## ✅ Setelah Semua Selesai

**API akan:**
- ✅ Bisa diakses di `/docs`
- ✅ Endpoint `/api/predictions/grid` jalan
- ✅ CORS sudah dikonfigurasi
- ✅ Website Vercel bisa akses

**Error akan hilang dan prediksi muncul!** 🎉

---

**Reload web app dan test `/docs` sekarang!** 🚀
