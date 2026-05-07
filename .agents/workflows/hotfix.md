---
description: 快速修復已知的小範圍 Bug，不需要完整計畫流程。
---

# Workflow: Hotfix

## 適用條件
- 影響範圍 ≤ 2 個函數
- Bug 原因已明確，不需要架構變更
- **不適用**：新功能、跨模組重構 → 改用 `/plan`

## 執行流程

// turbo
1. **定位**：`grep_search` 找到目標函數行號

2. **確認**：閱讀目標函數 ±20 行上下文，確認 Bug 根因

3. **修改**：直接修改，保持最小 diff（不重構無關代碼）

// turbo
4. **語法驗證**：`node --check game.js` 確認無語法錯誤

5. **記錄**：在 `NeonSnake_Changelog.md` 頂部新增 PATCH 條目：
   ```
   ### v{x.x.+1} ({日期})
   - fix: [Bug 描述] (game.js:L{行號})
   ```

## 注意
- 不建立 `implementation_plan.md`（節省 context）
- 若修完發現影響範圍超出預期 → 停止，改走 `/plan`
