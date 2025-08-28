//admin dashboard


// Chart.js configuration
document.addEventListener('DOMContentLoaded', function() {
    initializeChart();
    initializeEventListeners();
    startRealTimeUpdates();
  });
  
  function initializeChart() {
    const ctx = document.getElementById('activityChart');
    const activityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Enrollments',
                data: [45, 52, 38, 65, 72, 48, 56],
                backgroundColor: [
                    '#f97316',
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6',
                    '#06b6d4'
                ],
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9'
                    },
                    ticks: {
                        color: '#64748b'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b'
                    }
                }
            }
        }
    });
  }
  
  // Navigation functionality
  function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Simulate logout process
        showNotification('Logged out successfully!', 'success');
        // In a real application, you would redirect to login page
        // window.location.href = '/login';
    }
  }
  
  function manageCourses() {
    showNotification('Redirecting to Course Management...', 'info');
    // In a real application, you would navigate to courses page
    // window.location.href = '/courses';
  }
  
  function manageStudents() {
    showNotification('Redirecting to Student Management...', 'info');
    // In a real application, you would navigate to students page
    // window.location.href = '/students';
  }
  
  // Notification system
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close" onclick="closeNotification(this)">&times;</button>
        </div>
    `;
    
    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                color: white;
                font-weight: 500;
                z-index: 1000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            .notification-info { background: #3b82f6; }
            .notification-success { background: #10b981; }
            .notification-warning { background: #f59e0b; }
            .notification-error { background: #ef4444; }
            .notification.show { transform: translateX(0); }
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => closeNotification(notification.querySelector('.notification-close')), 3000);
  }
  
  function closeNotification(closeBtn) {
    const notification = closeBtn.closest('.notification');
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }
  
  // Initialize event listeners
  function initializeEventListeners() {
    // Sidebar menu interactions
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Update page content based on selected menu item
            updatePageContent(this.textContent.trim());
        });
    });
  
    // Header navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
  
    // Mobile menu toggle (if implementing mobile hamburger menu)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleSidebar);
    }
  
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        const sidebar = document.querySelector('.sidebar');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (window.innerWidth <= 1024 && 
            sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            !mobileMenuBtn?.contains(e.target)) {
            toggleSidebar();
        }
    });
  
    // Handle window resize
    window.addEventListener('resize', handleWindowResize);
  }
  
  // Update page content based on menu selection
  function updatePageContent(menuItem) {
    const pageTitle = document.querySelector('.page-title');
    const pageSubtitle = document.querySelector('.page-subtitle');
    
    switch(menuItem) {
        case 'Dashboard':
            pageTitle.textContent = 'Admin Dashboard';
            pageSubtitle.textContent = 'Manage your educational institution efficiently';
            break;
        case 'Student Management':
            pageTitle.textContent = 'Student Management';
            pageSubtitle.textContent = 'View and manage student records';
            break;
        case 'Teachers':
            pageTitle.textContent = 'Teacher Management';
            pageSubtitle.textContent = 'Manage teaching staff and assignments';
            break;
        case 'Manage Courses':
            pageTitle.textContent = 'Course Management';
            pageSubtitle.textContent = 'Create and organize courses';
            break;
        case 'Manage Time Table':
            pageTitle.textContent = 'Time Table Management';
            pageSubtitle.textContent = 'Schedule classes and activities';
            break;
        case 'Settings':
            pageTitle.textContent = 'System Settings';
            pageSubtitle.textContent = 'Configure system preferences';
            break;
    }
  }
  
  // Mobile responsiveness
  function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
  }
  
  function handleWindowResize() {
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth > 1024) {
        sidebar.classList.remove('active');
    }
  }
  
  // Real-time updates simulation
  function startRealTimeUpdates() {
    // Update stats every 30 seconds
    setInterval(updateStats, 30000);
    
    // Update chart data every 5 minutes
    setInterval(updateChartData, 300000);
  }
  
  function updateStats() {
    const statsValues = document.querySelectorAll('.stat-value');
    const newEnrollmentsElement = statsValues[1];
    const lastActivityElement = statsValues[3];
    
    // Randomly update new enrollments
    if (Math.random() > 0.7) {
        const currentEnrollments = parseInt(newEnrollmentsElement.textContent) || 0;
        const newEnrollments = currentEnrollments + Math.floor(Math.random() * 3) + 1;
        newEnrollmentsElement.textContent = newEnrollments;
        
        // Show notification for new enrollment
        showNotification(`${newEnrollments - currentEnrollments} new student(s) enrolled!`, 'success');
    }
    
    // Update last activity timestamp
    lastActivityElement.textContent = 'Just now';
    setTimeout(() => {
        lastActivityElement.textContent = '2 hours ago';
    }, 5000);
  }
  
  function updateChartData() {
    // This would typically fetch new data from an API
    // For demo purposes, we'll just add some randomness to existing data
    console.log('Updating chart data...');
    showNotification('Chart data updated', 'info');
  }
  
  // Utility functions
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
  }
  
  // Search functionality (if implementing search)
  function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            // Implement search logic here
            console.log('Searching for:', query);
        });
    }
  }
  
  // Data export functionality
  function exportData(format) {
    showNotification(`Exporting data as ${format.toUpperCase()}...`, 'info');
    // Implement actual export logic here
    setTimeout(() => {
        showNotification(`Data exported successfully as ${format.toUpperCase()}`, 'success');
    }, 2000);
  }
  
  // Error handling
  window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
  });
  
  // Performance monitoring
  function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
  }
  
  // Initialize performance monitoring
  logPerformance();
  
  
  //adminlogout


   // Logout Page JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const confirmLogoutBtn = document.getElementById('confirmLogout');
    const cancelLogoutBtn = document.getElementById('cancelLogout');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Confirm logout button event listener
    confirmLogoutBtn.addEventListener('click', function() {
        // Show confirmation dialog
        const isConfirmed = confirm('Are you sure you want to log out?');
        
        if (isConfirmed) {
            performLogout();
        }
    });
    
    // Cancel logout button event listener
    cancelLogoutBtn.addEventListener('click', function() {
        // Add smooth transition effect
        document.querySelector('.logout-card').style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            // Redirect back to dashboard or previous page
            window.history.back();
            // Alternative: redirect to a specific page
            // window.location.href = 'dashboard.html';
        }, 200);
    });
    
    // Perform logout function
    function performLogout() {
        // Show loading overlay
        showLoadingOverlay();
        
        // Simulate logout process (replace with actual logout logic)
        setTimeout(() => {
            // Clear user session data
            clearUserSession();
            
            // Hide loading overlay
            hideLoadingOverlay();
            
            // Show success message
            showLogoutSuccess();
            
            // Redirect to login page after a brief delay
            setTimeout(() => {
                window.location.href = 'login.html'; // Adjust path as needed
            }, 1500);
            
        }, 2000); // Simulate 2 second logout process
    }
    
    // Show loading overlay
    function showLoadingOverlay() {
        loadingOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    // Hide loading overlay
    function hideLoadingOverlay() {
        loadingOverlay.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    // Clear user session data
    function clearUserSession() {
        // Clear localStorage
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('adminSession');
        localStorage.removeItem('isLoggedIn');
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Clear any cookies (if using cookies for authentication)
        clearAuthCookies();
        
        // Optional: Make API call to server to invalidate session
        // invalidateServerSession();
    }
    
    // Clear authentication cookies
    function clearAuthCookies() {
        // List of cookie names to clear
        const cookiesToClear = ['authToken', 'refreshToken', 'sessionId'];
        
        cookiesToClear.forEach(cookieName => {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
    }
    
    // Show logout success message
    function showLogoutSuccess() {
        // Create success notification
        const successDiv = document.createElement('div');
        successDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                z-index: 1001;
                font-weight: 600;
                animation: slideIn 0.3s ease-out;
            ">
                ✓ Logged out successfully!
            </div>
        `;
        
        document.body.appendChild(successDiv);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 3000);
    }
    
    // Optional: Server-side session invalidation
    function invalidateServerSession() {
        // Example API call to invalidate session on server
        /*
        fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server session invalidated:', data);
        })
        .catch(error => {
            console.error('Error invalidating server session:', error);
        });
        */
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // ESC key to cancel logout
        if (event.key === 'Escape') {
            cancelLogoutBtn.click();
        }
        
        // Enter key to confirm logout
        if (event.key === 'Enter') {
            confirmLogoutBtn.click();
        }
    });
    
    // Add smooth animations on page load
    window.addEventListener('load', function() {
        const logoutCard = document.querySelector('.logout-card');
        logoutCard.style.opacity = '0';
        logoutCard.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            logoutCard.style.transition = 'all 0.5s ease-out';
            logoutCard.style.opacity = '1';
            logoutCard.style.transform = 'translateY(0)';
        }, 100);
    });
    
    // Prevent accidental page refresh during logout process
    let isLoggingOut = false;
    
    confirmLogoutBtn.addEventListener('click', function() {
        isLoggingOut = true;
    });
    
    window.addEventListener('beforeunload', function(event) {
        if (isLoggingOut) {
            event.preventDefault();
            event.returnValue = 'Logout in progress. Are you sure you want to leave?';
        }
    });
});

