# 規格管理規範 (Specification Management Rules)

為了確保開發脈絡的可追溯性並簡化流程，Antigravity 必須遵守以下規範：

## 1. 討論階段 (Discussion Phase)
- 在產出正式 GDD 之前，必須先在對話中以 **PLAN 格式**（包含目標、核心策略、手段、情境範例）提供提案供使用者查閱。
- **不用產出實體計畫檔案**：除非特殊需求，否則不產出 `implementation_plan.md`。

## 2. 規格化階段 (Specification Phase)
- 討論達成共識後，直接產出/更新為新版號的 `docs/GDD_vX.X.X.md`。

## 2. 變更日誌要求 (Changelog)
- 每份新版 GDD 的頂部必須包含 `## 變更日誌 (Changelog)` 區塊。
- 必須條列標註：**調整項目**、**調整理由**、以及**對應的舊版本號**。

## 3. 歸檔與比對
- 舊版 GDD 應保留在 `docs/Old/` 中。
- 產出新版後，應引導使用者利用 VS Code 的「差異比對 (Diff)」功能來檢查變更細節。
