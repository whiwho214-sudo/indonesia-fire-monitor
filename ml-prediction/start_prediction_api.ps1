# PowerShell script untuk menjalankan Prediction API
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Starting Prediction API" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if virtual environment exists
if (-not (Test-Path "venv\Scripts\Activate.ps1")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    & "venv\Scripts\python.exe" -m pip install -r requirements.txt
}

# Activate virtual environment
& "venv\Scripts\Activate.ps1"

# Check if model exists
if (Test-Path "data\models\random_forest_1day.pkl") {
    Write-Host "✅ Model found! Starting API..." -ForegroundColor Green
    Write-Host ""
    & "venv\Scripts\python.exe" api\prediction_api.py
} else {
    Write-Host "⚠️  Model not found! Starting training first..." -ForegroundColor Yellow
    Write-Host "This will take 10-30 minutes..." -ForegroundColor Yellow
    Write-Host ""
    & "venv\Scripts\python.exe" train_models.py --full-pipeline --days 365 --model-type rf
    Write-Host ""
    Write-Host "✅ Training completed! Starting API..." -ForegroundColor Green
    Write-Host ""
    & "venv\Scripts\python.exe" api\prediction_api.py
}

