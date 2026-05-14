---
description: 更新/產出 HTML Pitch Deck，確保視覺呈現與核心 GDD 同步。
---

# Workflow: Sync HTML

## Source of Truth
- **核心 GDD**：根目錄最新的 `GDD_v{version}.md`。

## 指令
- `/sync-html` -> 執行 HTML 簡報內容與樣式同步。

## 執行流程
1. **內容對齊**：將 GDD 中的最新機制、表格與數值同步至 HTML 的各個 Section。
2. **樣式優化**：根據最新設計風格（如 Nintendo 式卡片、進度條）調整 CSS 佈局。
3. **資源連結**：確保 `images/` 目錄內的圖檔路徑在 HTML 中正確引用。
4. **清理舊版**：確保資料夾內僅保留最新的 `index.html`。
