# 🚀 Langkah-Langkah Deploy ke Vercel (Super Detail)

## 📋 PERSIAPAN (5 Menit)

### Step 1: Pastikan Code di GitHub
```bash
# Cek apakah sudah ada Git
git status
```

**Jika belum ada Git:**
```bash
git init
git add .
git commit -m "Initial commit"
```

**Jika sudah ada Git tapi belum push:**
```bash
git add .
git commit -m "Ready for Vercel"
git push
```

**Jika belum ada remote GitHub:**
1. Buat repository baru di GitHub.com
2. Copy URL repository (contoh: `https://github.com/username/indonesia-fire-monitor.git`)
3. Jalankan:
```bash
git remote add origin https://github.com/username/indonesia-fire-monitor.git
git branch -M main
git push -u origin main
```

---

## 🌐 DEPLOY KE VERCEL (10 Menit)

### Step 2: Daftar/Login Vercel
1. **Buka browser** → https://vercel.com/
2. **Klik "Continue with GitHub"**
3. **Login dengan akun GitHub** Anda
4. **Authorize Vercel** untuk akses repository

### Step 3: Import Project
1. **Di dashboard Vercel**, klik **"New Project"**
2. **Cari repository** `indonesia-fire-monitor`
3. **Klik "Import"** di sebelah repository tersebut

### Step 4: Konfigurasi Project
**Vercel akan otomatis detect settings, pastikan:**

- **Framework Preset**: `Vite` (otomatis terdeteksi)
- **Root Directory**: `.` (biarkan default)
- **Build Command**: `npm run build` (otomatis)
- **Output Directory**: `dist` (otomatis)
- **Install Command**: `npm install` (otomatis)

### Step 5: Deploy!
1. **Klik "Deploy"** (tombol biru besar)
2. **Tunggu 2-5 menit** (Vercel akan build project)
3. **Lihat progress** di layar (Installing → Building → Deploying)
4. **SELESAI!** 🎉

---

## 🎯 HASIL DEPLOY

### Setelah Deploy Sukses:
- ✅ **Website live** di: `https://indonesia-fire-monitor.vercel.app`
- ✅ **SSL certificate** otomatis aktif
- ✅ **CDN global** untuk loading cepat
- ✅ **Auto-deploy** setiap push ke GitHub

### URL yang Anda Dapatkan:
```
https://indonesia-fire-monitor-[random].vercel.app
```
atau
```
https://indonesia-fire-monitor.vercel.app
```

---

## 🔧 SETUP API (Opsional - 15 Menit)

### Jika Butuh API Machine Learning:

#### Option A: Railway (Recommended)
1. **Daftar Railway**: https://railway.app/
2. **Login dengan GitHub**
3. **New Project** → **Deploy from GitHub**
4. **Pilih repository** yang sama
5. **Set Root Directory**: `ml-prediction`
6. **Deploy** → Tunggu 10 menit
7. **Copy URL Railway**

#### Option B: Render
1. **Daftar Render**: https://render.com/
2. **New Web Service**
3. **Connect GitHub repository**
4. **Root Directory**: `ml-prediction`
5. **Build Command**: `pip install -r requirements.txt`
6. **Start Command**: `uvicorn api.prediction_api:app --host 0.0.0.0 --port $PORT`

### Update API URL di Project:
1. **Edit file**: `src/services/api.js`
2. **Ganti URL**:
```javascript
const API_BASE_URL = 'https://your-railway-url.railway.app';
```
3. **Push ke GitHub** → Vercel auto-deploy!

---

## 🛠️ TROUBLESHOOTING

### Problem 1: Build Failed
**Error**: `npm install failed`
**Solusi**:
```bash
# Hapus node_modules dan package-lock.json
rm -rf node_modules package-lock.json
npm install
git add .
git commit -m "Fix dependencies"
git push
```

### Problem 2: Repository Not Found
**Error**: Can't find repository
**Solusi**:
1. Pastikan repository **public** di GitHub
2. Atau authorize Vercel untuk private repos

### Problem 3: Wrong Build Command
**Error**: Build command not found
**Solusi**:
1. **Project Settings** di Vercel
2. **Build & Output Settings**
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

### Problem 4: Environment Variables
**Untuk API URL**:
1. **Project Settings** → **Environment Variables**
2. **Add**: `VITE_API_URL` = `https://your-api-url.com`
3. **Redeploy**

---

## 🔄 WORKFLOW SETELAH SETUP

### Setiap Kali Update Code:
1. **Edit code** di local
2. **Git push**:
```bash
git add .
git commit -m "Update fitur xyz"
git push
```
3. **Vercel auto-deploy** dalam 2 menit
4. **Website updated** otomatis!

### No More Manual Upload! 🎉

---

## 📊 MONITORING & ANALYTICS

### Vercel Dashboard:
- **Deployments**: Lihat history deploy
- **Functions**: Monitor API calls (jika ada)
- **Analytics**: Traffic website
- **Domains**: Custom domain management

### Performance:
- **Lighthouse Score**: Otomatis optimized
- **Global CDN**: Loading cepat worldwide
- **Edge Functions**: Server-side rendering

---

## 🎯 CHECKLIST SUKSES

### Pre-Deploy:
- [ ] Code di GitHub repository
- [ ] `npm run build` berhasil local
- [ ] No error di console

### Deploy Process:
- [ ] Vercel account created
- [ ] Repository imported
- [ ] Build settings correct
- [ ] Deploy successful

### Post-Deploy:
- [ ] Website accessible
- [ ] All pages working
- [ ] API connected (jika ada)
- [ ] No console errors

### Optional:
- [ ] Custom domain setup
- [ ] Analytics enabled
- [ ] Environment variables set

---

## 🚀 SCRIPT OTOMATIS

### Gunakan Script yang Sudah Dibuat:
```bash
# Jalankan file ini:
deploy-vercel-otomatis.bat
```

**Script akan:**
1. ✅ Check Git status
2. ✅ Push ke GitHub
3. ✅ Install Vercel CLI
4. ✅ Deploy ke Vercel
5. ✅ Show hasil URL

---

## 💡 TIPS PRO

### 1. Custom Domain (Gratis!)
- **Vercel Settings** → **Domains**
- **Add domain** yang Anda punya
- **Update DNS** sesuai instruksi

### 2. Preview Deployments
- Setiap **pull request** dapat preview URL
- Test fitur baru sebelum merge

### 3. Rollback
- **Deployments** → **Promote to Production**
- Rollback ke versi sebelumnya instant

### 4. Team Collaboration
- Invite team members
- Shared dashboard dan analytics

---

## 🎉 SELESAI!

**Total waktu**: 15 menit  
**Maintenance**: 0 menit (otomatis)  
**Cost**: $0 (gratis selamanya)

**Website Anda sekarang:**
- ✅ Live di internet
- ✅ SSL certificate
- ✅ Global CDN
- ✅ Auto-deploy
- ✅ Professional URL

**Next time**: Cuma `git push` dan website update otomatis! 🚀
