import { readFileSync } from "node:fs";
const html = readFileSync("index.html", "utf8");
const js = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const used = new Set([...js.matchAll(/getElementById\(["']([\w-]+)["']\)/g)].map(m => m[1]));
const defined = new Set([...html.matchAll(/id="([\w-]+)"/g)].map(m => m[1]));
const missing = [...used].filter(x => !defined.has(x));
console.log("referenced ids:", used.size, "defined ids:", defined.size);
console.log(missing.length ? "MISSING: " + missing.join(", ") : "no missing ids");
const qs = [...js.matchAll(/querySelector(?:All)?\(["']#([\w-]+)/g)].map(m => m[1]);
const missQ = [...new Set(qs.filter(x => !defined.has(x)))];
console.log(missQ.length ? "MISSING via querySelector: " + missQ.join(", ") : "querySelector ids OK");
// SVG <use href="#..."> シンボル参照の検査
const uses = [...new Set([...html.matchAll(/href="#([\w-]+)"/g)].map(m => m[1]))];
const missU = uses.filter(x => !defined.has(x));
console.log(missU.length ? "MISSING svg symbol: " + missU.join(", ") : "svg symbol refs OK");
// CSS var 検査（ざっくり）: var(--x) で :root 未定義
const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
const varDefs = new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]));
const varUses = new Set([...css.matchAll(/var\((--[\w-]+)/g)].map(m => m[1]));
const missV = [...varUses].filter(v => !varDefs.has(v));
console.log(missV.length ? "MISSING css vars: " + missV.join(", ") : "css vars OK");
