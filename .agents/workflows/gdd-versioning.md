---
description: 規範重大更新時的實作計畫同步、GDD 進版、反向稽核與規格保全流程。
---

# Workflow: GDD Sync & Versioning

## 核心規則
- **遵循 [GDD 規格保全協議](file:///c:/Users/fanchunkao/Documents/Antigravity/snake.io/.agents/rules/gdd_persistence_policy.md)**。
- **遵循 [GDD 反向同步協議](file:///c:/Users/fanchunkao/Documents/Antigravity/snake.io/.agents/rules/gdd_reverse_sync_policy.md)**。
- **禁止規格簡化**：嚴禁將數值表格、綁定或參數替換為模糊文字。
- **核准機制**：新版 GDD 產出後，必須等待使用者說「OK」或「開始」才能動工。
- **編輯保全**：遵循 [Agent Safe Rules: EDIT SAFETY](file:///c:/Users/fanchunkao/Documents/Antigravity/snake.io/.agents/rules/agent_safe_rules.md)，嚴禁誤刪已存在的機制區塊。

## 執行流程

### 1. 深度稽核 (Reverse Audit)
- 讀取 `src/constants.js` 與 `src/game.js`。
- 比對現有 GDD 中的數值表格，確保無衝突。

### 2. 計畫與產出 (Planning & Draft)
- 根據需求或代碼變更更新 GDD 內容。
- **本機備份第一**：在寫入或覆寫檔案前，強制備份原始檔至 `scratch/backups/`，並在對話中主動回報備份路徑。
- **表格化要求**：所有數值、配置、狀態切換邏輯必須以表格呈現。
- 將根目錄 `GDD_v{舊版號}.md` 重新命名為 `GDD_v{新版號}.md`（或產出新檔並存入 Old GDD）。

### 3. 等待核准 (Mandatory Wait)
- 向使用者展示 GDD 變更之 Diff 報告，說明具體異動範圍，確保沒有非預期文字受影響。
- **停手等待**。

### 4. 執行與清理 (Execution)
- 收到「OK/開始」後，開始修改代碼。
- **透明變更驗證**：修改完畢後貼出前後代碼 Diff 區塊。
- 更新 `Changelog.md`。
- 將舊版 GDD 移至 `Old GDD/` 目錄。
