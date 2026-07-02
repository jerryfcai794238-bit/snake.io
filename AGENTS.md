# AGENTS.md

本檔是專案 Agent 工作規則的唯一入口。

## 規則優先序

1. `AGENTS.md`：任務分級、核准、安全、備份、版本與回報。
2. [Agent 工具轉接規則](.agents/rules/agent_safe_rules.md)：Antigravity、VSCode Codex、Codex App 的 Plan 顯示與交接。
3. 任務領域規則：目前為 [GDD 標準](.agents/rules/gdd_standards.md) 與 [GDK 標準](.agents/rules/gdk_standards.md)。
4. [Workflows](.agents/workflows/)：特定任務的執行步驟。

工具執行或 patch 異常時，依 [Windows Patch Fallback](.agents/workflows/patch-fallback.md) 快速判斷與降級。

發生衝突時以前項為準；封存於 `.agents/archive/` 的文件不是有效規則。

## 回覆與任務分級

- 一律使用繁體中文，簡潔、直接、以結果為先。
- **Level 0／回答**：不讀檔、不修改；不需 Plan。
- **Level 1／唯讀調查**：可搜尋、讀取、分析與驗證；不需 Plan 或核准。
- **Level 2／可逆修改**：單一文件、少量檔案或局部程式碼修改。
- **Level 3／高影響修改**：跨模組、批次、刪除、搬移、架構、核心規格、推版或不可逆操作。

## Plan 與核准

- Level 2／3 必須先唯讀研究，再以目前工具的原生 Plan 載體展示：目標、影響範圍、步驟、備份、驗證與不做事項。
- 不為一般任務建立 `current_plan.md`、`implementation_plan.md` 或替代 Plan 檔。
- 有效核准可由兩種方式提供：使用者在聊天中明確回覆 **「開始」**；或點擊與目前 Plan 綁定、語意明確表示執行該方案的 UI 選項，例如「是，實做此方案」或「接受並開始實作」。
- 單獨的 Accept、OK、可以、confirm、approved 或一般肯定，若未明確表示執行目前 Plan，仍不算有效核准。
- 收到有效核准後才能寫檔。若範圍實質改變，原核准失效；停止、更新 Plan 並重新取得有效核准。
- 小型 hotfix 可使用精簡 Plan，但不能略過核准。

## 編輯、備份與版本

- 磁碟現況是真源；保留既有未提交變更，不使用 reset、checkout 或清理命令覆蓋它。
- 只修改核准檔案與範圍；發現連動文件時先列明，不順手擴大。
- 修改規格、GDD、美術需求、字串表、參數表、版本紀錄或 Agent 規則前，備份至 `scratch/backups/YYYYMMDD_HHMMSS/<original-path>`。
- 備份與跨工具交接資料只留本機，不提交 Git；備份清理由 [backup-cleanup](.agents/workflows/backup-cleanup.md) 管理。
- 只有使用者明確要求推版或版更時，才更新文件版本、日期、版本紀錄、頁尾標記或 Git Tag。

## 文件同步與驗證

- 文件或核心邏輯異動需檢查：規則、UI 文案、圖片、Icon、Map、FX、SFX、參數與版本是否衝突。
- 優先執行既有測試、語法、建置或 Lint；沒有自動化時檢查關鍵字、Markdown 表格、圖片路徑、`details`、Mermaid 與版本一致性。
- 完成後回報：修改檔案與章節、完成重點、驗證結果、備份位置、未驗證事項。

## 偏離與失敗處理

- 發現工作跑偏時停止擴大修改，提供保留、還原、暫放三種選項；還原前先備份目前狀態。
- 任一單一步驟執行超過 60 秒仍未完成時，必須終止該步驟並退出本次工作流程，不自動改用其他方案繼續執行；回報逾時步驟、已知原因、已完成進度與可行的後續處理方式。等待使用者、核准或外部事件不計入執行時間。
- **1385 權限錯誤預防與規避 (VSCode Codex 專屬)**：
  - 在 Windows 環境下，**VSCode Codex** 的標準沙箱程序啟動路徑已知會觸發 `CreateProcessWithLogonW 1385`；不得先嘗試該路徑。
  - **命令執行**：VSCode Codex 必須直接使用工具提供的沙箱外執行／權限核准機制，不先嘗試標準沙箱路徑。
  - **寫檔操作**：VSCode Codex 不調用原生 `apply_patch`；必須直接依 [Windows Patch Fallback](.agents/workflows/patch-fallback.md) 建立 UTF-8 patch 至 `scratch/`，並透過沙箱外執行／權限核准機制執行 fallback 腳本。
  - 若沙箱外執行／權限核准機制不可用或 fallback 再度觸發 `1385`，立即停止自動操作，並在對話中提供完整命令或 patch 供使用者手動執行。
- **1385 熔斷與降級機制 (Antigravity 與其他通用)**：
  - **Antigravity** 預設優先使用原生高效工具，不受上述 VSCode Codex 的預防性禁用限制。
  - 若任何 Agent 在執行過程中意外觸發 `1385` 錯誤，最多僅允許嘗試 1 次 Fallback。若 Fallback 失敗或再度觸發 `1385`，**必須立即終止任務、熔斷退回**，嚴禁重複嘗試、變更 Plan 重寫或自主生成代碼繞過。應將待修改內容/命令轉為 Markdown 代碼區塊呈現給使用者，引導手動執行。
- Codex CLI 單批 patch 上限為 24,000 字元；超限時先按檔案、再按獨立 hunk 拆分。每批成功後立即唯讀驗證，任一批失敗即停止。
