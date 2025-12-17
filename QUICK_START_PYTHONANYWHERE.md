# ⚡ Quick Start: PythonAnywhere (5 Langkah)

## 🎯 Ringkasan Cepat

### **1. Daftar** (2 menit)
- Buka: https://www.pythonanywhere.com/
- Sign up → Verify email → Login

### **2. Upload Code** (3 menit)
```bash
# Di Bash console PythonAnywhere
cd ~
git clone https://github.com/whiwho214-sudo/indonesia-fire-monitor.git
```

### **3. Install Dependencies** (3 menit)
```bash
cd indonesia-fire-monitor/ml-prediction
python3.10 -m venv venv
source venv/bin/activate
pip install --user -r requirements.txt
```

### **4. Buat Web App** (5 menit)
- Web tab → Add web app
- Flask → Python 3.10
- Path: `/home/yourusername/indonesia-fire-monitor/ml-prediction`
- Edit WSGI file (copy dari `pythonanywhere-wsgi.py`)
- Ganti `yourusername` dengan username Anda
- Reload

### **5. Set di Vercel** (2 menit)
- Vercel → Environment Variables
- Update: `VITE_PREDICTION_API_URL` = `https://yourusername.pythonanywhere.com`
- Redeploy

---

## 📋 Checklist

- [ ] Account created
- [ ] Code uploaded
- [ ] Dependencies installed
- [ ] Web app created
- [ ] WSGI configured (username di-update!)
- [ ] Test `/docs` berhasil
- [ ] Set di Vercel
- [ ] Redeploy
- [ ] Test prediction

---

## 🚨 PENTING!

**Ganti `yourusername` di 2 tempat:**
1. **Path di Web app**: `/home/yourusername/...`
2. **WSGI file**: `username = 'yourusername'`

**Total waktu: ~15 menit!** 🚀
