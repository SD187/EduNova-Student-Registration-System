// DOM elements
const addCourseBtn = document.querySelector('.add-course-btn');
const updateCourseBtn = document.querySelector('.update-course-btn');
const viewCoursesBtn = document.querySelector('.view-courses-btn');
const gradeSelect = document.getElementById('grade-select');
const subjectSelect = document.getElementById('subject-select');
const googleDriveInput = document.getElementById('google-drive-link');
const statusMessage = document.getElementById('statusMessage');
const navLinks = document.querySelectorAll('.nav-link');
const headerNavLinks = document.querySelectorAll('.header-nav-link');
const logoutBtn = document.querySelector('.logout-btn');
const coursesListContainer = document.getElementById('coursesListContainer');
const coursesGrid = document.getElementById('coursesGrid');

// In-memory storage for the application state
let appState = {
    courses: [],
    currentUser: 'Admin User',
    currentPage: 'courses',
    activityLog: [],
    selectedCourse: null
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

function validateGoogleDriveUrl(url) {
    // Comprehensive validation for Google Drive URLs
    const googleDrivePatterns = [
        /^https:\/\/drive\.google\.com\/drive\/folders\/[a-zA-Z0-9_\-]+/,
        /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_\-]+/,
        /^https:\/\/drive\.google\.com\/open\?id=[a-zA-Z0-9_\-]+/,
        /^https:\/\/docs\.google\.com\/document\/d\/[a-zA-Z0-9_\-]+/,
        /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9_\-]+/,
        /^https:\/\/docs\.google\.com\/presentation\/d\/[a-zA-Z0-9_\-]+/
    ];
    
    return googleDrivePatterns.some(pattern => pattern.test(url));
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
    
    appState.activityLog.push({
        timestamp,
        action,
        details,
        user: appState.currentUser
    });
}

