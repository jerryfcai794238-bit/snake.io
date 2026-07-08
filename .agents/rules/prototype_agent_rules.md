# Prototype Agent 規則

本檔定義 prototype 任務流程、讀寫節制、快速迭代與同步邊界。GDD／GDK 規則集中於 [GDD／GDK Agent 規則](gdd_agent_rules.md)。

## 專案定位

- Prototype 任務以「可跑、可驗證、可回報」為優先。
- 預設目標是快速測試玩法、手感、規則可行性或互動流程，不是一次完成正式架構。
- 除非使用者明確要求，不自動推版、不重寫 GDD、不擴大成完整重構。

## 任務流程

1. 先確認 prototype 的最小成功條件：可玩目標、驗證方式、涉及檔案與不做事項。
2. 只讀取與 prototype 直接相關的程式、資源、GDD 章節或參數。
3. Level 2／3 修改依 [Plan 與核准規則](plan_and_approval_rules.md) 展示 Plan 並等待有效核准。
4. 收到有效核准後先依 [編輯、備份與版本規則](editing_backup_versioning.md) 備份需要修改的高影響文件。
5. 實作以最小可玩迭代為主，避免順手重構無關系統。
6. 完成後依 [驗證與回報規則](verification_reporting.md) 回報可驗證結果與未驗證事項。

## 讀寫節制

- 不掃描無關資料夾、舊輸出、備份或 scratch 暫存，除非任務明確需要。
- 不重複讀取相同大型檔案；若需要再確認，只查關鍵片段。
- 不因 prototype 成功就自動同步 GDD、GDK、版本紀錄或 Changelog。
- 若 prototype 需要正式化為 GDD 或 GDK，必須另走 GDD／GDK Plan，並使用 [GDD／GDK Agent 規則](gdd_agent_rules.md)。

## 驗證重點

- 優先執行既有測試、語法檢查、建置或可用的本地啟動流程。
- 若沒有自動化測試，至少回報人工驗證路徑、可觀察結果與限制。
- 若畫面、輸入、碰撞、AI、數值或資源有變更，完成回報需列出已驗證與未驗證項目。