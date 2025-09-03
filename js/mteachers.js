// Teachers data storage
let teachers = [];
let editingTeacherId = null;

// API Base URL (match current origin to avoid localhost/127.0.0.1 mismatch)
const API_BASE_URL = `${window.location.origin}/api`;

// Get JWT token from localStorage
function getAuthToken() {
    return localStorage.getItem('adminToken');
}

// Check if user is authenticated
function isAuthenticated() {
    const token = getAuthToken();
    return token && token !== 'null';
}

// DOM elements
const teacherForm = {
    name: null,
    subject: null,
    contact: null,
    email: null
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!isAuthenticated()) {
        showNotification('Please login to access this page', 'error');
        setTimeout(() => {
            window.location.href = 'adminlogin.html';
        }, 2000);
        return;
    }
    
    initializeForm();
    loadTeachers();
    setupEventListeners();
});

// Initialize form elements
function initializeForm() {
    teacherForm.name = document.getElementById('teacherName');
    teacherForm.subject = document.getElementById('teacherSubject');
    teacherForm.contact = document.getElementById('contactNo');
    teacherForm.email = document.getElementById('email');
}

// Load teachers from API
async function loadTeachers() {
    try {
        const response = await fetch(`${API_BASE_URL}/teachers`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            teachers = data.teachers || [];
            renderTeachersTable();
        } else {
            const errorData = await response.json();
            showNotification(errorData.message || 'Failed to load teachers', 'error');
        }
    } catch (error) {
        console.error('Error loading teachers:', error);
        showNotification('Failed to load teachers. Please check your connection.', 'error');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Form validation on input
    Object.values(teacherForm).forEach(input => {
        if (input) {
            input.addEventListener('input', validateForm);
        }
    });

    // Logout button functionality
    const logoutButtons = document.querySelectorAll('.logout-btn, .sidebar-logout');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });

    // Navigation active state and functionality
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the href from the clicked nav item
            const href = this.getAttribute('href');
            if (href && href !== '#' && href !== 'mteachers.html') {
                // Navigate to the page
                window.location.href = href;
            }
        });
    });
    
    // Header navigation functionality
    const headerNavLinks = document.querySelectorAll('.header-nav .nav-link');
    headerNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                window.location.href = href;
            }
        });
    });
}

// Validate form inputs
function validateForm() {
    const name = teacherForm.name.value.trim();
    const subject = teacherForm.subject.value;
    const contact = teacherForm.contact.value.trim();
    const email = teacherForm.email.value.trim();

    // Basic validation
    const isNameValid = name.length >= 2;
    const isSubjectValid = subject !== '';
    const isContactValid = /^\d{10}$/.test(contact.replace(/\D/g, ''));
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Visual feedback
    updateInputValidation(teacherForm.name, isNameValid);
    updateInputValidation(teacherForm.subject, isSubjectValid);
    updateInputValidation(teacherForm.contact, isContactValid);
    updateInputValidation(teacherForm.email, isEmailValid);

    return isNameValid && isSubjectValid && isContactValid && isEmailValid;
}

// Update input validation styling
function updateInputValidation(input, isValid) {
    if (input.value.trim() === '') {
        input.style.borderColor = '#e5e7eb';
        return;
    }
    
    input.style.borderColor = isValid ? '#10b981' : '#ef4444';
}

// Add or update teacher
async function addTeacher() {
    if (!validateForm()) {
        showNotification('Please fill all fields correctly', 'error');
        return;
    }

    const teacherData = {
        name: teacherForm.name.value.trim(),
        subject: teacherForm.subject.value,
        contact: teacherForm.contact.value.trim(),
        email: teacherForm.email.value.trim()
    };

    try {
        const url = editingTeacherId 
            ? `${API_BASE_URL}/teachers/${editingTeacherId}`
            : `${API_BASE_URL}/teachers`;
        
        const method = editingTeacherId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(teacherData)
        });

        if (response.ok) {
            const data = await response.json();
            showNotification(data.message, 'success');
            clearForm();
            editingTeacherId = null;
            
            // Reset button text
            const addBtn = document.querySelector('.btn-primary');
            addBtn.textContent = 'Add Teacher';
            
            // Reload teachers
            await loadTeachers();
        } else {
            const errorData = await response.json();
            showNotification(errorData.message || 'Failed to save teacher', 'error');
        }
    } catch (error) {
        console.error('Error saving teacher:', error);
        showNotification('Failed to save teacher. Please check your connection.', 'error');
    }
}

