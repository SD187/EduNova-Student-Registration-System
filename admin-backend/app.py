from flask import Flask, request, jsonify, send_from_directory, redirect
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

# Import configuration
from config import Config

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = Config.SECRET_KEY

# Enable CORS
CORS(app)

# Get the parent directory (where frontend files are located)
FRONTEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Define directory paths for the new structure
PUBLIC_DIR = os.path.join(FRONTEND_DIR, 'public')
ADMIN_DIR = os.path.join(FRONTEND_DIR, 'admin')
SHARED_DIR = os.path.join(FRONTEND_DIR, 'shared')

# MongoDB connection
client = MongoClient(Config.MONGODB_URI)
db = client[Config.DATABASE_NAME]

# Collections
students_collection = db.students
admins_collection = db.admins
courses_collection = db.courses
teachers_collection = db.teachers
registration_links_collection = db.registration_links
course_resources_collection = db.course_resources
timetable_collection = db.timetable_entries
feedback_collection = db.feedback

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
    """Serve the public home page"""
    return send_from_directory(PUBLIC_DIR, 'index.html')

# User/Public page routes
@app.route('/index.html')
def serve_index_html():
    """Serve the index.html file directly"""
    return send_from_directory(PUBLIC_DIR, 'index.html')

@app.route('/about')
def serve_about():
    """Serve the about page"""
    return send_from_directory(PUBLIC_DIR, 'about.html')

@app.route('/courses')
def serve_courses():
    """Serve the courses page"""
    return send_from_directory(PUBLIC_DIR, 'courses.html')

@app.route('/timetable')
def serve_timetable():
    """Serve the timetable page"""
    return send_from_directory(PUBLIC_DIR, 'timetable.html')

@app.route('/contact')
def serve_contact():
    """Serve the contact page"""
    return send_from_directory(PUBLIC_DIR, 'Contact.html')

# Direct file access routes for public HTML files
@app.route('/about.html')
def serve_about_html():
    """Serve the about.html file directly"""
    return send_from_directory(PUBLIC_DIR, 'about.html')

@app.route('/courses.html')
def serve_courses_html():
    """Serve the courses.html file directly"""
    return send_from_directory(PUBLIC_DIR, 'courses.html')

@app.route('/timetable.html')
def serve_timetable_html():
    """Serve the timetable.html file directly"""
    return send_from_directory(PUBLIC_DIR, 'timetable.html')

@app.route('/Contact.html')
def serve_contact_html():
    """Serve the Contact.html file directly"""
    return send_from_directory(PUBLIC_DIR, 'Contact.html')

@app.route('/admin')
@app.route('/admin/')
def serve_admin_dashboard():
    """Serve the admin dashboard (requires authentication)"""
    return send_from_directory(ADMIN_DIR, 'Dashboard.html')

@app.route('/admin/index.html')
def redirect_admin_index():
    """Redirect /admin/index.html to /admin"""
    return redirect('/admin')

@app.route('/admin/<path:filename>')
def serve_admin_files(filename):
    """Serve admin-specific files"""
    return send_from_directory(ADMIN_DIR, filename)

@app.route('/admin/css/<path:filename>')
def serve_admin_css(filename):
    """Serve admin CSS files"""
    return send_from_directory(os.path.join(ADMIN_DIR, 'css'), filename)

@app.route('/admin/js/<path:filename>')
def serve_admin_js(filename):
    """Serve admin JavaScript files"""
    return send_from_directory(os.path.join(ADMIN_DIR, 'js'), filename)

@app.route('/public/<path:filename>')
def serve_public_files(filename):
    """Serve public files"""
    return send_from_directory(PUBLIC_DIR, filename)

@app.route('/public/css/<path:filename>')
def serve_public_css(filename):
    """Serve public CSS files"""
    return send_from_directory(os.path.join(PUBLIC_DIR, 'css'), filename)

@app.route('/public/js/<path:filename>')
def serve_public_js(filename):
    """Serve public JavaScript files"""
    return send_from_directory(os.path.join(PUBLIC_DIR, 'js'), filename)

@app.route('/shared/<path:filename>')
def serve_shared_files(filename):
    """Serve shared files"""
    return send_from_directory(SHARED_DIR, filename)

@app.route('/shared/css/<path:filename>')
def serve_shared_css(filename):
    """Serve shared CSS files"""
    return send_from_directory(os.path.join(SHARED_DIR, 'css'), filename)

@app.route('/shared/js/<path:filename>')
def serve_shared_js(filename):
    """Serve shared JavaScript files"""
    return send_from_directory(os.path.join(SHARED_DIR, 'js'), filename)

