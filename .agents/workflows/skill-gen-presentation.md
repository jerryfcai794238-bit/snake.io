---
description: 將當前 GDD 版本製作成簡報並打包，支援 HTML 互動版與 Notion Markdown 版。
---

# Skill: Generate Presentation

## 用法
- `/skill-gen-presentation html` → 產出 HTML Pitch Deck
- `/skill-gen-presentation notion` → 產出 Notion Markdown

## 共用步驟

1. **識別版本**：讀取根目錄 `NeonSnake_GDD.md` 頂部版號（source of truth）

2. **前置確認**：確認 `NeonSnake_Changelog.md` 最新條目版號與 GDD 一致

3. **建立資料夾**：
   - HTML：`presentation_html_v{version}/`
   - Notion：`presentation_notion_v{version}/`
   - **自動刪除**同格式的舊資料夾，只保留最新版

4. **生成視覺**：
   - 參考現有 `presentation_notion/mechanic.png` 的 3D 霓虹風格
   - 生成封面圖（蛇身 + 領地效果）與各機制示意圖

## 格式分支

| 步驟 | HTML | Notion |
|------|------|--------|
| 主文件 | `index.html` | `GDD_v{version}_Notion.md` |
| 風格 | 深色霓虹主題、滑入動畫、Hover 高亮 | H1/H2/Toggle/Table，相對路徑圖片引用 |
| 圖片 | 內嵌或路徑引用 | `cover.png`, `mechanics.png`, `skills.png` |
| 獨立性 | CSS/JS 內嵌，不依賴外部 CDN | 所有資產在資料夾內 |

## 涵蓋章節
設計核心 → 遊戲模式 → 環境物件 → 技能系統 → AI 行為 → 大地圖模式