// Add CSS animation for success notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);








// Admin Dashboard JavaScript

// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard with error handling
    try {
        console.log('Starting dashboard initialization...');
        
        // Initialize core functions
        initializeDashboard();
        initializeMobileMenu();
        initializeNavigation();
        updateStats();
        
        // Initialize chart with longer delay to ensure Chart.js loads
        setTimeout(() => {
            initializeChart();
        }, 1500); // Increased delay
        
        // Auto-refresh data every 5 minutes
        setInterval(updateStats, 300000);
        
        console.log('Dashboard initialization completed successfully');
        
    } catch (error) {
        console.error('Failed to initialize dashboard:', error);
        showErrorMessage('Initialization Error', 'Dashboard failed to initialize properly. Please refresh the page.');
    }
});

// Initialize Dashboard
function initializeDashboard() {
    console.log('EduNova Admin Dashboard initialized');
    
    // Add smooth loading animation
    const mainContent = document.querySelector('.main-content');
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        mainContent.style.transition = 'all 0.6s ease';
        mainContent.style.opacity = '1';
        mainContent.style.transform = 'translateY(0)';
    }, 100);
    
    // Animate stat cards
    animateStatCards();
}

// Initialize Chart with better CDN checking
function initializeChart() {
    // Wait for Chart.js to load
    function waitForChart(attempts = 0) {
        if (attempts > 50) { // Wait max 5 seconds
            console.error('Chart.js failed to load after multiple attempts');
            showChartFallback();
            return;
        }
        
        if (typeof Chart === 'undefined') {
            setTimeout(() => waitForChart(attempts + 1), 100);
            return;
        }
        
        console.log('Chart.js is ready, initializing chart...');
        createChart();
    }
    
    function createChart() {
        const ctx = document.getElementById('activityChart');
        if (!ctx) {
            console.error('Chart canvas not found');
            showChartFallback();
            return;
        }

        try {
        type: 'bar',
        data 
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Student Activity',
                data: [65, 59, 80, 81, 56, 55, 40],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(6, 182, 212, 0.8)',
                    'rgba(251, 146, 60, 0.8)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(6, 182, 212, 1)',
                    'rgba(251, 146, 60, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    cornerRadius: 10,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Active Students: ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        lineWidth: 1
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });

    // Store chart instance for potential updates
    window.activityChart = activityChart;
}

