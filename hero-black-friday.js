(() => {
  'use strict';
  const START = Date.parse('2026-11-16T00:00:00-03:00');
  const END = Date.parse('2026-11-28T00:00:00-03:00');
  const active = now => now >= START && now < END;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { START, END, active };
    return;
  }
  const testHost = ['localhost', '127.0.0.1', '[::1]', 'b2bpartnersbrzl.github.io'].includes(location.hostname);
  const preview = location.hostname === 'b2bpartnersbrzl.github.io' || (testHost && new URLSearchParams(location.search).get('hero') === 'black-friday');
  const enabled = preview || active(Date.now());
  window.MarHeroCampaign = { active: enabled };
  if (!enabled) return;
  document.documentElement.classList.add('mar-bf-hero-active');
  // Bloqueia o carregamento do MP4 antes de a seção ser construída.
  window.MarHeroPreview = { start() {}, canPlay: () => false, isBuffering: () => false };
  const target = 'https://www.ticketmaster.com.br/event/rio-carnaval-2027-camarote-mar-comissarios/CLIENTEVIP';
  let mounted = false;
  function mount() {
    if (mounted) return;
    const hero = document.querySelector('.mar-hero');
    const button = hero?.querySelector('.mar-hero-bottom a');
    if (!hero || !button) return;
    mounted = true;
    const lang = document.documentElement.lang.slice(0, 2);
    const copy = {
      pt: { button: 'COMPRE AGORA', offer: 'Combos com até R$ 850 de desconto. Em até 3 vezes sem juros.', date: '16 a 27 de novembro · Ingressos limitados' },
      en: { button: 'BUY NOW', offer: 'Combos with up to R$850 off. Up to 3 interest-free installments.', date: 'November 16 to 27 · Limited tickets' },
      es: { button: 'COMPRA AHORA', offer: 'Combos con hasta R$850 de descuento. Hasta 3 cuotas sin intereses.', date: 'Del 16 al 27 de noviembre · Entradas limitadas' }
    }[lang] || null;
    if (!copy) return;
    const previous = { href: button.getAttribute('href'), text: button.textContent };
    const image = new Image(1200, 676);
    image.className = 'mar-bf-hero-art';
    image.alt = `Black Friday CAMAROTE MAR. ${copy.date}. ${copy.offer}`;
    image.fetchPriority = 'high';
    const artworkLang = ['en', 'es'].includes(lang) ? lang : 'pt';
    const picture = document.createElement('picture');
    const expanded = document.createElement('source');
    expanded.media = '(min-width: 768px)';
    expanded.srcset = new URL(`assets/cliente-20261116/hero-black-friday-laterais-${artworkLang}.png`, document.baseURI).href;
    picture.append(expanded, image);
    image.src = new URL(`assets/cliente-20261114/hero-black-friday-${artworkLang}.png`, document.baseURI).href;
    hero.prepend(picture);
    const desktop = matchMedia(expanded.media);
    const original = artworkLang === 'pt' ? { width: 1200, height: 676, side: 414 } : { width: 1671, height: 941, side: 576 };
    // Conserva o tamanho e a posição do centro original; só as laterais ficam maiores.
    function fitArtwork() {
      if (!desktop.matches) {
        image.classList.remove('mar-bf-hero-art-expanded');
        ['width', 'height', 'left', 'top'].forEach(property => image.style.removeProperty(property));
        return;
      }
      const header = document.querySelector('.mar-header')?.getBoundingClientRect().height || 0;
      const width = hero.clientWidth;
      const height = Math.max(0, hero.clientHeight - header);
      const scale = Math.min(width / original.width, height / original.height);
      const expandedWidth = (original.width + 2 * original.side) * scale;
      image.classList.add('mar-bf-hero-art-expanded');
      image.style.width = `${expandedWidth}px`;
      image.style.height = `${original.height * scale}px`;
      image.style.left = `${(width - expandedWidth) / 2}px`;
      image.style.top = `${header + (height - original.height * scale) / 2}px`;
    }
    const observer = new ResizeObserver(fitArtwork);
    observer.observe(hero);
    desktop.addEventListener('change', fitArtwork);
    image.addEventListener('load', fitArtwork);
    fitArtwork();
    const details = document.createElement('div');
    details.className = 'mar-bf-hero-details';
    const offer = document.createElement('p');
    offer.textContent = copy.offer;
    const date = document.createElement('small');
    date.textContent = copy.date;
    details.append(offer, date);
    hero.insertBefore(details, button.parentElement);
    button.href = target;
    button.textContent = copy.button;
    const video = hero.querySelector('video');
    video?.pause();
    // Também restaura o vídeo se a aba permanecer aberta até o fim da campanha.
    const timer = setInterval(() => {
      if (preview || active(Date.now())) return;
      clearInterval(timer);
      observer.disconnect();
      desktop.removeEventListener('change', fitArtwork);
      picture.remove(); details.remove();
      button.setAttribute('href', previous.href);
      button.textContent = previous.text;
      window.MarHeroCampaign.active = false;
      document.documentElement.classList.remove('mar-bf-hero-active');
      document.dispatchEvent(new Event('mar-campaign-end'));
      window.dispatchEvent(new Event('resize'));
    }, 1000);
  }
  document.addEventListener('readystatechange', () => {
    if (document.readyState === 'interactive') mount();
  });
  document.addEventListener('DOMContentLoaded', () => {
    mount();
    // O controlador legado normaliza links Ticketmaster durante a inicialização.
    const button = document.querySelector('.mar-hero-bottom a');
    if (window.MarHeroCampaign.active && button) {
      button.href = target;
      button.textContent = ({pt:'COMPRE AGORA',en:'BUY NOW',es:'COMPRA AHORA'})[document.documentElement.lang.slice(0,2)] || 'COMPRE AGORA';
    }
  }, { once: true });
})();
