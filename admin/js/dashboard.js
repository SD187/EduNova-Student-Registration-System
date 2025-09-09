// Dashboard JavaScript

// Navigation handling
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupNavigation();
    loadDashboardData();
    createChart();
});

// Initialize dashboard
function initializeDashboard() {
    // Add welcome message
    console.log('EduNova Admin Dashboard Loaded');
    
    // Immediately reset all button states
    resetAllButtonStates();
    
    // Update last login time
    updateLastLoginTime();
    
    // Start real-time updates
    startRealTimeUpdates();
    
    // Setup quick action buttons
    setupQuickActionButtons();
    
    // Set active navigation based on current page
    setActiveNavigation();
    
    // Setup page visibility change listener
    setupPageVisibilityListener();
    
    // Additional reset after a short delay to ensure buttons are reset
    setTimeout(() => {
        resetAllButtonStates();
    }, 100);
}

// Setup navigation functionality
function setupNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar nav ul li a');
    const topNavLinks = document.querySelectorAll('.top-nav-links ul li a');
    
    // Sidebar navigation
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get page data
            const page = this.getAttribute('data-page');
            
            // Update page title
            updatePageTitle(page);
            
            // Load page content
            loadPageContent(page);
        });
    });
    
    // Top navigation
    topNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all top nav links
            topNavLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
}

// Update page title based on navigation
function updatePageTitle(page) {
    const pageTitle = document.querySelector('.page-title');
    const titles = {
        'dashboard': 'Admin Dashboard',
        'students': 'Manage Students',
        'teachers': 'Manage Teachers',
        'courses': 'Manage Courses',
        'timetable': 'Manage Time Table',
        'feedback': 'Manage Feedback',
        'settings': 'Settings'
    };
    
    if (pageTitle && titles[page]) {
        pageTitle.textContent = titles[page];
    }
}

// Load page content (placeholder for future implementation)
function loadPageContent(page) {
    console.log(`Loading ${page} page...`);
    
    // This would typically load different content based on the page
    // For now, we'll just show a message
    switch(page) {
        case 'students':
            showNotification('Loading Student Management...', 'info');
            break;
        case 'teachers':
            showNotification('Loading Teacher Management...', 'info');
            break;
        case 'courses':
            showNotification('Loading Course Management...', 'info');
            break;
        case 'timetable':
            showNotification('Loading Time Table Management...', 'info');
            break;
        case 'feedback':
            showNotification('Loading Feedback Management...', 'info');
            break;
        case 'settings':
            showNotification('Loading Settings...', 'info');
            break;
        default:
            showNotification('Loading Dashboard...', 'info');
    }
}

// Load dashboard data from backend API
async function loadDashboardData() {
    try {
        console.log('Loading dashboard data from backend...');
        
        // Get authentication token
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        
        if (!token) {
            console.error('No authentication token found');
            showNotification('Please login to access dashboard', 'error');
            return;
        }
        
        // Fetch dashboard statistics
        const statsResponse = await fetch('http://127.0.0.1:5000/api/dashboard/stats', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            updateStatCards(statsData.stats);
        } else {
            console.error('Failed to load dashboard stats');
            // Use fallback data
            const fallbackStats = {
                total_students: 0,
                total_courses: 0,
                total_admins: 1,
                recent_registrations: 0,
                pending_registrations: 0,
                completion_rate: 0,
                avg_rating: 4.8,
                last_login: 'Never'
            };
            updateStatCards(fallbackStats);
        }
        
        // Fetch activity data
        const activityResponse = await fetch('http://127.0.0.1:5000/api/dashboard/activity', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (activityResponse.ok) {
            const activityData = await activityResponse.json();
            updateActivityData(activityData.activity);
        } else {
            console.error('Failed to load activity data');
        }
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Failed to load dashboard data', 'error');
        
        // Use fallback data
        const fallbackStats = {
            total_students: 0,
            total_courses: 0,
            total_admins: 1,
            recent_registrations: 0,
            pending_registrations: 0,
            completion_rate: 0,
            avg_rating: 4.8,
            last_login: 'Never'
        };
        updateStatCards(fallbackStats);
    }
}

// Update stat cards with real data from backend
function updateStatCards(stats) {
    // Update total students
    const studentsCard = document.querySelector('.stat-card:nth-child(1) .stat-info p');
    if (studentsCard) {
        studentsCard.textContent = stats.total_students + ' +';
    }
    
    // Update active admins
    const adminsCard = document.querySelector('.stat-card:nth-child(2) .stat-info p');
    if (adminsCard) {
        adminsCard.textContent = stats.total_admins;
    }
    
    // Update total courses
    const coursesCard = document.querySelector('.stat-card:nth-child(3) .stat-info p');
    if (coursesCard) {
        coursesCard.textContent = stats.total_courses + ' +';
    }
    
    // Update total feedback
    const feedbackCard = document.getElementById('totalFeedbackCount');
    if (feedbackCard) {
        feedbackCard.textContent = stats.total_feedbacks || 0;
    }
    
    // Update last login
    const lastLoginCard = document.querySelector('.stat-card:nth-child(5) .stat-info p');
    if (lastLoginCard) {
        lastLoginCard.textContent = stats.last_login;
    }
    
    // Update activity stats
    const activityStats = document.querySelectorAll('.activity-stat .stat-number');
    if (activityStats.length >= 3) {
        activityStats[0].textContent = stats.recent_registrations;
        activityStats[1].textContent = stats.completion_rate + '%';
        activityStats[2].textContent = stats.avg_rating;
    }
    
    // Animate the numbers
    animateNumbers();
}

// Update activity data
function updateActivityData(activity) {
    console.log('Updating activity data:', activity);
    
    // Update chart with real data
    if (activity.chart_data) {
        updateChart(activity.chart_data);
    }
    
    // You can also update recent activities list if needed
    if (activity.recent_students) {
        console.log('Recent students:', activity.recent_students);
    }
}

// Animate numbers on page load
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number');
    
    numbers.forEach(numberElement => {
        const finalNumber = numberElement.textContent;
        const numericValue = parseInt(finalNumber) || 0;
        
        if (numericValue > 0) {
            animateCountUp(numberElement, 0, numericValue, 1500);
        }
    });
}

