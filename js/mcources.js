document.addEventListener('DOMContentLoaded', () => {
  const gradeSelect = document.getElementById('grade-select');
  const subjectSelect = document.getElementById('subject-select');
  const resourceTypeSelect = document.getElementById('resource-type-select');
  const yearSelect = document.getElementById('year-select');
  const linkInput = document.getElementById('google-drive-link');
  const addBtn = document.querySelector('.add-course-btn');
  const updateBtn = document.querySelector('.update-course-btn');
  const coursesGrid = document.getElementById('coursesGrid');
  const statusMessage = document.getElementById('statusMessage');

  let selectedCourseId = null;

  const showStatus = (msg, ok = true) => {
    statusMessage.style.display = 'block';
    statusMessage.textContent = msg;
    statusMessage.style.color = ok ? 'green' : 'red';
    setTimeout(() => statusMessage.style.display = 'none', 3500);
  };

  const loadCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const list = await res.json();
      coursesGrid.innerHTML = '';

      if (!list || list.length === 0) {
        coursesGrid.innerHTML = '<p>No uploaded materials yet.</p>';
        return;
      }

      list.forEach(item => {
        const el = document.createElement('div');
        el.className = 'course-card';
        el.innerHTML = `
          <h4>${item.subject} — ${item.grade} (${item.year})</h4>
          <p><strong>${item.resourceType}</strong></p>
          <p><a href="${item.link}" target="_blank">Open / Download</a></p>
          <small>Uploaded: ${new Date(item.createdAt).toLocaleString()}</small>
          <div style="margin-top:5px;">
            <button class="edit-btn" data-id="${item._id}">Edit</button>
          </div>
        `;
        coursesGrid.appendChild(el);
      });

      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const course = list.find(c => c._id === btn.dataset.id);
          if (!course) return;
          gradeSelect.value = course.grade;
          subjectSelect.value = course.subject;
          resourceTypeSelect.value = course.resourceType;
          yearSelect.value = course.year;
          linkInput.value = course.link;
          selectedCourseId = course._id;
        });
      });
    } catch (err) {
      console.error(err);
      showStatus('Failed to load courses', false);
    }
  };

  addBtn.addEventListener('click', async () => {
    const grade = gradeSelect.value;
    const subject = subjectSelect.value;
    const resourceType = resourceTypeSelect.value;
    const year = yearSelect.value;
    const link = linkInput.value.trim();

    if (!grade || !subject || !resourceType || !year || !link) {
      showStatus('Please fill all fields', false);
      return;
    }

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade, subject, resourceType, year, link, uploadedBy: 'admin' })
      });
      const data = await res.json();
      if (data.success) {
        showStatus('Course added successfully');
        gradeSelect.value = '';
        subjectSelect.value = '';
        resourceTypeSelect.value = '';
        yearSelect.value = '';
        linkInput.value = '';
        selectedCourseId = null;
        loadCourses();
      } else {
        showStatus(data.message || 'Failed to add course', false);
      }
    } catch (err) {
      console.error(err);
      showStatus('Server error', false);
    }
  });

  updateBtn.addEventListener('click', async () => {
    if (!selectedCourseId) {
      showStatus('Please select a course to update', false);
      return;
    }

    const grade = gradeSelect.value;
    const subject = subjectSelect.value;
    const resourceType = resourceTypeSelect.value;
    const year = yearSelect.value;
    const link = linkInput.value.trim();

    if (!grade || !subject || !resourceType || !year || !link) {
      showStatus('Please fill all fields', false);
      return;
    }

    try {
      const res = await fetch(`/api/courses/${selectedCourseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade, subject, resourceType, year, link })
      });
      const data = await res.json();
      if (data.success) {
        showStatus('Course updated successfully');
        gradeSelect.value = '';
        subjectSelect.value = '';
        resourceTypeSelect.value = '';
        yearSelect.value = '';
        linkInput.value = '';
        selectedCourseId = null;
        loadCourses();
      } else {
        showStatus(data.message || 'Failed to update', false);
      }
    } catch (err) {
      console.error(err);
      showStatus('Server error', false);
    }
  });

  loadCourses();
});
