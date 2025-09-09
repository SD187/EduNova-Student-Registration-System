#!/bin/bash

echo "Starting EduNova Feedback System Test..."
echo

echo "1. Starting Python backend server..."
cd admin-backend
python app.py &
BACKEND_PID=$!

echo
echo "2. Waiting for server to start..."
sleep 5

echo
echo "3. Running feedback system tests..."
python test_feedback.py

echo
echo "4. Opening browser to test interfaces..."
echo
echo "Opening public feedback form..."
if command -v xdg-open > /dev/null; then
    xdg-open http://127.0.0.1:5000/contact
elif command -v open > /dev/null; then
    open http://127.0.0.1:5000/contact
fi

echo
echo "Opening admin feedback management..."
if command -v xdg-open > /dev/null; then
    xdg-open http://127.0.0.1:5000/admin/mfeedback.html
elif command -v open > /dev/null; then
    open http://127.0.0.1:5000/admin/mfeedback.html
fi

echo
echo "========================================"
echo "Feedback System Test Complete!"
echo
echo "Public Interface: http://127.0.0.1:5000/contact"
echo "Admin Interface: http://127.0.0.1:5000/admin/mfeedback.html"
echo "Admin Login: admin / admin123"
echo
echo "Backend server is running in background (PID: $BACKEND_PID)"
echo "To stop the server, run: kill $BACKEND_PID"
echo
echo "Press Enter to exit..."
read
