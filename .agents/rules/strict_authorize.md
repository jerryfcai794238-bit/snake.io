# Strict Authorize Protocol

## 授權原則
- **DESTRUCTIVE ACTIONS**: 涉及刪除檔案、清空目錄或變更 Git 歷史的動作，必須獲得明確授權。
- **BACKGROUND PROCESS**: 啟動長期運行的後台進程時，需告知埠號與監控方式。
- **SYSTEM CONFIG**: 變更環境變數或安裝全域依賴前，先行回報影響範圍。

## 執行流程
1. 識別潛在風險。
2. 提出具體影響報告。
3. 等待使用者 `confirm` 或 `approved` 關鍵字。
