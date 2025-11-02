const normalise = (value = '') => value.toLowerCase().trim();

function toggleDetails(root) {
  root.querySelectorAll('[data-project-toggle]').forEach((button) => {
    const target = document.getElementById(button.getAttribute('aria-controls') || '');
    if (!target) return;
    target.setAttribute('hidden', '');
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => {
      const hidden = target.hasAttribute('hidden');
      target.toggleAttribute('hidden', !hidden);
      button.setAttribute('aria-expanded', hidden ? 'true' : 'false');
    });
  });
}

function setupFilters({ root, listSelector, cardSelector, searchId, sortId, countId, filterSelector, labels, sorters }) {
  const list = root.querySelector(listSelector);
  if (!list) return;
  const cards = Array.from(list.querySelectorAll(cardSelector));
  if (cards.length === 0) return;

  const searchInput = searchId ? root.getElementById(searchId) : null;
  const sortSelect = sortId ? root.getElementById(sortId) : null;
  const countEl = countId ? root.getElementById(countId) : null;
  const filterButtons = Array.from(root.querySelectorAll(`${filterSelector} button[data-filter]`));
  let activeFilter = 'all';

  const updateButtons = () => {
    filterButtons.forEach((btn) => {
      const active = btn.dataset.filter === activeFilter;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.classList.toggle('bg-blue-600', active);
      btn.classList.toggle('text-white', active);
    });
  };

  const sortCards = (mode) => {
    if (!sortSelect || !sorters) return;
    (sorters[mode] || sorters.default || (() => 0)) && [...cards].sort(sorters[mode] || sorters.default).forEach((card) => list.appendChild(card));
  };

  const apply = () => {
    const query = normalise(searchInput?.value || '');
    let visible = 0;
    cards.forEach((card) => {
      const matchesFilter = activeFilter === 'all' || (card.dataset.tags || '').includes(activeFilter);
      const text = `${card.querySelector('h2')?.textContent || ''} ${card.querySelector('p')?.textContent || ''}`;
      const matchesQuery = !query || normalise(text).includes(query);
      const show = matchesFilter && matchesQuery;
      card.style.display = show ? '' : 'none';
      if (show) visible += 1;
    });
    if (countEl) {
      countEl.textContent = visible === cards.length ? labels.all : visible === 0 ? labels.none : `Showing ${visible} ${labels.noun}${visible > 1 ? 's' : ''}.`;
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter || 'all';
      updateButtons();
      apply();
    });
  });

  searchInput?.addEventListener('input', apply);
  sortSelect?.addEventListener('change', (event) => {
    sortCards(event.target.value);
    apply();
  });

  updateButtons();
  apply();
}

export function initProjectFilters(root = document) {
  toggleDetails(root);
  setupFilters({
    root,
    listSelector: '[data-project-grid]',
    cardSelector: '[data-project-card]',
    searchId: 'project-search',
    sortId: 'project-sort',
    countId: 'results-count',
    filterSelector: '[data-filter-group]',
    labels: {
      all: 'Showing all projects.',
      none: 'No projects match the current filters.',
      noun: 'project'
    },
    sorters: {
      impact: (a, b) => Number(b.dataset.impact || 0) - Number(a.dataset.impact || 0),
      default: (a, b) => Number(b.dataset.recency || 0) - Number(a.dataset.recency || 0)
    }
  });
}

export function initPublicationFilters(root = document) {
  setupFilters({
    root,
    listSelector: '[data-publication-list]',
    cardSelector: '[data-publication]',
    searchId: 'publication-search',
    sortId: 'publication-sort',
    countId: 'publication-count',
    filterSelector: '[data-publication-filter-group]',
    labels: {
      all: 'Showing all publications.',
      none: 'No publications match the current filters.',
      noun: 'publication'
    },
    sorters: {
      title: (a, b) => normalise(a.querySelector('h2')?.textContent || '').localeCompare(normalise(b.querySelector('h2')?.textContent || '')),
      default: (a, b) => Number(b.dataset.year || 0) - Number(a.dataset.year || 0)
    }
  });
}

export function initTalkFilters(root = document) {
  setupFilters({
    root,
    listSelector: '[data-talk-list]',
    cardSelector: '[data-talk]',
    searchId: 'talk-search',
    sortId: 'talk-sort',
    countId: 'talk-count',
    filterSelector: '[data-talk-filter-group]',
    labels: {
      all: 'Showing all talks.',
      none: 'No talks match the current filters.',
      noun: 'talk'
    },
    sorters: {
      title: (a, b) => normalise(a.querySelector('h2')?.textContent || '').localeCompare(normalise(b.querySelector('h2')?.textContent || '')),
      default: (a, b) => (new Date(b.dataset.date || '').getTime() || 0) - (new Date(a.dataset.date || '').getTime() || 0)
    }
  });
}
