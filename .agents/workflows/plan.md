---
description: Level 2／3 修改的統一研究、規劃、核准、執行與完成流程。
---

# Workflow: Plan

## 觸發

- Level 2／3 修改，或使用者主動要求規劃。
- 小型 hotfix 仍屬 Level 2，可縮短 Plan，但不可跳過有效核准。
- Level 0／1 不需 Plan。

## 流程

1. **研究**
   - 唯讀搜尋目標、規格、相依與工作區狀態。
   - 確認現況、真源、風險與未知事項，不為規劃寫檔。
2. **分級**
   - 依 [Plan 與核准規則](../rules/plan_and_approval_rules.md) 判定 Level 2／3。
   - 列出連動文件、備份需求、回滾方式及不可逆影響。
3. **顯示 Plan**
   - 使用目前工具的原生 Plan 載體。
   - 包含目標、影響範圍、步驟、備份、驗證、不做事項。
4. **核准**
   - 等待 Plan UI 明確開始，或聊天明確「開始」。
   - 一般 Accept、OK 或肯定若未明確表示執行目前 Plan，不構成有效核准。
5. **執行**
   - 依 [編輯、備份與版本規則](../rules/editing_backup_versioning.md) 先備份，再按核准範圍做最小修改。
   - 範圍或架構改變時原核准失效；停止、更新 Plan 並重新取得有效核准。
6. **驗證與回報**
   - 依 [驗證與回報規則](../rules/verification_reporting.md) 執行驗證。
   - 回報修改檔案／章節、重點、驗證、備份與未驗證事項。

## 跨工具

只有使用者明確要求切換工具時，依 [Plan 與核准規則](../rules/plan_and_approval_rules.md) 建立 `scratch/handoffs/current.md`；一般任務不建立 Plan 或 handoff 檔。