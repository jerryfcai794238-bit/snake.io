---
description: 規範重大更新時的實作計畫同步、GDD 進版與規格保全流程。
---

# Workflow: GDD Versioning (GDD 版本管理)

## 核心規則
- **遵循 [GDD 規格保全協議](file:///c:/Users/fanchunkao/Documents/Antigravity/snake.io/.agents/rules/gdd_persistence_policy.md)**：更新時必須確保舊有機制完整繼承。
- **不再使用 NEON 開頭的檔案命名方式**。
- **根目錄僅保留一個最新的 `GDD_v{版本號}.md`**（Single Source of Truth）。
- **禁止規格簡化**：嚴禁將具體的數值表格、按鍵綁定或 UI 參數替換為模糊的文字描述。

## 執行流程

### 1. 深度讀取與比對 (Pre-check & Audit)
- **讀取全檔**：必須完整讀取 `GDD_v{舊版號}.md`。
- **提取清單**：提取所有表格與核心數值參數作為「必須保留清單」。

### 2. 計畫與執行 (Planning & Execution)
- 在開發任何 MAJOR 或 MINOR 功能前，必須先建立並通過 `implementation_plan.md`。
- 確保代碼實作與計畫內容完全吻合。

### 3. GDD 更新與進版 (Update & Versioning)
- **同步實作規則**：實作完成後，將 `implementation_plan.md` 中的功能細節完整同步至 GDD。
- **繼承舊規格**：將「必須保留清單」中的內容完整搬移至新版本對應章節。
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
