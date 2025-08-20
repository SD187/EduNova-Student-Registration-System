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




