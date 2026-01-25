@echo off
echo ========================================
echo   MERN Expense Tracker - Quick Start
echo ========================================
echo.

echo [1/3] Checking MongoDB...
echo Make sure MongoDB is running on mongodb://localhost:27017
echo.

echo [2/3] Starting Backend Server...
start cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

echo [3/3] Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause >nul
