const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

export function initObserver(root = document) {
  const container = root.querySelector('[data-observe]');
  if (!container) return;

  const steps = Array.from(container.querySelectorAll('.timeline-step'));
  if (steps.length === 0) return;

  if (prefersReduced.matches) {
    steps.forEach((step) => {
      step.classList.add('opacity-100');
    });
    return;
  }

  steps.forEach((step) => {
    step.classList.add('opacity-0', 'translate-y-6', 'transition-all', 'duration-700');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('opacity-0', 'translate-y-6');
        entry.target.classList.add('opacity-100', 'translate-y-0');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  steps.forEach((step) => observer.observe(step));

  const handleChange = (event) => {
    if (event.matches) {
      steps.forEach((step) => {
        step.classList.remove('opacity-0', 'translate-y-6');
        step.classList.add('opacity-100');
      });
    }
  };

  if (typeof prefersReduced.addEventListener === 'function') {
    prefersReduced.addEventListener('change', handleChange);
  } else if (typeof prefersReduced.addListener === 'function') {
    prefersReduced.addListener(handleChange);
  }
}
