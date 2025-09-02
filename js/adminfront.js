// AdminFront JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('EduNova Admin frontend initializing...');

    // Get button elements (with null checks)
    const adminLoginBtn = document.getElementById('adminLogin');
    const createAccountBtn = document.getElementById('createAccount');

    // Only add listeners if elements exist
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', handleAdminLogin);
        console.log('Admin login button found and configured');
    } else {
        console.warn('Admin login button not found');
    }

    if (createAccountBtn) {
        createAccountBtn.addEventListener('click', handleCreateAccount);
        console.log('Create account button found and configured');
    } else {
        console.warn('Create account button not found');
    }

    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);

    // Loading state utilities
    function addLoadingState(button) {
        if (button) {
            button.classList.add('loading');
            button.disabled = true;
            button.textContent = 'Loading...';
        }
    }

    function removeLoadingState(button, originalText) {
        if (button) {
            button.classList.remove('loading');
            button.disabled = false;
            button.textContent = originalText || 'Admin Login';
        }
    }

    // Handle Admin Login
    function handleAdminLogin() {
        console.log('Admin Login clicked');
        
        if (adminLoginBtn) {
            addLoadingState(adminLoginBtn);
            
            // Check if this is a navigation button or actual login
            if (window.location.pathname.includes('adminfront.html')) {
                // This is the main page - navigate to login page
                setTimeout(() => {
                    removeLoadingState(adminLoginBtn, 'Admin Login');
                    window.location.href = 'adminlogin.html';
                }, 500);
            } else {
                // This might be an actual login form
                performLogin();
            }
        }
    }

    // Handle Create Account
    function handleCreateAccount() {
        console.log('Create Account clicked');
        
        if (createAccountBtn) {
            addLoadingState(createAccountBtn);
            
            setTimeout(() => {
                removeLoadingState(createAccountBtn, 'Create Account');
                window.location.href = 'adminregister.html';
            }, 500);
        }
    }

    // Actual login function (for login forms)
    async function performLogin() {
        try {
            // Get form data (adjust selectors based on your HTML)
            const usernameField = document.getElementById('username') || document.querySelector('input[name="username"]');
            const passwordField = document.getElementById('password') || document.querySelector('input[name="password"]');
            
            if (!usernameField || !passwordField) {
                console.error('Username or password field not found');
                alert('Login form elements not found');
                return;
            }

            const credentials = {
                username: usernameField.value.trim(),
                password: passwordField.value.trim()
            };

            if (!credentials.username || !credentials.password) {
                alert('Please enter both username and password');
                return;
            }

            console.log('Attempting login with:', credentials.username);

            // Make API call to backend
            const response = await fetch('http://localhost:5000/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();
            console.log('Login response:', data);

            if (response.ok) {
                // Store token for future requests
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('adminData', JSON.stringify(data.admin));
                
                alert('Login successful!');
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                alert(data.message || 'Login failed');
            }

        } catch (error) {
            console.error('Login error:', error);
            alert('Connection error. Make sure the backend server is running.');
        } finally {
            if (adminLoginBtn) {
                removeLoadingState(adminLoginBtn, 'Login');
            }
        }
    }

    // Handle keyboard navigation
    function handleKeyboardNavigation(event) {
        if (event.key === 'Enter') {
            const focusedElement = document.activeElement;
            if (focusedElement === adminLoginBtn) {
                handleAdminLogin();
            } else if (focusedElement === createAccountBtn) {
                handleCreateAccount();
            }
        }
        
        // Arrow key navigation between buttons
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            const focusedElement = document.activeElement;
            
            if (adminLoginBtn && createAccountBtn) {
                if (focusedElement === adminLoginBtn) {
                    createAccountBtn.focus();
                } else if (focusedElement === createAccountBtn) {
                    adminLoginBtn.focus();
                } else {
                    adminLoginBtn.focus();
                }
            }
        }
    }

    // Add hover effects and animations
    function initializeAnimations() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            // Add ripple effect on click
            button.addEventListener('click', createRippleEffect);
            
            // Add subtle hover animation
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', function() {
                if (!this.classList.contains('loading')) {
                    this.style.transform = 'translateY(0)';
                }
            });
        });
    }

    // Create ripple effect
    function createRippleEffect(event) {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            pointer-events: none;
        `;

        // Add ripple animation CSS if not exists
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
                .btn {
                    position: relative;
                    overflow: hidden;
                }
            `;
            document.head.appendChild(style);
        }

        button.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
    }

    // Initialize animations only if elements exist
    initializeAnimations();

    // Safe page load animation
    function initializePageAnimations() {
        const adminCard = document.querySelector('.admin-card');
        const header = document.querySelector('.header');
        
        // Animate header if it exists
        if (header) {
            header.style.opacity = '0';
            header.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                header.style.transition = 'all 0.6s ease-out';
                header.style.opacity = '1';
                header.style.transform = 'translateY(0)';
            }, 200);
        }
        
        // Animate buttons individually if they exist
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach((button, index) => {
            button.style.opacity = '0';
            button.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                button.style.transition = 'all 0.4s ease-out';
                button.style.opacity = '1';
                button.style.transform = 'translateY(0)';
            }, 800 + (index * 100));
        });
    }

    // Initialize page animations
    initializePageAnimations();

    // API utility for backend communication
    const api = {
        baseUrl: 'http://localhost:5000/api',
        
        async request(endpoint, options = {}) {
            const url = `${this.baseUrl}${endpoint}`;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            };

            try {
                console.log(`Making API request to: ${url}`);
                const response = await fetch(url, config);
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('API request failed:', error);
                throw error;
            }
        },

        async login(credentials) {
            return this.request('/admin/login', {
                method: 'POST',
                body: JSON.stringify(credentials)
            });
        },

        async register(userData) {
            return this.request('/admin/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
        },

        async getStudents(page = 1, limit = 10, search = '') {
            const token = localStorage.getItem('authToken');
            return this.request(`/students?page=${page}&limit=${limit}&search=${search}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }
    };

    // Form validation utilities
    const validation = {
        isValidEmail: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        
        isValidPassword: function(password) {
            return password && password.length >= 6;
        },
        
        isEmpty: function(value) {
            return !value || value.trim().length === 0;
        }
    };

    // Make utilities globally available
    window.EduNovaAdmin = {
        validation,
        api,
        addLoadingState,
        removeLoadingState
    };

    console.log('✅ EduNova Admin frontend initialized successfully!');
});