// Initialize Mobile Menu
function initializeMobileMenu() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            this.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('show');
                mobileToggle.classList.remove('active');
            }
        });
    }
}

// Initialize Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get section to show
            const section = this.getAttribute('data-section');
            
            // Handle navigation
            handleNavigation(section);
        });
    });
}

// Handle Navigation Between Sections
function handleNavigation(section) {
    console.log(`Navigating to: ${section}`);
    
    // Add smooth transition effect
    const mainContent = document.querySelector('.main-content');
    mainContent.style.transform = 'translateX(-20px)';
    mainContent.style.opacity = '0.7';
    
    setTimeout(() => {
        // Here you would typically load different content based on section
        // For now, we'll just show a message
        showSectionMessage(section);
        
        // Reset transition
        mainContent.style.transform = 'translateX(0)';
        mainContent.style.opacity = '1';
    }, 200);
}

// Show Section Message
function showSectionMessage(section) {
    const sectionNames = {
        'dashboard': 'Dashboard',
        'students': 'Student Management',
        'teachers': 'Teacher Management', 
        'courses': 'Course Management',
        'timetable': 'Time Table Management',
        'settings': 'Settings'
    };
    
    // You could replace this with actual content loading
    console.log(`Loading ${sectionNames[section]} section...`);
}

// Animate Stat Cards
function animateStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 * (index + 1));
    });
}

