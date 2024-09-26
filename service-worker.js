const cacheName = "iitb assignment";
const assetsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/logo.png",
];

// Install event - caching app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(assetsToCache);
    }),
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});

// Fetch event - serve cached files if offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }),
  );
});
