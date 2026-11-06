// BoxFlow ソルバー（push最適 A* ＋ 壁考慮push距離×二部マッチング ヒューリスティック）
// 使い方: node tools/solver.mjs tools/levels-data.mjs
//   → 各レベルについて 可解/不通・push数・その解の実移動手数(par)・展開状態数 を出力

export function parseLevel(rows) {
  const H = rows.length, W = Math.max(...rows.map(r => r.length));
  if (rows.some(r => r.length !== W)) throw new Error(`行長不一致 (max=${W})`);
  const wall = new Uint8Array(H * W), goalSet = new Set();
  const boxes = []; let player = -1;
  for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) {
    const ch = rows[r][c]; const i = r * W + c;
    if (ch === "#") wall[i] = 1;
    else if (ch === ".") goalSet.add(i);
    else if (ch === "$") boxes.push(i);
    else if (ch === "@") { if (player >= 0) throw new Error("プレイヤー2人"); player = i; }
    else if (ch !== " ") throw new Error(`不正文字 '${ch}' @${r},${c}`);
  }
  if (boxes.length !== goalSet.size) throw new Error(`箱${boxes.length}≠ゴール${goalSet.size}`);
  if (player < 0) throw new Error("プレイヤーなし");
  boxes.sort((a, b) => a - b);
  return { H, W, wall, goalSet, boxes, player };
}

const INF = 1e8;
// 長方形（正方）最小コスト割当。O(N^3)。cost: N×N 平坦配列
function hungarian(cost, N) {
  const u = new Float64Array(N + 1), v = new Float64Array(N + 1);
  const p = new Int32Array(N + 1), way = new Int32Array(N + 1);
  for (let i = 1; i <= N; i++) {
    p[0] = i;
    let j0 = 0;
    const minv = new Float64Array(N + 1).fill(Infinity);
    const used = new Uint8Array(N + 1);
    do {
      used[j0] = 1;
      const i0 = p[j0]; let delta = Infinity, j1 = -1;
      for (let j = 1; j <= N; j++) if (!used[j]) {
        const cur = cost[(i0 - 1) * N + (j - 1)] - u[i0] - v[j];
        if (cur < minv[j]) { minv[j] = cur; way[j] = j0; }
        if (minv[j] < delta) { delta = minv[j]; j1 = j; }
      }
      for (let j = 0; j <= N; j++) {
        if (used[j]) { u[p[j]] += delta; v[j] -= delta; }
        else minv[j] -= delta;
      }
      j0 = j1;
    } while (p[j0] !== 0);
    do { const j1 = way[j0]; p[j0] = p[j1]; j0 = j1; } while (j0);
  }
  let res = 0;
  for (let j = 1; j <= N; j++) if (p[j]) res += cost[(p[j] - 1) * N + (j - 1)];
  return res;
}

