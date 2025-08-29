
// Find every field that has an eye icon + an input
document.querySelectorAll('.field').forEach((field) => {
  const eye = field.querySelector('.icon.right.eye');
  const input = field.querySelector('input');

  if (!eye || !input || input.type !== 'password') return;

  eye.setAttribute('tabindex', '0');
  eye.setAttribute('role', 'button');
  eye.setAttribute('aria-pressed', 'false');
  eye.setAttribute('aria-label', 'Show password');

  const toggle = () => {
    const showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    eye.setAttribute('aria-pressed', showing ? 'false' : 'true');
    eye.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    field.classList.toggle('show', !showing);
  };

  eye.addEventListener('click', toggle);
  eye.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });
});
