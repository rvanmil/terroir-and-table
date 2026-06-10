/* ============================================================
   TERROIR & TABLE — application
   Hash-routed single page: cover, atlas (recipes), recipe
   spread, menu composer, cellar (wines), preferences.
   Bilingual (English / Nederlands). No dependencies.
   ============================================================ */
(function () {
"use strict";

const RECIPES = (window.RECIPES || []).slice();
const WINES = window.WINES || [];
const NL = window.NL || { recipes: {}, wines: {} };
const ENRICH = window.ENRICH || {};
const wineById = Object.fromEntries(WINES.map(w => [w.id, w]));
const recipeById = Object.fromEntries(RECIPES.map(r => [r.id, r]));

const TASTES = ["rich","fresh","bright","spicy","smoky","tangy","sweet","umami","herbal","earthy","creamy","nutty"];
const COURSES = ["starter","main","side","dessert"];
const METHODS = ["braise","pan","oven","grill","fry","steam","raw"];
const DIETS = ["vegetarian","vegan","pescatarian","gluten-free","dairy-free"];
const GROUPS = {
  Italy: "mediterranean", France: "mediterranean", Spain: "mediterranean", Portugal: "mediterranean", Greece: "mediterranean",
  Turkey: "crossroads", Lebanon: "crossroads", Syria: "crossroads", Palestine: "crossroads", Israel: "crossroads",
  Morocco: "crossroads", Tunisia: "crossroads", Egypt: "crossroads", Iran: "crossroads", Georgia: "crossroads",
  Jordan: "crossroads",
  India: "southasia", Pakistan: "southasia", "Sri Lanka": "southasia", Nepal: "southasia", Bangladesh: "southasia",
  China: "eastasia", Japan: "eastasia", Korea: "eastasia",
  Thailand: "seasia", Vietnam: "seasia", Indonesia: "seasia", Malaysia: "seasia", Philippines: "seasia",
  Mexico: "americas", Peru: "americas", Argentina: "americas", Brazil: "americas", Colombia: "americas",
  Venezuela: "americas", Cuba: "americas", Chile: "americas", USA: "americas", Jamaica: "americas",
  England: "northern", Scotland: "northern", Ireland: "northern", Germany: "northern", Austria: "northern",
  Hungary: "northern", Poland: "northern", Sweden: "northern", Belgium: "northern", Netherlands: "northern",
  Switzerland: "northern", Cyprus: "mediterranean",
  Ukraine: "easteurope", Russia: "easteurope", Czechia: "easteurope", Romania: "easteurope",
  Serbia: "easteurope", Bulgaria: "easteurope",
  Armenia: "crossroads", Azerbaijan: "crossroads", Uzbekistan: "silkroad", Afghanistan: "silkroad",
  Kazakhstan: "silkroad", Tajikistan: "silkroad",
  Singapore: "seasia", Canada: "americas", Bolivia: "americas",
  Trinidad: "americas", "Puerto Rico": "americas",
  Australia: "oceania", "New Zealand": "oceania",
  Senegal: "africa", Nigeria: "africa", Ghana: "africa", Ethiopia: "africa",
  "South Africa": "africa", Kenya: "africa", Mozambique: "africa"
};

const CUISINES = [...new Set(RECIPES.map(r => r.cuisine))].sort();
const INGREDIENT_COUNTS = {};
RECIPES.forEach(r => (r.keyIngredients || []).forEach(k => { INGREDIENT_COUNTS[k] = (INGREDIENT_COUNTS[k] || 0) + 1; }));
const TOP_INGREDIENTS = Object.keys(INGREDIENT_COUNTS).sort((a, b) => INGREDIENT_COUNTS[b] - INGREDIENT_COUNTS[a]).slice(0, 24).sort();

/* ============================================================
   i18n
   ============================================================ */
const T = {
en: {
  "brand.sub": "A Cook's Atlas of the World",
  "nav.atlas": "The Atlas", "nav.cellar": "The Cellar", "nav.menu": "Your Menu", "nav.prefs": "Preferences",
  "cover.kicker": "Recipes · Wine · The World Entire",
  "cover.tagline": "An atlas for the serious home cook — authentic dishes gathered from {n} countries, each with honest timings, real technique, and a pour chosen from a cellar of the world's benchmark wines.",
  "cover.stat.recipes": "Recipes", "cover.stat.cultures": "Countries", "cover.stat.bins": "Cellar bins", "cover.stat.menus": "Menus",
  "cover.openAtlas": "Open the Atlas", "cover.cellar": "Descend to the Cellar",
  "cover.tonight": "Tonight, perhaps —", "cover.another": "Another",
  "cover.toc": "Table of Contents — by country",
  "cover.recipe": "recipe", "cover.recipes": "recipes",
  "atlas.find": "Find your dish", "atlas.search": "Search the atlas…",
  "atlas.culture": "Country", "atlas.taste": "Taste", "atlas.ingredient": "Leading ingredient",
  "atlas.courseDiet": "Course & diet", "atlas.fire": "Method & fire", "atlas.timeEffort": "Time & effort", "atlas.anyDiff": "Any difficulty",
  "atlas.kamadoChip": "▲ kamado-friendly",
  "kamado.title": "On the kamado",
  "kamado.fit.ideal": "born for live fire", "kamado.fit.good": "works beautifully over coals",
  "atlas.clear": "Clear all filters", "atlas.title": "The Atlas of Recipes",
  "atlas.count": "{a} of {b} dishes",
  "atlas.sortAZ": "A — Z", "atlas.sortTime": "quickest first", "atlas.sortCulture": "by country",
  "atlas.empty": "Nothing in the atlas matches that combination — loosen a filter or two. ❦",
  "time.any": "Any amount of time", "time.45": "Under 45 min", "time.75": "Under 1¼ h", "time.120": "Under 2 h", "time.240": "Under 4 h",
  "recipe.back": "← Back to the Atlas",
  "recipe.active": "Active", "recipe.total": "Total", "recipe.effort": "Effort",
  "recipe.ingredients": "Ingredients", "recipe.for": "For", "recipe.persons": "persons",
  "recipe.method": "Method", "recipe.kitchen": "From the kitchen", "recipe.cellar": "From the cellar",
  "recipe.add": "Add to your menu", "recipe.onMenu": "✓ On your menu — remove", "recipe.goMenu": "Go to menu",
  "recipe.toTaste": "to taste",
  "cellar.kicker": "Chapter the Last — Below Stairs", "cellar.title": "The Cellar",
  "cellar.intro": "{n} bins of benchmark bottles from the world's classic and rising regions — each chosen because it earns its place beside food. Every recipe in the atlas points here.",
  "cellar.body": "Body", "cellar.serve": "Serve", "cellar.price": "Price",
  "cellar.pairs1": "Pairs with 1 dish in the atlas", "cellar.pairsN": "Pairs with {n} dishes in the atlas",
  "cellar.empty": "An empty bin — widen the search.",
  "menu.kicker": "Compose · Scale · Pour · Print", "menu.title": "Your Menu",
  "menu.compose": "Let the atlas compose", "menu.where": "Where shall we cook tonight?",
  "menu.anywhere": "Anywhere — let the kitchen roam", "menu.moods": "Moods & tastes you crave",
  "menu.needs": "The table's needs", "menu.timePerDish": "Time per dish", "menu.shape": "Shape of the evening",
  "menu.three": "Three courses — starter · main · dessert", "menu.four": "Four courses — adds a side dish",
  "menu.composeBtn": "Compose a menu", "menu.shuffle": "Shuffle again",
  "menu.hint": "…or wander <a href=\"#/atlas\">the Atlas</a> and add dishes by hand. Composing replaces the current menu.",
  "menu.presents": "Terroir & Table presents", "menu.evening": "An Evening's Menu",
  "menu.for": "For", "menu.persons": "persons",
  "menu.empty": "The menu is a blank page. Compose one on the left, or gather dishes from the Atlas. ❦",
  "menu.remove": "remove ✕",
  "menu.shop": "Marketing list", "menu.scaledFor": "· scaled for {n}",
  "menu.clock": "The cook's clock",
  "menu.clockIntro": "Roughly <b>{time}</b> of hands-on work across the menu. Count backwards from the hour you wish to serve — the {dish} sets the pace.",
  "menu.begin": "Begin", "menu.handsOn": "hands-on",
  "menu.wineList": "The wine list", "menu.with": "With",
  "menu.bottle1": "≈ 1 bottle for {p} (a glass per person per course)",
  "menu.bottleN": "≈ {n} bottles for {p} (a glass per person per course)",
  "menu.print": "Print the menu & lists", "menu.clear": "Clear the menu",
  "menu.alert": "The atlas finds no dishes matching those constraints — loosen the time or dietary limits.",
  "menu.xdishes": "× {n} dishes",
  "saved.title": "Saved menus", "saved.placeholder": "Name this menu…", "saved.save": "Save this menu",
  "saved.load": "Load", "saved.rename": "Rename", "saved.delete": "Delete",
  "saved.empty": "No saved menus yet — compose one and give it a name.",
  "saved.renamePrompt": "New name for this menu:",
  "saved.meta": "{d} dishes · for {p}",
  "course.starter": "starter", "course.main": "main", "course.side": "side", "course.dessert": "dessert",
  "courseLabel.starter": "To Begin", "courseLabel.main": "The Main Course", "courseLabel.side": "On the Side", "courseLabel.dessert": "To Finish",
  "prefs.title": "Preferences", "prefs.kicker": "The Reader's Page",
  "prefs.intro": "Set the book to your hand. Choices are kept on this device and apply at once.",
  "prefs.language": "Language", "prefs.en": "English", "prefs.nl": "Nederlands",
  "prefs.persons": "Default number of persons",
  "prefs.personsHelp": "Used as the starting point for every recipe page and newly composed menu.",
  "colophon": "<strong>Terroir &amp; Table</strong> — set in Fraunces &amp; Newsreader. Recipes are traditional dishes researched from their regions of origin; wines are real appellations and styles. Quantities serve as a faithful guide for the serious home cook.",
  "u.hour": "h"
},
nl: {
  "brand.sub": "Een kookatlas van de wereld",
  "nav.atlas": "De Atlas", "nav.cellar": "De Kelder", "nav.menu": "Jouw Menu", "nav.prefs": "Voorkeuren",
  "cover.kicker": "Recepten · Wijn · De Hele Wereld",
  "cover.tagline": "Een atlas voor de serieuze thuiskok — authentieke gerechten uit {n} landen, elk met eerlijke bereidingstijden, echte techniek en een wijn gekozen uit een kelder met klassiekers van over de hele wereld.",
  "cover.stat.recipes": "Recepten", "cover.stat.cultures": "Landen", "cover.stat.bins": "Keldervakken", "cover.stat.menus": "Menu's",
  "cover.openAtlas": "Open de Atlas", "cover.cellar": "Daal af naar de Kelder",
  "cover.tonight": "Vanavond, misschien —", "cover.another": "Een ander",
  "cover.toc": "Inhoudsopgave — per land",
  "cover.recipe": "recept", "cover.recipes": "recepten",
  "atlas.find": "Vind je gerecht", "atlas.search": "Doorzoek de atlas…",
  "atlas.culture": "Land", "atlas.taste": "Smaak", "atlas.ingredient": "Hoofdingrediënt",
  "atlas.courseDiet": "Gang & dieet", "atlas.fire": "Bereiding & vuur", "atlas.timeEffort": "Tijd & moeite", "atlas.anyDiff": "Elke moeilijkheid",
  "atlas.kamadoChip": "▲ geschikt voor kamado",
  "kamado.title": "Op de kamado",
  "kamado.fit.ideal": "geboren voor open vuur", "kamado.fit.good": "werkt prachtig boven houtskool",
  "atlas.clear": "Wis alle filters", "atlas.title": "De Receptenatlas",
  "atlas.count": "{a} van {b} gerechten",
  "atlas.sortAZ": "A — Z", "atlas.sortTime": "snelste eerst", "atlas.sortCulture": "per land",
  "atlas.empty": "Niets in de atlas past bij die combinatie — versoepel een filter of twee. ❦",
  "time.any": "Alle tijd van de wereld", "time.45": "Minder dan 45 min", "time.75": "Minder dan 1¼ u", "time.120": "Minder dan 2 u", "time.240": "Minder dan 4 u",
  "recipe.back": "← Terug naar de Atlas",
  "recipe.active": "Actief", "recipe.total": "Totaal", "recipe.effort": "Moeite",
  "recipe.ingredients": "Ingrediënten", "recipe.for": "Voor", "recipe.persons": "personen",
  "recipe.method": "Bereiding", "recipe.kitchen": "Uit de keuken", "recipe.cellar": "Uit de kelder",
  "recipe.add": "Zet op je menu", "recipe.onMenu": "✓ Op je menu — verwijder", "recipe.goMenu": "Naar het menu",
  "recipe.toTaste": "naar smaak",
  "cellar.kicker": "Het laatste hoofdstuk — beneden", "cellar.title": "De Kelder",
  "cellar.intro": "{n} vakken met klassiekers uit de grote en opkomende wijnstreken van de wereld — elk gekozen omdat ze hun plek naast het eten verdienen. Elk recept in de atlas wijst hierheen.",
  "cellar.body": "Body", "cellar.serve": "Schenk", "cellar.price": "Prijs",
  "cellar.pairs1": "Past bij 1 gerecht uit de atlas", "cellar.pairsN": "Past bij {n} gerechten uit de atlas",
  "cellar.empty": "Een leeg vak — verbreed de zoekopdracht.",
  "menu.kicker": "Stel samen · Schaal · Schenk · Print", "menu.title": "Jouw Menu",
  "menu.compose": "Laat de atlas componeren", "menu.where": "Waar koken we vanavond?",
  "menu.anywhere": "Overal — laat de keuken zwerven", "menu.moods": "Waar je trek in hebt",
  "menu.needs": "Wat de tafel nodig heeft", "menu.timePerDish": "Tijd per gerecht", "menu.shape": "Vorm van de avond",
  "menu.three": "Drie gangen — voor · hoofd · na", "menu.four": "Vier gangen — met een bijgerecht erbij",
  "menu.composeBtn": "Stel een menu samen", "menu.shuffle": "Schud opnieuw",
  "menu.hint": "…of dwaal door <a href=\"#/atlas\">de Atlas</a> en voeg zelf gerechten toe. Componeren vervangt het huidige menu.",
  "menu.presents": "Terroir & Table presenteert", "menu.evening": "Een Avondmenu",
  "menu.for": "Voor", "menu.persons": "personen",
  "menu.empty": "Het menu is een onbeschreven blad. Componeer er links een, of verzamel gerechten uit de Atlas. ❦",
  "menu.remove": "verwijder ✕",
  "menu.shop": "Boodschappenlijst", "menu.scaledFor": "· geschaald voor {n}",
  "menu.clock": "De kookklok",
  "menu.clockIntro": "Ruwweg <b>{time}</b> actief werk voor het hele menu. Reken terug vanaf het moment van serveren — de {dish} bepaalt het tempo.",
  "menu.begin": "Begin met", "menu.handsOn": "actief",
  "menu.wineList": "De wijnkaart", "menu.with": "Bij",
  "menu.bottle1": "≈ 1 fles voor {p} (een glas p.p. per gang)",
  "menu.bottleN": "≈ {n} flessen voor {p} (een glas p.p. per gang)",
  "menu.print": "Print het menu & de lijsten", "menu.clear": "Maak het menu leeg",
  "menu.alert": "De atlas vindt geen gerechten binnen die grenzen — versoepel de tijd of het dieet.",
  "menu.xdishes": "× {n} gerechten",
  "saved.title": "Opgeslagen menu's", "saved.placeholder": "Geef dit menu een naam…", "saved.save": "Bewaar dit menu",
  "saved.load": "Laad", "saved.rename": "Hernoem", "saved.delete": "Verwijder",
  "saved.empty": "Nog geen opgeslagen menu's — componeer er een en geef het een naam.",
  "saved.renamePrompt": "Nieuwe naam voor dit menu:",
  "saved.meta": "{d} gerechten · voor {p}",
  "course.starter": "voorgerecht", "course.main": "hoofdgerecht", "course.side": "bijgerecht", "course.dessert": "nagerecht",
  "courseLabel.starter": "Om te Beginnen", "courseLabel.main": "Het Hoofdgerecht", "courseLabel.side": "Erbij", "courseLabel.dessert": "Tot Besluit",
  "prefs.title": "Voorkeuren", "prefs.kicker": "De pagina van de lezer",
  "prefs.intro": "Stel het boek naar je hand. Keuzes worden op dit apparaat bewaard en gelden direct.",
  "prefs.language": "Taal", "prefs.en": "English", "prefs.nl": "Nederlands",
  "prefs.persons": "Standaard aantal personen",
  "prefs.personsHelp": "Wordt het uitgangspunt voor elke receptpagina en elk nieuw gecomponeerd menu.",
  "colophon": "<strong>Terroir &amp; Table</strong> — gezet uit de Fraunces &amp; Newsreader. De recepten zijn traditionele gerechten, onderzocht in hun streek van herkomst; de wijnen zijn echte appellaties en stijlen. De hoeveelheden zijn een betrouwbare gids voor de serieuze thuiskok.",
  "u.hour": "u"
}
};

const TASTE_NL = { rich: "rijk", fresh: "fris", bright: "levendig", spicy: "pittig", smoky: "rokerig", tangy: "friszuur", sweet: "zoet", umami: "umami", herbal: "kruidig", earthy: "aards", creamy: "romig", nutty: "nootachtig" };
const DIET_NL = { vegetarian: "vegetarisch", vegan: "veganistisch", pescatarian: "pescotarisch", "gluten-free": "glutenvrij", "dairy-free": "zuivelvrij" };
const DIFF_NL = { approachable: "toegankelijk", intermediate: "gevorderd", ambitious: "ambitieus" };
const ING_NL = { chicken: "kip", beef: "rund", pork: "varken", lamb: "lam", duck: "eend", fish: "vis", shellfish: "schelpdieren", eggs: "eieren", tofu: "tofu", chickpeas: "kikkererwten", lentils: "linzen", beans: "bonen", rice: "rijst", noodles: "noedels", pasta: "pasta", bread: "brood", potatoes: "aardappelen", tomatoes: "tomaten", eggplant: "aubergine", mushrooms: "paddenstoelen", cheese: "kaas", yogurt: "yoghurt", coconut: "kokos", citrus: "citrus", chilies: "pepers", herbs: "verse kruiden", garlic: "knoflook", onions: "uien", ginger: "gember", olives: "olijven", nuts: "noten", corn: "maïs", squash: "pompoen", greens: "bladgroenten", cabbage: "kool", peppers: "paprika", carrots: "wortels", spices: "specerijen", chocolate: "chocolade", fruit: "fruit", honey: "honing", cream: "room", butter: "boter", caramel: "karamel" };
const WTYPE_NL = { red: "rood", white: "wit", "rosé": "rosé", sparkling: "mousserend", dessert: "dessert", fortified: "versterkt", sake: "sake", cider: "cider" };
const METHOD_EN = { braise: "simmer & braise", pan: "pan & wok", oven: "oven & baking", grill: "grilling", fry: "frying", steam: "steaming", raw: "no-cook" };
const METHOD_NL = { braise: "stoven & sudderen", pan: "pan & wok", oven: "oven & bakken", grill: "grillen", fry: "frituren", steam: "stomen", raw: "zonder koken" };
const SETUP_EN = { direct: "direct", indirect: "indirect", smoke: "low & slow smoke", stone: "on the stone", plancha: "plancha / cast iron", "dutch-oven": "dutch oven" };
const SETUP_NL = { direct: "direct", indirect: "indirect", smoke: "low & slow rook", stone: "op de steen", plancha: "plancha / gietijzer", "dutch-oven": "dutch oven" };
const BODY_NL = { light: "licht", medium: "medium", full: "vol" };
const CUISINE_NL = {
  Italy: "Italië", France: "Frankrijk", Spain: "Spanje", Greece: "Griekenland", Turkey: "Turkije",
  Lebanon: "Libanon", Syria: "Syrië", Palestine: "Palestina", Israel: "Israël", Morocco: "Marokko",
  Tunisia: "Tunesië", Egypt: "Egypte", Georgia: "Georgië", Jordan: "Jordanië",
  Indonesia: "Indonesië", Malaysia: "Maleisië", Philippines: "Filipijnen",
  Argentina: "Argentinië", Brazil: "Brazilië", Chile: "Chili", USA: "Verenigde Staten",
  England: "Engeland", Scotland: "Schotland", Ireland: "Ierland", Germany: "Duitsland",
  Austria: "Oostenrijk", Hungary: "Hongarije", Poland: "Polen", Sweden: "Zweden", Belgium: "België",
  Netherlands: "Nederland", Ukraine: "Oekraïne", Russia: "Rusland", Czechia: "Tsjechië",
  Romania: "Roemenië", Serbia: "Servië", Bulgaria: "Bulgarije", Armenia: "Armenië",
  Azerbaijan: "Azerbeidzjan", Uzbekistan: "Oezbekistan", Kazakhstan: "Kazachstan",
  Tajikistan: "Tadzjikistan", Australia: "Australië", "New Zealand": "Nieuw-Zeeland",
  Ethiopia: "Ethiopië", "South Africa": "Zuid-Afrika", Kenya: "Kenia",
  Switzerland: "Zwitserland", Uruguay: "Uruguay"
};

/* ---------------- preferences & state ---------------- */
const prefs = loadJson("tt:prefs", { lang: "nl", persons: 4 });
if (prefs.lang !== "en" && prefs.lang !== "nl") prefs.lang = "nl";
prefs.persons = clampPersons(prefs.persons);

const menu = loadMenu();
const menuLib = loadJson("tt:menuLib", []);
const atlasState = { q: "", cuisines: [], tastes: [], ingredients: [], courses: [], diets: [], methods: [], kamado: false, time: 0, difficulty: "", sort: "name" };
const cellarState = { types: [], countries: [], bodies: [] };
let recipeServings = {};

function loadJson(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key) || "null"); if (v) return v; } catch (e) { /* fresh */ }
  return fallback;
}
function loadMenu() {
  const m = loadJson("tt:menu", null);
  if (m && Array.isArray(m.ids)) { m.ids = m.ids.filter(id => recipeById[id]); m.persons = clampPersons(m.persons); return m; }
  return { persons: prefs.persons, ids: [] };
}
function clampPersons(n) { return Math.min(24, Math.max(1, +n || 4)); }
function savePrefs() { localStorage.setItem("tt:prefs", JSON.stringify(prefs)); }
function saveLib() { localStorage.setItem("tt:menuLib", JSON.stringify(menuLib)); }
function saveMenu() {
  localStorage.setItem("tt:menu", JSON.stringify(menu));
  const n = menu.ids.length, el = document.getElementById("menuCount");
  el.hidden = n === 0; el.textContent = n;
}

