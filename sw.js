// XAUUSD Lot Calculator - Service Worker
const CACHE_NAME = 'xauusd-calc-v1';
const ASSETS = [
    './index.html',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

// Install: cache all static assets
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(ASSETS.filter(function (url) {
                return !url.startsWith('https://fonts'); // fonts dihandle terpisah
            }));
        })
    );
    self.skipWaiting();
});

// Activate: hapus cache lama
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(
                keys.filter(function (k) { return k !== CACHE_NAME; })
                    .map(function (k) { return caches.delete(k); })
            );
        })
    );
    self.clients.claim();
});

// Fetch: cache-first untuk asset lokal, network-first untuk API
self.addEventListener('fetch', function (e) {
    var url = e.request.url;

    // Selalu network untuk API kurs (biar live)
    if (url.includes('open.er-api.com') || url.includes('frankfurter.app') || url.includes('exchangerate-api.com')) {
        e.respondWith(
            fetch(e.request).catch(function () {
                // Offline: return cached atau nothing
                return new Response(JSON.stringify({ rates: { IDR: 15900 } }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );
        return;
    }

    // Cache-first untuk semua asset lain
    e.respondWith(
        caches.match(e.request).then(function (cached) {
            if (cached) return cached;
            return fetch(e.request).then(function (resp) {
                // Cache response baru untuk asset lokal
                if (resp && resp.status === 200 && e.request.method === 'GET') {
                    var cloned = resp.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(e.request, cloned);
                    });
                }
                return resp;
            });
        })
    );
});
