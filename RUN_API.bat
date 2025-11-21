@echo off
title Prediction API Server
color 0A

echo.
echo ================================================
echo   PREDICTION API SERVER
echo ================================================
echo.
echo Pastikan API berjalan sebelum menggunakan fitur prediksi!
echo.

cd /d "%~dp0ml-prediction"

echo [1/3] Memeriksa virtual environment...
if not exist "venv\Scripts\python.exe" (
    echo ERROR: Virtual environment tidak ditemukan!
    echo Silakan jalankan training terlebih dahulu.
    pause
    exit /b 1
)
echo       OK - Virtual environment ditemukan
echo.

echo [2/3] Memeriksa model...
if not exist "data\models\random_forest_1day.pkl" (
    echo WARNING: Model belum ditemukan!
    echo API mungkin tidak bisa membuat prediksi.
    echo.
    pause
)
echo       OK - Model ditemukan
echo.

echo [3/3] Memulai API Server...
echo.
echo ================================================
echo   API AKAN BERJALAN DI:
echo   http://localhost:8000
echo ================================================
echo.
echo INSTRUKSI:
echo 1. Biarkan window ini TERBUKA
echo 2. Buka aplikasi React di browser
echo 3. Klik checkbox "Prediksi (1 Hari)"
echo.
echo Tekan Ctrl+C untuk menghentikan API
echo ================================================
echo.
pause

echo.
echo Menjalankan API...
echo.
REM Set PYTHONPATH to current directory (ml-prediction) so src module can be found
set PYTHONPATH=%CD%
call venv\Scripts\python.exe api\prediction_api.py

echo.
echo API dihentikan.
pause

