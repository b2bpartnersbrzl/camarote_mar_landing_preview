(() => {
  'use strict';

  const ENGLISH = 'en';
  const PORTUGUESE = 'pt-BR';
  const WHATSAPP_NUMBER = '5521993676741';
  const WHATSAPP_MESSAGE_PORTUGUESE = 'Olá! Gostaria de saber mais informações sobre o CAMAROTE MAR.';
  const WHATSAPP_MESSAGE_ENGLISH = 'Hello! I would like more information about CAMAROTE MAR.';
  const LOCAL_PAGES = new Set([
    'site.html',
    'faq.html',
    'politica-de-privacidade.html'
  ]);
  const DESKTOP_MEDIA = window.matchMedia('(min-width: 641px)');
  const MENU_CTA_PORTUGUESE = 'assets/botao_compra_menu.svg';
  const MENU_CTA_ENGLISH = 'assets/cta_venda-en.svg';
  const HERO_DATES_PORTUGUESE = 'assets/data_sessao_01_pt_desktop.svg';
  const HERO_DATES_PORTUGUESE_DESKTOP = 'assets/data_sessao_01_pt_desktop.svg';
  const HERO_DATES_ENGLISH = 'assets/data_en_session1_mobile_v2.svg';
  const HERO_DATES_ENGLISH_DESKTOP = 'assets/data_en_session1_desktop_v2.svg';
  const NUMBERS_PORTUGUESE = 'assets/numeros_pt_desktop_v3.svg';
  const NUMBERS_ENGLISH = 'assets/numeros_en_session2_desktop_v3.svg';
  const NUMBERS_MOBILE_PORTUGUESE = 'assets/sessao3_02_pt_mobile_v3.svg';
  const NUMBERS_MOBILE_ENGLISH = 'assets/sessao3_02_en_v3.svg';
  const TRUE_MAR_PORTUGUESE = 'assets/verdadeiro_mar_v2.svg';
  const TRUE_MAR_ENGLISH = 'assets/verdadeiro_en_mar_v2.svg';
  const TRUE_MAR_MOBILE_PORTUGUESE = 'assets/sessao4_01_mar_v2.svg';
  const TRUE_MAR_MOBILE_ENGLISH = 'assets/sessao4_01_en_mar_v2.svg';
  const VIDEO_DESCRIPTION_PORTUGUESE = 'assets/descricao_video_marca_v3.svg';
  const VIDEO_DESCRIPTION_ENGLISH = 'assets/descricao_video_en_marca_v3.svg';
  const SOCIAL_ART_PORTUGUESE = 'assets/ativo-2_mar_v2.svg';
  const SOCIAL_ART_ENGLISH = 'assets/ativo_2_en_mar_v2.svg';
  const SOCIAL_ART_MOBILE_PORTUGUESE = 'assets/sessao7_01_mar_v2.svg';
  const SOCIAL_ART_MOBILE_ENGLISH = 'assets/sessao7_01_en_mar_v2.svg';
  const FACILITIES_ART_PORTUGUESE = 'assets/ativo-3_mar_v2.svg';
  const FACILITIES_ART_ENGLISH = 'assets/ativo_3_en_mar_v2.svg';
  const FACILITIES_ART_MOBILE_PORTUGUESE = 'assets/sessao8_03_mar_v2.svg';
  const FACILITIES_ART_MOBILE_ENGLISH = 'assets/sessao8_03_en_mar_v2.svg';
  const OTHON_DESCRIPTION_PORTUGUESE = 'assets/othon_descricao.svg';
  const OTHON_DESCRIPTION_ENGLISH = 'assets/othon_descricao_en.svg';
  const OTHON_DESCRIPTION_MOBILE_PORTUGUESE = 'assets/sessao9_01.svg';
  const OTHON_DESCRIPTION_MOBILE_ENGLISH = 'assets/sessao9_01_en.svg';
  const AFTER_OTHON_ART_PORTUGUESE = 'assets/ativo-10_mar_v2.svg';
  const AFTER_OTHON_ART_ENGLISH = 'assets/ativo-13_en_mar_v2.svg';
  const AFTER_OTHON_ART_MOBILE_PORTUGUESE = 'assets/sessao10_02_mar_v2.svg';
  const AFTER_OTHON_ART_MOBILE_ENGLISH = 'assets/sessao10_02_en_mar_v2.svg';
  const FORM_TITLE_PORTUGUESE = 'assets/ativo-23.svg';
  const FORM_TITLE_ENGLISH = 'assets/form_title_en.svg';
  const FAQ_TITLE_MOBILE_PORTUGUESE = 'assets/head_faq_mobile.svg';
  const FAQ_TITLE_MOBILE_ENGLISH = 'assets/faq_title_mobile_en.svg';
  const PARADE_ORDER_TITLE_PORTUGUESE = 'assets/img/hero/ordem.svg';
  const PARADE_ORDER_TITLE_ENGLISH = 'assets/img/hero/ordem_en.svg';
  const PARADE_DAY_ASSETS = Object.freeze({
    sexta: Object.freeze({ portuguese: 'assets/img/hero/sexta.svg?v=20260813-white-day-items', english: 'assets/img/hero/sexta_en.svg' }),
    sabado: Object.freeze({ portuguese: 'assets/img/hero/sabado.svg?v=20260813-white-day-items', english: 'assets/img/hero/sabado_en.svg' }),
    domingo: Object.freeze({ portuguese: 'assets/img/hero/domingo.svg?v=20260813-white-day-items', english: 'assets/img/hero/domingo_en.svg' }),
    segunda: Object.freeze({ portuguese: 'assets/img/hero/segunda.svg?v=20260813-white-day-items', english: 'assets/img/hero/segunda_en.svg' }),
    terca: Object.freeze({ portuguese: 'assets/img/hero/terca.svg?v=20260813-white-day-items', english: 'assets/img/hero/terca_en.svg' })
  });

  const FAQ_ENGLISH = Object.freeze([
    Object.freeze({
      question: 'What is CAMAROTE MAR?',
      answer: 'CAMAROTE MAR is a premium Carnival experience at the Sambadrome. With more than 3,500 m², it offers all-inclusive service, full air conditioning, outstanding acoustics and the largest balcony on the avenue, providing a privileged view of the samba school parades next to the judges. More than a hospitality box, MAR brings together comfort, emotion and authenticity, where the heart of Rio beats to the rhythm of samba.'
    }),
    Object.freeze({
      question: 'What is included with the ticket?',
      answer: 'Your ticket grants access to CAMAROTE MAR on the date selected at the time of purchase. You will also enjoy a premium open bar and open food service with outstanding culinary curation, as well as live shows, a beauty area, exclusive experiences, Instagram-worthy spaces and transfer service, all designed to make your night unforgettable.'
    }),
    Object.freeze({
      question: 'Will there be an open bar and open food service?',
      answer: 'Yes. Every day at CAMAROTE MAR includes a complete all-you-can-eat buffet and an open bar operating continuously.'
    }),
    Object.freeze({
      question: 'Where is the Meeting Point and how does the transfer service work?',
      answer: 'The official CAMAROTE MAR Meeting Point is at Othon Palace Copacabana Rio, located at Avenida Atlântica, 3264, Copacabana, Rio de Janeiro. This is also the boarding point for the official transfer service. Schedules will be announced in advance through our official channels.'
    }),
    Object.freeze({
      question: 'How can I buy a ticket?',
      answer: 'Tickets are sold exclusively online through the Ticketmaster website.'
    }),
    Object.freeze({
      question: 'Which payment methods are accepted?',
      answer: 'Credit card and PIX.'
    }),
    Object.freeze({
      question: 'Can I exchange or cancel my ticket?',
      answer: 'You may cancel an online purchase within the statutory period of seven calendar days after purchase. Cancellations are not available after that period. Tickets cannot be exchanged after purchase.'
    }),
    Object.freeze({
      question: 'Is advance credentialing available?',
      answer: 'Yes. Advance credentialing will take place at a location and date to be announced. You may also complete credentialing at the meeting point on the day of the event.'
    }),
    Object.freeze({
      question: 'Is CAMAROTE MAR accessible?',
      answer: 'Yes. The CAMAROTE MAR facilities are accessible to people with reduced mobility.'
    }),
    Object.freeze({
      question: 'May I take photos and videos?',
      answer: 'Yes. We encourage guests to capture and share their experience on social media. Professional photography and filming equipment is not permitted.'
    }),
    Object.freeze({
      question: 'Is the ticket digital?',
      answer: 'Yes. The ticket is digital and includes a QR code. As a security measure for large events, your digital ticket will become available closer to the event date. After purchase, you will receive an email with the information needed to access it.'
    }),
    Object.freeze({
      question: 'What are the opening hours for CAMAROTE MAR?',
      answer: 'Opening and closing times are determined by LIESA, but we guarantee our show will continue until the final samba performance.'
    }),
    Object.freeze({
      question: 'What is the minimum age for admission?',
      answer: 'Guests must be at least 18 years old. A photo ID must be presented during credentialing and upon entry. The sale of tickets to and admission of minors is prohibited, even if they are legally emancipated or accompanied by a parent or legal guardian.'
    }),
    Object.freeze({
      question: 'How can I contact the CAMAROTE MAR team?',
      answer: 'Our official support channels are available via WhatsApp, email and social media. Contact information is available at the bottom of the page.'
    }),
    Object.freeze({
      question: 'Is there a place to store costumes, backpacks and bags?',
      answer: 'CAMAROTE MAR will offer a cloakroom service for personal belongings measuring up to 20 cm × 20 cm. There will be no space for costumes or larger items. For those items, the Sambadrome provides a dedicated costume storage area.'
    }),
    Object.freeze({
      question: 'How many CAMAROTE MAR tickets may I purchase?',
      answer: 'You may purchase up to four tickets per CPF.'
    }),
    Object.freeze({
      question: 'Can I exchange my ticket for another day?',
      answer: 'No. The event date cannot be changed after the ticket has been purchased.'
    }),
    Object.freeze({
      question: 'Can I transfer a CAMAROTE MAR ticket to another person or receive a ticket from someone else?',
      answer: 'Yes. Each ticket may be transferred once. The transfer cannot be undone unless the recipient returns the ticket.'
    }),
    Object.freeze({
      question: 'I bought several tickets: one for me and the others for friends. How will credentialing work?',
      answer: 'Ideally, each guest should keep their ticket in their own Quentro wallet. If all tickets remain in one wallet, the group must stay together throughout every stage, from credentialing through entry to the Sambadrome and CAMAROTE MAR. Every ticket must contain the personal details and registered facial data of the person who will use it.'
    }),
    Object.freeze({
      question: 'What do I need to bring for credentialing?',
      answer: 'Bring an original official photo ID and a valid ticket in the Quentro app. The only accepted digital identification document is the Brazilian digital driver’s license (CNH).'
    }),
    Object.freeze({
      question: 'Can I collect my ticket on one day and customize my shirt on another?',
      answer: 'No. Tickets cannot be collected on one day and the shirt customized on another date. After the shirt is collected, CAMAROTE MAR is not responsible for loss or exchanges.'
    }),
    Object.freeze({
      question: 'Can I buy my ticket at the meeting point?',
      answer: 'No tickets will be sold at the meeting point. Tickets are sold exclusively online through the Ticketmaster website.'
    }),
    Object.freeze({
      question: 'Is the official shirt mandatory?',
      answer: 'Yes. Along with facial recognition and a valid Quentro ticket, the official shirt is one of the admission controls. Any unauthorized alteration or item added to the shirt may result in denied admission.'
    }),
    Object.freeze({
      question: 'What do I need to present to board the transfer?',
      answer: 'The transfer is free and exclusive to guests holding a valid ticket for the corresponding day. To use it, you must wear the official shirt for that day and complete facial recognition. The transfer will drop passengers near the Sambadrome, where CAMAROTE MAR is located. Our team will be available to guide guests and provide a smooth experience from arrival onward.'
    })
  ]);

  const faqPortuguese = Array.from(document.querySelectorAll('.faq__list details')).map((item) => Object.freeze({
    question: item.querySelector('summary')?.textContent || '',
    answer: item.querySelector('p')?.textContent || ''
  }));

  const faqPreviewPortuguese = Array.from(document.querySelectorAll('.faq-preview details')).map((item) => ({
    item,
    index: Number(item.dataset.faqIndex),
    question: item.querySelector('summary')?.textContent || '',
    answer: item.querySelector('p')?.textContent || ''
  }));

  function currentLanguage() {
    return document.documentElement.dataset.language === ENGLISH ? ENGLISH : PORTUGUESE;
  }

  function valueFor(language, portuguese, english) {
    return language === ENGLISH ? english : portuguese;
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value;
    });
  }

  function emphasizeBrand(root = document.body) {
    const nodes = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!/\bMAR\b/.test(node.nodeValue)) continue;
      if (node.parentElement.closest('script, style, textarea, select, svg, [contenteditable], .brand-name')) continue;
      nodes.push(node);
    }
    nodes.forEach((node) => {
      const fragment = document.createDocumentFragment();
      node.nodeValue.split(/(CAMAROTE MAR|\bMAR\b)/g).forEach((part, index) => {
        if (index % 2) {
          const brand = document.createElement('strong');
          brand.className = 'brand-name';
          brand.textContent = part;
          fragment.append(brand);
        } else {
          fragment.append(document.createTextNode(part));
        }
      });
      node.replaceWith(fragment);
    });
  }

  function restoreFormTextNodes() {
    // The form's existing translations read direct text nodes before changing language.
    const form = document.getElementById('lead-form');
    if (!form) return;
    form.querySelectorAll('.brand-name').forEach((brand) => {
      const parent = brand.parentNode;
      brand.replaceWith(document.createTextNode(brand.textContent));
      parent.normalize();
    });
  }

  function setAttribute(selector, attribute, value) {
    document.querySelectorAll(selector).forEach((element) => {
      element.setAttribute(attribute, value);
    });
  }

  function setFaqIconLabels(language) {
    document.querySelectorAll('img[src^="assets/faq-link.svg"]').forEach((image) => {
      image.closest('a')?.setAttribute('aria-label', valueFor(language, 'Perguntas frequentes', 'Frequently asked questions'));
    });
  }

  function localizeLocalLinks(language) {
    document.querySelectorAll('a[href]').forEach((anchor) => {
      const rawHref = anchor.getAttribute('href');
      if (!rawHref || rawHref.startsWith('#')) return;

      const url = new URL(rawHref, window.location.href);
      const page = url.pathname.split('/').pop();
      if (url.origin !== window.location.origin || !LOCAL_PAGES.has(page)) return;

      url.searchParams.set('lang', language);
      const locale = document.documentElement.dataset.locale || language;
      const prefix = new URL(document.baseURI).pathname + (locale === 'pt-BR' ? '' : `${locale}/`);
      anchor.setAttribute('href', `${prefix}${page === 'site.html' ? '' : page}${url.hash}`);
    });
  }

  function syncMenuCta(language = currentLanguage()) {
    const image = document.querySelector('.top-menu__buy img');
    if (!image) return;

    const useEnglishAsset = language === ENGLISH;
    image.setAttribute('src', useEnglishAsset ? MENU_CTA_ENGLISH : MENU_CTA_PORTUGUESE);
  }

  function syncHeroDates(language = currentLanguage()) {
    const image = document.querySelector('.hero__dates');
    if (!image) return;

    const source = language === ENGLISH
      ? (DESKTOP_MEDIA.matches ? HERO_DATES_ENGLISH_DESKTOP : HERO_DATES_ENGLISH)
      : (DESKTOP_MEDIA.matches ? HERO_DATES_PORTUGUESE_DESKTOP : HERO_DATES_PORTUGUESE);
    image.setAttribute('src', source);
  }

  function syncPostHeroNumbers(language = currentLanguage()) {
    const image = document.querySelector('.post-hero-section__numbers');
    const mobileSource = document.querySelector('#pos-hero source[media="(max-width: 640px)"]');
    if (!image) return;

    const useEnglishDesktopAsset = language === ENGLISH && DESKTOP_MEDIA.matches;
    image.setAttribute('src', useEnglishDesktopAsset ? NUMBERS_ENGLISH : NUMBERS_PORTUGUESE);
    if (mobileSource) {
      mobileSource.setAttribute('srcset', language === ENGLISH ? NUMBERS_MOBILE_ENGLISH : NUMBERS_MOBILE_PORTUGUESE);
    }
  }

  function syncTrueMarArt(language = currentLanguage()) {
    const image = document.querySelector('.verdadeiro-section__logo');
    const mobileArt = document.querySelector('.verdadeiro-section__mobile-art');
    if (!image) return;

    const useEnglishAsset = language === ENGLISH && DESKTOP_MEDIA.matches;
    image.setAttribute('src', useEnglishAsset ? TRUE_MAR_ENGLISH : TRUE_MAR_PORTUGUESE);
    if (mobileArt) {
      mobileArt.setAttribute('src', language === ENGLISH ? TRUE_MAR_MOBILE_ENGLISH : TRUE_MAR_MOBILE_PORTUGUESE);
    }
  }

  function syncVideoAssets(language = currentLanguage()) {
    const description = document.querySelector('.video__description');
    const cta = document.querySelector('.video__buy-cta img');
    const useEnglishDescription = language === ENGLISH;
    const useEnglishCta = language === ENGLISH;

    if (description) {
      description.setAttribute('src', useEnglishDescription ? VIDEO_DESCRIPTION_ENGLISH : VIDEO_DESCRIPTION_PORTUGUESE);
    }
    if (cta) {
      cta.setAttribute('src', useEnglishCta ? MENU_CTA_ENGLISH : MENU_CTA_PORTUGUESE);
    }
  }

  function syncSocialArt(language = currentLanguage()) {
    const image = document.querySelector('.social-section__art');
    const mobileSource = document.querySelector('#social source[media="(max-width: 640px)"]');
    if (!image) return;

    const useEnglishAsset = language === ENGLISH && DESKTOP_MEDIA.matches;
    image.setAttribute('src', useEnglishAsset ? SOCIAL_ART_ENGLISH : SOCIAL_ART_PORTUGUESE);
    if (mobileSource) {
      mobileSource.setAttribute('srcset', language === ENGLISH ? SOCIAL_ART_MOBILE_ENGLISH : SOCIAL_ART_MOBILE_PORTUGUESE);
    }
  }

  function syncFacilitiesArt(language = currentLanguage()) {
    const image = document.querySelector('.facilities-section__art');
    const mobileSource = document.querySelector('#facilities source[media="(max-width: 640px)"]');
    if (!image) return;

    const useEnglishAsset = language === ENGLISH && DESKTOP_MEDIA.matches;
    image.setAttribute('src', useEnglishAsset ? FACILITIES_ART_ENGLISH : FACILITIES_ART_PORTUGUESE);
    if (mobileSource) {
      mobileSource.setAttribute('srcset', language === ENGLISH ? FACILITIES_ART_MOBILE_ENGLISH : FACILITIES_ART_MOBILE_PORTUGUESE);
    }
  }

  function syncOthonDescription(language = currentLanguage()) {
    const image = document.querySelector('.othon__description');
    const mobileSource = document.querySelector('#othon source[media="(max-width: 640px)"]');
    if (!image) return;

    const useEnglishAsset = language === ENGLISH && DESKTOP_MEDIA.matches;
    image.setAttribute('src', useEnglishAsset ? OTHON_DESCRIPTION_ENGLISH : OTHON_DESCRIPTION_PORTUGUESE);
    if (mobileSource) {
      mobileSource.setAttribute('srcset', language === ENGLISH ? OTHON_DESCRIPTION_MOBILE_ENGLISH : OTHON_DESCRIPTION_MOBILE_PORTUGUESE);
    }
  }

  function syncAfterOthonArt(language = currentLanguage()) {
    const image = document.querySelector('.after-othon-section__art-image');
    const mobileImage = document.querySelector('.after-othon-section__mobile-art');
    if (!image) return;

    const useEnglishAsset = language === ENGLISH && DESKTOP_MEDIA.matches;
    image.setAttribute('src', useEnglishAsset ? AFTER_OTHON_ART_ENGLISH : AFTER_OTHON_ART_PORTUGUESE);
    if (mobileImage) {
      mobileImage.setAttribute('src', language === ENGLISH ? AFTER_OTHON_ART_MOBILE_ENGLISH : AFTER_OTHON_ART_MOBILE_PORTUGUESE);
    }
  }

  function syncFormTitle(language = currentLanguage()) {
    const image = document.querySelector('.section-heading__art');
    if (!image) return;

    image.setAttribute('src', language === ENGLISH ? FORM_TITLE_ENGLISH : FORM_TITLE_PORTUGUESE);
  }

  function syncParadeDayAssets(language = currentLanguage()) {
    const useEnglishAssets = language === ENGLISH;
    Object.entries(PARADE_DAY_ASSETS).forEach(([day, assets]) => {
      const image = document.querySelector(`[data-parade-day="${day}"]`);
      if (image) image.setAttribute('src', useEnglishAssets ? assets.english : assets.portuguese);
    });
  }

  function syncOthonAndParadeDates(language = currentLanguage()) {
    setText('.othon__discover, .othon__discover-svg text', valueFor(language, 'CONHEÇA', 'LEARN MORE'));
    setAttribute('.othon__discover, .othon__discover-svg', 'aria-label', valueFor(language, 'Conheça o Othon (abre em nova aba)', 'Learn more about Othon (opens in a new tab)'));
    setAttribute('.parade-ticketmaster-left', 'src', valueFor(language, 'assets/img/hero/ticketmaster-parade-left.svg?v=20260916-dia5', 'assets/img/hero/ticketmaster-parade-left-en.svg?v=20260916-dia5'));
    setAttribute('.parade-ticketmaster-left', 'alt', valueFor(language, 'Carnaval Sapucaí 2027: 5, 6, 7, 8, 9 e 13 de fevereiro', 'Sapucaí Carnival 2027: February 5, 6, 7, 8, 9 and 13'));
  }

  function syncParadeOrderTitle(language = currentLanguage()) {
    const image = document.querySelector('.parade-order-mark');
    if (!image) return;

    image.setAttribute('src', language === ENGLISH ? PARADE_ORDER_TITLE_ENGLISH : PARADE_ORDER_TITLE_PORTUGUESE);
  }

  function syncWhatsAppLink(language = currentLanguage()) {
    const link = document.querySelector('.site-whatsapp');
    if (!link) return;

    const message = language === ENGLISH ? WHATSAPP_MESSAGE_ENGLISH : WHATSAPP_MESSAGE_PORTUGUESE;
    link.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`);
  }

  function applySharedCopy(language) {
    setAttribute('.top-menu', 'aria-label', valueFor(language, 'Menu principal', 'Main menu'));
    setAttribute('.top-menu__home', 'aria-label', valueFor(language, 'Voltar para o início', 'Back to the beginning'));
    setAttribute('.top-menu__buy, .hero__overlay--prevenda, .video__buy-cta, .post-video-section__cta', 'aria-label', valueFor(language, 'Comprar ingressos para o CAMAROTE MAR 2027', 'Buy tickets for CAMAROTE MAR 2027'));
    setAttribute('.countdown-dock', 'aria-label', valueFor(language, 'Contagem regressiva fixa para o CAMAROTE MAR 2027', 'Fixed countdown to CAMAROTE MAR 2027'));
    setText('[data-countdown-days] + span', valueFor(language, 'Dias', 'Days'));
    setText('[data-countdown-hours] + span', valueFor(language, 'Horas', 'Hours'));
    setText('[data-countdown-minutes] + span', valueFor(language, 'Minutos', 'Minutes'));
    setText('[data-countdown-seconds] + span', valueFor(language, 'Segundos', 'Seconds'));
    setFaqIconLabels(language);
    syncMenuCta(language);
    localizeLocalLinks(language);
  }

  function applyFormLanguage(language) {
    const mode = language === ENGLISH ? 'exterior' : 'brasil';
    const button = document.querySelector(`[data-residence-mode="${mode}"]`);
    if (button && button.getAttribute('aria-pressed') !== 'true') button.click();
    syncFormPolicyLink();
  }

  function syncFormPolicyLink() {
    const link = document.querySelector('[data-consent-v2-policy-link]');
    if (!link) return;

    const exteriorButton = document.querySelector('[data-residence-mode="exterior"]');
    const language = exteriorButton?.getAttribute('aria-pressed') === 'true' ? ENGLISH : PORTUGUESE;
    const locale = document.documentElement.dataset.locale || language;
    const prefix = new URL(document.baseURI).pathname + (locale === PORTUGUESE ? '' : `${locale}/`);
    link.setAttribute('href', `${prefix}politica-de-privacidade.html`);
  }

  function applySiteCopy(language) {
    // Metadata is rendered per locale by the new page.


    setAttribute('[data-desktop-section-nav]', 'aria-label', valueFor(language, 'Navegação entre seções', 'Section navigation'));
    setAttribute('[data-section-nav-up]', 'aria-label', valueFor(language, 'Ir para a seção anterior', 'Go to the previous section'));
    setAttribute('[data-section-nav-down]', 'aria-label', valueFor(language, 'Ir para a próxima seção', 'Go to the next section'));
    setAttribute('[data-scroll-toggle]', 'aria-label', valueFor(language, 'Ir para a próxima seção', 'Go to the next section'));

    const sectionLabels = [
      ['#hero', 'CAMAROTE MAR', 'CAMAROTE MAR'],
      ['#pos-hero', 'CAMAROTE MAR em números', 'CAMAROTE MAR in numbers'],
      ['#verdadeiro', 'O verdadeiro CAMAROTE MAR', 'The true CAMAROTE MAR'],
      ['#video-section', 'Vídeo', 'Video'],
      ['#pos-video', 'Seção após o vídeo', 'Section after the video'],
      ['#social', 'CAMAROTE MAR nas redes sociais', 'CAMAROTE MAR on social media'],
      ['#facilities', 'Estrutura do CAMAROTE MAR', 'CAMAROTE MAR facilities'],
      ['#othon', 'Othon', 'Othon'],
      ['#after-othon', 'CAMAROTE MAR', 'CAMAROTE MAR'],
      ['#nova-secao', 'Instagram', 'Instagram'],
      ['#cadastro', 'Cadastro para a pré-venda do CAMAROTE MAR 2027', 'CAMAROTE MAR 2027 presale registration']
    ];
    sectionLabels.forEach(([selector, portuguese, english]) => {
      setAttribute(selector, 'aria-label', valueFor(language, portuguese, english));
    });

    const imageAlts = [
      ['.hero__dates', '6, 7, 8, 9 e 13 de fevereiro de 2027', 'February 6, 7, 8, 9 and 13, 2027'],
      ['.post-hero-section__numbers', 'CAMAROTE MAR em números', 'CAMAROTE MAR in numbers'],
      ['.post-hero-section__mobile-photo', 'Foliões no desfile', 'Carnival guests at the parade'],
      ['.post-hero-section__foliao', 'Folião no carnaval', 'Carnival guest'],
      ['.verdadeiro-section__logo', 'O verdadeiro CAMAROTE MAR', 'The true CAMAROTE MAR'],
      ['.verdadeiro-section__mobile-art', 'O verdadeiro CAMAROTE MAR', 'The true CAMAROTE MAR'],
      ['.video__poster', 'CAMAROTE MAR', 'CAMAROTE MAR'],
      ['.post-video-section__carnaval-image', 'Carnaval na varanda do CAMAROTE MAR', 'Carnival from the CAMAROTE MAR balcony'],
      ['.post-video-section__varanda-image', 'Varanda do CAMAROTE MAR', 'CAMAROTE MAR balcony'],
      ['.social-section__art', 'CAMAROTE MAR nas redes sociais', 'CAMAROTE MAR on social media'],
      ['.facilities-section__art', 'Estrutura do CAMAROTE MAR', 'CAMAROTE MAR facilities'],
      ['.facilities-section__gallery img', 'Galeria da estrutura do CAMAROTE MAR', 'CAMAROTE MAR facilities gallery'],
      ['.after-othon-section__map', 'Mapa 3D do CAMAROTE MAR', '3D map of CAMAROTE MAR'],
      ['.section-heading__art', 'Cadastre-se para a pré-venda do CAMAROTE MAR 2027', 'Sign up for the CAMAROTE MAR 2027 presale'],
      ['.parade-order-mark', 'Ordem dos desfiles', 'Parade order']
    ];
    imageAlts.forEach(([selector, portuguese, english]) => {
      setAttribute(selector, 'alt', valueFor(language, portuguese, english));
    });
    syncHeroDates(language);
    syncPostHeroNumbers(language);
    syncTrueMarArt(language);
    syncVideoAssets(language);
    syncSocialArt(language);
    syncFacilitiesArt(language);
    syncOthonDescription(language);
    syncAfterOthonArt(language);
    syncFormTitle(language);

    setAttribute('.facilities-section__gallery', 'aria-label', valueFor(language, 'Estrutura do CAMAROTE MAR', 'CAMAROTE MAR facilities'));
    setAttribute('.parade-grid', 'aria-label', valueFor(language, 'Dias de desfile', 'Parade days'));

    const paradeDays = [
      ['sexta', 'Sexta-feira, 05/02', 'Friday, February 5', 'Programação de sexta-feira', 'Friday schedule'],
      ['sabado', 'Sábado, 06/02', 'Saturday, February 6', 'Programação de sábado', 'Saturday schedule'],
      ['domingo', 'Domingo, 07/02', 'Sunday, February 7', 'Programação de domingo', 'Sunday schedule'],
      ['segunda', 'Segunda-feira, 08/02', 'Monday, February 8', 'Programação de segunda-feira', 'Monday schedule'],
      ['terca', 'Terça-feira, 09/02', 'Tuesday, February 9', 'Programação de terça-feira', 'Tuesday schedule']
    ];
    paradeDays.forEach(([day, dayPt, dayEn, detailPt, detailEn]) => {
      setAttribute(`[data-parade-day="${day}"]`, 'alt', valueFor(language, dayPt, dayEn));
      setAttribute(`[data-parade-detail="${day}"]`, 'alt', valueFor(language, detailPt, detailEn));
    });
    syncParadeDayAssets(language);
    syncParadeOrderTitle(language);
    syncOthonAndParadeDates(language);

    setAttribute('.site-whatsapp', 'aria-label', valueFor(language, 'Falar com o CAMAROTE MAR pelo WhatsApp', 'Contact CAMAROTE MAR on WhatsApp'));
    syncWhatsAppLink(language);
    setAttribute('[data-video-close]', 'aria-label', valueFor(language, 'Fechar vídeo', 'Close video'));
    setAttribute('.video-modal__dialog', 'aria-label', valueFor(language, 'Vídeo CAMAROTE MAR', 'CAMAROTE MAR video'));
    setAttribute('[data-video-modal-frame]', 'title', valueFor(language, 'Vídeo CAMAROTE MAR', 'CAMAROTE MAR video'));
    setAttribute('.video__open', 'aria-label', valueFor(language, 'Abrir vídeo', 'Open video'));

    setText('.footer__label', valueFor(language, 'Realização', 'Produced by'));
    setAttribute('.social', 'aria-label', valueFor(language, 'Redes sociais', 'Social media'));
    setAttribute('.social a[href^="mailto:"]', 'aria-label', valueFor(language, 'E-mail', 'Email'));
    setAttribute('.popup-confirmation', 'aria-label', valueFor(language, 'Confirmação de cadastro', 'Registration confirmation'));
    setAttribute('.dialog-close-button', 'aria-label', valueFor(language, 'Fechar', 'Close'));

    applyFormLanguage(language);
    localizeLocalLinks(language);
  }

  function syncFaqTitle(language = currentLanguage()) {
    const image = document.querySelector('.faq__heading--mobile');
    if (!image) return;

    image.setAttribute('src', language === ENGLISH ? FAQ_TITLE_MOBILE_ENGLISH : FAQ_TITLE_MOBILE_PORTUGUESE);
  }

  function applyFaqCopy(language) {
    document.title = 'FAQ | CAMAROTE MAR 2027';
    setAttribute('meta[name="description"]', 'content', valueFor(language, 'Perguntas frequentes sobre o CAMAROTE MAR 2027.', 'Frequently asked questions about CAMAROTE MAR 2027.'));
    setAttribute('.faq__heading', 'alt', valueFor(language, 'Perguntas frequentes', 'Frequently asked questions'));
    setAttribute('.faq__list', 'aria-label', valueFor(language, 'Perguntas frequentes', 'Frequently asked questions'));
    syncFaqTitle(language);

    const items = Array.from(document.querySelectorAll('.faq__list details'));
    const copy = language === ENGLISH ? FAQ_ENGLISH : faqPortuguese;
    items.forEach((item, index) => {
      const translation = copy[index];
      if (!translation) return;
      const summary = item.querySelector('summary');
      const paragraph = item.querySelector('p');
      if (summary) summary.textContent = translation.question;
      if (paragraph) paragraph.textContent = translation.answer;
    });
  }

  function applyFaqPreviewCopy(language) {
    if (!document.querySelector('.faq-preview')) return;
    setAttribute('.faq-preview__heading img', 'alt', valueFor(language, 'Perguntas frequentes', 'Frequently asked questions'));
    setText('.faq-preview__intro', valueFor(language, 'Tudo pronto para viver o CAMAROTE MAR?', 'Ready to experience CAMAROTE MAR?'));
    setText('.faq-preview__link', valueFor(language, 'VER TODAS AS PERGUNTAS', 'VIEW ALL QUESTIONS'));
    faqPreviewPortuguese.forEach((original) => {
      const copy = language === ENGLISH ? FAQ_ENGLISH[original.index] : original;
      if (!copy) return;
      original.item.querySelector('summary').textContent = copy.question;
      original.item.querySelector('p').textContent = copy.answer;
    });
  }

  function applyPolicyCopy(language) {
    document.title = valueFor(language, 'Política de Privacidade | CAMAROTE MAR 2027', 'Privacy Policy | CAMAROTE MAR 2027');
    setText('.privacy__back', valueFor(language, 'Voltar ao cadastro', 'Back to registration'));
    setText('.privacy__updated', valueFor(language, 'Atualizada em 28 de julho de 2026.', 'Updated July 28, 2026.'));

    document.querySelectorAll('[data-language-content]').forEach((section) => {
      section.hidden = section.dataset.languageContent !== language;
    });
  }

  function applyLanguage() {
    const language = currentLanguage();
    document.documentElement.lang = language;
    applySharedCopy(language);

    if (document.getElementById('lead-form')) applySiteCopy(language);
    applyFaqPreviewCopy(language);
    if (document.body.classList.contains('faq-page')) applyFaqCopy(language);
    if (document.body.classList.contains('privacy-page') && !document.body.classList.contains('faq-page')) applyPolicyCopy(language);

    localizeLocalLinks(language);
    emphasizeBrand();
  }

  document.querySelectorAll('[data-residence-mode]').forEach((button) => {
    button.addEventListener('click', restoreFormTextNodes, true);
    button.addEventListener('click', () => {
      syncFormPolicyLink();
      emphasizeBrand();
    });
  });
  const brandForm = document.getElementById('lead-form');
  if (brandForm) {
    brandForm.addEventListener('reset', restoreFormTextNodes, true);
    brandForm.addEventListener('reset', () => window.setTimeout(() => {
      applyFormLanguage(currentLanguage());
      emphasizeBrand();
    }, 0));
  }

  if (typeof DESKTOP_MEDIA.addEventListener === 'function') {
    DESKTOP_MEDIA.addEventListener('change', () => {
      syncMenuCta();
      syncHeroDates();
      syncPostHeroNumbers();
      syncTrueMarArt();
      syncVideoAssets();
      syncSocialArt();
      syncFacilitiesArt();
      syncOthonDescription();
      syncAfterOthonArt();
      syncFormTitle();
    });
  } else {
    DESKTOP_MEDIA.addListener(() => {
      syncMenuCta();
      syncHeroDates();
      syncPostHeroNumbers();
      syncTrueMarArt();
      syncVideoAssets();
      syncSocialArt();
      syncFacilitiesArt();
      syncOthonDescription();
      syncAfterOthonArt();
      syncFormTitle();
    });
  }
  window.addEventListener('camarote:languagechange', applyLanguage);

  applyLanguage();
})();