/* ---------------- i18n helpers ---------------- */
function t(key, vars) {
  let s = (T[prefs.lang] && T[prefs.lang][key]) != null ? T[prefs.lang][key] : (T.en[key] != null ? T.en[key] : key);
  if (vars) for (const k in vars) s = s.replaceAll("{" + k + "}", vars[k]);
  return s;
}
const isNL = () => prefs.lang === "nl";
const tasteLabel = x => isNL() ? (TASTE_NL[x] || x) : x;
const dietLabel = x => isNL() ? (DIET_NL[x] || x) : x;
const diffLabel = x => isNL() ? (DIFF_NL[x] || x) : x;
const ingLabel = x => isNL() ? (ING_NL[x] || x) : x;
const wtypeLabel = x => isNL() ? (WTYPE_NL[x] || x) : x;
const bodyLabel = x => isNL() ? (BODY_NL[x] || x) : x;
const cuisineLabel = x => isNL() ? (CUISINE_NL[x] || x) : x;
const methodLabel = x => (isNL() ? METHOD_NL : METHOD_EN)[x] || x;
const setupLabel = x => (isNL() ? SETUP_NL : SETUP_EN)[x] || x;
const courseTag = x => t("course." + x);
const courseLabel = x => t("courseLabel." + x);

/* localized view of a recipe (falls back to English per field) */
function loc(r) {
  const d = isNL() ? NL.recipes[r.id] : null;
  if (!d) return {
    name: r.name, description: r.description, story: r.story, tip: r.tip, timeNote: r.timeNote,
    ingredients: r.ingredients, wineNote: i => (r.wines[i] || {}).note || ""
  };
  return {
    name: d.name || r.name,
    description: d.description || r.description,
    story: d.story || r.story,
    tip: d.tip || r.tip,
    timeNote: r.timeNote ? (d.timeNote || r.timeNote) : null,
    ingredients: r.ingredients.map((ing, i) => ({
      qty: ing.qty, unit: ing.unit,
      item: (d.ingredients[i] && d.ingredients[i].item) || ing.item,
      note: ing.note ? ((d.ingredients[i] && d.ingredients[i].note) || ing.note) : undefined
    })),
    steps: d.steps && d.steps.length === r.steps.length ? d.steps : r.steps,
    wineNote: i => (d.wines && d.wines[i]) || (r.wines[i] || {}).note || ""
  };
}
function locSteps(r) { const d = isNL() ? NL.recipes[r.id] : null; return d && d.steps && d.steps.length === r.steps.length ? d.steps : r.steps; }
function locWine(w) {
  const d = isNL() ? NL.wines[w.id] : null;
  return {
    profile: (d && d.profile) || w.profile,
    notes: (d && d.notes) || w.notes,
    pairsWith: (d && d.pairsWith) || w.pairsWith,
    servingTemp: (d && d.servingTemp) || w.servingTemp
  };
}
const locName = r => loc(r).name;

