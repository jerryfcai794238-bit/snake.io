# Current Plan

## 目標

把 `GDD/貪食蛇GDD.md` 中 AI 相關參數的中文用詞修正為「距離」，讓 `AI_EVADE_PANIC_DISTANCE`、`AI_DASH_RESOURCE_DISTANCE` 這類欄位名稱與中文描述一致。

## 等待確認狀態

- 等待你回覆 `開始`

## 預計修改檔案

- `GDD/貪食蛇GDD.md`

## 預計步驟

1. 備份 `GDD/貪食蛇GDD.md` 到 `scratch/backups/YYYYMMDD_HHMMSS/GDD/貪食蛇GDD.md`
2. 找出中文寫成「半徑」但英文常數是 `*_DISTANCE` 的 AI 參數描述
3. 將中文描述改成「距離」
4. 檢查是否還有同類詞彙不一致

## 預期輸出

- AI 參數中文描述與英文命名一致
- 不變更真正屬於半徑的其他欄位

## 可能影響範圍

- 只影響 GDD 的少量 AI 參數說明
- 不更新版本紀錄
