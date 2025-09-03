from pymongo import MongoClient, ASCENDING, DESCENDING
from datetime import datetime
from werkzeug.security import generate_password_hash
from config import Config

def init_database():
    """Initialize the database with collections and indexes"""
    
    # Connect to MongoDB
    client = MongoClient(Config.MONGODB_URI)
    db = client[Config.DATABASE_NAME]
    
    # Collections
    admins_collection = db.admins
    students_collection = db.students
    courses_collection = db.courses
    course_resources_collection = db.course_resources
    timetable_collection = db.timetable_entries
    app_settings_collection = db.app_settings
    teachers_collection = db.teachers
    
    print("🔧 Initializing EduNova Database...")
    
    # Create indexes for better performance
    try:
        # Admin indexes
        admins_collection.create_index([("username", ASCENDING)], unique=True)
        admins_collection.create_index([("email", ASCENDING)], unique=True)
        admins_collection.create_index([("created_at", DESCENDING)])
        
        # Student indexes
        students_collection.create_index([("email", ASCENDING)], unique=True)
        students_collection.create_index([("student_id", ASCENDING)], unique=True)
        students_collection.create_index([("created_at", DESCENDING)])
        students_collection.create_index([("status", ASCENDING)])
        students_collection.create_index([("course", ASCENDING)])
        
        # Course indexes
        courses_collection.create_index([("code", ASCENDING)], unique=True)
        courses_collection.create_index([("name", ASCENDING)])
        courses_collection.create_index([("status", ASCENDING)])
        courses_collection.create_index([("created_at", DESCENDING)])
        
        # Course resources indexes
        course_resources_collection.create_index([("subject", ASCENDING), ("grade", ASCENDING)], unique=True)
        course_resources_collection.create_index([("updated_at", DESCENDING)])
        
        # Timetable indexes
        timetable_collection.create_index([("date", ASCENDING)])
        timetable_collection.create_index([("subject", ASCENDING)])
        timetable_collection.create_index([("grade", ASCENDING)])
        timetable_collection.create_index([("start_time", ASCENDING)])
        
        # App settings indexes
        app_settings_collection.create_index([("updated_at", DESCENDING)])
        
        # Teacher indexes
        teachers_collection.create_index([("email", ASCENDING)], unique=True)
        teachers_collection.create_index([("name", ASCENDING)])
        teachers_collection.create_index([("subject", ASCENDING)])
        teachers_collection.create_index([("status", ASCENDING)])
        teachers_collection.create_index([("created_at", DESCENDING)])
        
        print("✅ Database indexes created successfully")
        
    except Exception as e:
        print(f"⚠️ Warning: Some indexes may already exist: {str(e)}")
    
    # Create default admin if no admin exists
    if admins_collection.count_documents({}) == 0:
        default_admin = {
            'username': 'admin',
            'email': 'admin@edunova.com',
            'password': generate_password_hash('admin123'),
            'full_name': 'System Administrator',
            'role': 'super_admin',
            'created_at': datetime.utcnow(),
            'is_active': True
        }
        admins_collection.insert_one(default_admin)
        print("✅ Default admin created:")
        print("   Username: admin")
        print("   Password: admin123")
        print("   Email: admin@edunova.com")
    else:
        print("ℹ️ Admin accounts already exist")
    
    # Create sample courses if no courses exist
    if courses_collection.count_documents({}) == 0:
        sample_courses = [
            {
                'name': 'Computer Science',
                'code': 'CS101',
                'description': 'Introduction to Computer Science and Programming',
                'duration': '4 years',
                'fee': 5000,
                'capacity': 50,
                'status': 'active',
                'created_at': datetime.utcnow()
            },
            {
                'name': 'Business Administration',
                'code': 'BA101',
                'description': 'Fundamentals of Business Management',
                'duration': '3 years',
                'fee': 4500,
                'capacity': 40,
                'status': 'active',
                'created_at': datetime.utcnow()
            },
            {
                'name': 'Engineering',
                'code': 'ENG101',
                'description': 'General Engineering Principles',
                'duration': '4 years',
                'fee': 6000,
                'capacity': 60,
                'status': 'active',
                'created_at': datetime.utcnow()
            }
        ]
        
        courses_collection.insert_many(sample_courses)
        print("✅ Sample courses created successfully")
    else:
        print("ℹ️ Courses already exist")
    
    # Ensure app settings exists
    if app_settings_collection.count_documents({}) == 0:
        app_settings_collection.insert_one({
            'site_name': 'EduNova',
            'logo_url': '',
            'cors_origins': ['http://127.0.0.1:5000'],
            'enable_registrations': True,
            'created_at': datetime.utcnow()
        })
        print("✅ Default app settings created")
    else:
        print("ℹ️ App settings already exist")

    # Create sample teachers if no teachers exist
    if teachers_collection.count_documents({}) == 0:
        sample_teachers = [
            {
                'name': 'Dr. Sarah Johnson',
                'subject': 'mathematics',
                'contact': '1234567890',
                'email': 'sarah.johnson@edunova.com',
                'status': 'active',
                'created_at': datetime.utcnow()
            },
            {
                'name': 'Prof. Michael Chen',
                'subject': 'science',
                'contact': '2345678901',
                'email': 'michael.chen@edunova.com',
                'status': 'active',
                'created_at': datetime.utcnow()
            },
            {
                'name': 'Ms. Emily Davis',
                'subject': 'english',
                'contact': '3456789012',
                'email': 'emily.davis@edunova.com',
                'status': 'active',
                'created_at': datetime.utcnow()
            }
        ]
        
        teachers_collection.insert_many(sample_teachers)
        print("✅ Sample teachers created successfully")
    else:
        print("ℹ️ Teachers already exist")
    
    print("🎉 Database initialization completed!")
    print(f"📊 Database: {Config.DATABASE_NAME}")
    print(f"🔗 Connection: {Config.MONGODB_URI}")
    
    # Close connection
    client.close()

if __name__ == '__main__':
    init_database()
