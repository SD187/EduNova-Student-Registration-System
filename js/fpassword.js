// DOM Elements
const form = document.getElementById('forgotPasswordForm');
const emailInput = document.getElementById('email');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const submitBtn = document.getElementById('submitBtn');
const statusMessage = document.getElementById('statusMessage');
const toggleNewPassword = document.getElementById('toggleNewPassword');
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

// Application State
let appState = {
    isSubmitting: false,
    validationErrors: {},
    passwordVisible: {
        new: false,
        confirm: false
    }
};

// Utility Functions
function showMessage(message, type = 'success') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
    statusMessage.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        statusMessage.classList.remove('show');
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 300);
    }, 5000);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // Password should be at least 8 characters with mixed case, numbers, and special chars
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
        isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
        minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar
    };
}

function getPasswordStrength(password) {
    const validation = validatePassword(password);
    let strength = 0;
    
    if (validation.minLength) strength++;
    if (validation.hasUpperCase) strength++;
    if (validation.hasLowerCase) strength++;
    if (validation.hasNumbers) strength++;
    if (validation.hasSpecialChar) strength++;
    
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
}

// Form Validation
function validateForm() {
    const email = emailInput.value.trim();
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    appState.validationErrors = {};
    
    // Email validation
    if (!email) {
        appState.validationErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
        appState.validationErrors.email = 'Please enter a valid email address';
    }
    
    // New password validation
    if (!newPassword) {
        appState.validationErrors.newPassword = 'New password is required';
    } else {
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            appState.validationErrors.newPassword = 'Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters';
        }
    }
    
    // Confirm password validation
    if (!confirmPassword) {
        appState.validationErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
        appState.validationErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Update input styles based on validation
    updateInputValidation();
    
    return Object.keys(appState.validationErrors).length === 0;
}

function updateInputValidation() {
    // Email validation styling
    if (emailInput.value.trim()) {
        if (appState.validationErrors.email) {
            emailInput.classList.add('invalid');
            emailInput.classList.remove('valid');
        } else {
            emailInput.classList.add('valid');
            emailInput.classList.remove('invalid');
        }
    } else {
        emailInput.classList.remove('valid', 'invalid');
    }
    
    // New password validation styling
    if (newPasswordInput.value) {
        if (appState.validationErrors.newPassword) {
            newPasswordInput.classList.add('invalid');
            newPasswordInput.classList.remove('valid');
        } else {
            newPasswordInput.classList.add('valid');
            newPasswordInput.classList.remove('invalid');
        }
    } else {
        newPasswordInput.classList.remove('valid', 'invalid');
    }
    
    // Confirm password validation styling
    if (confirmPasswordInput.value) {
        if (appState.validationErrors.confirmPassword) {
            confirmPasswordInput.classList.add('invalid');
            confirmPasswordInput.classList.remove('valid');
        } else {
            confirmPasswordInput.classList.add('valid');
            confirmPasswordInput.classList.remove('invalid');
        }
    } else {
        confirmPasswordInput.classList.remove('valid', 'invalid');
    }
}

// Password Toggle Functions
function togglePasswordVisibility(inputElement, iconElement, passwordType) {
    const isVisible = appState.passwordVisible[passwordType];
    
    if (isVisible) {
        inputElement.type = 'password';
        iconElement.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
        `;
        appState.passwordVisible[passwordType] = false;
    } else {
        inputElement.type = 'text';
        iconElement.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
        `;
        appState.passwordVisible[passwordType] = true;
    }
}

// Event Handlers
function handleEmailInput(event) {
    const email = event.target.value.trim();
    
    // Real-time validation
    if (email && validateEmail(email)) {
        emailInput.classList.add('valid');
        emailInput.classList.remove('invalid');
        delete appState.validationErrors.email;
    } else if (email) {
        emailInput.classList.add('invalid');
        emailInput.classList.remove('valid');
        appState.validationErrors.email = 'Invalid email format';
    } else {
        emailInput.classList.remove('valid', 'invalid');
        delete appState.validationErrors.email;
    }
}

