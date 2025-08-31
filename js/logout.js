// EduNova Logout Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the logout page
    initializeLogoutPage();
});

// Application initialization
function initializeLogoutPage() {
    // Set up event listeners
    setupEventListeners();
    
    // Initialize session timer
    initializeSessionTimer();
    
    // Add page animations
    addPageAnimations();
    
    // Check if user is logged in
    checkAuthStatus();
    
    // Console message
    console.log('🚪 EduNova Logout Page Loaded Successfully!');
}

// Event Listeners Setup
function setupEventListeners() {
    // Button elements
    const signInAgainBtn = document.getElementById('signInAgainBtn');
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
    const backToDashboard = document.getElementById('backToDashboard');
    const cancelLogout = document.getElementById('cancelLogout');
    const finalLogout = document.getElementById('finalLogout');
    
    // Modal elements
    const confirmModal = document.getElementById('confirmModal');
    const successModal = document.getElementById('successModal');

    // Button event listeners
    if (signInAgainBtn) {
        signInAgainBtn.addEventListener('click', handleSignInAgain);
    }

    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', showConfirmModal);
    }

    if (backToDashboard) {
        backToDashboard.addEventListener('click', handleBackToDashboard);
    }

    if (cancelLogout) {
        cancelLogout.addEventListener('click', hideConfirmModal);
    }

    if (finalLogout) {
        finalLogout.addEventListener('click', handleFinalLogout);
    }

    // Modal overlay click to close
    if (confirmModal) {
        confirmModal.addEventListener('click', function(e) {
            if (e.target === confirmModal) {
                hideConfirmModal();
            }
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Window beforeunload event
    window.addEventListener('beforeunload', handleWindowBeforeUnload);

    // Visibility change (tab switch detection)
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

// Session Timer Management
let sessionTimer = null;
let sessionTimeLeft = 300; // 5 minutes in seconds

function initializeSessionTimer() {
    updateSessionDisplay();
    startSessionTimer();
}

function startSessionTimer() {
    sessionTimer = setInterval(() => {
        sessionTimeLeft--;
        updateSessionDisplay();
        
        // Warning at 1 minute
        if (sessionTimeLeft === 60) {
            showSessionWarning();
        }
        
        // Auto logout at 0
        if (sessionTimeLeft <= 0) {
            clearInterval(sessionTimer);
            handleAutoLogout();
        }
    }, 1000);
}

function updateSessionDisplay() {
    const timerElement = document.getElementById('sessionTimer');
    if (timerElement) {
        const minutes = Math.floor(sessionTimeLeft / 60);
        const seconds = sessionTimeLeft % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        timerElement.textContent = timeString;
        
        // Add warning class when time is low
        if (sessionTimeLeft <= 60) {
            timerElement.classList.add('warning');
        }
    }
}

function showSessionWarning() {
    showNotification('Session will expire in 1 minute!', 'warning');
}

function handleAutoLogout() {
    showNotification('Session expired. Logging out automatically...', 'info');
    setTimeout(() => {
        performLogout();
    }, 2000);
}

// Authentication Status Check
function checkAuthStatus() {
    // Simulate checking if user is logged in
    const isLoggedIn = checkUserSession();
    
    if (!isLoggedIn) {
        showNotification('No active session found. Redirecting to login...', 'info');
        setTimeout(() => {
            redirectToLogin();
        }, 2000);
    }
}

function checkUserSession() {
    // In a real application, this would check with the server
    // For demo purposes, we'll check if there's a session indicator
    return sessionStorage.getItem('edunova_session') || localStorage.getItem('edunova_user');
}

// Button Handlers
function handleSignInAgain() {
    showNotification('Redirecting to login page...', 'info');
    
    // Add loading state
    const btn = document.getElementById('signInAgainBtn');
    setButtonLoading(btn, true);
    
    setTimeout(() => {
        redirectToLogin();
    }, 1500);
}

function handleBackToDashboard() {
    showNotification('Returning to dashboard...', 'info');
    
    setTimeout(() => {
        // Replace with actual dashboard URL
        window.location.href = 'dashboard.html';
    }, 1000);
}

function showConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) {
        modal.classList.add('active');
        
        // Focus management for accessibility
        const firstButton = modal.querySelector('.btn-cancel');
        if (firstButton) {
            firstButton.focus();
        }
        
        // Pause session timer during confirmation
        if (sessionTimer) {
            clearInterval(sessionTimer);
        }
    }
}

function hideConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) {
        modal.classList.remove('active');
        
        // Resume session timer
        startSessionTimer();
    }
}

