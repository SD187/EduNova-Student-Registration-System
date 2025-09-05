#!/usr/bin/env python3
"""
Test script to verify routing is working correctly
"""

from app import app

def test_routes():
    """Test all the routes to ensure they're working"""
    with app.test_client() as client:
        print("🧪 Testing Routes...")
        print("=" * 50)
        
        # Test user/public routes
        print("\n📚 Testing User/Public Routes:")
        routes_to_test = [
            ('/', 'Home Page'),
            ('/about', 'About Page'),
            ('/courses', 'Courses Page'),
            ('/timetable', 'Timetable Page'),
            ('/contact', 'Contact Page'),
        ]
        
        for route, description in routes_to_test:
            response = client.get(route)
            if response.status_code == 200:
                print(f"✅ {route} - {description} - Status: {response.status_code}")
            else:
                print(f"❌ {route} - {description} - Status: {response.status_code}")
        
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
        
        print("\n" + "=" * 50)
        print("🎉 Route testing completed!")

if __name__ == "__main__":
    test_routes()
