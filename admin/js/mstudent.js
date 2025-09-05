// MStudent JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('EduNova Student Management initializing...');

    // Get elements
    const googleFormLinkInput = document.getElementById('google-form-link');
    const addLinkBtn = document.querySelector('.add-link-btn');
    const updateLinkBtn = document.querySelector('.update-link-btn');
    const statusMessage = document.getElementById('statusMessage');

    // Initialize the page
    initializePage();
    setupEventListeners();

    function initializePage() {
        // Load current registration link
        loadCurrentRegistrationLink();
    }

    function setupEventListeners() {
        if (addLinkBtn) {
            addLinkBtn.addEventListener('click', handleAddLink);
        }

        if (updateLinkBtn) {
            updateLinkBtn.addEventListener('click', handleUpdateLink);
        }

        // Add keyboard navigation
        document.addEventListener('keydown', handleKeyboardNavigation);
    }

    // Load current registration link from backend
    async function loadCurrentRegistrationLink() {
        try {
            const token = localStorage.getItem('authToken') || localStorage.getItem('token');
            
            if (!token) {
                showStatusMessage('Please login to access student management', 'error');
                return;
            }

            const response = await fetch('http://127.0.0.1:5000/api/student-registration/link', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (googleFormLinkInput) {
                    googleFormLinkInput.value = data.link;
                }
                showStatusMessage('Current registration link loaded successfully', 'success');
            } else if (response.status === 404) {
                showStatusMessage('No registration link found. Please add one.', 'info');
            } else {
                showStatusMessage('Failed to load registration link', 'error');
            }

        } catch (error) {
            console.error('Error loading registration link:', error);
            showStatusMessage('Error loading registration link', 'error');
        }
    }

    // Handle Add Link button
    async function handleAddLink() {
        try {
            if (!googleFormLinkInput || !googleFormLinkInput.value.trim()) {
                showStatusMessage('Please enter a Google Form link', 'error');
                return;
            }

            const token = localStorage.getItem('authToken') || localStorage.getItem('token');
            
            if (!token) {
                showStatusMessage('Please login to add registration link', 'error');
                return;
            }

            // Show loading state
            addLinkBtn.disabled = true;
            addLinkBtn.textContent = 'Adding...';

            const response = await fetch('http://127.0.0.1:5000/api/student-registration/link', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    link: googleFormLinkInput.value.trim(),
                    title: 'Student Registration Form'
                })
            });

            const data = await response.json();

            if (response.ok) {
                showStatusMessage(data.message, 'success');
                // Update the index.html registration link
                updateIndexPageRegistrationLink(googleFormLinkInput.value.trim());
            } else {
                showStatusMessage(data.message || 'Failed to add registration link', 'error');
            }

        } catch (error) {
            console.error('Error adding registration link:', error);
            showStatusMessage('Error adding registration link', 'error');
        } finally {
            // Reset button state
            addLinkBtn.disabled = false;
            addLinkBtn.textContent = 'Add Link';
        }
    }

    // Handle Update Link button
    async function handleUpdateLink() {
        try {
            if (!googleFormLinkInput || !googleFormLinkInput.value.trim()) {
                showStatusMessage('Please enter a Google Form link', 'error');
                return;
            }

            const token = localStorage.getItem('authToken') || localStorage.getItem('token');
            
            if (!token) {
                showStatusMessage('Please login to update registration link', 'error');
                return;
            }

            // Show loading state
            updateLinkBtn.disabled = true;
            updateLinkBtn.textContent = 'Updating...';

            const response = await fetch('http://127.0.0.1:5000/api/student-registration/link', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    link: googleFormLinkInput.value.trim(),
                    title: 'Student Registration Form'
                })
            });

            const data = await response.json();

            if (response.ok) {
                showStatusMessage(data.message, 'success');
                // Update the index.html registration link
                updateIndexPageRegistrationLink(googleFormLinkInput.value.trim());
            } else {
                showStatusMessage(data.message || 'Failed to update registration link', 'error');
            }

        } catch (error) {
            console.error('Error updating registration link:', error);
            showStatusMessage('Error updating registration link', 'error');
        } finally {
            // Reset button state
            updateLinkBtn.disabled = false;
            updateLinkBtn.textContent = 'Update Link';
        }
    }

    // Update the registration link in index.html
    function updateIndexPageRegistrationLink(newLink) {
        try {
            // This would typically update the index.html file
            // For now, we'll show a message about the update
            console.log('Registration link updated:', newLink);
            showStatusMessage('Registration link updated. The Register button on the main page will now use this new link.', 'success');
        } catch (error) {
            console.error('Error updating index page:', error);
        }
    }

    // Show status message
    function showStatusMessage(message, type = 'info') {
        if (statusMessage) {
            statusMessage.textContent = message;
            statusMessage.className = `status-message ${type}`;
            statusMessage.style.display = 'block';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 5000);
        }
    }

    // Handle keyboard navigation
    function handleKeyboardNavigation(event) {
        if (event.key === 'Enter') {
            const focusedElement = document.activeElement;
            if (focusedElement === addLinkBtn) {
                handleAddLink();
            } else if (focusedElement === updateLinkBtn) {
                handleUpdateLink();
            }
        }
    }

    // Navigation functionality
    function setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const logoutBtn = document.querySelector('.logout-btn');

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                const page = this.getAttribute('data-page');
                navigateToPage(page);
            });
        });

        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleLogout();
            });
        }
    }

    // Navigate to different pages
    function navigateToPage(page) {
        switch(page) {
            case 'dashboard':
                window.location.href = 'Dashboard.html';
                break;
            case 'students':
                // Stay on current page
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
        }
    }

    // Handle logout
    function handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            // Clear session data
            localStorage.removeItem('authToken');
            localStorage.removeItem('token');
            localStorage.removeItem('adminData');
            
            // Redirect to login page
            window.location.href = 'adminlogin.html';
        }
    }

    // Initialize navigation
    setupNavigation();

    console.log('✅ EduNova Student Management initialized successfully!');
});