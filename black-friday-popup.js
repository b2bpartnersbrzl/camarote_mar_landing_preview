(() => {
  'use strict';
  const START = Date.parse('2026-11-16T00:00:00-03:00');
  const END = Date.parse('2026-11-28T00:00:00-03:00');
  const active = now => now >= START && now < END;
  const remaining = now => {
    const total = Math.max(0, Math.ceil((END - now) / 1000));
    return [Math.floor(total / 86400), Math.floor(total / 3600) % 24,
      Math.floor(total / 60) % 60, total % 60].map(n => String(n).padStart(2, '0'));
  };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { START, END, active, remaining };
    return;
  }
  const previewHost = ['localhost', '127.0.0.1', '[::1]', 'b2bpartnersbrzl.github.io'].includes(location.hostname);
  const preview = previewHost && new URLSearchParams(location.search).get('popup') === 'black-friday';
  const seenKey = 'mar-black-friday-2026-seen';
  if (!preview && !active(Date.now())) return;
  try { if (!preview && sessionStorage.getItem(seenKey)) return; } catch (_) {}
  const language = document.documentElement.lang.slice(0, 2);
  const copy = {
    pt: { close: 'Fechar promoção', title: 'Black Friday CAMAROTE MAR',
      alt: 'Black Friday, de 16 a 27 de novembro. Compre com desconto em até 3 vezes sem juros. Ingressos limitados.',
      buy: 'Garanta seu ingresso na Ticketmaster. Abre em outra aba.', units: 'DIAS : HORAS : MIN : SEG', end: 'A oferta termina em' },
    en: { close: 'Close promotion', title: 'CAMAROTE MAR Black Friday',
      alt: 'Black Friday, November 16 to 27. Buy at a discount in up to 3 interest-free installments. Limited tickets.',
      buy: 'Get your ticket on Ticketmaster. Opens in a new tab.', units: 'DAYS : HOURS : MIN : SEC', end: 'Offer ends in' },
    es: { close: 'Cerrar promoción', title: 'Black Friday CAMAROTE MAR',
      alt: 'Black Friday, del 16 al 27 de noviembre. Compra con descuento en hasta 3 cuotas sin intereses. Entradas limitadas.',
      buy: 'Consigue tu entrada en Ticketmaster. Se abre en otra pestaña.', units: 'DÍAS : HORAS : MIN : SEG', end: 'La oferta termina en' }
  }[language] || null;
  const text = copy || { close: 'Fechar promoção', title: 'Black Friday CAMAROTE MAR', alt: 'Black Friday CAMAROTE MAR, de 16 a 27 de novembro.', buy: 'Comprar ingresso na Ticketmaster', units: 'DIAS : HORAS : MIN : SEG', end: 'A oferta termina em' };
  const open = () => {
    if (!preview && !active(Date.now())) return;
    if (document.querySelector('dialog[open]')) return;
    const dialog = document.createElement('dialog');
    dialog.className = 'mar-bf-popup';
    dialog.setAttribute('aria-label', text.title);
    const artwork = new Image(1200, 1200);
    artwork.className = 'mar-bf-art';
    artwork.alt = text.alt;
    artwork.decoding = 'async';
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'mar-bf-close';
    close.setAttribute('aria-label', text.close);
    close.textContent = '×';
    const timer = document.createElement('div');
    timer.className = 'mar-bf-timer';
    timer.setAttribute('role', 'timer');
    timer.setAttribute('aria-label', text.end);
    timer.setAttribute('aria-live', 'off');
    const digits = document.createElement('span');
    const units = document.createElement('small');
    units.textContent = text.units;
    timer.append(digits, units);
    const buy = document.createElement('a');
    buy.className = 'mar-bf-buy';
    buy.href = 'https://www.ticketmaster.com.br/event/rio-carnaval-2027-camarote-mar-comissarios/amigosdomar';
    buy.target = '_blank';
    buy.rel = 'noopener noreferrer';
    buy.setAttribute('aria-label', text.buy);
    dialog.append(artwork, timer, buy, close);
    document.body.append(dialog);
    let interval;
    const priorFocus = document.activeElement;
    const update = () => {
      if (!preview && !active(Date.now())) { dialog.close(); return; }
      digits.textContent = remaining(Date.now()).join(':');
    };
    const cleanup = () => {
      clearInterval(interval);
      document.documentElement.classList.remove('mar-bf-open');
      dialog.remove();
      if (priorFocus?.isConnected) priorFocus.focus({ preventScroll: true });
    };
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', cleanup, { once: true });
    artwork.onload = () => {
      if ((!preview && !active(Date.now())) || document.querySelector('dialog[open]')) { dialog.remove(); return; }
      update();
      dialog.showModal();
      document.documentElement.classList.add('mar-bf-open');
      close.focus({ preventScroll: true });
      try { if (!preview) sessionStorage.setItem(seenKey, '1'); } catch (_) {}
      interval = setInterval(update, 1000);
    };
    artwork.onerror = () => dialog.remove();
    const imageName = ['en', 'es'].includes(language) ? `black-friday-${language}.png` : 'black-friday-original.png';
    artwork.src = new URL(`assets/cliente-20261114/${imageName}`, document.baseURI).href;
  };
  // A arte só é solicitada na campanha ou na visualização explícita de teste.
  setTimeout(open, 1200);
})();
