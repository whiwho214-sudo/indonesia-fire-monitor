@echo off
echo ========================================
echo    SETUP HOSTING LENGKAP - OTOMATIS
echo    Vercel + Render (Semua API Jalan)
echo ========================================
echo.

echo [INFO] Panduan setup hosting lengkap
echo.
echo ========================================
echo           LANGKAH SETUP
echo ========================================
echo.
echo PART 1: DEPLOY API KE RENDER (5 menit)
echo ----------------------------------------
echo 1. Buka: https://render.com/
echo 2. Sign Up dengan GitHub (gratis, no card)
echo 3. New + ^> Web Service
echo 4. Connect GitHub: indonesia-fire-monitor
echo 5. Configure:
echo    - Name: indonesia-fire-monitor-api
echo    - Root Directory: ml-prediction
echo    - Build Command: pip install -r requirements.txt
echo    - Start Command: uvicorn api.prediction_api:app --host 0.0.0.0 --port $PORT
echo    - Plan: Free
echo 6. Deploy ^> Tunggu 5-10 menit
echo 7. Copy URL Render (contoh: https://xxx.onrender.com)
echo.
echo PART 2: SETUP VERCEL (2 menit)
echo ----------------------------------------
echo 1. Buka: https://vercel.com/
echo 2. Pilih project: indonesia-fire-monitor
echo 3. Settings ^> Environment Variables
echo 4. Add:
echo    - Name: VITE_PREDICTION_API_URL
echo    - Value: [URL Render dari Part 1]
echo    - Environment: All
echo 5. Save ^> Redeploy
echo.
echo PART 3: TEST (2 menit)
echo ----------------------------------------
echo 1. Buka website Vercel
echo 2. Test semua fitur:
echo    - Hotspot Layer
echo    - Prediction Layer
echo    - AQI Layer
echo    - Weather Layer
echo 3. Check browser console (F12) untuk error
echo.
echo ========================================
echo           CHECKLIST
echo ========================================
echo.
echo Render (API):
echo [ ] Account created
echo [ ] Web Service created
echo [ ] Root Directory = ml-prediction
echo [ ] Deploy successful
echo [ ] URL Render di-copy
echo.
echo Vercel (Website):
echo [ ] Environment variable VITE_PREDICTION_API_URL di-set
echo [ ] Website redeployed
echo [ ] Test semua fitur berhasil
echo.
echo ========================================
echo           PANDUAN LENGKAP
echo ========================================
echo.
echo Baca file: SETUP_HOSTING_LENGKAP.md
echo.
echo ========================================
echo.
pause
