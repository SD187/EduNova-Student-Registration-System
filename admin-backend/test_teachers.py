#!/usr/bin/env python3
"""
Test script for Teachers API endpoints
"""

import requests
import json
import sys

# Configuration
BASE_URL = "http://127.0.0.1:5000"
API_BASE = f"{BASE_URL}/api"

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            data = response.json()
            print(f"   Status: {data.get('status')}")
            print(f"   Database: {data.get('database')}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")

def test_admin_login():
    """Test admin login to get JWT token"""
    print("\n🔐 Testing admin login...")
    try:
        login_data = {
            "username": "admin",
            "password": "admin123"
        }
        
        response = requests.post(f"{API_BASE}/admin/login", json=login_data)
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            print("✅ Admin login successful")
            return token
        else:
            print(f"❌ Admin login failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Admin login error: {e}")
        return None

def test_teachers_endpoints(token):
    """Test all teachers endpoints"""
    if not token:
        print("❌ No token available, skipping teachers tests")
        return
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    print("\n👨‍🏫 Testing Teachers API endpoints...")
    
    # Test GET /api/teachers
    print("\n1. Testing GET /api/teachers...")
    try:
        response = requests.get(f"{API_BASE}/teachers", headers=headers)
        if response.status_code == 200:
            data = response.json()
            teachers = data.get('teachers', [])
            print(f"✅ GET teachers successful - Found {len(teachers)} teachers")
            for teacher in teachers[:3]:  # Show first 3
                print(f"   - {teacher.get('name')} ({teacher.get('subject')})")
        else:
            print(f"❌ GET teachers failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ GET teachers error: {e}")
    
    # Test POST /api/teachers
    print("\n2. Testing POST /api/teachers...")
    try:
        new_teacher = {
            "name": "Test Teacher",
            "subject": "mathematics",
            "contact": "9876543210",
            "email": "test.teacher@edunova.com"
        }
        
        response = requests.post(f"{API_BASE}/teachers", json=new_teacher, headers=headers)
        if response.status_code == 201:
            data = response.json()
            teacher_id = data.get('teacher_id')
            print(f"✅ POST teacher successful - ID: {teacher_id}")
            
            # Test GET specific teacher
            print("\n3. Testing GET /api/teachers/{id}...")
            response = requests.get(f"{API_BASE}/teachers/{teacher_id}", headers=headers)
            if response.status_code == 200:
                data = response.json()
                teacher = data.get('teacher')
                print(f"✅ GET specific teacher successful - {teacher.get('name')}")
            else:
                print(f"❌ GET specific teacher failed: {response.status_code}")
            
            # Test PUT /api/teachers/{id}
            print("\n4. Testing PUT /api/teachers/{id}...")
            update_data = {
                "name": "Updated Test Teacher",
                "subject": "science"
            }
            
            response = requests.put(f"{API_BASE}/teachers/{teacher_id}", json=update_data, headers=headers)
            if response.status_code == 200:
                print("✅ PUT teacher successful")
            else:
                print(f"❌ PUT teacher failed: {response.status_code}")
            
            # Test DELETE /api/teachers/{id}
            print("\n5. Testing DELETE /api/teachers/{id}...")
            response = requests.delete(f"{API_BASE}/teachers/{teacher_id}", headers=headers)
            if response.status_code == 200:
                print("✅ DELETE teacher successful")
            else:
                print(f"❌ DELETE teacher failed: {response.status_code}")
                
        else:
            print(f"❌ POST teacher failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ POST teacher error: {e}")

def test_dashboard_stats(token):
    """Test dashboard statistics endpoint"""
    if not token:
        print("❌ No token available, skipping dashboard test")
        return
    
    print("\n📊 Testing Dashboard Statistics...")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(f"{API_BASE}/dashboard/stats", headers=headers)
        if response.status_code == 200:
            data = response.json()
            stats = data.get('stats', {})
            print("✅ Dashboard stats successful")
            print(f"   Total Students: {stats.get('total_students', 0)}")
            print(f"   Total Courses: {stats.get('total_courses', 0)}")
            print(f"   Total Teachers: {stats.get('total_teachers', 0)}")
            print(f"   Total Admins: {stats.get('total_admins', 0)}")
        else:
            print(f"❌ Dashboard stats failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Dashboard stats error: {e}")

def main():
    """Main test function"""
    print("🚀 Starting Teachers API Tests...")
    print("=" * 50)
    
    # Test health check
    test_health_check()
    
    # Test admin login
    token = test_admin_login()
    
    # Test teachers endpoints
    test_teachers_endpoints(token)
    
    # Test dashboard stats
    test_dashboard_stats(token)
    
    print("\n" + "=" * 50)
    print("🏁 Teachers API Tests completed!")

if __name__ == "__main__":
    main()
