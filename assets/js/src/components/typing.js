import { prefersReducedMotion } from './utils.js';

const phrasesDefault = ['Computer Vision', 'Survival Analysis', 'MLOps'];

export function initTyping(element, phrases = phrasesDefault) {
  if (!element) return;
  if (!Array.isArray(phrases) || phrases.length === 0) return;

  if (prefersReducedMotion.matches) {
    element.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let frameId;
  const typingSpeed = 70;
  const deletingSpeed = 40;
  const holdDuration = 1400;

  const tick = (timestamp) => {
    const currentPhrase = phrases[phraseIndex];
    if (!deleting) {
      element.textContent = currentPhrase.slice(0, charIndex + 1);
      charIndex += 1;
      if (charIndex === currentPhrase.length) {
        deleting = true;
        frameId = window.setTimeout(() => requestAnimationFrame(tick), holdDuration);
        return;
      }
      frameId = window.setTimeout(() => requestAnimationFrame(tick), typingSpeed);
    } else {
      element.textContent = currentPhrase.slice(0, Math.max(charIndex - 1, 0));
      charIndex -= 1;
      if (charIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
      frameId = window.setTimeout(() => requestAnimationFrame(tick), deletingSpeed);
    }
  };

  frameId = window.setTimeout(() => requestAnimationFrame(tick), 400);

  const cancel = () => {
    window.clearTimeout(frameId);
  };

  const handleChange = (event) => {
    if (event.matches) {
      cancel();
      element.textContent = phrases[0];
    }
  };

  if (typeof prefersReducedMotion.addEventListener === 'function') {
    prefersReducedMotion.addEventListener('change', handleChange);
  } else if (typeof prefersReducedMotion.addListener === 'function') {
    prefersReducedMotion.addListener(handleChange);
  }
}
