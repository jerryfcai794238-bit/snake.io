---
description: 在執行複雜變更前，確保邏輯嚴密且符合預期。
---

# Workflow: Plan

## 觸發條件
- 變更影響 ≥ 2 個函數或跨越多個模組
- 涉及 AI 行為邏輯、碰撞系統、渲染管線等核心系統
- 需要新增或刪除環境物件、模式、技能

*小範圍 Bug fix（≤ 2 個函數）請改用 `/hotfix`。*

## 執行流程

1. **Research**：
   - 用 `grep_search` 定位目標函數/變數在 `game.js` 或 `config.js` 中的行號
   - 閱讀目標函數 ±30 行的上下文
   - 確認是否有 KI 或過去 Conversation 可參考

2. **Risk Assessment**：
   - 識別潛在 Breaking Change（例如：修改 `updateAI()` 會影響所有 AI 模式）
   - 確認 `strict_authorize.md` 中的授權條件是否觸發

3. **Implementation Plan**：建立 `implementation_plan.md`，包含：
   - 變更檔案清單與具體行號範圍
   - 技術選型理由
   - 潛在風險點
   - 回滾方式（哪個 commit 可以還原）

4. **Review**：等待使用者明確 `confirm` 或 `approved`

5. **Task Breakdown**：建立 `task.md`，每個子任務要可獨立驗證（語法不報錯、功能可測試）
