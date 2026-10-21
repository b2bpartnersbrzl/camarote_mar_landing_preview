/* Path-based pages, with compatibility for existing PT/EN form and artwork scripts. */
(() => {
  const aliases={pt:'pt-BR','pt-br':'pt-BR',en:'en','en-us':'en',es:'es','es-es':'es'};
  const locale=document.documentElement.dataset.locale||'pt-BR';
  const requested=aliases[(new URL(location.href).searchParams.get('lang')||'').toLowerCase()];
  const prefix=lang=>new URL(document.baseURI).pathname+(lang==='pt-BR'?'':`${lang}/`);
  const page=location.pathname.split('/').pop();
  if(requested&&requested!==locale){location.replace(prefix(requested)+(['faq.html','politica-de-privacidade.html'].includes(page)?page:'')+location.hash);return;}
  document.documentElement.lang=locale;
  document.documentElement.dataset.language=locale==='pt-BR'?'pt-BR':'en';
  window.CamaroteMarLanguage=Object.freeze({get:()=>locale==='pt-BR'?'pt-BR':'en',set:lang=>location.assign(prefix(aliases[String(lang).toLowerCase()]||'pt-BR')+location.hash),supported:Object.freeze(['pt-BR','en','es'])});
})();
