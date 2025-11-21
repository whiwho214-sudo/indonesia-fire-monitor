# PowerShell script untuk menjalankan Prediction API
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  JALANKAN PREDICTION API" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Change to script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$scriptPath\ml-prediction"

# Check virtual environment
Write-Host "Memeriksa virtual environment..." -ForegroundColor Yellow
if (-not (Test-Path "venv\Scripts\python.exe")) {
    Write-Host "ERROR: Virtual environment tidak ditemukan!" -ForegroundColor Red
    Write-Host "Jalankan dulu: python -m venv venv" -ForegroundColor Red
    Read-Host "Tekan Enter untuk keluar"
    exit 1
}

# Check model
Write-Host "Memeriksa model..." -ForegroundColor Yellow
if (-not (Test-Path "data\models\random_forest_1day.pkl")) {
    Write-Host "WARNING: Model belum ditemukan!" -ForegroundColor Yellow
    Write-Host "Anda perlu menjalankan training terlebih dahulu." -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Lanjutkan? (Y/N)"
    if ($continue -ne "Y" -and $continue -ne "y") {
        exit 1
    }
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host "Memulai API Server..." -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
Write-Host "API akan berjalan di: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "JANGAN TUTUP WINDOW INI!" -ForegroundColor Yellow
Write-Host "Biarkan tetap terbuka saat menggunakan aplikasi." -ForegroundColor Yellow
Write-Host ""
Write-Host "Tekan Ctrl+C untuk menghentikan API" -ForegroundColor Gray
Write-Host ""

# Activate virtual environment
& "venv\Scripts\Activate.ps1"

# Run API
Write-Host "Menjalankan API..." -ForegroundColor Green
Write-Host ""
& "venv\Scripts\python.exe" api\prediction_api.py

Read-Host "`nTekan Enter untuk keluar"

