# 實作計畫 (Current Plan)

## 目標
修正 `GDD/貪食蛇GDD.md` 中的 AI 追擊距離緩衝公式，將 `ChaseRadius * ChaseLeashRatio / 10000` 修正為 `ChaseRadius * (1 + ChaseLeashRatio / 10000)`。

## 等待確認狀態
等待使用者回覆「開始」以進行修改。

## 預計修改檔案
- [MODIFY] `GDD/貪食蛇GDD.md` (c:\Users\fanchunkao\Documents\MyProject\snake.io\GDD\貪食蛇GDD.md)

## 預計步驟
1. 備份當前 `GDD/貪食蛇GDD.md` 至 `scratch/backups/YYYYMMDD_HHMMSS/GDD/貪食蛇GDD.md`。
2. 修改 `GDD/貪食蛇GDD.md` 中的三處公式：
   - 第 1079 行：將 `ChaseRadius * ChaseLeashRatio / 10000` 修正為 `ChaseRadius * (1 + ChaseLeashRatio / 10000)`。
   - 第 1089 行：將 `> ChaseRadius * ChaseLeashRatio / 10000` 修正為 `> ChaseRadius * (1 + ChaseLeashRatio / 10000)`。
   - 第 1116 行：將 `ChaseRadius * ChaseLeashRatio / 10000` 修正為 `ChaseRadius * (1 + ChaseLeashRatio / 10000)`。
3. 驗證修改後的 Markdown 格式。

## 預期輸出
- 修正後公式正確顯示為 `ChaseRadius * (1 + ChaseLeashRatio / 10000)`。
- 文件版本紀錄與其他章節不受影響。

## 可能影響範圍
- 僅限 AI 策略與行為決策（Ch9.3, Ch9.4）的公式說明，不影響代碼邏輯或其它章節。