@echo off
title HelpDesk App Launcher
echo ========================================================
echo        Starting HelpDesk IT Support System...
echo ========================================================
echo.

echo [1/2] Starting Python FastAPI Backend on Port 8000...
start "HelpDesk Backend (FastAPI)" cmd /k "cd /d "%~dp0backend" && venv\Scripts\activate && uvicorn main:app --reload --port 8000"

timeout /t 2 /nobreak >nul

echo [2/2] Starting React Frontend on Port 5173...
start "HelpDesk Frontend (React)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

timeout /t 3 /nobreak >nul

echo Opening HelpDesk in your browser...
start http://localhost:5173

echo.
echo ========================================================
echo   HelpDesk is running! Keep the two black windows open.
echo   To stop the app later, simply close both windows.
echo ========================================================
