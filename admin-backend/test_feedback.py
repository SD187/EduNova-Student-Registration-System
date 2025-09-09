#!/usr/bin/env python3
"""
Test script for the feedback system
"""

import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "http://127.0.0.1:5000"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

def test_feedback_system():
    """Test the complete feedback system"""
    print("🧪 Testing EduNova Feedback System")
    print("=" * 50)
    
    # Test 1: Create feedback (public endpoint)
    print("\n1. Testing feedback creation...")
    feedback_data = {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "message": "Great course! The teachers are very helpful and the material is well-structured.",
        "rating": 5,
        "feedback_type": "course",
        "is_anonymous": False
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/feedback", json=feedback_data)
        if response.status_code == 201:
            feedback_id = response.json().get('feedback_id')
            print(f"✅ Feedback created successfully! ID: {feedback_id}")
        else:
            print(f"❌ Failed to create feedback: {response.status_code} - {response.text}")
            return
    except Exception as e:
        print(f"❌ Error creating feedback: {e}")
        return
    
    # Test 2: Get public feedbacks
    print("\n2. Testing public feedback retrieval...")
    try:
        response = requests.get(f"{BASE_URL}/api/feedback?limit=5")
        if response.status_code == 200:
            feedbacks = response.json().get('feedbacks', [])
            print(f"✅ Retrieved {len(feedbacks)} public feedbacks")
        else:
            print(f"❌ Failed to get public feedbacks: {response.status_code}")
    except Exception as e:
        print(f"❌ Error getting public feedbacks: {e}")
    
    # Test 3: Admin login
    print("\n3. Testing admin login...")
    login_data = {
        "username": ADMIN_USERNAME,
        "password": ADMIN_PASSWORD
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/admin/login", json=login_data)
        if response.status_code == 200:
            token = response.json().get('token')
            print("✅ Admin login successful!")
        else:
            print(f"❌ Admin login failed: {response.status_code} - {response.text}")
            return
    except Exception as e:
        print(f"❌ Error during admin login: {e}")
        return
    
    # Test 4: Get all feedbacks (admin)
    print("\n4. Testing admin feedback retrieval...")
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/api/admin/feedback", headers=headers)
        if response.status_code == 200:
            data = response.json()
            feedbacks = data.get('feedbacks', [])
            total = data.get('total', 0)
            print(f"✅ Retrieved {len(feedbacks)} feedbacks (Total: {total})")
        else:
            print(f"❌ Failed to get admin feedbacks: {response.status_code}")
    except Exception as e:
        print(f"❌ Error getting admin feedbacks: {e}")
    
    # Test 5: Get feedback statistics
    print("\n5. Testing feedback statistics...")
    try:
        response = requests.get(f"{BASE_URL}/api/admin/feedback/stats", headers=headers)
        if response.status_code == 200:
            stats = response.json().get('stats', {})
            print(f"✅ Feedback stats retrieved:")
            print(f"   - Total: {stats.get('total_feedbacks', 0)}")
            print(f"   - Pending: {stats.get('pending_feedbacks', 0)}")
            print(f"   - Reviewed: {stats.get('reviewed_feedbacks', 0)}")
            print(f"   - Resolved: {stats.get('resolved_feedbacks', 0)}")
            print(f"   - Average Rating: {stats.get('avg_rating', 0)}")
        else:
            print(f"❌ Failed to get feedback stats: {response.status_code}")
    except Exception as e:
        print(f"❌ Error getting feedback stats: {e}")
    
    # Test 6: Update feedback status
    if 'feedback_id' in locals():
        print(f"\n6. Testing feedback status update...")
        update_data = {
            "status": "reviewed",
            "admin_response": "Thank you for your feedback! We're glad you enjoyed the course."
        }
        
        try:
            response = requests.put(f"{BASE_URL}/api/admin/feedback/{feedback_id}", 
                                  json=update_data, headers=headers)
            if response.status_code == 200:
                print("✅ Feedback status updated successfully!")
            else:
                print(f"❌ Failed to update feedback status: {response.status_code}")
        except Exception as e:
            print(f"❌ Error updating feedback status: {e}")
    
    # Test 7: Create multiple feedbacks for testing
    print("\n7. Creating additional test feedbacks...")
    test_feedbacks = [
        {
            "name": "Jane Smith",
            "email": "jane.smith@example.com",
            "message": "The facilities are excellent and the learning environment is very conducive.",
            "rating": 4,
            "feedback_type": "facility",
            "is_anonymous": False
        },
        {
            "name": "Anonymous Student",
            "email": "student@example.com",
            "message": "I have some suggestions for improving the course curriculum.",
            "rating": 3,
            "feedback_type": "suggestion",
            "is_anonymous": True
        },
        {
            "name": "Mike Johnson",
            "email": "mike.johnson@example.com",
            "message": "The teacher was very knowledgeable and patient with students.",
            "rating": 5,
            "feedback_type": "teacher",
            "is_anonymous": False
        }
    ]
    
    created_count = 0
    for feedback in test_feedbacks:
        try:
            response = requests.post(f"{BASE_URL}/api/feedback", json=feedback)
            if response.status_code == 201:
                created_count += 1
        except Exception as e:
            print(f"❌ Error creating test feedback: {e}")
    
    print(f"✅ Created {created_count} additional test feedbacks")
    
    # Test 8: Test filtering
    print("\n8. Testing feedback filtering...")
    try:
        # Filter by status
        response = requests.get(f"{BASE_URL}/api/admin/feedback?status=pending", headers=headers)
        if response.status_code == 200:
            data = response.json()
            pending_count = len(data.get('feedbacks', []))
            print(f"✅ Found {pending_count} pending feedbacks")
        
        # Filter by type
        response = requests.get(f"{BASE_URL}/api/admin/feedback?type=course", headers=headers)
        if response.status_code == 200:
            data = response.json()
            course_count = len(data.get('feedbacks', []))
            print(f"✅ Found {course_count} course-related feedbacks")
            
    except Exception as e:
        print(f"❌ Error testing filters: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Feedback system testing completed!")
    print("\nTo test the admin interface:")
    print(f"1. Start the server: python app.py")
    print(f"2. Open: http://127.0.0.1:5000/admin/mfeedback.html")
    print(f"3. Login with: {ADMIN_USERNAME} / {ADMIN_PASSWORD}")
    print("\nTo test the public interface:")
    print(f"1. Open: http://127.0.0.1:5000/contact")

if __name__ == "__main__":
    test_feedback_system()
