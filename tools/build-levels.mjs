// tools/build-levels.mjs — levels-data.mjs を検証し、par を確定させた LEVELS ブロックを index.html に注入する
// 使い方: node tools/build-levels.mjs
import { pathToFileURL } from "node:url";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

const mod = await import(pathToFileURL(path.join(here, "levels-data.mjs")).href);
const LEVELS = mod.LEVELS;
const { solve } = await import(pathToFileURL(path.join(here, "solver.mjs")).href);

// par のキャッシュ（重い再計算を回避）。v 番号でソルバー改版管理
const CACHE_V = 5;   // v5: ダブルタイブレークで par 最小化 + 逆流配分リメイク
const cachePath = path.join(here, "par-cache.json");
const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, "utf8")) : {};

const results = [];
for (let i = 0; i < LEVELS.length; i++) {
  const lv = LEVELS[i];
  const sig = lv.rows.join("/");
  if (cache[sig] && cache[sig].v === CACHE_V && cache[sig].solvable) {
    results.push(cache[sig]);
    console.log(`L${String(i + 1).padStart(2)} (cache) par=${cache[sig].moves}`);
    continue;
  }
  const t0 = Date.now();
  const r = solve(lv);
  if (!r.solvable) { console.error(`L${i + 1} ${lv.t.ja}: UNSOLVABLE (${r.reason}) — 修正してください`); process.exit(1); }
  let par = r.moves, pushes = r.pushes;
  // 逆タイブレークでも解き、push同値なら手数の小さい方を par に
  try {
    const r2 = solve(lv, 8_000_000, false, false, "lo");
    if (r2.solvable && r2.pushes === pushes && r2.moves < par) par = r2.moves;
  } catch(e){}
  console.log(`L${String(i + 1).padStart(2)} solved in ${((Date.now() - t0) / 1000).toFixed(1)}s  pushes=${pushes} par=${par} states=${r.states}`);
  cache[sig] = { v: CACHE_V, solvable: true, moves: par, pushes };
  results.push(cache[sig]);
  writeFileSync(cachePath, JSON.stringify(cache));
}

const q = s => JSON.stringify(s);
const lines = LEVELS.map((lv, i) =>
  `  { par:${results[i].moves}, d:"${lv.d}", t:{ja:${q(lv.t.ja)},en:${q(lv.t.en)},zh:${q(lv.t.zh)}}, rows:[\n` +
  lv.rows.map(r => `    ${q(r)}`).join(",\n") + "\n  ] }"
).join(",\n");
const block = `const LEVELS = [\n${lines},\n];`;

const htmlPath = path.join(root, "index.html");
const html = readFileSync(htmlPath, "utf8");
const S = "/*== LEVELS START ==*/", E = "/*== LEVELS END ==*/";
const a = html.indexOf(S), b = html.indexOf(E);
if (a < 0 || b < 0) { console.error("マーカーが見つかりません"); process.exit(1); }
const out = html.slice(0, a + S.length) + "\n" + block + "\n" + html.slice(b);
writeFileSync(htmlPath, out);
console.log(`\nInjected ${LEVELS.length} levels (with verified par) into index.html`);
