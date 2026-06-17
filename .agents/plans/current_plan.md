# Implementation Plan

## 目標

更新 `GDD/貪食蛇美術需求.md` 的 ch4「地圖戰場需求」：

1. 將原本 `概念圖 Prompt` 欄位內容改為地圖示意圖。
2. 將欄位順序調整為：示意圖欄位在美術說明前面。
3. 使用以下 4 張示意圖：

```text
GDD/Reference Image/Ref_Map_草原冒險主題.png
GDD/Reference Image/Ref_Map_河岸水域主題.png
GDD/Reference Image/Ref_Map_岩石峽谷主題.png
GDD/Reference Image/Ref_Map_糖果樂園主題.png
```

## 狀態

已完成。

## 預計修改檔案

```text
GDD/貪食蛇美術需求.md
```

## 已完成步驟

1. 備份 `GDD/貪食蛇美術需求.md`。
2. 確認 4 張 `Ref_Map_*.png` 是否存在。
3. 定位 ch4 地圖戰場需求表格。
4. 將表格欄位由 `美術說明 / 概念圖 Prompt / 驗收重點` 改為 `示意圖 / 美術說明 / 驗收重點`。
5. 將每列原 prompt 內容替換為對應 Markdown 圖片。
6. 驗證 Markdown 表格格式與圖片引用。

## 修改結果

- ch4 不再顯示概念圖 Prompt。
- ch4 每張地圖都有對應示意圖。
- 示意圖欄位位於美術說明前面。

## 備份位置

```text
scratch/backups/20260617_134836/GDD/貪食蛇美術需求.md
```
