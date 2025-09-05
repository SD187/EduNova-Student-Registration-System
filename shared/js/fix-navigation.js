// Ensure header links always navigate reliably
(function(){
  function forceNavigate(e){
    const a = e.currentTarget;
    if (!a || !a.href || a.getAttribute('href') === '#') return;
    // Let normal navigation happen; as a fallback, force it
    setTimeout(function(){
      if (document.visibilityState === 'visible' && window.location.href === a.href) return;
      if (window.location.href !== a.href) {
        window.location.assign(a.href);
      }
    }, 0);
  }

  function attach(){
    var selectors = [
      '.top-nav a',
      '.top-nav-links a',
      'header .nav-link',
      '.header-nav a'
    ];
    selectors.forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(a){
        a.addEventListener('click', forceNavigate, { capture: false });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach);
  } else {
    attach();
  }
})();


