// Teachers data storage (in-memory)
let teachers = [];
let editingIndex = -1;

// DOM elements
const teacherForm = {
    name: null,
    subject: null,
    contact: null,
    email: null
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    renderTeachersTable();
    setupEventListeners();
});

// Initialize form elements
function initializeForm() {
    teacherForm.name = document.getElementById('teacherName');
    teacherForm.subject = document.getElementById('teacherSubject');
    teacherForm.contact = document.getElementById('contactNo');
    teacherForm.email = document.getElementById('email');
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

    // Navigation active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
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
function addTeacher() {
    if (!validateForm()) {
        showNotification('Please fill all fields correctly', 'error');
        return;
    }

    const teacherData = {
        name: teacherForm.name.value.trim(),
        subject: teacherForm.subject.value,
        contact: teacherForm.contact.value.trim(),
        email: teacherForm.email.value.trim(),
        id: editingIndex === -1 ? Date.now() : teachers[editingIndex].id
    };

    // Check for duplicate email
    const existingTeacher = teachers.find((teacher, index) => 
        teacher.email === teacherData.email && index !== editingIndex
    );

    if (existingTeacher) {
        showNotification('A teacher with this email already exists', 'error');
        return;
    }

    if (editingIndex === -1) {
        // Add new teacher
        teachers.push(teacherData);
        showNotification('Teacher added successfully', 'success');
    } else {
        // Update existing teacher
        teachers[editingIndex] = teacherData;
        showNotification('Teacher updated successfully', 'success');
        editingIndex = -1;
        
        // Reset button text
        const addBtn = document.querySelector('.btn-primary');
        addBtn.textContent = 'Add Teacher';
    }

    clearForm();
    renderTeachersTable();
}

// Clear form inputs
function clearForm() {
    Object.values(teacherForm).forEach(input => {
        if (input) {
            input.value = '';
            input.style.borderColor = '#e5e7eb';
        }
    });
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

    tbody.innerHTML = teachers.map((teacher, index) => `
        <tr>
            <td>${escapeHtml(teacher.name)}</td>
            <td>${escapeHtml(teacher.subject)}</td>
            <td>${escapeHtml(teacher.contact)}</td>
            <td>${escapeHtml(teacher.email)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-secondary btn-small" onclick="editTeacher(${index})">
                        Edit
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteTeacher(${index})">
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Edit teacher
function editTeacher(index) {
    const teacher = teachers[index];
    
    teacherForm.name.value = teacher.name;
    teacherForm.subject.value = teacher.subject;
    teacherForm.contact.value = teacher.contact;
    teacherForm.email.value = teacher.email;
    
    editingIndex = index;
    
    // Update button text
    const addBtn = document.querySelector('.btn-primary');
    addBtn.textContent = 'Update Teacher';
    
    // Scroll to form
    document.querySelector('.teacher-form').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Delete teacher
function deleteTeacher(index) {
    const teacher = teachers[index];
    
    if (confirm(`Are you sure you want to delete ${teacher.name}?`)) {
        teachers.splice(index, 1);
        renderTeachersTable();
        showNotification('Teacher deleted successfully', 'success');
        
        // Reset form if we were editing this teacher
        if (editingIndex === index) {
            clearForm();
            editingIndex = -1;
            const addBtn = document.querySelector('.btn-primary');
            addBtn.textContent = 'Add Teacher';
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
        setTimeout(() => {
            // In a real application, this would redirect to login page
            window.location.href = 'login.html';
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
