# 📤 Upload Code ke PythonAnywhere: Pilih Salah Satu

## 🎯 Yang Diperlukan

**Hanya folder `ml-prediction`** yang diperlukan untuk API, **BUKAN** full project!

---

## ✅ Opsi 1: Upload Hanya Folder `ml-prediction` (RECOMMENDED)

### **Kenapa?**
- ✅ **Lebih cepat** - File lebih sedikit
- ✅ **Lebih ringan** - Tidak perlu upload frontend
- ✅ **Lebih efisien** - Hanya yang diperlukan

### **Cara Upload:**

#### **Step 1: Zip Folder `ml-prediction`**
1. **Di komputer Anda**, buka folder `indonesia-fire-monitor`
2. **Klik kanan** folder `ml-prediction`
3. **Send to** → **Compressed (zipped) folder**
4. **File akan jadi**: `ml-prediction.zip`

#### **Step 2: Upload ke PythonAnywhere**
1. **PythonAnywhere** → **Files** tab
2. **Klik "Upload a file"**
3. **Pilih** `ml-prediction.zip`
4. **Tunggu upload selesai**

#### **Step 3: Extract**
1. **Buka Bash console** (Files tab → Open Bash console)
2. **Ketik**:
```bash
cd ~
unzip ml-prediction.zip
```

#### **Step 4: Verifikasi**
```bash
ls -la ml-prediction
```

**Harus muncul** folder dan file di dalam `ml-prediction`

---

## ✅ Opsi 2: Clone Full Project via Git (Alternatif)

### **Kenapa?**
- ✅ **Mudah update** - Cukup `git pull`
- ✅ **Lengkap** - Semua file ada
- ⚠️ **Lebih besar** - Upload lebih lama

### **Cara Clone:**

#### **Step 1: Clone Repository**
```bash
cd ~
git clone https://github.com/whiwho214-sudo/indonesia-fire-monitor.git
```

**Ini akan clone FULL project** (termasuk frontend, dll)

#### **Step 2: Navigate ke Folder API**
```bash
cd indonesia-fire-monitor/ml-prediction
```

**Kita hanya pakai folder `ml-prediction`**, folder lain tidak dipakai

---

## 📋 Perbandingan

| | Upload `ml-prediction` | Clone Full Project |
|---|---|---|
| **Ukuran** | Kecil (~50MB) | Besar (~200MB) |
| **Waktu Upload** | Cepat (2-3 menit) | Lambat (5-10 menit) |
| **Update** | Manual upload ulang | `git pull` |
| **Storage** | Hemat | Boros |
| **Rekomendasi** | ✅ Untuk pertama kali | ✅ Untuk update berkala |

---

## 🎯 REKOMENDASI

### **Untuk Pertama Kali:**
**Upload hanya folder `ml-prediction`** (Opsi 1)
- Lebih cepat
- Lebih ringan
- Cukup untuk API

### **Untuk Update Berkala:**
**Clone full project via Git** (Opsi 2)
- Mudah update dengan `git pull`
- Semua file selalu sync

---

## 📁 Struktur Folder di PythonAnywhere

### **Jika Upload Hanya `ml-prediction`:**
```
/home/yourusername/
└── ml-prediction/
    ├── api/
    ├── data/
    ├── src/
    ├── requirements.txt
    └── ...
```

**Path untuk Web app:**
```
/home/yourusername/ml-prediction
```

### **Jika Clone Full Project:**
```
/home/yourusername/
└── indonesia-fire-monitor/
    ├── ml-prediction/  ← INI YANG DIPAKAI
    ├── src/            ← Tidak dipakai
    ├── dist/           ← Tidak dipakai
    └── ...
```

**Path untuk Web app:**
```
/home/yourusername/indonesia-fire-monitor/ml-prediction
```

---

## ✅ Checklist Upload

### **Opsi 1 (Upload `ml-prediction`):**
- [ ] Zip folder `ml-prediction`
- [ ] Upload `ml-prediction.zip` ke PythonAnywhere
- [ ] Extract di Bash console
- [ ] Verifikasi folder ada
- [ ] Path di Web app: `/home/yourusername/ml-prediction`

### **Opsi 2 (Clone Full Project):**
- [ ] Clone repository via Git
- [ ] Navigate ke `ml-prediction` folder
- [ ] Verifikasi folder ada
- [ ] Path di Web app: `/home/yourusername/indonesia-fire-monitor/ml-prediction`

---

## 💡 Tips

1. **Pilih opsi sesuai kebutuhan**:
   - Pertama kali → Upload `ml-prediction` saja
   - Update berkala → Clone full project

2. **Cek ukuran file** sebelum upload:
   - `ml-prediction` saja: ~50MB
   - Full project: ~200MB

3. **Monitor storage** di PythonAnywhere:
   - Free tier: 512MB limit
   - Full project lebih boros storage

---

## 🚀 Quick Action

**Untuk pertama kali, saya rekomendasikan:**

1. **Zip folder `ml-prediction`**
2. **Upload ke PythonAnywhere**
3. **Extract**
4. **Lanjut setup Web app**

**Lebih cepat dan efisien!** ✅

---

**Pilih opsi yang sesuai kebutuhan Anda!** 🎯
