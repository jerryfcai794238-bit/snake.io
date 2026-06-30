---
description: 收尾時統一檢查程式、GDD、資源與發布缺口，只產出報告，不自動修改。
---

# Workflow: Final Audit

## 適用時機

- 功能完成、準備交付或推版前。
- 使用者要求核對實作、GDD、資源或核心邏輯。

## 稽核來源

- 規格真源：`GDD/貪食蛇GDD.md` 與任務指定的美術、音效、GDK、字串或參數文件。
- 程式：`index.html`、`style.css`、`src/constants.js`、`src/game.js`、`src/snake.js`、`src/renderer.js` 及相關模組。
- 簡報：`presentation_v5.2.0/提案簡報大綱.md`、反饋文件、HTML 與生成工具。

## 檢查流程

1. **工作區與基本品質**
   - 確認既有未提交變更，不覆蓋使用者工作。
   - 執行可用的語法、測試、建置或人工檢查。
   - 搜尋暫時性 `console.log`、`debugger`、失效路徑與缺圖。
2. **規格與實作**
   - 比對規則、參數、狀態切換、UI 文案、Icon、Map、FX、SFX。
   - 衝突時列出雙方來源，不自行判定程式或文件必然優先。
3. **核心邏輯**
   - 依改動範圍檢查 AI 轉向、碰撞、幽靈／護盾、環境物件生命週期、技能邊界與效能熱點。
   - 不相關的舊檢查項不強制套用。
4. **文件結構**
   - 檢查 Markdown 表格、圖片路徑、`details` 平衡、Mermaid 與版本一致性。

## 報告格式

| 項目 | 狀態 | 嚴重度 | 證據／位置 | 建議 |
|---|---|---|---|---|
| 功能或規格 | DONE／MISSING／DEVIATION | HIGH／MED／LOW | 檔案與章節 | 下一步 |

稽核本身是 Level 1，只回報結果；任何修正、Changelog 或版本異動都另走 `plan.md` 並等待「開始」。
