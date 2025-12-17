# 🆓 Hosting API Gratis Tanpa Kartu Kredit

## 🎯 Alternatif Gratis Tanpa Kartu

### **Opsi 1: Fly.io (RECOMMENDED - Gratis, No Card!)**

**Keuntungan:**
- ✅ **Gratis** tanpa kartu kredit
- ✅ **No warning page** - Langsung return JSON
- ✅ **No sleep** - Tetap running 24/7
- ✅ **Stable** untuk production

**Cara Setup:**

#### **Step 1: Install Fly CLI**
```powershell
# Windows PowerShell
iwr https://fly.io/install.ps1 -useb | iex
```

#### **Step 2: Login**
```bash
fly auth login
```
(Buka browser untuk login dengan GitHub)

#### **Step 3: Deploy**
```bash
cd ml-prediction
fly launch
```

**Follow prompts:**
- App name: `indonesia-fire-monitor-api`
- Region: Pilih terdekat (Singapore atau Tokyo)
- PostgreSQL: No
- Redis: No

#### **Step 4: Get URL**
```bash
fly info
```
URL akan muncul, contoh: `https://indonesia-fire-monitor-api.fly.dev`

#### **Step 5: Set di Vercel**
1. **Vercel** → **Environment Variables**
2. **Set**: `VITE_PREDICTION_API_URL` = URL Fly.io
3. **Redeploy**

---

### **Opsi 2: PythonAnywhere (Gratis, No Card)**

**Keuntungan:**
- ✅ **Gratis** tanpa kartu
- ✅ **Khusus Python** - Perfect untuk FastAPI
- ⚠️ Limit: 1 web app, 512MB storage

**Cara Setup:**

1. **Daftar**: https://www.pythonanywhere.com/
2. **Sign Up** (gratis, no card)
3. **Web** tab → **Add a new web app**
4. **Choose framework**: Flask (bisa dipakai untuk FastAPI)
5. **Upload code** via Git atau Files tab
6. **Configure** untuk FastAPI
7. **Get URL**: `https://yourusername.pythonanywhere.com`

---

### **Opsi 3: Ngrok dengan Static Domain (Gratis dengan Limit)**

**Jika tetap pakai ngrok:**

#### **Fix Warning Page dengan Custom Header**

**Update code untuk handle HTML response:**

Saya sudah update code untuk detect HTML response. Tapi jika masih masalah, coba:

1. **Pastikan API local running**
2. **Pastikan ngrok running**
3. **Test dengan curl**:
```bash
curl -H "ngrok-skip-browser-warning: true" https://your-ngrok-url.ngrok-free.app/
```

4. **Atau pakai custom User-Agent**:
```javascript
headers: {
  'Accept': 'application/json',
  'ngrok-skip-browser-warning': 'true',
  'User-Agent': 'Mozilla/5.0 (Custom)'
}
```

---

### **Opsi 4: LocalTunnel (Alternatif Ngrok)**

**Gratis tanpa kartu:**

```bash
# Install
npm install -g localtunnel

# Run tunnel
lt --port 8000
```

**URL akan muncul**, contoh: `https://abc123.loca.lt`

**Set di Vercel** → Environment variable

---

## 🚀 REKOMENDASI: Fly.io

**Kenapa Fly.io?**
- ✅ Gratis tanpa kartu
- ✅ No warning page
- ✅ No sleep (tetap running)
- ✅ Perfect untuk production

**Total waktu setup: ~10 menit**

---

## 📋 Checklist Setup Fly.io

- [ ] Fly CLI installed
- [ ] Login dengan GitHub
- [ ] `fly launch` di folder ml-prediction
- [ ] Deploy successful
- [ ] URL Fly.io di-copy
- [ ] Set di Vercel environment variables
- [ ] Website redeployed
- [ ] Test prediction berhasil

---

## 🧪 Test Setelah Deploy

**Test API:**
```
https://your-app.fly.dev/docs
```

**Harus muncul Swagger UI** → API jalan! ✅

---

## 💡 Tips

1. **Fly.io free tier** ada limit tapi cukup untuk development
2. **Monitor usage** di Fly.io dashboard
3. **Check logs** jika ada error

---

## ✅ Setelah Setup

**Website akan:**
- ✅ API return JSON (bukan HTML)
- ✅ Prediction muncul
- ✅ Semua fitur berfungsi
- ✅ Tidak ada error

**Total waktu: ~10 menit!** 🚀
