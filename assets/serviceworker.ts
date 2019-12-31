export default null
declare const self: ServiceWorkerGlobalScope

const version = "v1"
const cacheKey = `cache-${version}`

const pageCache = ["/"]
const fileCache = ["/js/vendor.js"]

const handleInstall = async (event: ExtendableEvent): Promise<void> => {
    console.info("[sw] install")

    self.skipWaiting()

    event.waitUntil(
        (async (): Promise<void> => {
            const cache = await caches.open(cacheKey)

            await Promise.all(
                [...pageCache, ...fileCache].map(async url => {
                    return cache.add(url).catch(err => {
                        console.error(`could not fetch ${url}, ${err}`)
                    })
                }),
            )

            console.log("saved caaaache")
        })(),
    )
}

const handleActivate = async (event: ExtendableEvent): Promise<void> => {
    console.info("[sw] activate")

    const cacheKeys = await caches.keys()
    cacheKeys.filter(key => !key.includes(version)).forEach(caches.delete)

    self.clients.claim()
}

const dayPeriod = (hour: number): "morning" | "afternoon" | "evening" => {
    if (hour < 12) return "morning"
    if (hour < 18) return "afternoon"
    return "evening"
}

// Changing the greet by Service Worker allows us to prevent
// the flash of updated content when done via inline JavaScript.
//
// The downside is that the Service Worker can not modify requests before
// install and thus a default greeting value is required.
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

const handleFetch = async (event: FetchEvent): Promise<void> => {
    const { pathname, hostname } = new URL(event.request.url)

    console.log("[sw] fetch", hostname, pathname)

    // Do not fetch resources from other origins
    if (hostname !== self.location.hostname) {
        return event.respondWith(fetch(event.request))
    }

    // Pages
    if (event.request.headers.get("accept")?.includes("text/html")) {
        if (pathname === "/") {
            event.respondWith(renderIndex(caches.match("/")))
        }
    }
}

self.addEventListener("fetch", event => handleFetch(event))
self.addEventListener("install", event => handleInstall(event))
self.addEventListener("activate", event => handleActivate(event))

