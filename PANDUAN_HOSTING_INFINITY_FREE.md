# 🚀 Panduan Hosting Indonesia Fire Monitor di Infinity Free

## 📋 Persiapan Sebelum Upload

### 1. Build Aplikasi (SUDAH SELESAI ✅)
Aplikasi sudah di-build dan file production tersedia di folder `dist/`

### 2. Daftar Akun Infinity Free
1. Kunjungi: https://infinityfree.net/
2. Klik "Create Account"
3. Isi form pendaftaran dengan email valid
4. Verifikasi email Anda
5. Login ke control panel

## 🌐 Langkah-langkah Hosting Website

### Step 1: Buat Website Baru
1. Login ke Infinity Free control panel
2. Klik "Create Account" untuk membuat hosting account baru
3. Pilih subdomain gratis (contoh: `yourname.epizy.com`) atau gunakan domain sendiri
4. Tunggu proses pembuatan account (biasanya 5-10 menit)

### Step 2: Upload File Website
1. Setelah account aktif, masuk ke "File Manager" atau gunakan FTP
2. Masuk ke folder `htdocs` (ini adalah root directory website Anda)
3. Upload SEMUA file dari folder `dist/` ke dalam `htdocs`

#### File yang harus diupload dari folder `dist/`:
```
dist/
├── index.html          ← Upload ke htdocs/
├── assets/
│   ├── index-CIA125eu.css    ← Upload ke htdocs/assets/
│   └── index-RBEG3qNH.js     ← Upload ke htdocs/assets/
└── fire-icon.svg       ← Upload ke htdocs/ (jika ada)
```

### Step 3: Konfigurasi untuk React SPA
Karena ini adalah Single Page Application (SPA), buat file `.htaccess` di folder `htdocs`:

**File: htdocs/.htaccess**
```apache
RewriteEngine On
RewriteBase /

# Handle Angular and React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable GZIP compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

## 🔧 Masalah API dan Solusinya

### ⚠️ PENTING: Keterbatasan Infinity Free
Infinity Free TIDAK mendukung:
- Python/Flask/FastAPI
- Node.js backend
- Database MySQL untuk aplikasi Python
- Eksekusi script server-side selain PHP

### 💡 Solusi untuk API Machine Learning

#### Opsi 1: Hosting API Terpisah (RECOMMENDED)
1. **Frontend di Infinity Free** (gratis)
2. **API di platform lain**:
   - **Railway.app** (gratis dengan limit)
   - **Render.com** (gratis dengan limit)
   - **Heroku** (berbayar)
   - **PythonAnywhere** (gratis dengan limit)

#### Opsi 2: Konversi ke PHP (Kompleks)
Mengubah API Python menjadi PHP - tidak praktis untuk ML models.

#### Opsi 3: Client-Side Only (Terbatas)
Menggunakan JavaScript untuk prediksi sederhana tanpa ML models.

## 🚀 Implementasi Solusi Hybrid

### Setup API di Railway.app (Gratis)

1. **Daftar di Railway.app**
   - Kunjungi: https://railway.app/
   - Login dengan GitHub

2. **Deploy API Python**
   ```bash
   # Buat file railway.json di folder ml-prediction/
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "uvicorn api.prediction_api:app --host 0.0.0.0 --port $PORT"
     }
   }
   ```

3. **Update konfigurasi API di website**
   - Edit file `src/services/api.js`
   - Ganti URL API ke Railway deployment

### Update Konfigurasi Frontend

**File: src/services/api.js**
```javascript
// Ganti URL ini dengan URL Railway deployment Anda
const API_BASE_URL = 'https://your-app-name.railway.app';

// Atau gunakan environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

## 📁 Struktur File di Infinity Free

```
htdocs/
├── index.html
├── .htaccess
├── assets/
│   ├── index-CIA125eu.css
│   └── index-RBEG3qNH.js
└── fire-icon.svg (jika ada)
```

## 🔍 Testing dan Troubleshooting

### 1. Test Website
- Buka URL website Anda: `https://yourname.epizy.com`
- Pastikan halaman loading dengan benar
- Check browser console untuk error

### 2. Common Issues

#### CORS Error
Jika ada CORS error saat mengakses API:
```javascript
// Tambahkan di API Python (prediction_api.py)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourname.epizy.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### 404 Error pada Routing
Pastikan file `.htaccess` sudah diupload dengan benar.

#### Slow Loading
- Aktifkan GZIP compression (sudah ada di .htaccess)
- Optimize images
- Use CDN untuk assets besar

## 📊 Monitoring dan Maintenance

### 1. Infinity Free Limitations
- **Bandwidth**: 10GB/bulan
- **Storage**: 5GB
- **Hits**: 50,000/hari
- **No SSL** pada subdomain gratis (upgrade untuk SSL)

### 2. Backup Strategy
- Selalu simpan backup file di local
- Export database secara berkala (jika menggunakan)

## 🎯 Langkah Selanjutnya

1. ✅ Upload file website ke Infinity Free
2. ✅ Buat file .htaccess
3. 🔄 Setup API di Railway/Render
4. 🔄 Update konfigurasi API URL
5. 🔄 Test seluruh aplikasi
6. 🔄 Monitor performance

## 📞 Support

Jika mengalami masalah:
1. Check Infinity Free documentation
2. Check browser console untuk error
3. Test API endpoint secara terpisah
4. Periksa file .htaccess syntax

---

**🎉 Selamat! Website Anda siap di-hosting di Infinity Free!**
