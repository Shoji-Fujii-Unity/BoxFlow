# BoxFlow（ボックスフロー）

**[🇯🇵 日本語](#-日本語)** · **[🇬🇧 English](#-english)** · **[🇨🇳 中文](#-中文)**

サーバー不要・単一HTMLファイルで動く、倉庫番風パズルゲーム。スマホ（縦長）主体・PC対応。
**v2.0 でレベルは全30面に。レベルセレクション・★評価・パー（目標手数）・アニメーション刷新。**

---

## 🇯🇵 日本語

### 特徴
- 📱 スマホ主体の縦長レイアウト（safe-area対応）/ PCキーボード対応
- 🎮 スワイプ / 十字ボタン / 矢印・WASD の3系統入力
- 🗂 **レベルセレクション**（30面グリッド：ロック／クリア／★／ベスト手数を表示、L キーでも開く）
- ⭐ **★評価とパー（目標手数）**：各面にA*検証済みの「パー」を設定、手数で★1〜3を判定
- 🧩 **全30面**の段階的難易度（v1.6の20面を全継承＋新11面＋刷新1面）。↩待避 / 🔄やり直し
- ✨ 箱とプレイヤーのスライドアニメーション、クリア時コンフェティ、バイブ（対応端末）
- 🔤 Google Fonts（Outfit / Zen Maru Gothic）— 唯一の外部参照。オフライン時はシステムフォールバックで問題なく遊べます
- 🔊 サウンド ON/OFF（Web Audio API 合成音、外部ファイル不要）
- 🌐 多言語（ja / en / zh、自動検出＋切替）
- 💾 `localStorage` に自動保存（v2形式、旧 v1 からの自動マイグレーション付き）
- ⚖️ 実行時の依存ライブラリ・ビルド工程ゼロ（`tools/` は開発用、ゲーム本体は単一HTML）

### 起動方法
`index.html` をブラウザで開くだけ（`file://` OK、オフライン可）。静的ホスティングにもそのまま配置できます。

### 遊び方
箱を全ゴールに置いたらクリア。**倉庫番ルール準拠**（引けない／2個押せない／壁・盤外・箱の先へは動かせない）。

| 入力 | スマホ | PC |
|---|---|---|
| 移動 | スワイプ / 十字ボタン | ↑↓←→ / WASD |
| 待避 | ↩ ボタン | Z / U |
| やり直し | 🔄 ボタン | R |
| レベル選択 | 面名チップタップ | L |
| サウンド | 🔊 ボタン | M |
| 閉じる | × | Esc |

### ★評価とパー
各面には **パー**（push最適解の実手数＝歩数＋押数。`tools/solver.mjs` のA*で検証）が表示されます。

| ★ | 条件 |
|---|---|
| ★★★ | 手数 ≤ パー |
| ★★ | 手数 ≤ ⌈パー×1.4⌉ |
| ★ | クリア（それ以上） |

※ パーは「プッシュ回数最小の解」の手数で定義しています。全局最短手数とは異なる場合があります。

### レベル一覧（全30面）
| 面 | テーマ | 箱 | 難易度 | パー |
|---|---|---|---|---|
| 1 | 真下だけ（チュートリアル） | 2 | ★1 | 14 |
| 2 | 横に押す | 2 | ★1 | 16 |
| 3 | 角を曲がる | 2 | ★★ | 16 |
| 4 | 動順（邪魔箱を先にどかす） | 2 | ★★ | 18 |
| 5 | 2つの道・ルート選択 | 2 | ★★ | 19 |
| 6 | 肘の通路 🆕 | 3 | ★★★ | 30 |
| 7 | 上へ上へ通路 🆕 | 3 | ★★★ | 35 |
| 8 | 上に押す（発想転換） | 3 | ★★★ | 27 |
| 9 | 下段横滑り | 2 | ★★★ | 17 |
| 10 | 中央の島 🆕 | 4 | ★★★ | 43 |
| 11 | 一直線の3箱（順序） | 3 | ★★★ | 24 |
| 12 | 壁際順序 | 3 | ★★★ | 41 |
| 13 | 四方の壁 🆕 | 4 | ★★★★ | 36 |
| 14 | 動順＋旋回混在 | 4 | ★★★★ | 35 |
| 15 | 通路の衝突 | 3 | ★★★★ | 25 |
| 16 | 四隅対称アプローチ | 4 | ★★★★ | 43 |
| 17 | 角ターゲット 🆕 | 4 | ★★★★ | 45 |
| 18 | 四隅集結 | 4 | ★★★★ | 93 |
| 19 | 二重扉のボトルネック | 3 | ★★★★+ | 54 |
| 20 | 二つの部屋 🆕 | 3 | ★★★★+ | 67 |
| 21 | 二重迂回 | 4 | ★★★★★ | 56 |
| 22 | 整列袋小路 🆕 | 6 | ★★★★+ | 58 |
| 23 | 六枠回転 | 6 | ★★★★★+ | 115 |
| 24 | 五つの肘 🆕 | 5 | ★★★★★ | 205 |
| 25 | 五通路 | 5 | ★★★★★+ | 217 |
| 26 | 逆流配分 ♻刷新 | 6 | ★★★★★+ | 111 |
| 27 | 大迂回 🆕 | 6 | ★★★★★+ | 161 |
| 28 | 大渋滞 🆕 | 6 | ★★★★★++ | 110 |
| 29 | 大行列 🆕 | 6 | ★★★★★++ | 91 |
| 30 | **元祖オマージュ（最終面）** | 6 | ★★★★★++ | 355 |

🆕=v2.0で追加 ♻=レイアウト刷新（旧「六枠サービス列」は検証限界を超えたため「大渋滞」に差し替え）
※ **全30面はバンドル済みA*ソルバーで解存在を検証済み**（par-cache.json に結果）。詰み状態になり得る面があるため待避・やり直し前提（倉庫番の本質）。

### セーブデータ
キー `boxflow_save_v2`（localStorage）。面ごとに `done` / `best` / `stars` / `state`、全体で `lang` / `sound` / `next`。
- 旧 `boxflow_save_v1`（20面構成）からの**自動マイグレーション**あり：クリア・ベストは対応する新面へ引き継がれ、中断位置はレイアウト不変の面のみ復元（刷新面は破棄）。
- 初期化は開発者ツールから当該キーを削除。

### 技術メモ
- 単一HTML（HTML+CSS+Vanilla JS）。静的タイル＋絶対配置スプライトでスライドアニメを実現
- レベル定義: 行文字列配列（`#`壁 `.`ゴール `$`箱 `@`PL スペース床）。編集は `tools/levels-data.mjs` → `node tools/build-levels.mjs` で `index.html` に注入
- `tools/`（開発用・遊ばずに読まなくてOK）: `solver.mjs`＝push最適A*（押距離×ハガリー割当ヒューリスティック、角フリーズ・2×2袋小路枝刈り）／`build-levels.mjs`＝全面検証とパー注入／`gen-level.mjs`＝pull逆向き生成（解保証面）／`par-cache.json`＝検証結果
- フォントは Google Fonts CDN を参照（唯一の外部依存）。不通時はシステムフォールバック
- サウンドは初回ユーザー操作で AudioContext をアンロック（自動再生ポリシー準拠、初回タップのみ無音の場合あり）。対応端末では操作・クリア時にバイブ

### 修正履歴
| 版 | 内容 |
|---|---|
| v1.0–1.1 | 初回リリース／`LEVELS[0].split` エラー修正・盤外ガード |
| v1.2–1.4 | 8→15面拡張、レベル進行、AudioContext警告対応、上級面追加 |
| v1.5 | やり直し時の `render()` 欠落修正 |
| v1.6 | L18確定版差し替え・L19「六枠サービス列」追加・元祖面を最終L20に（全20面） |
| **v2.0** | **全30面化（新11面＋「逆流配分」刷新＋「六枠サービス列」→「大渋滞」差し替え）**／レベルセレクション（ロック・★・ベスト）／★評価とパー表示／スライドアニメ・コンフェティ／Google Fonts（オフラインフォールバック）／ショートカット拡充（R・L・M・Esc）／バイブ／save v2＋v1自動マイグレーション／全面を同梱A*ソルバーで検証 |

---

## 🇬🇧 English

### Features
- 📱 Mobile-first portrait layout (safe-area aware) / keyboard support on PC
- 🎮 Three input methods: swipe / on-screen D-pad / arrow keys & WASD
- 🗂 **Level selection** (30-tile grid with lock / clear / stars / best; also `L` key)
- ⭐ **Star rating & par**: every level carries an A*-verified par (move count of a push-optimal solution)
- 🧩 **30 levels** with a smooth difficulty curve (all 20 from v1.6 kept + 11 new + 1 redesigned). Undo / Restart
- ✨ Sliding box/player animations, win confetti, haptic vibration where supported
- 🔤 Google Fonts (Outfit / Zen Maru Gothic) — the only external reference; falls back to system fonts offline
- 🔊 Sound on/off (synthesized via Web Audio API, no audio files)
- 🌐 Multilingual (ja / en / zh, auto-detect + manual switch)
- 💾 Auto-save to `localStorage` (v2 format, auto-migrates from v1)
- ⚖️ Zero runtime dependencies, zero build steps (`tools/` is dev-only; the game is a single HTML file)

### Getting started
Open `index.html` in any modern browser (works via `file://`, fully offline). Deployable on any static host.

### How to play
Push all boxes onto the glowing goals. **Standard Sokoban rules** (no pulling, no double pushes, blocked by walls/boxes/edges).

| Input | Mobile | PC |
|---|---|---|
| Move | Swipe / D-pad | Arrows / WASD |
| Undo | ↩ button | Z / U |
| Restart | 🔄 button | R |
| Levels | Tap level chip | L |
| Sound | 🔊 button | M |
| Close | × | Esc |

### Stars & par
Each level shows a **par** — the move count (steps + pushes) of an A*-verified push-optimal solution.

| Stars | Condition |
|---|---|
| ★★★ | moves ≤ par |
| ★★ | moves ≤ ⌈par × 1.4⌉ |
| ★ | finished (above that) |

※ Par is defined on push-optimal solutions; the absolute fewest-move solution may occasionally be lower.

### Levels (30 total)
| # | Theme | Boxes | Difficulty | Par |
|---|---|---|---|---|
| 1 | Straight down (tutorial) | 2 | ★1 | 14 |
| 2 | Horizontal pushes | 2 | ★1 | 16 |
| 3 | First corner turn | 2 | ★★ | 16 |
| 4 | Move order (clear the blocker first) | 2 | ★★ | 18 |
| 5 | Two routes | 2 | ★★ | 19 |
| 6 | Elbow Room 🆕 | 3 | ★★★ | 30 |
| 7 | Up the Aisle 🆕 | 3 | ★★★ | 35 |
| 8 | Pushing up — rethink | 3 | ★★★ | 27 |
| 9 | Offset trio, bottom-row slides | 2 | ★★★ | 17 |
| 10 | Central Isle 🆕 | 4 | ★★★ | 43 |
| 11 | Three boxes in a row (ordering) | 3 | ★★★ | 24 |
| 12 | Fill wall-side goals in order | 3 | ★★★ | 41 |
| 13 | Cross Wall 🆕 | 4 | ★★★★ | 36 |
| 14 | Order + turns mixed | 4 | ★★★★ | 35 |
| 15 | Shared corridor conflict | 3 | ★★★★ | 25 |
| 16 | Symmetric four-corner approach | 4 | ★★★★ | 43 |
| 17 | Corner Targets 🆕 | 4 | ★★★★ | 45 |
| 18 | Four Corners Rally | 4 | ★★★★ | 93 |
| 19 | Double-door bottleneck | 3 | ★★★★+ | 54 |
| 20 | Two Rooms 🆕 | 3 | ★★★★+ | 67 |
| 21 | Double Detour | 4 | ★★★★★ | 56 |
| 22 | Sorting Dead Ends 🆕 | 6 | ★★★★+ | 58 |
| 23 | Six-Slot Rotation | 6 | ★★★★★+ | 115 |
| 24 | Zigzag Five 🆕 | 5 | ★★★★★ | 205 |
| 25 | Five Lanes | 5 | ★★★★★+ | 217 |
| 26 | Counter-Flow ♻ redesigned | 6 | ★★★★★+ | 111 |
| 27 | The Long Way 🆕 | 6 | ★★★★★+ | 161 |
| 28 | Grand Gridlock 🆕 | 6 | ★★★★★++ | 110 |
| 29 | The Grand Parade 🆕 | 6 | ★★★★★++ | 91 |
| 30 | **Classic Sokoban L1 homage (final)** | 6 | ★★★★★++ | 355 |

🆕 = new in v2.0 ♻ = layout replaced (the old "Six-Slot Service" exceeded verification limits and became "Grand Gridlock")
※ **All 30 levels are verified solvable with the bundled A\* solver** (results cached in `par-cache.json`). Dead-end states are possible — undo/restart are part of the game.

### Save data
Key `boxflow_save_v2` in localStorage; per level `done` / `best` / `stars` / `state`, global `lang` / `sound` / `next`.
Auto-migrates from the old 20-level `boxflow_save_v1`: clears and bests carry over to the remapped levels; in-progress states are restored only for unchanged layouts. Delete the key to reset.

### Tech notes
- Single HTML file (HTML + CSS + vanilla JS); static tiles plus absolutely positioned sprites for sliding animation
- Levels are row strings (`#` wall, `.` goal, `$` box, `@` player). Edit `tools/levels-data.mjs`, then `node tools/build-levels.mjs` injects verified pars into `index.html`
- `tools/` (dev-only): `solver.mjs` — push-optimal A* (push-distance × Hungarian assignment heuristic; corner-freeze and 2×2-block deadlock pruning) / `build-levels.mjs` — verifies every level and injects pars / `gen-level.mjs` — reverse-pull level generator (solvable by construction) / `par-cache.json` — verification results
- Fonts come from the Google Fonts CDN (the only external dependency); system fallback keeps it playable offline
- AudioContext unlocked on first user gesture (autoplay-policy compliant; the very first tap may be silent). Vibration on supported devices

### Changelog
| Ver | Changes |
|---|---|
| v1.0–1.1 | Initial release / `LEVELS[0].split` fix, out-of-bounds guard |
| v1.2–1.4 | 8→15 levels, level progression, AudioContext warning fix, hard levels |
| v1.5 | `render()` fix on restart |
| v1.6 | Final L18 swap, added L19, classic homage as final L20 (20 total) |
| **v2.0** | **30 levels (11 new + redesigned Counter-Flow + Six-Slot Service → Grand Gridlock)** / level selection with locks, stars, bests / star rating & par / slide animations & confetti / Google Fonts with offline fallback / more shortcuts (R·L·M·Esc) / vibration / save v2 with v1 auto-migration / every level verified with the bundled A* solver |

---

## 🇨🇳 中文

### 特性
- 📱 手机优先竖屏布局（适配安全区）/ PC 键盘支持
- 🎮 三种操作：滑动 / 屏幕方向键 / 方向键与 WASD
- 🗂 **关卡选择**（30 格网格：锁定 / 通关 / ★ / 最佳步数；亦可按 L 打开）
- ⭐ **★评级与标准杆（par）**：每关内置 A* 验证的 par，按步数评 ★1–3
- 🧩 **共 30 关**难度递进（v1.6 的 20 关全部保留 + 新增 11 关 + 重制 1 关）。↩撤销 / 🔄重来
- ✨ 箱子与玩家滑动动画、通关彩带、震动（支持的设备）
- 🔤 Google Fonts（Outfit / Zen Maru Gothic）——唯一外部引用；离线时自动回退系统字体
- 🔊 音效开关（Web Audio API 合成音，无需音频文件）
- 🌐 多语言（ja / en / zh，自动检测＋手动切换）
- 💾 `localStorage` 自动保存（v2 格式，自动从 v1 迁移）
- ⚖️ 运行零依赖、零构建（`tools/` 仅供开发，游戏本体是单个 HTML）

### 启动方式
用浏览器打开 `index.html` 即可（支持 `file://`，可离线）。可直接部署到任意静态托管。

### 玩法
把所有箱子推到发光目标点。**推箱子规则**（不能拉、不能同时推两个、不可推入墙/箱/边界外）。

| 操作 | 手机 | PC |
|---|---|---|
| 移动 | 滑动 / 方向键 | ↑↓←→ / WASD |
| 撤销 | ↩ 按钮 | Z / U |
| 重来 | 🔄 按钮 | R |
| 选关 | 点关卡标签 | L |
| 音效 | 🔊 按钮 | M |
| 关闭 | × | Esc |

### ★评级与标准杆
每关显示 **par**：A* 验证的“最优推数解”的实际步数（走＋推）。

| ★ | 条件 |
|---|---|
| ★★★ | 步数 ≤ par |
| ★★ | 步数 ≤ ⌈par×1.4⌉ |
| ★ | 通关（更多） |

※ par 以“推数最少解”定义，全局最短步数可能更低。

### 关卡一览（共30关）
| 关 | 主题 | 箱数 | 难度 | par |
|---|---|---|---|---|
| 1 | 直下推（新手教程） | 2 | ★1 | 14 |
| 2 | 横向推动 | 2 | ★1 | 16 |
| 3 | 首次转弯 | 2 | ★★ | 16 |
| 4 | 移动顺序（先移开路箱） | 2 | ★★ | 18 |
| 5 | 双路线 | 2 | ★★ | 19 |
| 6 | 肘形通道 🆕 | 3 | ★★★ | 30 |
| 7 | 向上通道 🆕 | 3 | ★★★ | 35 |
| 8 | 向上推的思维转换 | 3 | ★★★ | 27 |
| 9 | 下排横滑 | 2 | ★★★ | 17 |
| 10 | 中央小岛 🆕 | 4 | ★★★ | 43 |
| 11 | 三箱直线（顺序） | 3 | ★★★ | 24 |
| 12 | 贴墙目标按序填充 | 3 | ★★★ | 41 |
| 13 | 十字壁 🆕 | 4 | ★★★★ | 36 |
| 14 | 顺序＋转弯混合 | 4 | ★★★★ | 35 |
| 15 | 共用通道冲突 | 3 | ★★★★ | 25 |
| 16 | 四角对称逼近 | 4 | ★★★★ | 43 |
| 17 | 角落目标 🆕 | 4 | ★★★★ | 45 |
| 18 | 四角集结 | 4 | ★★★★ | 93 |
| 19 | 双门瓶颈 | 3 | ★★★★+ | 54 |
| 20 | 双室一门 🆕 | 3 | ★★★★+ | 67 |
| 21 | 双重迂回 | 4 | ★★★★★ | 56 |
| 22 | 分拣死胡同 🆕 | 6 | ★★★★+ | 58 |
| 23 | 六格旋转 | 6 | ★★★★★+ | 115 |
| 24 | 五个肘弯 🆕 | 5 | ★★★★★ | 205 |
| 25 | 五通道 | 5 | ★★★★★+ | 217 |
| 26 | 逆流分配 ♻重制 | 6 | ★★★★★+ | 111 |
| 27 | 大迂回 🆕 | 6 | ★★★★★+ | 161 |
| 28 | 大堵塞 🆕 | 6 | ★★★★★++ | 110 |
| 29 | 大行列 🆕 | 6 | ★★★★★++ | 91 |
| 30 | **元祖推箱子第1关致敬（最终关）** | 6 | ★★★★★++ | 355 |

🆕=v2.0 新增 ♻=版面重制（旧「六格服务列」超出验证极限，改为「大堵塞」）
※ **全部 30 关已用自带 A* 求解器验证可解**（结果存于 par-cache.json）。可能出现死局，撤销/重来是游戏的一部分。

### 存档
localStorage 键 `boxflow_save_v2`；每关 `done` / `best` / `stars` / `state`，全局 `lang` / `sound` / `next`。
自动从旧 20 关的 `boxflow_save_v1` 迁移：通关与最佳映射到新关卡，未完成进度仅在版面未变的关卡恢复（重制关会清除）。删除该键即可重置。

### 技术说明
- 单个 HTML（HTML+CSS+原生 JS）；静态地块＋绝对定位精灵实现滑动动画
- 关卡为行字符串（`#`墙 `.`目标 `$`箱 `@`玩家）：改 `tools/levels-data.mjs` 后运行 `node tools/build-levels.mjs` 把验证过的 par 注入 `index.html`
- `tools/`（仅开发用）：`solver.mjs`＝最优推数 A*（推距×匈牙利指派启发式，角冻结与 2×2 死锁剪枝）／`build-levels.mjs`＝全关验证与 par 注入／`gen-level.mjs`＝逆向拉箱生成（构造性可解）／`par-cache.json`＝验证结果
- 字体引用 Google Fonts CDN（唯一外部依赖），不可达时回退系统字体
- 首次用户操作解锁 AudioContext（符合自动播放策略，首次点击可能无声）；支持的设备会震动

### 更新日志
| 版本 | 内容 |
|---|---|
| v1.0–1.1 | 初版发布／`LEVELS[0].split` 修复、越界保护 |
| v1.2–1.4 | 8→15 关、关卡推进、AudioContext 警告修复、高难关 |
| v1.5 | 重来时 `render()` 缺失修复 |
| v1.6 | L18 定版替换、新增 L19、经典致敬作最终 L20（共 20 关） |
| **v2.0** | **30 关（新增 11＋重制逆流分配＋六格服务列→大堵塞）**／选关界面（锁定·★·最佳）／★评级与 par／滑动动画与彩带／Google Fonts 离线回退／快捷键扩充（R·L·M·Esc）／震动／存档 v2＋自动迁移／全部关卡经自带 A* 求解器验证 |

---

## License / クレジット / 许可
本作为受《仓库番（Sokoban, 1982）》启发之原创实现；标题与图形、代码均为原创。L30 为经典第1关之致敬布局。代码可自由使用（欢迎注明出处）。
