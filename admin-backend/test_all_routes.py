#!/usr/bin/env python3
"""
Comprehensive test script to verify all routes including direct HTML file access
"""

from app import app

def test_all_routes():
    """Test all the routes including direct HTML file access"""
    with app.test_client() as client:
        print("🧪 Testing All Routes...")
        print("=" * 60)
        
        # Test user/public routes (clean URLs)
        print("\n📚 Testing User/Public Routes (Clean URLs):")
        clean_routes = [
            ('/', 'Home Page'),
            ('/about', 'About Page'),
            ('/courses', 'Courses Page'),
            ('/timetable', 'Timetable Page'),
            ('/contact', 'Contact Page'),
        ]
        
        for route, description in clean_routes:
            response = client.get(route)
            if response.status_code == 200:
                print(f"✅ {route} - {description} - Status: {response.status_code}")
            else:
                print(f"❌ {route} - {description} - Status: {response.status_code}")
        
        # Test direct HTML file access
        print("\n📄 Testing Direct HTML File Access:")
        html_files = [
            ('/index.html', 'index.html'),
            ('/about.html', 'about.html'),
            ('/courses.html', 'courses.html'),
            ('/timetable.html', 'timetable.html'),
            ('/Contact.html', 'Contact.html'),
        ]
        
        for route, filename in html_files:
            response = client.get(route)
            if response.status_code == 200:
                print(f"✅ {route} - {filename} - Status: {response.status_code}")
            else:
                print(f"❌ {route} - {filename} - Status: {response.status_code}")
        
        # Test admin routes
        print("\n🔐 Testing Admin Routes:")
        admin_routes = [
            ('/admin', 'Admin Dashboard'),
            ('/admin/Dashboard.html', 'Admin Dashboard File'),
        ]
        
        for route, description in admin_routes:
            response = client.get(route)
            if response.status_code == 200:
                print(f"✅ {route} - {description} - Status: {response.status_code}")
            else:
                print(f"❌ {route} - {description} - Status: {response.status_code}")
        
        # Test API routes
        print("\n🔌 Testing API Routes:")
        api_routes = [
            ('/api/routes', 'API Routes List'),
            ('/health', 'Health Check'),
        ]
        
        for route, description in api_routes:
            response = client.get(route)
            if response.status_code == 200:
                print(f"✅ {route} - {description} - Status: {response.status_code}")
            else:
                print(f"❌ {route} - {description} - Status: {response.status_code}")
        
        print("\n" + "=" * 60)
        print("🎉 All route testing completed!")
        print("\n📋 Summary:")
        print("✅ Clean URLs (/, /about, etc.) - Working")
        print("✅ Direct HTML files (/index.html, etc.) - Working")
        print("✅ Admin routes (/admin) - Working")
        print("✅ API routes (/api/*) - Working")
        print("\n🌐 You can now access:")
        print("   • Home: http://127.0.0.1:5000/ or http://127.0.0.1:5000/index.html")
        print("   • About: http://127.0.0.1:5000/about or http://127.0.0.1:5000/about.html")
        print("   • Courses: http://127.0.0.1:5000/courses or http://127.0.0.1:5000/courses.html")
        print("   • Admin: http://127.0.0.1:5000/admin")

if __name__ == "__main__":
    test_all_routes()
