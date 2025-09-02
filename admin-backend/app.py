from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from functools import wraps
from bson import ObjectId

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')

# Enable CORS
CORS(app)

# Get the parent directory (where frontend files are located)
FRONTEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# MongoDB connection
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/procr_database')
client = MongoClient(MONGODB_URI)
db = client.procr_database

# Collections
students_collection = db.students
admins_collection = db.admins
courses_collection = db.courses

# JWT token required decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_admin = admins_collection.find_one({'_id': ObjectId(data['admin_id'])})
            if not current_admin:
                return jsonify({'message': 'Invalid token!'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401
        
        return f(current_admin, *args, **kwargs)
    return decorated

# FRONTEND SERVING ROUTES
@app.route('/')
def serve_index():
    return send_from_directory(FRONTEND_DIR, 'adminfront.html')

@app.route('/<path:filename>')
def serve_frontend_files(filename):
    # Handle different file types
    if filename.endswith('.html'):
        return send_from_directory(FRONTEND_DIR, filename)
    elif filename.startswith('js/'):
        return send_from_directory(FRONTEND_DIR, filename)
    elif filename.startswith('css/'):
        return send_from_directory(FRONTEND_DIR, filename)
    elif filename.startswith('assets/'):
        return send_from_directory(FRONTEND_DIR, filename)
    else:
        # Try to serve from root directory
        try:
            return send_from_directory(FRONTEND_DIR, filename)
        except:
            return jsonify({'error': 'File not found'}), 404

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    try:
        # Test MongoDB connection
        client.admin.command('ping')
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'timestamp': datetime.utcnow().isoformat(),
            'frontend_dir': FRONTEND_DIR
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'database': 'disconnected',
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

# Debug route to see all registered routes
@app.route('/api/routes', methods=['GET'])
def list_routes():
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            'endpoint': rule.endpoint,
            'methods': list(rule.methods),
            'rule': rule.rule
        })
    return jsonify({'routes': routes})

