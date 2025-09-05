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
    
    // Update last login
    const lastLoginCard = document.querySelector('.stat-card:nth-child(4) .stat-info p');
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

// Quick action functions with backend integration
async function manageCourses() {
    try {
        showNotification('Opening Course Management...', 'info');
        
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        
        if (!token) {
            showNotification('Please login to access course management', 'error');
            return;
        }
        
        // Call backend quick action API
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
            
            // Redirect to course management page
            setTimeout(() => {
                window.location.href = 'mcources.html';
            }, 1000);
        } else {
            showNotification('Failed to open course management', 'error');
        }
        
    } catch (error) {
        console.error('Error opening course management:', error);
        showNotification('Error opening course management', 'error');
        
        // Fallback redirect
        setTimeout(() => {
            window.location.href = 'mcources.html';
        }, 1000);
    }
}

async function manageStudents() {
    try {
        showNotification('Opening Student Management...', 'info');
        
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        
        if (!token) {
            showNotification('Please login to access student management', 'error');
            return;
        }
        
        // Call backend quick action API
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
            
            // Redirect to student management page
            setTimeout(() => {
                window.location.href = 'mstudent.html';
            }, 1000);
        } else {
            showNotification('Failed to open student management', 'error');
        }
        
    } catch (error) {
        console.error('Error opening student management:', error);
        showNotification('Error opening student management', 'error');
        
        // Fallback redirect
        setTimeout(() => {
            window.location.href = 'mstudent.html';
        }, 1000);
    }
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