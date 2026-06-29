---
description: 移除遊戲和 Pitch Deck 都沒用到的冗餘圖檔。
---

# Workflow: Asset Cleanup

## 清理流程

1. **掃描引用來源**：
   - **遊戲核心**：`index.html`, `style.css`, `game.js`, `config.js`
   - **Pitch Deck**：`pitch_deck/NeonSnake_PitchDeck.html`
   - **Presentation**：所有 `presentation_*/` 資料夾內的 `.html` 與 `.md` 檔案

2. **列出存量圖檔**：
   // turbo
   - `list_dir` 找出根目錄及所有子目錄下的 `.png`, `.jpg`, `.jpeg`, `.svg`, `.gif`

3. **執行比對**：
   // turbo
   - `grep_search` 確認每個圖檔的檔名是否出現在任何引用來源的代碼字串中
   - 注意動態拼接路徑（例如 `icon_${skill}.png` 需手動確認）

4. **清理動作**：
   - ⚠️ **列出待刪清單給使用者確認**（不自動刪除）
   - 待使用者明確回覆「開始」後，依據 `strict_authorize.md` 授權流程執行刪除

5. **最終驗證**：
   - 用瀏覽器工具確認遊戲畫面與 Pitch Deck 仍正常顯示
   - 在 `NeonSnake_Changelog.md` 記錄清理動作（PATCH 版本條目）
