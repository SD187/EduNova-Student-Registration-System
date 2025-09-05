#!/usr/bin/env python3
"""
EduNova Admin Backend - Simplified Server
This version bypasses MongoDB connection issues and focuses on serving the frontend files.
"""

from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import os

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-super-secret-key-change-this-in-production'

# Enable CORS
CORS(app)

# Get the parent directory (where frontend files are located)
FRONTEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Define directory paths for the new structure
PUBLIC_DIR = os.path.join(FRONTEND_DIR, 'public')
ADMIN_DIR = os.path.join(FRONTEND_DIR, 'admin')
SHARED_DIR = os.path.join(FRONTEND_DIR, 'shared')

print(f"🚀 Starting EduNova Admin Backend (Simplified)...")
print(f"📍 Server: http://127.0.0.1:5000")
print(f"📁 Frontend directory: {FRONTEND_DIR}")
print(f"📂 Public directory: {PUBLIC_DIR}")
print(f"🔐 Admin directory: {ADMIN_DIR}")
print(f"🔗 Shared directory: {SHARED_DIR}")

# Verify directories exist
for name, path in [("PUBLIC", PUBLIC_DIR), ("ADMIN", ADMIN_DIR), ("SHARED", SHARED_DIR)]:
    if os.path.exists(path):
        print(f"✅ {name} directory exists")
    else:
        print(f"❌ {name} directory missing: {path}")

# FRONTEND SERVING ROUTES
@app.route('/')
def serve_index():
    """Serve the public home page"""
    return send_from_directory(PUBLIC_DIR, 'index.html')

@app.route('/admin')
@app.route('/admin/')
def serve_admin_dashboard():
    """Serve the admin dashboard"""
    return send_from_directory(ADMIN_DIR, 'Dashboard.html')

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

# Legacy route handler for backward compatibility
@app.route('/<path:filename>')
def serve_legacy_files(filename):
    """Legacy route handler for backward compatibility"""
    # Handle HTML files
    if filename.endswith('.html'):
        if filename in ['Dashboard.html', 'adminlogin.html', 'adminfront.html', 'mstudent.html', 'mteachers.html', 'Mcources.html', 'mtime.html', 'settings.html', 'fpassword.html', 'logout.html', 'createaccount.html']:
            return send_from_directory(ADMIN_DIR, filename)
        elif filename in ['index.html', 'about.html', 'courses.html', 'timetable.html', 'Contact.html']:
            return send_from_directory(PUBLIC_DIR, filename)
        else:
            # Try to serve from admin first, then public
            try:
                return send_from_directory(ADMIN_DIR, filename)
            except:
                try:
                    return send_from_directory(PUBLIC_DIR, filename)
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
                return send_from_directory(os.path.join(ADMIN_DIR, 'css'), filename[5:])
            except:
                try:
                    return send_from_directory(os.path.join(PUBLIC_DIR, 'css'), filename[5:])
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

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'EduNova Admin Backend is running',
        'frontend_dir': FRONTEND_DIR,
        'public_dir': PUBLIC_DIR,
        'admin_dir': ADMIN_DIR,
        'shared_dir': SHARED_DIR
    })

if __name__ == '__main__':
    print(f"\n🌐 Access your app at: http://127.0.0.1:5000")
    print(f"👥 Public pages: http://127.0.0.1:5000/")
    print(f"🔐 Admin panel: http://127.0.0.1:5000/admin")
    print(f"📊 Health check: http://127.0.0.1:5000/health")
    print(f"\n🎯 Navigation Test:")
    print(f"   - Home: http://127.0.0.1:5000/")
    print(f"   - About: http://127.0.0.1:5000/public/about.html")
    print(f"   - Courses: http://127.0.0.1:5000/public/courses.html")
    print(f"   - Admin: http://127.0.0.1:5000/admin")
    
    try:
        app.run(debug=True, host='127.0.0.1', port=5000)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        print("🔄 Try running on a different port...")
        app.run(debug=True, host='127.0.0.1', port=8000)
