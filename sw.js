const CACHE_NAME = 'calix-v1';
const ASSETS = [
  './',
  './index.html',
  './css/base.css',
  './css/nav.css',
  './css/home.css',
  './css/calendar.css',
  './css/workout.css',
  './css/timer.css',
  './js/icons.js',
  './js/data.js',
  './js/store.js',
  './js/stats.js',
  './js/nav.js',
  './js/main.js',
  './pages/home.js',
  './pages/calendar.js',
  './pages/workout.js',
  './pages/timer.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
