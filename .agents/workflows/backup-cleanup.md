---
description: 清理本機 Agent 備份，避免 scratch/backups 長期累積。
---

# Workflow: Backup Cleanup

## 原則
- 遵循專案根目錄 `AGENTS.md`；`scratch/backups/` 僅供本機還原，不提交 Git。
- 預設保留最近 3 天的備份。
- 只處理名稱符合 YYYYMMDD_HHMMSS 的直接子目錄，不碰其他 scratch 內容。

## 執行流程
1. 唯讀列出 scratch/backups/ 下所有符合格式的備份目錄。
2. 依目前時間計算 3 天前的門檻，列出預計保留與預計刪除項目。
3. 依目前工具的 Plan UI 顯示刪除清單、影響範圍與還原限制。
4. 等待使用者依 AGENTS.md 提供有效核准。
5. 再次確認每個目標的完整路徑位於目前專案 scratch/backups/ 內。
6. 只刪除核准清單中的過期目錄。
7. 回報刪除項目、保留項目與未處理異常。

## 不做事項
- 不依 Git 狀態判斷備份是否可刪除。
- 不刪除最近 3 天內的備份。
- 不清理 scratch/backups/ 以外的檔案。
- 不自動排程；只有使用者要求清理時執行。