/* ---------------- utilities ---------------- */
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

function fmtTime(min) {
  if (!min && min !== 0) return "—";
  if (min < 60) return min + " min";
  const h = Math.floor(min / 60), m = min % 60, u = t("u.hour");
  return m ? `${h} ${u} ${m} min` : `${h} ${u}`;
}

const FRACTIONS = [[0.25, "¼"], [0.33, "⅓"], [0.5, "½"], [0.66, "⅔"], [0.67, "⅔"], [0.75, "¾"]];
function fmtQty(q) {
  if (q == null) return "";
  if (q >= 10) return String(Math.round(q));
  const whole = Math.floor(q);
  let frac = q - whole;
  for (const [v, glyph] of FRACTIONS) {
    if (Math.abs(frac - v) < 0.05) return (whole ? whole : "") + glyph;
  }
  const r = Math.round(q * 10) / 10;
  return String(r % 1 === 0 ? Math.round(r) : r);
}
function scaledQty(ing, persons, serves) {
  if (ing.qty == null) return t("recipe.toTaste");
  const q = ing.qty * persons / (serves || 4);
  let unit = ing.unit || "";
  let val = q;
  if (unit === "g" && val >= 1000) { val = val / 1000; unit = "kg"; }
  if (unit === "ml" && val >= 1000) { val = val / 1000; unit = "l"; }
  return (fmtQty(val) + " " + unit).trim();
}

