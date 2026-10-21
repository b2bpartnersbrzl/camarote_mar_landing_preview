(() => {
  'use strict';

  const carousel = document.querySelector('[data-lineup-carousel]');
  if (!carousel) return;
  const slides = Array.from(carousel.querySelectorAll('[data-lineup-slide]'));
  const previous = carousel.querySelector('[data-lineup-prev]');
  const next = carousel.querySelector('[data-lineup-next]');
  const cta = carousel.querySelector('[data-lineup-cta]');
  if (!slides.length || !previous || !next || !cta) return;
  let index = 0;
  let transitioning = false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const localizedImages = Array.from(document.querySelectorAll('#lineup [data-lineup-src-en]')).map((image) => ({
    image,
    portugueseSource: image.getAttribute('src'),
    portugueseAlt: image.getAttribute('alt') || ''
  }));
  const isEnglish = () => document.documentElement.dataset.language === 'en';

  const syncControls = () => {
    const day = slides[index].dataset.lineupSlide;
    carousel.dataset.activeDay = day;
    previous.hidden = index === 0;
    next.hidden = index === slides.length - 1;
    previous.disabled = transitioning || index === 0;
    next.disabled = transitioning || index === slides.length - 1;
    const english = isEnglish();
    previous.setAttribute('aria-label', index > 0
      ? (english ? `View February ${slides[index - 1].dataset.lineupSlide}` : `Ver dia ${slides[index - 1].dataset.lineupSlide} de fevereiro`)
      : (english ? 'Previous day' : 'Dia anterior'));
    next.setAttribute('aria-label', index < slides.length - 1
      ? (english ? `View February ${slides[index + 1].dataset.lineupSlide}` : `Ver dia ${slides[index + 1].dataset.lineupSlide} de fevereiro`)
      : (english ? 'Next day' : 'Próximo dia'));
    cta.setAttribute('aria-label', english ? `Buy tickets for February ${day} on Ticketmaster` : `Comprar ingresso para ${day} de fevereiro no Ticketmaster`);
  };

  const applyLanguage = () => {
    const english = isEnglish();
    localizedImages.forEach(({ image, portugueseSource, portugueseAlt }) => {
      const source = english ? image.dataset.lineupSrcEn : portugueseSource;
      if (image.getAttribute('src') !== source) image.setAttribute('src', source);
      image.setAttribute('alt', english ? image.dataset.lineupAltEn : portugueseAlt);
    });
    carousel.setAttribute('aria-label', english ? 'Daily lineup' : 'Programação por dia');
    carousel.setAttribute('aria-roledescription', english ? 'carousel' : 'carrossel');
    syncControls();
  };

  const settleSlides = () => {
    slides.forEach((slide, slideIndex) => {
      slide.hidden = slideIndex !== index;
      slide.setAttribute('aria-hidden', String(slideIndex !== index));
    });
  };

  const show = async (requestedIndex) => {
    if (transitioning) return;
    const targetIndex = Math.max(0, Math.min(slides.length - 1, requestedIndex));
    if (targetIndex === index) return;
    const outgoing = slides[index];
    const incoming = slides[targetIndex];
    const direction = targetIndex > index ? 1 : -1;
    index = targetIndex;

    if (reducedMotion.matches || typeof incoming.animate !== 'function') {
      settleSlides();
      syncControls();
      return;
    }

    transitioning = true;
    incoming.hidden = false;
    outgoing.setAttribute('aria-hidden', 'true');
    incoming.setAttribute('aria-hidden', 'false');
    syncControls();
    const animations = [];
    const options = { duration: 450, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)', fill: 'both' };
    try {
      animations.push(outgoing.animate([
        { transform: 'translateX(0)' },
        { transform: `translateX(${-direction * 100}%)` }
      ], options));
      animations.push(incoming.animate([
        { transform: `translateX(${direction * 100}%)` },
        { transform: 'translateX(0)' }
      ], options));
      await Promise.allSettled(animations.map((animation) => animation.finished));
    } finally {
      settleSlides();
      animations.forEach((animation) => animation.cancel());
      transitioning = false;
      syncControls();
    }
  };

  previous.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  carousel.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    show(index + (event.key === 'ArrowLeft' ? -1 : 1));
  });

  settleSlides();
  applyLanguage();
  window.addEventListener('camarote:languagechange', applyLanguage);
})();
