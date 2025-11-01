(function () {
  const root = document.documentElement;
  root.classList.remove('no-js');

  const storageKey = 'harry-theme-preference';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const themeToggle = document.getElementById('theme-toggle');

  const getStoredTheme = () => {
    try {
      return localStorage.getItem(storageKey);
    } catch (err) {
      return null;
    }
  };

  const storeTheme = (theme) => {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (err) {
      // ignore write failures, e.g., in private mode
    }
  };

  const applyTheme = (theme, persist = false) => {
    const resolved = theme || (prefersDark.matches ? 'dark' : 'light');
    root.setAttribute('data-theme', resolved);
    if (persist) {
      storeTheme(resolved);
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', resolved === 'dark');
    }
  };

  const storedTheme = getStoredTheme();
  applyTheme(storedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next, true);
    });
  }

  const handleSchemeChange = (event) => {
    if (!getStoredTheme()) {
      applyTheme(event.matches ? 'dark' : 'light');
    }
  };

  if (typeof prefersDark.addEventListener === 'function') {
    prefersDark.addEventListener('change', handleSchemeChange);
  } else if (typeof prefersDark.addListener === 'function') {
    prefersDark.addListener(handleSchemeChange);
  }

  // Navigation menu toggle with focus trap
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.getElementById('primary-navigation');
  let focusableNavElements = [];
  let previousActiveElement = null;

  const focusSelectors = 'a[href], button:not([disabled]), select, textarea, input, [tabindex]:not([tabindex="-1"])';

  const closeMenu = () => {
    if (!primaryNav || !menuToggle) {
      return;
    }
    primaryNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    window.removeEventListener('keydown', handleKeydown);
    if (previousActiveElement) {
      previousActiveElement.focus();
    }
  };

  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      return;
    }
    if (event.key === 'Tab' && focusableNavElements.length > 0) {
      const first = focusableNavElements[0];
      const last = focusableNavElements[focusableNavElements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        document.body.classList.add('nav-open');
        previousActiveElement = document.activeElement;
        focusableNavElements = Array.from(primaryNav.querySelectorAll(focusSelectors));
        const firstFocusable = focusableNavElements[0];
        if (firstFocusable) {
          firstFocusable.focus();
        }
        window.addEventListener('keydown', handleKeydown);
      } else {
        document.body.classList.remove('nav-open');
        window.removeEventListener('keydown', handleKeydown);
      }
    });

    primaryNav.addEventListener('click', (event) => {
      const target = event.target;
      if (primaryNav.classList.contains('is-open') && target instanceof HTMLElement && target.tagName === 'A') {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) {
        primaryNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
        window.removeEventListener('keydown', handleKeydown);
      }
    });
  }

  // Project search, filter, and sort
  const projectsPage = document.querySelector('[data-page="projects"]');
  if (projectsPage) {
    const searchInput = document.getElementById('project-search');
    const filterButtons = Array.from(document.querySelectorAll('.filter-button')); 
    const sortSelect = document.getElementById('project-sort');
    const status = document.getElementById('projects-status');
    const cardContainer = document.getElementById('project-cards');
    const cards = Array.from(cardContainer ? cardContainer.children : []);
    const activeFilters = new Set(['all']);

    const normalise = (value) => value.toLowerCase().trim();

    const applyFilters = () => {
      const query = normalise(searchInput ? searchInput.value : '');
      const results = [];

      cards.forEach((card) => {
        const text = `${card.querySelector('h2').textContent} ${card.querySelector('p').textContent}`.toLowerCase();
        const tags = card.getAttribute('data-tags');
        const matchesQuery = !query || text.includes(query);
        const matchesFilter = activeFilters.has('all') || activeFilters.size === 0 || Array.from(activeFilters).some((tag) => tags.includes(tag));
        const visible = matchesQuery && matchesFilter;
        card.hidden = !visible;
        if (visible) {
          results.push(card);
        }
      });

      if (status) {
        if (results.length === 0) {
          status.textContent = 'No projects match your filters yet. Adjust search or tags to explore more work.';
        } else if (results.length === cards.length) {
          status.textContent = 'Showing all projects.';
        } else {
          status.textContent = `Showing ${results.length} project${results.length > 1 ? 's' : ''}.`;
        }
      }
    };

    const sortCards = (mode) => {
      const comparator = mode === 'impact'
        ? (a, b) => Number(b.getAttribute('data-impact')) - Number(a.getAttribute('data-impact'))
        : (a, b) => Number(b.getAttribute('data-recency')) - Number(a.getAttribute('data-recency'));
      const sorted = [...cards].sort(comparator);
      if (cardContainer) {
        sorted.forEach((card) => cardContainer.appendChild(card));
      }
    };

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        const isActive = button.classList.contains('is-active');

        if (filter === 'all') {
          activeFilters.clear();
          activeFilters.add('all');
          filterButtons.forEach((btn) => {
            btn.classList.toggle('is-active', btn === button);
            btn.setAttribute('aria-pressed', btn === button);
          });
        } else {
          activeFilters.delete('all');
          if (isActive) {
            activeFilters.delete(filter);
          } else {
            activeFilters.add(filter);
          }
          if (activeFilters.size === 0) {
            activeFilters.add('all');
            filterButtons.forEach((btn) => {
              const isAll = btn.getAttribute('data-filter') === 'all';
              btn.classList.toggle('is-active', isAll);
              btn.setAttribute('aria-pressed', isAll);
            });
          } else {
            filterButtons.forEach((btn) => {
              const tag = btn.getAttribute('data-filter');
              const active = activeFilters.has(tag);
              btn.classList.toggle('is-active', active);
              btn.setAttribute('aria-pressed', active);
            });
          }
        }
        applyFilters();
      });
    });

    if (sortSelect) {
      sortSelect.addEventListener('change', (event) => {
        sortCards(event.target.value);
        applyFilters();
      });
    }

    sortCards(sortSelect ? sortSelect.value : 'recency');
    applyFilters();
  }

  // BibTeX toggles
  const bibButtons = document.querySelectorAll('.bibtex-toggle');
  bibButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-bibtex');
      const block = document.getElementById(targetId);
      if (!block) {
        return;
      }
      const isHidden = block.hasAttribute('hidden');
      if (isHidden) {
        block.removeAttribute('hidden');
        button.setAttribute('aria-expanded', 'true');
        button.textContent = 'Hide BibTeX';
      } else {
        block.setAttribute('hidden', '');
        button.setAttribute('aria-expanded', 'false');
        button.textContent = 'Show BibTeX';
      }
    });
  });

  // Footer metadata
  const currentYear = document.getElementById('current-year');
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  const lastUpdated = document.getElementById('last-updated');
  if (lastUpdated) {
    const today = new Date();
    const formatted = today.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    lastUpdated.textContent = formatted;
  }
})();
