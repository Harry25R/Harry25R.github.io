import { getProjects } from './data.js';
import { escapeHTML, prefersReducedMotion } from './utils.js';

export async function initCarousel(root = document) {
  const container = root.querySelector('[data-carousel]');
  if (!container) return;

  const slideEl = container.querySelector('[data-carousel-slide]');
  if (!slideEl) return;

  const prevButton = container.querySelector('[data-carousel-prev]');
  const nextButton = container.querySelector('[data-carousel-next]');
  const toggleButton = container.querySelector('[data-carousel-toggle]');

  let autoplay = false;
  let timerId = null;

  const projects = await getProjects();
  const slides = projects.slice(0, 5).map((project) => ({
    title: project.title,
    summary: project.summary
  }));

  if (slides.length === 0) return;

  let index = 0;

  const render = () => {
    const current = slides[index];
    slideEl.innerHTML = `
      <h3 class="text-lg font-semibold">${escapeHTML(current.title)}</h3>
      <p class="text-sm text-slate-600 dark:text-slate-300">${escapeHTML(current.summary)}</p>
    `;
  };

  render();
  if (toggleButton) {
    toggleButton.textContent = 'Play';
  }

  const setAutoplay = (value) => {
    autoplay = value && !prefersReducedMotion.matches;
    toggleButton?.setAttribute('aria-pressed', autoplay ? 'true' : 'false');
    toggleButton.textContent = autoplay ? 'Pause' : 'Play';
    toggleButton.classList.toggle('border-brand', autoplay);
    if (timerId) window.clearTimeout(timerId);
    if (autoplay) scheduleNext();
  };

  const scheduleNext = () => {
    if (!autoplay) return;
    timerId = window.setTimeout(() => {
      goTo(index + 1);
      scheduleNext();
    }, 5000);
  };

  const goTo = (newIndex) => {
    index = (newIndex + slides.length) % slides.length;
    render();
  };

  prevButton?.addEventListener('click', () => {
    goTo(index - 1);
  });

  nextButton?.addEventListener('click', () => {
    goTo(index + 1);
  });

  toggleButton?.addEventListener('click', () => {
    setAutoplay(!autoplay);
  });

  const onPrefersChange = (event) => {
    if (event.matches && autoplay) {
      setAutoplay(false);
    }
  };

  if (typeof prefersReducedMotion.addEventListener === 'function') {
    prefersReducedMotion.addEventListener('change', onPrefersChange);
  } else if (typeof prefersReducedMotion.addListener === 'function') {
    prefersReducedMotion.addListener(onPrefersChange);
  }

  if (typeof prefersReducedMotion.matches === 'boolean' && prefersReducedMotion.matches) {
    setAutoplay(false);
  }
}
