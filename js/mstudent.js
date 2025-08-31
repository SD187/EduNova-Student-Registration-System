// DOM elements
const addLinkBtn = document.querySelector('.add-link-btn');
const updateLinkBtn = document.querySelector('.update-link-btn');
const googleFormInput = document.getElementById('google-form-link');
const statusMessage = document.getElementById('statusMessage');
const navLinks = document.querySelectorAll('.nav-link');
const headerNavLinks = document.querySelectorAll('.header-nav-link');
const logoutBtn = document.querySelector('.logout-btn');

// In-memory storage for the application state
let appState = {
    currentFormLink: '',
    savedLinks: [],
    currentUser: 'Admin User',
    currentPage: 'students'
};

// Utility functions
function showMessage(message, type = 'success') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
    
    // Auto-hide message after 4 seconds
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 4000);
}

function validateGoogleFormUrl(url) {
    // More comprehensive validation for Google Forms URLs
    const googleFormPatterns = [
        /^https:\/\/docs\.google\.com\/forms\/d\/[a-zA-Z0-9_\-]+/,
        /^https:\/\/forms\.gle\/[a-zA-Z0-9_\-]+/,
        /^https:\/\/docs\.google\.com\/forms\/[a-zA-Z0-9_\-\/]+/
    ];
    
    return googleFormPatterns.some(pattern => pattern.test(url));
}

function addLoadingState(button) {
    button.classList.add('loading');
    button.disabled = true;
    button.style.pointerEvents = 'none';
}

function removeLoadingState(button) {
    button.classList.remove('loading');
    button.disabled = false;
    button.style.pointerEvents = 'auto';
}

