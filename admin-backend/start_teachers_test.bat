@echo off
echo Starting EduNova Admin Backend...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if requirements are installed
echo Checking requirements...
pip install -r requirements.txt

REM Initialize database
echo.
echo Initializing database...
python init_db.py

REM Start the Flask server
echo.
echo Starting Flask server...
echo Server will be available at: http://127.0.0.1:5000
echo Press Ctrl+C to stop the server
echo.
python app.py

pause
