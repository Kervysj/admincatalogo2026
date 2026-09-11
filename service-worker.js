const CACHE = 'admin-catalogo-v1';
const ASSETS = ['./', './admnindex.html', './manifest.json'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{}))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // No cachear las llamadas a Apps Script ni a GitHub
  if (e.request.url.includes('script.google.com')) return;
  if (e.request.url.includes('api.github.com')) return;
  if (e.request.url.includes('raw.githubusercontent.com')) return;

  e.respondWith(
    caches.match(e.request).then(r =>
      r || fetch(e.request).catch(() => caches.match('./admnindex.html'))
    )
  );
});
