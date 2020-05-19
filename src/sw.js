/* global caches, self, workbox */
// this value will be replaced at build time
const version = 'VERSION'
const debug = Boolean(Number('SW_DEBUG'))

workbox.setConfig({ debug })
workbox.skipWaiting()
workbox.clientsClaim()

// for precache we dont want to set versioning since every new version will start with empty cache
// workbox already has a mechanism to update resources in precache based on their revision
// this way only the resources that changed since last build will be replaced in cache
workbox.core.setCacheNameDetails({ prefix: 'nb-pwa', precache: 'precache', runtime: `runtime-${version}` })

workbox.precaching.precacheAndRoute(self.__precacheManifest || [])

// cleanup old caches except precache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheKeys => {
      const oldKeys = cacheKeys.filter(key => key.indexOf('nb-pwa-precache') === -1 && key.indexOf(version) === -1)
      const deletePromises = oldKeys.map(oldKey => caches.delete(oldKey))
      return Promise.all(deletePromises)
    })
  )
})