// Count up animation
function animateCountUp(element, start, end, duration) {
    const startTimestamp = performance.now();
    
    function step(timestamp) {
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        
        element.textContent = current + (element.textContent.includes('%') ? '%' : '');
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

// Create activity chart
function createChart() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) return;
    
    // Default chart data
    const defaultData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        enrollments: [45, 52, 38, 67],
        completions: [42, 48, 35, 62]
    };
    
    updateChart(defaultData);
}

// Update chart with real data
function updateChart(chartData) {
    const canvas = document.getElementById('activityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Use enrollment data for the chart
    const data = chartData.enrollments || [30, 45, 35, 50, 65, 55, 70, 60, 75, 80, 70, 85];
    const labels = chartData.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Chart styling
    const barWidth = width / data.length - 10;
    const maxValue = Math.max(...data);
    
    // Draw bars
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * (height - 40);
        const x = index * (barWidth + 10) + 20;
        const y = height - barHeight - 20;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#4f46e5');
        gradient.addColorStop(1, '#818cf8');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Add shadow
        ctx.shadowColor = 'rgba(79, 70, 229, 0.3)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;
    });
}

// Update last login time
function updateLastLoginTime() {
    const now = new Date();
    const loginTime = localStorage.getItem('lastLogin');
    
    if (loginTime) {
        const timeDiff = now - new Date(loginTime);
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        let timeString = '';
        if (hours > 0) {
            timeString = `${hours} hours ago`;
        } else if (minutes > 0) {
            timeString = `${minutes} minutes ago`;
        } else {
            timeString = 'Just now';
        }
        
        const lastLoginElement = document.querySelector('.stat-card:last-child .stat-info p');
        if (lastLoginElement) {
            lastLoginElement.textContent = timeString;
        }
    }
    
    // Update current login time
    localStorage.setItem('lastLogin', now.toISOString());
}

// Start real-time updates
function startRealTimeUpdates() {
    // Update stats every 30 seconds
    setInterval(() => {
        updateStats();
    }, 30000);
    
    // Update chart every 5 minutes
    setInterval(() => {
        createChart();
    }, 300000);
}

// Update statistics
function updateStats() {
    // Simulate real-time data updates
    const studentCount = 500 + Math.floor(Math.random() * 10);
    const courseCount = 6 + Math.floor(Math.random() * 2);
    
    const studentElement = document.querySelector('.stat-card:first-child .stat-info p');
    const courseElement = document.querySelector('.stat-card:nth-child(3) .stat-info p');
    
    if (studentElement) {
        studentElement.textContent = studentCount + ' +';
    }
    
    if (courseElement) {
        courseElement.textContent = courseCount + ' +';
    }
}

