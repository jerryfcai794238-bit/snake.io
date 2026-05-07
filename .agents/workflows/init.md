---
description: 快速初始化專案上下文，確保 Agent 進入開發狀態。
---

# Workflow: Init

## 執行清單

1. **目錄掃描**：`list_dir` 確認根目錄結構，記錄：
   - 當前活躍 GDD 版號（`NeonSnake_GDD.md` 頂部）
   - 現有的 `presentation_*` 資料夾版本
   - 根目錄核心檔案是否完整（`index.html`, `style.css`, `game.js`, `config.js`）

2. **規格讀取**（依優先序）：
   - 主要 GDD：`NeonSnake_GDD.md`（根目錄，source of truth）
   - 環境設定：`ENVIRONMENT_SETUP.md`（若不存在則跳過）
   - Changelog：`NeonSnake_Changelog.md`（確認最新版本條目）

3. **規則加載**：讀取 `.agents/rules/` 下所有 `.md` 規則檔
   - `agent_safe_rules.md`
   - `strict_authorize.md`

4. **狀態回報**：簡述：
   - 當前 GDD 版本號與最後 Changelog 條目日期
   - 上次 git commit 訊息摘要
   - 已知待處理 Issue（若有）

5. **計畫優先**：確認接下來要做代碼變更時，強制先執行 `/plan`。

## 核心檔案路徑對照

| 角色 | 路徑 |
|------|------|
| 主要 GDD | `NeonSnake_GDD.md` |
| 版本歸檔 | `Old GDD/` |
| Changelog | `NeonSnake_Changelog.md` |
| 遊戲核心 | `game.js`, `config.js` |
| 關卡設定 | `levels.md` |
| Pitch Deck | `pitch_deck/NeonSnake_PitchDeck.html` |
