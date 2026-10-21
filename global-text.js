/* O conteúdo textual está no HTML. Este adaptador apenas escolhe a arte correspondente
   ao idioma/tela e mantém os elementos usados pelos scripts existentes. */
(() => {
  'use strict';
  const clean = value => (value || '').split('?')[0];
  const entries = Array.from(document.querySelectorAll('img[data-text-owner]')).map(image => ({
    image,
    copies: Array.from(document.querySelectorAll(`svg[data-text-owner="${image.dataset.textOwner}"]`))
  }));
  function sync({ image, copies }) {
    const picture = image.closest('picture');
    const source = picture && Array.from(picture.querySelectorAll('source')).find(s => !s.media || matchMedia(s.media).matches);
    const file = clean(source ? source.getAttribute('srcset') : image.getAttribute('src'));
    const selected = copies.find(svg => svg.dataset.textArt === file);
    copies.forEach(svg => {
      svg.setAttribute('class', image.getAttribute('class') || '');
      svg.setAttribute('src', file);
      if (image.hasAttribute('style')) svg.setAttribute('style', image.getAttribute('style'));
      else svg.removeAttribute('style');
      const hidden = svg !== selected || image.hidden;
      svg.toggleAttribute('hidden', hidden);
      if (image.hasAttribute('aria-hidden')) svg.setAttribute('aria-hidden', image.getAttribute('aria-hidden'));
      if (image.hasAttribute('tabindex')) svg.setAttribute('tabindex', hidden ? '-1' : image.getAttribute('tabindex'));
    });
    image.toggleAttribute('data-text-ready', !!selected);
  }
  entries.forEach(entry => {
    sync(entry);
    const observer = new MutationObserver(() => sync(entry));
    observer.observe(entry.image, { attributes: true, attributeFilter: ['src','class','style','hidden','aria-hidden','tabindex'] });
    entry.image.closest('picture')?.querySelectorAll('source').forEach(source => observer.observe(source, { attributes:true, attributeFilter:['srcset','media'] }));
    if (entry.image.hasAttribute('data-parade-day')) entry.copies.forEach(svg => {
      svg.addEventListener('pointerenter', () => entry.image.dispatchEvent(new PointerEvent('pointerenter')));
      svg.addEventListener('focus', () => entry.image.dispatchEvent(new FocusEvent('focus')));
      svg.addEventListener('click', () => entry.image.click());
      svg.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); entry.image.click(); } });
    });
  });
  const syncAll = () => {
    entries.forEach(sync);
    document.fonts?.ready.then(() => window.dispatchEvent(new Event('camarote:textartready')));
  };
  window.addEventListener('resize', syncAll);
  window.addEventListener('camarote:languagechange', syncAll);
  syncAll();
})();
