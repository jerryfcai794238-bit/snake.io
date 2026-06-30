# AGENTS.md

本檔是專案 Agent 工作規則的唯一入口。

## 規則優先序

1. `AGENTS.md`：任務分級、核准、安全、備份、版本與回報。
2. [Agent 工具轉接規則](.agents/rules/agent_safe_rules.md)：Antigravity、VSCode Codex、Codex App 的 Plan 顯示與交接。
3. 任務領域規則：目前為 [GDD 標準](.agents/rules/gdd_standards.md) 與 [GDK 標準](.agents/rules/gdk_standards.md)。
4. [Workflows](.agents/workflows/)：特定任務的執行步驟。

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
- 唯一有效核准詞是使用者明確回覆 **「開始」**；Accept、OK、可以、confirm、approved 或直接要求實作都不算。
- 收到「開始」後才能寫檔。若範圍實質改變，停止、更新 Plan 並重新等待「開始」。
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
- `apply_patch` 若遇到 `CreateProcessWithLogonW 1385`，原方式只重試一次；仍失敗時依環境定位可執行的 Codex CLI，以 `--codex-run-as-apply-patch` 套用 patch。
- 不透過 PowerShell pipeline 傳遞中文 patch；成功後立即唯讀驗證。
