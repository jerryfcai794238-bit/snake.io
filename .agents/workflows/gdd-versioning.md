---
description: 規範重大更新時的 GDD 歸檔、進版與 Old GDD 搬移流程。
---

# Workflow: GDD Versioning (GDD 版本管理)

## 版本號規則（Semantic Versioning）

| 類型 | 範例 | 觸發情境 |
|------|------|---------|
| **PATCH** `x.x.+1` | `v1.3.0 → v1.3.1` | Bug fix、文字修正、數值微調 |
| **MINOR** `x.+1.0` | `v1.3.0 → v1.4.0` | 新功能、新機制、新模式 |
| **MAJOR** `+1.0.0` | `v1.3.0 → v2.0.0` | 核心玩法大改、系統重構 |

*純字詞修正不需執行此流程。*

## 觸發條件
- MINOR 或 MAJOR 等級的 GDD 內容更新

## 執行動作

1. **備份當前版本**：
   - 將根目錄的 `NeonSnake_GDD.md` 複製至 `Old GDD/` 並重新命名為 `GDD_v{舊版號}.md`

2. **進版與更新**：
   - 更新根目錄 `NeonSnake_GDD.md` 頂部標題的版號
   - 在文件頂部（或末尾）加入變更摘要區塊：
     ```
     ## Changelog - v{新版號} ({日期})
     - 新增：...
     - 修改：...
     - 移除：...
     ```

3. **同步 Changelog**：
   - 在 `NeonSnake_Changelog.md` 頂部新增版本條目，與 GDD 摘要一致

4. **清理根目錄**：
   - 根目錄**只保留** `NeonSnake_GDD.md`（現行活躍版）
   - 舊版的 `GDD_v*.md` 若留在根目錄則搬移至 `Old GDD/`

## 目錄結構規範

```
snake-battle/
├── NeonSnake_GDD.md          ← 唯一活躍 GDD（source of truth）
├── NeonSnake_Changelog.md
└── Old GDD/
    ├── GDD_v1.2.7.md
    └── GDD_v1.3.0.md
```
