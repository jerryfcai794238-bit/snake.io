---
description: 產出/更新 Notion 專用 Markdown GDD，整合圖文與詳細開發規格。
---

# Workflow: Sync Notion

## Source of Truth
- **核心 GDD**：根目錄最新的 `GDD_v{version}.md`。

## 指令
- `/sync-notion` -> 產出符合 Notion 導入格式的 Markdown 文件。

## 執行流程
1. **Markdown 轉換**：將 GDD 規格轉換為 Notion 友善的格式（包含 Callouts, 表格, 標籤）。
2. **圖文整合**：在對應章節嵌入示意圖，並使用在地化的相對路徑（`images/`）。
3. **詳細化補強**：除了基礎規格，需包含詳細的碰撞矩陣、道具配額、重生邏輯等開發細節。
4. **移除冗餘**：在產出過程中移除 Changelog 等非設計規格內容。
