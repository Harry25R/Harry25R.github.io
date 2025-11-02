import { prefersReducedMotion } from './utils.js';

function formatNumber(target, precision = 0) {
  if (precision > 0) return Number(target).toFixed(precision);
  return Math.round(Number(target)).toString();
}

export function initCounters(root = document) {
  const counters = Array.from(root.querySelectorAll('.counter[data-target]'));
  if (counters.length === 0) return;

  const animate = (entry) => {
    const { target } = entry.target.dataset;
    const precision = Number(entry.target.dataset.precision || '0');
    const targetValue = Number(target);
    if (Number.isNaN(targetValue)) return;

    if (prefersReducedMotion.matches) {
      entry.target.textContent = formatNumber(targetValue, precision);
      observer.unobserve(entry.target);
      return;
    }

    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const current = targetValue * progress;
      entry.target.textContent = formatNumber(current, precision);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        entry.target.textContent = formatNumber(targetValue, precision);
      }
    };

    requestAnimationFrame(step);
    observer.unobserve(entry.target);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach((element) => observer.observe(element));

  const handleChange = (event) => {
    if (event.matches) {
      counters.forEach((element) => {
        const { target } = element.dataset;
        const precision = Number(element.dataset.precision || '0');
        element.textContent = formatNumber(Number(target), precision);
        observer.unobserve(element);
      });
    }
  };

  if (typeof prefersReducedMotion.addEventListener === 'function') {
    prefersReducedMotion.addEventListener('change', handleChange);
  } else if (typeof prefersReducedMotion.addListener === 'function') {
    prefersReducedMotion.addListener(handleChange);
  }
}
