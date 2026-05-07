---
description: 自動執行新專案的本地 Git 初始化、GitHub 儲存庫建立與雙分支推送。
---

# Workflow: Project Initialization & Git Setup

// turbo-all

這個 Workflow 會自動執行新專案的本地 Git 初始化、GitHub 儲存庫建立、以及 `main`/`dev` 雙分支的推送設定。

## 執行步驟

1. **本地 Git 初始化**
   - 執行 `git init`
   - 執行 `git add .`
   - 執行 `git commit -m "initial commit"`

2. **建立 GitHub 儲存庫**
   - 使用指令：`gh repo create <repo-name> --public --source=. --remote=origin`
   // 如果失敗，請確認是否已登入 gh auth login

3. **設定分支與推送**
   - 設定主分支：`git branch -M main`
   - 推送主分支：`git push -u origin main`
   - 建立開發分支：`git checkout -b dev`
   - 推送開發分支：`git push -u origin dev`

4. **設定預設分支為 main**
   - 執行 `gh repo edit --default-branch main`

---
**使用方式：**
`/project-init-git <repo-name>`
