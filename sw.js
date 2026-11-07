const CACHE = 'training-diary-pwa-v1';
const FILES = [
  '/training-diary/',
  '/training-diary/index.html',
  '/training-diary/manifest.webmanifest',
  '/training-diary/icons/icon-192.png',
  '/training-diary/icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(cache => cache.put(e.request, copy));
      return res;
    }).catch(() => caches.match('/training-diary/index.html')))
  );
});
