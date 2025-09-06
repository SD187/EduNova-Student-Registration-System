document.addEventListener('DOMContentLoaded', () => {
  const panels = {
    subject: document.getElementById('panel-subjects'),
    grade: document.getElementById('panel-grades'),
    year: document.getElementById('panel-year'),
    resources: document.getElementById('panel-resources')
  };
  const steps = document.querySelectorAll('.wizard-steps .step');
  const subjectCards = document.querySelectorAll('.subject-card');
  const gradeBtns = document.querySelectorAll('.grade-btn');
  const yearSelect = document.getElementById('year-select');
  const resourceCards = document.querySelectorAll('.resource-card');
  const chosenSubjectEl = document.getElementById('chosenSubject');
  const chosenGradeEl = document.getElementById('chosenGrade');
  const chosenYearEl = document.getElementById('chosenYear');
  const materialsContainer = document.getElementById('materialsContainer');

  let selectedSubject = null;
  let selectedGrade = null;
  let selectedYear = null;

  const showPanel = (panel) => {
    Object.values(panels).forEach(p => p.classList.remove('active'));
    panel.classList.add('active');
  };

  const setStep = (n) => {
    steps.forEach(s => s.classList.remove('active'));
    document.querySelector(`.wizard-steps .step[data-step="${n}"]`)?.classList.add('active');
  };

  // Step 1: Subject
  subjectCards.forEach(card => {
    card.addEventListener('click', () => {
      selectedSubject = card.dataset.subject;
      chosenSubjectEl.textContent = selectedSubject;
      chosenSubjectEl.parentElement.hidden = false;
      setStep(2);
      showPanel(panels.grade);
    });
  });

  // Back to Subject
  document.querySelectorAll('[data-back="subjects"]').forEach(btn => {
    btn.addEventListener('click', () => {
      setStep(1);
      showPanel(panels.subject);
    });
  });

  // Step 2: Grade
  gradeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedGrade = btn.dataset.grade;
      chosenGradeEl.textContent = btn.textContent.trim();
      chosenGradeEl.parentElement.hidden = false;
      setStep(3);
      showPanel(panels.year);
    });
  });

  // Back to Grade
  document.querySelectorAll('[data-back="grades"]').forEach(btn => {
    btn.addEventListener('click', () => {
      setStep(2);
      showPanel(panels.grade);
    });
  });

  // Step 3: Year
  yearSelect.addEventListener('change', () => {
    selectedYear = yearSelect.value;
    if (!selectedYear) return;
    chosenYearEl.textContent = selectedYear;
    chosenYearEl.parentElement.hidden = false;
    setStep(4);
    showPanel(panels.resources);
  });

  // Back to Year
  document.querySelectorAll('[data-back="year"]').forEach(btn => {
    btn.addEventListener('click', () => {
      setStep(3);
      showPanel(panels.year);
    });
  });

  // Step 4: Fetch Resources
  resourceCards.forEach(card => {
    card.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!selectedSubject || !selectedGrade || !selectedYear) return;

      const resourceType = card.dataset.type;
      materialsContainer.innerHTML = '<p>Loading materials...</p>';

      try {
        const query = new URLSearchParams({
          grade: `Grade ${selectedGrade}`,
          subject: selectedSubject,
          resourceType,
          year: selectedYear
        }).toString();

        const res = await fetch(`http://localhost:5000/api/courses?${query}`);
        const items = await res.json();

        if (!items.length) {
          materialsContainer.innerHTML = '<p>No materials available for this selection.</p>';
          return;
        }

        materialsContainer.innerHTML = '';
        items.forEach(it => {
          const div = document.createElement('div');
          div.className = 'resource-item';
          div.innerHTML = `
            <h4>${it.resourceType} — ${it.subject} (${it.grade})</h4>
            <p><a href="${it.link}" target="_blank">Open / Download</a></p>
            <hr/>
          `;
          materialsContainer.appendChild(div);
        });

      } catch (err) {
        console.error(err);
        materialsContainer.innerHTML = '<p>Failed to load materials.</p>';
      }
    });
  });
});
