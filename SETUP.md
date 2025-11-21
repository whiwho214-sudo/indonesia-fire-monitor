# 🚀 Setup Instructions - Indonesia Fire Monitor

## Prerequisites yang Harus Diinstall

### 1. Install Node.js
Aplikasi ini membutuhkan Node.js dan npm.

**Download dan Install:**
- Kunjungi: https://nodejs.org/
- Download versi LTS (Long Term Support)
- Install dengan double-click installer
- Ikuti wizard instalasi

**Verifikasi Instalasi:**
Buka Command Prompt atau PowerShell, lalu ketik:
```bash
node --version
npm --version
```

Jika muncul nomor versi, instalasi berhasil!

### 2. Dapatkan NASA FIRMS API Key

**Langkah-langkah:**

1. Buka browser dan kunjungi: https://firms.modaps.eosdis.nasa.gov/api/area/

2. Scroll ke bawah dan temukan form "Request a MAP_KEY"

3. Isi form dengan:
   - **Email:** email aktif Anda
   - **First Name:** nama depan Anda
   - **Last Name:** nama belakang Anda
   - **Organization:** nama organisasi/universitas (atau "Personal")
   - **Use Case:** tuliskan "Fire monitoring application for Indonesia"

4. Klik **Submit**

5. Cek email Anda (termasuk folder spam)

6. Anda akan menerima email dengan MAP_KEY seperti ini:
   ```
   Your MAP_KEY: a1b2c3d4e5f6g7h8i9j0
   ```

7. Salin MAP_KEY tersebut (Anda akan membutuhkannya nanti)

## 📦 Installation Steps

### Step 1: Buka Project Folder
```bash
cd C:\Users\Moehi\OneDrive\Documents\indonesia-fire-monitor
```

### Step 2: Install Dependencies
```bash
npm install
```

Proses ini akan:
- Download semua library yang dibutuhkan
- Membuat folder `node_modules`
- Memakan waktu 2-5 menit tergantung koneksi internet

### Step 3: Setup Environment Variables

1. **Salin file `.env.example` menjadi `.env`:**
   ```bash
   copy .env.example .env
   ```

2. **Buka file `.env` dengan text editor** (Notepad, VS Code, dll)

3. **Ganti `your_map_key_here` dengan MAP_KEY NASA Anda:**
   ```env
   VITE_NASA_MAP_KEY=28a847cd248c2272dc9b58b20e74fa9f
   ```

4. **Simpan file `.env`**

### Step 4: Run Development Server
```bash
npm run dev
```

Anda akan melihat output seperti:
```
  VITE v5.3.1  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 5: Buka Browser
- Browser akan otomatis terbuka di `http://localhost:3000`
- Atau buka manual dengan copy-paste URL tersebut

## ✅ Verifikasi

Jika setup berhasil, Anda akan melihat:
- ✅ Peta Indonesia ter-load
- ✅ Marker hotspot muncul di peta
- ✅ Sidebar kiri dan kanan muncul
- ✅ Header menunjukkan waktu update terakhir

## ❌ Troubleshooting

### Problem: `npm: command not found`
**Solusi:** 
- Node.js belum terinstall
- Install Node.js dari https://nodejs.org/
- Restart terminal/command prompt

### Problem: `Failed to fetch hotspots`
**Kemungkinan penyebab:**
1. **MAP_KEY salah atau belum diisi**
   - Cek file `.env`
   - Pastikan MAP_KEY sudah benar
   - Jangan ada spasi di awal/akhir

2. **Koneksi internet bermasalah**
   - Cek koneksi internet
   - Coba refresh dengan tombol Refresh di header

3. **NASA API down atau maintenance**
   - Aplikasi akan menggunakan mock data
   - Akan muncul indicator "Mode Offline"

### Problem: `Cannot find module`
**Solusi:**
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules
npm install
```

### Problem: Port 3000 sudah digunakan
**Solusi:**
- Aplikasi akan otomatis menggunakan port lain (misal 3001)
- Atau stop aplikasi yang menggunakan port 3000
- Atau edit `vite.config.js` untuk ganti port:
```javascript
export default defineConfig({
  server: {
    port: 3001, // ganti ke port lain
  }
})
```

## 🔧 Optional: Mapbox Satellite Imagery

Jika Anda ingin menambahkan layer satelit:

1. **Daftar akun Mapbox:**
   - Kunjungi: https://www.mapbox.com/
   - Sign up gratis

2. **Dapatkan Access Token:**
   - Setelah login, pergi ke Account > Tokens
   - Salin "Default public token"

3. **Tambahkan ke `.env`:**
   ```env
   VITE_MAPBOX_TOKEN=pk.eyJ1Ijoixxxxxx
   ```

4. **Restart development server**

## 📱 Build untuk Production

Setelah development selesai, build aplikasi:

```bash
npm run build
```

Hasil build akan ada di folder `dist/`:
```
dist/
├── index.html
├── assets/
│   ├── index-abc123.js
│   └── index-def456.css
└── ...
```

Upload folder `dist/` ke hosting (Netlify, Vercel, GitHub Pages, dll).

## 🆘 Butuh Bantuan?

Jika mengalami masalah:
1. Cek file README.md untuk dokumentasi lengkap
2. Cek browser console (F12) untuk error messages
3. Pastikan semua prerequisites sudah terinstall
4. Coba restart development server

## 📞 Contact & Support

Untuk pertanyaan lebih lanjut:
- Baca dokumentasi lengkap di README.md
- Cek troubleshooting guide di atas
- Review kode di folder `src/`

---

**Selamat menggunakan Indonesia Fire & Air Quality Monitor! 🔥🌏**

