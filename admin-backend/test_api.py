import requests
import json

# Base URL for the API
BASE_URL = "http://127.0.0.1:5000/api"

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing health check...")
    try:
        response = requests.get("http://127.0.0.1:5000/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Status: {response.json()['status']}")
            print(f"   Database: {response.json()['database']}")
        else:
            print("❌ Health check failed")
            print(f"   Status code: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {str(e)}")

def test_admin_login():
    """Test admin login with default credentials"""
    print("\n🔐 Testing admin login...")
    try:
        login_data = {
            "username": "admin",
            "password": "admin123"
        }
        response = requests.post(f"{BASE_URL}/admin/login", json=login_data)
        
        if response.status_code == 200:
            print("✅ Admin login successful")
            token = response.json()['token']
            print(f"   Token received: {token[:20]}...")
            return token
        else:
            print("❌ Admin login failed")
            print(f"   Status code: {response.status_code}")
            print(f"   Message: {response.json().get('message', 'Unknown error')}")
            return None
    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        return None

def test_get_students(token):
    """Test getting students list"""
    print("\n👥 Testing get students...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/students", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Get students successful")
            print(f"   Total students: {data['total']}")
            print(f"   Page: {data['page']}")
            print(f"   Students returned: {len(data['students'])}")
        else:
            print("❌ Get students failed")
            print(f"   Status code: {response.status_code}")
            print(f"   Message: {response.json().get('message', 'Unknown error')}")
    except Exception as e:
        print(f"❌ Get students error: {str(e)}")

def test_get_courses(token):
    """Test getting courses list"""
    print("\n📚 Testing get courses...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/courses", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Get courses successful")
            print(f"   Total courses: {len(data['courses'])}")
            for course in data['courses']:
                print(f"   - {course['name']} ({course['code']})")
        else:
            print("❌ Get courses failed")
            print(f"   Status code: {response.status_code}")
            print(f"   Message: {response.json().get('message', 'Unknown error')}")
    except Exception as e:
        print(f"❌ Get courses error: {str(e)}")

def test_dashboard_stats(token):
    """Test dashboard statistics"""
    print("\n📊 Testing dashboard stats...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/dashboard/stats", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Dashboard stats successful")
            stats = data['stats']
            print(f"   Total students: {stats['total_students']}")
            print(f"   Total courses: {stats['total_courses']}")
            print(f"   Pending registrations: {stats['pending_registrations']}")
            print(f"   Recent registrations: {stats['recent_registrations']}")
        else:
            print("❌ Dashboard stats failed")
            print(f"   Status code: {response.status_code}")
            print(f"   Message: {response.json().get('message', 'Unknown error')}")
    except Exception as e:
        print(f"❌ Dashboard stats error: {str(e)}")

def test_create_student(token):
    """Test creating a new student"""
    print("\n➕ Testing create student...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        student_data = {
            "full_name": "Test Student",
            "email": "test.student@example.com",
            "student_id": "STU001",
            "course": "Computer Science",
            "phone": "+1234567890",
            "address": "123 Test Street",
            "date_of_birth": "2000-01-01",
            "status": "active"
        }
        response = requests.post(f"{BASE_URL}/students", json=student_data, headers=headers)
        
        if response.status_code == 201:
            print("✅ Create student successful")
            data = response.json()
            print(f"   Student ID: {data['student_id']}")
            return data['student_id']
        else:
            print("❌ Create student failed")
            print(f"   Status code: {response.status_code}")
            print(f"   Message: {response.json().get('message', 'Unknown error')}")
            return None
    except Exception as e:
        print(f"❌ Create student error: {str(e)}")
        return None

def test_create_course(token):
    """Test creating a new course"""
    print("\n➕ Testing create course...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        course_data = {
            "name": "Test Course",
            "code": "TEST101",
            "description": "A test course for API testing",
            "duration": "6 months",
            "fee": 2500,
            "capacity": 30,
            "status": "active"
        }
        response = requests.post(f"{BASE_URL}/courses", json=course_data, headers=headers)
        
        if response.status_code == 201:
            print("✅ Create course successful")
            data = response.json()
            print(f"   Course ID: {data['course_id']}")
            return data['course_id']
        else:
            print("❌ Create course failed")
            print(f"   Status code: {response.status_code}")
            print(f"   Message: {response.json().get('message', 'Unknown error')}")
            return None
    except Exception as e:
        print(f"❌ Create course error: {str(e)}")
        return None

def run_all_tests():
    """Run all API tests"""
    print("🚀 Starting API Tests...")
    print("=" * 50)
    
    # Test health check
    test_health_check()
    
    # Test admin login
    token = test_admin_login()
    
    if token:
        # Test protected endpoints
        test_get_students(token)
        test_get_courses(token)
        test_dashboard_stats(token)
        
        # Test creation endpoints
        test_create_student(token)
        test_create_course(token)
        
        print("\n" + "=" * 50)
        print("🎉 All tests completed!")
    else:
        print("\n❌ Cannot proceed with tests - login failed")

if __name__ == "__main__":
    run_all_tests()
