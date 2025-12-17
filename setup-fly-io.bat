@echo off
echo ========================================
echo    SETUP FLY.IO (GRATIS, NO CARD!)
echo ========================================
echo.

echo [1/4] Checking Fly CLI...
where fly >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Fly CLI...
    powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
    if %errorlevel% neq 0 (
        echo ERROR: Install Fly CLI gagal!
        echo.
        echo Install manual:
        echo 1. Buka: https://fly.io/docs/getting-started/installing-flyctl/
        echo 2. Download installer untuk Windows
        pause
        exit /b 1
    )
)
echo ✅ Fly CLI installed
echo.

echo [2/4] Login to Fly.io...
echo.
echo INSTRUKSI:
echo 1. Browser akan terbuka untuk login
echo 2. Login dengan GitHub account
echo 3. Authorize Fly.io
echo.
pause
fly auth login
if %errorlevel% neq 0 (
    echo ERROR: Login gagal!
    pause
    exit /b 1
)
echo ✅ Logged in
echo.

echo [3/4] Deploy API to Fly.io...
cd ml-prediction
if not exist "api\prediction_api.py" (
    echo ERROR: Folder ml-prediction tidak ditemukan!
    pause
    exit /b 1
)

echo.
echo INSTRUKSI:
echo 1. App name: indonesia-fire-monitor-api
echo 2. Region: Pilih terdekat (Singapore/Tokyo)
echo 3. PostgreSQL: No
echo 4. Redis: No
echo.
pause

fly launch
if %errorlevel% neq 0 (
    echo ERROR: Deploy gagal!
    pause
    exit /b 1
)

echo.
echo [4/4] Getting URL...
fly info
echo.

cd ..
echo ========================================
echo           SELESAI!
echo ========================================
echo.
echo ✅ API deployed to Fly.io!
echo.
echo 📋 LANGKAH SELANJUTNYA:
echo.
echo 1. Copy URL Fly.io (dari output di atas)
echo 2. Buka Vercel Dashboard
echo 3. Settings ^> Environment Variables
echo 4. Update: VITE_PREDICTION_API_URL = URL Fly.io
echo 5. Redeploy website
echo.
echo 🧪 Test API:
echo    https://your-app.fly.dev/docs
echo.
pause
