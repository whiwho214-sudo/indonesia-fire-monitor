# Script untuk Evaluasi Model Prediksi Hotspot
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " EVALUASI MODEL PREDIKSI HOTSPOT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if virtual environment exists
if (-not (Test-Path "venv\Scripts\python.exe")) {
    Write-Host "ERROR: Virtual environment tidak ditemukan!" -ForegroundColor Red
    Write-Host "Silakan buat virtual environment dulu:" -ForegroundColor Yellow
    Write-Host "  python -m venv venv" -ForegroundColor Yellow
    Write-Host "  venv\Scripts\pip install -r requirements.txt" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Activate virtual environment
Write-Host "Mengaktifkan virtual environment..." -ForegroundColor Green
& "venv\Scripts\Activate.ps1"

Write-Host ""
Write-Host "Menjalankan evaluasi model dengan data 7 hari terakhir..." -ForegroundColor Green
Write-Host ""

# Run evaluation
python evaluate_model.py --days 7

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " EVALUASI SELESAI" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit"

