---
description: 比對當前實作與 GDD / 使用者原始需求之間的差距。
---

# Workflow: Gap Audit

## 審計流程

1. **讀取源頭**：
   - 讀取根目錄 `NeonSnake_GDD.md`（source of truth）
   - 用 `grep_search` 交叉比對 `game.js` 與 `config.js` 中對應的功能實作

2. **對照代碼**：逐章節比對 GDD 定義是否已實作：
   - 第 1 章：核心機制（地塊變速、碰撞、重生）
   - 第 2 章：遊戲模式（COLLECT / VS_TERRITORY / VS_FOOD / SURVIVE）
   - 第 3 章：環境物件（Portal, Boost Zone, Black Hole）與道具（Shield, Giant, Phantom, Ink Bomb, Star）
   - 第 6 章：技能系統（Dash, Shot, Bloom）
   - 第 7 章：AI 行為（HUNT / PAINT / EAT + 技能觸發邏輯）
   - 第 8 章：大地圖模式（Large Map, Terrain, Obstacles）

3. **報告格式**：

   | 功能 | 狀態 | 嚴重度 | 備注 |
   |------|------|--------|------|
   | 黑洞引力 | MISSING | 🔴 HIGH | GDD §3.1 要求 |
   | 傳送門消失邏輯 | DEVIATION | 🟡 MED | 使用後未 despawn |
   | 噴霧衝刺 Dash | DONE | — | — |

   - **DONE**：已實作且行為符合 GDD
   - **MISSING**：GDD 有定義但未實作
   - **DEVIATION**：已實作但行為與 GDD 不符

4. **後續動作建議**：
   - 有 `MISSING 🔴 HIGH` → 立即執行 `/plan`
   - 全部 `DONE` → 執行 `/skill-gen-html` 更新簡報
   - 有 `DEVIATION` → 記錄至 `NeonSnake_Changelog.md` 並視嚴重度決定是否進 `/plan`