// Update Dashboard Stats
function updateStats() {
    const stats = {
        totalStudents: Math.floor(Math.random() * 100) + 450,
        activeTeachers: Math.floor(Math.random() * 5) + 1,
        totalCourses: Math.floor(Math.random() * 3) + 6,
        lastUpdated: getTimeAgo()
    };
    
    // Update stat numbers with animation
    animateStatUpdate('totalStudents', `${stats.totalStudents} +`);
    animateStatUpdate('activeTeachers', stats.activeTeachers);
    animateStatUpdate('totalCourses', `${stats.totalCourses} +`);
    animateStatUpdate('lastUpdated', stats.lastUpdated);
}

// Animate Stat Update
function animateStatUpdate(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.style.transform = 'scale(1.1)';
    element.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
        element.textContent = newValue;
        element.style.transform = 'scale(1)';
    }, 150);
}

// Get Time Ago String
function getTimeAgo() {
    const times = ['Just now', '1 minute ago', '2 minutes ago', '5 minutes ago', '10 minutes ago', '30 minutes ago', '1 hour ago', '2 hours ago'];
    return times[Math.floor(Math.random() * times.length)];
}

// Quick Action Functions
function manageCoursesAction() {
    showActionFeedback('Navigating to Course Management...', 'orange');
    
    setTimeout(() => {
        // Simulate navigation
        console.log('Opening Course Management');
        // window.location.href = 'manage-courses.html';
    }, 1000);
}

function manageStudentsAction() {
    showActionFeedback('Opening Student Management...', 'blue');
    
    setTimeout(() => {
        // Simulate navigation
        console.log('Opening Student Management');
        // window.location.href = 'manage-students.html';
    }, 1000);
}

