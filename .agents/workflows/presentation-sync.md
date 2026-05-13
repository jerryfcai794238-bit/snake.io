---
description: 整合 Pitch Deck HTML 與 Notion 簡報產出，確保視覺呈現與 GDD 同步。
---

# Workflow: Presentation Sync

## Source of Truth
- **核心 GDD**：根目錄最新的 `GDD_v{version}.md`。

## 指令
- `/presentation-sync html` -> 更新/產出 HTML Pitch Deck。
- `/presentation-sync notion` -> 產出 Notion Markdown 格式。

## 執行流程
1. **同步內容**：將 GDD 中的最新表格與機制同步至 HTML 的各個 Section。
2. **版本更新**：同步 HTML/Notion 中的版號與 Last Update 日期。
3. **資源核對**：確認 `image/` 或相關目錄內的圖檔路徑正確。
4. **清理**：刪除舊版的簡報資料夾，僅保留最新版。
