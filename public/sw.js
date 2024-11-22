// public/sw.js

const CACHE_NAME = 'mychef-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/icons/apple.png',
  '/icons/chefshat.png',
  '/icons/avocado.png',
  // Add other essential assets here
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
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
