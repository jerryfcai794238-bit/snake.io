---
description: 規範重大更新時的實作計畫同步、GDD 進版與規格保全流程。
---

# Workflow: GDD Versioning (GDD 版本管理)

## 核心規則
- **不再使用 NEON 開頭的檔案命名方式**。
- **根目錄僅保留一個最新的 `GDD_v{版本號}.md`**（Single Source of Truth）。
- **禁止規格簡化**：更新 GDD 時，必須確保舊有的機制（如核心碰撞、UI 參數、特殊邏輯）被完整保留或在正確對應處更新，不得因新增功能而導致舊規格丟失。

## 執行流程

### 1. 計畫與執行 (Planning & Execution)
- 在開發任何 MAJOR 或 MINOR 功能前，必須先建立並通過 `implementation_plan.md`。
- 確保代碼實作與計畫內容完全吻合。

### 2. GDD 更新與進版 (Update & Versioning)
- **同步實作規則**：實作完成後，將 `implementation_plan.md` 中的功能細節完整同步至 GDD。
- **進版動作**：
  - 將根目錄原本的 `GDD_v{舊版號}.md` **重新命名**為 `GDD_v{新版號}.md`。
  - 修改文件內部的標題版本號與日期。
  - 更新文件頂部的 `Changelog` 摘要。

### 3. 檔案搬移與清理 (Cleanup)
- 將「前一個版本」的 GDD 文件（如有備份留在根目錄）搬移至 `Old GDD/` 目錄中封存。
- 更新根目錄的 `Changelog.md`（統一彙整所有版本的變更紀錄）。

## 目錄結構規範範例

```
snake.io/
├── GDD_v4.0.0.md             ← 當前活躍 GDD
├── Changelog.md              ← 歷史變更彙整
└── Old GDD/                  ← 歷史版本歸檔區
    ├── GDD_v3.6.5.md
    └── GDD_v3.6.6.md
```
