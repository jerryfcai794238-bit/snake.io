---
description: 確保 Pitch Deck HTML 與最新的 GDD 內容保持同步。
---

# Workflow: Pitch Deck Sync

## Source of Truth 規則
- **主要 GDD**：根目錄 `NeonSnake_GDD.md`（唯一權威來源）
- **Pitch Deck HTML**：`pitch_deck/NeonSnake_PitchDeck.html`（輸出目標）
- 同步方向永遠是：`NeonSnake_GDD.md → pitch_deck HTML`，絕不反向

## 觸發條件
- `NeonSnake_GDD.md` 有版號更新或重大內容變動
- `NeonSnake_Changelog.md` 新增了版本條目

## 執行動作

1. **確認版本一致性**：
   - 讀取 `NeonSnake_GDD.md` 頂部版號
   - 讀取 `NeonSnake_Changelog.md` 最新條目版號
   - 若不一致，先執行 `/gdd-versioning` 進版後再繼續

2. **同步 HTML 內容**：
   - 更新 `<title>` 與 `<div class="version">` 中的版號
   - 對照 GDD 各章節，確認 HTML 的對應 Section 是否包含最新機制：
     - §3 環境物件（Portal, Boost Zone, Black Hole）
     - §3.2 新道具（Ink Bomb, Star）
     - §7 AI 行為模式（HUNT / PAINT / EAT + 技能觸發）
     - §8 大地圖模式（若 HTML 有此區塊）

3. **更新時間戳記**：
   - 更新 HTML 頁尾的 `Last Update` 為當日日期（YYYY-MM-DD）

4. **驗證資源連結**：
   - 確認 `pitch_deck/` 目錄內存在：
     - `mockup.png`（遊戲截圖）
     - `skill_icons.png`（技能圖標展示）
     - `競技貪食蛇_示意圖.png`（封面圖）

## 相關檔案

- [NeonSnake_GDD.md](file:///c:/Users/fanchunkao/Documents/Antigravity/snake-battle/NeonSnake_GDD.md)
- [NeonSnake_PitchDeck.html](file:///c:/Users/fanchunkao/Documents/Antigravity/snake-battle/pitch_deck/NeonSnake_PitchDeck.html)
- [NeonSnake_Changelog.md](file:///c:/Users/fanchunkao/Documents/Antigravity/snake-battle/NeonSnake_Changelog.md)
