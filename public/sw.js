const CACHE_NAME = 'morpheai-v3'
const urlsToCache = [
  '/',
  '/portal',
  '/journal',
  '/meditate',
  '/knowledge',
  '/chat',
  '/manifest.json'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  event.waitUntil(
    // Delete all old caches first
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting old cache:', cacheName)
          return caches.delete(cacheName)
        })
      )
    }).then(() => {
      // Create new cache
      return caches.open(CACHE_NAME)
    }).then((cache) => {
      console.log('Opened new cache:', CACHE_NAME)
      return cache.addAll(urlsToCache)
    })
  )
  // Force activation of new service worker immediately
  self.skipWaiting()
})

// Fetch event - always fetch from network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip caching for API routes and external resources
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('supabase.co') ||
      event.request.url.includes('openai.com')) {
    return fetch(event.request)
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        // Clone the response
        const responseToCache = response.clone()

        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache)
          })

        return response
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete all old caches
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      // Force claim all clients to use new service worker
      return self.clients.claim()
    })
  )
})

