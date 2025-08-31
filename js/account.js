function togglePassword(inputId) {
  const passwordInput = document.getElementById(inputId);
  let toggleIcon;
  
  if (inputId === 'password') {
    toggleIcon = document.querySelector('.toggle-password');
  } else if (inputId === 'confirmPassword') {
    toggleIcon = document.querySelector('.toggle-confirm-password');
  }
  
  if (passwordInput && toggleIcon) {
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
}

// HARDCODED SECURITY KEY - Only admin should know this
const ADMIN_SECURITY_KEY = "ADMIN2025SECURE"; // Change this to your desired security key

// Form validation functions
function validateUsername(username) {
  if (username.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters long' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
  }
  return { valid: true, message: 'Valid username' };
}

function validateSecurityKey(securityKey) {
  if (securityKey !== ADMIN_SECURITY_KEY) {
    return { valid: false, message: 'Invalid security key. Access denied.' };
  }
  return { valid: true, message: 'Security key verified' };
}

function validatePassword(password) {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return { valid: false, message: 'Password must contain uppercase, lowercase, and number' };
  }
  return { valid: true, message: 'Strong password' };
}

function validateConfirmPassword(password, confirmPassword) {
  if (password !== confirmPassword) {
    return { valid: false, message: 'Passwords do not match' };
  }
  return { valid: true, message: 'Passwords match' };
}

// Show validation message
function showValidation(inputGroup, validation) {
  const input = inputGroup.querySelector('input');
  let messageElement = inputGroup.querySelector('.error-message, .success-message');
  
  // Remove existing message
  if (messageElement) {
    messageElement.remove();
  }
  
  // Remove existing classes
  inputGroup.classList.remove('error', 'success');
  
  // Create new message element
  messageElement = document.createElement('div');
  messageElement.textContent = validation.message;
  
  if (validation.valid) {
    inputGroup.classList.add('success');
    messageElement.className = 'success-message';
  } else {
    inputGroup.classList.add('error');
    messageElement.className = 'error-message';
  }
  
  messageElement.style.display = 'block';
  inputGroup.appendChild(messageElement);
}

// Real-time validation
function setupRealTimeValidation() {
  const usernameInput = document.getElementById('username');
  const securityKeyInput = document.getElementById('securityKey');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  
  if (usernameInput) {
    usernameInput.addEventListener('blur', function() {
      const validation = validateUsername(this.value);
      showValidation(this.closest('.input-group'), validation);
    });
  }
  
  if (securityKeyInput) {
    securityKeyInput.addEventListener('blur', function() {
      const validation = validateSecurityKey(this.value);
      showValidation(this.closest('.input-group'), validation);
    });
    
    // Additional security: Clear the input after validation fails
    securityKeyInput.addEventListener('input', function() {
      // Optional: Add a delay before validating to prevent brute force
      clearTimeout(this.validationTimeout);
      this.validationTimeout = setTimeout(() => {
        const validation = validateSecurityKey(this.value);
        if (!validation.valid && this.value.length >= 6) {
          showValidation(this.closest('.input-group'), validation);
          // Clear the input to prevent visible security key attempts
          setTimeout(() => {
            this.value = '';
          }, 1500);
        }
      }, 500);
    });
  }
  
  if (passwordInput) {
    passwordInput.addEventListener('blur', function() {
      const validation = validatePassword(this.value);
      showValidation(this.closest('.input-group'), validation);
      
      // Also validate confirm password if it has a value
      const confirmPassword = confirmPasswordInput?.value;
      if (confirmPassword) {
        const confirmValidation = validateConfirmPassword(this.value, confirmPassword);
        showValidation(confirmPasswordInput.closest('.input-group'), confirmValidation);
      }
    });
  }
  
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('blur', function() {
      const password = passwordInput?.value;
      const validation = validateConfirmPassword(password, this.value);
      showValidation(this.closest('.input-group'), validation);
    });
  }
}

// Handle form submission
function handleFormSubmission() {
  const signupForm = document.getElementById('signupForm');
  
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        username: document.getElementById('username').value.trim(),
        securityKey: document.getElementById('securityKey').value.trim(),
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value
      };
      
      // Validate all fields
      const validations = {
        username: validateUsername(formData.username),
        securityKey: validateSecurityKey(formData.securityKey),
        password: validatePassword(formData.password),
        confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword)
      };
      
      // Show validation messages
      Object.keys(validations).forEach(field => {
        const inputGroup = document.getElementById(field).closest('.input-group');
        showValidation(inputGroup, validations[field]);
      });
      
      // Check if all validations passed
      const allValid = Object.values(validations).every(v => v.valid);
      
      if (allValid) {
        // Show loading state
        const submitButton = document.querySelector('.register-btn');
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        // Simulate account creation (replace with actual API call)
        setTimeout(() => {
          console.log('Creating admin account:', {
            username: formData.username,
            // Don't log the security key for security reasons
            securityKeyVerified: true,
            passwordLength: formData.password.length
          });
          
          // Remove loading state
          submitButton.classList.remove('loading');
          submitButton.disabled = false;
          
          // Clear the security key from memory after successful creation
          document.getElementById('securityKey').value = '';
          
          // Show success message
          alert('Admin account created successfully! Redirecting to login page...');
          
          // Redirect to login page
          window.location.href = 'adminLogin.html';
        }, 2000);
      } else {
        // Scroll to first error
        const firstError = document.querySelector('.input-group.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.querySelector('input').focus();
        }
        
        // Clear security key on validation failure for security
        document.getElementById('securityKey').value = '';
      }
    });
  }
}

// Sign in redirect function
function signIn() {
  window.location.href = 'adminLogin.html';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  setupRealTimeValidation();
  handleFormSubmission();
  
  // Add some visual feedback for form interactions
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.closest('.input-group').style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
      this.closest('.input-group').style.transform = 'scale(1)';
    });
  });
  
  // Add security warning message
  console.warn('Admin account creation is protected by security key validation.');
});