@echo off
echo Starting EduNova Feedback System Test...
echo.

echo 1. Starting Python backend server...
cd admin-backend
start "EduNova Backend" python app.py

echo.
echo 2. Waiting for server to start...
timeout /t 5 /nobreak > nul

echo.
echo 3. Running feedback system tests...
python test_feedback.py

echo.
echo 4. Opening browser to test interfaces...
echo.
echo Opening public feedback form...
start http://127.0.0.1:5000/contact

echo.
echo Opening admin feedback management...
start http://127.0.0.1:5000/admin/mfeedback.html

echo.
echo ========================================
echo Feedback System Test Complete!
echo.
echo Public Interface: http://127.0.0.1:5000/contact
echo Admin Interface: http://127.0.0.1:5000/admin/mfeedback.html
echo Admin Login: admin / admin123
echo.
echo Press any key to exit...
pause > nul