// Show Action Feedback
function showActionFeedback(message, color) {
    // Create feedback notification
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'action-feedback';
    feedbackDiv.innerHTML = `
        <div class="feedback-content ${color}">
            <div class="feedback-spinner"></div>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .action-feedback {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1001;
            animation: slideInRight 0.3s ease-out;
        }
        
        .feedback-content {
            background: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            border-left: 4px solid;
            font-weight: 500;
            color: #374151;
        }
        
        .feedback-content.orange {
            border-left-color: #f59e0b;
        }
        
        .feedback-content.blue {
            border-left-color: #3b82f6;
        }
        
        .feedback-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid #e5e7eb;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(feedbackDiv);
    
    // Remove feedback after 3 seconds
    setTimeout(() => {
        if (feedbackDiv.parentNode) {
            feedbackDiv.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                feedbackDiv.parentNode.removeChild(feedbackDiv);
                document.head.removeChild(style);
            }, 300);
        }
    }, 3000);
}

// Chart Update Functions
function updateChartData() {
    if (window.activityChart) {
        const newData = Array.from({length: 7}, () => Math.floor(Math.random() * 100) + 20);
        window.activityChart.data.datasets[0].data = newData;
        window.activityChart.update('active');
    }
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.createElement('div');
    searchInput.innerHTML = `
        <div class="search-container">
            <input type="text" id="dashboardSearch" placeholder="Search dashboard..." class="search-input">
            <button class="search-btn">🔍</button>
        </div>
    `;
    
    // Add search styles
    const searchStyles = `
        .search-container {
            position: relative;
            margin: 20px 0;
        }
        
        .search-input {
            width: 100%;
            padding: 12px 50px 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 25px;
            font-size: 14px;
            transition: all 0.3s ease;
            outline: none;
        }
        
        .search-input:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .search-btn {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            background: #3b82f6;
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
        .search-btn:hover {
            background: #1d4ed8;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = searchStyles;
    document.head.appendChild(styleSheet);
}

// Real-time Clock
function initializeRealTimeClock() {
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const dateString = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Update clock display if element exists
        const clockElement = document.getElementById('realTimeClock');
        if (clockElement) {
            clockElement.innerHTML = `
                <div class="clock-time">${timeString}</div>
                <div class="clock-date">${dateString}</div>
            `;
        }
    }
    
    // Update immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);
}

// Notification System
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.init();
    }
    
    init() {
        this.createContainer();
        this.addStyles();
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'notificationContainer';
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    }
    
    addStyles() {
        const styles = `
            .notification-container {
                position: fixed;
                top: 90px;
                right: 20px;
                z-index: 1002;
                max-width: 350px;
            }
            
            .notification {
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                margin-bottom: 10px;
                padding: 16px;
                border-left: 4px solid;
                animation: slideInNotification 0.3s ease-out;
                cursor: pointer;
                transition: transform 0.2s ease;
            }
            
            .notification:hover {
                transform: translateX(-5px);
            }
            
            .notification.success { border-left-color: #10b981; }
            .notification.error { border-left-color: #ef4444; }
            .notification.warning { border-left-color: #f59e0b; }
            .notification.info { border-left-color: #3b82f6; }
            
            .notification-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
            }
            
            .notification-title {
                font-weight: 600;
                color: #1f2937;
                font-size: 14px;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 16px;
                cursor: pointer;
                color: #9ca3af;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-message {
                color: #6b7280;
                font-size: 13px;
                line-height: 1.4;
            }
            
            .notification-time {
                color: #9ca3af;
                font-size: 11px;
                margin-top: 5px;
            }
            
            @keyframes slideInNotification {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutNotification {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    show(title, message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const currentTime = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        notification.innerHTML = `
            <div class="notification-header">
                <div class="notification-title">${title}</div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="notification-message">${message}</div>
            <div class="notification-time">${currentTime}</div>
        `;
        
        this.container.appendChild(notification);
        this.notifications.push(notification);
        
        // Auto remove after duration
        setTimeout(() => {
            this.remove(notification);
        }, duration);
        
        // Remove on click
        notification.addEventListener('click', (e) => {
            if (!e.target.classList.contains('notification-close')) {
                this.remove(notification);
            }
        });
    }
    
    remove(notification) {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutNotification 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                this.notifications = this.notifications.filter(n => n !== notification);
            }, 300);
        }
    }
    
    clear() {
        this.notifications.forEach(notification => this.remove(notification));
    }
}

// Initialize notification system with error handling
let notificationSystem;

try {
    notificationSystem = new NotificationSystem();
} catch (error) {
    console.error('Failed to initialize notification system:', error);
    // Fallback notification functions
    notificationSystem = {
        show: function(title, message, type) {
            console.log(`${type.toUpperCase()}: ${title} - ${message}`);
            alert(`${title}: ${message}`);
        }
    };
}

// Utility Functions with null checks
function showSuccessMessage(title, message) {
    if (notificationSystem && typeof notificationSystem.show === 'function') {
        notificationSystem.show(title, message, 'success');
    } else {
        console.log(`SUCCESS: ${title} - ${message}`);
    }
}

function showErrorMessage(title, message) {
    if (notificationSystem && typeof notificationSystem.show === 'function') {
        notificationSystem.show(title, message, 'error');
    } else {
        console.error(`ERROR: ${title} - ${message}`);
    }
}

function showWarningMessage(title, message) {
    if (notificationSystem && typeof notificationSystem.show === 'function') {
        notificationSystem.show(title, message, 'warning');
    } else {
        console.warn(`WARNING: ${title} - ${message}`);
    }
}

function showInfoMessage(title, message) {
    if (notificationSystem && typeof notificationSystem.show === 'function') {
        notificationSystem.show(title, message, 'info');
    } else {
        console.info(`INFO: ${title} - ${message}`);
    }
}

// Data Export Functions
function exportDashboardData() {
    const data = {
        timestamp: new Date().toISOString(),
        stats: {
            totalStudents: document.getElementById('totalStudents')?.textContent || '0',
            activeTeachers: document.getElementById('activeTeachers')?.textContent || '0',
            totalCourses: document.getElementById('totalCourses')?.textContent || '0',
            lastUpdated: document.getElementById('lastUpdated')?.textContent || 'Unknown'
        },
        chartData: window.activityChart ? window.activityChart.data : null
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSuccessMessage('Export Complete', 'Dashboard data has been exported successfully.');
}

// Keyboard Shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + R to refresh stats
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            updateStats();
            showInfoMessage('Stats Refreshed', 'Dashboard statistics have been updated.');
        }
        
        // Ctrl/Cmd + E to export data
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            exportDashboardData();
        }
        
        // Ctrl/Cmd + M to toggle mobile menu
        if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
            e.preventDefault();
            const mobileToggle = document.getElementById('mobileMenuToggle');
            if (mobileToggle) {
                mobileToggle.click();
            }
        }
        
        // Escape to clear notifications
        if (e.key === 'Escape') {
            notificationSystem.clear();
        }
    });
}

// Performance Monitoring
function initializePerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', function() {
        setTimeout(() => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Dashboard loaded in ${loadTime}ms`);
            
            if (loadTime > 3000) {
                showWarningMessage('Slow Loading', 'Dashboard took longer than expected to load.');
            }
        }, 1000);
    });
    
    // Monitor memory usage (if available)
    if ('memory' in performance) {
        setInterval(() => {
            const memory = performance.memory;
            if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
                console.warn('High memory usage detected');
            }
        }, 60000); // Check every minute
    }
}

