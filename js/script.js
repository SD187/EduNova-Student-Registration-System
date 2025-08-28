// Scroll reveal for cards
const cards = document.querySelectorAll('.stat-card, .offer-card');

function revealCards() {
  const windowHeight = window.innerHeight;
  cards.forEach(card => {
    const top = card.getBoundingClientRect().top;
    if(top < windowHeight - 100) {
      card.classList.add('show');
    }
  });
}

window.addEventListener('scroll', revealCards);
window.addEventListener('load', revealCards);

// Animated counters
const counters = document.querySelectorAll('.stat-card h2');
counters.forEach(counter => {
  const updateCount = () => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const increment = target / 100;
    if(count < target) {
      counter.innerText = Math.ceil(count + increment);
      setTimeout(updateCount, 20);
    } else {
      counter.innerText = target;
    }
  };
  updateCount();
});


document.addEventListener('DOMContentLoaded', () => {
  const steps = document.querySelectorAll('.wizard-steps .step');
  const subjectPanel = document.getElementById('panel-subjects');
  const gradePanel = document.getElementById('panel-grades');
  const resourcePanel = document.getElementById('panel-resources');

  const subjectCards = document.querySelectorAll('.subject-card');
  const gradeBtns = document.querySelectorAll('.grade-btn');
  const resourceCards = document.querySelectorAll('.resource-card');

  const chosenSubjectEl = document.getElementById('chosenSubject');
  const chosenGradeEl = document.getElementById('chosenGrade');
  const subjectChip = document.querySelector('.subject-chip');
  const gradeChip = document.querySelector('.grade-chip');

  const summarySubject = document.getElementById('summarySubject');
  const summaryGrade = document.getElementById('summaryGrade');

  let chosenSubject = null;
  let chosenGrade = null;

  // Helpers
  const setStep = (n) => {
    steps.forEach(s => s.classList.remove('active'));
    const stepEl = document.querySelector(`.wizard-steps .step[data-step="${n}"]`);
    if(stepEl) stepEl.classList.add('active');
  };

  const showPanel = (panel) => {
    [subjectPanel, gradePanel, resourcePanel].forEach(p => p.classList.remove('active'));
    panel.classList.add('active');
  };

  const slugify = (str) => str.toString().toLowerCase().trim().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');

  // Subject click → go to Grade panel
  subjectCards.forEach(card => {
    card.addEventListener('click', () => {
      chosenSubject = card.getAttribute('data-subject');
      chosenSubjectEl.textContent = chosenSubject;
      subjectChip.hidden = false;

      setStep(2);
      showPanel(gradePanel);
    });
  });

  // Back to Subjects
  document.querySelectorAll('[data-back="subjects"]').forEach(btn => {
    btn.addEventListener('click', () => {
      setStep(1);
      showPanel(subjectPanel);
      // reset deeper selections
      chosenGrade = null;
      chosenGradeEl.textContent = '';
      gradeChip.hidden = true;
    });
  });

  // Grade click → go to Resources panel
  gradeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      chosenGrade = btn.getAttribute('data-grade');
      chosenGradeEl.textContent = `Grade ${chosenGrade}`;
      gradeChip.hidden = false;

      // update summary
      summarySubject.textContent = chosenSubject;
      summaryGrade.textContent = `Grade ${chosenGrade}`;

      setStep(3);
      showPanel(resourcePanel);
    });
  });

  // Back to Grades
  document.querySelectorAll('[data-back="grades"]').forEach(btn => {
    btn.addEventListener('click', () => {
      setStep(2);
      showPanel(gradePanel);
    });
  });

  // Resource click → navigate to materials.html with query params
  resourceCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      if(!chosenSubject || !chosenGrade) return;

      const type = card.getAttribute('data-type'); // pastpapers | modelpapers | studyresources
      const subjectSlug = slugify(chosenSubject);
      const url = `materials.html?subject=${encodeURIComponent(subjectSlug)}&grade=${encodeURIComponent(chosenGrade)}&type=${encodeURIComponent(type)}`;
      window.location.href = url;
    });
  });
});

//admin dashboard


// Chart.js configuration
document.addEventListener('DOMContentLoaded', function() {
  initializeChart();
  initializeEventListeners();
  startRealTimeUpdates();
});

function initializeChart() {
  const ctx = document.getElementById('activityChart').getContext('2d');
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