// Clear form inputs
function clearForm() {
    Object.values(teacherForm).forEach(input => {
        if (input) {
            input.value = '';
            input.style.borderColor = '#e5e7eb';
        }
    });
    
    // Reset editing state
    editingTeacherId = null;
    
    // Reset button text
    const addBtn = document.querySelector('.btn-primary');
    if (addBtn) {
        addBtn.textContent = 'Add Teacher';
    }
}

// Render teachers table
function renderTeachersTable() {
    const tbody = document.getElementById('teachersTableBody');
    
    if (teachers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <div class="empty-state-icon">👨‍🏫</div>
                    <div class="empty-state-text">No teachers found</div>
                    <div class="empty-state-subtext">Add your first teacher to get started</div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = teachers.map((teacher) => `
        <tr>
            <td>${escapeHtml(teacher.name)}</td>
            <td>${escapeHtml(teacher.subject)}</td>
            <td>${escapeHtml(teacher.contact)}</td>
            <td>${escapeHtml(teacher.email)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-secondary btn-small" onclick="editTeacher('${teacher._id}')">
                        Edit
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteTeacher('${teacher._id}')">
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Edit teacher
function editTeacher(teacherId) {
    const teacher = teachers.find(t => t._id === teacherId);
    
    if (!teacher) {
        showNotification('Teacher not found', 'error');
        return;
    }
    
    teacherForm.name.value = teacher.name;
    teacherForm.subject.value = teacher.subject;
    teacherForm.contact.value = teacher.contact;
    teacherForm.email.value = teacher.email;
    
    editingTeacherId = teacherId;
    
    // Update button text
    const addBtn = document.querySelector('.btn-primary');
    addBtn.textContent = 'Update Teacher';
    
    // Scroll to form
    document.querySelector('.teacher-form').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Delete teacher
async function deleteTeacher(teacherId) {
    const teacher = teachers.find(t => t._id === teacherId);
    
    if (!teacher) {
        showNotification('Teacher not found', 'error');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${teacher.name}?`)) {
        try {
            const response = await fetch(`${API_BASE_URL}/teachers/${teacherId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                showNotification(data.message, 'success');
                
                // Reset form if we were editing this teacher
                if (editingTeacherId === teacherId) {
                    clearForm();
                    editingTeacherId = null;
                    const addBtn = document.querySelector('.btn-primary');
                    addBtn.textContent = 'Add Teacher';
                }
                
                // Reload teachers
                await loadTeachers();
            } else {
                const errorData = await response.json();
                showNotification(errorData.message || 'Failed to delete teacher', 'error');
            }
        } catch (error) {
            console.error('Error deleting teacher:', error);
            showNotification('Failed to delete teacher. Please check your connection.', 'error');
        }
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 24px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });

    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#10b981';
            break;
        case 'error':
            notification.style.backgroundColor = '#ef4444';
            break;
        default:
            notification.style.backgroundColor = '#3b82f6';
    }

    // Add to DOM and animate in
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logging out...', 'info');
        
        // Clear authentication token
        localStorage.removeItem('adminToken');
        
        setTimeout(() => {
            window.location.href = 'adminlogin.html';
        }, 1000);
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Search functionality (for future enhancement)
function searchTeachers(query) {
    const filteredTeachers = teachers.filter(teacher => 
        teacher.name.toLowerCase().includes(query.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(query.toLowerCase()) ||
        teacher.email.toLowerCase().includes(query.toLowerCase())
    );
    
    return filteredTeachers;
}

// Export data functionality (for future enhancement)
function exportTeachers() {
    const csvContent = [
        ['Name', 'Subject', 'Contact No', 'Email'],
        ...teachers.map(teacher => [
            teacher.name,
            teacher.subject,
            teacher.contact,
            teacher.email
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teachers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}
