# AGENTS.md

本檔是專案 Agent 工作規則的唯一入口。本專案 Agent 主要負責「討論遊戲開發方向」、「建立可驗證 prototype」、「撰寫／修改 GDD」與「維護 GDK／資料表」。

## 規則優先序

1. `AGENTS.md`：專案定位、規則入口、優先序與衝突原則。
2. [Plan 與核准規則](.agents/rules/plan_and_approval_rules.md)：任務分級、Plan 展示、有效核准、不同工具的 Plan 顯示與跨工具交接。
3. [GDD／GDK Agent 規則](.agents/rules/gdd_agent_rules.md)：GDD 任務流程、GDD 內容標準、GDK／DataTable 標準與領域驗證。
4. [Prototype Agent 規則](.agents/rules/prototype_agent_rules.md)：prototype 任務流程、讀寫節制、快速迭代與同步邊界。
5. [編輯、備份與版本規則](.agents/rules/editing_backup_versioning.md)：寫檔範圍、備份、版本、Git Tag 與磁碟真源。
6. [驗證與回報規則](.agents/rules/verification_reporting.md)：完成前驗證、連結檢查、GDD／GDK／prototype 驗證與完成回報。
7. [偏離與失敗處理規則](.agents/rules/failure_handling.md)：卡住、跑偏、工具失敗、Windows 沙箱、fallback 與熔斷。
8. [Workflows](.agents/workflows/)：特定任務的執行步驟。

發生衝突時以前項為準；不存在的 rules 或 workflows 不得當成有效規則追蹤。

## 最小工作契約

- 一律使用繁體中文，簡潔、直接、以結果為先。
- 將使用者視為專業協作者；先給結論，再補必要依據。
- 只要任務需要 Plan，必須先向使用者展示可見 Plan，不能只做內部計畫。
- Level 2／3 任務收到有效核准前不得寫檔；有效核准依 [Plan 與核准規則](.agents/rules/plan_and_approval_rules.md) 判定。
- 修改 GDD、GDK、規格、版本紀錄、Agent 規則或其他高影響文件前，必須先依 [編輯、備份與版本規則](.agents/rules/editing_backup_versioning.md) 建立本機備份。
- 任一單一步驟超過 60 秒仍未完成時，依 [偏離與失敗處理規則](.agents/rules/failure_handling.md) 停止該步驟並回報，不以重試或改寫計畫規避。