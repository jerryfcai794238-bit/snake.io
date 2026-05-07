---
description: 統一版本發布 SOP，確保代碼、文件、簡報三者一致後再 commit。
---

# Workflow: Release

## 觸發條件
- 完成一個 MINOR 或 MAJOR 版本的功能開發，準備正式發布

## 執行流程

1. **品質把關**：
   - 執行 `/gap-audit` 確認無 🔴 HIGH 的 MISSING 項目
   - 執行 `/pre-check` 確認語法無誤、無 console.log 汙染

2. **文件進版**：
   - 執行 `/gdd-versioning` 備份舊 GDD、更新版號、寫 Changelog

3. **同步文件**：
   - 執行 `/pitchdeck-sync` 確保 Pitch Deck HTML 反映最新功能

4. **更新簡報（選用）**：
   - 若有重大視覺或機制更新，執行 `/skill-gen-html` 重新生成 HTML 簡報

5. **Git Commit**：使用 Conventional Commits 格式：
   ```
   feat(game): [功能摘要] — v{version}

   - 新增：...
   - 修改：...
   - 修復：...
   ```

## Commit 類型對照

| 類型 | 用途 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修復 |
| `docs` | 純文件更新 |
| `refactor` | 重構（無功能變化） |
| `perf` | 效能優化 |
| `chore` | 雜項（清理、設定） |
