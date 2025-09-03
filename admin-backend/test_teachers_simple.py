#!/usr/bin/env python3
"""
Simple test script for Teachers API
Run this after starting the Flask server
"""

import requests
import json

def test_teachers_api():
    """Simple test of teachers API"""
    
    base_url = "http://127.0.0.1:5000/api"
    
    print("🧪 Testing Teachers API...")
    
    # 1. Login as admin
    print("\n1. Logging in as admin...")
    login_data = {"username": "admin", "password": "admin123"}
    
    try:
        response = requests.post(f"{base_url}/admin/login", json=login_data)
        if response.status_code == 200:
            token = response.json()['token']
            print("✅ Login successful")
        else:
            print(f"❌ Login failed: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Login error: {e}")
        return
    
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    # 2. Get all teachers
    print("\n2. Getting all teachers...")
    try:
        response = requests.get(f"{base_url}/teachers", headers=headers)
        if response.status_code == 200:
            teachers = response.json()['teachers']
            print(f"✅ Found {len(teachers)} teachers")
            for teacher in teachers:
                print(f"   - {teacher['name']} ({teacher['subject']})")
        else:
            print(f"❌ Failed to get teachers: {response.status_code}")
    except Exception as e:
        print(f"❌ Error getting teachers: {e}")
    
    # 3. Create a new teacher
    print("\n3. Creating new teacher...")
    new_teacher = {
        "name": "John Doe",
        "subject": "history",
        "contact": "5551234567",
        "email": "john.doe@edunova.com"
    }
    
    try:
        response = requests.post(f"{base_url}/teachers", json=new_teacher, headers=headers)
        if response.status_code == 201:
            teacher_id = response.json()['teacher_id']
            print(f"✅ Teacher created with ID: {teacher_id}")
        else:
            print(f"❌ Failed to create teacher: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error creating teacher: {e}")
    
    print("\n🎉 Teachers API test completed!")

if __name__ == "__main__":
    test_teachers_api()
