const toggle = document.querySelector('.mobile-menu-toggle');
const menu = document.querySelector('.nav-links');
function closeMenu() {
  menu.classList.remove('active');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menú');
  toggle.innerHTML = '<i class="bi bi-list" aria-hidden="true"></i>';
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  menu.classList.toggle('active', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  toggle.innerHTML = `<i class="bi bi-${open ? 'x' : 'list'}" aria-hidden="true"></i>`;
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => { if (!event.composedPath().includes(document.querySelector('header'))) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.classList.contains('active')) { closeMenu(); toggle.focus(); }
});
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);

const collection = document.querySelector('.gallery-grid');
const collectionToggle = document.querySelector('.collection-toggle');
collection.classList.add('is-collapsed');
collectionToggle.hidden = false;
collectionToggle.addEventListener('click', () => {
  const expanded = collectionToggle.getAttribute('aria-expanded') !== 'true';
  collection.classList.toggle('is-collapsed', !expanded);
  collectionToggle.setAttribute('aria-expanded', String(expanded));
  collectionToggle.innerHTML = expanded ? 'Ver menos <span aria-hidden="true">−</span>' : 'Ver toda la colección <span aria-hidden="true">+</span>';
  if (!expanded) document.querySelector('#galeria').scrollIntoView();
});

// Fancybox keeps the complete collection available, including collapsed items.
document.querySelectorAll('[data-fancybox]').forEach(link => {
  link.dataset.caption = link.querySelector('img').alt;
});
if (window.Fancybox) {
  Fancybox.bind('[data-fancybox="gallery"]', {
    Hash: false,
    Thumbs: { type: 'classic' },
    Toolbar: {
      display: { left: ['infobar'], middle: [], right: ['iterateZoom', 'fullscreen', 'thumbs', 'close'] }
    },
    l10n: {
      CLOSE: 'Cerrar', NEXT: 'Siguiente', PREV: 'Anterior',
      MODAL: 'Puedes cerrar esta galería con la tecla Escape',
      TOGGLE_ZOOM: 'Ampliar imagen', TOGGLE_THUMBS: 'Ver miniaturas',
      TOGGLE_FULLSCREEN: 'Pantalla completa', ERROR: 'No se pudo cargar la imagen'
    }
  });
}

// A single scroll composition: the two photographs move at different depths.
const hero = document.querySelector('.hero');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let pending = false;
function renderDepth() {
  const progress = reducedMotion.matches ? 0 : Math.min(1, Math.max(0, window.scrollY / hero.offsetHeight));
  hero.style.setProperty('--progress', progress.toFixed(3));
  pending = false;
}
window.addEventListener('scroll', () => {
  if (!pending) { pending = true; requestAnimationFrame(renderDepth); }
}, { passive: true });
reducedMotion.addEventListener('change', renderDepth);
renderDepth();


// Native buttons also support touch, Enter and Space.
const polaroids = [...document.querySelectorAll('.hero-art figure')];
polaroids.forEach(photo => {
  photo.querySelector('.polaroid-select').addEventListener('click', () => {
    polaroids.forEach(item => {
      const selected = item === photo;
      item.classList.toggle('is-front', selected);
      item.querySelector('.polaroid-select').setAttribute('aria-pressed', String(selected));
    });
  });
});

