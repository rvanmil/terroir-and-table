# Terroir & Table — Recipe Data Specification

You are writing a recipe data file for a cooking-atlas website. Output is a single JavaScript
file that pushes recipe objects onto `window.RECIPES`. The file must be valid plain JavaScript
(no modules, no imports), loadable via a `<script>` tag.

## File format

```js
// Terroir & Table — Recipes: <Region Name>
window.RECIPES = window.RECIPES || [];
window.RECIPES.push(
{ ...recipe 1... },
{ ...recipe 2... }
);
```

## Recipe object schema (ALL fields required unless noted)

```js
{
  id: "it-ragu-bolognese",        // unique, kebab-case, MUST start with your assigned prefix
  name: "Tagliatelle al Ragù Bolognese",  // English-friendly display name (may be the local name)
  localName: "Tagliatelle al ragù bolognese", // name in the local language/script, or null
  cuisine: "Italy",               // country/culture name — EXACTLY as assigned to you
  region: "Emilia-Romagna",       // sub-region, city or province of origin
  course: "main",                 // one of: "starter" | "main" | "side" | "dessert"
  description: "One or two enticing sentences describing the dish itself — texture, flavour, what arrives at the table.",
  story: "One or two sentences of REAL cultural/historical background: origin, tradition, when it is eaten. Must be factually accurate.",
  tastes: ["rich","umami"],       // 2–4 from CONTROLLED VOCAB below
  keyIngredients: ["beef","pasta","tomatoes"], // 2–4 from CONTROLLED VOCAB below — used for filtering
  dietary: [],                    // any of: "vegetarian","vegan","gluten-free","dairy-free","pescatarian" that truly apply (vegan implies vegetarian: list both)
  difficulty: "intermediate",     // "approachable" | "intermediate" | "ambitious" (for a serious home cook)
  activeMinutes: 45,              // hands-on time
  totalMinutes: 240,              // total including simmering/resting (NOT overnight steps — put those in timeNote)
  timeNote: null,                 // string or null, e.g. "Plus overnight marinating"
  serves: 4,                      // ALWAYS 4 (the app scales)
  ingredients: [                  // 6–16 entries, metric units, realistic quantities for 4
    { qty: 400, unit: "g", item: "tagliatelle" },
    { qty: 1, unit: "", item: "onion", note: "finely diced" },     // note optional
    { qty: null, unit: "", item: "sea salt and black pepper" }     // qty null = "to taste"
  ],
  steps: [                        // 5–10 numbered steps, each 1–3 sentences, real technique,
    "..."                         // written for a competent home cook (temps in °C, sensory cues)
  ],
  wines: [                        // exactly 2 pairings from the WINE CATALOG below
    { id: "barbera-alba", note: "One sentence on WHY this pairing works." },
    { id: "chianti-classico", note: "..." }
  ],
  tip: "One practical chef's tip (sourcing, substitution, make-ahead, or technique)."
}
```

## Controlled vocabularies

**tastes** (pick 2–4): `rich`, `fresh`, `bright`, `spicy`, `smoky`, `tangy`, `sweet`, `umami`, `herbal`, `earthy`, `creamy`, `nutty`

**keyIngredients** (pick 2–4, choose closest): `chicken`, `beef`, `pork`, `lamb`, `duck`, `fish`, `shellfish`, `eggs`, `tofu`, `chickpeas`, `lentils`, `beans`, `rice`, `noodles`, `pasta`, `bread`, `potatoes`, `tomatoes`, `eggplant`, `mushrooms`, `cheese`, `yogurt`, `coconut`, `citrus`, `chilies`, `herbs`, `garlic`, `onions`, `ginger`, `olives`, `nuts`, `corn`, `squash`, `greens`, `cabbage`, `peppers`, `carrots`, `spices`, `chocolate`, `fruit`, `honey`, `cream`, `butter`, `caramel`

## Wine catalog (use ONLY these ids; pick pairings that genuinely work)

REDS — `crozes-hermitage` (French Syrah, peppery) · `blaufrankisch` (cherry/pepper, paprika dishes) · `mencia-bierzo` (slate, Atlantic) · `tannat-uruguay` (parrilla powerhouse) · `bekaa-red` (Lebanese, cedar/spice) · `barolo` (Nebbiolo, full, tar/roses) · `barbera-alba` (juicy, high acid) · `chianti-classico` (Sangiovese, cherry/herbs) · `etna-rosso` (light, volcanic) · `primitivo-manduria` (ripe, plush) · `valpolicella-ripasso` (cherry, raisin, full) · `bourgogne-pinot` (light, silky) · `morgon-gamay` (crunchy, chillable) · `cotes-du-rhone` (Grenache blend, garrigue) · `saint-emilion` (Merlot, plush) · `cahors-malbec` (dark, structured) · `chinon-cab-franc` (leafy, fresh) · `rioja-reserva` (mellow, vanilla) · `ribera-del-duero` (powerful Tempranillo) · `priorat` (slate, concentrated) · `douro-tinto` (wild black fruit) · `naoussa-xinomavro` (Greek, tomato/olive, firm) · `mendoza-malbec` (velvety, violets) · `chilean-carmenere` (plummy, peppery) · `willamette-pinot` (Oregon, silky) · `napa-cabernet` (cassis, powerful) · `sonoma-zinfandel` (brambly, peppery) · `barossa-shiraz` (opulent, dark) · `central-otago-pinot` (dark cherry, thyme) · `swartland-syrah` (peppery, fresh) · `saperavi-georgia` (inky, brooding)