function generateCourseId() {
    return 'course_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Main event handlers
function handleAddCourse() {
    const grade = gradeSelect.value;
    const subject = subjectSelect.value;
    const driveLink = googleDriveInput.value.trim();
    
    // Validation
    if (!grade) {
        showMessage('Please select a grade!', 'error');
        gradeSelect.focus();
        return;
    }
    
    if (!subject) {
        showMessage('Please select a subject!', 'error');
        subjectSelect.focus();
        return;
    }
    
    if (!driveLink) {
        showMessage('Please provide a Google Drive link!', 'error');
        googleDriveInput.focus();
        return;
    }
    
    if (!validateGoogleDriveUrl(driveLink)) {
        showMessage('Please enter a valid Google Drive URL!', 'error');
        googleDriveInput.focus();
        return;
    }
    
    // Check for duplicate courses
    const isDuplicate = appState.courses.some(course => 
        course.grade === grade && course.subject === subject && course.status === 'active'
    );
    
    if (isDuplicate) {
        showMessage('A course for this grade and subject already exists! Use Update Course instead.', 'error');
        return;
    }
    
    addLoadingState(addCourseBtn);
    
    // Simulate API call
    setTimeout(() => {
        const newCourse = {
            id: generateCourseId(),
            grade: grade,
            subject: subject,
            driveLink: driveLink,
            dateAdded: new Date().toISOString(),
            status: 'active',
            addedBy: appState.currentUser
        };
        
        appState.courses.push(newCourse);
        
        removeLoadingState(addCourseBtn);
        showMessage(`Course added successfully! ${getGradeDisplayName(grade)} - ${getSubjectDisplayName(subject)} is now available.`, 'success');
        
        // Clear form
        clearForm();
        
        // Log activity
        logActivity('ADD_COURSE', { 
            courseId: newCourse.id,
            grade: grade,
            subject: subject,
            driveLink: driveLink
        });
        
        // Update courses display if visible
        if (coursesListContainer.style.display !== 'none') {
            displayCourses();
        }
        
    }, 1200);
}

function handleUpdateCourse() {
    const grade = gradeSelect.value;
    const subject = subjectSelect.value;
    const driveLink = googleDriveInput.value.trim();
    
    // Validation
    if (!grade) {
        showMessage('Please select a grade to update!', 'error');
        gradeSelect.focus();
        return;
    }
    
    if (!subject) {
        showMessage('Please select a subject to update!', 'error');
        subjectSelect.focus();
        return;
    }
    
    if (!driveLink) {
        showMessage('Please provide a Google Drive link!', 'error');
        googleDriveInput.focus();
        return;
    }
    
    if (!validateGoogleDriveUrl(driveLink)) {
        showMessage('Please enter a valid Google Drive URL!', 'error');
        googleDriveInput.focus();
        return;
    }
    
    // Find existing course
    const existingCourseIndex = appState.courses.findIndex(course => 
        course.grade === grade && course.subject === subject && course.status === 'active'
    );
    
    if (existingCourseIndex === -1) {
        showMessage('No existing course found for this grade and subject. Use Add Course instead.', 'error');
        return;
    }
    
    addLoadingState(updateCourseBtn);
    
    // Simulate API call
    setTimeout(() => {
        const oldCourse = appState.courses[existingCourseIndex];
        
        appState.courses[existingCourseIndex] = {
            ...oldCourse,
            driveLink: driveLink,
            dateUpdated: new Date().toISOString(),
            previousDriveLink: oldCourse.driveLink,
            updatedBy: appState.currentUser
        };
        
        removeLoadingState(updateCourseBtn);
        showMessage(`Course updated successfully! ${getGradeDisplayName(grade)} - ${getSubjectDisplayName(subject)} link has been updated.`, 'success');
        
        // Clear form
        clearForm();
        
        // Log activity
        logActivity('UPDATE_COURSE', { 
            courseId: oldCourse.id,
            grade: grade,
            subject: subject,
            oldLink: oldCourse.driveLink,
            newLink: driveLink
        });
        
        // Update courses display if visible
        if (coursesListContainer.style.display !== 'none') {
            displayCourses();
        }
        
    }, 1200);
}

function handleViewCourses() {
    if (coursesListContainer.style.display === 'none' || coursesListContainer.style.display === '') {
        displayCourses();
        coursesListContainer.style.display = 'block';
        viewCoursesBtn.textContent = 'Hide Courses';
        showMessage('Displaying all uploaded courses.', 'info');
    } else {
        coursesListContainer.style.display = 'none';
        viewCoursesBtn.textContent = 'View All Courses';
        showMessage('Courses list hidden.', 'info');
    }
    
    logActivity('TOGGLE_COURSES_VIEW', { 
        visible: coursesListContainer.style.display !== 'none'
    });
}

// Display functions
function displayCourses() {
    const activeCourses = appState.courses.filter(course => course.status === 'active');
    
    if (activeCourses.length === 0) {
        coursesGrid.innerHTML = `
            <div class="empty-state">
                <span class="icon">📚</span>
                <h3>No Courses Found</h3>
                <p>Add your first course using the form above.</p>
            </div>
        `;
        return;
    }
    
    coursesGrid.innerHTML = activeCourses.map(course => `
        <div class="course-card" data-course-id="${course.id}">
            <h3>${getGradeDisplayName(course.grade)} - ${getSubjectDisplayName(course.subject)}</h3>
            <div class="course-info">
                <span class="grade">${getGradeDisplayName(course.grade)}</span>
                <span class="subject">${getSubjectDisplayName(course.subject)}</span>
            </div>
            <a href="${course.driveLink}" target="_blank" class="drive-link">
                📁 ${course.driveLink.substring(0, 50)}${course.driveLink.length > 50 ? '...' : ''}
            </a>
            <div class="date-added">
                Added: ${new Date(course.dateAdded).toLocaleDateString()}
                ${course.dateUpdated ? `| Updated: ${new Date(course.dateUpdated).toLocaleDateString()}` : ''}
            </div>
        </div>
    `).join('');
}

// Helper functions
function getGradeDisplayName(gradeValue) {
    const gradeMap = {
        'grade-1': 'Grade 1',
        'grade-2': 'Grade 2',
        'grade-3': 'Grade 3',
        'grade-4': 'Grade 4',
        'grade-5': 'Grade 5',
        'grade-6': 'Grade 6',
        'grade-7': 'Grade 7',
        'grade-8': 'Grade 8',
        'grade-9': 'Grade 9',
        'grade-10': 'Grade 10',
        'grade-11': 'Grade 11',
        'grade-12': 'Grade 12'
    };
    return gradeMap[gradeValue] || gradeValue;
}

function getSubjectDisplayName(subjectValue) {
    const subjectMap = {
        'mathematics': 'Mathematics',
        'science': 'Science',
        'english': 'English',
        'history': 'History',
        'geography': 'Geography',
        'physics': 'Physics',
        'chemistry': 'Chemistry',
        'biology': 'Biology',
        'computer-science': 'Computer Science',
        'art': 'Art',
        'music': 'Music',
        'physical-education': 'Physical Education'
    };
    return subjectMap[subjectValue] || subjectValue;
}

function clearForm() {
    gradeSelect.value = '';
    subjectSelect.value = '';
    googleDriveInput.value = '';
    
    // Reset validation styles
    gradeSelect.classList.remove('valid', 'invalid');
    subjectSelect.classList.remove('valid', 'invalid');
    googleDriveInput.classList.remove('valid', 'invalid');
    googleDriveInput.style.borderColor = '#e9ecef';
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
                courses: [],
                currentUser: '',
                currentPage: 'dashboard',
                activityLog: [],
                selectedCourse: null
            };
            
            // Reset form
            clearForm();
            
            // Reset navigation states
            navLinks.forEach(link => link.classList.remove('active'));
            headerNavLinks.forEach(link => link.classList.remove('active'));
            
            // Hide courses list
            coursesListContainer.style.display = 'none';
            viewCoursesBtn.textContent = 'View All Courses';
            
            console.log('User logged out successfully');
            showMessage('You have been logged out successfully! Redirecting to login page...', 'success');
            
        }, 1500);
    }
}

