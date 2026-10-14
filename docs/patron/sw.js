// KayraPOS Patron web: uygulama dosyaları önbellekte tutulur; veriler her zaman internetten gelir.
const C = 'kp-web-1', F = ['./', 'index.html', 'web-bridge.js', 'remote.js', 'remote.css', 'remote4.css', 'app.css', 'kayra.css', 'icon-192.png', 'manifest.json'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(F)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => { const u = new URL(e.request.url); if (u.origin !== location.origin) return; e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request))); });
