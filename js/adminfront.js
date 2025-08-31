// AdminFront JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get button elements
    const adminLoginBtn = document.getElementById('adminLogin');
    const createAccountBtn = document.getElementById('createAccount');

    // Add click event listeners
    adminLoginBtn.addEventListener('click', handleAdminLogin);
    createAccountBtn.addEventListener('click', handleCreateAccount);

    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);

    // Add loading animation utility
    function addLoadingState(button) {
        button.classList.add('loading');
        button.disabled = true;
    }

    function removeLoadingState(button) {
        button.classList.remove('loading');
        button.disabled = false;
    }

    // Handle Admin Login
    function handleAdminLogin() {
        console.log('Admin Login clicked');
        
        // Add loading state
        addLoadingState(adminLoginBtn);
        
        // Simulate loading delay
        setTimeout(() => {
            // Remove loading state
            removeLoadingState(adminLoginBtn);
            
            // Here you would typically redirect to admin login page
            // window.location.href = 'admin-login.html';
            
            // For demo purposes, show an alert
            alert('Redirecting to Admin Login page...');
            
            // You can replace this with actual navigation logic
            // Example: window.location.href = '/admin/login';
        }, 1000);
    }

    // Handle Create Account
    function handleCreateAccount() {
        console.log('Create Account clicked');
        
        // Add loading state
        addLoadingState(createAccountBtn);
        
        // Simulate loading delay
        setTimeout(() => {
            // Remove loading state
            removeLoadingState(createAccountBtn);
            
            // Here you would typically redirect to registration page
            // window.location.href = 'register.html';
            
            // For demo purposes, show an alert
            alert('Redirecting to Account Creation page...');
            
            // You can replace this with actual navigation logic
            // Example: window.location.href = '/admin/register';
        }, 1000);
    }

    // Handle keyboard navigation
    function handleKeyboardNavigation(event) {
        // Enter key on focused button
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
            
            if (focusedElement === adminLoginBtn) {
                createAccountBtn.focus();
            } else if (focusedElement === createAccountBtn) {
                adminLoginBtn.focus();
            } else {
                adminLoginBtn.focus();
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
            ripple.remove();
        }, 600);
    }

    // Initialize animations
    initializeAnimations();

    // Add page load animation
    function initializePageAnimations() {
        const adminCard = document.querySelector('.admin-card');
        const header = document.querySelector('.header');
        
        // Animate header
        header.style.opacity = '0';
        header.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            header.style.transition = 'all 0.6s ease-out';
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }, 200);
        
        // Animate buttons individually
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

    // Form validation utilities (for future use)
    const validation = {
        isValidEmail: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        
        isValidPassword: function(password) {
            // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
            return passwordRegex.test(password);
        },
        
        isEmpty: function(value) {
            return !value || value.trim().length === 0;
        }
    };

    // Utility functions for future API integration
    const api = {
        baseUrl: '/api', // Configure based on your backend
        
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
                const response = await fetch(url, config);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
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
        }
    };

    // Make utilities globally available
    window.EduNovaAdmin = {
        validation,
        api,
        addLoadingState,
        removeLoadingState
    };

    console.log('EduNova Admin frontend initialized successfully!');
});




// Simple Navigation - Add this to your adminfront.js
document.addEventListener('DOMContentLoaded', function() {
    // Get buttons
    const adminLoginBtn = document.getElementById('adminLogin');
    const createAccountBtn = document.getElementById('createAccount');

    // Admin Login button - navigate to adminlogin.html
    adminLoginBtn.addEventListener('click', function() {
        window.location.href = 'adminlogin.html';
    });

    // Create Account button - navigate to register page
    createAccountBtn.addEventListener('click', function() {
        window.location.href = 'adminregister.html';
    });
});


// Simple Navigation - Add this to your adminfront.js
document.addEventListener('DOMContentLoaded', function() {
    // Get buttons
    const adminLoginBtn = document.getElementById('adminLogin');
    const createAccountBtn = document.getElementById('createAccount');

    // Admin Login button - navigate to adminlogin.html
    adminLoginBtn.addEventListener('click', function() {
        window.location.href = 'adminlogin.html';
    });

    // Create Account button - navigate to createaccount.html
    createAccountBtn.addEventListener('click', function() {
        window.location.href = 'createaccount.html';
    });
});