@echo off
echo ========================================
echo  EVALUASI MODEL PREDIKSI HOTSPOT
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv\Scripts\python.exe" (
    echo ERROR: Virtual environment tidak ditemukan!
    echo Silakan buat virtual environment dulu:
    echo   python -m venv venv
    echo   venv\Scripts\pip install -r requirements.txt
    pause
    exit /b 1
)

REM Activate virtual environment and run evaluation
echo Mengaktifkan virtual environment...
call venv\Scripts\activate.bat

echo.
echo Menjalankan evaluasi model dengan data 7 hari terakhir...
echo.

python evaluate_model.py --days 7

echo.
echo ========================================
echo  EVALUASI SELESAI
echo ========================================
echo.
pause