// Quick action functions with improved navigation and button state management
async function manageCourses() {
    console.log('manageCourses called');
    const button = event.target;
    const originalText = button.innerHTML;
    console.log('Button found:', button, 'Original text:', originalText);
    
    try {
        showNotification('Opening Course Management...', 'info');
        
        // Check authentication
        const token = localStorage.getItem('authToken') || localStorage.getItem('token') || localStorage.getItem('adminToken');
        
        if (!token) {
            showNotification('Please login to access course management', 'error');
            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'adminlogin.html';
            }, 2000);
            return;
        }
        
        // Show loading animation
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';
        button.disabled = true;
        
        // Try backend API call (optional)
        try {
            const response = await fetch('http://127.0.0.1:5000/api/dashboard/quick-actions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'manage_courses' })
            });
            
            if (response.ok) {
                const data = await response.json();
                showNotification(data.message, 'success');
            }
        } catch (apiError) {
            console.log('API call failed, using direct navigation');
        }
        
        // Navigate to course management page
        setTimeout(() => {
            window.location.href = 'Mcources.html';
        }, 800);
        
        // Safety timeout to reset button state (in case navigation fails)
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 5000);
        
    } catch (error) {
        console.error('Error opening course management:', error);
        showNotification('Opening Course Management...', 'info');
        
        // Reset button state on error
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Fallback redirect
        setTimeout(() => {
            window.location.href = 'Mcources.html';
        }, 1000);
    }
}

async function manageStudents() {
    const button = event.target;
    const originalText = button.innerHTML;
    
    try {
        showNotification('Opening Student Management...', 'info');
        
        // Check authentication
        const token = localStorage.getItem('authToken') || localStorage.getItem('token') || localStorage.getItem('adminToken');
        
        if (!token) {
            showNotification('Please login to access student management', 'error');
            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'adminlogin.html';
            }, 2000);
            return;
        }
        
        // Show loading animation
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';
        button.disabled = true;
        
        // Try backend API call (optional)
        try {
            const response = await fetch('http://127.0.0.1:5000/api/dashboard/quick-actions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'manage_students' })
            });
            
            if (response.ok) {
                const data = await response.json();
                showNotification(data.message, 'success');
            }
        } catch (apiError) {
            console.log('API call failed, using direct navigation');
        }
        
        // Navigate to student management page
        setTimeout(() => {
            window.location.href = 'mstudent.html';
        }, 800);
        
        // Safety timeout to reset button state (in case navigation fails)
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 5000);
        
    } catch (error) {
        console.error('Error opening student management:', error);
        showNotification('Opening Student Management...', 'info');
        
        // Reset button state on error
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Fallback redirect
        setTimeout(() => {
            window.location.href = 'mstudent.html';
        }, 1000);
    }
}

// Manage feedback function
async function manageFeedback() {
    const button = event.target;
    const originalText = button.innerHTML;
    
    try {
        showNotification('Opening Feedback Management...', 'info');
        
        const token = localStorage.getItem('authToken') || localStorage.getItem('token') || localStorage.getItem('adminToken');
        
        if (!token) {
            showNotification('Please login to access feedback management', 'error');
            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'adminlogin.html';
            }, 2000);
            return;
        }
        
        // Show loading animation
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';
        button.disabled = true;
        
        // Redirect to feedback management page
        setTimeout(() => {
            window.location.href = 'mfeedback.html';
        }, 800);
        
        // Safety timeout to reset button state (in case navigation fails)
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 5000);
        
    } catch (error) {
        console.error('Error opening feedback management:', error);
        showNotification('Error opening feedback management', 'error');
        
        // Reset button state on error
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Fallback redirect
        setTimeout(() => {
            window.location.href = 'mfeedback.html';
        }, 1000);
    }
}

// Show notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logging out...', 'info');
        
        // Clear session data
        localStorage.removeItem('adminSession');
        localStorage.removeItem('lastLogin');
        
        // Redirect to login page after 1 second
        setTimeout(() => {
            window.location.href = 'adminLogin.html';
        }, 1000);
    }
}
// Enhanced Dashboard Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Get all sidebar navigation links
    const navLinks = document.querySelectorAll('nav ul li a[data-page]');

    // Add click event listeners to sidebar links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const page = this.getAttribute('data-page');
            const currentPage = window.location.pathname.split('/').pop();
            
            // Don't navigate if already on the same page
            if (currentPage === getPageFileName(page)) {
                return;
            }
            
            // Show loading notification
            showNotification(`Navigating to ${getPageTitle(page)}...`, 'info');
            
            // Navigate based on data-page attribute
            setTimeout(() => {
                window.location.href = getPageFileName(page);
            }, 300);
        });
    });
});

