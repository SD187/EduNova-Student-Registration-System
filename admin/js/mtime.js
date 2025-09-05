// EduNova Time Table Management System
class TimeTableManager {
    constructor() {
        this.selectedGrade = null;
        this.selectedSubject = null;
        this.selectedDate = null;
        this.selectedStartTime = null;
        this.selectedEndTime = null;
        this.timeTableData = {};
        this.apiBase = `${window.location.origin}/api`;
        
        this.init();
    }

    init() {
        this.loadSampleData();
        this.setupEventListeners();
        this.setupDropdowns();
        // Always show full, up-to-date timetable on load
        this.renderCurrentTimetableAll();
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

        // Prevent closing when interacting inside dropdown menus
        ['gradeDropdown','subjectDropdown','dateDropdown','timeDropdown'].forEach((id) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('click', (e) => e.stopPropagation());
            }
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
        }, true);

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
                const href = item.getAttribute('href');
                if (href) {
                    window.location.href = href;
                }
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
        const isOpen = dropdown.dataset.open === 'true' || dropdown.classList.contains('show');

        this.closeAllDropdowns();

        if (!isOpen) {
            // Make visible without relying on page CSS
            const parent = dropdown.parentElement;
            if (parent && getComputedStyle(parent).position === 'static') {
                parent.style.position = 'relative';
            }
            dropdown.style.position = 'absolute';
            dropdown.style.top = '100%';
            dropdown.style.left = '0';
            dropdown.style.right = '0';
            dropdown.style.display = 'block';
            dropdown.style.background = '#ffffff';
            dropdown.style.border = '1px solid #e5e7eb';
            dropdown.style.borderRadius = '8px';
            dropdown.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
            dropdown.style.zIndex = '2000';
            dropdown.style.maxHeight = '220px';
            dropdown.style.overflowY = 'auto';
            dropdown.style.opacity = '1';
            dropdown.style.visibility = 'visible';
            dropdown.style.transform = 'translateY(0)';
            dropdown.dataset.open = 'true';
            dropdown.classList.add('show');

            const btn = dropdown.previousElementSibling;
            if (btn) {
                btn.classList.add('active');
                const btnWidth = btn.getBoundingClientRect().width;
                dropdown.style.minWidth = btnWidth + 'px';
            }
        }
    }

    closeDropdown(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) return;
        dropdown.classList.remove('show');
        dropdown.dataset.open = 'false';
        dropdown.style.display = 'none';
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        dropdown.style.transform = 'translateY(-10px)';
        const btn = dropdown.previousElementSibling;
        if (btn) btn.classList.remove('active');
    }

    closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        const buttons = document.querySelectorAll('.dropdown-btn');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
            dropdown.dataset.open = 'false';
            dropdown.style.display = 'none';
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            dropdown.style.transform = 'translateY(-10px)';
        });
        buttons.forEach(btn => btn.classList.remove('active'));
    }

    selectGrade(gradeName, gradeValue) {
        this.selectedGrade = gradeValue;
        this.updateButtonText('gradeBtn', gradeName);
        this.updateSelectedInfo();
        this.fetchAndRender();
        
        const gradeItems = document.querySelectorAll('#gradeDropdown .dropdown-item');
        gradeItems.forEach(item => item.classList.remove('selected'));
        document.querySelector(`[data-value="${gradeValue}"]`).classList.add('selected');
    }

    selectSubject(subjectName, subjectValue) {
        this.selectedSubject = subjectValue;
        this.updateButtonText('subjectBtn', subjectName);
        this.updateSelectedInfo();
        this.fetchAndRender();
        
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
        const token = localStorage.getItem('adminToken');
        if (!token) {
            this.showError('Please login to add timetable entries');
            setTimeout(() => window.location.href = 'adminlogin.html', 800);
            return;
        }
        const payload = {
            subject: this.selectedSubject,
            grade: this.selectedGrade,
            date: this.selectedDate,
            start_time: this.selectedStartTime,
            end_time: this.selectedEndTime
        };
        fetch(`${this.apiBase}/timetable`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        }).then(async (res) => {
            const contentType = res.headers.get('content-type') || '';
            const data = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
            if (!res.ok) throw new Error(data.message || 'Failed to add entry');
            this.showSuccess('Time table entry added successfully!');
            // Refresh both filtered and full views
            this.fetchAndRender();
            this.renderCurrentTimetableAll();
            this.resetForm();
        }).catch(err => this.showError(err.message));
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
                    <span class="time-slot" data-id="${entry._id || entry.id}">
                        ${entry.start_time || entry.startTime} - ${entry.end_time || entry.endTime}
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
            groups[date].sort((a, b) => (a.start_time || a.startTime).localeCompare(b.start_time || b.startTime));
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
        this.timeTableData = {};
    }

    fetchAndRender() {
        if (!this.selectedGrade || !this.selectedSubject) return;
        const grade = this.selectedGrade.replace('grade-', '');
        fetch(`${this.apiBase}/timetable?subject=${encodeURIComponent(this.selectedSubject)}&grade=${encodeURIComponent(grade)}`)
            .then(res => res.json())
            .then(data => {
                const key = `${this.selectedGrade}-${this.selectedSubject}`;
                this.timeTableData[key] = (data.entries || []).map(e => ({ ...e }));
                this.renderTimeTable();
            })
            .catch(() => this.renderTimeTable());
    }

    // (View All removed)

    // Show the full timetable in the main/current grid every time
    renderCurrentTimetableAll() {
        const grid = document.getElementById('timetableGrid');
        if (!grid) return;
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-spinner fa-spin"></i><p>Loading...</p></div>';

        fetch(`${this.apiBase}/timetable`)
            .then(res => res.json())
            .then(data => {
                const entries = (data.entries || []).slice();
                // Keep a quick lookup for edit/delete
                this.allEntriesById = {};
                entries.forEach(e => { if (e._id) this.allEntriesById[e._id] = e; });
                if (entries.length === 0) {
                    grid.innerHTML = '<div class="empty-state"><i class="fas fa-calendar-alt"></i><p>No timetable entries</p></div>';
                    return;
                }
                // Group by date for current timetable view
                const grouped = entries.reduce((acc, e) => {
                    if (!acc[e.date]) acc[e.date] = [];
                    acc[e.date].push(e);
                    return acc;
                }, {});

                let html = `
                    <table class="timetable-table">
                        <thead>
                            <tr>
                                <th class=\"col-date\">Date</th>
                                <th class=\"col-day\">Day</th>
                                <th class=\"col-grade\">Grade</th>
                                <th class=\"col-subject\">Subject</th>
                                <th class=\"col-time\">Time</th>
                                <th style=\"width:120px; text-align:center;\">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                Object.keys(grouped).sort().forEach(date => {
                    const dayName = this.getDayName(date);
                    const dayEntries = grouped[date].sort((a,b)=> (a.start_time||'').localeCompare(b.start_time||''));
                    // Render one row per entry to keep spacing professional
                    dayEntries.forEach(e => {
                        html += `
                            <tr>
                                <td class=\"col-date\"><strong>${this.formatDate(date)}</strong></td>
                                <td class=\"col-day\">${dayName}</td>
                                <td class=\"col-grade\">Grade ${e.grade}</td>
                                <td class=\"col-subject\">${this.getSubjectName(e.subject)}</td>
                                <td class=\"col-time\"><span class=\"time-slot\">${e.start_time} - ${e.end_time}</span></td>
                                <td style=\"text-align:center;\">
                                    <button class=\"edit-btn\" onclick=\"timeTableManager.handleEditEntry('${e._id}')\"><i class=\"fas fa-edit\"></i></button>
                                    <button class=\"delete-btn\" onclick=\"timeTableManager.handleDeleteEntry('${e._id}')\"><i class=\"fas fa-trash\"></i></button>
                                </td>
                            </tr>
                        `;
                    });
                });

                html += '</tbody></table>';
                grid.innerHTML = html;
            })
            .catch(() => {
                grid.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Failed to load timetable</p></div>';
            });
    }

    handleDeleteEntry(entryId) {
        if (!entryId) return;
        if (!confirm('Delete this timetable entry?')) return;
        const token = localStorage.getItem('adminToken');
        if (!token) { this.showError('Please login first'); return; }
        fetch(`${this.apiBase}/timetable/${encodeURIComponent(entryId)}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(async (res) => {
            const text = await res.text();
            if (!res.ok) throw new Error(text || 'Failed to delete');
            this.showSuccess('Deleted');
            // Refresh full and filtered views
            this.renderCurrentTimetableAll();
            this.fetchAndRender();
        }).catch(err => this.showError(err.message));
    }

    handleEditEntry(entryId) {
        const entry = this.allEntriesById?.[entryId];
        if (!entry) { this.showError('Entry not found'); return; }
        // Simple prompts for now; replace with modal if needed
        const newDate = prompt('Date (YYYY-MM-DD):', entry.date);
        if (!newDate) return;
        const newStart = prompt('Start time (HH:MM):', entry.start_time || entry.startTime);
        if (!newStart) return;
        const newEnd = prompt('End time (HH:MM):', entry.end_time || entry.endTime);
        if (!newEnd) return;
        const newGrade = prompt('Grade (6-11):', entry.grade);
        if (!newGrade) return;
        const newSubject = prompt('Subject (mathematics/sinhala/english/buddhism/history/science):', entry.subject);
        if (!newSubject) return;

        const token = localStorage.getItem('adminToken');
        if (!token) { this.showError('Please login first'); return; }

        // No update endpoint available → delete then recreate with new values
        fetch(`${this.apiBase}/timetable/${encodeURIComponent(entryId)}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(() => {
            const payload = {
                subject: String(newSubject).trim().toLowerCase(),
                grade: String(newGrade).trim(),
                date: newDate,
                start_time: newStart,
                end_time: newEnd
            };
            return fetch(`${this.apiBase}/timetable`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
        }).then(async (res) => {
            const body = await res.text();
            if (!res.ok) throw new Error(body || 'Failed to update');
            this.showSuccess('Updated');
            this.renderCurrentTimetableAll();
            this.fetchAndRender();
        }).catch(err => this.showError(err.message));
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

    /* Timetable table core styles (ensure proper table layout even without page CSS) */
    .timetable-table { width: 100%; border-collapse: separate; border-spacing: 0 10px; margin-top: 1rem; }
    .timetable-table thead th { text-align: left; font-size: 0.9rem; letter-spacing: .02em; background:#f8fafc; color:#374151; font-weight:600; padding: .875rem 1rem; border-bottom:1px solid #e5e7eb; white-space: nowrap; position: sticky; top: 0; z-index: 1; }
    .timetable-table tbody tr { background:#fff; box-shadow: 0 2px 8px rgba(0,0,0,.05); }
    .timetable-table tbody tr:hover { background:#f9fafb; }
    .timetable-table tbody td { padding: .9rem 1rem; vertical-align: middle; }
    .timetable-table tbody td:first-child { border-top-left-radius:10px; border-bottom-left-radius:10px; font-weight:600; color:#111827; }
    .timetable-table tbody td:last-child { border-top-right-radius:10px; border-bottom-right-radius:10px; }
    .timetable-table .col-date { width:16%; white-space:nowrap; }
    .timetable-table .col-day { width:12%; white-space:nowrap; }
    .timetable-table .col-grade { width:12%; white-space:nowrap; font-weight:600; color:#374151; }
    .timetable-table .col-subject { width:20%; font-weight:600; color:#1f2937; }
    .timetable-table .col-time { width:40%; text-align:left; }
    .timetable-table tbody tr + tr td { border-top:1px solid #f3f4f6; }

    /* Time slot pill */
    .time-slot { background:#eef2ff; color:#3730a3; padding:.45rem .85rem; border-radius:9999px; font-weight:600; display:inline-block; margin:.25rem .35rem .25rem 0; letter-spacing:.2px; }
    .time-slot:hover { background:#dbeafe; transform: translateY(-1px); }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is ready
function initTimeTableManager(){
    if (!window.timeTableManager) {
        window.timeTableManager = new TimeTableManager();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimeTableManager);
} else {
    // DOM already loaded, init immediately
    initTimeTableManager();
}

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