# Admin Authentication Routes
@app.route('/api/admin/register', methods=['POST'])
def register_admin():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['username', 'email', 'password', 'full_name']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'{field} is required'}), 400
        
        # Check if admin already exists
        existing_admin = admins_collection.find_one({
            '$or': [
                {'username': data['username']},
                {'email': data['email']}
            ]
        })
        
        if existing_admin:
            return jsonify({'message': 'Admin already exists'}), 400
        
        # Create new admin
        hashed_password = generate_password_hash(data['password'])
        admin_data = {
            'username': data['username'],
            'email': data['email'],
            'password': hashed_password,
            'full_name': data['full_name'],
            'role': data.get('role', 'admin'),
            'created_at': datetime.utcnow(),
            'is_active': True
        }
        
        result = admins_collection.insert_one(admin_data)
        
        return jsonify({
            'message': 'Admin registered successfully',
            'admin_id': str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/admin/login', methods=['POST'])
def login_admin():
    try:
        print(f"Login endpoint called - Method: {request.method}")
        data = request.get_json()
        print(f"Received data: {data}")
        
        if not data.get('username') or not data.get('password'):
            return jsonify({'message': 'Username and password required'}), 400
        
        # Find admin
        admin = admins_collection.find_one({'username': data['username']})
        
        if not admin or not check_password_hash(admin['password'], data['password']):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        if not admin.get('is_active', True):
            return jsonify({'message': 'Account is deactivated'}), 401
        
        # Generate JWT token
        token = jwt.encode({
            'admin_id': str(admin['_id']),
            'username': admin['username'],
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'admin': {
                'id': str(admin['_id']),
                'username': admin['username'],
                'email': admin['email'],
                'full_name': admin['full_name'],
                'role': admin.get('role', 'admin')
            }
        }), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Student Management Routes
@app.route('/api/students', methods=['GET'])
@token_required
def get_students(current_admin):
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        search = request.args.get('search', '')
        
        # Build query
        query = {}
        if search:
            query = {
                '$or': [
                    {'full_name': {'$regex': search, '$options': 'i'}},
                    {'email': {'$regex': search, '$options': 'i'}},
                    {'student_id': {'$regex': search, '$options': 'i'}}
                ]
            }
        
        # Get total count
        total = students_collection.count_documents(query)
        
        # Get students with pagination
        students = list(students_collection.find(query)
                       .skip((page - 1) * limit)
                       .limit(limit)
                       .sort('created_at', -1))
        
        # Convert ObjectId to string
        for student in students:
            student['_id'] = str(student['_id'])
        
        return jsonify({
            'students': students,
            'total': total,
            'page': page,
            'pages': (total + limit - 1) // limit
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/students', methods=['POST'])
@token_required
def create_student(current_admin):
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['full_name', 'email', 'student_id', 'course', 'phone']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'{field} is required'}), 400
        
        # Check if student already exists
        existing_student = students_collection.find_one({
            '$or': [
                {'email': data['email']},
                {'student_id': data['student_id']}
            ]
        })
        
        if existing_student:
            return jsonify({'message': 'Student already exists'}), 400
        
        # Create student record
        student_data = {
            'full_name': data['full_name'],
            'email': data['email'],
            'student_id': data['student_id'],
            'course': data['course'],
            'phone': data['phone'],
            'address': data.get('address', ''),
            'date_of_birth': data.get('date_of_birth'),
            'enrollment_date': data.get('enrollment_date', datetime.utcnow().isoformat()),
            'status': data.get('status', 'active'),
            'created_at': datetime.utcnow(),
            'created_by': str(current_admin['_id'])
        }
        
        result = students_collection.insert_one(student_data)
        
        return jsonify({
            'message': 'Student created successfully',
            'student_id': str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/students/<student_id>', methods=['GET'])
@token_required
def get_student(current_admin, student_id):
    try:
        student = students_collection.find_one({'_id': ObjectId(student_id)})
        
        if not student:
            return jsonify({'message': 'Student not found'}), 404
        
        student['_id'] = str(student['_id'])
        return jsonify({'student': student}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/students/<student_id>', methods=['PUT'])
@token_required
def update_student(current_admin, student_id):
    try:
        data = request.get_json()
        
        # Remove fields that shouldn't be updated
        data.pop('_id', None)
        data.pop('created_at', None)
        data.pop('created_by', None)
        
        # Add update timestamp
        data['updated_at'] = datetime.utcnow()
        data['updated_by'] = str(current_admin['_id'])
        
        result = students_collection.update_one(
            {'_id': ObjectId(student_id)},
            {'$set': data}
        )
        
        if result.matched_count == 0:
            return jsonify({'message': 'Student not found'}), 404
        
        return jsonify({'message': 'Student updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/students/<student_id>', methods=['DELETE'])
@token_required
def delete_student(current_admin, student_id):
    try:
        result = students_collection.delete_one({'_id': ObjectId(student_id)})
        
        if result.deleted_count == 0:
            return jsonify({'message': 'Student not found'}), 404
        
        return jsonify({'message': 'Student deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Course Management Routes
@app.route('/api/courses', methods=['GET'])
@token_required
def get_courses(current_admin):
    try:
        courses = list(courses_collection.find().sort('name', 1))
        
        for course in courses:
            course['_id'] = str(course['_id'])
        
        return jsonify({'courses': courses}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/courses', methods=['POST'])
@token_required
def create_course(current_admin):
    try:
        data = request.get_json()
        
        required_fields = ['name', 'code', 'duration', 'fee']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'{field} is required'}), 400
        
        # Check if course already exists
        existing_course = courses_collection.find_one({'code': data['code']})
        if existing_course:
            return jsonify({'message': 'Course code already exists'}), 400
        
        course_data = {
            'name': data['name'],
            'code': data['code'],
            'description': data.get('description', ''),
            'duration': data['duration'],
            'fee': data['fee'],
            'capacity': data.get('capacity', 50),
            'status': data.get('status', 'active'),
            'created_at': datetime.utcnow(),
            'created_by': str(current_admin['_id'])
        }
        
        result = courses_collection.insert_one(course_data)
        
        return jsonify({
            'message': 'Course created successfully',
            'course_id': str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Dashboard Statistics
@app.route('/api/dashboard/stats', methods=['GET'])
@token_required
def get_dashboard_stats(current_admin):
    try:
        stats = {
            'total_students': students_collection.count_documents({'status': 'active'}),
            'total_courses': courses_collection.count_documents({'status': 'active'}),
            'pending_registrations': students_collection.count_documents({'status': 'pending'}),
            'recent_registrations': students_collection.count_documents({
                'created_at': {'$gte': datetime.utcnow() - timedelta(days=7)}
            })
        }
        
        return jsonify({'stats': stats}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'message': 'Internal server error'}), 500

# Initialize database with default admin (run once)
def init_db():
    # Check if any admin exists
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
        print("✅ Default admin created: username=admin, password=admin123")

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    # Print all registered routes for debugging
    print("\n📋 Registered routes:")
    for rule in app.url_map.iter_rules():
        methods = ', '.join(rule.methods - {'OPTIONS', 'HEAD'})
        print(f"  {rule.rule} - [{methods}]")
    
    # Get configuration from environment
    HOST = os.getenv('HOST', '127.0.0.1')
    PORT = int(os.getenv('PORT', 5000))
    DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    print(f"\n🚀 Starting EduNova Admin Backend...")
    print(f"📍 Server: http://{HOST}:{PORT}")
    print(f"📁 Frontend directory: {FRONTEND_DIR}")
    print(f"🔧 Debug mode: {DEBUG}")
    print(f"\n🌐 Access your app at: http://{HOST}:{PORT}")
    
    app.run(host=HOST, port=PORT, debug=DEBUG)



from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from bson import ObjectId

# Load .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Config
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
mongo_uri = os.getenv('MONGO_URI')

# Connect to MongoDB
client = MongoClient(mongo_uri)
db = client['edunova']
admins_collection = db['admins']

# Register Route
@app.route('/api/admin/register', methods=['POST'])
def register_admin():
    data = request.get_json()
    required = ['username', 'email', 'password', 'full_name']
    
    if not all(field in data for field in required):
        return jsonify({'message': 'Missing required fields'}), 400

    # Check if exists
    if admins_collection.find_one({'$or': [{'username': data['username']}, {'email': data['email']}] }):
        return jsonify({'message': 'Admin already exists'}), 409

    hashed_pw = generate_password_hash(data['password'])

    admin = {
        'username': data['username'],
        'email': data['email'],
        'password': hashed_pw,
        'full_name': data['full_name'],
        'role': 'admin',
        'created_at': datetime.utcnow(),
        'is_active': True
    }

    result = admins_collection.insert_one(admin)
    return jsonify({'message': 'Registered', 'admin_id': str(result.inserted_id)}), 201

# Login Route
@app.route('/api/admin/login', methods=['POST'])
def login_admin():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    admin = admins_collection.find_one({'username': username})

    if not admin:
        return jsonify({'message': 'Invalid username'}), 401

    if not check_password_hash(admin['password'], password):
        return jsonify({'message': 'Invalid password'}), 401

    if not admin.get('is_active', True):
        return jsonify({'message': 'Account inactive'}), 403

    token = jwt.encode({
        'admin_id': str(admin['_id']),
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({
        'message': 'Login successful',
        'token': token,
        'admin': {
            'username': admin['username'],
            'email': admin['email'],
            'role': admin['role'],
            'full_name': admin['full_name']
        }
    })

if __name__ == '__main__':
    app.run(debug=True)
