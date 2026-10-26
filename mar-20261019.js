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
 // A mudança de largura atualiza apenas a capa, sem reiniciar o vídeo.
 const updateHeroPoster=()=>{if(hero)hero.poster=`assets/cliente-20261019/capa-aftermovie${mobile.matches?'-mobile':''}.jpg`};
 updateHeroPoster();mobile.addEventListener('change',updateHeroPoster);
 const dialog=document.querySelector('.mar-video-dialog'),drone=dialog?.querySelector('video');let videoTrigger;
 function closeVideo(){if(!dialog?.open)return;drone.pause();dialog.close();videoTrigger?.focus()}
 document.querySelector('.mar-drone')?.addEventListener('click',e=>{videoTrigger=e.currentTarget;dialog.showModal();syncVideoPlayback();if(!drone.getAttribute('src'))drone.src='assets/cliente-20261019/drone-tour.mp4';drone.play().catch(()=>{})});
 dialog?.querySelector('.mar-dialog-close')?.addEventListener('click',closeVideo);
 dialog?.addEventListener('click',e=>{if(e.target===dialog)closeVideo()});dialog?.addEventListener('close',()=>{drone.pause();syncVideoPlayback()});
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


 // No mobile, a mídia fica entre a apresentação e o texto complementar.
 // Reutiliza os mesmos elementos e restaura sua posição original no desktop.
 const mobileMediaPlacements=[
  ['#conheca-o-mar .mar-drone','#conheca-o-mar .mar-intro'],
  ['#hotel-oficial .mar-hotel-photo','#mar-hotel-title'],
  ['#meeting-point .mar-meeting-photo','#mar-meeting-title + p'],
  ['#after-othon .after-othon-section__map','#after-othon .mar-map-mobile-copy h2']
 ].map(([mediaSelector,anchorSelector])=>{
  const media=document.querySelector(mediaSelector),after=document.querySelector(anchorSelector);
  if(!media||!after)return null;
  const originalPosition=document.createComment('Posição da mídia no desktop');
  media.before(originalPosition);
  return {media,after,originalPosition};
 }).filter(Boolean);
 const syncMobileMediaOrder=()=>mobileMediaPlacements.forEach(({media,after,originalPosition})=>{
  const anchor=mobile.matches?after:originalPosition;
  if(anchor.nextSibling!==media)anchor.after(media);
 });
 syncMobileMediaOrder();mobile.addEventListener('change',syncMobileMediaOrder);

 // Ajustes finais do cliente, edição local de 26/10/2026.
 const sectionVideos=Array.from(document.querySelectorAll('video.mar-autoplay-video[data-mar-video]'));
 const autoplayVideos=[hero,...sectionVideos].filter(Boolean);
 let activeVideo=null,videoFrame=0;
 const loadVideo=video=>{
  if(video.getAttribute('src'))return;
  video.src=video===hero?'assets/cliente-20261019/hero-20261021.mp4':video.dataset.marVideo;
  video.load();
 };
 // Reproduz somente o vídeo com maior área visível abaixo da barra fixa.
 // A fonte e o ponto de reprodução são preservados ao sair e voltar à seção.
 function syncVideoPlayback(){
  videoFrame=0;
  const top=header?.getBoundingClientRect().bottom||0;
  let selected=null,largestArea=0;
  if(!document.hidden&&!dialog?.open)autoplayVideos.forEach(video=>{
   const r=video.getBoundingClientRect();
   const visibleHeight=Math.max(0,Math.min(r.bottom,innerHeight)-Math.max(r.top,top));
   const visibleWidth=Math.max(0,Math.min(r.right,innerWidth)-Math.max(r.left,0));
   const area=visibleHeight*visibleWidth;
   if(visibleHeight>=Math.min(60,r.height*.15)&&area>largestArea){selected=video;largestArea=area}
  });
  activeVideo=selected;
  autoplayVideos.forEach(video=>{
   if(video!==selected){video.pause();video.preload='metadata';return}
   video.preload='auto';loadVideo(video);
   if(video.paused)video.play().then(()=>{if(activeVideo!==video)video.pause()}).catch(()=>{});
  });
 }
 const scheduleVideoPlayback=()=>{if(!videoFrame)videoFrame=requestAnimationFrame(syncVideoPlayback)};
 autoplayVideos.forEach(video=>{
  video.autoplay=false;video.muted=true;video.loop=true;video.playsInline=true;video.preload='metadata';
  video.addEventListener('loadedmetadata',scheduleVideoPlayback);
 });
 if('IntersectionObserver' in window){
  const videoPreloadObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   loadVideo(entry.target);videoPreloadObserver.unobserve(entry.target);
  }),{rootMargin:'250px 0px'});
  autoplayVideos.forEach(video=>videoPreloadObserver.observe(video));
 }
 window.addEventListener('scroll',scheduleVideoPlayback,{passive:true});
 window.addEventListener('resize',scheduleVideoPlayback);
 window.addEventListener('pageshow',scheduleVideoPlayback);
 document.addEventListener('visibilitychange',syncVideoPlayback);
 document.fonts?.ready.then(scheduleVideoPlayback);
 syncVideoPlayback();

 // Entrada lateral vinculada à rolagem, como a referência do cliente.
 // Hotel entra pela direita (+50%); os demais textos, pela esquerda (-50%).
 const textMotionGroups=Array.from(document.querySelectorAll('[data-mar-reveal]:not([data-mar-reveal="fade"])')).map(copy=>{
  const targets=Array.from(copy.children).filter(child=>!child.matches('video,.mar-drone'));
  targets.forEach(target=>target.setAttribute('data-mar-slide',''));
  return {section:copy.closest('section'),widthElement:copy,styleElement:copy};
 });
 const locationArts=Array.from(document.querySelectorAll('#after-othon .after-othon-section__art,#after-othon .after-othon-section__mobile-art'));
 locationArts.forEach(art=>art.setAttribute('data-mar-slide',''));
 if(locationArts.length){
  const section=locationArts[0].closest('section');
  // Guarda o deslocamento na seção para preservar a sincronização das artes de idioma.
  textMotionGroups.push({section,widthElements:locationArts,styleElement:section,property:'--mar-location-text-x'});
 }
 const motionStates=textMotionGroups.map(group=>({...group,current:0,from:0,goal:0,started:0,width:0}));
 let motionFrame=0;
 const clampProgress=value=>Math.max(0,Math.min(1,value));
 const paintMotion=state=>{
  // Curva de saída suave; o ponto final é exatamente a composição existente.
  const remaining=(1-state.current)**2;
  const direction=state.section.id==='hotel-oficial'?1:-1;
  state.styleElement.style.setProperty(state.property||'--mar-text-x',`${(direction*.5*state.width*remaining).toFixed(3)}px`);
 };
 const animateTextMotion=now=>{
  motionFrame=0;let pending=false;
  motionStates.forEach(state=>{
   const elapsed=clampProgress((now-state.started)/2000);
   state.current=reduced.matches?1:state.from+(state.goal-state.from)*(1-(1-elapsed)**3);
   if(elapsed===1)state.current=state.goal;
   paintMotion(state);
   if(Math.abs(state.current-state.goal)>.00001)pending=true;
  });
  if(pending)motionFrame=requestAnimationFrame(animateTextMotion);
 };
 const syncTextMotion=(immediate=false)=>{
  const now=performance.now();
  motionStates.forEach(state=>{
   const rect=state.section.getBoundingClientRect();
   const goal=reduced.matches?1:clampProgress((innerHeight-rect.top)/Math.max(1,rect.height*.5));
   state.width=state.widthElements?Math.max(...state.widthElements.map(element=>element.getBoundingClientRect().width)):state.widthElement.getBoundingClientRect().width;
   if(immediate){state.current=goal;state.from=goal;state.goal=goal;paintMotion(state)}
   else if(Math.abs(goal-state.goal)>.00001){state.from=state.current;state.goal=goal;state.started=now}
  });
  if(!immediate&&!motionFrame)motionFrame=requestAnimationFrame(animateTextMotion);
 };
 syncTextMotion(true);
 document.documentElement.classList.add('mar-animations-ready','mar-scroll-reveal');
 window.addEventListener('scroll',()=>syncTextMotion(),{passive:true});
 window.addEventListener('resize',()=>syncTextMotion(true));
 reduced.addEventListener('change',()=>syncTextMotion(true));
 document.fonts?.ready.then(()=>syncTextMotion(true));
 if('ResizeObserver' in window){
  const motionResizeObserver=new ResizeObserver(()=>syncTextMotion(true));
  new Set(motionStates.map(state=>state.section)).forEach(section=>motionResizeObserver.observe(section));
 }
 // A logo Othon mantém o fade-in separado solicitado no mesmo documento.
 const fadeTargets=Array.from(document.querySelectorAll('[data-mar-reveal="fade"]'));
 if('IntersectionObserver' in window){
  const fadeObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   entry.target.classList.add('is-visible');fadeObserver.unobserve(entry.target);
  }),{threshold:.16,rootMargin:'0px 0px -7% 0px'});
  fadeTargets.forEach(target=>fadeObserver.observe(target));
 }else fadeTargets.forEach(target=>target.classList.add('is-visible'));


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
