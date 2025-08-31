// EduNova Time Table Management System
class TimeTableManager {
    constructor() {
        this.selectedGrade = null;
        this.selectedSubject = null;
        this.selectedDate = null;
        this.selectedStartTime = null;
        this.selectedEndTime = null;
        this.timeTableData = {};
        
        this.init();
    }

    init() {
        this.loadSampleData();
        this.setupEventListeners();
        this.setupDropdowns();
    }

    setupEventListeners() {
        // Dropdown button click handlers
        document.getElementById('gradeBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown('gradeDropdown');
        });

        document.getElementById('subjectBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown('subjectDropdown');
        });

        document.getElementById('dateBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown('dateDropdown');
        });

        document.getElementById('timeBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown('timeDropdown');
        });

        // Add time table button
        document.getElementById('addTimeTable').addEventListener('click', () => {
            this.addTimeTable();
        });

        // Date input change
        document.getElementById('dateInput').addEventListener('change', (e) => {
            this.selectedDate = e.target.value;
            this.updateButtonText('dateBtn', `Date: ${this.formatDate(e.target.value)}`);
            this.updateSelectedInfo();
            this.closeDropdown('dateDropdown');
        });

        // Time input changes
        document.getElementById('startTime').addEventListener('change', (e) => {
            this.selectedStartTime = e.target.value;
            this.updateTimeButtonText();
            this.updateSelectedInfo();
        });

        document.getElementById('endTime').addEventListener('change', (e) => {
            this.selectedEndTime = e.target.value;
            this.updateTimeButtonText();
            this.updateSelectedInfo();
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            this.closeAllDropdowns();
        });

        // Navigation menu interactions
        this.setupNavigation();
    }

    setupDropdowns() {
        // Grade dropdown
        const gradeItems = document.querySelectorAll('#gradeDropdown .dropdown-item');
        gradeItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectGrade(item.textContent, item.dataset.value);
                this.closeDropdown('gradeDropdown');
            });
        });

        // Subject dropdown
        const subjectItems = document.querySelectorAll('#subjectDropdown .dropdown-item');
        subjectItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectSubject(item.textContent, item.dataset.value);
                this.closeDropdown('subjectDropdown');
            });
        });
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });

        document.querySelector('.logout-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                this.logout();
            }
        });
    }

    toggleDropdown(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        const isOpen = dropdown.classList.contains('show');
        
        this.closeAllDropdowns();
        
        if (!isOpen) {
            dropdown.classList.add('show');
            const btn = dropdown.previousElementSibling;
            btn.classList.add('active');
        }
    }

    closeDropdown(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        dropdown.classList.remove('show');
        const btn = dropdown.previousElementSibling;
        btn.classList.remove('active');
    }

    closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        const buttons = document.querySelectorAll('.dropdown-btn');
        
        dropdowns.forEach(dropdown => dropdown.classList.remove('show'));
        buttons.forEach(btn => btn.classList.remove('active'));
    }

    selectGrade(gradeName, gradeValue) {
        this.selectedGrade = gradeValue;
        this.updateButtonText('gradeBtn', gradeName);
        this.updateSelectedInfo();
        this.renderTimeTable();
        
        const gradeItems = document.querySelectorAll('#gradeDropdown .dropdown-item');
        gradeItems.forEach(item => item.classList.remove('selected'));
        document.querySelector(`[data-value="${gradeValue}"]`).classList.add('selected');
    }

    selectSubject(subjectName, subjectValue) {
        this.selectedSubject = subjectValue;
        this.updateButtonText('subjectBtn', subjectName);
        this.updateSelectedInfo();
        this.renderTimeTable();
        
        const subjectItems = document.querySelectorAll('#subjectDropdown .dropdown-item');
        subjectItems.forEach(item => item.classList.remove('selected'));
        document.querySelector(`#subjectDropdown [data-value="${subjectValue}"]`).classList.add('selected');
    }

    updateButtonText(buttonId, text) {
        const button = document.getElementById(buttonId);
        const span = button.querySelector('span');
        span.textContent = text;
    }

    updateTimeButtonText() {
        if (this.selectedStartTime && this.selectedEndTime) {
            this.updateButtonText('timeBtn', `${this.selectedStartTime} - ${this.selectedEndTime}`);
        }
    }

    updateSelectedInfo() {
        const selectedInfo = document.getElementById('selectedInfo');
        
        if (this.selectedGrade && this.selectedSubject) {
            const gradeName = this.getGradeName(this.selectedGrade);
            const subjectName = this.getSubjectName(this.selectedSubject);
            selectedInfo.innerHTML = `<span>${gradeName} - ${subjectName}</span>`;
        } else {
            selectedInfo.innerHTML = '<span>No selection made</span>';
        }
    }

    getGradeName(gradeValue) {
        const gradeMap = {
            'grade-6': 'Grade 6',
            'grade-7': 'Grade 7',
            'grade-8': 'Grade 8',
            'grade-9': 'Grade 9',
            'grade-10': 'Grade 10',
            'grade-11': 'Grade 11'
        };
        return gradeMap[gradeValue] || gradeValue;
    }

    getSubjectName(subjectValue) {
        const subjectMap = {
            'mathematics': 'Mathematics',
            'english': 'English',
            'sinhala': 'Sinhala',
            'buddhism': 'Buddhism',
            'history': 'History',
            'science': 'Science'
        };
        return subjectMap[subjectValue] || subjectValue;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    addTimeTable() {
        if (!this.validateSelection()) {
            this.showError('Please fill in all required fields');
            return;
        }

        const key = `${this.selectedGrade}-${this.selectedSubject}`;
        
        if (!this.timeTableData[key]) {
            this.timeTableData[key] = [];
        }

        const newEntry = {
            date: this.selectedDate,
            startTime: this.selectedStartTime,
            endTime: this.selectedEndTime,
            id: Date.now()
        };

        this.timeTableData[key].push(newEntry);
        this.renderTimeTable();
        this.showSuccess('Time table entry added successfully!');
        this.resetForm();
    }

    validateSelection() {
        return this.selectedGrade && 
               this.selectedSubject && 
               this.selectedDate && 
               this.selectedStartTime && 
               this.selectedEndTime;
    }

    resetForm() {
        this.selectedDate = null;
        this.selectedStartTime = null;
        this.selectedEndTime = null;
        
        document.getElementById('dateInput').value = '';
        document.getElementById('startTime').value = '';
        document.getElementById('endTime').value = '';
        
        this.updateButtonText('dateBtn', 'Set Date');
        this.updateButtonText('timeBtn', 'Set time(Start&End)');
    }

    renderTimeTable() {
        const container = document.getElementById('timetableGrid');
        
        if (!this.selectedGrade || !this.selectedSubject) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-alt"></i>
                    <p>Select grade and subject to view time table</p>
                </div>
            `;
            return;
        }

        const key = `${this.selectedGrade}-${this.selectedSubject}`;
        const entries = this.timeTableData[key] || [];

        if (entries.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clock"></i>
                    <p>No time table entries for ${this.getGradeName(this.selectedGrade)} - ${this.getSubjectName(this.selectedSubject)}</p>
                    <small>Add your first entry using the controls above</small>
                </div>
            `;
            return;
        }

        const groupedEntries = this.groupEntriesByDate(entries);
        
        let tableHTML = `
            <table class="timetable-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Day</th>
                        <th>Time Slots</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        Object.keys(groupedEntries).sort().forEach(date => {
            const dayEntries = groupedEntries[date];
            const dayName = this.getDayName(date);
            
            tableHTML += `
                <tr>
                    <td><strong>${this.formatDate(date)}</strong></td>
                    <td>${dayName}</td>
                    <td>
            `;
            
            dayEntries.forEach(entry => {
                tableHTML += `
                    <span class="time-slot" data-id="${entry.id}">
                        ${entry.startTime} - ${entry.endTime}
                    </span>
                `;
            });
            
            tableHTML += `
                    </td>
                    <td>
                        <button class="edit-btn" onclick="timeTableManager.editDate('${date}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" onclick="timeTableManager.deleteDate('${date}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        container.innerHTML = tableHTML;
        this.setupTimeSlotHandlers();
    }

    groupEntriesByDate(entries) {
        return entries.reduce((groups, entry) => {
            const date = entry.date;
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(entry);
            groups[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
            return groups;
        }, {});
    }

    getDayName(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    }

    setupTimeSlotHandlers() {
        const timeSlots = document.querySelectorAll('.time-slot');
        timeSlots.forEach(slot => {
            slot.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectTimeSlot(slot);
            });
        });
    }

    selectTimeSlot(slot) {
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        this.selectedSlotId = slot.dataset.id;
    }

    editDate(date) {
        const key = `${this.selectedGrade}-${this.selectedSubject}`;
        const entries = this.timeTableData[key] || [];
        const dateEntries = entries.filter(entry => entry.date === date);
        
        if (dateEntries.length === 0) return;
        
        const timeSlots = dateEntries.map(entry => `${entry.startTime} - ${entry.endTime}`).join(', ');
        alert(`Edit time slots for ${this.formatDate(date)}:\n${timeSlots}`);
    }

    deleteDate(date) {
        if (!confirm(`Are you sure you want to delete all time slots for ${this.formatDate(date)}?`)) {
            return;
        }

        const key = `${this.selectedGrade}-${this.selectedSubject}`;
        this.timeTableData[key] = this.timeTableData[key].filter(entry => entry.date !== date);
        
        this.renderTimeTable();
        this.showSuccess('Time slots deleted successfully!');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="close-notification" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    loadSampleData() {
        this.timeTableData = {
            'grade-8-mathematics': [
                {
                    id: 1,
                    date: '2025-09-01',
                    startTime: '08:00',
                    endTime: '09:00'
                },
                {
                    id: 2,
                    date: '2025-09-01',
                    startTime: '10:00',
                    endTime: '11:00'
                },
                {
                    id: 3,
                    date: '2025-09-03',
                    startTime: '09:00',
                    endTime: '10:00'
                }
            ],
            'grade-8-english': [
                {
                    id: 4,
                    date: '2025-09-02',
                    startTime: '08:30',
                    endTime: '09:30'
                }
            ],
            'grade-9-sinhala': [
                {
                    id: 5,
                    date: '2025-09-01',
                    startTime: '11:00',
                    endTime: '12:00'
                }
            ],
            'grade-10-buddhism': [
                {
                    id: 6,
                    date: '2025-09-04',
                    startTime: '14:00',
                    endTime: '15:00'
                }
            ]
        };
    }

    logout() {
        this.selectedGrade = null;
        this.selectedSubject = null;
        this.selectedDate = null;
        this.selectedStartTime = null;
        this.selectedEndTime = null;
        
        this.showSuccess('Logged out successfully!');
        
        setTimeout(() => {
            alert('You have been logged out. Redirecting to login page...');
        }, 1500);
    }
}

