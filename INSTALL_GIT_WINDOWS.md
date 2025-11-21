# 🔧 Install Git di Windows

## ❌ Error: Git Not Recognized

Error ini muncul karena Git belum terinstall di Windows Anda.

## 🚀 Cara Install Git (5 Menit)

### Method 1: Download Manual (Recommended)

#### Step 1: Download Git
1. **Buka browser** → https://git-scm.com/download/win
2. **Download otomatis** akan mulai (Git-2.x.x-64-bit.exe)
3. **Tunggu download selesai**

#### Step 2: Install Git
1. **Double-click** file yang didownload
2. **Next** → **Next** → **Next** (biarkan semua default)
3. **Important**: Pastikan centang **"Git from the command line and also from 3rd-party software"**
4. **Install** → Tunggu proses selesai
5. **Finish**

#### Step 3: Restart Terminal
1. **Tutup** PowerShell/Command Prompt yang terbuka
2. **Buka lagi** terminal di folder project
3. **Test**: `git --version`

### Method 2: Winget (Windows 11/10)

```powershell
# Jalankan di PowerShell sebagai Administrator
winget install --id Git.Git -e --source winget
```

### Method 3: Chocolatey (Jika sudah ada)

```powershell
# Jalankan di PowerShell sebagai Administrator  
choco install git
```

## ✅ Verifikasi Install Berhasil

**Buka terminal baru dan test:**
```bash
git --version
```

**Harus muncul output seperti:**
```
git version 2.42.0.windows.1
```

## 🔧 Setup Git (First Time)

**Setelah Git terinstall, setup nama dan email:**
```bash
git config --global user.name "Nama Anda"
git config --global user.email "email@anda.com"
```

**Contoh:**
```bash
git config --global user.name "John Doe"
git config --global user.email "john@gmail.com"
```

## 🎯 Lanjut ke Git Commands

**Setelah Git terinstall, jalankan di folder project:**

```bash
# 1. Initialize Git repository
git init

# 2. Add semua file
git add .

# 3. Commit pertama
git commit -m "Initial commit"

# 4. Cek status
git status
```

## 🚨 Troubleshooting

### Problem 1: "git still not recognized"
**Solusi:**
1. **Restart komputer** (kadang perlu)
2. **Check PATH environment variable**
3. **Reinstall Git** dengan opsi "Add to PATH"

### Problem 2: Permission denied
**Solusi:**
1. **Run PowerShell as Administrator**
2. Atau gunakan **Git Bash** (terinstall bersama Git)

### Problem 3: Antivirus blocking
**Solusi:**
1. **Temporarily disable antivirus**
2. **Add Git to antivirus whitelist**

## 🎯 Alternative: Git Bash

**Jika PowerShell masih bermasalah:**
1. **Cari "Git Bash"** di Start Menu
2. **Navigate ke folder project:**
```bash
cd /c/Users/Admin/Documents/indonesia-fire-monitor
```
3. **Jalankan git commands** di Git Bash

## 📋 Checklist Install

- [ ] Git downloaded dari git-scm.com
- [ ] Git installed dengan default settings
- [ ] Terminal restarted
- [ ] `git --version` berhasil
- [ ] User name dan email configured
- [ ] Ready untuk git commands

---

**Setelah Git terinstall → Lanjut setup repository untuk Vercel!** 🚀