WHITES — `vouvray-demi-sec` (off-dry Chenin, loves heat) · `pinot-grigio-altoadige` (clean, antipasti) · `txakoli` (Basque spritz, pintxos) · `chasselas-valais` (THE fondue/raclette wine) · `chablis` (steely, oyster shell) · `meursault` (rich, nutty) · `sancerre` (Sauvignon, flinty) · `muscadet` (briny, light) · `alsace-riesling` (dry, taut) · `gewurztraminer-alsace` (lychee, off-dry, loves spice) · `mosel-kabinett` (off-dry Riesling, loves heat/spice) · `gruner-veltliner` (peppery, handles vegetables) · `soave-classico` (gentle, almond) · `gavi` (crisp Piedmont) · `verdicchio` (textured, ageworthy) · `vermentino-sardinia` (herbal, saline) · `fiano-avellino` (hazelnut, volcanic) · `assyrtiko-santorini` (bone-dry, volcanic, lemon) · `albarino-rias-baixas` (peachy, Atlantic) · `verdejo-rueda` (herbal, zesty) · `vinho-verde` (light spritz, ultra-fresh) · `hunter-semillon` (lemon, razor acid) · `marlborough-sauvignon` (pungent, tropical) · `sa-chenin` (textured, baked apple) · `margaret-river-chardonnay` (powerful, flinty) · `torrontes-salta` (floral, dry) · `dry-furmint` (smoky, fierce acid) · `picpoul-pinet` (saline lip-stinger) · `amber-rkatsiteli` (tannic orange wine, pairs like a red)

ROSÉ — `provence-rose` (pale, dry) · `tavel-rose` (deep, gastronomic, handles spice/garlic)

SPARKLING — `champagne-brut` (toasty, versatile, loves fried food) · `franciacorta` (rich Italian) · `cava-reserva` (savoury, tapas) · `prosecco-superiore` (soft, off-dry) · `lambrusco-secco` (dry red fizz, cuts fat)

SWEET/FORTIFIED — `sauternes` (botrytis, honeyed) · `tokaji-aszu` (apricot, electric) · `moscato-asti` (frothy, light, 5.5%) · `tawny-port` (caramel, nuts) · `px-sherry` (treacle, over ice cream) · `fino-sherry` (bone-dry, olives/almonds/fried) · `bual-madeira` (toffee + acid) · `vin-santo` (nutty amber, cantucci) · `banyuls` (CHOCOLATE pairing) · `rutherglen-muscat` (raisin, espresso)

OTHER — `junmai-sake` (umami-rich; ideal for soy/dashi/miso/raw fish) · `normandy-cidre` (dry cider; mussels, pork, Norman/Breton dishes)

## Pairing guidance
- Pair dessert courses ONLY with sweet/fortified/sparkling-sweet wines (moscato, sauternes, tokaji, port, px, madeira, vin-santo, banyuls, rutherglen).
- Chocolate desserts → banyuls, px-sherry, rutherglen-muscat, tawny-port.
- Spicy dishes → off-dry/aromatic (mosel-kabinett, gewurztraminer-alsace, torrontes-salta, tavel-rose) or low-tannin reds.
- Soy/dashi/miso/raw fish → junmai-sake, champagne-brut, mosel-kabinett, gruner-veltliner.
- Favour regional matches when authentic (Italian dish → Italian wine) but break the rule when a better match exists.
- Vary your pairings across recipes — do not lean on the same 5 wines.

## Quality bar (non-negotiable)
- Recipes must be AUTHENTIC, traditional dishes that really exist, with their real names, real regional origins, and historically accurate stories. No invented fusion.
- Quantities must be realistic and metric (g, kg, ml, l, tbsp, tsp, or count). Serves 4.
- Steps must reflect genuine technique (e.g., soffritto sweated slowly; rice rested; meat seared in batches). Include oven temps in °C and sensory doneness cues.
- Times must be honest for a serious home cook, including simmering/proving in totalMinutes.
- Use straight double quotes in JS strings; escape internal double quotes or use ’ for apostrophes. NO trailing commas after the last object. The file must parse.
- IDs: kebab-case with your assigned prefix, e.g. `it-`, `fr-`. Unique within your file.
- Mix of courses as assigned. Include vegetarian/vegan options where the cuisine genuinely offers them.
