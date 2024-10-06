const CACHE_NAME = 'taylor-portfolio-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.min.css',
  '/script.min.js',
  '/taylor-light.webp',
  '/taylor-dark.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
