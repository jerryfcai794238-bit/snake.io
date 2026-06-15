# Implementation Plan

## 狀態

已完成。

## 任務

採用第一種做法：將 icon 放回 `GDD/貪食蛇GDD.md` 的表格內，但不指定圖片大小，改用 Markdown 原生圖片語法，確保預覽器能正常顯示。

## 已執行

1. 建立備份：
   - `scratch/backups/20260615_095719/GDD/貪食蛇GDD.md`
2. ch4.3 主動技能規則：
   - 移除「主動技能 Icon 參考」區塊。
   - 主動技能表格恢復 `Icon` 首欄。
   - 衝刺、暴食改用 Markdown 圖片語法放回表格內。
3. ch7.5 地圖道具說明：
   - 移除「地圖道具 Icon 參考」區塊。
   - 地圖道具表格恢復 `Icon` 首欄。
   - 磁鐵、巨大蘑菇、幸運糖、鷹眼改用 Markdown 圖片語法放回表格內。

## 驗證

- 已確認兩張表格都有 `Icon` 首欄。
- 已確認 6 張 icon 都以 Markdown 圖片語法引用。
- 已確認不再殘留表格內 `<img src="Reference%20Image/Ref_Icon_...">`。
- 圖片不指定寬高，大小由原圖與 Markdown 預覽器決定。