const tasteDot = x => `<span class="taste-dot" style="background:var(--t-${esc(x)})"></span>`;
const DIFF_GLYPH = { approachable: "◦", intermediate: "◦◦", ambitious: "◦◦◦" };

function chip(group, value, on, label, extra) {
  return `<button class="chip ${on ? "is-on" : ""}" data-filter="${esc(group)}" data-value="${esc(value)}">${extra || ""}${esc(label != null ? label : value)}</button>`;
}

function pickWeighted(cands, scoreFn) {
  const scored = cands.map(r => ({ r, s: scoreFn(r) + Math.random() * 1.6 }))
    .sort((a, b) => b.s - a.s);
  const top = scored.slice(0, Math.min(6, scored.length));
  return top.length ? top[Math.floor(Math.random() * top.length)].r : null;
}

const newId = () => "m" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/* ---------------- chrome (masthead, colophon) ---------------- */
function applyChrome() {
  document.documentElement.lang = prefs.lang;
  document.querySelector('[data-nav="atlas"]').textContent = t("nav.atlas");
  document.querySelector('[data-nav="cellar"]').textContent = t("nav.cellar");
  document.querySelector(".nav-menu__label").textContent = t("nav.menu");
  document.querySelector('[data-nav="prefs"]').setAttribute("title", t("nav.prefs"));
  document.querySelector(".masthead__sub").textContent = t("brand.sub");
  document.getElementById("colophonText").innerHTML = t("colophon");
}

/* ---------------- router ---------------- */
const view = document.getElementById("view");
window.addEventListener("hashchange", route);
document.addEventListener("DOMContentLoaded", () => { applyChrome(); saveMenu(); route(); });

