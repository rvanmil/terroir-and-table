/* Data validator: loads all data files like the browser would and checks the schema. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const dataDir = path.join(__dirname, "..", "data");
const sandbox = { window: {} };
vm.createContext(sandbox);

const subdir = name => fs.existsSync(path.join(dataDir, name))
  ? fs.readdirSync(path.join(dataDir, name)).filter(f => f.endsWith(".js")).sort().map(f => name + "/" + f)
  : [];
const files = fs.readdirSync(dataDir).filter(f => f.endsWith(".js")).sort()
  .concat(subdir("nl")).concat(subdir("enrich"));
for (const f of files) {
  try {
    vm.runInContext(fs.readFileSync(path.join(dataDir, f), "utf8"), sandbox, { filename: f });
  } catch (e) {
    console.error(`PARSE FAIL ${f}: ${e.message}`);
    process.exitCode = 1;
  }
}

const RECIPES = sandbox.window.RECIPES || [];
const WINES = sandbox.window.WINES || [];
const wineIds = new Set(WINES.map(w => w.id));
const TASTES = new Set(["rich","fresh","bright","spicy","smoky","tangy","sweet","umami","herbal","earthy","creamy","nutty"]);
const COURSES = new Set(["starter","main","side","dessert"]);
const DIFFS = new Set(["approachable","intermediate","ambitious"]);
const errors = [];
const ids = new Set();

for (const r of RECIPES) {
  const e = m => errors.push(`${r.id || "??"}: ${m}`);
  if (!r.id) e("missing id");
  else if (ids.has(r.id)) e("duplicate id"); else ids.add(r.id);
  for (const k of ["name","cuisine","region","course","description","story","difficulty"])
    if (!r[k]) e(`missing ${k}`);
  if (!COURSES.has(r.course)) e(`bad course ${r.course}`);
  if (!DIFFS.has(r.difficulty)) e(`bad difficulty ${r.difficulty}`);
  if (!Array.isArray(r.tastes) || !r.tastes.length) e("missing tastes");
  else r.tastes.forEach(t => { if (!TASTES.has(t)) e(`unknown taste ${t}`); });
  if (!Array.isArray(r.keyIngredients) || !r.keyIngredients.length) e("missing keyIngredients");
  if (!Number.isFinite(r.activeMinutes) || !Number.isFinite(r.totalMinutes)) e("bad times");
  if (r.totalMinutes < r.activeMinutes) e("total < active");
  if (r.serves !== 4) e(`serves=${r.serves}`);
  if (!Array.isArray(r.ingredients) || r.ingredients.length < 4) e("too few ingredients");
  else r.ingredients.forEach((i, n) => {
    if (!i.item) e(`ingredient ${n} missing item`);
    if (i.qty !== null && !Number.isFinite(i.qty)) e(`ingredient ${n} bad qty`);
  });
  if (!Array.isArray(r.steps) || r.steps.length < 4) e("too few steps");
  if (!Array.isArray(r.wines) || r.wines.length < 1) e("missing wines");
  else r.wines.forEach(w => {
    if (!wineIds.has(w.id)) e(`unknown wine id ${w.id}`);
    if (!w.note) e(`wine ${w.id} missing note`);
  });
}

for (const w of WINES) {
  for (const k of ["id","name","type","country","region","body","profile","notes","priceBand","servingTemp","pairsWith"])
    if (!w[k]) errors.push(`wine ${w.id || "??"}: missing ${k}`);
}

// Dutch translation coverage & structural mirroring
const NL = sandbox.window.NL || { recipes: {}, wines: {} };
for (const r of RECIPES) {
  const d = NL.recipes[r.id];
  if (!d) { errors.push(`${r.id}: missing Dutch translation`); continue; }
  for (const k of ["name","description","story","steps","ingredients","wines"])
    if (d[k] == null) errors.push(`${r.id}: NL missing ${k}`);
  if (Array.isArray(d.ingredients) && d.ingredients.length !== r.ingredients.length) errors.push(`${r.id}: NL ingredients length mismatch`);
  if (Array.isArray(d.steps) && d.steps.length !== r.steps.length) errors.push(`${r.id}: NL steps length mismatch`);
  if (Array.isArray(d.wines) && d.wines.length !== (r.wines || []).length) errors.push(`${r.id}: NL wines length mismatch`);
  if (r.timeNote && !d.timeNote) errors.push(`${r.id}: NL missing timeNote`);
}
for (const w of WINES) {
  const d = NL.wines[w.id];
  if (!d) { errors.push(`wine ${w.id}: missing Dutch translation`); continue; }
  for (const k of ["profile","notes","pairsWith"]) if (!d[k]) errors.push(`wine ${w.id}: NL missing ${k}`);
}
const nlOrphans = Object.keys(NL.recipes).filter(id => !RECIPES.some(r => r.id === id));
nlOrphans.forEach(id => errors.push(`NL translation for unknown recipe id ${id}`));

// method & kamado enrichment coverage
const ENRICH = sandbox.window.ENRICH || {};
const METHODS = new Set(["braise","pan","oven","grill","fry","steam","raw"]);
const SETUPS = new Set(["direct","indirect","smoke","stone","plancha","dutch-oven"]);
for (const r of RECIPES) {
  const e = ENRICH[r.id];
  if (!e) { errors.push(`${r.id}: missing enrichment (method)`); continue; }
  if (!METHODS.has(e.method)) errors.push(`${r.id}: bad method ${e.method}`);
  if (e.kamado) {
    const k = e.kamado;
    if (!["ideal","good"].includes(k.fit)) errors.push(`${r.id}: bad kamado fit`);
    if (!SETUPS.has(k.setup)) errors.push(`${r.id}: bad kamado setup ${k.setup}`);
    if (!k.temp) errors.push(`${r.id}: kamado missing temp`);
    for (const L of ["en","nl"])
      if (!k[L] || !k[L].intro || !Array.isArray(k[L].steps) || k[L].steps.length < 3)
        errors.push(`${r.id}: kamado ${L} block incomplete`);
  }
}
Object.keys(ENRICH).filter(id => !RECIPES.some(r => r.id === id))
  .forEach(id => errors.push(`enrichment for unknown recipe id ${id}`));

// near-duplicate dish detection across files (same normalized name)
const nameSeen = new Map();
for (const r of RECIPES) {
  const norm = (r.name || "").toLowerCase().replace(/[^a-z]/g, "");
  if (nameSeen.has(norm)) errors.push(`possible duplicate dish: "${r.name}" (${r.id}) vs ${nameSeen.get(norm)}`);
  else nameSeen.set(norm, r.id);
}

const byCuisine = {};
RECIPES.forEach(r => { byCuisine[r.cuisine] = (byCuisine[r.cuisine] || 0) + 1; });
const byCourse = {};
RECIPES.forEach(r => { byCourse[r.course] = (byCourse[r.course] || 0) + 1; });
const usedWines = new Set(RECIPES.flatMap(r => (r.wines || []).map(w => w.id)));

console.log(`Recipes: ${RECIPES.length}  Wines: ${WINES.length}  Cuisines: ${Object.keys(byCuisine).length}`);
console.log("Courses:", JSON.stringify(byCourse));
console.log("By cuisine:", Object.entries(byCuisine).map(([k, v]) => `${k} ${v}`).join(", "));
console.log(`Wines referenced by recipes: ${usedWines.size}/${WINES.length}`);
console.log(`Vegetarian: ${RECIPES.filter(r => (r.dietary||[]).includes("vegetarian")).length}, Vegan: ${RECIPES.filter(r => (r.dietary||[]).includes("vegan")).length}, GF: ${RECIPES.filter(r => (r.dietary||[]).includes("gluten-free")).length}`);

if (errors.length) {
  console.error(`\n${errors.length} ERRORS:`);
  errors.forEach(e => console.error("  - " + e));
  process.exitCode = 1;
} else {
  console.log("\nAll checks passed.");
}
