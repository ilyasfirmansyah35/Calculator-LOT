// Trading Suite PWA — Service Worker v2.0
var CACHE_NAME = 'trading-suite-v2';
var STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// Install — cache static assets
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate — remove old caches
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (names) {
            return Promise.all(
                names.filter(function (n) { return n !== CACHE_NAME; })
                    .map(function (n) { return caches.delete(n); })
            );
        })
    );
    self.clients.claim();
});

// Fetch — network-first for exchange rate APIs, cache-first for everything else
self.addEventListener('fetch', function (event) {
    var url = event.request.url;

    // Exchange rate APIs — always try network first
    if (url.includes('open.er-api.com') || url.includes('frankfurter.app') || url.includes('exchangerate-api.com')) {
        event.respondWith(
            fetch(event.request).catch(function () {
                return new Response(JSON.stringify({ rates: { IDR: 15900 } }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );
        return;
    }

    // Google Fonts & CDN — network-first with cache fallback
    if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
        event.respondWith(
            fetch(event.request)
                .then(function (response) {
                    var clone = response.clone();
                    caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, clone); });
                    return response;
                })
                .catch(function () { return caches.match(event.request); })
        );
        return;
    }

    // Static app files — cache-first
    event.respondWith(
        caches.match(event.request).then(function (cached) {
            if (cached) return cached;
            return fetch(event.request).then(function (response) {
                if (response.ok) {
                    var clone = response.clone();
                    caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, clone); });
                }
                return response;
            });
        })
    );
});
