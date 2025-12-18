# 📦 Install Mangum di PythonAnywhere

## ❌ Error
**"Mangum not installed. Run: pip install --user mangum"**

**Artinya**: Mangum belum terinstall di PythonAnywhere!

---

## ✅ Solusi: Install Mangum

### **Step 1: Buka Bash Console**

1. **PythonAnywhere Dashboard** → **Files** tab
2. **Scroll ke bawah** → **"Open Bash console here"**
3. **Terminal akan terbuka** di browser

---

### **Step 2: Navigate ke Folder**

**Di Bash console, ketik:**

```bash
cd ~/indonesia-fire-monitor/ml-prediction
```

**Verifikasi**:
```bash
pwd
ls -la
```

**Harus muncul** folder dan file project ✅

---

### **Step 3: Install Mangum**

**Di Bash console, ketik:**

```bash
pip install --user mangum
```

**Tunggu** sampai install selesai (30 detik - 1 menit)

**Output akan seperti**:
```
Collecting mangum
  Downloading mangum-0.17.0-py3-none-any.whl
Installing collected packages: mangum
Successfully installed mangum-0.17.0
```

---

### **Step 4: Verifikasi Install**

**Test apakah mangum terinstall:**

```bash
python3.10 -c "from mangum import Mangum; print('Mangum OK')"
```

**Harus muncul**: `Mangum OK` ✅

---

### **Step 5: Reload Web App**

1. **Web** tab di PythonAnywhere
2. **Klik "Reload"** (tombol hijau)
3. **Tunggu** sampai status jadi "Running"

---

### **Step 6: Test API**

1. **Buka**: `https://nicocode.pythonanywhere.com/docs`
2. **Harus muncul Swagger UI** → **Berhasil!** ✅

---

## 🚨 Troubleshooting

### **Problem 1: pip install Gagal**

**Gejala**: Error saat install mangum

**Fix**:
1. **Cek** internet connection
2. **Coba lagi**:
```bash
pip install --user mangum
```

---

### **Problem 2: Mangum Terinstall Tapi Masih Error**

**Gejala**: Masih muncul "Mangum not installed"

**Fix**:
1. **Verifikasi** mangum terinstall:
```bash
pip list | grep mangum
```

2. **Pastikan** WSGI file sudah benar (pakai Mangum wrapper)

3. **Reload** web app

---

### **Problem 3: Import Error Setelah Install**

**Gejala**: Error "cannot import Mangum"

**Fix**:
1. **Cek** mangum terinstall:
```bash
python3.10 -c "import mangum; print(mangum.__version__)"
```

2. **Jika error**, install ulang:
```bash
pip install --user --upgrade mangum
```

---

## 📋 Checklist

- [ ] Bash console dibuka
- [ ] Navigate ke folder `ml-prediction`
- [ ] Install mangum: `pip install --user mangum`
- [ ] Verifikasi install berhasil
- [ ] Reload web app
- [ ] Test `/docs` berhasil

---

## 🎯 Quick Commands

```bash
# Di Bash console PythonAnywhere
cd ~/indonesia-fire-monitor/ml-prediction
pip install --user mangum
python3.10 -c "from mangum import Mangum; print('OK')"
```

**Lalu reload web app** → Test `/docs` ✅

---

## ✅ Setelah Install Mangum

**API akan:**
- ✅ Bisa diakses di `/docs`
- ✅ Endpoint `/api/predictions/grid` jalan
- ✅ CORS sudah dikonfigurasi
- ✅ Website Vercel bisa akses

**Error akan hilang!** 🎉

---

**Install mangum di Bash console PythonAnywhere, lalu reload web app!** 🚀
