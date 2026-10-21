(() => {
  'use strict';

  const root = document.documentElement;
  const main = document.querySelector('main');
  const menu = document.querySelector('.top-menu');
  const navigation = document.querySelector('[data-desktop-section-nav]');
  const previous = navigation?.querySelector('[data-section-nav-up]');
  const next = navigation?.querySelector('[data-section-nav-down]');
  const desktop = matchMedia('(min-width: 821px)');
  if (!main || !menu || !previous || !next) return;

  let entries = [];
  let active = false;
  let fitting = 0;
  let syncing = 0;
  let resizing = 0;
  const observer = new ResizeObserver(() => scheduleFit());
  const enabled = () => desktop.matches && ['pt-BR', 'en'].includes(root.dataset.language);
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sectionKey = section => section.id || 'desfiles';

  function stops() {
    return [
      { element: document.getElementById('hero'), key: 'hero' },
      ...entries.map(entry => ({ element: entry.frame, key: entry.key })),
      { element: document.querySelector('body > .footer'), key: 'rodape' }
    ].filter(stop => stop.element && stop.element.offsetHeight > 0);
  }

  function stopTop(stop) {
    const top = stop.element.getBoundingClientRect().top + scrollY;
    return Math.max(0, Math.min(top, document.documentElement.scrollHeight - innerHeight));
  }

  function currentIndex(list = stops()) {
    return list.reduce((best, stop, index) =>
      Math.abs(stopTop(stop) - scrollY) < Math.abs(stopTop(list[best]) - scrollY) ? index : best, 0);
  }

  function syncButtons() {
    syncing = 0;
    if (!active) return;
    const list = stops();
    const index = currentIndex(list);
    previous.disabled = index === 0;
    next.disabled = index === list.length - 1;
  }

  function scheduleSync() {
    if (active && !syncing) syncing = requestAnimationFrame(syncButtons);
  }

  function navigateTo(key, behavior = reducedMotion() ? 'instant' : 'smooth') {
    const target = stops().find(stop => stop.key === key);
    if (!active || !target) return;
    const url = new URL(location.href);
    url.hash = key;
    history.replaceState(history.state, '', url);
    window.scrollTo({ top: stopTop(target), behavior });
    scheduleSync();
  }

  function fit(entry) {
    const { section, frame } = entry;
    // Mede o grupo em seu tamanho original; nunca altera transforms dos SVGs.
    section.style.transform = 'none';
    section.style.width = `${frame.clientWidth}px`;
    const sectionRect = section.getBoundingClientRect();
    // Nestas duas composições, os SVGs decorativos têm grandes áreas vazias.
    // O carrossel e a arte de texto delimitam o conteúdo que deve ficar no centro.
    const contentSelector = entry.key === 'lineup' ? '.lineup-section__day'
      : entry.key === 'verdadeiro' ? '.verdadeiro-section__logo'
      : entry.key === 'faq-preview' ? '.faq-preview__content'
      : entry.key === 'othon' ? '.othon__description, .othon__mobile-logo'
      : entry.key === 'pos-hero' ? 'img, svg[data-text-art]'
      : 'img, svg[data-text-art], video, #lead-form';
    const objects = Array.from(section.querySelectorAll(contentSelector))
      .filter(element => !element.closest('[hidden]') && element.getClientRects().length)
      .map(element => {
        const rect = element.getBoundingClientRect();
        // O deslocamento do mapa é independente do enquadramento da seção 10.
        // Mede sua posição original para não deslocar também o texto aprovado.
        if (entry.key === 'after-othon' && element.matches('.after-othon-section__map')) {
          return { left: rect.left, right: rect.right, width: rect.width, height: rect.height,
            top: sectionRect.top, bottom: sectionRect.top + rect.height };
        }
        return rect;
      })
      .filter(rect => rect.width > 0 && rect.height > 0);
    const bounds = objects.length ? {
      left: Math.min(...objects.map(rect => rect.left)) - sectionRect.left,
      right: Math.max(...objects.map(rect => rect.right)) - sectionRect.left,
      top: Math.min(...objects.map(rect => rect.top)) - sectionRect.top,
      bottom: Math.max(...objects.map(rect => rect.bottom)) - sectionRect.top
    } : { left: 0, right: section.offsetWidth, top: 0, bottom: section.offsetHeight };
    const menuBottom = Math.max(0, menu.getBoundingClientRect().bottom);
    const padding = Math.max(18, Math.min(32, innerHeight * 0.025));
    // O enquadramento nunca redimensiona as artes. Uma composição alta mantém
    // espaço de rolagem dentro da própria seção, sem cortar o conteúdo.
    frame.style.height = `${Math.max(innerHeight, menuBottom + bounds.bottom - bounds.top + padding * 2)}px`;
    const x = frame.clientWidth / 2 - (bounds.left + bounds.right) / 2;
    const y = menuBottom + (frame.clientHeight - menuBottom) / 2 - (bounds.top + bounds.bottom) / 2;
    section.style.transform = `translate(${x}px, ${y}px)`;
  }

  function fitAll() {
    fitting = 0;
    if (!active) return;
    entries.forEach(entry => {
      // Uma imagem pode terminar de carregar durante a entrada animada.
      // Nesse caso, espera o fim para medir sua posição final sem reiniciar o efeito.
      const moving = entry.section.getAnimations({ subtree: true }).some(animation =>
        animation.playState === 'running' && animation.effect?.getTiming().iterations !== Infinity);
      if (moving) entry.pending = true;
      else { fit(entry); entry.pending = false; }
    });
    scheduleSync();
  }

  function scheduleFit() {
    if (active && !fitting) fitting = requestAnimationFrame(fitAll);
  }

  function teardown() {
    observer.disconnect();
    entries.forEach(({ section, frame, inlineStyle, imageLoading }) => {
      frame.replaceWith(section);
      if (inlineStyle === null) section.removeAttribute('style');
      else section.setAttribute('style', inlineStyle);
      imageLoading.forEach(({ image, loading }) => {
        if (loading === null) image.removeAttribute('loading');
        else image.setAttribute('loading', loading);
      });
    });
    entries = [];
    active = false;
    delete root.dataset.desktopAnchors;
  }

  function setup() {
    if (active || !enabled()) return;
    const sections = Array.from(main.children).filter(section =>
      section.matches('section:not(#hero)') && !section.hidden && section.offsetHeight > 0);
    const measurements = sections.map(section => ({
      section, key: sectionKey(section), order: getComputedStyle(section).order,
      inlineStyle: section.getAttribute('style'), height: section.getBoundingClientRect().height,
      imageLoading: Array.from(section.querySelectorAll('img')).map(image => ({ image, loading: image.getAttribute('loading') }))
    }));
    measurements.sort((a, b) => Number(a.order) - Number(b.order));
    root.dataset.desktopAnchors = 'true';
    active = true;
    entries = measurements.map(entry => {
      const frame = document.createElement('div');
      frame.className = 'desktop-anchor-frame';
      frame.dataset.anchor = entry.key;
      frame.style.order = entry.order;
      if (!entry.section.id) frame.id = entry.key;
      entry.section.before(frame);
      frame.append(entry.section);
      // Conhece as dimensões das artes antes de o visitante chegar à âncora.
      entry.imageLoading.forEach(({ image }) => { image.loading = 'eager'; });
      // As proporções de cada composição são mantidas dentro do enquadramento.
      if (!entry.section.matches('.signup, .faq-preview')) entry.section.style.height = `${entry.height}px`;
      const result = { ...entry, frame };
      fit(result);
      observer.observe(entry.section);
      return result;
    });
    syncButtons();
    requestAnimationFrame(() => {
      if (active && location.hash) navigateTo(decodeURIComponent(location.hash.slice(1)), 'instant');
    });
  }

  // Intercepta somente as setas de seção no desktop PT/EN. O script produtivo fica intacto.
  navigation.addEventListener('click', event => {
    const button = event.target.closest('[data-section-nav-up], [data-section-nav-down]');
    if (!active || !button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const list = stops();
    const direction = button === previous ? -1 : 1;
    const target = list[currentIndex(list) + direction];
    if (target) navigateTo(target.key);
  }, true);

  document.addEventListener('click', event => {
    if (!active) return;
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const key = link.getAttribute('href').slice(1);
    if (!stops().some(stop => stop.key === key)) return;
    event.preventDefault();
    navigateTo(key);
  });

  main.addEventListener('load', scheduleFit, true);
  main.addEventListener('animationend', () => {
    if (entries.some(entry => entry.pending)) scheduleFit();
  });
  window.addEventListener('scroll', scheduleSync, { passive: true });
  window.addEventListener('hashchange', () => {
    if (active) navigateTo(decodeURIComponent(location.hash.slice(1)));
  });
  window.addEventListener('resize', () => {
    clearTimeout(resizing);
    resizing = setTimeout(() => {
      const key = active ? stops()[currentIndex()].key : location.hash.slice(1);
      teardown();
      setup();
      if (active && key) navigateTo(key, 'instant');
    }, 120);
  });
  window.addEventListener('camarote:languagechange', () => {
    // Cada idioma tem artes e seções próprias: refaz as medidas e as paradas.
    const key = active ? stops()[currentIndex()].key : location.hash.slice(1);
    teardown();
    setup();
    if (active && key) navigateTo(key, 'instant');
  });
  desktop.addEventListener('change', () => {
    if (!enabled()) teardown();
    else setup();
  });
  document.fonts?.ready.then(scheduleFit);
  window.addEventListener('camarote:textartready', scheduleFit);
  setup();
})();
