// public/service-worker.js

const CACHE_NAME = 'dishcovery-cache-v9';
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

// Fetch event
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Stale-while-revalidate for /api/recipes
  if (url.pathname.startsWith('/api/recipes/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
  
        // Perform the network request in the background
        const networkFetch = fetch(event.request)
          .then((networkResponse) => {
            // Only store in cache if it's a GET request
            if (event.request.method === 'GET') {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // If network fails, use the cached response
            return cachedResponse;
          });
  
        // If we have a cachedResponse, return it immediately (stale)
        // and let the network request update the cache in the background.
        // Otherwise, await the network request if cache is empty.
        return cachedResponse || networkFetch;
      })
    );
  } else if (STATIC_ASSETS.includes(url.pathname)) {
    // Cache-first for static assets
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
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
        .then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Network-first strategy for other requests
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});

// Activate event
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

