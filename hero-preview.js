/* Prévia do hero: mantém o vídeo original e espera uma reserva antes de reproduzir. */
(() => {
 'use strict';
 const video = document.querySelector('.mar-hero-video');
 const cover = document.querySelector('.mar-hero-poster-preview');
 if (!video) return;
 if (cover) cover.hidden = false;
 const original = 'assets/cliente-20261019/hero-20261021.mp4';
 const stream = 'assets/cliente-20261027/hero-buffer.mp4';
 const codec = 'video/mp4; codecs="avc1.64001f"';
 let mode = 'idle', mediaSource, objectUrl, controller, openTimer, finished = false;
 const notify = () => video.dispatchEvent(new Event('mar-hero-progress'));
 video.addEventListener('playing', () => { if (cover) cover.hidden = true; });

 function fallback() {
  if (mode === 'native') return;
  mode = 'native';
  clearTimeout(openTimer);
  controller?.abort();
  video.pause();
  video.src = original;
  video.load();
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  notify();
 }

 function start() {
  if (mode !== 'idle') return;
  const Source = window.ManagedMediaSource || window.MediaSource;
  if (!Source || !Source.isTypeSupported || !Source.isTypeSupported(codec) || !window.fetch || !window.AbortController) {
   fallback();
   return;
  }
  try {
   mode = 'buffer';
   video.autoplay = false;
   if (window.ManagedMediaSource && Source === window.ManagedMediaSource) video.disableRemotePlayback = true;
   mediaSource = new Source();
   objectUrl = URL.createObjectURL(mediaSource);
   controller = new AbortController();
   video.src = objectUrl;
   openTimer = setTimeout(() => { if (mode === 'buffer' && mediaSource.readyState !== 'open') fallback(); }, 8000);
   mediaSource.addEventListener('sourceopen', async () => {
    if (mode !== 'buffer') return;
    clearTimeout(openTimer);
    try {
     const sourceBuffer = mediaSource.addSourceBuffer(codec);
     const queue = [];
     let streamEnded = false;
     const pump = () => {
      if (mode !== 'buffer' || sourceBuffer.updating || mediaSource.readyState !== 'open') return;
      try {
       if (queue.length) sourceBuffer.appendBuffer(queue.shift());
       else if (streamEnded) { finished = true; mediaSource.endOfStream(); notify(); }
      } catch { fallback(); }
     };
     sourceBuffer.addEventListener('updateend', () => { notify(); pump(); });
     sourceBuffer.addEventListener('error', fallback);
     const response = await fetch(new URL(stream, document.baseURI), {priority:'high', signal:controller.signal});
     if (!response.ok || !response.body?.getReader) throw new Error('Vídeo indisponível');
     const reader = response.body.getReader();
     while (mode === 'buffer') {
      const chunk = await reader.read();
      if (chunk.done) break;
      queue.push(chunk.value);
      pump();
     }
     if (mode === 'buffer') { streamEnded = true; pump(); }
    } catch { fallback(); }
   }, {once:true});
  } catch { fallback(); }
 }

 function canPlay() {
  if (mode !== 'buffer') return true;
  const time = video.currentTime;
  let ahead = 0;
  for (let i=0; i<video.buffered.length; i++) {
   if (video.buffered.start(i) <= time + .12 && video.buffered.end(i) > time) {
    ahead = video.buffered.end(i) - time;
    break;
   }
  }
  const remaining = Number.isFinite(video.duration) ? Math.max(0, video.duration - time) : Infinity;
  if (finished && ahead === 0 && remaining > .15) { fallback(); return true; }
  return ahead + .12 >= Math.min(2.5, remaining);
 }

 video.addEventListener('error', () => { if (mode === 'buffer') fallback(); });
 window.MarHeroPreview = {start, canPlay, isBuffering:() => mode === 'buffer'};
 if (!location.hash || location.hash === '#hero') start();
})();
