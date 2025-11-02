import { getPublications, getTalks } from './data.js';
import { escapeHTML } from './utils.js';

export async function initModal(root = document) {
  const mount = root.querySelector('[data-modal-root]');
  const template = mount?.querySelector('template#modal-template');
  const triggers = Array.from(root.querySelectorAll('[data-modal-trigger]'));
  if (!mount || !template || triggers.length === 0) return;

  const [publications, talks] = await Promise.all([getPublications(), getTalks()]);

  let lastFocus = null;
  let focusable = [];
  let currentOverlay = null;

  const close = () => {
    if (currentOverlay) {
      currentOverlay.remove();
      currentOverlay = null;
    }
    mount.hidden = true;
    document.removeEventListener('keydown', trap, true);
    if (lastFocus) {
      lastFocus.focus();
      lastFocus = null;
    }
  };

  const trap = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'Tab' && focusable.length) {
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  const render = (title, bodyHtml) => {
    mount.hidden = false;
    currentOverlay = template.content.firstElementChild.cloneNode(true);
    const heading = currentOverlay.querySelector('#modal-heading');
    const body = currentOverlay.querySelector('[data-modal-body]');
    heading.textContent = title;
    body.innerHTML = bodyHtml;
    currentOverlay.querySelector('[data-modal-close]')?.addEventListener('click', close);
    mount.appendChild(currentOverlay);
    focusable = Array.from(currentOverlay.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])'));
    focusable[0]?.focus();
    document.addEventListener('keydown', trap, true);
  };

  const publicationBody = (item) => {
    const links = [];
    if (item.doi) links.push(`<a class="text-brand hover:underline" href="https://doi.org/${encodeURIComponent(item.doi)}" target="_blank" rel="noopener">View DOI</a>`);
    if (item.pdf) links.push(`<a class="text-brand hover:underline" href="${escapeHTML(item.pdf)}" target="_blank" rel="noopener">Download PDF</a>`);
    if (item.code) links.push(`<a class="text-brand hover:underline" href="${escapeHTML(item.code)}" target="_blank" rel="noopener">View code</a>`);
    const abstract = `<p>${escapeHTML(item.abstract || 'Abstract coming soon.')}</p>`;
    return links.length ? `${abstract}<p class="flex flex-wrap gap-3 text-sm font-medium">${links.join('')}</p>` : abstract;
  };

  const talkBody = (item) => {
    const links = [];
    if (item.slides) links.push(`<a class="text-brand hover:underline" href="${escapeHTML(item.slides)}" target="_blank" rel="noopener">Slides</a>`);
    if (item.video) links.push(`<a class="text-brand hover:underline" href="${escapeHTML(item.video)}" target="_blank" rel="noopener">Watch recording</a>`);
    const summary = `<p>${escapeHTML(item.summary || 'Session summary available on request.')}</p>`;
    return links.length ? `${summary}<p class="flex flex-wrap gap-3 text-sm font-medium">${links.join('')}</p>` : summary;
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const title = trigger.dataset.modalContent;
      if (!title) return;
      lastFocus = trigger;
      const parentPublication = trigger.closest('[data-publication]');
      const parentTalk = trigger.closest('[data-talk]');
      let body = '<p>Additional details will be published soon.</p>';

      if (parentPublication) {
        const match = publications.find((item) => item.title === title);
        if (match) body = publicationBody(match);
      } else if (parentTalk) {
        const match = talks.find((item) => item.title === title);
        if (match) body = talkBody(match);
      }

      render(title, body);
    });
  });
}