// Form validation and input handlers
function validateForm() {
    const grade = gradeSelect.value;
    const subject = subjectSelect.value;
    const driveLink = googleDriveInput.value.trim();
    
    let isValid = true;
    
    // Validate grade
    if (grade) {
        gradeSelect.classList.remove('invalid');
        gradeSelect.classList.add('valid');
    } else {
        gradeSelect.classList.remove('valid');
        if (gradeSelect.classList.contains('touched')) {
            gradeSelect.classList.add('invalid');
            isValid = false;
        }
    }
    
    // Validate subject
    if (subject) {
        subjectSelect.classList.remove('invalid');
        subjectSelect.classList.add('valid');
    } else {
        subjectSelect.classList.remove('valid');
        if (subjectSelect.classList.contains('touched')) {
            subjectSelect.classList.add('invalid');
            isValid = false;
        }
    }
    
    // Validate Google Drive link
    if (driveLink && validateGoogleDriveUrl(driveLink)) {
        googleDriveInput.classList.remove('invalid');
        googleDriveInput.classList.add('valid');
        googleDriveInput.style.borderColor = '#28a745';
    } else if (driveLink) {
        googleDriveInput.classList.remove('valid');
        googleDriveInput.classList.add('invalid');
        googleDriveInput.style.borderColor = '#dc3545';
        isValid = false;
    } else {
        googleDriveInput.classList.remove('valid', 'invalid');
        googleDriveInput.style.borderColor = '#e9ecef';
    }
    
    return isValid;
}

function handleSelectChange(event) {
    event.target.classList.add('touched');
    validateForm();
    
    const grade = gradeSelect.value;
    const subject = subjectSelect.value;
    
    if (grade && subject) {
        // Check if course already exists
        const existingCourse = appState.courses.find(course => 
            course.grade === grade && course.subject === subject && course.status === 'active'
        );
        
        if (existingCourse) {
            googleDriveInput.value = existingCourse.driveLink;
            showMessage(`Found existing course: ${getGradeDisplayName(grade)} - ${getSubjectDisplayName(subject)}`, 'info');
            appState.selectedCourse = existingCourse;
        } else {
            googleDriveInput.value = '';
            appState.selectedCourse = null;
        }
        
        validateForm();
    }
}

function handleInputChange() {
    googleDriveInput.classList.add('touched');
    validateForm();
}

function handleInputFocus() {
    googleDriveInput.parentElement.style.transform = 'scale(1.02)';
    googleDriveInput.parentElement.style.transition = 'transform 0.3s ease';
}

function handleInputBlur() {
    googleDriveInput.parentElement.style.transform = 'scale(1)';
}

// Keyboard shortcuts
function handleKeyPress(event) {
    // Ctrl + Enter for Add Course
    if (event.key === 'Enter' && event.ctrlKey) {
        event.preventDefault();
        if (gradeSelect.value && subjectSelect.value && googleDriveInput.value.trim()) {
            handleAddCourse();
        }
    }
    
    // Shift + Enter for Update Course
    if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault();
        if (gradeSelect.value && subjectSelect.value && googleDriveInput.value.trim()) {
            handleUpdateCourse();
        }
    }
    
    // Escape key to clear form
    if (event.key === 'Escape') {
        clearForm();
        showMessage('Form cleared.', 'info');
    }
}

// Data management functions
function getAllCourses() {
    return appState.courses;
}

function getActiveCourses() {
    return appState.courses.filter(course => course.status === 'active');
}

function getCoursesByGrade(grade) {
    return appState.courses.filter(course => course.grade === grade && course.status === 'active');
}

function getCoursesBySubject(subject) {
    return appState.courses.filter(course => course.subject === subject && course.status === 'active');
}

