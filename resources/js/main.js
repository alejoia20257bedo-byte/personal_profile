const drawer = document.getElementById('drawer');
const openBtn = document.getElementById('drawer-open');
const closeBtn = document.getElementById('drawer-close');
const scroller = drawer.querySelector('.Drawer-scroller');
const sheet = drawer.querySelector('.Drawer-sheet');
const mainContent = document.querySelector('main');
const siteFooter = document.querySelector('footer');

async function openDrawer() {
  drawer.showPopover();

  if (!CSS.supports('scroll-initial-target', 'nearest')) {
    scroller.scrollTo({ left: scroller.offsetWidth, behavior: 'instant' });
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r))
    );
  }

  scroller.scrollTo({ left: 0, behavior: 'auto' });
}

function closeDrawer() {
  scroller.scrollTo({ left: scroller.offsetWidth, behavior: 'auto' });
}

function onDrawerOpened() {
  mainContent.inert = true;
  if (siteFooter) siteFooter.inert = true;
  openBtn.setAttribute('aria-expanded', 'true');
  sheet.focus();
}

function onDrawerClosed() {
  if (drawer.matches(':popover-open')) {
    drawer.hidePopover();
  }
  mainContent.inert = false;
  if (siteFooter) siteFooter.inert = false;
  openBtn.setAttribute('aria-expanded', 'false');
}

const visibleThreshold = 1 / window.innerWidth;

const observer = new IntersectionObserver(
  (entries) => {
    const entry = entries.at(-1);
    if (entry.intersectionRatio < visibleThreshold) onDrawerClosed();
    if (entry.intersectionRatio === 1) onDrawerOpened();
  },
  { root: drawer, threshold: [visibleThreshold, 1] }
);
observer.observe(sheet);

if (!CSS.supports('animation-timeline: scroll()')) {
  scroller.addEventListener('scroll', () => {
    const ratio = Math.max(0, Math.min(1, 1 - scroller.scrollLeft / sheet.offsetWidth));
    drawer.style.setProperty('--drawer-backdrop', ratio);
  });
}

openBtn.addEventListener('click', openDrawer);

if (closeBtn) {
  closeBtn.addEventListener('click', closeDrawer);
}

drawer.addEventListener('click', (event) => {
  if (!sheet.contains(event.target) || event.target.closest('a')) {
    closeDrawer();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && openBtn.getAttribute('aria-expanded') === 'true') {
    closeDrawer();
  }
});
