// tools/gen-level.mjs — 完成状態から逆向き pull を繰り返して「必ず解ける」高難易度面を生成する
// 使い方: node tools/gen-level.mjs [seed数]
import { solve } from "./solver.mjs";

// 土台となる壁（12x10、右端 c10 がゴール列 r1..r6）
const ROWS0 = [
 "############",
 "#         .#",
 "#     #   .#",
 "#   ##    .#",
 "#   #     .#",
 "#  #  ##  .#",
 "#         .#",
 "#          #",
 "#          #",
 "############"];
const rows = ROWS0.map(r => {
  if (r.length !== 12) throw new Error(`行長不正(${r.length}): ${JSON.stringify(r)}`);
  return r;
});
const H = rows.length, W = 12;
const idx = (r, c) => r * W + c;
const wall = new Uint8Array(H * W), goals = [];
for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) {
  const ch = rows[r][c], i = idx(r, c);
  if (ch === "#") wall[i] = 1;
  else if (ch === ".") goals.push(i);
}
console.log(`grid ${W}x${H}, goals=${goals.length}`);
const goalSet = new Set(goals);
const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const frozenAt = i => {
  if (goalSet.has(i)) return false;
  const r = i / W | 0, c = i % W;
  const n = r === 0 || wall[idx(r - 1, c)], s = r + 1 === H || wall[idx(r + 1, c)];
  const w = c === 0 || wall[idx(r, c - 1)], e = c + 1 === W || wall[idx(r, c + 1)];
  return (n || s) && (w || e);
};

function trySeed(seed, minPulls) {
  let rng = seed >>> 0;
  const rand = () => (rng = (rng * 1664525 + 1013904223) >>> 0) / 4294967296;
  let boxes = goals.slice();
  let player = idx(7, 10);
  let pulls = 0;
  let lastFrom = -1, lastTo = -1; // 直前 pull（往復防止）
  for (let step = 0; step < 8000 && pulls < 140; step++) {
    const bset = new Set(boxes);
    const cands = [];
    for (const [dr, dc] of DIRS) {
      const pr = player / W | 0, pc = player % W;
      const fr = pr + dr, fc = pc + dc, br = pr - dr, bc = pc - dc;
      if (fr < 0 || fr >= H || fc < 0 || fc >= W || br < 0 || br >= H || bc < 0 || bc >= W) continue;
      const b = idx(fr, fc), back = idx(br, bc);
      if (!bset.has(b)) continue;                       // 隣に箱
      if (wall[back] || bset.has(back)) continue;       // 後退先が壁/箱
      if (frozenAt(player)) continue;                   // 箱を角フリーズへ入れない
      if (lastFrom === player && lastTo === idx(fr, fc)) continue; // 直前 pull の取り消し禁止
      cands.push({ b, into: player, back });
    }
    if (cands.length && rand() < 0.8) {
      const mv = cands[(rand() * cands.length) | 0];
      boxes = boxes.map(x => x === mv.b ? mv.into : x);
      lastFrom = mv.into; lastTo = mv.b;
      player = mv.back;
      pulls++;
    } else {
      // ランダム歩行（ゴール列付近から離れる方向を好む）
      const pr = player / W | 0, pc = player % W;
      const moves = [];
      for (const [dr, dc] of DIRS) {
        const nr = pr + dr, nc = pc + dc;
        if (nr < 0 || nr >= H || nc < 0 || nc >= W) continue;
        const ni = idx(nr, nc);
        if (wall[ni] || bset.has(ni)) continue;
        moves.push(ni);
      }
      if (!moves.length) return null;
      player = moves[(rand() * moves.length) | 0];
    }
  }
  if (pulls < minPulls) return null;
  if (boxes.some(b => goalSet.has(b))) return null; // 箱がゴール上の定義崩れ防止
  const outRows = rows.map((row, ri) => {
    let s = "";
    for (let c = 0; c < W; c++) {
      const i = idx(ri, c);
      if (wall[i]) s += "#";
      else if (boxes.includes(i)) s += "$";
      else if (i === player) s += "@";
      else if (goalSet.has(i)) s += ".";
      else s += " ";
    }
    return s;
  });
  const onGoal = boxes.filter(b => goalSet.has(b)).length;
  if (onGoal > 1) return null;
  const t0 = Date.now();
  const r0 = solve({ t: { ja: "gen" }, rows: outRows }, 3_000_000);
  const dt = (Date.now() - t0) / 1000;
  if (!r0.solvable) return { fail: `A*: ${r0.reason}`, dt };
  return { rows: outRows, pushes: r0.pushes, par: r0.moves, states: r0.states, dt };
}

const SEEDS = Number(process.argv[2] || 12);
const minPulls = Number(process.argv[3] || 30);
let best = null;
for (let s = 1; s <= SEEDS; s++) {
  const r = trySeed(s * 7919 + 13, minPulls);
  if (!r) { console.log(`seed ${s}: ✗`); continue; }
  if (r.fail) { console.log(`seed ${s}: A*不通? ${r.fail} (${r.dt.toFixed(0)}s)`); continue; }
  console.log(`seed ${s}: pushes=${r.pushes} par=${r.par} states=${r.states} (${r.dt.toFixed(1)}s)`);
  if (r.pushes >= 25 && r.par >= 100 && (!best || r.pushes > best.pushes)) best = r;
  if (best && best.pushes >= 40) break;
}
if (best) {
  console.log("\n=== BEST ===");
  console.log(`pushes=${best.pushes} par=${best.par} states=${best.states}`);
  console.log("rows:");
  best.rows.forEach(r => console.log(JSON.stringify(r) + ","));
} else console.log("no acceptable level");