function handlePasswordInput(event) {
    const password = event.target.value;
    const isNewPassword = event.target.id === 'newPassword';
    
    if (isNewPassword) {
        // Validate new password
        if (password) {
            const validation = validatePassword(password);
            if (validation.isValid) {
                newPasswordInput.classList.add('valid');
                newPasswordInput.classList.remove('invalid');
                delete appState.validationErrors.newPassword;
            } else {
                newPasswordInput.classList.add('invalid');
                newPasswordInput.classList.remove('valid');
                appState.validationErrors.newPassword = 'Password requirements not met';
            }
        } else {
            newPasswordInput.classList.remove('valid', 'invalid');
            delete appState.validationErrors.newPassword;
        }
        
        // Re-validate confirm password if it has content
        if (confirmPasswordInput.value) {
            handlePasswordInput({ target: confirmPasswordInput });
        }
    } else {
        // Validate confirm password
        const newPassword = newPasswordInput.value;
        
        if (password) {
            if (password === newPassword) {
                confirmPasswordInput.classList.add('valid');
                confirmPasswordInput.classList.remove('invalid');
                delete appState.validationErrors.confirmPassword;
            } else {
                confirmPasswordInput.classList.add('invalid');
                confirmPasswordInput.classList.remove('valid');
                appState.validationErrors.confirmPassword = 'Passwords do not match';
            }
        } else {
            confirmPasswordInput.classList.remove('valid', 'invalid');
            delete appState.validationErrors.confirmPassword;
        }
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    if (appState.isSubmitting) return;
    
    // Validate form
    if (!validateForm()) {
        const firstError = Object.values(appState.validationErrors)[0];
        showMessage(firstError, 'error');
        return;
    }
    
    // Start loading state
    appState.isSubmitting = true;
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    const formData = {
        email: emailInput.value.trim(),
        newPassword: newPasswordInput.value,
        timestamp: new Date().toISOString()
    };
    
    // Simulate API call
    setTimeout(() => {
        try {
            // Simulate password reset logic
            console.log('Password reset request:', formData);
            
            // Success feedback
            showMessage('Password reset successfully! You can now login with your new password.', 'success');
            
            // Clear form
            form.reset();
            emailInput.classList.remove('valid', 'invalid');
            newPasswordInput.classList.remove('valid', 'invalid');
            confirmPasswordInput.classList.remove('valid', 'invalid');
            
            // Redirect to login after delay
            setTimeout(() => {
                window.location.href = 'adminlogin.html';
            }, 2000);
            
        } catch (error) {
            console.error('Password reset error:', error);
            showMessage('An error occurred while resetting your password. Please try again.', 'error');
        } finally {
            appState.isSubmitting = false;
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }, 2000);
}

function handleKeyPress(event) {
    // Submit form on Enter key
    if (event.key === 'Enter' && !appState.isSubmitting) {
        event.preventDefault();
        handleFormSubmit(event);
    }
    
    // Clear form on Escape key
    if (event.key === 'Escape') {
        form.reset();
        emailInput.classList.remove('valid', 'invalid');
        newPasswordInput.classList.remove('valid', 'invalid');
        confirmPasswordInput.classList.remove('valid', 'invalid');
        appState.validationErrors = {};
    }
}

// Input Focus/Blur Handlers
function handleInputFocus(event) {
    event.target.parentElement.style.transform = 'scale(1.02)';
    event.target.parentElement.style.transition = 'transform 0.2s ease';
}

function handleInputBlur(event) {
    event.target.parentElement.style.transform = 'scale(1)';
}

// Setup Event Listeners
function setupEventListeners() {
    // Form submission
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Input validation
    if (emailInput) {
        emailInput.addEventListener('input', handleEmailInput);
        emailInput.addEventListener('focus', handleInputFocus);
        emailInput.addEventListener('blur', handleInputBlur);
    }
    
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', handlePasswordInput);
        newPasswordInput.addEventListener('focus', handleInputFocus);
        newPasswordInput.addEventListener('blur', handleInputBlur);
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', handlePasswordInput);
        confirmPasswordInput.addEventListener('focus', handleInputFocus);
        confirmPasswordInput.addEventListener('blur', handleInputBlur);
    }
    
    // Password toggle buttons
    if (toggleNewPassword) {
        toggleNewPassword.addEventListener('click', () => {
            const eyeIcon = toggleNewPassword.querySelector('.eye-icon');
            togglePasswordVisibility(newPasswordInput, eyeIcon, 'new');
        });
    }
    
    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', () => {
            const eyeIcon = toggleConfirmPassword.querySelector('.eye-icon');
            togglePasswordVisibility(confirmPasswordInput, eyeIcon, 'confirm');
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyPress);
    
    // Prevent form submission on Enter in password fields (handled by keyPress)
    [newPasswordInput, confirmPasswordInput].forEach(input => {
        if (input) {
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    handleFormSubmit(event);
                }
            });
        }
    });
}