function deleteCourse(courseId) {
    const courseIndex = appState.courses.findIndex(course => course.id === courseId);
    if (courseIndex !== -1) {
        appState.courses[courseIndex].status = 'inactive';
        appState.courses[courseIndex].dateDeleted = new Date().toISOString();
        
        logActivity('DELETE_COURSE', { 
            courseId: courseId,
            grade: appState.courses[courseIndex].grade,
            subject: appState.courses[courseIndex].subject
        });
        
        displayCourses();
        showMessage('Course deleted successfully!', 'success');
        return true;
    }
    return false;
}

function exportCoursesData() {
    const dataToExport = {
        exportDate: new Date().toISOString(),
        totalCourses: appState.courses.length,
        activeCourses: getActiveCourses(),
        activityLog: appState.activityLog
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `edunova-courses-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    logActivity('EXPORT_COURSES_DATA', { courseCount: appState.courses.length });
    showMessage('Courses data exported successfully!', 'success');
}

function getCoursesStats() {
    const stats = {
        totalCourses: appState.courses.length,
        activeCourses: getActiveCourses().length,
        inactiveCourses: appState.courses.filter(course => course.status === 'inactive').length,
        gradeDistribution: {},
        subjectDistribution: {},
        lastUpdate: appState.courses.length > 0 ? 
            Math.max(...appState.courses.map(course => new Date(course.dateUpdated || course.dateAdded).getTime())) : null
    };
    
    // Calculate distributions
    getActiveCourses().forEach(course => {
        stats.gradeDistribution[course.grade] = (stats.gradeDistribution[course.grade] || 0) + 1;
        stats.subjectDistribution[course.subject] = (stats.subjectDistribution[course.subject] || 0) + 1;
    });
    
    console.log('📊 Courses Statistics:', stats);
    return stats;
}

// Initialize application
function initializeApp() {
    console.log('🚀 EduNova Courses Management initialized');
    
    // Set initial state
    appState.currentUser = 'Admin User';
    appState.currentPage = 'courses';
    
    // Show welcome message
    setTimeout(() => {
        showMessage('Welcome to EduNova Courses Management! Ready to manage course materials.', 'success');
    }, 500);
    
    // Log initialization
    logActivity('APP_INIT', { 
        user: appState.currentUser, 
        page: appState.currentPage,
        timestamp: new Date().toISOString()
    });
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

// Event listeners setup
function setupEventListeners() {
    // Button event listeners
    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', handleAddCourse);
    }
    
    if (updateCourseBtn) {
        updateCourseBtn.addEventListener('click', handleUpdateCourse);
    }
    
    if (viewCoursesBtn) {
        viewCoursesBtn.addEventListener('click', handleViewCourses);
    }
    
    // Form event listeners
    if (gradeSelect) {
        gradeSelect.addEventListener('change', handleSelectChange);
    }
    
    if (subjectSelect) {
        subjectSelect.addEventListener('change', handleSelectChange);
    }
    
    if (googleDriveInput) {
        googleDriveInput.addEventListener('input', handleInputChange);
        googleDriveInput.addEventListener('focus', handleInputFocus);
        googleDriveInput.addEventListener('blur', handleInputBlur);
        googleDriveInput.addEventListener('keydown', handleKeyPress);
    }
    
    // Navigation event listeners
    navLinks.forEach(link => {
        link.addEventListener('click', handleSidebarNavigation);
    });
    
    headerNavLinks.forEach(link => {
        link.addEventListener('click', handleHeaderNavigation);
    });
    
    // Logout event listener
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// DOM ready event
document.addEventListener('DOMContentLoaded', function() {
    try {
        setupEventListeners();
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
window.EduNovaCourses = {
    // Data access
    getAllCourses,
    getActiveCourses,
    getCoursesByGrade,
    getCoursesBySubject,
    getCoursesStats,
    
    // Data management
    deleteCourse,
    exportCoursesData,
    clearForm,
    
    // State access (read-only)
    get appState() { 
        return { ...appState }; 
    },
    
    // Utility functions
    validateUrl: validateGoogleDriveUrl,
    showMessage,
    logActivity,
    
    // Version info
    version: '1.0.0',
    lastUpdated: '2025-08-31'
};

// Console welcome message
console.log(`
🎓 EduNova Courses Management v${window.EduNovaCourses.version}
📅 Last Updated: ${window.EduNovaCourses.lastUpdated}
🔧 Developer Tools Available:
   - EduNovaCourses.getCoursesStats() - View courses statistics
   - EduNovaCourses.exportCoursesData() - Export all courses data
   - EduNovaCourses.getAllCourses() - View all courses
   - EduNovaCourses.appState - View current state
💡 Keyboard Shortcuts:
   - Ctrl + Enter: Add Course
   - Shift + Enter: Update Course  
   - Escape: Clear form
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