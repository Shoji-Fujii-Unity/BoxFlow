# BoxFlow（ボックスフロー）

**[🇯🇵 日本語](#-日本語)** · **[🇬🇧 English](#-english)** · **[🇨🇳 中文](#-中文)**

サーバー不要・単一HTMLファイルで動く、倉庫番風パズルゲーム。スマホ（縦長）主体・PC対応。

---

## 🇯🇵 日本語

### 特徴
- 📱 スマホ主体の縦長レイアウト（safe-area対応）/ PCキーボード対応
- 🎮 スワイプ / 十字ボタン / 矢印・WASD の3系統入力
- 🔊 サウンド ON/OFF（Web Audio API 合成音、外部ファイル不要）
- 🌐 多言語（ja / en / zh、自動検出＋切替）
- 💾 `localStorage` に自動保存（クリア状態・ベスト手数・中断位置・設定）
- 🧩 **全20面**の段階的難易度。↩待避 / 🔄やり直し
- ⚖️ 依存ライブラリ・ビルド工程ゼロ

### 起動方法
`index.html` をブラウザで開くだけ（`file://` OK、オフライン可）。静的ホスティングにもそのまま配置できます。

### 遊び方
箱を全ゴールに置いたらクリア。**倉庫番ルール準拠**（引けない／2個押せない／壁・盤外・箱の先へは動かせない）。

| 入力 | スマホ | PC |
|---|---|---|
| 移動 | スワイプ / 十字ボタン | ↑↓←→ / WASD |
| 待避 | ↩ ボタン | Z / U |
| やり直し | 🔄 ボタン | — |

### レベル一覧（全20面）
| 面 | テーマ | 箱 | 難易度 |
|---|---|---|---|
| 1 | 真下に押すだけ（チュートリアル） | 2 | ★1 |
| 2 | 横方向の押し | 2 | ★1 |
| 3 | 角を曲がる | 2 | ★★ |
| 4 | 動順（邪魔箱を先にどかす） | 2 | ★★ |
| 5 | 2箱各1旋回・ルート選択 | 2 | ★★ |
| 6 | 「上に押す」発想転換 | 3 | ★★★ |
| 7 | ずれた3箱・下段横滑り | 3 | ★★★ |
| 8 | 3箱一直線ゴール（順序） | 3 | ★★★ |
| 9 | 壁際ゴールを埋める順序 | 3 | ★★★ |
| 10 | 4箱・動順＋旋回混在 | 4 | ★★★★ |
| 11 | 3箱・共有通路の衝突 | 3 | ★★★★ |
| 12 | 四隅対称アプローチ | 4 | ★★★★ |
| 13 | H3「四隅集結」 | 4 | ★★★★ |
| 14 | 二重扉のボトルネック | 3 | ★★★★+ |
| 15 | H1「二重迂回」 | 4 | ★★★★★ |
| 16 | H2「六枠回転」 | 6 | ★★★★★+ |
| 17 | 五通路・サービス列 | 5 | ★★★★★+ |
| 18 | 逆流配分 | 6 | ★★★★★+ |
| 19 | 六枠サービス列 | 6 | ★★★★★++ |
| 20 | **元祖倉庫番レベル1風（最終面）** | 6 | ★★★★★++ |

※ 全20面は解存在を検証済み。詰み状態になり得る面があるため待避・やり直し前提（倉庫番の本質）。

### セーブデータ
キー `boxflow_save_v1`（localStorage）。面ごとに `done` / `best` / `state` を保存。初期化は開発者ツールから当該キーを削除。

### 技術メモ
- 単一HTML（HTML+CSS+Vanilla JS）。盤面は2D配列管理
- レベル定義: 行文字列配列（`#`壁 `.`ゴール `$`箱 `@`PL スペース床）。追加は `LEVELS` に追記するだけ
- サウンドは初回ユーザー操作で AudioContext をアンロック（自動再生ポリシー準拠、初回タップのみ無音の場合あり）

### 修正履歴
| 版 | 内容 |
|---|---|
| v1.0–1.1 | 初回リリース／`LEVELS[0].split` エラー修正・盤外ガード |
| v1.2–1.4 | 8→15面拡張、レベル進行、AudioContext警告対応、上級面追加 |
| v1.5 | やり直し時の `render()` 欠落修正 |
| v1.6 | L18確定版差し替え・L19「六枠サービス列」追加・元祖面を最終L20に（全20面） |

---

## 🇬🇧 English

### Features
- 📱 Mobile-first portrait layout (safe-area aware) / keyboard support on PC
- 🎮 Three input methods: swipe / on-screen D-pad / arrow keys & WASD
- 🔊 Sound on/off (synthesized via Web Audio API, no external files)
- 🌐 Multilingual (ja / en / zh, auto-detect + manual switch)
- 💾 Auto-save to `localStorage` (progress, best moves, mid-level state, settings)
- 🧩 **20 levels** with a smooth difficulty curve. Undo / Restart
- ⚖️ Zero dependencies, zero build steps

### Getting started
Open `index.html` in any modern browser (works via `file://`, fully offline). Deployable on any static host.

### How to play
Push all boxes onto the glowing goals. **Standard Sokoban rules** (no pulling, no double pushes, blocked by walls/boxes/edges).

| Input | Mobile | PC |
|---|---|---|
| Move | Swipe / D-pad | Arrows / WASD |
| Undo | ↩ button | Z / U |
| Restart | 🔄 button | — |

### Levels (20 total)
| # | Theme | Boxes | Difficulty |
|---|---|---|---|
| 1 | Push straight down (tutorial) | 2 | ★1 |
| 2 | Horizontal pushes | 2 | ★1 |
| 3 | First corner turn | 2 | ★★ |
| 4 | Move order (clear the blocker first) | 2 | ★★ |
| 5 | Two boxes, one turn each / route choice | 2 | ★★ |
| 6 | Push upward — rethink | 3 | ★★★ |
| 7 | Offset trio, bottom-row slides | 3 | ★★★ |
| 8 | Three boxes, straight goal row (ordering) | 3 | ★★★ |
| 9 | Fill wall-side goals in order | 3 | ★★★ |
| 10 | Four boxes, order + turns mixed | 4 | ★★★★ |
| 11 | Shared corridor conflict | 3 | ★★★★ |
| 12 | Symmetric four-corner approach | 4 | ★★★★ |
| 13 | H3 "Four Corners Rally" | 4 | ★★★★ |
| 14 | Double-door bottleneck | 3 | ★★★★+ |
| 15 | H1 "Double Detour" | 4 | ★★★★★ |
| 16 | H2 "Six-Slot Rotation" | 6 | ★★★★★+ |
| 17 | Five-lane service column | 5 | ★★★★★+ |
| 18 | Counter-flow distribution | 6 | ★★★★★+ |
| 19 | Six-slot service column | 6 | ★★★★★++ |
| 20 | **Classic Sokoban L1 homage (final)** | 6 | ★★★★★++ |

※ All levels verified solvable. Some allow dead-end states — undo/restart are part of the game.

### Save data
Key `boxflow_save_v1` in localStorage; per level: `done`, `best`, `state`. Delete the key to reset.

### Tech notes
- Single HTML file (HTML + CSS + vanilla JS); grid managed as 2D arrays
- Levels defined as row-string arrays (`#` wall, `.` goal, `$` box, `@` player). Append to `LEVELS` to add more
- AudioContext unlocked on first user gesture (autoplay-policy compliant; the very first tap may be silent)

---

## 🇨🇳 中文

### 特性
- 📱 手机优先竖屏布局（适配安全区）/ PC 键盘支持
- 🎮 三种操作：滑动 / 屏幕方向键 / 方向键与 WASD
- 🔊 音效开关（Web Audio API 合成音，无需外部文件）
- 🌐 多语言（ja / en / zh，自动检测＋手动切换）
- 💾 `localStorage` 自动保存（通关状态、最佳步数、中断进度、设置）
- 🧩 **共 20 关**难度递进。↩撤销 / 🔄重来
- ⚖️ 零依赖、零构建

### 启动方式
用浏览器打开 `index.html` 即可（支持 `file://`，可离线）。可直接部署到任意静态托管。

### 玩法
把所有箱子推到发光目标点。**推箱子规则**（不能拉、不能同时推两个、不可推入墙/箱/边界外）。

| 操作 | 手机 | PC |
|---|---|---|
| 移动 | 滑动 / 方向键 | ↑↓←→ / WASD |
| 撤销 | ↩ 按钮 | Z / U |
| 重来 | 🔄 按钮 | — |

### 关卡一览（共20关）
| 关 | 主题 | 箱数 | 难度 |
|---|---|---|---|
| 1 | 直下推（新手教程） | 2 | ★1 |
| 2 | 横向推动 | 2 | ★1 |
| 3 | 首次转弯 | 2 | ★★ |
| 4 | 移动顺序（先移开路箱） | 2 | ★★ |
| 5 | 双箱各一弯 / 路线选择 | 2 | ★★ |
| 6 | 向上推的思维转换 | 3 | ★★★ |
| 7 | 错位三箱·下排横滑 | 3 | ★★★ |
| 8 | 三箱直线目标（顺序） | 3 | ★★★ |
| 9 | 贴墙目标按序填充 | 3 | ★★★ |
| 10 | 四箱·顺序＋转弯混合 | 4 | ★★★★ |
| 11 | 共用通道冲突 | 3 | ★★★★ |
| 12 | 四角对称逼近 | 4 | ★★★★ |
| 13 | H3「四角集结」 | 4 | ★★★★ |
| 14 | 双门瓶颈 | 3 | ★★★★+ |
| 15 | H1「双重迂回」 | 4 | ★★★★★ |
| 16 | H2「六格旋转」 | 6 | ★★★★★+ |
| 17 | 五通道服务列 | 5 | ★★★★★+ |
| 18 | 逆流分配 | 6 | ★★★★★+ |
| 19 | 六格服务列 | 6 | ★★★★★++ |
| 20 | **元祖推箱子第1关致敬（最终关）** | 6 | ★★★★★++ |

※ 全部关卡均已验证可解。部分关卡可能走入死局，撤销/重来是游戏的一部分。

### 存档
localStorage 键 `boxflow_save_v1`，每关含 `done` / `best` / `state`。删除该键即可重置。

### 技术说明
- 单 HTML 文件（HTML+CSS+原生 JS），盘面用二维数组管理
- 关卡为行字符串数组（`#`墙 `.`目标 `$`箱 `@`玩家），向 `LEVELS` 追加即可加关
- 首次用户操作解锁 AudioContext（符合自动播放策略，首次点击可能无声）

---

## License / クレジット / 许可
本作为受《仓库番（Sokoban, 1982）》启发之原创实现；标题与图形、代码均为原创。L20 为经典第1关之致敬布局。代码可自由使用（欢迎注明出处）。