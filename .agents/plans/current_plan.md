# Current Implementation Plan

## 任務

將剛才討論的流程優化規範加入 `.agents/rules/`，讓後續 Codex 工作流程更順暢且更可預期。

## 影響範圍

- 預計修改：`.agents/rules/agent_safe_rules.md`
- 不修改：GDD、程式碼、CSV、圖片、其他 rules 檔案

## 將讀取的檔案

- `.agents/rules/agent_safe_rules.md`

## 將修改的檔案

- `.agents/rules/agent_safe_rules.md`

## 備份策略

- 修改前備份原檔到 `scratch/backups/YYYYMMDD_HHMMSS/.agents/rules/agent_safe_rules.md`

## 預計新增規範

1. 任務分級規則：
   - Level 0：純回答/解釋，不需 plan。
   - Level 1：讀檔/檢查/整理，需簡短 plan，確認後執行。
   - Level 2：修改單一文件或少量檔案，需 plan、備份、diff。
   - Level 3：改程式碼、批次改名、刪除/搬移檔案、架構影響，需詳細 plan、備份、驗證。
2. 固定 plan 格式：
   - 任務
   - 影響範圍
   - 將讀取的檔案
   - 將修改的檔案
   - 備份策略
   - 執行步驟
   - 驗證方式
   - 不做的事
   - 等待確認
3. GDD 更新分類：
   - Minor note：補充說明，不一定 bump 版本。
   - Spec change：改玩法/數值/UI 規格，需版本與日期更新。
   - Major revision：新增章節、替換系統、重構規格，需 changelog 與版本標記。

## 執行步驟

1. 建立備份資料夾。
2. 備份 `.agents/rules/agent_safe_rules.md`。
3. 讀取原檔內容。
4. 在「工作流程控制」章節後新增流程優化規範。
5. 讀回檔案確認新增內容存在。
6. 回報修改摘要與備份位置。

## 驗證方式

- 確認 `agent_safe_rules.md` 內包含：
  - `任務分級`
  - `固定 Plan 格式`
  - `GDD 更新分類`
- 確認備份檔存在。

## 不做的事

- 不修改 GDD。
- 不修改程式碼。
- 不改寫其他 rules。
- 不刪除任何檔案。

## 等待確認

請使用者回覆「確認」或「開始」後再執行。
