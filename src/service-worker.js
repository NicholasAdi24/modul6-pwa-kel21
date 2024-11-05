/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  ({ request, url }) => {
    if (request.mode !== 'navigate') {
      return false;
    }

    if (url.pathname.startsWith('/_')) {
      return false;
    }

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// Handle caching for search results
registerRoute(
  "https://imdb8.p.rapidapi.com/auto-complete",
  new StaleWhileRevalidate({
    cacheName: "search-results",
    plugins: [
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  // Custom logic to serve search results from cache when offline
  if (event.request.url === "https://imdb8.p.rapidapi.com/auto-complete") {
    event.respondWith(
      caches.open("search-results").then((cache) => {
        return cache.match(event.request).then((response) => {
          return response || fetch(event.request);
        });
      })
    );
  }
});
