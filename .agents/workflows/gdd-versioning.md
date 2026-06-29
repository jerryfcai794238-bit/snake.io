---
description: 規範重大更新時的內建計畫、GDD 進版、反向稽核與規格保全流程。
---

# Workflow: GDD Sync & Versioning

## 核心規則
- 遵循 [GDD 規格保全協議](../rules/gdd_persistence_policy.md)。
- 遵循 [GDD 反向同步協議](../rules/gdd_reverse_sync_policy.md)。
- 禁止將數值表格、綁定或參數替換為模糊文字。
- 新版 GDD 計畫需顯示於 Codex 內建 Plan UI，必須等待使用者明確回覆「開始」才能動工。
- 遵循 [Agent Safe Rules](../rules/agent_safe_rules.md)，不得誤刪既有機制區塊。

## 執行流程

### 1. 深度稽核
- 唯讀檢查程式碼與現有 GDD 數值表格。
- 比對規則、參數、UI、圖片、Icon、Map、FX、SFX 與版本資訊。

### 2. 內建計畫
- 在 Codex 內建 Plan UI 列出目標、章節、同步文件、版本策略、備份、驗證與不做事項。
- 不建立任何 Plan Markdown。
- 等待使用者明確回覆「開始」。

### 3. 備份與修改
- 收到「開始」後，先備份原始檔至 scratch/backups/YYYYMMDD_HHMMSS/<original-path>。
- 依核准範圍更新 GDD；數值、配置與狀態切換邏輯維持表格化。
- 只有使用者明確要求推版時，才更新版本、日期、版本紀錄與頁尾標記。

### 4. 驗證與完成
- 檢查關鍵字、Markdown 表格、圖片路徑、details 標籤與版本一致性。
- 提供局部 Diff 或變更摘要。
- 回報修改檔案、完成重點、備份位置與未驗證事項。
