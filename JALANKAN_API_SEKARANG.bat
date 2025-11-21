@echo off
echo ==================================================
echo   JALANKAN PREDICTION API
echo ==================================================
echo.

cd /d "%~dp0ml-prediction"

echo Memeriksa virtual environment...
if not exist "venv\Scripts\python.exe" (
    echo ERROR: Virtual environment tidak ditemukan!
    echo Jalankan dulu: python -m venv venv
    pause
    exit /b 1
)

echo Memeriksa model...
if not exist "data\models\random_forest_1day.pkl" (
    echo WARNING: Model belum ditemukan!
    echo Anda perlu menjalankan training terlebih dahulu.
    echo.
    echo Tekan Y untuk melanjutkan (API mungkin error)
    echo Tekan N untuk keluar dan jalankan training dulu
    choice /C YN /M "Lanjutkan?"
    if errorlevel 2 exit /b 1
)

echo.
echo ==================================================
echo Memulai API Server...
echo ==================================================
echo.
echo API akan berjalan di: http://localhost:8000
echo.
echo JANGAN TUTUP WINDOW INI!
echo Biarkan tetap terbuka saat menggunakan aplikasi.
echo.
echo Tekan Ctrl+C untuk menghentikan API
echo.
pause

echo.
echo Menjalankan API...
echo.

call venv\Scripts\activate.bat
python api\prediction_api.py

pause