// Animation Helpers
function addLoadingAnimation() {
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
}

function removeLoadingAnimation() {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
}

// Simulate password strength checker
function updatePasswordStrength(password) {
    const strength = getPasswordStrength(password);
    
    // You could add a password strength indicator here
    console.log('Password strength:', strength);
    
    return strength;
}

// Initialize Application
function initializeApp() {
    console.log('🔐 EduNova Forgot Password initialized');
    
    // Add initial animations
    const card = document.querySelector('.forgot-password-card');
    if (card) {
        card.classList.add('slide-up');
    }
    
    // Focus first input
    if (emailInput) {
        setTimeout(() => {
            emailInput.focus();
        }, 500);
    }
    
    console.log('✅ Forgot Password page ready');
}

// Error Handling
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    showMessage(`An error occurred: ${error.message}`, 'error');
    
    // Reset loading state
    appState.isSubmitting = false;
    removeLoadingAnimation();
}

// Accessibility Enhancements
function setupAccessibility() {
    // Add ARIA labels and descriptions
    emailInput?.setAttribute('aria-describedby', 'email-help');
    newPasswordInput?.setAttribute('aria-describedby', 'password-help');
    confirmPasswordInput?.setAttribute('aria-describedby', 'confirm-password-help');
    
    // Add keyboard navigation for password toggles
    [toggleNewPassword, toggleConfirmPassword].forEach(toggle => {
        if (toggle) {
            toggle.setAttribute('tabindex', '0');
            toggle.setAttribute('role', 'button');
            toggle.setAttribute('aria-label', 'Toggle password visibility');
            
            toggle.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggle.click();
                }
            });
        }
    });
}

// Navigation Helper
function navigateToLogin() {
    window.location.href = 'adminlogin.html';
}

// Data Export for Debugging
function getAppState() {
    return {
        ...appState,
        formData: {
            email: emailInput?.value || '',
            hasNewPassword: !!newPasswordInput?.value,
            hasConfirmPassword: !!confirmPasswordInput?.value
        }
    };
}

// DOM Ready Event
document.addEventListener('DOMContentLoaded', function() {
    try {
        setupEventListeners();
        setupAccessibility();
        initializeApp();
    } catch (error) {
        handleError(error, 'DOMContentLoaded');
    }
});

// Global Error Handler
window.addEventListener('error', function(event) {
    handleError(event.error, 'Global Error Handler');
});

// Page Visibility API for better UX
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // Re-focus first input when page becomes visible
        if (emailInput && !emailInput.value) {
            emailInput.focus();
        }
    }
});

// Expose API for debugging
window.EduNovaForgotPassword = {
    // State access
    getAppState,
    
    // Utility functions
    validateEmail,
    validatePassword,
    showMessage,
    
    // Navigation
    navigateToLogin,
    
    // Version info
    version: '1.0.0',
    lastUpdated: '2025-08-31'
};

// Console welcome message
console.log(`
🔐 EduNova Forgot Password v${window.EduNovaForgotPassword.version}
📅 Last Updated: ${window.EduNovaForgotPassword.lastUpdated}
🔧 Developer Tools Available:
   - EduNovaForgotPassword.getAppState() - View current state
   - EduNovaForgotPassword.navigateToLogin() - Navigate to login
   - EduNovaForgotPassword.showMessage(msg, type) - Show status message
💡 Keyboard Shortcuts:
   - Enter: Submit form
   - Escape: Clear form
   - Tab: Navigate between fields
`);