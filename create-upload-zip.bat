@echo off
echo ========================================
echo    CREATE UPLOAD ZIP (EXCLUDE VENV)
echo    Untuk PythonAnywhere (Limit 100MB)
echo ========================================
echo.

echo [1/3] Checking folder...
if not exist "ml-prediction" (
    echo ERROR: Folder ml-prediction tidak ditemukan!
    pause
    exit /b 1
)
echo ✅ Folder found
echo.

echo [2/3] Creating zip without venv...
echo.
echo Excluding:
echo   - venv/ (virtual environment)
echo   - __pycache__/ (Python cache)
echo   - *.pyc (compiled Python)
echo.

cd ml-prediction

:: Create zip excluding venv and cache
powershell -Command "Get-ChildItem -Path . -Exclude venv,__pycache__ | Compress-Archive -DestinationPath ..\ml-prediction-upload.zip -Force"

if %errorlevel% neq 0 (
    echo ERROR: Create zip gagal!
    pause
    exit /b 1
)

cd ..

echo ✅ Zip created: ml-prediction-upload.zip
echo.

echo [3/3] Checking zip size...
powershell -Command "$size = (Get-Item ml-prediction-upload.zip).Length / 1MB; Write-Host 'Size:' ([math]::Round($size, 2)) 'MB'; if ($size -gt 100) { Write-Host '⚠️  WARNING: Zip size > 100MB!' -ForegroundColor Yellow } else { Write-Host '✅ Zip size OK (< 100MB)' -ForegroundColor Green }"
echo.

echo ========================================
echo           SELESAI!
echo ========================================
echo.
echo 📦 File: ml-prediction-upload.zip
echo.
echo 📋 LANGKAH SELANJUTNYA:
echo.
echo 1. Upload ml-prediction-upload.zip ke PythonAnywhere
echo 2. Extract di Bash console:
echo    cd ~
echo    unzip ml-prediction-upload.zip
echo 3. Install dependencies:
echo    cd ml-prediction
echo    pip install --user -r requirements.txt
echo.
pause
