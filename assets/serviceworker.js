const cacheName = "v1"

// self.addEventListener("install", evt => {})

self.addEventListener("activate", evt => {
    // Remove unwanted caches
    evt.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        return caches.delete(cache)
                    }
                }),
            ),
        ),
    )
})

// const isCacheable = req => req.method === "GET" && /https?/.test(req.url)
// Disable caching for now
const isCacheable = req => false

self.addEventListener("fetch", evt => {
    evt.respondWith(
        fetch(evt.request)
            .then(res => {
                if (isCacheable(evt.request)) {
                    const clone = res.clone()

                    // Open and add to cache
                    caches.open(cacheName).then(cache => {
                        cache.put(evt.request, clone)
                    })
                }

                return res
            })
            .catch(err => caches.match(evt.request).then(res => res)),
    )
})
