# Terroir & Table — Method & Kamado Enrichment Specification

You enrich ONE English recipe data file. Output is a single JavaScript file in `data/enrich/`
that registers, keyed by recipe id: (1) the PRIMARY preparation method for EVERY recipe in
your file, and (2) kamado-BBQ instructions for the recipes that genuinely suit one.

## Output file format

```js
// Terroir & Table — Method & kamado: <bestandsnaam>
window.ENRICH = window.ENRICH || {};
Object.assign(window.ENRICH, {
"it-ragu-bolognese": { method: "braise" },
"lv-lamb-kleftiko": {
  method: "oven",
  kamado: {
    fit: "ideal",
    setup: "indirect",
    temp: "150–160°C",
    en: {
      intro: "One sentence on why the kamado elevates this dish.",
      steps: ["…", "…", "…", "…"]
    },
    nl: {
      intro: "Eén zin waarom de kamado dit gerecht beter maakt.",
      steps: ["…", "…", "…", "…"]
    }
  }
}
});
```

## Method (REQUIRED for every recipe id in your file)

Pick the ONE primary preparation method, from EXACTLY this vocabulary:

- `braise` — simmered, stewed, braised; soups and slow pots (stovetop or oven-braised)
- `pan` — sauté, sear, stir-fry, griddle, risotto/paella-style pan work
- `oven` — roasting and oven-baking, incl. breads, pizza, pastry, baked desserts
- `grill` — live-fire/grill-pan/broiler dishes (kebabs, satay, asado…)
- `fry` — deep-fried or generously shallow-fried as the defining step
- `steam` — steamed or dum-style (steamed dumplings, idli, dum biryani)
- `raw` — no-cook or set-cold: salads, ceviche, fresh rolls, chilled set desserts

Judge by the DEFINING step that makes the dish what it is.

## Kamado (ONLY where it truly fits)

A kamado is a thick ceramic charcoal grill (Big Green Egg style): excellent at direct
grilling (180–300°C), indirect roasting/smoking with a heat deflector (110–180°C),
stone-baking at very high heat (300–400°C+), and holding dutch ovens for live-fire braises.

Include a `kamado` block when at least one of:
- the dish is HISTORICALLY fire-born (kebab, satay, tandoori, jerk, asado, suya, souvlaki, bulgogi…) → `fit: "ideal"`
- it is an oven roast/bake that gains real character from charcoal & smoke (kleftiko, roast chicken, pizza/flatbreads on the stone, whole fish…) → `fit: "ideal"` or `"good"`
- it is a braise/pan dish that works beautifully in a dutch oven, paella pan or cast-iron on the kamado (cassoulet, tagine, shakshuka, paella…) → `fit: "good"`

Do NOT include kamado for: boiled pasta dishes, wok stir-fries, delicate steamed dishes,
deep-frying, raw/cold dishes, or desserts that gain nothing from fire. Expect roughly
30–50% of your file's recipes to qualify — be honest, not generous.

### kamado fields
- `fit`: `"ideal"` | `"good"`
- `setup`: `"direct"` | `"indirect"` | `"smoke"` | `"stone"` | `"plancha"` | `"dutch-oven"`
- `temp`: dome-temperature target as a string, e.g. `"160–180°C"` or `"300°C+"`
- `en.intro` / `nl.intro`: one enticing sentence (EN and natural Dutch) on what the kamado adds
- `en.steps` / `nl.steps`: 3–6 practical steps each, SAME content in both languages.
  Write for someone who owns a kamado: lighting and venting to the target dome temp,
  deflector in/out, grid position, realistic times (often shorter/hotter than home ovens),
  lid-closed discipline, when to add smoke wood (name a wood: oak, cherry, apple, pecan,
  hickory) and when not to, resting. Reference the recipe's main method honestly
  ("prepare the marinade as in steps 1–2, then…"). Do not repeat the whole recipe.

## Rules
1. EVERY recipe id in your assigned English file appears in the output with a `method`.
2. Use ids exactly as they appear in the file. No other recipes.
3. Dutch: natural cookbook Dutch (je-vorm); kamado jargon stays (deflector, dome, low & slow).
4. Straight double quotes, ’ for apostrophes, no trailing commas. The file must parse.

## Verification (run before replying)

```sh
node -e "
const w={}; global.window=w;
require('<ABSOLUTE EN RECIPE FILE>');
require('<ABSOLUTE ENRICH FILE>');
const METHODS=new Set(['braise','pan','oven','grill','fry','steam','raw']);
const SETUPS=new Set(['direct','indirect','smoke','stone','plancha','dutch-oven']);
let bad=0;
for(const r of w.RECIPES){const e=w.ENRICH[r.id];
  if(!e){console.log('MISSING',r.id);bad++;continue;}
  if(!METHODS.has(e.method)){console.log('BAD-METHOD',r.id,e.method);bad++;}
  if(e.kamado){const k=e.kamado;
    if(!['ideal','good'].includes(k.fit)){console.log('BAD-FIT',r.id);bad++;}
    if(!SETUPS.has(k.setup)){console.log('BAD-SETUP',r.id,k.setup);bad++;}
    if(!k.temp){console.log('NO-TEMP',r.id);bad++;}
    for(const L of ['en','nl']){
      if(!k[L]||!k[L].intro||!Array.isArray(k[L].steps)||k[L].steps.length<3){console.log('BAD-'+L.toUpperCase(),r.id);bad++;}
    }
  }
}
const orphans=Object.keys(w.ENRICH).filter(id=>!w.RECIPES.some(r=>r.id===id));
if(orphans.length){console.log('ORPHANS',orphans.join(','));bad++;}
console.log(bad?'FAIL':'OK', Object.keys(w.ENRICH).length, 'entries,', Object.values(w.ENRICH).filter(e=>e.kamado).length, 'kamado');"
```

Fix every problem. Final reply: just `OK <n> entries, <m> kamado` plus the output filename.
