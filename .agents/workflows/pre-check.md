---
description: 在提交或運行前，確保環境與基本語法正確。
---

# Workflow: Pre-check

## 檢查清單

// turbo
1. **JS Syntax**：`node --check game.js` 與 `node --check config.js`，確認無語法錯誤

// turbo
2. **File Existence**：確認以下檔案存在：
   - `index.html`, `style.css`, `game.js`, `config.js`
   - `icon_dash.png`, `icon_shot.png`, `icon_bloom.png`（技能圖標）

3. **Console Pollution**：`grep_search` 搜尋 `console.log`，確認無遺留除錯輸出

4. **Style**：縮排 2 spaces、字串使用 single quote，符合 Prettier 設定

5. **Asset Links**：掃描 `index.html` 中的 `src` / `href`，確認路徑可解析
   （深度驗證請執行 `/asset-cleanup`）

6. **GDD 版本一致性**：確認 `NeonSnake_GDD.md` 頂部版號與 `NeonSnake_Changelog.md` 最新條目一致
