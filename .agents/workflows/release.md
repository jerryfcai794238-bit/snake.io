---
description: 統一版本發布 SOP，確保代碼、文件、簡報三者一致後再 commit。
---

# Workflow: Release

## 觸發條件
- 完成一個階段性功能開發、Bug 修復，或準備發布正式版本

## 執行流程

1. **品質把關**：
   - 執行對應的單元測試與程式碼審查。
   - 執行 `/pre-check` 確認無基本語法錯誤與偵錯語句殘留。

2. **版本與文件更新**：
   - 更新專案的版本號（如 `package.json` 或專案設定檔）。
   - 在 `Changelog.md` 中記錄本次版本的修改內容（新增、修改、修復）。

3. **專案同步與建置**：
   - 若專案需要編譯或打包（如 Build 流程），先執行建置並驗證輸出是否正常。

4. **Git 提交與標籤 (Tag)**：
   - 使用 Conventional Commits 格式進行提交：
     ```bash
     git commit -m "feat(scope): [功能摘要] — v{version}"
     ```
   - 如有需要，建立對應版本的 Git Tag：
     ```bash
     git tag -a v{version} -m "Release v{version}"
     ```

## Commit 類型對照

| 類型 | 用途 |
| :--- | :--- |
| `feat` | 新增功能 |
| `fix` | Bug 修復 |
| `docs` | 文件異動 |
| `refactor` | 重構（無功能/介面變化） |
| `perf` | 效能優化 |
| `chore` | 雜務（建置流程、相依套件更新、設定檔變更） |