function logActivity(action, details) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${action}:`, details);
    
    // In a real app, you might send this to an analytics service
    if (!appState.activityLog) {
        appState.activityLog = [];
    }
    
    appState.activityLog.push({
        timestamp,
        action,
        details,
        user: appState.currentUser
    });
}

// Main event handlers
function handleAddLink() {
    const formLink = googleFormInput.value.trim();
    
    // Input validation
    if (!formLink) {
        showMessage('Please paste a valid Google Form link!', 'error');
        googleFormInput.focus();
        return;
    }
    
    if (!validateGoogleFormUrl(formLink)) {
        showMessage('Please enter a valid Google Forms URL! URL should start with https://docs.google.com/forms/ or https://forms.gle/', 'error');
        googleFormInput.focus();
        return;
    }
    
    // Check for duplicate links
    const isDuplicate = appState.savedLinks.some(link => link.url === formLink);
    if (isDuplicate) {
        showMessage('This Google Form link already exists!', 'error');
        return;
    }
    
    addLoadingState(addLinkBtn);
    
    // Simulate API call with realistic delay
    setTimeout(() => {
        const newLink = {
            url: formLink,
            dateAdded: new Date().toISOString(),
            id: Date.now(),
            status: 'active'
        };
        
        appState.currentFormLink = formLink;
        appState.savedLinks.push(newLink);
        
        removeLoadingState(addLinkBtn);
        showMessage('Google Form link added successfully! Students can now access the registration form.', 'success');
        
        // Clear the input and reset validation state
        googleFormInput.value = '';
        googleFormInput.style.borderColor = '#e9ecef';
        
        // Log the activity
        logActivity('ADD_FORM_LINK', { url: formLink, linkId: newLink.id });
        
    }, 1200);
}

function handleUpdateLink() {
    const formLink = googleFormInput.value.trim();
    
    // Input validation
    if (!formLink) {
        showMessage('Please paste a valid Google Form link to update!', 'error');
        googleFormInput.focus();
        return;
    }
    
    if (!validateGoogleFormUrl(formLink)) {
        showMessage('Please enter a valid Google Forms URL! URL should start with https://docs.google.com/forms/ or https://forms.gle/', 'error');
        googleFormInput.focus();
        return;
    }
    
    if (!appState.currentFormLink) {
        showMessage('No existing link found. Please add a link first using the "Add Link" button!', 'error');
        return;
    }
    
    if (appState.currentFormLink === formLink) {
        showMessage('The new link is the same as the current link. No update needed.', 'error');
        return;
    }
    
    addLoadingState(updateLinkBtn);
    
    // Simulate API call with realistic delay
    setTimeout(() => {
        const oldLink = appState.currentFormLink;
        appState.currentFormLink = formLink;
        
        // Update the most recent active link
        if (appState.savedLinks.length > 0) {
            const activeLinks = appState.savedLinks.filter(link => link.status === 'active');
            if (activeLinks.length > 0) {
                const latestActiveLink = activeLinks[activeLinks.length - 1];
                const linkIndex = appState.savedLinks.findIndex(link => link.id === latestActiveLink.id);
                
                appState.savedLinks[linkIndex] = {
                    ...appState.savedLinks[linkIndex],
                    url: formLink,
                    dateUpdated: new Date().toISOString(),
                    previousUrl: oldLink
                };
            }
        }
        
        removeLoadingState(updateLinkBtn);
        showMessage('Google Form link updated successfully! The new form is now live for students.', 'success');
        
        // Clear the input and reset validation state
        googleFormInput.value = '';
        googleFormInput.style.borderColor = '#e9ecef';
        
        // Log the activity
        logActivity('UPDATE_FORM_LINK', { 
            oldUrl: oldLink, 
            newUrl: formLink,
            timestamp: new Date().toISOString()
        });
        
    }, 1200);
}

// Navigation handlers
function handleSidebarNavigation(event) {
    event.preventDefault();
    
    // Remove active class from all sidebar nav links
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to clicked link
    event.currentTarget.classList.add('active');
    
    const page = event.currentTarget.dataset.page;
    appState.currentPage = page;
    
    // Log navigation
    logActivity('NAVIGATE_SIDEBAR', { page, timestamp: new Date().toISOString() });
    
    // In a real application, you would handle routing here
    showMessage(`Navigated to ${page.charAt(0).toUpperCase() + page.slice(1)} section.`, 'success');
}

function handleHeaderNavigation(event) {
    event.preventDefault();
    
    const linkText = event.currentTarget.textContent;
    
    // Remove active state from all header nav links
    headerNavLinks.forEach(link => link.classList.remove('active'));
    
    // Add active state to clicked link
    event.currentTarget.classList.add('active');
    
    // Log navigation
    logActivity('NAVIGATE_HEADER', { page: linkText, timestamp: new Date().toISOString() });
    
    // In a real application, you would handle routing here
    showMessage(`Navigated to ${linkText} page.`, 'success');
}

function handleLogout() {
    const confirmLogout = confirm('Are you sure you want to logout? Any unsaved changes will be lost.');
    
    if (confirmLogout) {
        showMessage('Logging out...', 'success');
        
        // Log logout activity
        logActivity('LOGOUT', { user: appState.currentUser, timestamp: new Date().toISOString() });
        
        // Clear application state after a delay
        setTimeout(() => {
            appState = {
                currentFormLink: '',
                savedLinks: [],
                currentUser: '',
                currentPage: 'dashboard',
                activityLog: []
            };
            
            // Reset form
            googleFormInput.value = '';
            googleFormInput.style.borderColor = '#e9ecef';
            
            // Reset navigation states
            navLinks.forEach(link => link.classList.remove('active'));
            headerNavLinks.forEach(link => link.classList.remove('active'));
            
            console.log('User logged out successfully');
            showMessage('You have been logged out successfully! Redirecting to login page...', 'success');
            
        }, 1500);
    }
}

// Form input enhancements
function handleInputFocus() {
    googleFormInput.parentElement.style.transform = 'scale(1.02)';
    googleFormInput.parentElement.style.transition = 'transform 0.3s ease';
}

function handleInputBlur() {
    googleFormInput.parentElement.style.transform = 'scale(1)';
}

function handleInputChange() {
    const value = googleFormInput.value.trim();
    
    // Real-time validation feedback
    if (value && validateGoogleFormUrl(value)) {
        googleFormInput.classList.remove('invalid');
        googleFormInput.classList.add('valid');
        googleFormInput.style.borderColor = '#28a745';
    } else if (value) {
        googleFormInput.classList.remove('valid');
        googleFormInput.classList.add('invalid');
        googleFormInput.style.borderColor = '#dc3545';
    } else {
        googleFormInput.classList.remove('valid', 'invalid');
        googleFormInput.style.borderColor = '#e9ecef';
    }
}

// Keyboard shortcuts and accessibility
function handleKeyPress(event) {
    // Ctrl + Enter for Add Link
    if (event.key === 'Enter' && event.ctrlKey) {
        event.preventDefault();
        if (googleFormInput.value.trim()) {
            handleAddLink();
        }
    }
    
    // Shift + Enter for Update Link
    if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault();
        if (googleFormInput.value.trim()) {
            handleUpdateLink();
        }
    }
    
    // Escape key to clear input
    if (event.key === 'Escape') {
        googleFormInput.value = '';
        googleFormInput.blur();
        googleFormInput.style.borderColor = '#e9ecef';
        googleFormInput.classList.remove('valid', 'invalid');
    }
}

// Form validation helper
function validateAndStyleInput() {
    const value = googleFormInput.value.trim();
    
    if (value && validateGoogleFormUrl(value)) {
        googleFormInput.classList.remove('invalid');
        googleFormInput.classList.add('valid');
        return true;
    } else if (value) {
        googleFormInput.classList.remove('valid');
        googleFormInput.classList.add('invalid');
        return false;
    } else {
        googleFormInput.classList.remove('valid', 'invalid');
        return false;
    }
}

// Advanced form features
function handlePasteEvent(event) {
    // Allow paste to complete, then validate
    setTimeout(() => {
        validateAndStyleInput();
        
        const pastedUrl = googleFormInput.value.trim();
        if (pastedUrl) {
            logActivity('PASTE_URL', { url: pastedUrl });
        }
    }, 10);
}

// Navigation functionality for sidebar and header
function setupNavigation() {
    // Sidebar navigation
    const sidebarLinks = {
        'dashboard': 'Dashboard.html',
        'students': 'mstudents.html',
        'teachers': 'mteachers.html',
        'courses': 'Mcources.html',
        'timetable': 'mtime.html',
        'settings': 'settings.html'
    };

    // Setup sidebar navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            
            if (sidebarLinks[page]) {
                window.location.href = sidebarLinks[page];
            }
        });
    });

    // Logout button
    document.querySelector('.logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = 'logout.html';
        }
    });

    // Header navigation
    const headerLinks = document.querySelectorAll('.header-nav-link');
    headerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const linkText = link.textContent.trim();
            
            switch(linkText) {
                case 'Home':
                    window.location.href = 'index.html';
                    break;
                case 'Courses':
                    window.location.href = 'courses.html';
                    break;
                case 'Time Table':
                    window.location.href = 'timetable.html';
                    break;
                default:
                    // For About Us and Contact, you can add their respective pages
                    console.log(`Navigate to ${linkText} page`);
            }
        });
    });
}

// Initialize application
function initializeApp() {
    console.log('🚀 EduNova Admin Dashboard initialized');
    
    // Set initial state
    appState.currentUser = 'Admin User';
    appState.currentPage = 'students';
    
    // Show welcome message
    setTimeout(() => {
        showMessage('Welcome to EduNova Admin Dashboard! Ready to manage student registration forms.', 'success');
    }, 500);
    
    // Log initialization
    logActivity('APP_INIT', { 
        user: appState.currentUser, 
        page: appState.currentPage,
        timestamp: new Date().toISOString()
    });
}

// Event listeners setup
function setupEventListeners() {
    // Button event listeners
    if (addLinkBtn) {
        addLinkBtn.addEventListener('click', handleAddLink);
    }
    
    if (updateLinkBtn) {
        updateLinkBtn.addEventListener('click', handleUpdateLink);
    }
    
    // Sidebar navigation event listeners
    navLinks.forEach(link => {
        link.addEventListener('click', handleSidebarNavigation);
    });
    
    // Header navigation event listeners
    headerNavLinks.forEach(link => {
        link.addEventListener('click', handleHeaderNavigation);
    });
    
    // Logout event listener
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Input event listeners
    if (googleFormInput) {
        googleFormInput.addEventListener('focus', handleInputFocus);
        googleFormInput.addEventListener('blur', handleInputBlur);
        googleFormInput.addEventListener('input', handleInputChange);
        googleFormInput.addEventListener('keydown', handleKeyPress);
        googleFormInput.addEventListener('paste', handlePasteEvent);
    }
}

// Data management functions
function getCurrentFormLink() {
    return appState.currentFormLink;
}

function getAllSavedLinks() {
    return appState.savedLinks;
}

function getActiveLinks() {
    return appState.savedLinks.filter(link => link.status === 'active');
}

function deactivateLink(linkId) {
    const linkIndex = appState.savedLinks.findIndex(link => link.id === linkId);
    if (linkIndex !== -1) {
        appState.savedLinks[linkIndex].status = 'inactive';
        appState.savedLinks[linkIndex].dateDeactivated = new Date().toISOString();
        
        logActivity('DEACTIVATE_LINK', { linkId, url: appState.savedLinks[linkIndex].url });
        return true;
    }
    return false;
}

function clearAllData() {
    const confirmClear = confirm('Are you sure you want to clear all data? This action cannot be undone.');
    
    if (confirmClear) {
        logActivity('CLEAR_ALL_DATA', { 
            linksCleared: appState.savedLinks.length,
            timestamp: new Date().toISOString()
        });
        
        appState = {
            currentFormLink: '',
            savedLinks: [],
            currentUser: 'Admin User',
            currentPage: 'students',
            activityLog: []
        };
        
        googleFormInput.value = '';
        googleFormInput.style.borderColor = '#e9ecef';
        googleFormInput.classList.remove('valid', 'invalid');
        
        showMessage('All data cleared successfully!', 'success');
    }
}

// Advanced features
function exportData() {
    const dataToExport = {
        exportDate: new Date().toISOString(),
        currentFormLink: appState.currentFormLink,
        savedLinks: appState.savedLinks,
        activityLog: appState.activityLog || []
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `edunova-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    logActivity('EXPORT_DATA', { recordCount: appState.savedLinks.length });
    showMessage('Data exported successfully!', 'success');
}

