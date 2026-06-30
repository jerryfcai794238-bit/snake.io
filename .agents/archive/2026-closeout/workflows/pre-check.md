---
description: 在提交或運行前，確保環境與基本語法正確。
---

# Workflow: Pre-check

## 檢查清單

1. **語法檢查**：
   - 執行該專案語言對應的語法檢查（例如 JavaScript/Node.js 可使用 `node --check <file>`，Python 可使用 `python -m py_compile <file>` 等）。

2. **核心檔案完整性**：
   - 確認專案的關鍵檔案與進入點存在。

3. **除錯語句清理 (Console Pollution)**：
   - 搜尋程式碼中是否殘留暫時性的偵錯輸出（例如：`console.log`, `print`, `debugger` 等），視情況移除或註解。

4. **代碼風格與排版**：
   - 確保縮排、引號與格式符合專案的排版工具設定（如 Prettier, ESLint, Black 等）。

5. **資源與路徑驗證**：
   - 掃描靜態資源、依賴路徑或環境變數設定，確認無死路徑或失效的連結。

6. **版本一致性**：
   - 確認專案配置文件（如 `package.json`, `setup.py`）中的版本號與 `Changelog.md` 最新條目一致。
