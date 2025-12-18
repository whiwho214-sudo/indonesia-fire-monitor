# 🔄 Uninstall & Reinstall Mangum di Lokasi Benar

## ❌ Masalah
Mangum terinstall di luar folder `ml-prediction`, padahal seharusnya di dalam folder project.

---

## ✅ Solusi: Uninstall & Reinstall

### **Step 1: Uninstall Mangum yang Lama**

**Di Bash console PythonAnywhere:**

```bash
pip uninstall mangum -y
```

**Atau jika pakai `--user`:**

```bash
pip uninstall mangum --user -y
```

**Tunggu** sampai uninstall selesai.

---

### **Step 2: Navigate ke Folder ml-prediction**

```bash
cd ~/indonesia-fire-monitor/ml-prediction
```

**Verifikasi**:
```bash
pwd
# Harus muncul: /home/nicocode/indonesia-fire-monitor/ml-prediction
```

---

### **Step 3: Install Mangum di Folder ml-prediction**

```bash
pip install --user mangum
```

**Tunggu** sampai install selesai.

---

### **Step 4: Verifikasi Install**

**Test import dari folder ml-prediction:**

```bash
python3.10 -c "from mangum import Mangum; print('Mangum OK')"
```

**Atau jika PythonAnywhere pakai Python 3.13:**

```bash
python3.13 -c "from mangum import Mangum; print('Mangum OK')"
```

**Harus muncul**: `Mangum OK` ✅

---

### **Step 5: Cek Lokasi Install**

**Cek mangum terinstall di lokasi yang benar:**

```bash
python3.10 -c "import mangum; print(mangum.__file__)"
```

**Atau:**

```bash
pip show mangum
```

**Harus menunjukkan** path di `/home/nicocode/.local/lib/...` ✅

---

### **Step 6: Reload Web App**

1. **Web** tab → **Klik "Reload"** (tombol hijau)
2. **Tunggu** sampai status jadi "Running"

---

### **Step 7: Test API**

1. **Buka**: `https://nicocode.pythonanywhere.com/docs`
2. **Harus muncul Swagger UI** → **Berhasil!** ✅

---

## 🚨 Troubleshooting

### **Problem 1: Uninstall Gagal**

**Gejala**: Error saat uninstall

**Fix**:
1. **Cek** mangum terinstall:
```bash
pip list | grep mangum
```

2. **Uninstall** dengan flag yang sesuai:
```bash
# Jika install dengan --user
pip uninstall mangum --user -y

# Jika install tanpa --user
pip uninstall mangum -y
```

---

### **Problem 2: Masih Import dari Lokasi Lama**

**Gejala**: Masih import mangum dari lokasi lama

**Fix**:
1. **Uninstall** semua mangum:
```bash
pip uninstall mangum -y
pip uninstall mangum --user -y
```

2. **Install ulang** di folder ml-prediction:
```bash
cd ~/indonesia-fire-monitor/ml-prediction
pip install --user mangum
```

3. **Test import**:
```bash
python3.10 -c "from mangum import Mangum; print('OK')"
```

---

### **Problem 3: Multiple Mangum Installations**

**Gejala**: Ada beberapa install mangum di lokasi berbeda

**Fix**:
1. **Uninstall semua**:
```bash
pip uninstall mangum -y
pip uninstall mangum --user -y
```

2. **Cek** tidak ada mangum:
```bash
pip list | grep mangum
```

3. **Install sekali** di folder ml-prediction:
```bash
cd ~/indonesia-fire-monitor/ml-prediction
pip install --user mangum
```

---

## 📋 Checklist

- [ ] Uninstall mangum yang lama
- [ ] Navigate ke folder `ml-prediction`
- [ ] Install mangum di folder `ml-prediction`
- [ ] Verifikasi install berhasil
- [ ] Test import berhasil
- [ ] Reload web app
- [ ] Test `/docs` berhasil

---

## 🎯 Quick Commands

```bash
# 1. Uninstall yang lama
pip uninstall mangum --user -y

# 2. Masuk ke folder
cd ~/indonesia-fire-monitor/ml-prediction

# 3. Install di folder ml-prediction
pip install --user mangum

# 4. Test
python3.10 -c "from mangum import Mangum; print('OK')"

# 5. Reload web app → Test /docs
```

---

## 💡 Tips

1. **`--user` flag** install di `~/.local/lib/` (user directory)
2. **Tanpa `--user`** install di system directory
3. **PythonAnywhere** biasanya pakai `--user` untuk free tier
4. **Lokasi tidak masalah** selama Python bisa import

---

## ✅ Setelah Reinstall

**Mangum akan:**
- ✅ Terinstall di lokasi yang benar
- ✅ Bisa di-import oleh WSGI
- ✅ Web app bisa jalan
- ✅ API bisa diakses

**Error akan hilang!** 🎉

---

**Uninstall mangum lama, lalu install di folder ml-prediction!** 🚀