// Theme Toggle (Optional)
function initializeThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌙';
    themeToggle.title = 'Toggle Dark Mode';
    
    const themeStyles = `
        .theme-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: #1f2937;
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        
        .theme-toggle:hover {
            transform: scale(1.1);
            background: #374151;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = themeStyles;
    document.head.appendChild(styleSheet);
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        
        showInfoMessage('Theme Changed', `Switched to ${isDark ? 'dark' : 'light'} mode.`);
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '☀️';
    }
    
    document.body.appendChild(themeToggle);
}

// Final Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all additional features
    setTimeout(() => {
        initializeSearch();
        initializeRealTimeClock();
        initializeKeyboardShortcuts();
        initializePerformanceMonitoring();
        initializeThemeToggle();
        
        // Show welcome notification
        setTimeout(() => {
            showSuccessMessage('Welcome Back!', 'EduNova Admin Dashboard is ready to use.');
        }, 1500);
        
    }, 2000);
});

// Error Handling with better error detection
window.addEventListener('error', function(e) {
    console.error('Dashboard Error:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error
    });
    
    // Only show error message if it's a real error (not null)
    if (e.error && e.message && e.message !== 'Script error.') {
        showErrorMessage('System Error', `An error occurred: ${e.message}. Please refresh the page if issues persist.`);
    }
});

// Unhandled Promise Rejection Handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    if (e.reason) {
        showErrorMessage('Promise Error', 'An async operation failed. Please try again.');
    }
});

// Service Worker Registration (for offline support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment if you have a service worker
        /*
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('ServiceWorker registration failed: ', registrationError);
            });
        */
    });
}

console.log('✅ EduNova Admin Dashboard fully loaded and initialized!');