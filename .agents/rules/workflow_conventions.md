# Workflow Conventions

為了確保所有自定義的工作流（Workflows）能被系統正確識別並出現在斜線指令（Slash Commands）清單中，必須遵守以下規範：

## 1. 格式規範 (Metadata)
- **YAML Frontmatter**: 每個 Workflow 檔案的頂部必須包含 YAML 區塊。
- **Description**: 必須提供 `description` 欄位，這會顯示在指令清單的說明中。

範例：
```markdown
---
description: 這裡輸入指令的簡短說明
---
```

## 2. 檔案存放位置
- 所有工作流檔案必須存放在專案目錄下的 `.agents/workflows/` 資料夾中。
- 檔案副檔名必須為 `.md`。

## 3. 指令調用
- 指令名稱預設為「檔案名稱」。
- 檔案內建議使用 `# Workflow: [Name]` 作為標題。

## 4. 自動化標籤
- 若工作流包含多個需要自動執行的 command，應在標題下方加入 `// turbo-all` 註解。
