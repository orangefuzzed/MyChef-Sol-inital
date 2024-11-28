// public/sw.js

const CACHE_NAME = 'dishcovery-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/dishcovery_icon-192x192.png',
  '/icons/dishcovery_icon-512x512.png',
  // Add other assets and routes here that you want available offline
];

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/dishcovery_icon-192x192.png',
  '/icons/dishcovery_icon-512x512.png',
  // Add any additional static assets here
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Cache-first strategy for static assets and recipes
  if (STATIC_ASSETS.includes(url.pathname) || url.pathname.startsWith('/api/recipes/')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  } else if (url.pathname.startsWith('/api/chat/')) {
    // Network-first strategy for chat messages
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Save the response to cache for offline use
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => caches.match(event.request)) // If offline, try to return from cache
    );
  } else {
    // Network-first strategy for other requests
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
