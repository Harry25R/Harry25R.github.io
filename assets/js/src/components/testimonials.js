import { getTestimonials } from './data.js';
import { escapeHTML, prefersReducedMotion } from './utils.js';

export async function initTestimonials(root = document) {
  const container = root.querySelector('[data-testimonials]');
  const controls = root.querySelector('[data-testimonial-controls]');
  if (!container || !controls) return;

  const prevButton = controls.querySelector('[data-testimonial-prev]');
  const nextButton = controls.querySelector('[data-testimonial-next]');
  const toggleButton = controls.querySelector('[data-testimonial-toggle]');

  const testimonials = await getTestimonials();
  if (!Array.isArray(testimonials) || testimonials.length === 0) return;

  let index = 0;
  let autoplay = false;
  let timerId = null;

  const render = () => {
    const current = testimonials[index];
    container.innerHTML = `
      <blockquote class="text-lg font-medium text-slate-800 dark:text-slate-100">${escapeHTML(current.quote)}</blockquote>
      <cite class="mt-4 block text-sm text-slate-600 dark:text-slate-400">${escapeHTML(current.author || 'Colleague')}</cite>
    `;
  };

  const setAutoplay = (value) => {
    autoplay = value && !prefersReducedMotion.matches;
    toggleButton?.setAttribute('aria-pressed', autoplay ? 'true' : 'false');
    toggleButton.textContent = autoplay ? 'Pause' : 'Play';
    if (timerId) window.clearTimeout(timerId);
    if (autoplay) schedule();
  };

  const schedule = () => {
    if (!autoplay) return;
    timerId = window.setTimeout(() => {
      goTo(index + 1);
      schedule();
    }, 6000);
  };

  const goTo = (newIndex) => {
    index = (newIndex + testimonials.length) % testimonials.length;
    render();
  };

  prevButton?.addEventListener('click', () => goTo(index - 1));
  nextButton?.addEventListener('click', () => goTo(index + 1));
  toggleButton?.addEventListener('click', () => setAutoplay(!autoplay));

  const handleChange = (event) => {
    if (event.matches && autoplay) {
      setAutoplay(false);
    }
  };

  if (typeof prefersReducedMotion.addEventListener === 'function') {
    prefersReducedMotion.addEventListener('change', handleChange);
  } else if (typeof prefersReducedMotion.addListener === 'function') {
    prefersReducedMotion.addListener(handleChange);
  }

  if (prefersReducedMotion.matches) setAutoplay(false);

  render();
  if (toggleButton) toggleButton.textContent = 'Play';
}
