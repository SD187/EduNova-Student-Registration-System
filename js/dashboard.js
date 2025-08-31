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
    
    // Update last login time
    updateLastLoginTime();
    
    // Start real-time updates
    startRealTimeUpdates();
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
        case 'settings':
            showNotification('Loading Settings...', 'info');
            break;
        default:
            showNotification('Loading Dashboard...', 'info');
    }
}

// Load dashboard data
function loadDashboardData() {
    // Simulate loading data
    const stats = {
        students: 500,
        admins: 1,
        courses: 6,
        lastLogin: '2 hours ago'
    };
    
    // Update activity stats with animation
    animateNumbers();
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
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Chart data
    const data = [30, 45, 35, 50, 65, 55, 70, 60, 75, 80, 70, 85];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
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

// Quick action functions
function manageCourses() {
    showNotification('Redirecting to Course Management...', 'success');
    setTimeout(() => {
        // Redirect to courses page
        window.location.href = 'manageCourses.html';
    }, 1500);
}

function manageStudents() {
    showNotification('Redirecting to Student Management...', 'success');
    setTimeout(() => {
        // Redirect to students page
        window.location.href = 'manageStudents.html';
    }, 1500);
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
// Dashboard Navigation - Add this to your dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    // Get all sidebar navigation links
    const navLinks = document.querySelectorAll('nav ul li a[data-page]');

    // Add click event listeners to sidebar links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const page = this.getAttribute('data-page');
            
            // Navigate based on data-page attribute
            switch(page) {
                case 'students':
                    window.location.href = 'mstudent.html';
                    break;
                case 'teachers':
                    window.location.href = 'mteachers.html';
                    break;
                case 'courses':
                    window.location.href = 'mcources.html';
                    break;
                case 'timetable':
                    window.location.href = 'mtime.html';
                    break;
                case 'settings':
                    window.location.href = 'settings.html';
                    break;
                case 'dashboard':
                    // Stay on current page or reload
                    window.location.href = 'Dashboard.html';
                    break;
            }
        });
    });
});

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