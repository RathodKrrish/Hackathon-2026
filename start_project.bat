@echo off
title SOLAR PULSE AI - MASTER LAUNCHER
color 0E

echo =====================================================================
echo                 SOLAR PULSE AI (HELIOS-GRID)
echo     Autonomous Renewable Forecasting & Grid Optimization Platform
echo =====================================================================
echo.

echo [1/3] Checking data folder...
if not exist "%~dp0data" mkdir "%~dp0data"
echo [OK] Data folder ready.

echo.
echo [2/3] Starting Python FastAPI Backend Server on port 8000...
start cmd /k "cd /d ""%~dp0backend"" && py -3.12 -m uvicorn main:app --reload --port 8000"

echo.
echo [3/3] Starting React Vite Frontend Web App on port 3000...
start cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo =====================================================================
echo All systems launching!
echo Backend API Docs: http://localhost:8000/docs
echo Frontend Web App: http://localhost:3000
echo =====================================================================
pause
