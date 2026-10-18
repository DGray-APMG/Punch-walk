/* Punch Walk service worker: caches the app so it opens and runs with no signal. */
const VERSION = 'punch-walk-v8';
const ASSETS = [
  './', './index.html', './vendor.html', './help.html', './manifest.webmanifest',
  './vendor/xlsx.full.min.js', './vendor/jspdf.umd.min.js', './vendor/jszip.min.js',
  './fonts/barlow-latin-400-normal.woff2', './fonts/barlow-latin-500-normal.woff2', './fonts/barlow-latin-600-normal.woff2',
  './fonts/barlow-condensed-latin-600-normal.woff2', './fonts/barlow-condensed-latin-700-normal.woff2', './fonts/ibm-plex-mono-latin-500-normal.woff2',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // Team template: always try the network first so updates arrive; fall back to the cached copy.
  if (url.pathname.endsWith('/template.enc.json')) {
    e.respondWith(fetch(req, { cache: 'no-store' }).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put('./template.enc.json', copy)); }
      return res;
    }).catch(() => caches.match('./template.enc.json')));
    return;
  }
  // Page loads: serve the cached app shell.
  if (req.mode === 'navigate') {
    const page = url.pathname.endsWith('/vendor.html') ? './vendor.html' : url.pathname.endsWith('/help.html') ? './help.html' : './index.html';
    e.respondWith(caches.match(page).then(r => r || fetch(req)));
    return;
  }
  // Everything else: cache first.
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(r => r || fetch(req)));
});
