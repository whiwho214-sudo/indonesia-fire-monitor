@echo off
echo ==================================================
echo Starting Prediction API
echo ==================================================
echo.

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo Creating virtual environment...
    python -m venv venv
    echo Installing dependencies...
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
) else (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
)

REM Check if model exists
if exist "data\models\random_forest_1day.pkl" (
    echo Model found! Starting API...
    echo.
    python api\prediction_api.py
) else (
    echo Model not found! Starting training first...
    echo This will take 10-30 minutes...
    echo.
    python train_models.py --full-pipeline --days 365 --model-type rf
    echo.
    echo Training completed! Starting API...
    echo.
    python api\prediction_api.py
)

