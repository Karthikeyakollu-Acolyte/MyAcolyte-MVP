// sw.js (in the public directory)

// Skip waiting to activate the new service worker immediately
self.skipWaiting();

// Install event: Cache the essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/icons/icon-192x192.png',
        '/icons/icon-512x512.png',
        '/favicon.ico',
        'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',  // Example external resource
        'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxP.ttf',  // Example external font
      ]);
    })
  );
});

// Activate event: Cleanup old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = ['my-cache'];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: Serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;  // Return cached version if available
      }
      return fetch(event.request);  // Otherwise, fetch the resource from the network
    })
  );
});
