---
description: 使用者明確要求推版時，統一執行稽核、版本同步、建置與選定的 Git 發布動作。
---

# Workflow: Release

## 觸發條件
- 只有使用者明確要求「推版」「版更」或指定發布版本時才執行。
- 完成功能或修復 Bug 本身不會自動觸發版本、Changelog、Commit 或 Tag。
- Release 是 Level 3，先展示 Plan 並等待「開始」。

## 執行流程

1. **定義範圍**：
   - 確認目標版本、交付內容、同步文件，以及是否包含 Commit、Tag、Push。

2. **收尾稽核**：
   - 執行 [final-audit](final-audit.md)，解決或明列阻擋問題。

3. **版本與文件同步**：
   - 依核准範圍同步專案版本、GDD 版本、更新日期、版本紀錄與頁尾標記。
   - 核對程式、文件、GDK、字串、美術／音效需求與簡報。

4. **驗證輸出**：
   - 執行可用測試、語法檢查、建置與必要的畫面／文件檢查。

5. **Git 發布**：
   - 只有 Plan 明列且使用者已核准時才 Commit；訊息使用 Conventional Commits：
     ```bash
     git commit -m "feat(scope): [功能摘要] — v{version}"
     ```
   - 只有 Plan 明列且使用者已核准時才建立 Git Tag；Push 亦需明確列入：
     ```bash
     git tag -a v{version} -m "Release v{version}"
     ```

## 完成條件

- 版本號與文件標記一致。
- 自動化與人工驗證結果已記錄。
- 回報 Commit／Tag／Push 實際完成狀態；未執行的動作不得宣稱完成。
