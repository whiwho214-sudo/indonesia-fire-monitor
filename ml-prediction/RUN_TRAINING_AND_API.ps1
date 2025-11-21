# Script untuk menjalankan training dan API secara berurutan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Prediction API - Auto Start" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Activate virtual environment
if (Test-Path "venv\Scripts\Activate.ps1") {
    & "venv\Scripts\Activate.ps1"
} else {
    Write-Host "❌ Virtual environment tidak ditemukan!" -ForegroundColor Red
    Write-Host "Jalankan: python -m venv venv" -ForegroundColor Yellow
    exit 1
}

# Check if model exists
if (Test-Path "data\models\random_forest_1day.pkl") {
    Write-Host "✅ Model sudah ada!" -ForegroundColor Green
    Write-Host "🚀 Menjalankan API..." -ForegroundColor Green
    Write-Host ""
    Write-Host "API akan berjalan di: http://localhost:8000" -ForegroundColor Cyan
    Write-Host "Tekan Ctrl+C untuk menghentikan" -ForegroundColor Yellow
    Write-Host ""
    & "venv\Scripts\python.exe" api\prediction_api.py
} else {
    Write-Host "⚠️  Model belum ada!" -ForegroundColor Yellow
    Write-Host "📊 Memulai training model..." -ForegroundColor Cyan
    Write-Host "⏳ Ini akan memakan waktu 10-30 menit" -ForegroundColor Yellow
    Write-Host "   (Jangan tutup window ini!)" -ForegroundColor Yellow
    Write-Host ""
    
    # Run training
    & "venv\Scripts\python.exe" train_models.py --full-pipeline --days 365 --model-type rf
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Training selesai!" -ForegroundColor Green
        Write-Host "🚀 Menjalankan API..." -ForegroundColor Green
        Write-Host ""
        Write-Host "API akan berjalan di: http://localhost:8000" -ForegroundColor Cyan
        Write-Host "Tekan Ctrl+C untuk menghentikan" -ForegroundColor Yellow
        Write-Host ""
        & "venv\Scripts\python.exe" api\prediction_api.py
    } else {
        Write-Host ""
        Write-Host "❌ Training gagal!" -ForegroundColor Red
        Write-Host "Cek error message di atas untuk detail" -ForegroundColor Yellow
        pause
    }
}

