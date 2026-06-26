# Current Plan

## 目標
修正 `GDD/貪食蛇GDD.md` 中 Ch9.2 的參數名稱，讓「反應延遲、轉彎精準度、衝刺機率、避險半徑、追逐半徑、追擊距離緩衝倍率、追擊中止時間」等名稱與 Ch16.2 `AIStrategy` 表欄位名稱一致。

## 等待確認狀態
已收到「開始」，已完成修改與驗證。

## 已修改檔案
- `GDD/貪食蛇GDD.md`

## 實際步驟
1. 已讀取 Ch9.2 與 Ch16.2 `AIStrategy` 表頭，確認欄位名稱與中文企劃名。
2. 已備份 `GDD/貪食蛇GDD.md` 到 `scratch/backups/20260626_163312/GDD/貪食蛇GDD.md`。
3. 已將 Ch9.2 的參數條目名稱對齊 Ch16.2 表頭與企劃名：`ReactionDelay`、`SteeringPrecision`、`DashProbability`、`EvadeRadius`、`ChaseRadius`、`ChaseLeashRatio`、`ChaseAbortTime`。
4. 已同步調整 Ch9.2 公式、範例與五大策略 AI 強度控制配置矩陣表頭中的參數名。
5. 已驗證 Ch9.2 與 Ch16.2 關鍵參數名稱一致、Markdown 表格、圖片路徑與 `<details>` 平衡。

## 預期輸出
- Ch9.2 的參數名稱與 Ch16.2 `AIStrategy` 表一致。
- 不修改非 Ch9.2 / Ch16.2 相關內容。

## 可能影響範圍
- Ch9.2 參數條目標題與說明文字。
- 少量 Ch9.2 範例文字中的參數名稱。

## 驗證結果
- Ch9.2 指定範圍未再命中舊名稱：`AI_REACTION_DELAY`、`AI_STEERING_PRECISION`、`AI_DASH_PROB`、`AI_EVADE_RADIUS`、`AI_CHASE_RADIUS`、`Reaction Delay`、`Steering Precision`、`衝刺決策機率`、`避險檢測半徑`、`追逐／尋路半徑`。
- Ch9.2 配置矩陣：每列 6 欄，一致。
- Ch16.2 `AIStrategy` 表：每列 19 欄，一致。
- `<details>`：6/6 平衡。
- 圖片路徑：檢查 31 個引用，未發現缺檔。

## 備份位置
- `scratch/backups/20260626_163312/GDD/貪食蛇GDD.md`

## 未驗證事項
- 未進行 Markdown 預覽器實際點擊測試；本次未新增或修改跳轉目標。