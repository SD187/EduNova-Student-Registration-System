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


