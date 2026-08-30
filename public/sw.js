// Minimal service worker: precache the app shell, serve cache-first with a
// network fallback so the installed app opens offline. Bump CACHE_VERSION
// whenever you want clients to drop the old cache.
const CACHE_VERSION = 'meal-planner-v1'
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return

  // Navigations: network-first so deploys show up, fall back to cached shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_VERSION).then((cache) => cache.put('/index.html', copy))
          return response
        })
        .catch(() => caches.match('/index.html')),
    )
    return
  }

  // Everything else: cache-first, then fill the cache in the background.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          const copy = response.clone()
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy))
          return response
        }),
    ),
  )
})