export function solve(level, cap = 8_000_000, stats = false, noPrune = false, tieG = "hi") {
  const { H, W, wall, goalSet, boxes: SB, player: SP } = parseLevel(level.rows);
  const NW = H * W;
  const idx = (r, c) => r * W + c;
  const inB = (r, c) => r >= 0 && r < H && c >= 0 && c < W;
  const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  // ---- 各ゴールからの "push距離"（箱の存在を無視したBFS。下限として許容的） ----
  const goalArr = [...goalSet], N = goalArr.length;
  const pdist = []; // pdist[k][cell]
  for (let k = 0; k < N; k++) {
    const d = new Int32Array(NW).fill(-1);
    d[goalArr[k]] = 0;
    const q = [goalArr[k]]; let h = 0;
    while (h < q.length) {
      const x = q[h++];
      const r = x / W | 0, c = x % W;
      for (const [dr, dc] of DIRS) {
        const nr = r + dr, nc = c + dc;
        if (!inB(nr, nc)) continue;
        const nx = idx(nr, nc);
        if (d[nx] === -1 && !wall[nx]) { d[nx] = d[x] + 1; q.push(nx); }
      }
    }
    pdist.push(d);
  }
  // どのゴールにも押して到達できない箱 → 解なし
  for (const b of SB) if (pdist.every(d => d[b] === -1))
    return { solvable: false, reason: "unreachable box", states: 0 };

  // ---- h(箱配置) = 最小コスト割当（メモ化） ----
  const hCache = new Map();
  function hOf(bs) {
    const ck = bs.join(",");
    let h = hCache.get(ck);
    if (h !== undefined) return h;
    if (hCache.size > 1500000) hCache.clear();
    const cost = new Float64Array(N * N);
    let anyUnreachRow = false;
    for (let i = 0; i < N; i++) {
      let rowOK = false;
      for (let k = 0; k < N; k++) {
        const d = pdist[k][bs[i]];
        cost[i * N + k] = d === -1 ? INF : d;
        if (d !== -1) rowOK = true;
      }
      if (!rowOK) anyUnreachRow = true;
    }
    h = anyUnreachRow ? INF : hungarian(cost, N);
    hCache.set(ck, h);
    return h;
  }

  // ---- 到達領域（stamp方式、展開用/キー正規化用で分離） ----
  const seenE = new Int32Array(NW), seenK = new Int32Array(NW);
  let stampE = 0, stampK = 0;
  function region(bs, from, seenArr) {
    const boxSet = new Set(bs);
    const st = seenArr === seenE ? ++stampE : ++stampK;
    seenArr[from] = st;
    let min = from;
    const q = [from];
    while (q.length) {
      const x = q.pop();
      if (x < min) min = x;
      const r = x / W | 0, c = x % W;
      for (const [dr, dc] of DIRS) {
        const nr = r + dr, nc = c + dc;
        if (!inB(nr, nc)) continue;
        const nx = idx(nr, nc);
        if (seenArr[nx] !== st && !wall[nx] && !boxSet.has(nx)) { seenArr[nx] = st; q.push(nx); }
      }
    }
    return { min, st };
  }
  const keyOf = (bs, pl) => bs.join(",") + "|" + region(bs, pl, seenK).min;

  // ---- 枝刈り: 角フリーズ（壁2方向、ゴール上でない） ----
  const frozenAt = i => {
    if (goalSet.has(i)) return false;
    const r = i / W | 0, c = i % W;
    const n = wall[idx(r - 1, c)] || !inB(r - 1, c), s = wall[idx(r + 1, c)] || !inB(r + 1, c);
    const w = wall[idx(r, c - 1)] || !inB(r, c - 1), e = wall[idx(r, c + 1)] || !inB(r, c + 1);
    return (n || s) && (w || e);
  };
  // ---- 枝刈り: 2x2 箱クラスタ（うち1つでもゴール上でなければ永久凍結） ----
  function block2Dead(bs, boxSet, di) {
    const r = di / W | 0, c = di % W;
    for (const [dr, dc] of [[-1, -1], [-1, 0], [0, -1], [0, 0]]) {
      const r0 = r + dr, c0 = c + dc;
      if (r0 < 0 || r0 + 1 >= H || c0 < 0 || c0 + 1 >= W) continue;
      const a = idx(r0, c0), b2 = idx(r0, c0 + 1), d2 = idx(r0 + 1, c0), e2 = idx(r0 + 1, c0 + 1);
      if (boxSet.has(a) && boxSet.has(b2) && boxSet.has(d2) && boxSet.has(e2) &&
          !(goalSet.has(a) && goalSet.has(b2) && goalSet.has(d2) && goalSet.has(e2))) return true;
    }
    return false;
  }

  const goalTest = bs => bs.every(b => goalSet.has(b));
  if (goalTest(SB)) return { solvable: true, pushes: 0, moves: 0, states: 0 };
  if (!noPrune && SB.some(frozenAt)) return { solvable: false, reason: "initial frozen box", states: 0 };

  // ---- A*（二項ヒープ。f=min, 同fはg大優先） ----
  const idOf = new Map();
  const pId = [], pFrom = [], pTo = [], gArr = [];
  const hK = [], hF = [], hG = [];
  function heapPush(k, f, g) {
    hK.push(k); hF.push(f); hG.push(g);
    let i = hK.length - 1;
    const hi = tieG === "hi";
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (hF[p] < hF[i] || (hF[p] === hF[i] && (hi ? hG[p] >= hG[i] : hG[p] <= hG[i]))) break;
      [hK[p], hK[i]] = [hK[i], hK[p]]; [hF[p], hF[i]] = [hF[i], hF[p]]; [hG[p], hG[i]] = [hG[i], hG[p]];
      i = p;
    }
  }
  function heapPop() {
    const top = { k: hK[0], f: hF[0], g: hG[0] };
    const n = hK.length - 1;
    hK[0] = hK[n]; hF[0] = hF[n]; hG[0] = hG[n];
    hK.pop(); hF.pop(); hG.pop();
    const hi = tieG === "hi";
    let i = 0;
    for (;;) {
      const l = i * 2 + 1, r2 = l + 1; let m = i;
      if (l < n && (hF[l] < hF[m] || (hF[l] === hF[m] && (hi ? hG[l] > hG[m] : hG[l] < hG[m])))) m = l;
      if (r2 < n && (hF[r2] < hF[m] || (hF[r2] === hF[m] && (hi ? hG[r2] > hG[m] : hG[r2] < hG[m])))) m = r2;
      if (m === i) break;
      [hK[m], hK[i]] = [hK[i], hK[m]]; [hF[m], hF[i]] = [hF[i], hF[m]]; [hG[m], hG[i]] = [hG[i], hG[m]];
      i = m;
    }
    return top;
  }

  const startKey = keyOf(SB, SP);
  idOf.set(startKey, 0); pId.push(-1); pFrom.push(-1); pTo.push(-1); gArr.push(0);
  heapPush(startKey, hOf(SB), 0);
  let nextId = 1, expanded = 0, foundId = -1;
  let maxFill = 0; const filledGoals = new Set();

  while (hK.length) {
    const top = heapPop();
    const id = idOf.get(top.k);
    if (gArr[id] !== top.g) continue;
    const k = top.k;
    const bar = k.indexOf("|");
    const bs = k.slice(0, bar).split(",").map(Number);
    const pl = +k.slice(bar + 1);
    expanded++;
    if (expanded > cap) return { solvable: false, reason: "expand cap", states: expanded };
    if (goalTest(bs)) { foundId = id; break; }
    if (stats) {
      let f = 0;
      for (const b of bs) if (goalSet.has(b)) { f++; filledGoals.add(b); }
      if (f > maxFill) maxFill = f;
    }
    region(bs, pl, seenE);
    const s0 = stampE;
    const boxSet = new Set(bs);
    for (const b of bs) {
      const br = b / W | 0, bc = b % W;
      for (const [dr, dc] of DIRS) {
        const fr = br - dr, fc = bc - dc;
        const tr = br + dr, tc = bc + dc;
        if (!inB(fr, fc) || !inB(tr, tc)) continue;
        const behind = idx(fr, fc), dest = idx(tr, tc);
        if (wall[behind] || wall[dest] || boxSet.has(behind) || boxSet.has(dest)) continue;
        if (seenE[behind] !== s0) continue;
        if (!noPrune && frozenAt(dest)) continue;
        const nb = bs.map(x => x === b ? dest : x).sort((x, y) => x - y);
        if (!noPrune) {
          const nset = new Set(nb);
          if (block2Dead(nb, nset, dest)) continue;   // 2x2凍結クラスタを作る手は打たない
        }
        const hh = hOf(nb);
        if (hh >= INF) continue;              // 箱がどのゴールにも届かない配置は枝刈り
        const nk = keyOf(nb, b);
        const ng = top.g + 1;
        let cid = idOf.get(nk);
        if (cid === undefined) {
          if (nextId > 14_000_000) return { solvable: false, reason: "state cap (memory)", states: expanded };
          cid = nextId++;
          idOf.set(nk, cid); pId.push(id); pFrom.push(b); pTo.push(dest); gArr.push(ng);
          heapPush(nk, ng + hh, ng);
        } else if (ng < gArr[cid]) {
          gArr[cid] = ng; pId[cid] = id; pFrom[cid] = b; pTo[cid] = dest;
          heapPush(nk, ng + hh, ng);
        }
      }
    }
  }
  if (foundId < 0) {
    const r = { solvable: false, reason: "no solution", states: expanded };
    if (stats) Object.assign(r, { maxFill, neverFill: [...goalSet].filter(g => !filledGoals.has(g)).map(g => `r${g / W | 0}c${g % W}`) });
    return r;
  }

  // ---- push 列復元（A*のpush最適経路） ----
  const chain = [];
  let cur = foundId;
  while (pFrom[cur] >= 0) { chain.push([pFrom[cur], pTo[cur]]); cur = pId[cur]; }
  chain.reverse();

  // ---- 実移動手数（各push地点までの歩行 + push 1） ----
  let pos = SP, sim = SB.slice(), moves = 0;
  for (const [from, to] of chain) {
    const d = to - from;
    const need = from - d;
    const dist = walkDist(sim, pos, need);
    if (dist < 0) throw new Error("walk path broken");
    moves += dist + 1;
    sim = sim.map(x => x === from ? to : x);
    pos = from;
  }
  return { solvable: true, pushes: chain.length, moves, states: expanded };

  function walkDist(bs, from, to) {
    if (from === to) return 0;
    const boxSet = new Set(bs);
    const dist = new Int32Array(NW).fill(-1); dist[from] = 0;
    const q = [from]; let h = 0;
    while (h < q.length) {
      const x = q[h++];
      const r = x / W | 0, c = x % W;
      for (const [dr, dc] of DIRS) {
        const nr = r + dr, nc = c + dc;
        if (!inB(nr, nc)) continue;
        const nx = idx(nr, nc);
        if (dist[nx] >= 0 || wall[nx]) continue;
        if (nx === to) return dist[x] + 1;
        if (!boxSet.has(nx)) { dist[nx] = dist[x] + 1; q.push(nx); }
      }
    }
    return -1;
  }
}

