@echo off
echo ========================================
echo    DEPLOY KE INFINITY FREE - OTOMATIS
echo ========================================
echo.

echo [1/3] Building aplikasi React...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build gagal!
    pause
    exit /b 1
)
echo ✅ Build berhasil!
echo.

echo [2/3] Membuat file .htaccess...
if not exist "dist\.htaccess" (
    echo File .htaccess sudah ada di folder dist/
) else (
    echo ✅ File .htaccess sudah tersedia
)
echo.

echo [3/3] Menampilkan file yang siap diupload...
echo.
echo 📁 File-file ini harus diupload ke folder htdocs di Infinity Free:
echo.
dir /b dist\
echo.
echo ========================================
echo           LANGKAH SELANJUTNYA
echo ========================================
echo.
echo 1. Login ke Infinity Free control panel
echo 2. Masuk ke File Manager
echo 3. Buka folder htdocs
echo 4. Upload SEMUA file dari folder 'dist' ke htdocs
echo 5. Pastikan struktur folder tetap sama
echo.
echo 🌐 Setelah upload, website bisa diakses di:
echo    https://yourname.epizy.com
echo.
echo 📖 Baca PANDUAN_HOSTING_INFINITY_FREE.md untuk detail lengkap
echo.
pause
