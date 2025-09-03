#!/usr/bin/env python3
"""
EduNova Admin Backend Startup Script
This script initializes the database and starts the Flask server
"""

import os
import sys
import subprocess
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 7):
        print("❌ Python 3.7 or higher is required")
        print(f"   Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True

def install_dependencies():
    """Install required dependencies"""
    print("📦 Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def check_mongodb():
    """Check if MongoDB is accessible"""
    print("🔍 Checking MongoDB connection...")
    try:
        from pymongo import MongoClient
        from config import Config
        
        client = MongoClient(Config.MONGODB_URI, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print("✅ MongoDB connection successful")
        client.close()
        return True
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        print("   Please ensure MongoDB is running and accessible")
        return False

def initialize_database():
    """Initialize the database"""
    print("🔧 Initializing database...")
    try:
        subprocess.check_call([sys.executable, "init_db.py"])
        print("✅ Database initialized successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Database initialization failed: {e}")
        return False

def start_server():
    """Start the Flask server"""
    print("🚀 Starting Flask server...")
    try:
        subprocess.check_call([sys.executable, "app.py"])
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to start server: {e}")

def main():
    """Main startup function"""
    print("🎓 EduNova Admin Backend Startup")
    print("=" * 40)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Check MongoDB
    if not check_mongodb():
        print("\n💡 To install MongoDB:")
        print("   - Windows: Download from https://www.mongodb.com/try/download/community")
        print("   - macOS: brew install mongodb-community")
        print("   - Linux: sudo apt-get install mongodb")
        print("\n   Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas")
        sys.exit(1)
    
    # Initialize database
    if not initialize_database():
        sys.exit(1)
    
    print("\n" + "=" * 40)
    print("🎉 Setup completed successfully!")
    print("🌐 The application will be available at: http://127.0.0.1:5000")
    print("📚 Default admin credentials:")
    print("   Username: admin")
    print("   Password: admin123")
    print("\nPress Ctrl+C to stop the server")
    print("=" * 40)
    
    # Start server
    start_server()

if __name__ == "__main__":
    main()