function route() {
  const hash = location.hash || "#/";
  const [path, arg] = hash.replace(/^#\//, "").split("/");
  document.querySelectorAll("[data-nav]").forEach(a => a.classList.toggle("is-active", a.dataset.nav === path));
  document.body.classList.toggle("in-cellar", path === "cellar");
  window.scrollTo(0, 0);
  if (path === "atlas") renderAtlas();
  else if (path === "recipe" && recipeById[arg]) renderRecipe(recipeById[arg]);
  else if (path === "menu") renderMenu();
  else if (path === "cellar") renderCellar();
  else if (path === "prefs") renderPrefs();
  else renderCover();
}

/* ---------------- cover ---------------- */
function renderCover() {
  const countries = CUISINES.length;
  const tonight = RECIPES.length ? RECIPES[Math.floor(Math.random() * RECIPES.length)] : null;
  const sorted = CUISINES.slice().sort((a, b) => cuisineLabel(a).localeCompare(cuisineLabel(b)));
  const chapters = sorted.map((c, i) => {
    const n = RECIPES.filter(r => r.cuisine === c).length;
    return `<a class="toc__item rise" style="animation-delay:${Math.min(0.03 * i, 0.8)}s" href="#/atlas" data-cuisine="${esc(c)}">
      <span class="toc__num">${String(i + 1).padStart(2, "0")}</span>
      <span><b>${esc(cuisineLabel(c))}</b><span>${n} ${n === 1 ? t("cover.recipe") : t("cover.recipes")}</span></span>
    </a>`;
  }).join("");

  view.innerHTML = `
  <div class="cover wrap">
    <div class="cover__frame rise">
      <div class="cover__city">${t("cover.kicker")}</div>
      <h1>Terroir <span class="amp">&amp;</span> Table</h1>
      <p class="cover__tag">${t("cover.tagline", { n: countries })}</p>
      <div class="cover__stats">
        <div class="cover__stat"><b>${RECIPES.length}</b><span>${t("cover.stat.recipes")}</span></div>
        <div class="cover__stat"><b>${countries}</b><span>${t("cover.stat.cultures")}</span></div>
        <div class="cover__stat"><b>${WINES.length}</b><span>${t("cover.stat.bins")}</span></div>
        <div class="cover__stat"><b>∞</b><span>${t("cover.stat.menus")}</span></div>
      </div>
      <div class="cover__actions">
        <a class="btn" href="#/atlas">${t("cover.openAtlas")}</a>
        <a class="btn btn--wine" href="#/cellar">${t("cover.cellar")}</a>
      </div>
    </div>

    ${tonight ? `<div class="cover__tonight rise" style="animation-delay:.15s">
      <span class="die">❧</span>
      <div>
        <div class="kicker" style="margin-bottom:.2rem">${t("cover.tonight")}</div>
        <h3><a href="#/recipe/${esc(tonight.id)}" style="color:inherit;text-decoration:none">${esc(locName(tonight))}</a></h3>
        <p>${esc(cuisineLabel(tonight.cuisine))} · ${esc(tonight.region)} — ${esc(loc(tonight).description)}</p>
      </div>
      <button class="btn btn--ghost btn--small" data-action="reroll">${t("cover.another")}</button>
    </div>` : ""}

    <div class="toc rise" style="animation-delay:.2s">
      <div class="ornarule">─────&nbsp;&nbsp;✦&nbsp;&nbsp;─────</div>
      <h2>${t("cover.toc")}</h2>
      <div class="toc__grid">${chapters}</div>
    </div>
  </div>`;
}

/* ---------------- atlas ---------------- */
function matchesAtlas(r) {
  const s = atlasState;
  if (s.q) {
    const d = NL.recipes[r.id] || {};
    const hay = (r.name + " " + (d.name || "") + " " + (r.localName || "") + " " + r.cuisine + " " + cuisineLabel(r.cuisine) + " " + r.region + " " +
      r.description + " " + (d.description || "") + " " + r.ingredients.map(i => i.item).join(" ")).toLowerCase();
    if (!hay.includes(s.q.toLowerCase())) return false;
  }
  if (s.cuisines.length && !s.cuisines.includes(r.cuisine)) return false;
  if (s.tastes.length && !s.tastes.every(x => (r.tastes || []).includes(x))) return false;
  if (s.ingredients.length && !s.ingredients.some(k => (r.keyIngredients || []).includes(k))) return false;
  if (s.courses.length && !s.courses.includes(r.course)) return false;
  if (s.diets.length && !s.diets.every(d => (r.dietary || []).includes(d))) return false;
  const enr = ENRICH[r.id] || {};
  if (s.methods.length && !s.methods.includes(enr.method)) return false;
  if (s.kamado && !enr.kamado) return false;
  if (s.time && r.totalMinutes > s.time) return false;
  if (s.difficulty && r.difficulty !== s.difficulty) return false;
  return true;
}

const TIME_STEPS = () => [
  { v: 0, label: t("time.any") }, { v: 45, label: t("time.45") }, { v: 75, label: t("time.75") },
  { v: 120, label: t("time.120") }, { v: 240, label: t("time.240") }
];

function sortResults(results) {
  const s = atlasState;
  results.sort((a, b) =>
    s.sort === "time" ? a.totalMinutes - b.totalMinutes :
    s.sort === "cuisine" ? (cuisineLabel(a.cuisine) + locName(a)).localeCompare(cuisineLabel(b.cuisine) + locName(b)) :
    locName(a).localeCompare(locName(b)));
  return results;
}

function renderAtlas() {
  const s = atlasState;
  const results = sortResults(RECIPES.filter(matchesAtlas));
  const anyFilter = s.q || s.cuisines.length || s.tastes.length || s.ingredients.length || s.courses.length || s.diets.length || s.time || s.difficulty;
  const cuisinesSorted = CUISINES.slice().sort((a, b) => cuisineLabel(a).localeCompare(cuisineLabel(b)));
  /* on narrow screens the rail sits above the results, so groups start closed */
  const railWide = window.matchMedia("(min-width: 901px)").matches;

  view.innerHTML = `
  <div class="atlas">
    <aside class="rail rise">
      <h2>${t("atlas.find")}</h2>
      <input type="search" id="atlasSearch" placeholder="${t("atlas.search")}" value="${esc(s.q)}">
      <details class="rail__group" ${s.tastes.length ? "open" : ""}>
        <summary>${t("atlas.taste")}</summary>
        <div class="rail__chips">${TASTES.map(x => chip("tastes", x, s.tastes.includes(x), tasteLabel(x), tasteDot(x))).join("")}</div>
      </details>
      <details class="rail__group" ${s.ingredients.length ? "open" : ""}>
        <summary>${t("atlas.ingredient")}</summary>
        <div class="rail__chips">${TOP_INGREDIENTS.map(k => chip("ingredients", k, s.ingredients.includes(k), ingLabel(k))).join("")}</div>
      </details>
      <details class="rail__group" ${s.courses.length || s.diets.length ? "open" : ""}>
        <summary>${t("atlas.courseDiet")}</summary>
        <div class="rail__chips">${COURSES.map(c => chip("courses", c, s.courses.includes(c), courseTag(c))).join("")}</div>
        <div class="rail__chips" style="margin-top:.6rem">${DIETS.map(d => chip("diets", d, s.diets.includes(d), dietLabel(d))).join("")}</div>
      </details>
      <details class="rail__group" ${s.methods.length || s.kamado ? "open" : ""}>
        <summary>${t("atlas.fire")}</summary>
        <div class="rail__chips">${METHODS.map(m => chip("methods", m, s.methods.includes(m), methodLabel(m))).join("")}</div>
        <div class="rail__chips" style="margin-top:.6rem">
          <button class="chip chip--kamado ${s.kamado ? "is-on" : ""}" data-filter="kamado" data-value="1">${t("atlas.kamadoChip")}</button>
        </div>
      </details>
      <details class="rail__group" ${s.time || s.difficulty ? "open" : ""}>
        <summary>${t("atlas.timeEffort")}</summary>
        <select id="atlasTime">${TIME_STEPS().map(x => `<option value="${x.v}" ${s.time === x.v ? "selected" : ""}>${x.label}</option>`).join("")}</select>
        <select id="atlasDiff">
          <option value="">${t("atlas.anyDiff")}</option>
          ${["approachable","intermediate","ambitious"].map(d => `<option value="${d}" ${s.difficulty === d ? "selected" : ""}>${diffLabel(d)}</option>`).join("")}
        </select>
      </details>
      <details class="rail__group" ${railWide || s.cuisines.length ? "open" : ""}>
        <summary>${t("atlas.culture")}</summary>
        <div class="rail__chips">${cuisinesSorted.map(c => chip("cuisines", c, s.cuisines.includes(c), cuisineLabel(c))).join("")}</div>
      </details>
      ${anyFilter ? `<button class="btn btn--ghost btn--small rail__clear" data-action="clear-atlas">${t("atlas.clear")}</button>` : ""}
    </aside>

    <section>
      <div class="atlas__head rise">
        <h1>${t("atlas.title")}</h1>
        <div class="atlas__count">${t("atlas.count", { a: results.length, b: RECIPES.length })}
          · <select id="atlasSort" style="border:none;background:transparent;font:inherit;color:var(--terra-deep)">
            <option value="name" ${s.sort === "name" ? "selected" : ""}>${t("atlas.sortAZ")}</option>
            <option value="time" ${s.sort === "time" ? "selected" : ""}>${t("atlas.sortTime")}</option>
            <option value="cuisine" ${s.sort === "cuisine" ? "selected" : ""}>${t("atlas.sortCulture")}</option>
          </select></div>
      </div>
      ${results.length ? `<div class="cards">${results.map(cardHtml).join("")}</div>`
        : `<div class="empty">${t("atlas.empty")}</div>`}
    </section>
  </div>`;

  const search = document.getElementById("atlasSearch");
  search.addEventListener("input", () => { s.q = search.value; refreshAtlasCards(); });
  document.getElementById("atlasTime").addEventListener("change", e => { s.time = +e.target.value; renderAtlas(); });
  document.getElementById("atlasDiff").addEventListener("change", e => { s.difficulty = e.target.value; renderAtlas(); });
  document.getElementById("atlasSort").addEventListener("change", e => { s.sort = e.target.value; renderAtlas(); });
}

function refreshAtlasCards() {
  const results = sortResults(RECIPES.filter(matchesAtlas));
  const section = view.querySelector(".atlas section");
  const countEl = section.querySelector(".atlas__count");
  const sortSel = countEl.querySelector("select").outerHTML;
  countEl.innerHTML = t("atlas.count", { a: results.length, b: RECIPES.length }) + " · " + sortSel;
  countEl.querySelector("select").addEventListener("change", e => { atlasState.sort = e.target.value; renderAtlas(); });
  const old = section.querySelector(".cards, .empty");
  const div = document.createElement("div");
  div.innerHTML = results.length ? `<div class="cards">${results.map(cardHtml).join("")}</div>`
    : `<div class="empty">${t("atlas.empty")}</div>`;
  old.replaceWith(div.firstElementChild);
}

function cardHtml(r, i) {
  const L = loc(r);
  return `<article class="card rise" style="animation-delay:${Math.min(i * 0.025, 0.5)}s" data-goto="#/recipe/${esc(r.id)}" tabindex="0" role="link" aria-label="${esc(L.name)}">
    <div class="card__top">
      <span class="card__cuisine">${esc(cuisineLabel(r.cuisine))} · ${esc(r.region)}</span>
      <span class="card__course card__course--${esc(r.course)}">${esc(courseTag(r.course))}</span>
    </div>
    <h3>${esc(L.name)}</h3>
    ${r.localName && r.localName !== L.name ? `<p class="card__local">${esc(r.localName)}</p>` : ""}
    <p class="card__desc">${esc(L.description)}</p>
    <div class="card__tastes">${(r.tastes || []).map(x => `<span class="tag">${tasteDot(x)}${esc(tasteLabel(x))}</span>`).join("")}</div>
    <div class="card__meta">
      <span>⏱ ${fmtTime(r.totalMinutes)}</span>
      <span>${DIFF_GLYPH[r.difficulty] || ""} ${esc(diffLabel(r.difficulty))}</span>
      <span>🍷 ${(r.wines || []).map(w => wineById[w.id] ? wineById[w.id].name.split("(")[0].trim() : "").filter(Boolean)[0] || ""}</span>
      ${ENRICH[r.id] && ENRICH[r.id].kamado ? `<span class="card__kamado">▲ kamado</span>` : ""}
    </div>
  </article>`;
}

/* ---------------- recipe ---------------- */
function kamadoHtml(k) {
  const KL = (isNL() ? k.nl : k.en) || k.en;
  return `<div class="kamado">
    <div class="kamado__head">
      <h2><span class="kamado__flame">▲</span> ${t("kamado.title")}</h2>
      <div class="kamado__badges">
        <span>${esc(setupLabel(k.setup))}</span>
        <span>${esc(k.temp)}</span>
        <span class="kamado__fit">${t("kamado.fit." + k.fit)}</span>
      </div>
    </div>
    <p class="kamado__intro">${esc(KL.intro)}</p>
    <ol class="kamado__steps">${KL.steps.map(s => `<li><div>${esc(s)}</div></li>`).join("")}</ol>
  </div>`;
}

function renderRecipe(r) {
  const L = loc(r);
  const enr = ENRICH[r.id] || {};
  const persons = recipeServings[r.id] || prefs.persons;
  const inMenu = menu.ids.includes(r.id);
  const pours = (r.wines || []).map((w, i) => {
    const wine = wineById[w.id];
    if (!wine) return "";
    const WL = locWine(wine);
    return `<div class="pour">
      <span class="pour__type">${esc(wtypeLabel(wine.type))}</span>
      <h3>${esc(wine.name)}</h3>
      <div class="pour__origin">${esc(wine.region)}, ${esc(cuisineLabel(wine.country))} · ${esc(wine.grapes.join(", "))} · ${esc(wine.priceBand)}</div>
      <p class="pour__note">“${esc(L.wineNote(i))}”</p>
      <p class="pour__note" style="font-style:normal;font-size:.85rem;margin-top:.5rem">${esc(WL.profile)}</p>
    </div>`;
  }).join("");

  view.innerHTML = `
  <div class="recipe wrap">
    <a class="recipe__back" href="#/atlas">${t("recipe.back")}</a>
    <header class="recipe__head rise">
      <p class="kicker">${esc(cuisineLabel(r.cuisine))} — ${esc(r.region)} · ${esc(courseLabel(r.course))}</p>
      <h1>${esc(L.name)}</h1>
      ${r.localName && r.localName !== L.name ? `<p class="recipe__local">${esc(r.localName)}</p>` : ""}
      <p class="recipe__story">${esc(L.story)} ${esc(L.description)}</p>
      <div class="recipe__meta">
        <span>${t("recipe.active")} <b>${fmtTime(r.activeMinutes)}</b></span>
        <span>${t("recipe.total")} <b>${fmtTime(r.totalMinutes)}</b></span>
        <span>${t("recipe.effort")} <b>${esc(diffLabel(r.difficulty))}</b></span>
        ${enr.method ? `<span><b>${esc(methodLabel(enr.method))}</b></span>` : ""}
        <span>${(r.tastes || []).map(x => `<span class="tag">${tasteDot(x)}${esc(tasteLabel(x))}</span>`).join(" ")}</span>
        ${(r.dietary || []).length ? `<span>${r.dietary.map(d => `<span class="tag">${esc(dietLabel(d))}</span>`).join(" ")}</span>` : ""}
        ${L.timeNote ? `<span class="recipe__timenote">❧ ${esc(L.timeNote)}</span>` : ""}
      </div>
    </header>

    <div class="spread">
      <aside class="ingredients rise" style="animation-delay:.08s">
        <h2>${t("recipe.ingredients")}</h2>
        <div class="serves">
          <span class="serves__label">${t("recipe.for")}</span>
          <span class="stepper">
            <button data-action="serves" data-delta="-1" aria-label="−">−</button>
            <b id="servesN">${persons}</b>
            <button data-action="serves" data-delta="1" aria-label="+">+</button>
          </span>
          <span class="serves__label">${t("recipe.persons")}</span>
        </div>
        <ul id="ingList">${ingredientsHtml(r, persons)}</ul>
      </aside>

      <section class="method rise" style="animation-delay:.14s">
        <h2>${t("recipe.method")}</h2>
        <ol>${locSteps(r).map(st => `<li><div>${esc(st)}</div></li>`).join("")}</ol>
        ${L.tip ? `<div class="tipbox"><b>${t("recipe.kitchen")}</b>${esc(L.tip)}</div>` : ""}
        ${enr.kamado ? kamadoHtml(enr.kamado) : ""}
        <div class="pairings">
          <h2>${t("recipe.cellar")}</h2>
          <div class="pairings__grid">${pours}</div>
        </div>
        <div class="recipe__actions">
          <button class="btn" data-action="menu-toggle" data-id="${esc(r.id)}">${inMenu ? t("recipe.onMenu") : t("recipe.add")}</button>
          <a class="btn btn--ghost" href="#/menu">${t("recipe.goMenu")}</a>
        </div>
      </section>
    </div>
  </div>`;
}

function ingredientsHtml(r, persons) {
  return loc(r).ingredients.map(i => `<li><span class="qty">${esc(scaledQty(i, persons, r.serves))}</span>
    <span>${esc(i.item)}${i.note ? ` <span class="ing-note">— ${esc(i.note)}</span>` : ""}</span></li>`).join("");
}

/* ---------------- cellar ---------------- */
function renderCellar() {
  const s = cellarState;
  const types = [...new Set(WINES.map(w => w.type))];
  const countries = [...new Set(WINES.map(w => w.country))].sort((a, b) => cuisineLabel(a).localeCompare(cuisineLabel(b)));
  const list = WINES.filter(w =>
    (!s.types.length || s.types.includes(w.type)) &&
    (!s.countries.length || s.countries.includes(w.country)) &&
    (!s.bodies.length || s.bodies.includes(w.body)));

  view.innerHTML = `
  <div class="cellar-shell"><div class="cellar wrap">
    <p class="kicker rise">${t("cellar.kicker")}</p>
    <h1 class="rise">${t("cellar.title")}</h1>
    <p class="cellar__intro rise" style="animation-delay:.06s">${t("cellar.intro", { n: WINES.length })}</p>
    <div class="cellar__filters rise" style="animation-delay:.1s">
      ${types.map(x => chip("types", x, s.types.includes(x), wtypeLabel(x))).join("")}
      <span style="width:1rem"></span>
      ${["light","medium","full"].map(b => chip("bodies", b, s.bodies.includes(b), bodyLabel(b))).join("")}
    </div>
    <div class="cellar__filters rise" style="animation-delay:.12s">
      ${countries.map(c => chip("countries", c, s.countries.includes(c), cuisineLabel(c))).join("")}
    </div>
    <div class="bins">${list.map(binHtml).join("") || `<div class="empty" style="color:var(--cellar-soft)">${t("cellar.empty")}</div>`}</div>
  </div></div>`;
}

function binHtml(w, i) {
  const WL = locWine(w);
  const served = RECIPES.filter(r => (r.wines || []).some(x => x.id === w.id));
  return `<article class="bin rise" style="animation-delay:${Math.min(i * 0.02, 0.4)}s">
    <div class="bin__row"><h3>${esc(w.name)}</h3><span class="bin__type bin__type--${esc(w.type)}">${esc(wtypeLabel(w.type))}</span></div>
    <div class="bin__origin">${esc(w.region)} · ${esc(cuisineLabel(w.country))} · ${esc(w.grapes.join(", "))}</div>
    <p class="bin__profile">${esc(WL.profile)}</p>
    <p class="bin__notes">${esc(WL.notes)}</p>
    <div class="bin__meta"><span>${t("cellar.body")} <b>${esc(bodyLabel(w.body))}</b></span><span>${t("cellar.serve")} <b>${esc(WL.servingTemp)}</b></span><span>${t("cellar.price")} <b>${esc(w.priceBand)}</b></span></div>
    ${served.length ? `<details><summary>${served.length === 1 ? t("cellar.pairs1") : t("cellar.pairsN", { n: served.length })}</summary>
      <p class="bin__pairs">${served.map(r => `<a href="#/recipe/${esc(r.id)}">${esc(locName(r))}</a>`).join(" · ")}</p></details>` : ""}
  </article>`;
}

/* ---------------- menu composer ---------------- */
const composePrefs = { cuisine: "", tastes: [], diets: [], time: 0, courses: 3 };

function composeMenu() {
  const p = composePrefs;
  const basePool = RECIPES.filter(r =>
    (!p.diets.length || p.diets.every(d => (r.dietary || []).includes(d))) &&
    (!p.time || r.totalMinutes <= p.time));
  if (!basePool.length) return null;

  const wanted = p.courses === 4 ? ["main", "starter", "side", "dessert"] : ["main", "starter", "dessert"];
  const picked = [];
  const tasteScore = r => (r.tastes || []).filter(x => p.tastes.includes(x)).length * 2;

  for (const course of wanted) {
    const open = basePool.filter(r => r.course === course && !picked.includes(r));
    let cands = p.cuisine ? open.filter(r => r.cuisine === p.cuisine) : open;
    if (!cands.length && p.cuisine) cands = open.filter(r => GROUPS[r.cuisine] && GROUPS[r.cuisine] === GROUPS[p.cuisine]);
    if (!cands.length) cands = open;
    if (!cands.length) continue;
    const main = picked.find(x => x.course === "main");
    const choice = pickWeighted(cands, r => {
      let s = tasteScore(r);
      if (main) {
        if (r.cuisine === main.cuisine) s += 2.5;
        else if (GROUPS[r.cuisine] && GROUPS[r.cuisine] === GROUPS[main.cuisine]) s += 1.2;
        const overlap = (r.keyIngredients || []).filter(k => picked.some(x => (x.keyIngredients || []).includes(k))).length;
        s -= overlap * 1.5;
      }
      return s;
    });
    if (choice) picked.push(choice);
  }
  const order = { starter: 0, main: 1, side: 2, dessert: 3 };
  picked.sort((a, b) => order[a.course] - order[b.course]);
  return picked;
}

function renderMenu() {
  const p = composePrefs;
  const items = menu.ids.map(id => recipeById[id]).filter(Boolean);
  const byCourse = COURSES.map(c => ({ course: c, items: items.filter(r => r.course === c) })).filter(g => g.items.length);
  const cuisinesSorted = CUISINES.slice().sort((a, b) => cuisineLabel(a).localeCompare(cuisineLabel(b)));

  view.innerHTML = `
  <div class="menu-view wrap">
    <p class="kicker rise">${t("menu.kicker")}</p>
    <h1 class="rise">${t("menu.title")}</h1>

    <div class="menu-grid">
      <div>
        <aside class="composer rise" style="animation-delay:.05s">
          <h2>${t("menu.compose")}</h2>
          <div class="field">
            <label class="flabel" for="cmpCuisine">${t("menu.where")}</label>
            <select id="cmpCuisine"><option value="">${t("menu.anywhere")}</option>
              ${cuisinesSorted.map(c => `<option value="${esc(c)}" ${p.cuisine === c ? "selected" : ""}>${esc(cuisineLabel(c))}</option>`).join("")}</select>
          </div>
          <div class="field">
            <label class="flabel">${t("menu.moods")}</label>
            <div class="rail__chips">${TASTES.map(x => chip("cmp-tastes", x, p.tastes.includes(x), tasteLabel(x), tasteDot(x))).join("")}</div>
          </div>
          <div class="field">
            <label class="flabel">${t("menu.needs")}</label>
            <div class="rail__chips">${DIETS.map(d => chip("cmp-diets", d, p.diets.includes(d), dietLabel(d))).join("")}</div>
          </div>
          <div class="field">
            <label class="flabel" for="cmpTime">${t("menu.timePerDish")}</label>
            <select id="cmpTime">${TIME_STEPS().map(x => `<option value="${x.v}" ${p.time === x.v ? "selected" : ""}>${x.label}</option>`).join("")}</select>
          </div>
          <div class="field">
            <label class="flabel" for="cmpCourses">${t("menu.shape")}</label>
            <select id="cmpCourses">
              <option value="3" ${p.courses === 3 ? "selected" : ""}>${t("menu.three")}</option>
              <option value="4" ${p.courses === 4 ? "selected" : ""}>${t("menu.four")}</option>
            </select>
          </div>
          <div class="composer__actions">
            <button class="btn" data-action="compose">${t("menu.composeBtn")}</button>
            ${items.length ? `<button class="btn btn--ghost" data-action="compose">${t("menu.shuffle")}</button>` : ""}
          </div>
          <p style="font-style:italic;color:var(--ink-soft);font-size:.88rem;margin:.9rem 0 0">${t("menu.hint")}</p>
        </aside>

        <aside class="composer rise" style="animation-delay:.08s;margin-top:1.4rem">
          <h2>${t("saved.title")}</h2>
          ${items.length ? `<div class="savebar">
            <input type="text" id="saveName" placeholder="${t("saved.placeholder")}" maxlength="60">
            <button class="btn btn--small" data-action="lib-save">${t("saved.save")}</button>
          </div>` : ""}
          ${menuLib.length ? `<ul class="liblist">${menuLib.map((m, i) => `
            <li>
              <div class="liblist__main">
                <b>${esc(m.name)}</b>
                <span>${t("saved.meta", { d: m.ids.length, p: m.persons })}</span>
              </div>
              <div class="liblist__actions">
                <button class="iconbtn" data-action="lib-move" data-i="${i}" data-dir="-1" title="↑" ${i === 0 ? "disabled" : ""}>↑</button>
                <button class="iconbtn" data-action="lib-move" data-i="${i}" data-dir="1" title="↓" ${i === menuLib.length - 1 ? "disabled" : ""}>↓</button>
                <button class="iconbtn iconbtn--label" data-action="lib-load" data-i="${i}">${t("saved.load")}</button>
                <button class="iconbtn" data-action="lib-rename" data-i="${i}" title="${t("saved.rename")}">✎</button>
                <button class="iconbtn" data-action="lib-delete" data-i="${i}" title="${t("saved.delete")}">✕</button>
              </div>
            </li>`).join("")}</ul>`
          : `<p style="font-style:italic;color:var(--ink-soft);font-size:.88rem;margin:0">${t("saved.empty")}</p>`}
        </aside>
      </div>

      <section>
        <div class="menucard rise" style="animation-delay:.1s" id="menucard">
          <div class="menucard__head">
            <p class="kicker">${t("menu.presents")}</p>
            <h2>${t("menu.evening")}</h2>
            <div class="menucard__persons no-print" style="display:flex;justify-content:center;align-items:center;gap:.9rem">
              <span>${t("menu.for")}</span>
              <span class="stepper">
                <button data-action="persons" data-delta="-1">−</button><b>${menu.persons}</b><button data-action="persons" data-delta="1">+</button>
              </span>
              <span>${t("menu.persons")}</span>
            </div>
            <div class="menucard__persons" style="display:none" data-print-only>${t("menu.for")} ${menu.persons} ${t("menu.persons")}</div>
          </div>
          ${items.length ? byCourse.map(g => `
            <div class="mcourse">
              <div class="mcourse__label">${esc(courseLabel(g.course))}</div>
              <div class="mcourse__rule">· · ❦ · ·</div>
              ${g.items.map((r, gi) => {
                const w0 = (r.wines || [])[0]; const wine = w0 && wineById[w0.id];
                return `<div class="mitem">
                  <h3><a href="#/recipe/${esc(r.id)}">${esc(locName(r))}</a></h3>
                  <p class="mitem__sub">${esc(cuisineLabel(r.cuisine))} · ${esc(r.region)} · ${fmtTime(r.totalMinutes)}</p>
                  ${wine ? `<p class="mitem__wine">🍷 ${esc(wine.name)}</p>` : ""}
                  <span class="no-print">
                    ${g.items.length > 1 ? `<button class="mitem__remove" data-action="dish-move" data-id="${esc(r.id)}" data-dir="-1" ${gi === 0 ? "disabled" : ""}>↑</button>
                    <button class="mitem__remove" data-action="dish-move" data-id="${esc(r.id)}" data-dir="1" ${gi === g.items.length - 1 ? "disabled" : ""}>↓</button>` : ""}
                    <button class="mitem__remove" data-action="menu-toggle" data-id="${esc(r.id)}">${t("menu.remove")}</button>
                  </span>
                </div>`;
              }).join("")}
            </div>`).join("")
          : `<p class="menu-empty">${t("menu.empty")}</p>`}
        </div>

        ${items.length ? auxHtml(items) : ""}
      </section>
    </div>
  </div>`;

  const cmpC = document.getElementById("cmpCuisine");
  cmpC.addEventListener("change", () => { p.cuisine = cmpC.value; });
  document.getElementById("cmpTime").addEventListener("change", e => { p.time = +e.target.value; });
  document.getElementById("cmpCourses").addEventListener("change", e => { p.courses = +e.target.value; });
}

function auxHtml(items) {
  /* shopping list: merge identical item+unit lines, scaled to persons */
  const merged = new Map();
  items.forEach(r => {
    const L = loc(r);
    L.ingredients.forEach(ing => {
      const key = ing.item.toLowerCase().trim() + "|" + (ing.unit || "");
      if (!merged.has(key)) merged.set(key, { item: ing.item, unit: ing.unit || "", qty: ing.qty == null ? null : 0, for: new Set() });
      const m = merged.get(key);
      if (ing.qty != null && m.qty != null) m.qty += ing.qty * menu.persons / (r.serves || 4);
      m.for.add(r.id);
    });
  });
  const lines = [...merged.values()].sort((a, b) => a.item.localeCompare(b.item));
  const shop = lines.map(l => {
    let qtyTxt;
    if (l.qty == null) qtyTxt = t("recipe.toTaste");
    else {
      let unit = l.unit, val = l.qty;
      if (unit === "g" && val >= 1000) { val /= 1000; unit = "kg"; }
      if (unit === "ml" && val >= 1000) { val /= 1000; unit = "l"; }
      qtyTxt = (fmtQty(val) + " " + unit).trim();
    }
    return `<label><input type="checkbox" data-action="shop-check"><span class="qty">${esc(qtyTxt)}</span><span>${esc(l.item)}${l.for.size > 1 ? ` <span class="ing-note" style="color:var(--ink-faint);font-style:italic">(${t("menu.xdishes", { n: l.for.size })})</span>` : ""}</span></label>`;
  }).join("");

  /* timeline */
  const sorted = items.slice().sort((a, b) => b.totalMinutes - a.totalMinutes);
  const tl = sorted.map(r => {
    const L = loc(r);
    return `<li><span class="tmark">T − ${fmtTime(r.totalMinutes)}</span>
    <span>${t("menu.begin")} <b>${esc(L.name)}</b> — ${fmtTime(r.activeMinutes)} ${t("menu.handsOn")}${L.timeNote ? ` · <i>${esc(L.timeNote)}</i>` : ""}</span></li>`;
  }).join("");

  /* wine list: dedupe across menu, course order */
  const order = { starter: 0, main: 1, side: 2, dessert: 3 };
  const seen = new Map();
  items.slice().sort((a, b) => order[a.course] - order[b.course]).forEach(r =>
    (r.wines || []).forEach((w, i) => {
      if (!wineById[w.id]) return;
      if (!seen.has(w.id)) seen.set(w.id, { wine: wineById[w.id], notes: [], courses: new Set() });
      const e = seen.get(w.id);
      e.notes.push({ dish: locName(r), note: loc(r).wineNote(i) });
      e.courses.add(r.course);
    }));
  const winelist = [...seen.values()].map(e => {
    const WL = locWine(e.wine);
    const bottles = Math.max(1, Math.ceil(menu.persons * e.courses.size / 6));
    return `<div class="pour">
      <span class="pour__type">${esc(wtypeLabel(e.wine.type))}</span>
      <h3>${esc(e.wine.name)}</h3>
      <div class="pour__origin">${esc(e.wine.region)}, ${esc(cuisineLabel(e.wine.country))} · ${esc(e.wine.priceBand)} · ${t("cellar.serve").toLowerCase()} ${esc(WL.servingTemp)}</div>
      ${e.notes.map(n => `<p class="pour__note">${t("menu.with")} <b>${esc(n.dish)}</b> — ${esc(n.note)}</p>`).join("")}
      <p class="winelist__bottles">${bottles === 1 ? t("menu.bottle1", { p: menu.persons }) : t("menu.bottleN", { n: bottles, p: menu.persons })}</p>
    </div>`;
  }).join("");

  const totalActive = items.reduce((a, r) => a + r.activeMinutes, 0);
  const longest = sorted[0];

  return `<div class="aux">
    <section class="rise" style="animation-delay:.12s">
      <h2>${t("menu.shop")} <small>${t("menu.scaledFor", { n: menu.persons })}</small></h2>
      <div class="shoplist">${shop}</div>
    </section>
    <section class="rise" style="animation-delay:.16s">
      <h2>${t("menu.clock")}</h2>
      <p style="font-style:italic;color:var(--ink-soft);margin-top:0">${t("menu.clockIntro", { time: fmtTime(totalActive), dish: esc(longest ? locName(longest) : "—") })}</p>
      <ol class="timeline">${tl}</ol>
    </section>
    <section class="rise" style="animation-delay:.2s">
      <h2>${t("menu.wineList")}</h2>
      <div class="winelist">${winelist || ""}</div>
    </section>
    <div class="composer__actions no-print" style="margin-top:1.4rem">
      <button class="btn" data-action="print">${t("menu.print")}</button>
      <button class="btn btn--ghost" data-action="clear-menu">${t("menu.clear")}</button>
    </div>
  </div>`;
}

/* ---------------- preferences ---------------- */
function renderPrefs() {
  view.innerHTML = `
  <div class="menu-view wrap" style="max-width:760px">
    <p class="kicker rise">${t("prefs.kicker")}</p>
    <h1 class="rise">${t("prefs.title")}</h1>
    <p class="rise" style="font-style:italic;color:var(--ink-soft)">${t("prefs.intro")}</p>

    <aside class="composer rise" style="animation-delay:.06s;margin-top:1.6rem">
      <div class="field">
        <label class="flabel">${t("prefs.language")}</label>
        <div class="rail__chips">
          <button class="chip ${prefs.lang === "en" ? "is-on" : ""}" data-action="set-lang" data-lang="en">${t("prefs.en")}</button>
          <button class="chip ${prefs.lang === "nl" ? "is-on" : ""}" data-action="set-lang" data-lang="nl">${t("prefs.nl")}</button>
        </div>
      </div>
      <div class="field" style="margin-bottom:.4rem">
        <label class="flabel">${t("prefs.persons")}</label>
        <span class="stepper">
          <button data-action="pref-persons" data-delta="-1">−</button>
          <b>${prefs.persons}</b>
          <button data-action="pref-persons" data-delta="1">+</button>
        </span>
        <p style="font-style:italic;color:var(--ink-soft);font-size:.88rem;margin:.7rem 0 0">${t("prefs.personsHelp")}</p>
      </div>
    </aside>
  </div>`;
}

/* ---------------- global events ---------------- */
document.addEventListener("click", e => {
  const goto = e.target.closest("[data-goto]");
  if (goto) { location.hash = goto.dataset.goto; return; }

  const tocItem = e.target.closest(".toc__item");
  if (tocItem) {
    e.preventDefault();
    Object.assign(atlasState, { q: "", cuisines: [tocItem.dataset.cuisine], tastes: [], ingredients: [], courses: [], diets: [], methods: [], kamado: false, time: 0, difficulty: "" });
    location.hash = "#/atlas";
    if (location.hash === "#/atlas") renderAtlas();
    return;
  }

  const chipEl = e.target.closest(".chip[data-filter]");
  if (chipEl) {
    const g = chipEl.dataset.filter, v = chipEl.dataset.value;
    const toggle = arr => { const i = arr.indexOf(v); i >= 0 ? arr.splice(i, 1) : arr.push(v); };
    if (g === "kamado") { atlasState.kamado = !atlasState.kamado; renderAtlas(); }
    else if (g in atlasState) { toggle(atlasState[g]); renderAtlas(); }
    else if (g === "cmp-tastes") { toggle(composePrefs.tastes); chipEl.classList.toggle("is-on"); }
    else if (g === "cmp-diets") { toggle(composePrefs.diets); chipEl.classList.toggle("is-on"); }
    else if (g in cellarState) { toggle(cellarState[g]); renderCellar(); }
    return;
  }

  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;

  if (action === "reroll") renderCover();

  if (action === "clear-atlas") {
    Object.assign(atlasState, { q: "", cuisines: [], tastes: [], ingredients: [], courses: [], diets: [], methods: [], kamado: false, time: 0, difficulty: "" });
    renderAtlas();
  }

  if (action === "serves") {
    const id = location.hash.split("/")[2];
    const r = recipeById[id]; if (!r) return;
    const cur = recipeServings[id] || prefs.persons;
    const next = clampPersons(cur + (+btn.dataset.delta));
    recipeServings[id] = next;
    document.getElementById("servesN").textContent = next;
    document.getElementById("ingList").innerHTML = ingredientsHtml(r, next);
  }

  if (action === "menu-toggle") {
    const id = btn.dataset.id;
    const i = menu.ids.indexOf(id);
    i >= 0 ? menu.ids.splice(i, 1) : menu.ids.push(id);
    saveMenu();
    const path = (location.hash || "#/").split("/")[1];
    if (path === "menu") renderMenu();
    else if (path === "recipe") renderRecipe(recipeById[id]);
  }

  if (action === "dish-move") {
    const id = btn.dataset.id, dir = +btn.dataset.dir;
    const r = recipeById[id]; if (!r) return;
    const courseIds = menu.ids.filter(x => recipeById[x] && recipeById[x].course === r.course);
    const pos = courseIds.indexOf(id);
    const swapWith = courseIds[pos + dir];
    if (!swapWith) return;
    const a = menu.ids.indexOf(id), b = menu.ids.indexOf(swapWith);
    [menu.ids[a], menu.ids[b]] = [menu.ids[b], menu.ids[a]];
    saveMenu(); renderMenu();
  }

  if (action === "persons") {
    menu.persons = clampPersons(menu.persons + (+btn.dataset.delta));
    saveMenu(); renderMenu();
  }

  if (action === "compose") {
    const picked = composeMenu();
    if (!picked || !picked.length) { alert(t("menu.alert")); return; }
    menu.ids = picked.map(r => r.id);
    saveMenu(); renderMenu();
    document.getElementById("menucard").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (action === "clear-menu") { menu.ids = []; saveMenu(); renderMenu(); }
  if (action === "print") window.print();

  /* ----- saved menu library ----- */
  if (action === "lib-save") {
    const input = document.getElementById("saveName");
    const name = (input.value || "").trim() || (isNL() ? "Menu zonder naam" : "Untitled menu");
    menuLib.unshift({ id: newId(), name, persons: menu.persons, ids: menu.ids.slice() });
    saveLib(); renderMenu();
  }
  if (action === "lib-load") {
    const m = menuLib[+btn.dataset.i]; if (!m) return;
    menu.ids = m.ids.filter(id => recipeById[id]);
    menu.persons = clampPersons(m.persons);
    saveMenu(); renderMenu();
    document.getElementById("menucard").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (action === "lib-rename") {
    const m = menuLib[+btn.dataset.i]; if (!m) return;
    const name = prompt(t("saved.renamePrompt"), m.name);
    if (name && name.trim()) { m.name = name.trim().slice(0, 60); saveLib(); renderMenu(); }
  }
  if (action === "lib-delete") {
    menuLib.splice(+btn.dataset.i, 1);
    saveLib(); renderMenu();
  }
  if (action === "lib-move") {
    const i = +btn.dataset.i, j = i + (+btn.dataset.dir);
    if (j < 0 || j >= menuLib.length) return;
    [menuLib[i], menuLib[j]] = [menuLib[j], menuLib[i]];
    saveLib(); renderMenu();
  }

  /* ----- preferences ----- */
  if (action === "set-lang") {
    prefs.lang = btn.dataset.lang === "nl" ? "nl" : "en";
    savePrefs(); applyChrome(); route();
  }
  if (action === "pref-persons") {
    prefs.persons = clampPersons(prefs.persons + (+btn.dataset.delta));
    savePrefs(); renderPrefs();
  }
});

document.addEventListener("change", e => {
  if (e.target.matches('[data-action="shop-check"]')) e.target.closest("label").classList.toggle("is-done", e.target.checked);
});

document.addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.matches(".card")) location.hash = e.target.dataset.goto;
  if (e.key === "Enter" && e.target.id === "saveName") {
    const b = document.querySelector('[data-action="lib-save"]'); if (b) b.click();
  }
});

})();
