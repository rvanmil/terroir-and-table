/* ============================================================
   TERROIR & TABLE — service worker
   Precaches the entire site (it is fully static) so the app
   works offline once installed. Bump CACHE_VERSION whenever
   any file changes to push an update to installed clients.
   ============================================================ */
const CACHE_VERSION = "tt-v9";

const PRECACHE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/fonts.css",
  "css/style.css",
  "js/app.js",
  "fonts/fraunces-italic.woff2",
  "fonts/fraunces-normal.woff2",
  "fonts/newsreader-italic.woff2",
  "fonts/newsreader-normal.woff2",
  "fonts/splinesansmono-normal.woff2",
  "icons/apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512-maskable.png",
  "icons/icon-512.png",
  "data/wines.js",
  "data/recipes-italy.js",
  "data/recipes-france.js",
  "data/recipes-iberia.js",
  "data/recipes-levant.js",
  "data/recipes-maghreb.js",
  "data/recipes-southasia.js",
  "data/recipes-eastasia.js",
  "data/recipes-seasia.js",
  "data/recipes-latam.js",
  "data/recipes-northern.js",
  "data/recipes-italy2.js",
  "data/recipes-france2.js",
  "data/recipes-iberia2.js",
  "data/recipes-easteurope.js",
  "data/recipes-silkroad.js",
  "data/recipes-eastasia2.js",
  "data/recipes-seasia2.js",
  "data/recipes-southasia2.js",
  "data/recipes-mena2.js",
  "data/recipes-africa.js",
  "data/recipes-americas2.js",
  "data/nl/wines.nl.js",
  "data/nl/recipes-italy.nl.js",
  "data/nl/recipes-france.nl.js",
  "data/nl/recipes-iberia.nl.js",
  "data/nl/recipes-levant.nl.js",
  "data/nl/recipes-maghreb.nl.js",
  "data/nl/recipes-southasia.nl.js",
  "data/nl/recipes-eastasia.nl.js",
  "data/nl/recipes-seasia.nl.js",
  "data/nl/recipes-latam.nl.js",
  "data/nl/recipes-northern.nl.js",
  "data/nl/recipes-italy2.nl.js",
  "data/nl/recipes-france2.nl.js",
  "data/nl/recipes-iberia2.nl.js",
  "data/nl/recipes-easteurope.nl.js",
  "data/nl/recipes-silkroad.nl.js",
  "data/nl/recipes-eastasia2.nl.js",
  "data/nl/recipes-seasia2.nl.js",
  "data/nl/recipes-southasia2.nl.js",
  "data/nl/recipes-mena2.nl.js",
  "data/nl/recipes-africa.nl.js",
  "data/nl/recipes-americas2.nl.js",
  "data/enrich/recipes-italy.enrich.js",
  "data/enrich/recipes-france.enrich.js",
  "data/enrich/recipes-iberia.enrich.js",
  "data/enrich/recipes-levant.enrich.js",
  "data/enrich/recipes-maghreb.enrich.js",
  "data/enrich/recipes-southasia.enrich.js",
  "data/enrich/recipes-eastasia.enrich.js",
  "data/enrich/recipes-seasia.enrich.js",
  "data/enrich/recipes-latam.enrich.js",
  "data/enrich/recipes-northern.enrich.js",
  "data/enrich/recipes-italy2.enrich.js",
  "data/enrich/recipes-france2.enrich.js",
  "data/enrich/recipes-iberia2.enrich.js",
  "data/enrich/recipes-easteurope.enrich.js",
  "data/enrich/recipes-silkroad.enrich.js",
  "data/enrich/recipes-eastasia2.enrich.js",
  "data/enrich/recipes-seasia2.enrich.js",
  "data/enrich/recipes-southasia2.enrich.js",
  "data/enrich/recipes-mena2.enrich.js",
  "data/enrich/recipes-africa.enrich.js",
  "data/enrich/recipes-americas2.enrich.js",
  "data/recipes-bistro.js",
  "data/recipes-trattoria.js",
  "data/recipes-asiantable.js",
  "data/recipes-spicetrail.js",
  "data/recipes-diner.js",
  "data/recipes-eurotable.js",
  "data/nl/recipes-bistro.nl.js",
  "data/nl/recipes-trattoria.nl.js",
  "data/nl/recipes-asiantable.nl.js",
  "data/nl/recipes-spicetrail.nl.js",
  "data/nl/recipes-diner.nl.js",
  "data/nl/recipes-eurotable.nl.js",
  "data/enrich/recipes-bistro.enrich.js",
  "data/enrich/recipes-trattoria.enrich.js",
  "data/enrich/recipes-asiantable.enrich.js",
  "data/enrich/recipes-spicetrail.enrich.js",
  "data/enrich/recipes-diner.enrich.js",
  "data/enrich/recipes-eurotable.enrich.js"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      // bypass the browser HTTP cache so a new version never precaches stale files
      .then(cache => cache.addAll(PRECACHE.map(u => new Request(u, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => {
      if (hit) return hit;
      return fetch(e.request)
        .then(res => {
          // opportunistically cache same-origin responses (e.g. after an update)
          if (res.ok && new URL(e.request.url).origin === location.origin) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then(c => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => {
          // offline navigation fallback: the app shell
          if (e.request.mode === "navigate") return caches.match("index.html");
          throw new Error("offline");
        });
    })
  );
});
