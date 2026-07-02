---
description: Windows 下程序啟動失敗時的快速分流，以及 apply_patch 無法啟動時的 UTF-8 降級套用流程。
---

# Workflow: Windows Patch Fallback

## 觸發

- VSCode Codex 在已知會觸發 `1385` 的環境執行寫檔；此情況直接使用本流程，不先呼叫原生 `apply_patch`。
- 任一工具出現 `CreateProcessWithLogonW 1385`。
- 標準 `apply_patch` 無法啟動，或 Codex CLI patch 遇到 Windows 命令長度限制。
- patch 內容包含中文、長段 GDD 或多檔案修改，需避免 shell quoting 與編碼損壞。

## 快速判斷

1. 若錯誤含 `CreateProcessWithLogonW 1385`，視為程序啟動層失敗，不調整 patch 內容。
2. 不重試相同程序啟動路徑；唯讀、驗證與一般命令直接改用工具提供的沙箱外執行／權限核准機制。
3. VSCode Codex 在已知環境進行寫檔時直接使用下方 UTF-8 patch fallback；其他 Agent 只有在實際寫檔且標準 `apply_patch` 無法啟動時才使用。
4. 若 CLI 回報 `Invalid patch`，才檢查 patch 邊界與格式。
5. 若回報 context mismatch 或找不到檔案，視為內容衝突；停止並重新讀取磁碟現況，不盲目重試。

## 執行流程

1. 確認任務需要寫檔、已依 AGENTS.md 取得有效核准，且應備份的既有檔案已備份；唯讀或一般命令不得進入本流程。
2. 將 patch 以 UTF-8 寫入 `scratch/` 下的暫存檔，不使用 PowerShell pipeline 傳遞中文內容。
3. 執行：

   ```powershell
   & .agents/scripts/Invoke-CodexApplyPatchFallback.ps1 -PatchFile <patch-file>
   ```

4. 腳本依 `*** Add File`、`*** Update File`、`*** Delete File` 操作分批；每批不得超過 24,000 字元。
5. 單一檔案操作超限時，先人工拆成可獨立套用的 hunk，再重新執行；不得截斷 patch。
6. 若修改內容本身包含完整的 Begin Patch／End Patch marker 字串，應在程式碼中拆字串組合，避免 CLI parser 將內容誤認為外層邊界。
7. 每批成功後立即唯讀確認目標內容；任一批失敗即停止，保留已成功批次並回報狀態。
8. 全部完成後執行任務原定的全文同步、語法、測試或文件驗證。

## 禁止事項

- 不因工具故障跳過 Plan、有效核准、備份或核准範圍。
- 不使用 PowerShell pipeline、命令插值或多層引號直接承載中文 patch。
- fallback 腳本維持 ASCII 原始碼，以相容 Windows PowerShell 5.1；繁中說明留在本 workflow。
- 不重複嘗試已確認會觸發 `1385` 的同一程序啟動路徑。
- 不為了通過長度限制刪減 context、截斷操作或合併未驗證批次。

## 回報

- 記錄標準方式的失敗類型、fallback 批次數、各批目標與退出碼。
- 完成回報仍依 `AGENTS.md` 列出修改、驗證、備份與未驗證事項。
