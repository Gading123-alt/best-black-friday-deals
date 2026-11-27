// FridayFinds — a Black Friday deal finder for make.fun's
// black-friday-deal-finder-01 (Node 22, standard library only).
//
// The site is plain static files in app/ (index.html, style.css, deals.js,
// app.js): no build step, no network loads, every deal links out to its
// store. This program hands the entry in: it copies app/ and screenshots/
// from beside this file into the output directory and writes
// dossier.json with the vendored make.fun library, exactly as the kit
// requires. Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Fail loudly instead of handing in a broken entry: the site must exist,
// and at least one screenshot must be present (the gate needs 3–4).
if (!existsSync(join(here, "app", "index.html"))) {
  throw new Error("app/index.html is missing — refusing to hand in an empty site");
}
const shotDir = join(here, "screenshots");
if (!existsSync(shotDir)) {
  throw new Error("screenshots/ is missing — the entry needs 3 or 4 screenshots");
}

mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
cpSync(shotDir, join(out, "screenshots"), { recursive: true });

const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(out, "dossier.json"), dossier);

console.log(`FridayFinds handed in to ${out} (${dossier.length} bytes of dossier).`);
