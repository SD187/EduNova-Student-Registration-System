from pymongo import MongoClient

try:
    print("Testing MongoDB connection...")
    
    # Connect to your running MongoDB
    client = MongoClient('mongodb://localhost:27017/')
    
    # Test connection
    client.admin.command('ping')
    print("✅ MongoDB connection successful!")
    
    # Get server info
    server_info = client.server_info()
    print(f"✅ MongoDB version: {server_info['version']}")
    
    # Test your procr database
    db = client['procr_database']
    print(f"✅ Connected to database: {db.name}")
    
    print("🎉 Your MongoDB is ready for Flask development!")
    
except Exception as e:
    print(f"❌ Connection failed: {e}")
    print("Make sure MongoDB service is running and try again.")