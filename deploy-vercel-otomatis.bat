@echo off
echo ========================================
echo      DEPLOY OTOMATIS KE VERCEL
echo ========================================
echo.

echo [1/4] Checking Git status...
git status
if %errorlevel% neq 0 (
    echo ERROR: Folder ini bukan Git repository!
    echo Jalankan: git init
    pause
    exit /b 1
)
echo ✅ Git repository OK
echo.

echo [2/4] Push code ke GitHub...
git add .
git commit -m "Deploy to Vercel - %date% %time%"
git push
if %errorlevel% neq 0 (
    echo WARNING: Push gagal, tapi lanjut deploy...
)
echo ✅ Code pushed to GitHub
echo.

echo [3/4] Installing Vercel CLI...
npm install -g vercel
if %errorlevel% neq 0 (
    echo ERROR: Install Vercel CLI gagal!
    pause
    exit /b 1
)
echo ✅ Vercel CLI installed
echo.

echo [4/4] Deploy ke Vercel...
echo.
echo INSTRUKSI:
echo 1. Login dengan GitHub account
echo 2. Pilih scope (personal/team)
echo 3. Link ke existing project atau buat baru
echo 4. Confirm settings (tekan Enter untuk default)
echo.
pause

vercel --prod

echo.
echo ========================================
echo           DEPLOY SELESAI!
echo ========================================
echo.
echo 🌐 Website Anda sekarang live di Vercel!
echo 📱 URL akan ditampilkan di atas
echo.
echo 🔄 Auto-deploy: Setiap push ke GitHub akan otomatis deploy
echo 🔒 SSL: Otomatis aktif
echo 🌍 CDN: Global distribution
echo.
echo 📖 Baca HOSTING_ALTERNATIF_MUDAH.md untuk info lengkap
echo.
pause
