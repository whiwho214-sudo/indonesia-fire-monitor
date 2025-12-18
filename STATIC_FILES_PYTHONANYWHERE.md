# 📁 Static Files di PythonAnywhere - Perlu Diisi?

## ❓ Pertanyaan
**Section "Static files" di Web tab PythonAnywhere perlu diisi?**

## ✅ Jawaban: **TIDAK PERLU**

**Kenapa?**
- ✅ **API FastAPI** hanya return JSON, bukan serve static files
- ✅ **Tidak ada CSS/JavaScript** yang perlu di-serve
- ✅ **Tidak ada uploaded files** yang perlu di-serve
- ✅ **Skip section ini** - Langsung ke configure WSGI file

---

## 🎯 Yang Perlu Diisi

### **1. Code Section (WSGI File) - WAJIB! ✅**
- **Ini yang penting** untuk FastAPI
- **Edit `wsgi.py`** file
- **Configure** untuk import FastAPI app

### **2. Static Files - SKIP ❌**
- **Tidak perlu** diisi untuk API
- **Biarkan kosong**
- **Langsung ke step berikutnya**

---

## 📋 Checklist Setup Web App

### **Yang WAJIB:**
- [x] Web app created ✅
- [x] Path di-set ✅
- [x] **WSGI file di-configure** ✅ (PENTING!)
- [x] Username di-update di WSGI ✅
- [x] Web app di-reload ✅

### **Yang BISA SKIP:**
- [ ] Static files (tidak perlu untuk API)
- [ ] Static URL mapping (tidak perlu)

---

## 🚀 Langkah Selanjutnya

**Setelah web app dibuat:**

1. **Skip** section "Static files" (biarkan kosong)
2. **Scroll ke "Code" section**
3. **Edit WSGI file** (ini yang penting!)
4. **Save** → **Reload**
5. **Test** `/docs` endpoint

---

## 💡 Kapan Perlu Static Files?

**Hanya perlu jika:**
- ❌ Serve CSS files
- ❌ Serve JavaScript files
- ❌ Serve uploaded images/files
- ❌ Serve static assets

**Untuk API FastAPI:**
- ✅ **Tidak perlu** - API hanya return JSON
- ✅ **Skip** section ini

---

## ✅ Kesimpulan

**Static Files = SKIP** ❌

**Fokus ke:**
- ✅ **WSGI file configuration** (PENTING!)
- ✅ **Path configuration**
- ✅ **Reload web app**

---

**Lanjut ke configure WSGI file!** 🚀
