/* ════════════════════════════════════════════
   SERVICE WORKER v3 — Offline-first caching
   ════════════════════════════════════════════ */
const CACHE = 'calix-v3';
const ASSETS = [
  './', './index.html', './manifest.json',
  './css/base.css','./css/nav.css','./css/home.css',
  './css/calendar.css','./css/workout.css','./css/timer.css','./css/extras.css',
  './js/icons.js','./js/data.js','./js/store.js',
  './js/stats.js','./js/nav.js','./js/main.js',
  './pages/home.js','./pages/calendar.js',
  './pages/workout.js','./pages/timer.js',
  './icons/icon-192.png','./icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res && res.status === 200 && res.type !== 'opaque') {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }))
  );
});