// Helper function to get page file name
function getPageFileName(page) {
    const pageMap = {
        'dashboard': 'Dashboard.html',
        'students': 'mstudent.html',
        'teachers': 'mteachers.html',
        'courses': 'Mcources.html',
        'timetable': 'mtime.html',
        'feedback': 'mfeedback.html',
        'settings': 'settings.html'
    };
    return pageMap[page] || 'Dashboard.html';
}

// Helper function to get page title
function getPageTitle(page) {
    const titleMap = {
        'dashboard': 'Dashboard',
        'students': 'Student Management',
        'teachers': 'Teacher Management',
        'courses': 'Course Management',
        'timetable': 'Timetable Management',
        'feedback': 'Feedback Management',
        'settings': 'Settings'
    };
    return titleMap[page] || 'Dashboard';
}

// Setup quick action buttons
function setupQuickActionButtons() {
    // Reset all button states first
    resetAllButtonStates();
    
    // Add click handlers to quick action buttons using IDs
    const courseBtn = document.getElementById('manageCoursesBtn');
    const studentBtn = document.getElementById('manageStudentsBtn');
    const feedbackBtn = document.getElementById('manageFeedbackBtn');
    
    if (courseBtn) {
        courseBtn.addEventListener('click', manageCourses);
    }
    
    if (studentBtn) {
        studentBtn.addEventListener('click', manageStudents);
    }
    
    if (feedbackBtn) {
        feedbackBtn.addEventListener('click', manageFeedback);
    }
}

// Reset all button states to normal
function resetAllButtonStates() {
    console.log('resetAllButtonStates called');
    // Reset each button by ID for more reliability
    const courseBtn = document.getElementById('manageCoursesBtn');
    const studentBtn = document.getElementById('manageStudentsBtn');
    const feedbackBtn = document.getElementById('manageFeedbackBtn');
    
    console.log('Buttons found:', { courseBtn, studentBtn, feedbackBtn });
    
    if (courseBtn) {
        courseBtn.disabled = false;
        courseBtn.innerHTML = '<i class="fas fa-book"></i> MANAGE COURSES';
        console.log('Course button reset');
    }
    
    if (studentBtn) {
        studentBtn.disabled = false;
        studentBtn.innerHTML = '<i class="fas fa-user-graduate"></i> MANAGE STUDENTS';
        console.log('Student button reset');
    }
    
    if (feedbackBtn) {
        feedbackBtn.disabled = false;
        feedbackBtn.innerHTML = '<i class="fas fa-comments"></i> MANAGE FEEDBACK';
        console.log('Feedback button reset');
    }
}

// Setup page visibility change listener
function setupPageVisibilityListener() {
    // Reset button states when page becomes visible again
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            // Page is now visible, reset button states
            resetAllButtonStates();
        }
    });
    
    // Also reset button states when page loads (in case of back button)
    window.addEventListener('pageshow', function(event) {
        // Reset button states when page is shown (including back button)
        resetAllButtonStates();
    });
    
    // Reset button states when page focus is regained
    window.addEventListener('focus', function() {
        resetAllButtonStates();
    });
}

// Set active navigation based on current page
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop();
    const pageMap = {
        'Dashboard.html': 'dashboard',
        'mstudent.html': 'students',
        'mteachers.html': 'teachers',
        'Mcources.html': 'courses',
        'mtime.html': 'timetable',
        'mfeedback.html': 'feedback',
        'settings.html': 'settings'
    };
    
    const currentPageType = pageMap[currentPage];
    if (currentPageType) {
        // Remove active class from all links
        const allLinks = document.querySelectorAll('.sidebar nav ul li a');
        allLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to current page link
        const activeLink = document.querySelector(`.sidebar nav ul li a[data-page="${currentPageType}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Global function to reset button states (can be called from anywhere)
window.resetDashboardButtons = function() {
    resetAllButtonStates();
};

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear session data
        localStorage.removeItem('adminSession');
        localStorage.removeItem('lastLogin');
        
        // Navigate to logout page
        window.location.href = 'logout.html';
    }
}


// Header Navigation - Add this to your dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    // Get all header navigation links
    const headerLinks = document.querySelectorAll('.top-nav-links ul li a');

    // Add click event listeners to header links
    headerLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const linkText = this.textContent.trim().toLowerCase();
            
            // Navigate based on link text
            switch(linkText) {
                case 'home':
                    window.location.href = 'index.html';
                    break;
                case 'about us':
                    window.location.href = 'about.html';
                    break;
                case 'courses':
                    window.location.href = 'courses.html';
                    break;
                case 'time table':
                    window.location.href = 'timetable.html';
                    break;
                case 'contact':
                    window.location.href = 'contact.html';
                    break;
            }
        });
    });
});