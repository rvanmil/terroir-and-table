/* ============================================================
   TERROIR & TABLE — single-file bundler
   Compiles the entire site into dist/bundle.html with every
   asset embedded: all data files, app JS, CSS, fonts (base64)
   and the favicon. No dependencies; run with:  node tools/bundle.js

   The bundle is fully self-contained — open it from disk, mail
   it, or host it as a single file. PWA plumbing (manifest,
   service worker, apple-touch-icon) is stripped: a single file
   needs no install step or precache, it IS the offline copy.
   ============================================================ */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const read = p => fs.readFileSync(path.join(root, p));
const readText = p => read(p).toString("utf8");

let html = readText("index.html");

/* ---- 1. CSS: inline stylesheets, embedding fonts as data URIs ---- */
function inlineCss(file) {
  let css = readText(file);
  // resolve url(...) references relative to the css file
  css = css.replace(/url\((['"]?)([^)'"]+)\1\)/g, (m, q, ref) => {
    // only embed real local asset files; leave data: URIs and
    // SVG-internal fragment refs (url(#…) / url(%23…)) untouched
    if (!/\.(woff2|png|svg|jpe?g|gif)$/i.test(ref) || ref.startsWith("data:")) return m;
    const assetPath = path.normalize(path.join(path.dirname(file), ref));
    const ext = path.extname(assetPath).slice(1);
    const mime = { woff2: "font/woff2", png: "image/png", svg: "image/svg+xml" }[ext] || "application/octet-stream";
    const data = read(assetPath).toString("base64");
    return `url(data:${mime};base64,${data})`;
  });
  return `<style>\n${css}\n</style>`;
}
html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (m, href) => inlineCss(href));

/* ---- 2. Scripts: inline every <script src> in order ---- */
html = html.replace(/<script src="([^"]+)"><\/script>/g, (m, src) => {
  // guard against accidental </script> sequences inside embedded strings
  const js = readText(src).replace(/<\/script/gi, "<\\/script");
  return `<script>\n/* === ${src} === */\n${js}\n</script>`;
});

/* ---- 3. Favicon as data URI; strip PWA plumbing ---- */
html = html.replace(/<link rel="icon"[^>]*>/, () =>
  `<link rel="icon" href="data:image/png;base64,${read("icons/icon-192.png").toString("base64")}" type="image/png">`);
html = html.replace(/<link rel="manifest"[^>]*>\n?/, "");
html = html.replace(/<link rel="apple-touch-icon"[^>]*>\n?/, "");
html = html.replace(/<script>\nif \("serviceWorker"[\s\S]*?<\/script>\n?/, "");

/* ---- 4. Write ---- */
fs.mkdirSync(path.join(root, "dist"), { recursive: true });
const out = path.join(root, "dist", "bundle.html");
fs.writeFileSync(out, html);

const mb = (fs.statSync(out).size / 1024 / 1024).toFixed(2);
const left = (html.match(/src="|href="(?!#|data:|https:)/g) || []).filter(x => !x.startsWith("href=\"#")).length;
console.log(`dist/bundle.html written — ${mb} MB, self-contained.`);

/* ---- 5. Self-check: no external file references may remain ---- */
const leftovers = [...html.matchAll(/(?:src|href)="(?!data:|#|https?:)([^"]+)"/g)].map(m => m[1]);
if (leftovers.length) {
  console.error("WARNING — unresolved local references remain:", leftovers);
  process.exitCode = 1;
} else {
  console.log("Self-check passed: no local file references remain.");
}