// Additional styles for notifications and buttons
const additionalStyles = `
    .notification {
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
        max-width: 400px;
        font-weight: 500;
    }

    .notification.success {
        background: #10b981;
        color: white;
    }

    .notification.error {
        background: #ef4444;
        color: white;
    }

    .notification.show {
        opacity: 1;
        transform: translateX(0);
    }

    .close-notification {
        background: none;
        border: none;
        color: currentColor;
        cursor: pointer;
        padding: 0.2rem;
        border-radius: 4px;
        transition: background-color 0.2s ease;
    }

    .close-notification:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }

    .edit-btn, .delete-btn {
        background: none;
        border: 1px solid #e5e7eb;
        padding: 0.5rem 0.8rem;
        border-radius: 6px;
        cursor: pointer;
        margin: 0 0.2rem;
        transition: all 0.2s ease;
    }

    .edit-btn {
        color: #3730a3;
        border-color: #c7d2fe;
    }

    .edit-btn:hover {
        background: #e0e7ff;
    }

    .delete-btn {
        color: #dc2626;
        border-color: #fecaca;
    }

    .delete-btn:hover {
        background: #fef2f2;
    }

    .timetable-table {
        animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .empty-state small {
        display: block;
        margin-top: 0.5rem;
        font-size: 0.9rem;
        opacity: 0.7;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.timeTableManager = new TimeTableManager();
});

// Global functions for button clicks
window.editDate = function(date) {
    if (window.timeTableManager) {
        window.timeTableManager.editDate(date);
    }
};

window.deleteDate = function(date) {
    if (window.timeTableManager) {
        window.timeTableManager.deleteDate(date);
    }
};