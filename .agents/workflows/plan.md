---
description: 使用 Codex 內建 Plan Mode 規劃複雜或高影響變更。
---

# Workflow: Native Plan

## 觸發條件
- Level 2 可逆修改。
- Level 3 跨模組、核心邏輯、規格、批次或不可逆修改。
- 使用者主動要求先規劃。

純回答與唯讀調查不需觸發 Plan；小範圍修正仍可使用 /hotfix，但實際修改前同樣遵守核准規則。

## 執行流程

1. **Research**
   - 先以唯讀方式搜尋目標符號、檔案與相關規格。
   - 閱讀足夠上下文並確認目前工作區狀態。
   - 不為了規劃而建立或修改任何檔案。

2. **Risk Assessment**
   - 判定 Level 2 或 Level 3。
   - 識別 breaking change、連動文件、備份需求與回滾方式。

3. **Native Plan**
   - 直接在 Codex 內建 Plan UI 顯示計畫。
   - 必須包含目標、影響範圍、執行步驟、備份策略、驗證方式與不做事項。
   - 不建立 current_plan.md、implementation_plan.md、task.md 或任何替代文件。

4. **Approval**
   - 等待使用者明確回覆「開始」。
   - 其他肯定詞或要求實作的說法不視為核准。

5. **Execution**
   - 收到「開始」後依 Plan 備份、修改及驗證。
   - 若範圍實質改變，停止修改、更新內建 Plan，重新等待「開始」。

6. **Completion**
   - 回報修改檔案、完成重點、備份位置與未驗證事項。