// ---- CLI ----
if (process.argv[1] && process.argv[1].endsWith("solver.mjs")) {
  const { pathToFileURL } = await import("node:url");
  const pathMod = await import("node:path");
  const raw = process.argv[2] ?? "levels-data.mjs";
  const abs = pathMod.isAbsolute(raw) ? raw : pathMod.resolve(process.cwd(), raw);
  const mod = await import(pathToFileURL(abs).href);
  const levels = mod.default ?? mod.LEVELS;
  let bad = 0;
  levels.forEach((lv, i) => {
    try {
      const r = solve(lv);
      const title = lv.t?.ja ?? "";
      if (!r.solvable) { bad++; console.log(`L${String(i + 1).padStart(2)}  ✗ UNSOLVABLE (${r.reason})  ${title}`); }
      else console.log(`L${String(i + 1).padStart(2)}  ✓  pushes=${String(r.pushes).padStart(3)}  par(moves)=${String(r.moves).padStart(3)}  expanded=${String(r.states).padStart(8)}  ${title}`);
    } catch (e) { bad++; console.log(`L${String(i + 1).padStart(2)}  ✗ ERROR: ${e.message}`); }
  });
  console.log(bad ? `\n*** ${bad} 面が問題あり ***` : `\nAll ${levels.length} levels OK`);
}
