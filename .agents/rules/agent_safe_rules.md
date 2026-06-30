# Agent 工具轉接與交接規則

本檔只定義不同 Agent 工具如何呈現 Plan 與交換進度；任務分級、核准、備份和版本規則以專案根目錄 `AGENTS.md` 為準。

## 共通契約

- Level 2／3 必須先展示可由使用者看見的 Plan。
- 唯一有效核准詞是使用者在對話中明確回覆 **「開始」**。
- UI 的 Accept／Confirm、OK、可以或直接要求實作，都不能取代「開始」。
- Plan 至少包含：目標、影響範圍、步驟、備份、驗證、不做事項。
- 一般任務不建立工作區 Plan Markdown；只有明確跨工具交接時才產生本機 handoff。

## Antigravity

- 使用 Antigravity 原生 Artifact／Planning UI 顯示 Plan，並在對話中提示使用者檢視。
- Artifact 是工具內計畫載體，不得把 `implementation_plan.md` 當成專案規格提交。
- 收到「開始」後才執行；同一核准範圍內的錯誤修復可繼續，架構或範圍改變時重新規劃。

## VSCode Codex

- 優先使用擴充套件的 Plan Mode／Plan UI。
- 若目前版本沒有原生 Plan UI，降級為 Chat 內的 `## 計畫` Markdown 區塊。
- 即使 UI 有 Accept／Confirm，仍須在 Chat 收到「開始」。
- 不建立 `current_plan.md`、`implementation_plan.md` 或 `task.md`。

## Codex App

- 使用 App 可渲染的 `<proposed_plan>` 區塊呈現完整 Plan。
- Plan 完成後等待使用者在 Chat 回覆「開始」。
- 不建立替代 Plan 檔案。

## 跨工具交接

只有使用者明確要求切換工具時，才建立或更新 `scratch/handoffs/current.md`。該資料夾由 `.gitignore` 排除。

交接檔固定包含：

1. 來源工具、目標工具與更新時間。
2. 任務目標與已核准範圍。
3. 「開始」核准狀態。
4. 已完成項目與已修改檔案。
5. 備份位置與驗證結果。
6. 未完成項目、已知問題與禁止擴大範圍。

接手工具必須先讀取 `AGENTS.md`、handoff、實際檔案與工作區 diff：

- 範圍未變且 handoff 明確記錄已收到「開始」：可續做未完成項目。
- 範圍、架構或目標改變：重新展示 Plan 並等待新的「開始」。
- 不重做已完成項目，不把 handoff 當成取代磁碟現況的真源。
