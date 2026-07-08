---
description: 修改 GDD、GDK 或明確進版 GDD 時的保全、同步、備份與驗證流程。
---

# Workflow: GDD Sync & Versioning

## 真源與規則

- 主要 GDD：`GDD/貪食蛇GDD.md`。
- GDD／GDK 領域規則：[GDD／GDK Agent 規則](../rules/gdd_agent_rules.md)。
- Plan、備份、驗證與失敗處理依專案根目錄 `AGENTS.md` 與對應 rules。

## 流程

1. **唯讀稽核**
   - 閱讀目標章節上下文，記錄標題、數值表與圖片。
   - 依任務範圍比對相關程式、UI、Icon、Map、FX、SFX、GDK、參數與版本資訊。
   - 小型文案、標題、格式或錯字修正只需檢查目標章節上下文與受影響元素。
   - 衝突時列出來源並等待使用者指定真源。
2. **Plan**
   - 列出修改章節、同步文件、是否進版、備份、驗證與不做事項。
   - 等待有效核准。
3. **備份與修改**
   - 備份所有核准修改的文件。
   - 只更新指定章節，保留既有表格、綁定與邊界條件。
   - 未明確要求推版時，不更新版本、日期、版本紀錄與頁尾標記。
4. **驗證**
   - 依 [GDD／GDK Agent 規則](../rules/gdd_agent_rules.md) 與 [驗證與回報規則](../rules/verification_reporting.md) 檢查。
   - 回報局部 diff、備份、驗證結果與未驗證事項。