function getFormStats() {
    const stats = {
        totalLinks: appState.savedLinks.length,
        activeLinks: appState.savedLinks.filter(link => link.status === 'active').length,
        inactiveLinks: appState.savedLinks.filter(link => link.status === 'inactive').length,
        currentFormLink: appState.currentFormLink,
        lastUpdate: appState.savedLinks.length > 0 ? 
            Math.max(...appState.savedLinks.map(link => new Date(link.dateUpdated || link.dateAdded).getTime())) : null
    };
    
    console.log('📊 Form Statistics:', stats);
    return stats;
}

// Error handling
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    showMessage(`An error occurred: ${error.message}`, 'error');
    
    logActivity('ERROR', { 
        context, 
        error: error.message, 
        timestamp: new Date().toISOString() 
    });
}

// DOM ready event
document.addEventListener('DOMContentLoaded', function() {
    try {
        setupEventListeners();
        setupNavigation();
        initializeApp();
    } catch (error) {
        handleError(error, 'DOMContentLoaded');
    }
});

// Global error handling
window.addEventListener('error', function(event) {
    handleError(event.error, 'Global Error Handler');
});

// Expose API for external access and debugging
window.EduNovaAdmin = {
    // Data access
    getCurrentFormLink,
    getAllSavedLinks,
    getActiveLinks,
    getFormStats,
    
    // Data management
    clearAllData,
    deactivateLink,
    exportData,
    
    // State access (read-only)
    get appState() { 
        return { ...appState }; // Return a copy to prevent external modification
    },
    
    // Utility functions
    validateUrl: validateGoogleFormUrl,
    showMessage,
    
    // Debug functions
    logActivity,
    
    // Version info
    version: '1.0.0',
    lastUpdated: '2025-08-31'
};

// Console welcome message
console.log(`
🎓 EduNova Admin Dashboard v${window.EduNovaAdmin.version}
📅 Last Updated: ${window.EduNovaAdmin.lastUpdated}
🔧 Developer Tools Available:
   - EduNovaAdmin.getFormStats() - View form statistics
   - EduNovaAdmin.exportData() - Export all data
   - EduNovaAdmin.clearAllData() - Clear all data
   - EduNovaAdmin.appState - View current state
💡 Keyboard Shortcuts:
   - Ctrl + Enter: Add Link
   - Shift + Enter: Update Link  
   - Escape: Clear input
`);

// Performance monitoring
const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
            console.log('📈 Page Load Time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
        }
    }
});

if ('PerformanceObserver' in window) {
    perfObserver.observe({ entryTypes: ['navigation'] });
}