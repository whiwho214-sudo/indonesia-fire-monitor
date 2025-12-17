# 🔧 Fix: API Return HTML Bukan JSON

## ❌ Masalah
API masih return **HTML (ngrok error page)** bukan JSON, sehingga prediksi tidak muncul.

**Dari screenshot terlihat:**
- Warning: "Tidak ada prediksi yang dikembalikan dari API"
- Console show HTML dari ngrok error page
- API response bukan JSON

---

## ✅ Solusi: Pakai Render (RECOMMENDED)

**Ngrok free tier punya masalah:**
- ❌ Warning page yang sulit di-skip
- ❌ URL berubah setiap restart
- ❌ Tidak reliable untuk production

**Render lebih baik:**
- ✅ **Tidak ada warning page**
- ✅ **Langsung return JSON**
- ✅ **Stable** untuk production
- ✅ **Gratis** (no card)

---

## 🚀 Setup Render (5 Menit)

### **Step 1: Deploy API ke Render**

1. **Buka**: https://render.com/
2. **Sign Up** dengan GitHub (gratis, no card)
3. **New +** → **Web Service**
4. **Connect GitHub**: `indonesia-fire-monitor`
5. **Configure**:
   ```
   Name: indonesia-fire-monitor-api
   Root Directory: ml-prediction  ⚠️ PENTING!
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn api.prediction_api:app --host 0.0.0.0 --port $PORT
   Plan: Free
   ```
6. **Create Web Service**
7. **Tunggu deploy** (5-10 menit)
8. **Copy URL** (contoh: `https://indonesia-fire-monitor-api.onrender.com`)

### **Step 2: Set di Vercel**

1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. **Edit** variable `VITE_PREDICTION_API_URL`:
   - **Value**: URL Render Anda (ganti URL ngrok)
   - **Save**
3. **Redeploy** website

### **Step 3: Test**

1. **Buka website Vercel**
2. **Aktifkan layer "Predictions"**
3. **Error hilang!** ✅

---

## 🔧 Alternatif: Fix Ngrok (Jika Tetap Pakai)

**Jika tetap pakai ngrok, coba ini:**

### **Fix 1: Pastikan Header Ada**

**Cek di browser console (F12):**

```javascript
// Test dengan header
fetch('https://your-ngrok-url.ngrok-free.app/api/predictions/grid?bbox=95,-11,141,6&date=2024-12-20&grid_size=0.5', {
  headers: {
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    'User-Agent': 'Mozilla/5.0' // Custom user agent juga bisa
  }
})
  .then(r => r.text())
  .then(text => {
    console.log('Response type:', text.substring(0, 100));
    if (text.includes('<!DOCTYPE html>')) {
      console.error('❌ Masih dapat HTML!');
    } else {
      console.log('✅ JSON:', JSON.parse(text));
    }
  })
```

### **Fix 2: Upgrade Ngrok**

**Upgrade ke paid plan:**
- **No warning page**
- **Static domain**
- **Cost**: ~$8/bulan

---

## 🧪 Test API Response

**Buka browser console (F12) di website Vercel:**

```javascript
async function testAPI() {
  const apiUrl = import.meta.env.VITE_PREDICTION_API_URL;
  console.log('Testing:', apiUrl);
  
  try {
    const res = await fetch(`${apiUrl}/api/predictions/grid?bbox=95,-11,141,6&date=2024-12-20&grid_size=0.5`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    
    const text = await res.text();
    console.log('Response (first 200 chars):', text.substring(0, 200));
    
    if (text.includes('<!DOCTYPE html>') || text.includes('ngrok')) {
      console.error('❌ Masih dapat HTML! Pakai Render lebih baik.');
    } else {
      const json = JSON.parse(text);
      console.log('✅ JSON OK:', json);
    }
  } catch (e) {
    console.error('Error:', e);
  }
}

testAPI();
```

---

## ✅ Checklist

- [ ] Deploy API ke Render (atau fix ngrok)
- [ ] URL Render di-copy
- [ ] Environment variable di-update di Vercel
- [ ] Website redeployed
- [ ] Test API return JSON (bukan HTML)
- [ ] Prediction muncul di map

---

## 🎯 Rekomendasi Final

**Pakai Render** - Lebih reliable dan tidak ada masalah warning page!

**Total waktu: 5 menit** 🚀

**Setelah deploy Render, prediksi akan langsung muncul!** ✅
