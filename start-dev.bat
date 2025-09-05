@echo off
echo Starting EduNova Academy Application in Development Mode...
echo.
echo Make sure MongoDB is running on your system!
echo.
cd backend
echo Installing dependencies...
npm install
echo.
echo Starting the server in development mode...
npm run dev
pause
