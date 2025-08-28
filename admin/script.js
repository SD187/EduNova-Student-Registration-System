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