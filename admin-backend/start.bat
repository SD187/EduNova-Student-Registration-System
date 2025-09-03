@echo off
echo ========================================
echo    EduNova Admin Backend Startup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.7+ from https://www.python.org/
    pause
    exit /b 1
)

echo Python found. Starting EduNova Admin Backend...
echo.

REM Run the startup script
python start.py

pause


