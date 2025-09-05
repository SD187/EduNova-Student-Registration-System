#!/usr/bin/env python3
"""
Test script to verify navigation links work correctly
"""

from app import app

def test_navigation():
    """Test that all navigation links work correctly"""
    with app.test_client() as client:
        print("🧪 Testing Navigation Links...")
        print("=" * 50)
        
        # Test admin dashboard access
        print("\n🔐 Testing Admin Dashboard Access:")
        response = client.get('/admin')
        if response.status_code == 200:
            print(f"✅ Admin Dashboard: {response.status_code}")
        else:
            print(f"❌ Admin Dashboard: {response.status_code}")
        
        # Test all user page navigation links
        print("\n📚 Testing User Page Navigation:")
        navigation_links = [
            ('/', 'Home Page'),
            ('/about', 'About Us'),
            ('/courses', 'Courses'),
            ('/timetable', 'Time Table'),
            ('/contact', 'Contact'),
        ]
        
        for route, description in navigation_links:
            response = client.get(route)
            if response.status_code == 200:
                print(f"✅ {route} - {description} - Status: {response.status_code}")
            else:
                print(f"❌ {route} - {description} - Status: {response.status_code}")
        
        print("\n" + "=" * 50)
        print("🎉 Navigation testing completed!")
        print("\n📋 Instructions:")
        print("1. Open your browser and go to: http://127.0.0.1:5000/admin")
        print("2. You should see the admin dashboard")
        print("3. Click on the navigation links in the top bar:")
        print("   • Home - should take you to http://127.0.0.1:5000/")
        print("   • About Us - should take you to http://127.0.0.1:5000/about")
        print("   • Courses - should take you to http://127.0.0.1:5000/courses")
        print("   • Time Table - should take you to http://127.0.0.1:5000/timetable")
        print("   • Contact - should take you to http://127.0.0.1:5000/contact")
        print("\n🔧 If navigation doesn't work:")
        print("   • Check browser console for JavaScript errors")
        print("   • Make sure you're logged in as admin")
        print("   • Try refreshing the page")

if __name__ == "__main__":
    test_navigation()
