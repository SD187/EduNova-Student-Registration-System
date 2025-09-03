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
            return True
        else:
            print("❌ Health check failed")
            print(f"   Status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {str(e)}")
        return False

def test_admin_register_without_security_key():
    """Test admin registration without security key (should fail)"""
    print("\n🔐 Testing admin registration without security key...")
    try:
        account_data = {
            "username": "testadmin",
            "password": "TestPass123",
            "full_name": "Test Admin",
            "role": "admin"
        }
        
        response = requests.post(f"{BASE_URL}/admin/register", json=account_data)
        
        if response.status_code == 400:
            print("✅ Correctly rejected registration without security key")
            print(f"   Message: {response.json().get('message', 'Unknown error')}")
            return True
        else:
            print("❌ Should have rejected registration without security key")
            print(f"   Status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Test error: {str(e)}")
        return False

def test_admin_register_with_wrong_security_key():
    """Test admin registration with wrong security key (should fail)"""
    print("\n🔐 Testing admin registration with wrong security key...")
    try:
        account_data = {
            "username": "testadmin",
            "password": "TestPass123",
            "full_name": "Test Admin",
            "security_key": "WRONG_KEY",
            "role": "admin"
        }
        
        response = requests.post(f"{BASE_URL}/admin/register", json=account_data)
        
        if response.status_code == 403:
            print("✅ Correctly rejected registration with wrong security key")
            print(f"   Message: {response.json().get('message', 'Unknown error')}")
            return True
        else:
            print("❌ Should have rejected registration with wrong security key")
            print(f"   Status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Test error: {str(e)}")
        return False

def test_admin_register_with_correct_security_key():
    """Test admin registration with correct security key (should succeed)"""
    print("\n🔐 Testing admin registration with correct security key...")
    try:
        account_data = {
            "username": "testadmin",
            "password": "TestPass123",
            "full_name": "Test Admin",
            "security_key": "ADMIN2025SECURE",
            "role": "admin"
        }
        
        response = requests.post(f"{BASE_URL}/admin/register", json=account_data)
        
        if response.status_code == 201:
            print("✅ Successfully created admin account with correct security key")
            data = response.json()
            print(f"   Admin ID: {data.get('admin_id', 'N/A')}")
            print(f"   Message: {data.get('message', 'N/A')}")
            return True
        else:
            print("❌ Failed to create admin account with correct security key")
            print(f"   Status code: {response.status_code}")
            print(f"   Message: {response.json().get('message', 'Unknown error')}")
            return False
    except Exception as e:
        print(f"❌ Test error: {str(e)}")
        return False

def test_admin_login_with_new_account():
    """Test admin login with the newly created account"""
    print("\n🔐 Testing admin login with new account...")
    try:
        login_data = {
            "username": "testadmin",
            "password": "TestPass123"
        }
        
        response = requests.post(f"{BASE_URL}/admin/login", json=login_data)
        
        if response.status_code == 200:
            print("✅ Successfully logged in with new admin account")
            data = response.json()
            print(f"   Token received: {data.get('token', 'N/A')[:20]}...")
            print(f"   Admin username: {data.get('admin', {}).get('username', 'N/A')}")
            return True
        else:
            print("❌ Failed to login with new admin account")
            print(f"   Status code: {response.status_code}")
            print(f"   Message: {response.json().get('message', 'Unknown error')}")
            return False
    except Exception as e:
        print(f"❌ Test error: {str(e)}")
        return False

def run_createaccount_tests():
    """Run all create account tests"""
    print("🚀 Starting Create Account API Tests...")
    print("=" * 60)
    
    # Test health check
    if not test_health_check():
        print("\n❌ Cannot proceed - backend is not running")
        return
    
    # Test registration without security key
    test_admin_register_without_security_key()
    
    # Test registration with wrong security key
    test_admin_register_with_wrong_security_key()
    
    # Test registration with correct security key
    if test_admin_register_with_correct_security_key():
        # Test login with the new account
        test_admin_login_with_new_account()
    
    print("\n" + "=" * 60)
    print("🎉 Create Account tests completed!")

if __name__ == "__main__":
    run_createaccount_tests()
