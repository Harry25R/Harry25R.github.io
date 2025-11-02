import { getProjects, getPublications, getTalks } from './data.js';
import { escapeHTML } from './utils.js';

const renderLine = (label, items, formatter) =>
  items.length
    ? `<p><span class="font-semibold text-slate-900 dark:text-white">${label} (${items.length})</span> — ${items.map(formatter).join(', ')}</p>`
    : '';

export async function initTechstack(root = document) {
  const container = root.querySelector('[data-techstack]');
  if (!container) return;

  const chips = Array.from(container.querySelectorAll('[data-skill]'));
  const results = container.querySelector('[data-skill-results]');
  if (chips.length === 0 || !results) return;

  const [projects, publications, talks] = await Promise.all([getProjects(), getPublications(), getTalks()]);
  let activeSkill = null;

  const show = (skill) => {
    if (!skill) {
      results.innerHTML = '<p class="text-slate-600 dark:text-slate-400">Select a skill to surface related work. All content remains visible without JavaScript.</p>';
      return;
    }
    const relevantProjects = projects.filter((item) => item.tags?.includes(skill));
    const relevantPublications = publications.filter((item) => item.tags?.includes(skill));
    const relevantTalks = talks.filter((item) => item.tags?.includes(skill));
    const pieces = [
      renderLine('Projects', relevantProjects, (item) => escapeHTML(item.title)),
      renderLine('Publications', relevantPublications, (item) => escapeHTML(item.title)),
      renderLine('Talks', relevantTalks, (item) => escapeHTML(item.title))
    ].filter(Boolean);
    results.innerHTML = pieces.length
      ? `<div class="space-y-2 text-sm text-slate-600 dark:text-slate-300">${pieces.join('')}</div>`
      : `<p class="text-slate-600 dark:text-slate-400">No highlighted work for ${escapeHTML(skill)} just yet.</p>`;
  };

  chips.forEach((chip) => {
    chip.setAttribute('aria-pressed', 'false');
    chip.addEventListener('click', () => {
      activeSkill = chip.dataset.skill === activeSkill ? null : chip.dataset.skill;
      chips.forEach((btn) => {
        const active = btn.dataset.skill === activeSkill;
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        btn.classList.toggle('bg-blue-600', active);
        btn.classList.toggle('text-white', active);
      });
      show(activeSkill);
    });
  });
}