const testimonialCarousel = document.querySelector('.testimonial-carousel');
const testimonialTrack = document.querySelector('#testimonial-track');
const testimonialItems = [...testimonialTrack.querySelectorAll('.testimonial')];
const testimonialDots = document.querySelector('.testimonial-dots');
const testimonialStatus = document.querySelector('.testimonial-status');
const testimonialMobile = window.matchMedia('(max-width: 760px)');
let testimonialPage = 0;
let testimonialSize = 3;
let testimonialPages = 0;
let testimonialResizeFrame;
function updateTestimonialPage() {
  testimonialPage = Math.max(0, Math.min(testimonialPages - 1, Math.round(testimonialTrack.scrollLeft / testimonialTrack.clientWidth)));
  [...testimonialDots.children].forEach((dot, index) => dot.setAttribute('aria-current', String(index === testimonialPage)));
  [...testimonialTrack.children].forEach((page, index) => page.setAttribute('aria-hidden', String(index !== testimonialPage)));
  testimonialStatus.textContent = `${testimonialPage + 1} / ${testimonialPages}`;
}
function goToTestimonialPage(index) {
  const next = (index + testimonialPages) % testimonialPages;
  testimonialTrack.scrollTo({ left: next * testimonialTrack.clientWidth, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
}
function buildTestimonials() {
  const firstItem = testimonialPage * testimonialSize;
  testimonialSize = testimonialMobile.matches ? 1 : 3;
  testimonialPages = Math.ceil(testimonialItems.length / testimonialSize);
  testimonialPage = Math.floor(firstItem / testimonialSize);
  testimonialTrack.replaceChildren();
  testimonialDots.replaceChildren();
  for (let i = 0; i < testimonialPages; i++) {
    const page = document.createElement('div');
    page.className = 'testimonial-page';
    page.setAttribute('role', 'group');
    page.setAttribute('aria-label', `Página ${i + 1} de ${testimonialPages}`);
    page.append(...testimonialItems.slice(i * testimonialSize, (i + 1) * testimonialSize));
    testimonialTrack.append(page);
    const dot = document.createElement('button');
    dot.className = 'testimonial-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Ver página ${i + 1} de testimonios`);
    dot.addEventListener('click', () => goToTestimonialPage(i));
    testimonialDots.append(dot);
  }
  testimonialTrack.scrollTo({ left: testimonialPage * testimonialTrack.clientWidth, behavior: 'instant' });
  updateTestimonialPage();
}
testimonialCarousel.classList.add('is-carousel');
document.querySelectorAll('.testimonial-arrow,.testimonial-pagination').forEach(control => control.hidden = false);
buildTestimonials();
document.querySelector('.testimonial-prev').addEventListener('click', () => goToTestimonialPage(testimonialPage - 1));
document.querySelector('.testimonial-next').addEventListener('click', () => goToTestimonialPage(testimonialPage + 1));
testimonialTrack.addEventListener('scroll', updateTestimonialPage, { passive: true });
testimonialCarousel.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    goToTestimonialPage(testimonialPage + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
window.addEventListener('resize', () => {
  cancelAnimationFrame(testimonialResizeFrame);
  testimonialResizeFrame = requestAnimationFrame(() => {
    if (testimonialSize !== (testimonialMobile.matches ? 1 : 3)) buildTestimonials();
    else {
      testimonialTrack.scrollTo({ left: testimonialPage * testimonialTrack.clientWidth, behavior: 'instant' });
      updateTestimonialPage();
    }
  });
});

// Track the visible section independently of URL hashes and menu clicks.
const sectionLinks = [...menu.querySelectorAll('a[href^="#"]')].map(link => ({
  link, section: document.querySelector(link.getAttribute('href'))
})).filter(item => item.section);
const siteHeader = document.querySelector('header');
let navigationFrame = 0;
function updateActiveSection() {
  navigationFrame = 0;
  const readingLine = siteHeader.getBoundingClientRect().bottom + 48;
  let activeLink = null;
  sectionLinks.forEach(({ link, section }) => {
    if (section.getBoundingClientRect().top <= readingLine) activeLink = link;
  });
  if (window.scrollY > 0 && Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2) activeLink = sectionLinks.at(-1)?.link;
  sectionLinks.forEach(({ link }) => {
    if (link === activeLink) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function scheduleNavigationUpdate() {
  if (!navigationFrame) navigationFrame = requestAnimationFrame(updateActiveSection);
}
window.addEventListener('scroll', scheduleNavigationUpdate, { passive: true });
window.addEventListener('resize', scheduleNavigationUpdate);
window.addEventListener('hashchange', scheduleNavigationUpdate);
window.addEventListener('load', scheduleNavigationUpdate);
new ResizeObserver(scheduleNavigationUpdate).observe(document.querySelector('main'));
updateActiveSection();
