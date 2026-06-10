# Terroir & Table — Dutch (nl-NL) Translation Specification

You translate ONE English recipe data file into Dutch. Output is a single JavaScript file in
`data/nl/` that registers translations keyed by recipe id. The English file stays untouched.

## Output file format

```js
// Terroir & Table — Nederlandse vertaling: <bestandsnaam>
window.NL = window.NL || { recipes: {}, wines: {} };
Object.assign(window.NL.recipes, {
"it-ragu-bolognese": {
  name: "Tagliatelle al ragù bolognese",
  description: "…",
  story: "…",
  timeNote: null,
  ingredients: [
    { item: "tagliatelle" },
    { item: "ui", note: "fijngesnipperd" }
  ],
  steps: ["…", "…"],
  wines: ["vertaalde wijnnotitie 1", "vertaalde wijnnotitie 2"],
  tip: "…"
},
"volgend-id": { … }
});
```

## Rules (non-negotiable)

1. **Coverage**: every recipe id in the English file MUST appear in the output.
2. **Structure must mirror the English exactly**:
   - `ingredients` has the SAME length and order as the English array. Each entry has `item`
     (translated) and `note` (translated) only when the English entry has a note. Do NOT
     include `qty` or `unit` — those are reused from the English data.
   - `steps` has the SAME length and order.
   - `wines` is an array of translated pairing-note strings, same length/order as the English
     `wines` array (notes only — ids are reused).
   - `timeNote`: translated string, or `null` if the English is null.
3. **Dish names**: keep authentic local dish names as-is; translate only English descriptors.
   "Walnut-Stuffed Aubergine Rolls" → "Auberginerolletjes gevuld met walnoot";
   "Ukrainian Red Borshch" → "Oekraïense rode borsjtsj"; "Tagliatelle al Ragù Bolognese"
   stays "Tagliatelle al ragù bolognese".
4. **Register**: natural, idiomatic Dutch of a good Dutch cookbook (nl-NL, not Flemish).
   Use proper culinary verbs: fruiten, aanzetten, afblussen, sudderen, pocheren, rusten laten,
   op smaak brengen, aanbraden, glaceren. Temperatures stay in °C, quantities metric.
   Use "je"-vorm (informal) consistently in steps and tips.
5. **Food terminology**: aubergine, courgette, koriander, bosui, peterselie, laurier;
   "heavy cream/double cream" → "slagroom"; "stock" → "bouillon"; "to taste" never appears
   (qty-null is handled by the app). Keep untranslatable authentic terms (dashi, garam masala,
   sofrito) with a brief Dutch gloss only if the English had one.
6. **JS validity**: straight double quotes, escape internal double quotes, use ’ for
   apostrophes inside text. No trailing comma after the last property. The file must parse.

## Verification (run before replying)

```sh
node -e "
const w={recipes:0}; global.window=w;
require('<ABSOLUTE EN FILE>');
require('<ABSOLUTE NL FILE>');
const en=w.RECIPES, nl=w.NL.recipes; let bad=0;
for(const r of en){const t=nl[r.id];
  if(!t){console.log('MISSING',r.id);bad++;continue;}
  if(t.ingredients.length!==r.ingredients.length){console.log('ING-LEN',r.id);bad++;}
  if(t.steps.length!==r.steps.length){console.log('STEP-LEN',r.id);bad++;}
  if(t.wines.length!==(r.wines||[]).length){console.log('WINE-LEN',r.id);bad++;}
  for(let i=0;i<r.ingredients.length;i++){ if(!!r.ingredients[i].note !== !!t.ingredients[i].note){console.log('NOTE-MISMATCH',r.id,i);} }
}
console.log(bad? 'FAIL':'OK', Object.keys(nl).length, 'vertalingen');"
```

Fix every reported problem. Final reply: just `OK <n> vertalingen` plus the output filename.
