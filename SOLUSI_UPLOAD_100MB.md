# 📦 Solusi Upload dengan Limit 100MB

## ❌ Masalah
PythonAnywhere free tier punya limit **100MB** untuk upload file.

**Jika folder `ml-prediction` lebih dari 100MB**, perlu solusi alternatif.

---

## 🔍 Cek Ukuran Folder

### **Di Windows (PowerShell):**
```powershell
Get-ChildItem -Path "ml-prediction" -Recurse -File | Measure-Object -Property Length -Sum
```

### **Atau Manual:**
1. **Klik kanan** folder `ml-prediction`
2. **Properties**
3. **Cek "Size"**

---

## ✅ Solusi: Exclude File Besar

### **File yang Bisa Di-Exclude:**

#### **1. Virtual Environment (`venv/`)**
- **Ukuran**: ~500MB+
- **Tidak diperlukan** - PythonAnywhere akan install sendiri
- **Exclude**: ✅

#### **2. Model Files (Jika Besar)**
- **File**: `data/models/*.pkl`
- **Ukuran**: Bisa besar (50-100MB+)
- **Perlu**: ✅ (Tapi bisa upload terpisah)

#### **3. Data CSV (Jika Besar)**
- **File**: `data/processed/features.csv`
- **Ukuran**: Bisa besar (50MB+)
- **Perlu**: ⚠️ (Tapi bisa generate ulang)

#### **4. Cache Files**
- **Folder**: `__pycache__/`, `*.pyc`
- **Ukuran**: Kecil tapi banyak
- **Exclude**: ✅

---

## 🚀 Solusi 1: Upload Tanpa `venv/` (RECOMMENDED)

### **Step 1: Buat Zip Tanpa `venv/`**

**Di Windows:**
1. **Buka folder** `ml-prediction`
2. **Hapus atau rename** folder `venv` (sementara)
3. **Zip folder** `ml-prediction`
4. **Rename kembali** `venv` (jika dihapus)

**Atau via PowerShell:**
```powershell
# Exclude venv saat zip
Compress-Archive -Path ml-prediction\* -DestinationPath ml-prediction-no-venv.zip -Exclude venv
```

### **Step 2: Upload ke PythonAnywhere**
1. **Upload** `ml-prediction-no-venv.zip`
2. **Extract** di Bash console
3. **Install dependencies** di PythonAnywhere (bukan dari venv)

---

## 🚀 Solusi 2: Upload File Besar Terpisah

### **Jika Model File Besar (>50MB):**

#### **Step 1: Upload Code Tanpa Model**
1. **Temporary rename** folder `data/models/`
2. **Zip** folder `ml-prediction`
3. **Upload** ke PythonAnywhere
4. **Extract**

#### **Step 2: Upload Model File Terpisah**
1. **Zip** hanya folder `data/models/`
2. **Upload** terpisah
3. **Extract** ke folder yang sudah ada

---

## 🚀 Solusi 3: Via Git (Jika Repository Ada)

### **Clone via Git (Tidak Ada Limit Upload):**

```bash
# Di PythonAnywhere Bash console
cd ~
git clone https://github.com/whiwho214-sudo/indonesia-fire-monitor.git
cd indonesia-fire-monitor/ml-prediction
```

**Git clone tidak ada limit 100MB!** ✅

---

## 🚀 Solusi 4: Exclude Multiple Folders

### **Buat Zip Tanpa File Besar:**

**Via PowerShell:**
```powershell
# Exclude venv, __pycache__, dan file besar
$exclude = @('venv', '__pycache__', '*.pyc', 'data/processed/features.csv')
Compress-Archive -Path ml-prediction\* -DestinationPath ml-prediction-minimal.zip
```

**Atau Manual:**
1. **Temporary rename**:
   - `venv/` → `venv_backup/`
   - `__pycache__/` → `__pycache___backup/`
2. **Zip** folder
3. **Rename kembali**

---

## 📋 Checklist Upload Minimal

### **File yang HARUS Ada:**
- [ ] `api/prediction_api.py` ✅
- [ ] `src/` folder (semua file Python) ✅
- [ ] `data/models/` (model files) ✅
- [ ] `requirements.txt` ✅

### **File yang BISA Di-Exclude:**
- [ ] `venv/` (akan install di PythonAnywhere) ❌
- [ ] `__pycache__/` (auto-generated) ❌
- [ ] `*.pyc` (compiled Python) ❌
- [ ] `data/processed/features.csv` (bisa generate ulang) ⚠️

---

## 🎯 REKOMENDASI

### **Opsi Terbaik: Via Git**
```bash
git clone https://github.com/whiwhere214-sudo/indonesia-fire-monitor.git
```
- ✅ **Tidak ada limit 100MB**
- ✅ **Mudah update** dengan `git pull`
- ✅ **Semua file ada**

### **Opsi Alternatif: Upload Minimal**
- Exclude `venv/`
- Exclude `__pycache__/`
- Upload code + model files saja

---

## 💡 Tips

1. **Cek ukuran** sebelum upload
2. **Exclude `venv/`** selalu (tidak diperlukan)
3. **Pakai Git** jika repository sudah ada (tidak ada limit)
4. **Upload model files terpisah** jika masih besar

---

## 🧪 Test Ukuran

**Cek ukuran folder:**
```powershell
# Di PowerShell
(Get-ChildItem -Path "ml-prediction" -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB
```

**Jika < 100MB**: Upload langsung ✅
**Jika > 100MB**: Exclude `venv/` atau pakai Git ✅

---

**Pilih solusi yang sesuai!** 🎯
