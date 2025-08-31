// Toggle password visibility
function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleIcon.classList.remove('fa-eye');
      toggleIcon.classList.add('fa-eye-slash');
    } else {
      passwordInput.type = 'password';
      toggleIcon.classList.remove('fa-eye-slash');
      toggleIcon.classList.add('fa-eye');
    }
  }
  
  // Handle form submission
  document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Basic validation
        if (!username.trim() || !password.trim()) {
          alert('Please fill in all fields');
          return;
        }
        
        // Add your login logic here
        console.log('Login attempt:', { username, password });
        
        // Example: Simple validation (replace with real authentication)
        if (username === 'admin' && password === 'password') {
          alert('Login successful! Redirecting to dashboard...');
          // Redirect to dashboard
          window.location.href = 'dashboard.html';
        } else {
          alert('Invalid username or password');
        }
      });
    }
  });
  
  // Admin login function (if needed for other pages)
  function adminLogin() {
    alert("Redirecting to Admin Login...");
    window.location.href = "adminLogin.html";
  }
  
  // Create account function (if needed for other pages)
  function createAccount() {
    alert("Redirecting to Create Account...");
    window.location.href = "signup.html";
  }
  
  // Handle forgot password
  function handleForgotPassword() {
    alert('Forgot password functionality would be implemented here');
  }


  // Login Navigation - Add this to your adminlogin.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    // Handle form submission - navigate to Dashboard.html
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent form from submitting normally
        
        // Navigate to dashboard
        window.location.href = 'Dashboard.html';
    });
});