(() => {
 'use strict';
 const locale=document.documentElement.dataset.locale||'pt-BR';
 const basePath=new URL(document.baseURI).pathname;
 const prefix=basePath+(locale==='pt-BR'?'':`${locale}/`);
 document.documentElement.lang=locale;
 const menu=document.querySelector('.mar-menu'),toggle=document.querySelector('.mar-menu-toggle');
 const closeMenu=()=>{menu?.classList.remove('is-open');toggle?.setAttribute('aria-expanded','false')};
 toggle?.addEventListener('click',()=>{const open=menu.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open))});
 menu?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();closeVideo()}});
 document.addEventListener('click',e=>{if(!e.target.closest('.mar-header'))closeMenu()});
 // Equilibra a âncora desktop no espaço disponível, sem redimensionar a arte.
 const lineup=document.getElementById('lineup'),header=document.querySelector('.mar-header');
 if(lineup&&header){
  const fitLineupAnchor=()=>{
   const lineupRect=lineup.getBoundingClientRect();
   const headerHeight=header.getBoundingClientRect().height;
   const overflow=(lineupRect.height-(innerHeight-headerHeight))/2;
   const dateRects=Array.from(lineup.querySelectorAll('.lineup-section__art--datas text')).map(text=>text.getBoundingClientRect()).filter(rect=>rect.height>0);
   const maxShift=dateRects.length?Math.max(0,Math.min(...dateRects.map(rect=>rect.top))-lineupRect.top-12):headerHeight;
   const offset=innerWidth>900?-Math.min(Math.max(0,overflow),maxShift):0;
   lineup.style.setProperty('--mar-lineup-anchor-offset',`${offset}px`);
  };
  const anchorObserver=new ResizeObserver(fitLineupAnchor);anchorObserver.observe(lineup);anchorObserver.observe(header);
  window.addEventListener('resize',fitLineupAnchor);window.addEventListener('camarote:textartready',fitLineupAnchor);
  document.fonts?.ready.then(fitLineupAnchor);fitLineupAnchor();
 }
 // Old anchors still reach the corresponding new content.
 const aliases={othon:'hotel-oficial',facilities:'meeting-point','pos-hero':'conheca-o-mar',verdadeiro:'conheca-o-mar','video-section':'conheca-o-mar'};
 const alias=aliases[location.hash.slice(1)];if(alias){history.replaceState({},'',location.pathname+'#'+alias);requestAnimationFrame(()=>document.getElementById(alias)?.scrollIntoView())}
 document.querySelectorAll('a[href]').forEach(a=>{
   const url=new URL(a.href);
   if(url.hostname==='www.ticketmaster.com.br'){
     url.pathname='/event/camarote-mar-venda-geral-2027';url.search='';
     const section=a.closest('section')?.id||'menu';
     const source=a.getAttribute('href').match(/utm_content=([^&]+)/)?.[1]||({hero:'home',lineup:'lineup',cadastro:'cadastro'})[section]||section;
     Object.entries({utm_source:'site',utm_medium:'botao',utm_campaign:'mar2027',utm_content:source}).forEach(([k,v])=>url.searchParams.set(k,v));a.href=url.href;
   }
   if(url.origin===location.origin&&!a.classList.contains('mar-language')){
     if(url.pathname.endsWith('/site.html'))a.href=prefix+url.hash;
     else if(/\/(faq|politica-de-privacidade)\.html$/.test(url.pathname)&&!a.closest('#lead-form'))a.href=prefix+url.pathname.split('/').pop()+url.hash;
   }
 });
 const synchronizeFlags=()=>document.querySelectorAll('.mar-language').forEach(a=>{const page=location.pathname.match(/(?:faq|politica-de-privacidade)\.html$/)?.[0]||'';const url=new URL(basePath+(a.lang==='pt-BR'?'':`${a.lang}/`)+page,location.origin);url.hash=location.hash;a.href=url.href});
 synchronizeFlags();window.addEventListener('hashchange',synchronizeFlags);
 if(locale==='en')document.fonts.ready.then(()=>document.querySelectorAll('#lineup svg text[aria-label="LINEUP COMPLETO"]').forEach(text=>{
  const first=text.querySelector('tspan');if(!first)return;const box=text.getBBox();const span=first.cloneNode(false);span.setAttribute('x',(first.getAttribute('x')||'0').split(/[ ,]+/)[0]);span.setAttribute('y',(first.getAttribute('y')||'0').split(/[ ,]+/)[0]);span.textContent='FULL LINEUP';text.replaceChildren(span);text.setAttribute('aria-label','FULL LINEUP');if(box.width>0){text.setAttribute('textLength',String(box.width));text.setAttribute('lengthAdjust','spacingAndGlyphs')}
 }));
 const hero=document.querySelector('.mar-hero-video');
 const mobile=matchMedia('(max-width:640px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const loadHero=()=>{if(!hero)return;hero.poster=`assets/cliente-20261019/capa-aftermovie${mobile.matches?'-mobile':''}.jpg`;hero.src='assets/cliente-20261019/hero-20261021.mp4';hero.muted=true;hero.play().catch(()=>{})};
 loadHero();mobile.addEventListener('change',loadHero);
 if(hero)new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)hero.pause();else hero.play().catch(()=>{})},{threshold:.1}).observe(hero);
 const dialog=document.querySelector('.mar-video-dialog'),drone=dialog?.querySelector('video');let videoTrigger;
 function closeVideo(){if(!dialog?.open)return;drone.pause();dialog.close();videoTrigger?.focus()}
 document.querySelector('.mar-drone')?.addEventListener('click',e=>{videoTrigger=e.currentTarget;dialog.showModal();if(!drone.getAttribute('src'))drone.src='assets/cliente-20261019/drone-tour.mp4';drone.play().catch(()=>{})});
 dialog?.querySelector('.mar-dialog-close')?.addEventListener('click',closeVideo);
 dialog?.addEventListener('click',e=>{if(e.target===dialog)closeVideo()});dialog?.addEventListener('close',()=>drone.pause());
 // All viewports share the same visible-section navigation; capture prevents legacy double scroll.
 const nav=document.querySelector('[data-desktop-section-nav]'),up=nav?.querySelector('[data-section-nav-up]'),down=nav?.querySelector('[data-section-nav-down]');
 const sectionList=()=>Array.from(document.querySelectorAll('main>section,footer.footer')).filter(s=>!s.hidden&&s.offsetHeight>0&&getComputedStyle(s).display!=='none');
 function sectionIndex(list){if(innerHeight+scrollY>=document.documentElement.scrollHeight-2)return list.length-1;const y=innerHeight*.45;const i=list.findIndex(s=>{const r=s.getBoundingClientRect();return r.top<=y&&r.bottom>y});return i<0?0:i}
 const sectionScrollTop=section=>Math.max(0,Math.min(document.documentElement.scrollHeight-innerHeight,section.getBoundingClientRect().top+scrollY-(parseFloat(getComputedStyle(section).scrollMarginTop)||0)-(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0)));
 function navSync(){if(!nav)return;const list=sectionList(),index=sectionIndex(list);up.disabled=index===0;down.disabled=index===list.length-1}
 [[up,-1],[down,1]].forEach(([button,delta])=>button?.addEventListener('click',e=>{e.stopImmediatePropagation();const list=sectionList();let index=sectionIndex(list)+delta;while(list[index]&&Math.abs(sectionScrollTop(list[index])-scrollY)<2)index+=delta;const next=list[index];if(next)next.scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'})},true));
 window.addEventListener('scroll',navSync,{passive:true});window.addEventListener('resize',()=>{navSync();if(innerWidth>900)closeMenu()});navSync();
 // Reaplica o estado mobile depois que a regra de navegação legada muda de faixa.
 matchMedia('(min-width:821px)').addEventListener('change',navSync);
 if(locale==='es'){
  const script=document.createElement('script');script.src='spanish-preview.js?v=20261019-1';document.body.append(script);
 }


 // Ajustes finais do cliente, edição local de 26/10/2026.
 const sectionVideos=Array.from(document.querySelectorAll('video.mar-autoplay-video[data-mar-video]'));
 const startSectionVideo=video=>{
  if(!video.src){video.src=video.dataset.marVideo;video.load()}
  video.muted=true;video.loop=true;video.playsInline=true;
  video.play().catch(()=>{});
 };
 if('IntersectionObserver' in window){
  const sectionVideoObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
   const video=entry.target;
   if(entry.isIntersecting)startSectionVideo(video);else video.pause();
  }),{threshold:.06,rootMargin:'100px 0px'});
  sectionVideos.forEach(video=>sectionVideoObserver.observe(video));
 }else sectionVideos.forEach(startSectionVideo);

 const revealTargets=Array.from(document.querySelectorAll('[data-mar-reveal]'));
 document.documentElement.classList.add('mar-animations-ready');
 if('IntersectionObserver' in window){
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);
  }),{threshold:.16,rootMargin:'0px 0px -7% 0px'});
  revealTargets.forEach(target=>revealObserver.observe(target));
 }else revealTargets.forEach(target=>target.classList.add('is-visible'));

 const locationSection=document.querySelector('.after-othon-section');
 if(locationSection){
  const markLocationHeadline=()=>locationSection.querySelectorAll('text[aria-label]').forEach(node=>{
   if(/AVENIDA DESFILA|PARADE COMES/i.test(node.getAttribute('aria-label')||''))node.classList.add('mar-location-headline');
  });
  markLocationHeadline();
  const locationTextObserver=new MutationObserver(markLocationHeadline);
  locationTextObserver.observe(locationSection,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-label']});
 }
})();
