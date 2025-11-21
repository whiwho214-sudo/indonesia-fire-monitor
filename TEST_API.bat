@echo off
echo Testing API Connection...
echo.

echo Testing http://localhost:8000...
curl http://localhost:8000

echo.
echo.
echo Testing http://127.0.0.1:8000...
curl http://127.0.0.1:8000

echo.
echo.
echo If both fail, API might not be running or firewall is blocking.
pause

