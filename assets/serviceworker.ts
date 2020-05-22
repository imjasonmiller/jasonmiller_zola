// Allow use of `self`, see: https://github.com/microsoft/TypeScript/issues/14877
export default null
declare const self: ServiceWorkerGlobalScope

const version = "v1"
const cacheKey = `cache-${version}`

const handleInstall = async (event: ExtendableEvent): Promise<void> => {
    console.info("[sw] install")

    self.skipWaiting()

    event.waitUntil(
        (async (): Promise<void> => {
            const cache = await caches.open(cacheKey)

            // Retrieve generated cache by assets/templates/cache.json
            const {
                data: { pages, files },
            } = await fetch("/cache.json").then(response => response.json())

            await Promise.all(
                [...pages, ...files].map(async url => {
                    return cache.add(url).catch(err => {
                        console.error(`could not fetch ${url}, ${err}`)
                    })
                }),
            )

            console.info("[sw] saved pages and files to cache")
        })(),
    )
}

const handleActivate = async (event: ExtendableEvent): Promise<void> => {
    console.info("[sw] activate")

    await fetch("/cache.json")
        .then(res => res.json())
        .then(res => console.info("[sw] cache:", JSON.stringify(res, null, 2)))
        .catch(err => console.error(err))

    const cacheKeys = await caches.keys()
    cacheKeys.filter(key => !key.includes(version)).forEach(caches.delete)

    self.clients.claim()
}

const dayPeriod = (hour: number): string => {
    if (hour < 12) return "morning"
    if (hour < 18) return "afternoon"

    return "evening"
}

// Changing the greet by Service Worker allows us to prevent
// the flash of changed content when using inline JavaScript.
//
// The downside is that the Service Worker can not modify requests
// before install and thus a default initial value is required.
const renderIndex = async (
    match: Promise<Response | undefined>,
    // path: string,
): Promise<Response> => {
    const res = await match
    // const res = await caches.match(path)

    if (!res) return new Response(undefined)
    // if (!res) return fetch(path)

    const body = await res.text()
    const init = {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
    }

    return new Response(
        body.replace(
            /<span class="intro__greeting">Good day/,
            `<span class="intro__greeting">Good ${dayPeriod(
                new Date().getHours(),
            )}`,
        ),
        init,
    )
}

const getCache = (req: Request): Promise<Response> => {
    return new Promise((resolve, reject) => {
        caches
            .match(req)
            .then(res => {
                if (res) {
                    resolve(res)
                } else {
                    fetch(req).then(resolve, reject)
                }
            })
            .catch(reject)
    })
}

const handleFetch = async (event: FetchEvent): Promise<void> => {
    const { pathname, hostname } = new URL(event.request.url)

    console.info("[sw] fetch", hostname, pathname)

    // Do not fetch resources from other origins
    if (hostname !== self.location.hostname) {
        return event.respondWith(fetch(event.request))
    }

    // Pages
    if (event.request.headers.get("accept")?.includes("text/html")) {
        if (pathname === "/") {
            return event.respondWith(renderIndex(caches.match("/")))
        }
    }

    event.respondWith(getCache(event.request))
}

self.addEventListener("fetch", event => handleFetch(event))
self.addEventListener("install", event => handleInstall(event))
self.addEventListener("activate", event => handleActivate(event))

