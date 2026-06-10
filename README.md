# Terroir & Table — A Cook's Atlas of the World

An interactive cooking book in the form of a website: **407 authentic recipes from 74 food
cultures** — from street-food cheap to Michelin-level showpieces, including the full
restaurant canon (steak tartare, beef wellington, shoyu ramen, chicken tikka masala,
bitterballen, cheese fondue) — each with honest timings for the serious home cook, scalable
metric ingredients, real technique, cultural background, and **two wine pairings drawn from
a curated cellar of 85 benchmark wines** (plus sake and Norman cider), every one of which is used. **Fully bilingual: Nederlands (default) and
English**, switchable from the preferences page — every recipe, wine note and interface
string is translated.

## Running it

It is a fully static site — no build step, no dependencies.

```sh
cd terroir-and-table
python3 -m http.server 8741
# open http://localhost:8741
```

(Opening `index.html` directly from disk also works, minus the offline features.)

## Installing on iPhone (PWA)

The site is a Progressive Web App: installable, with its own icon, running full-screen,
and **fully usable offline** — the service worker precaches every recipe, wine, translation
and font (~2.5 MB total).

1. Host the folder over **HTTPS** (required for service workers). Any static host works:
   GitHub Pages, Netlify, Cloudflare Pages — drag-and-drop the folder and you're done.
   All paths are relative, so serving from a subpath (e.g. `user.github.io/terroir`) is fine.
2. Open the URL in **Safari** on the iPhone.
3. Tap **Share → Zet op beginscherm** (Add to Home Screen).
4. Launch from the icon: it opens standalone (no browser chrome) and keeps working in
   airplane mode after the first visit.

To ship an update later, bump `CACHE_VERSION` in `sw.js` — installed clients pick up the
new version on their next online visit.

## What's inside

- **The Atlas** (`#/atlas`) — browse and combine filters: food culture, taste (rich, spicy,
  umami, …), leading ingredient, course, diet, primary preparation method (simmer & braise,
  pan & wok, oven, grilling, frying, steaming, no-cook), kamado-friendly, time budget and
  difficulty, with free-text search.
- **Kamado BBQ** — 132 recipes carry a dedicated "On the kamado / Op de kamado" section:
  setup (direct, indirect, low & slow smoke, on the stone, plancha, dutch oven), dome
  temperature, and 3–6 practical bilingual steps that adapt the recipe to live fire —
  written for people who actually own one.
- **Recipe spreads** — book-style pages with a servings stepper (1–24) that rescales every
  quantity, numbered method, chef's tip, and wine pairings explained.
- **Your Menu** (`#/menu`) — compose a dinner by hand or let the atlas compose one from your
  preferences (cuisine, moods, diets, time, 3 or 4 courses; shuffle endlessly). Produces a
  printable menu card, a merged marketing list scaled to your table, a count-back cook's
  clock, and a deduplicated wine list with bottle counts.
- **The Cellar** (`#/cellar`) — all 85 wines, filterable by type, body and country, each
  cross-linked to every dish in the atlas that calls for it.
- **Saved menus** — name and save any composed menu, then load, rename, reorder or delete it
  from the library on the menu page; dishes within a course can be reordered too.
- **Preferences** (`#/prefs`, the ⚙ in the masthead) — language (English / Nederlands) and the
  default number of persons used by every recipe page and newly composed menu. All of it is
  kept in `localStorage`.

## Structure

```
index.html          shell + PWA metadata
manifest.webmanifest  web app manifest (icons, standalone display)
sw.js               service worker — precaches the whole site for offline use
icons/              app icons (home screen, maskable)
fonts/ css/fonts.css  self-hosted fonts (no CDN dependency offline)
css/style.css       the whole design system (paper atlas / dark cellar)
js/app.js           router, filters, scaling, composer, wine logic
data/wines.js       the wine cellar (curated catalog)
data/recipes-*.js   recipes by macro-region & restaurant theme (27 files, three research waves)
data/nl/*.nl.js     Dutch translations, keyed by recipe/wine id (structure mirrors English)
data/enrich/*.js    per-recipe preparation method + bilingual kamado instructions
data/SPEC.md        the data schema all recipe files follow
data/TRANSLATE.md   the translation spec the Dutch files follow
data/KAMADO.md      the method & kamado enrichment spec
tools/validate.js   node tools/validate.js — schema, referential & translation checks
```

Recipe and wine data are static but real: traditional dishes with their authentic names,
regions and histories; wines are real appellations, grapes and styles with typical price
bands. Menus persist in `localStorage`.
