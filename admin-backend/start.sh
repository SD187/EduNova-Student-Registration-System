#!/bin/bash

echo "========================================"
echo "   EduNova Admin Backend Startup"
echo "========================================"
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed or not in PATH"
    echo "Please install Python 3.7+ from https://www.python.org/"
    exit 1
fi

echo "Python found. Starting EduNova Admin Backend..."
echo

# Make the script executable
chmod +x start.py

# Run the startup script
python3 start.py


