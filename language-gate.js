(() => {
  'use strict';

  const gate = document.querySelector('[data-language-gate]');
  const trigger = gate?.querySelector('[data-language-gate-trigger]');
  const menu = gate?.querySelector('[data-language-gate-menu]');

  function setMenuOpen(open) {
    if (!gate || !trigger || !menu) return;
    gate.classList.toggle('is-open', open);
    trigger.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  }

  if (gate && trigger && menu) {
    trigger.addEventListener('click', () => {
      const open = trigger.getAttribute('aria-expanded') !== 'true';
      setMenuOpen(open);
      if (open) menu.querySelector('a')?.focus();
    });

    document.addEventListener('click', (event) => {
      if (!gate.contains(event.target)) setMenuOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || trigger.getAttribute('aria-expanded') !== 'true') return;
      setMenuOpen(false);
      trigger.focus();
    });
  }

  const video = document.querySelector('.hero__video');
  const mobileSource = video?.querySelector('source[media]');
  const desktopSource = video?.querySelector('source:not([media])');

  if (video && mobileSource && desktopSource) {
    const mediaQuery = window.matchMedia('(max-width: 640px)');
    const updateVideoSource = () => {
      const nextSource = mediaQuery.matches ? mobileSource.src : desktopSource.src;
      if (video.src === nextSource) return;
      const wasPlaying = !video.paused;
      video.src = nextSource;
      video.load();
      if (wasPlaying) video.play().catch(() => {});
    };

    updateVideoSource();
    mediaQuery.addEventListener('change', updateVideoSource);
  }
})();
