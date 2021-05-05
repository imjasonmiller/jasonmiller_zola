// Allow use of `self`, see: https://github.com/microsoft/TypeScript/issues/14877
/// <reference lib="webworker" />
// @ts-ignore
const sw: ServiceWorkerGlobalScope = self;

import {
  ARTICLE_SAVE,
  ARTICLE_SAVE_SUCCESS,
  ARTICLE_SAVE_FAILED,
} from "./Actions";

const version = "v1";
const cacheKey = `cache-${version}`;

async function handleInstall(event: ExtendableEvent): Promise<void> {
  console.info("[SW] Install");

  sw.skipWaiting();

  event.waitUntil(
    (async (): Promise<void> => {
      const cache = await caches.open(cacheKey);

      // Fetch list of default files to be cached at install
      const {
        data: { pages, files },
      } = await fetch("/serviceworker-cache.json").then((response) =>
        response.json()
      );

      // Attempt to cache files
      await Promise.all(
        [...pages, ...files].map(async (url) => {
          return cache.add(url).catch((err) => {
            console.error(`[SW] could not fetch ${url}, ${err}`);
          });
        })
      );
    })()
  );
}

async function handleActivate(_: ExtendableEvent): Promise<void> {
  const cacheKeys = await caches.keys();
  cacheKeys.filter((key) => !key.includes(version)).forEach(caches.delete);

  sw.clients.claim();
}

// Changing the greeting via a service worker allows us to prevent the flash of
// changed content when using inline JavaScript.
//
// One catch is that the service worker can not modify requests before install
// and thus a default initial value is required.
async function renderIndex(request: Request): Promise<Response> {
  // Search cache for page
  const response = await caches.match(request);

  // Return early if there was no cache hit by attempting to fetch the page.
  if (!response) return fetch(request);

  const body = await response.text();
  const init = {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  };

  // Generate an appropriate greeting based on the current time.
  const greeting = (hour: number): string => {
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";

    return "evening";
  };

  // Modify response body to display the appropriate greeting.
  return new Response(
    body.replace(
      /<span class="intro__greeting h3">Good day/,
      `<span class="intro__greeting h3">Good ${greeting(new Date().getHours())}`
    ),
    init
  );
}

async function renderArticle(request: Request): Promise<Response> {
  // Search cache for page
  const response = await caches.match(request);

  // Return early if there was no cache hit by attempting to fetch the page.
  if (!response) return fetch(request);

  const body = await response.text();
  const options = {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  };

  // Modify response body to display the appropriate button if the page was
  // already cached
  let bodyResponse = body
    .replace(`"btn btn--save-article"`, `"btn btn--save-article" disabled`)
    .replace(
      "Save article to read offline",
      "Article saved for offline reading"
    );

  return new Response(bodyResponse, options);
}

function getCache(req: Request): Promise<Response> {
  return new Promise((resolve, reject) => {
    caches
      .match(req)
      .then((res) => {
        if (res) {
          return resolve(res);
        } else {
          return fetch(req).then(resolve, reject);
        }
      })
      .catch(reject);
  });
}

async function handleFetch(event: FetchEvent): Promise<void> {
  const { pathname, hostname } = new URL(event.request.url);

  // Do not fetch resources from other origins
  if (hostname !== self.location.hostname) {
    return event.respondWith(fetch(event.request));
  }

  // Pages
  if (event.request.headers.get("accept")?.includes("text/html")) {
    // Index page
    if (pathname === "/") {
      return event.respondWith(renderIndex(event.request));
      // Articles under /journal/
    } else if (/\/journal\/[a-zA-Z0-9\-]+/.test(pathname)) {
      return event.respondWith(renderArticle(event.request));
    }
  }

  // Default for other same-origin resources
  event.respondWith(getCache(event.request));
}

function handleMessage(event: ExtendableMessageEvent) {
  switch (event.data.command) {
    case ARTICLE_SAVE:
      caches
        .open(cacheKey)
        // Add page to cache
        .then((cache) => cache.add(event.data.path))
        .then(() => event.ports[0].postMessage(ARTICLE_SAVE_SUCCESS))
        // Unnecessary catch (?) as it seems the `caches.open` and
        // `cache.add` methods are infallible.
        .catch(() => event.ports[0].postMessage(ARTICLE_SAVE_FAILED));
      break;
    default:
      console.error(`[SW] Invalid message: ${event.data.command}`);
  }
}

sw.addEventListener("install", (event) => handleInstall(event));
sw.addEventListener("fetch", (event) => handleFetch(event));
sw.addEventListener("message", (event) => handleMessage(event));
sw.addEventListener("activate", (event) => handleActivate(event));