async function handleFinalLogout() {
    const btn = document.getElementById('finalLogout');
    
    // Show loading state
    setButtonLoading(btn, true);
    
    try {
        // Hide confirm modal
        hideConfirmModal();
        
        // Simulate logout API call
        await simulateLogout();
        
        // Show success modal
        showSuccessModal();
        
        // Clear all data and redirect after delay
        setTimeout(() => {
            performLogout();
        }, 3000);
        
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('An error occurred during logout. Please try again.', 'error');
        setButtonLoading(btn, false);
    }
}

// Modal Management
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('active');
    }
}

// Logout Operations
async function simulateLogout() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 2000);
    });
}

function performLogout() {
    // Clear all session data
    clearSessionData();
    
    // Clear timer
    if (sessionTimer) {
        clearInterval(sessionTimer);
    }
    
    // Show final notification
    showNotification('Logged out successfully. Goodbye!', 'success');
    
    // Redirect to login
    setTimeout(() => {
        redirectToLogin();
    }, 1000);
}

function clearSessionData() {
    // Clear all stored data
    sessionStorage.clear();
    localStorage.removeItem('edunova_user');
    localStorage.removeItem('edunova_token');
    
    // Clear any cookies (if applicable)
    document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
}

function redirectToLogin() {
    // Replace with actual login page URL
    window.location.href = 'index.html';
}

// Utility Functions
function setButtonLoading(button, isLoading) {
    if (!button) return;
    
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
    } else {
        button.classList.remove('loading');
        button.disabled = false;
        button.setAttribute('aria-busy', 'false');
    }
}

// Keyboard Shortcuts
function handleKeyboardShortcuts(e) {
    // Escape key to close modals
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            // Resume timer if confirm modal is closed
            if (activeModal.id === 'confirmModal') {
                startSessionTimer();
            }
        }
    }
    
    // Enter key for confirmation
    if (e.key === 'Enter') {
        const confirmModal = document.getElementById('confirmModal');
        if (confirmModal && confirmModal.classList.contains('active')) {
            const focusedElement = document.activeElement;
            if (focusedElement && focusedElement.classList.contains('btn-confirm')) {
                handleFinalLogout();
            }
        }
    }
    
    // Ctrl+L for quick logout
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        showConfirmModal();
    }
}

// Window Events
function handleWindowBeforeUnload(e) {
    // Show confirmation when user tries to leave
    const message = 'Are you sure you want to leave? Your session will remain active.';
    e.returnValue = message;
    return message;
}

function handleVisibilityChange() {
    if (document.hidden) {
        // Page is hidden (tab switched)
        console.log('Page hidden - session continues');
    } else {
        // Page is visible again
        console.log('Page visible - checking session status');
        checkAuthStatus();
    }
}

// Page Animations
function addPageAnimations() {
    // Animate logout card entrance
    const logoutCard = document.querySelector('.logout-card');
    
    if (logoutCard) {
        logoutCard.style.opacity = '0';
        logoutCard.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            logoutCard.style.transition = 'all 0.6s ease-out';
            logoutCard.style.opacity = '1';
            logoutCard.style.transform = 'translateY(0)';
        }, 100);
    }
}
// Logout Navigation - Add this to your logout.js
document.addEventListener('DOMContentLoaded', function() {
    // Get buttons
    const signInAgainBtn = document.getElementById('signInAgainBtn');
    const backToDashboard = document.getElementById('backToDashboard');

    // Sign in again button - navigate to adminlogin.html
    signInAgainBtn.addEventListener('click', function() {
        window.location.href = 'adminlogin.html';
    });

    // Back to dashboard link - navigate to Dashboard.html
    backToDashboard.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'Dashboard.html';
    });
});