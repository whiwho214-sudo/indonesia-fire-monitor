@echo off
echo ========================================
echo     UPDATE URL API RAILWAY
echo ========================================
echo.

set /p railway_url="Masukkan URL Railway Anda (tanpa https://): "

if "%railway_url%"=="" (
    echo ERROR: URL tidak boleh kosong!
    pause
    exit /b 1
)

echo.
echo Updating API URL ke: https://%railway_url%
echo.

:: Backup original file
copy "src\services\api.js" "src\services\api.js.backup" >nul 2>&1

:: Update API URL (simplified approach)
echo const API_BASE_URL = 'https://%railway_url%'; > temp_api.js
echo. >> temp_api.js
echo export const apiService = { >> temp_api.js
echo   async getPrediction(data) { >> temp_api.js
echo     const response = await fetch(`${API_BASE_URL}/predict`, { >> temp_api.js
echo       method: 'POST', >> temp_api.js
echo       headers: { >> temp_api.js
echo         'Content-Type': 'application/json', >> temp_api.js
echo       }, >> temp_api.js
echo       body: JSON.stringify(data) >> temp_api.js
echo     }); >> temp_api.js
echo     return response.json(); >> temp_api.js
echo   }, >> temp_api.js
echo. >> temp_api.js
echo   async getHotspots() { >> temp_api.js
echo     const response = await fetch(`${API_BASE_URL}/hotspots`); >> temp_api.js
echo     return response.json(); >> temp_api.js
echo   } >> temp_api.js
echo }; >> temp_api.js

move temp_api.js "src\services\api.js" >nul

echo ✅ API URL berhasil diupdate!
echo.
echo [1/2] Building website dengan URL baru...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build gagal!
    echo Restoring backup...
    copy "src\services\api.js.backup" "src\services\api.js" >nul
    pause
    exit /b 1
)

echo ✅ Build berhasil!
echo.
echo [2/2] File siap untuk upload ulang ke Infinity Free
echo.
echo ========================================
echo           LANGKAH SELANJUTNYA  
echo ========================================
echo.
echo 1. Upload ulang folder 'dist' ke Infinity Free
echo 2. Test website: https://namaanda.epizy.com
echo 3. Test API: https://%railway_url%/docs
echo.
echo 🔍 Untuk test API langsung:
echo    https://%railway_url%/health
echo.
pause
