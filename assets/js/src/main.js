import { initTyping } from './components/typing.js';
import { initCounters } from './components/counters.js';
import { initCarousel } from './components/carousel.js';
import { initModal } from './components/modal.js';
import { initProjectFilters, initPublicationFilters, initTalkFilters } from './components/filters.js';
import { initObserver } from './components/observer.js';
import { initChart } from './components/chart.js';
import { initGreeting } from './components/greeting.js';
import { initBanner } from './components/banner.js';
import { initTechstack } from './components/techstack.js';
import { initTestimonials } from './components/testimonials.js';

const storageKey = 'harry-theme-preference';
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function getStoredTheme() {
  try {
    return localStorage.getItem(storageKey);
  } catch (error) {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem(storageKey, theme);
  } catch (error) {
    // ignore
  }
}

function applyTheme(root, theme, persist = false) {
  const resolved = theme || (prefersDark.matches ? 'dark' : 'light');
  root.classList.toggle('dark', resolved === 'dark');
  if (persist) storeTheme(resolved);
  return resolved;
}

function initThemeToggles(root) {
  const html = root.documentElement;
  const toggleButtons = Array.from(root.querySelectorAll('[data-theme-toggle]'));
  if (toggleButtons.length === 0) return;

  const setPressed = (state) => {
    toggleButtons.forEach((button) => button.setAttribute('aria-pressed', state === 'dark' ? 'true' : 'false'));
  };

  const storedTheme = getStoredTheme();
  const initial = applyTheme(html, storedTheme);
  setPressed(initial);

  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const next = html.classList.contains('dark') ? 'light' : 'dark';
      applyTheme(html, next, true);
      setPressed(next);
    });
  });

  const handleChange = (event) => {
    if (getStoredTheme()) return; // respect user choice
    const next = event.matches ? 'dark' : 'light';
    applyTheme(html, next);
    setPressed(next);
  };

  if (typeof prefersDark.addEventListener === 'function') {
    prefersDark.addEventListener('change', handleChange);
  } else if (typeof prefersDark.addListener === 'function') {
    prefersDark.addListener(handleChange);
  }
}

function initNav(root) {
  const nav = root.querySelector('[data-nav]');
  const toggle = root.querySelector('[data-nav-toggle]');
  if (!nav || !toggle) return;

  const collapse = () => {
    if (window.innerWidth < 768) {
      nav.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
    } else {
      nav.classList.remove('hidden');
      toggle.setAttribute('aria-expanded', 'true');
    }
  };

  collapse();

  toggle.addEventListener('click', () => {
    const isHidden = nav.classList.toggle('hidden');
    toggle.setAttribute('aria-expanded', isHidden ? 'false' : 'true');
  });

  window.addEventListener('resize', collapse);

  nav.addEventListener('click', (event) => {
    if (window.innerWidth >= 768) return;
    if (event.target instanceof HTMLElement && event.target.tagName === 'A') {
      nav.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function updateFooterMeta(root) {
  const yearEl = root.querySelector('[data-current-year]');
  const updatedEl = root.querySelector('[data-last-updated]');
  const today = new Date();
  if (yearEl) yearEl.textContent = today.getFullYear();
  if (updatedEl) {
    try {
      const updated = new Date(document.lastModified);
      updatedEl.textContent = updated.toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      updatedEl.textContent = today.toLocaleDateString('en-AU');
    }
  }
}

function initGreetingAndTime(root) {
  initGreeting(root);
  const greetingEl = root.querySelector('[data-greeting]');
  if (greetingEl) {
    const nowSydney = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Sydney', hour: '2-digit', minute: '2-digit' }).format(new Date());
    greetingEl.setAttribute('data-sydney-time', nowSydney);
  }
}

(function init() {
  const root = document;
  root.documentElement.classList.remove('no-js');

  initThemeToggles(root);
  initNav(root);
  initTyping(root.getElementById('hero-rotate'));
  initCounters(root);
  initCarousel(root);
  initModal(root);
  initProjectFilters(root);
  initPublicationFilters(root);
  initTalkFilters(root);
  initObserver(root);
  initChart(root);
  initGreetingAndTime(root);
  initBanner(root);
  initTechstack(root);
  initTestimonials(root);
  updateFooterMeta(root);
})();