@app.route('/shared/assets/<path:filename>')
def serve_shared_assets(filename):
    """Serve shared asset files"""
    return send_from_directory(os.path.join(SHARED_DIR, 'assets'), filename)

# Legacy route support for backward compatibility - moved to end to avoid conflicts
@app.route('/<path:filename>')
def serve_legacy_files(filename):
    """Handle legacy file requests with intelligent routing"""
    # Skip if it's a known route that should be handled by specific routes
    if filename in ['about', 'courses', 'timetable', 'contact', 'admin']:
        return jsonify({'error': 'Route not found'}), 404
        
    # Handle different file types and routes
    if filename.endswith('.html'):
        # Check if it's an admin file
        if filename in ['Dashboard.html', 'mteachers.html', 'Mcources.html', 'mtime.html', 'mstudent.html', 'settings.html', 'adminlogin.html', 'adminfront.html', 'fpassword.html', 'logout.html', 'createaccount.html']:
            return send_from_directory(ADMIN_DIR, filename)
        # Check if it's a public file
        elif filename in ['index.html', 'about.html', 'Contact.html', 'courses.html', 'timetable.html']:
            return send_from_directory(PUBLIC_DIR, filename)
        else:
            # Try to serve from appropriate directory
            try:
                return send_from_directory(PUBLIC_DIR, filename)
            except:
                try:
                    return send_from_directory(ADMIN_DIR, filename)
                except:
                    return jsonify({'error': 'File not found'}), 404
    elif filename.startswith('js/'):
        # Try to serve from shared directory first, then admin, then public
        try:
            return send_from_directory(os.path.join(SHARED_DIR, 'js'), filename[3:])
        except:
            try:
                return send_from_directory(os.path.join(ADMIN_DIR, 'js'), filename[3:])
            except:
                try:
                    return send_from_directory(os.path.join(PUBLIC_DIR, 'js'), filename[3:])
                except:
                    return jsonify({'error': 'File not found'}), 404
    elif filename.startswith('css/'):
        # Try to serve from shared directory first, then admin, then public
        try:
            return send_from_directory(os.path.join(SHARED_DIR, 'css'), filename[5:])
        except:
            try:
                return send_from_directory(os.path.join(PUBLIC_DIR, 'css'), filename[5:])
            except:
                try:
                    return send_from_directory(os.path.join(ADMIN_DIR, 'css'), filename[5:])
                except:
                    return jsonify({'error': 'File not found'}), 404
    elif filename.startswith('assets/'):
        # Try to serve from shared directory first
        try:
            return send_from_directory(os.path.join(SHARED_DIR, 'assets'), filename[7:])
        except:
            return jsonify({'error': 'File not found'}), 404
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
            'frontend_dir': FRONTEND_DIR,
            'public_dir': PUBLIC_DIR,
            'admin_dir': ADMIN_DIR,
            'shared_dir': SHARED_DIR
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
        required_fields = ['username', 'password', 'full_name', 'security_key']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'{field} is required'}), 400
        
        # Validate security key
        if data['security_key'] != Config.ADMIN_SECURITY_KEY:
            return jsonify({'message': 'Invalid security key. Access denied.'}), 403
        
        # Generate email from username if not provided
        email = data.get('email', f"{data['username']}@edunova.com")
        
        # Check if admin already exists
        existing_admin = admins_collection.find_one({
            '$or': [
                {'username': data['username']},
                {'email': email}
            ]
        })
        
        if existing_admin:
            return jsonify({'message': 'Admin already exists'}), 400
        
        # Create new admin
        hashed_password = generate_password_hash(data['password'])
        admin_data = {
            'username': data['username'],
            'email': email,
            'password': hashed_password,
            'full_name': data['full_name'],
            'role': data.get('role', 'admin'),
            'security_key_used': data['security_key'],  # Store the security key used
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
        data = request.get_json()
        
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

@app.route('/api/courses/<course_id>', methods=['GET'])
@token_required
def get_course(current_admin, course_id):
    try:
        course = courses_collection.find_one({'_id': ObjectId(course_id)})
        
        if not course:
            return jsonify({'message': 'Course not found'}), 404
        
        course['_id'] = str(course['_id'])
        return jsonify({'course': course}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/courses/<course_id>', methods=['PUT'])
@token_required
def update_course(current_admin, course_id):
    try:
        data = request.get_json()
        
        # Remove fields that shouldn't be updated
        data.pop('_id', None)
        data.pop('created_at', None)
        data.pop('created_by', None)
        
        # Add update timestamp
        data['updated_at'] = datetime.utcnow()
        data['updated_by'] = str(current_admin['_id'])
        
        result = courses_collection.update_one(
            {'_id': ObjectId(course_id)},
            {'$set': data}
        )
        
        if result.matched_count == 0:
            return jsonify({'message': 'Course not found'}), 404
        
        return jsonify({'message': 'Course updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/courses/<course_id>', methods=['DELETE'])
@token_required
def delete_course(current_admin, course_id):
    try:
        result = courses_collection.delete_one({'_id': ObjectId(course_id)})
        
        if result.deleted_count == 0:
            return jsonify({'message': 'Course not found'}), 404
        
        return jsonify({'message': 'Course deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Teacher Management Routes
@app.route('/api/teachers', methods=['GET'])
@token_required
def get_teachers(current_admin):
    try:
        teachers = list(teachers_collection.find().sort('name', 1))
        
        for teacher in teachers:
            teacher['_id'] = str(teacher['_id'])
        
        return jsonify({'teachers': teachers}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/teachers', methods=['POST'])
@token_required
def create_teacher(current_admin):
    try:
        data = request.get_json()
        
        required_fields = ['name', 'subject', 'contact', 'email']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'{field} is required'}), 400
        
        # Check if teacher with same email already exists
        existing_teacher = teachers_collection.find_one({'email': data['email']})
        if existing_teacher:
            return jsonify({'message': 'Teacher with this email already exists'}), 400
        
        teacher_data = {
            'name': data['name'],
            'subject': data['subject'],
            'contact': data['contact'],
            'email': data['email'],
            'status': data.get('status', 'active'),
            'created_at': datetime.utcnow(),
            'created_by': str(current_admin['_id'])
        }
        
        result = teachers_collection.insert_one(teacher_data)
        
        return jsonify({
            'message': 'Teacher created successfully',
            'teacher_id': str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/teachers/<teacher_id>', methods=['GET'])
@token_required
def get_teacher(current_admin, teacher_id):
    try:
        teacher = teachers_collection.find_one({'_id': ObjectId(teacher_id)})
        
        if not teacher:
            return jsonify({'message': 'Teacher not found'}), 404
        
        teacher['_id'] = str(teacher['_id'])
        return jsonify({'teacher': teacher}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/teachers/<teacher_id>', methods=['PUT'])
@token_required
def update_teacher(current_admin, teacher_id):
    try:
        data = request.get_json()
        
        # Remove fields that shouldn't be updated
        data.pop('_id', None)
        data.pop('created_at', None)
        data.pop('created_by', None)
        
        # Add update timestamp
        data['updated_at'] = datetime.utcnow()
        data['updated_by'] = str(current_admin['_id'])
        
        result = teachers_collection.update_one(
            {'_id': ObjectId(teacher_id)},
            {'$set': data}
        )
        
        if result.matched_count == 0:
            return jsonify({'message': 'Teacher not found'}), 404
        
        return jsonify({'message': 'Teacher updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/teachers/<teacher_id>', methods=['DELETE'])
@token_required
def delete_teacher(current_admin, teacher_id):
    try:
        result = teachers_collection.delete_one({'_id': ObjectId(teacher_id)})
        
        if result.deleted_count == 0:
            return jsonify({'message': 'Teacher not found'}), 404
        
        return jsonify({'message': 'Teacher deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Dashboard Statistics
@app.route('/api/dashboard/stats', methods=['GET'])
@token_required
def get_dashboard_stats(current_admin):
    try:
        # Get real-time statistics from MongoDB
        total_students = students_collection.count_documents({'status': 'active'})
        total_courses = courses_collection.count_documents({'status': 'active'})
        total_teachers = teachers_collection.count_documents({'status': 'active'})
        total_admins = admins_collection.count_documents({'is_active': True})
        
        # Get feedback statistics
        total_feedbacks = feedback_collection.count_documents({})
        pending_feedbacks = feedback_collection.count_documents({'status': 'pending'})
        
        # Get recent activity (last 7 days)
        recent_students = students_collection.count_documents({
            'created_at': {'$gte': datetime.utcnow() - timedelta(days=7)}
        })
        recent_feedbacks = feedback_collection.count_documents({
            'created_at': {'$gte': datetime.utcnow() - timedelta(days=7)}
        })
        
        # Get pending registrations
        pending_registrations = students_collection.count_documents({'status': 'pending'})
        
        # Calculate completion rate (example calculation)
        total_enrolled = students_collection.count_documents({'status': 'active'})
        completed_students = students_collection.count_documents({'status': 'completed'})
        completion_rate = round((completed_students / max(total_enrolled, 1)) * 100, 1)
        
        # Calculate average rating from feedback
        avg_rating_result = list(feedback_collection.aggregate([
            {'$group': {'_id': None, 'avg_rating': {'$avg': '$rating'}}}
        ]))
        avg_rating = round(avg_rating_result[0]['avg_rating'], 1) if avg_rating_result and avg_rating_result[0]['avg_rating'] else 4.8
        
        stats = {
            'total_students': total_students,
            'total_courses': total_courses,
            'total_teachers': total_teachers,
            'total_admins': total_admins,
            'total_feedbacks': total_feedbacks,
            'pending_feedbacks': pending_feedbacks,
            'recent_registrations': recent_students,
            'recent_feedbacks': recent_feedbacks,
            'pending_registrations': pending_registrations,
            'completion_rate': completion_rate,
            'avg_rating': avg_rating,
            'last_login': current_admin.get('last_login', 'Never')
        }
        
        return jsonify({'stats': stats}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Dashboard Activity Data
@app.route('/api/dashboard/activity', methods=['GET'])
@token_required
def get_dashboard_activity(current_admin):
    try:
        # Get recent student registrations for activity chart
        recent_students = list(students_collection.find({
            'created_at': {'$gte': datetime.utcnow() - timedelta(days=30)}
        }).sort('created_at', -1).limit(10))
        
        # Get recent course activities
        recent_courses = list(courses_collection.find({
            'created_at': {'$gte': datetime.utcnow() - timedelta(days=30)}
        }).sort('created_at', -1).limit(5))
        
        # Format the data for frontend
        activity_data = {
            'recent_students': [
                {
                    'id': str(student['_id']),
                    'name': student['full_name'],
                    'course': student['course'],
                    'date': student['created_at'].isoformat(),
                    'status': student['status']
                } for student in recent_students
            ],
            'recent_courses': [
                {
                    'id': str(course['_id']),
                    'name': course['name'],
                    'code': course['code'],
                    'date': course['created_at'].isoformat(),
                    'status': course['status']
                } for course in recent_courses
            ],
            'chart_data': {
                'labels': ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                'enrollments': [45, 52, 38, 67],
                'completions': [42, 48, 35, 62]
            }
        }
        
        return jsonify({'activity': activity_data}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Course Resources (subject+grade -> one link used for past/model/study)
@app.route('/api/course-resources', methods=['GET'])
@token_required
def list_course_resources(current_admin):
    try:
        # Optional filters: subject, grade
        subject = request.args.get('subject')
        grade = request.args.get('grade')
        query = {}
        if subject:
            query['subject'] = subject
        if grade:
            query['grade'] = grade
        docs = list(course_resources_collection.find(query).sort('subject', 1))
        for d in docs:
            d['_id'] = str(d['_id'])
        return jsonify({'resources': docs}), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/course-resources', methods=['POST'])
@token_required
def upsert_course_resource(current_admin):
    try:
        data = request.get_json()
        # Expect subject (slug/lower), grade (e.g., '6' or 'grade-6'), and link (OneDrive/Drive)
        for f in ['subject', 'grade', 'link']:
            if not data.get(f):
                return jsonify({'message': f'{f} is required'}), 400
        # Normalize grade: accept 'grade-6' or '6' -> store as '6'
        grade = str(data['grade']).replace('grade-', '')
        subject = str(data['subject']).strip().lower()
        link = data['link'].strip()
        now = datetime.utcnow()
        result = course_resources_collection.update_one(
            {'subject': subject, 'grade': grade},
            {'$set': {
                'subject': subject,
                'grade': grade,
                'link': link,
                'updated_at': now,
                'updated_by': str(current_admin['_id'])
            }, '$setOnInsert': {
                'created_at': now,
                'created_by': str(current_admin['_id'])
            }},
            upsert=True
        )
        # Determine id
        if result.upserted_id:
            res_id = str(result.upserted_id)
            msg = 'Resource created'
        else:
            # fetch id
            doc = course_resources_collection.find_one({'subject': subject, 'grade': grade})
            res_id = str(doc['_id']) if doc else None
            msg = 'Resource updated'
        return jsonify({'message': msg, 'id': res_id}), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Public resolver (no auth): given subject + grade + type -> redirect/open stored link
@app.route('/api/public/course-resource', methods=['GET'])
def public_course_resource():
    try:
        subject = request.args.get('subject', '').strip().lower()
        grade = request.args.get('grade', '').replace('grade-', '')
        if not subject or not grade:
            return jsonify({'message': 'subject and grade are required'}), 400
        doc = course_resources_collection.find_one({'subject': subject, 'grade': grade})
        if not doc:
            return jsonify({'message': 'No resource configured for this subject and grade'}), 404
        return jsonify({'link': doc.get('link')}), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Timetable Endpoints
# Public: list timetable entries with optional filters
@app.route('/api/timetable', methods=['GET'])
def get_timetable():
    try:
        subject = request.args.get('subject')
        grade = request.args.get('grade')
        date = request.args.get('date')
        query = {}
        if subject:
            query['subject'] = subject.strip().lower()
        if grade:
            query['grade'] = str(grade).replace('grade-', '')
        if date:
            query['date'] = date
        entries = list(timetable_collection.find(query).sort([('date', 1), ('start_time', 1)]))
        for e in entries:
            e['_id'] = str(e['_id'])
        return jsonify({'entries': entries}), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Admin: add a timetable entry
@app.route('/api/timetable', methods=['POST'])
@token_required
def add_timetable_entry(current_admin):
    try:
        data = request.get_json()
        required = ['subject', 'grade', 'date', 'start_time', 'end_time']
        for f in required:
            if not data.get(f):
                return jsonify({'message': f'{f} is required'}), 400
        doc = {
            'subject': str(data['subject']).strip().lower(),
            'grade': str(data['grade']).replace('grade-', ''),
            'date': data['date'],
            'start_time': data['start_time'],
            'end_time': data['end_time'],
            'created_at': datetime.utcnow(),
            'created_by': str(current_admin['_id'])
        }
        res = timetable_collection.insert_one(doc)
        return jsonify({'message': 'Timetable entry added', 'id': str(res.inserted_id)}), 201
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Admin: delete an entry
@app.route('/api/timetable/<entry_id>', methods=['DELETE'])
@token_required
def delete_timetable_entry(current_admin, entry_id):
    try:
        result = timetable_collection.delete_one({'_id': ObjectId(entry_id)})
        if result.deleted_count == 0:
            return jsonify({'message': 'Entry not found'}), 404
        return jsonify({'message': 'Entry deleted'}), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Settings: current admin profile
@app.route('/api/admin/me', methods=['GET'])
@token_required
def get_me(current_admin):
    try:
        admin = current_admin.copy()
        admin['_id'] = str(admin['_id'])
        # hide password
        admin.pop('password', None)
        return jsonify(admin), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/admin/me', methods=['PUT'])
@token_required
def update_me(current_admin):
    try:
        data = request.get_json()
        update = {}
        if 'full_name' in data: update['full_name'] = data['full_name']
        if 'email' in data: update['email'] = data['email']
        if not update:
            return jsonify({'message': 'Nothing to update'}), 400
        admins_collection.update_one({'_id': current_admin['_id']}, {'$set': update})
        return jsonify({'message': 'Profile updated'}), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/admin/change-password', methods=['POST'])
@token_required
def change_password(current_admin):
    try:
        data = request.get_json()
        if not data.get('current_password') or not data.get('new_password'):
            return jsonify({'message': 'Passwords are required'}), 400
        if not check_password_hash(current_admin['password'], data['current_password']):
            return jsonify({'message': 'Current password is incorrect'}), 400
        hashed = generate_password_hash(data['new_password'])
        admins_collection.update_one({'_id': current_admin['_id']}, {'$set': {'password': hashed}})
        return jsonify({'message': 'Password changed'}), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Application settings (single document)
app_settings_collection = db.app_settings

@app.route('/api/settings/app', methods=['GET'])
@token_required
def get_app_settings(current_admin):
    try:
        doc = app_settings_collection.find_one({}) or {}
        if '_id' in doc: doc['_id'] = str(doc['_id'])
        return jsonify({
            'site_name': doc.get('site_name', 'EduNova'),
            'logo_url': doc.get('logo_url', ''),
            'cors_origins': doc.get('cors_origins', []),
            'enable_registrations': doc.get('enable_registrations', True)
        }), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/settings/app', methods=['PUT'])
@token_required
def update_app_settings(current_admin):
    try:
        data = request.get_json()
        update = {
            'site_name': data.get('site_name', 'EduNova'),
            'logo_url': data.get('logo_url', ''),
            'cors_origins': data.get('cors_origins', []),
            'enable_registrations': bool(data.get('enable_registrations', True)),
            'updated_at': datetime.utcnow(),
            'updated_by': str(current_admin['_id'])
        }
        app_settings_collection.update_one({}, {'$set': update}, upsert=True)
        return jsonify({'message': 'Settings updated'}), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Admin logout (stateless JWT: client should discard token)
@app.route('/api/admin/logout', methods=['POST'])
@token_required
def admin_logout(current_admin):
    try:
        # With stateless JWT there is nothing to do server-side (unless token blacklist is used)
        return jsonify({'message': 'Logged out'}), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Dashboard Quick Actions
@app.route('/api/dashboard/quick-actions', methods=['POST'])
@token_required
def perform_quick_action(current_admin):
    try:
        data = request.get_json()
        action = data.get('action')
        
        if action == 'manage_courses':
            return jsonify({
                'message': 'Redirecting to course management',
                'redirect': '/courses'
            }), 200
        elif action == 'manage_students':
            return jsonify({
                'message': 'Redirecting to student management',
                'redirect': '/students'
            }), 200
        else:
            return jsonify({'message': 'Invalid action'}), 400
            
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Public API to get current registration link (no authentication required)
@app.route('/api/public/registration-link', methods=['GET'])
def get_public_registration_link():
    try:
        # Get the current active registration link
        link_doc = registration_links_collection.find_one({'is_active': True})
        
        if link_doc:
            return jsonify({
                'link': link_doc['link'],
                'title': link_doc.get('title', 'Student Registration'),
                'available': True
            }), 200
        else:
            return jsonify({
                'link': None,
                'title': 'Student Registration',
                'available': False,
                'message': 'No registration form available'
            }), 404
            
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Student Registration Link Management
@app.route('/api/student-registration/link', methods=['GET'])
@token_required
def get_registration_link(current_admin):
    try:
        # Get the current registration link
        link_doc = registration_links_collection.find_one({'is_active': True})
        
        if link_doc:
            return jsonify({
                'link': link_doc['link'],
                'title': link_doc.get('title', 'Student Registration'),
                'created_at': link_doc['created_at'].isoformat(),
                'created_by': link_doc['created_by']
            }), 200
        else:
            return jsonify({'message': 'No active registration link found'}), 404
            
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/student-registration/link', methods=['POST'])
@token_required
def add_registration_link(current_admin):
    try:
        data = request.get_json()
        
        if not data.get('link'):
            return jsonify({'message': 'Registration link is required'}), 400
        
        # Deactivate any existing active links
        registration_links_collection.update_many(
            {'is_active': True},
            {'$set': {'is_active': False, 'updated_at': datetime.utcnow()}}
        )
        
        # Create new registration link
        link_data = {
            'link': data['link'],
            'title': data.get('title', 'Student Registration'),
            'is_active': True,
            'created_at': datetime.utcnow(),
            'created_by': str(current_admin['_id']),
            'admin_username': current_admin['username']
        }
        
        result = registration_links_collection.insert_one(link_data)
        
        return jsonify({
            'message': 'Registration link added successfully',
            'link_id': str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/student-registration/link', methods=['PUT'])
@token_required
def update_registration_link(current_admin):
    try:
        data = request.get_json()
        
        if not data.get('link'):
            return jsonify({'message': 'Registration link is required'}), 400
        
        # Find the current active link
        current_link = registration_links_collection.find_one({'is_active': True})
        
        if not current_link:
            return jsonify({'message': 'No active registration link to update'}), 404
        
        # Update the link
        result = registration_links_collection.update_one(
            {'_id': current_link['_id']},
            {
                '$set': {
                    'link': data['link'],
                    'title': data.get('title', 'Student Registration'),
                    'updated_at': datetime.utcnow(),
                    'updated_by': str(current_admin['_id']),
                    'admin_username': current_admin['username']
                }
            }
        )
        
        if result.modified_count > 0:
            return jsonify({'message': 'Registration link updated successfully'}), 200
        else:
            return jsonify({'message': 'Failed to update registration link'}), 500
            
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/student-registration/link/history', methods=['GET'])
@token_required
def get_registration_link_history(current_admin):
    try:
        # Get all registration links (for history)
        links = list(registration_links_collection.find().sort('created_at', -1))
        
        # Convert ObjectId to string
        for link in links:
            link['_id'] = str(link['_id'])
            link['created_at'] = link['created_at'].isoformat()
            if 'updated_at' in link:
                link['updated_at'] = link['updated_at'].isoformat()
        
        return jsonify({'links': links}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Feedback Management Routes
@app.route('/api/feedback', methods=['POST'])
def create_feedback():
    """Create new feedback (public endpoint - no authentication required)"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'message': f'{field} is required'}), 400
        
        # Validate email format
        import re
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data['email']):
            return jsonify({'message': 'Invalid email format'}), 400
        
        # Create feedback document
        feedback_data = {
            'name': data['name'].strip(),
            'email': data['email'].strip().lower(),
            'message': data['message'].strip(),
            'rating': data.get('rating', 5),
            'feedback_type': data.get('feedback_type', 'general'),
            'student_id': data.get('student_id'),
            'is_anonymous': data.get('is_anonymous', False),
            'status': 'pending',
            'admin_response': None,
            'responded_at': None,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        # Insert feedback
        result = feedback_collection.insert_one(feedback_data)
        
        return jsonify({
            'message': 'Feedback submitted successfully',
            'feedback_id': str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/feedback', methods=['GET'])
def get_feedbacks():
    """Get feedbacks (public endpoint - returns only approved feedbacks)"""
    try:
        # Get query parameters
        limit = int(request.args.get('limit', 10))
        feedback_type = request.args.get('type')
        rating = request.args.get('rating')
        
        # Build query
        query = {'status': {'$in': ['reviewed', 'resolved']}}  # Only show approved feedbacks
        
        if feedback_type:
            query['feedback_type'] = feedback_type
        if rating:
            query['rating'] = int(rating)
        
        # Get feedbacks
        feedbacks = list(feedback_collection.find(query)
                        .sort('created_at', -1)
                        .limit(limit))
        
        # Convert ObjectId to string and format response
        for feedback in feedbacks:
            feedback['_id'] = str(feedback['_id'])
            feedback['created_at'] = feedback['created_at'].isoformat()
            if feedback.get('responded_at'):
                feedback['responded_at'] = feedback['responded_at'].isoformat()
        
        return jsonify({'feedbacks': feedbacks}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Admin Feedback Management Routes
@app.route('/api/admin/feedback', methods=['GET'])
@token_required
def get_all_feedbacks(current_admin):
    """Get all feedbacks for admin (with pagination and filtering)"""
    try:
        # Get query parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        status = request.args.get('status')
        feedback_type = request.args.get('type')
        search = request.args.get('search', '')
        
        # Build query
        query = {}
        if status:
            query['status'] = status
        if feedback_type:
            query['feedback_type'] = feedback_type
        if search:
            query['$or'] = [
                {'name': {'$regex': search, '$options': 'i'}},
                {'email': {'$regex': search, '$options': 'i'}},
                {'message': {'$regex': search, '$options': 'i'}}
            ]
        
        # Get total count
        total = feedback_collection.count_documents(query)
        
        # Get feedbacks with pagination
        feedbacks = list(feedback_collection.find(query)
                        .skip((page - 1) * limit)
                        .limit(limit)
                        .sort('created_at', -1))
        
        # Convert ObjectId to string
        for feedback in feedbacks:
            feedback['_id'] = str(feedback['_id'])
            feedback['created_at'] = feedback['created_at'].isoformat()
            if feedback.get('updated_at'):
                feedback['updated_at'] = feedback['updated_at'].isoformat()
            if feedback.get('responded_at'):
                feedback['responded_at'] = feedback['responded_at'].isoformat()
        
        return jsonify({
            'feedbacks': feedbacks,
            'total': total,
            'page': page,
            'pages': (total + limit - 1) // limit
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/admin/feedback/<feedback_id>', methods=['GET'])
@token_required
def get_feedback(current_admin, feedback_id):
    """Get specific feedback by ID"""
    try:
        feedback = feedback_collection.find_one({'_id': ObjectId(feedback_id)})
        
        if not feedback:
            return jsonify({'message': 'Feedback not found'}), 404
        
        feedback['_id'] = str(feedback['_id'])
        feedback['created_at'] = feedback['created_at'].isoformat()
        if feedback.get('updated_at'):
            feedback['updated_at'] = feedback['updated_at'].isoformat()
        if feedback.get('responded_at'):
            feedback['responded_at'] = feedback['responded_at'].isoformat()
        
        return jsonify({'feedback': feedback}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/admin/feedback/<feedback_id>', methods=['PUT'])
@token_required
def update_feedback(current_admin, feedback_id):
    """Update feedback status and admin response"""
    try:
        data = request.get_json()
        
        # Validate status if provided
        if 'status' in data and data['status'] not in ['pending', 'reviewed', 'resolved', 'archived']:
            return jsonify({'message': 'Invalid status'}), 400
        
        # Prepare update data
        update_data = {}
        if 'status' in data:
            update_data['status'] = data['status']
        if 'admin_response' in data:
            update_data['admin_response'] = data['admin_response']
            update_data['responded_at'] = datetime.utcnow()
        
        update_data['updated_at'] = datetime.utcnow()
        update_data['updated_by'] = str(current_admin['_id'])
        
        # Update feedback
        result = feedback_collection.update_one(
            {'_id': ObjectId(feedback_id)},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({'message': 'Feedback not found'}), 404
        
        return jsonify({'message': 'Feedback updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/admin/feedback/<feedback_id>', methods=['DELETE'])
@token_required
def delete_feedback(current_admin, feedback_id):
    """Delete feedback"""
    try:
        result = feedback_collection.delete_one({'_id': ObjectId(feedback_id)})
        
        if result.deleted_count == 0:
            return jsonify({'message': 'Feedback not found'}), 404
        
        return jsonify({'message': 'Feedback deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/admin/feedback/bulk-action', methods=['POST'])
@token_required
def bulk_feedback_action(current_admin):
    """Perform bulk actions on feedbacks"""
    try:
        data = request.get_json()
        action = data.get('action')
        feedback_ids = data.get('feedback_ids', [])
        
        if not action or not feedback_ids:
            return jsonify({'message': 'Action and feedback IDs are required'}), 400
        
        # Convert string IDs to ObjectIds
        object_ids = [ObjectId(fid) for fid in feedback_ids]
        
        if action == 'mark_reviewed':
            result = feedback_collection.update_many(
                {'_id': {'$in': object_ids}},
                {'$set': {
                    'status': 'reviewed',
                    'updated_at': datetime.utcnow(),
                    'updated_by': str(current_admin['_id'])
                }}
            )
        elif action == 'mark_resolved':
            result = feedback_collection.update_many(
                {'_id': {'$in': object_ids}},
                {'$set': {
                    'status': 'resolved',
                    'updated_at': datetime.utcnow(),
                    'updated_by': str(current_admin['_id'])
                }}
            )
        elif action == 'archive':
            result = feedback_collection.update_many(
                {'_id': {'$in': object_ids}},
                {'$set': {
                    'status': 'archived',
                    'updated_at': datetime.utcnow(),
                    'updated_by': str(current_admin['_id'])
                }}
            )
        elif action == 'delete':
            result = feedback_collection.delete_many({'_id': {'$in': object_ids}})
        else:
            return jsonify({'message': 'Invalid action'}), 400
        
        return jsonify({
            'message': f'Bulk action completed successfully',
            'modified_count': result.modified_count if hasattr(result, 'modified_count') else result.deleted_count
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/admin/feedback/stats', methods=['GET'])
@token_required
def get_feedback_stats(current_admin):
    """Get feedback statistics for admin dashboard"""
    try:
        # Get total counts by status
        total_feedbacks = feedback_collection.count_documents({})
        pending_feedbacks = feedback_collection.count_documents({'status': 'pending'})
        reviewed_feedbacks = feedback_collection.count_documents({'status': 'reviewed'})
        resolved_feedbacks = feedback_collection.count_documents({'status': 'resolved'})
        archived_feedbacks = feedback_collection.count_documents({'status': 'archived'})
        
        # Get counts by feedback type
        feedback_types = list(feedback_collection.aggregate([
            {'$group': {'_id': '$feedback_type', 'count': {'$sum': 1}}},
            {'$sort': {'count': -1}}
        ]))
        
        # Get average rating
        avg_rating_result = list(feedback_collection.aggregate([
            {'$group': {'_id': None, 'avg_rating': {'$avg': '$rating'}}}
        ]))
        avg_rating = avg_rating_result[0]['avg_rating'] if avg_rating_result else 0
        
        # Get recent feedbacks (last 7 days)
        recent_feedbacks = feedback_collection.count_documents({
            'created_at': {'$gte': datetime.utcnow() - timedelta(days=7)}
        })
        
        stats = {
            'total_feedbacks': total_feedbacks,
            'pending_feedbacks': pending_feedbacks,
            'reviewed_feedbacks': reviewed_feedbacks,
            'resolved_feedbacks': resolved_feedbacks,
            'archived_feedbacks': archived_feedbacks,
            'recent_feedbacks': recent_feedbacks,
            'avg_rating': round(avg_rating, 1),
            'feedback_types': feedback_types
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
    print(f"📂 Public directory: {PUBLIC_DIR}")
    print(f"🔐 Admin directory: {ADMIN_DIR}")
    print(f"🔗 Shared directory: {SHARED_DIR}")
    print(f"🔧 Debug mode: {DEBUG}")
    print(f"\n🌐 Access your app at: http://{HOST}:{PORT}")
    print(f"👥 Public pages: http://{HOST}:{PORT}/")
    print(f"🔐 Admin panel: http://{HOST}:{PORT}/admin")
    
    app.run(host=HOST, port=PORT, debug=DEBUG)
