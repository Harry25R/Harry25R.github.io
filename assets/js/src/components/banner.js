const storageKey = 'harry-banner-dismissed';

function dismissed() {
  try {
    return localStorage.getItem(storageKey) === 'true';
  } catch (error) {
    return false;
  }
}

function remember() {
  try {
    localStorage.setItem(storageKey, 'true');
  } catch (error) {
    // ignore
  }
}

export function initBanner(root = document) {
  const mount = root.querySelector('[data-banner-root]');
  if (!mount || dismissed()) return;
  const template = mount.querySelector('template#banner-template');
  if (!template) return;

  let visible = false;

  const show = () => {
    if (visible) return;
    visible = true;
    const fragment = template.content.cloneNode(true);
    const banner = fragment.querySelector('aside');
    if (!banner) return;
    banner.dataset.bannerActive = 'true';
    fragment.querySelector('[data-banner-dismiss]')?.addEventListener('click', () => {
      banner.remove();
      remember();
    });
    mount.appendChild(fragment);
  };

  const onScroll = () => {
    if (window.scrollY > document.documentElement.scrollHeight * 0.5) {
      show();
      window.removeEventListener('scroll', onScroll);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}
