// Close mobile Bootstrap navbar collapse automatically when a nav link is clicked
document.querySelectorAll('#navbarNav .nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show') && window.bootstrap) {
      const bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
      bsCollapse.hide();
    }
  });
});
