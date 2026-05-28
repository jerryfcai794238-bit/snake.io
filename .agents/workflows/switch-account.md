---
description: 快速切換此專案的 Git Commit 署名身分與 GitHub CLI 認證帳號。
---

# Workflow: Switch Account

## 帳號設定檔定義
此開發環境主要在以下兩個帳號間切換：

| 帳號標籤 | Git user.name | Git user.email | GitHub 帳號 (gh CLI) | 適用場景 |
| :--- | :--- | :--- | :--- | :--- |
| **Corporate** | `fanchunkao` | `fanchunkao@igs.com.tw` | `fanchunkao` | 公司內部專案 / 預設全域 |
| **Personal** | `jerryfcai794238-bit` | `jerryfcai794238-bit@users.noreply.github.com` | `jerryfcai794238-bit` | 此個人開源專案 (`snake.io`) |

---

## 執行流程

### 1. 檢查當前帳號狀態
執行以下指令確認目前的 Git 本地/全域設定，以及 GitHub CLI 登入狀態：
```powershell
# 檢查 Git 提交署名
git config --show-origin user.name
git config --show-origin user.email

# 檢查 GitHub 推送憑證狀態
gh auth status
```

### 2. 切換至個人帳號 (jerryfcai794238-bit)
若要在此專案使用個人帳號進行 Commit 與 Push，請執行：
```powershell
# 設定此專案的本地 Commit 署名
git config --local user.name "jerryfcai794238-bit"
git config --local user.email "jerryfcai794238-bit@users.noreply.github.com"

# 切換 GitHub CLI 憑證帳號 (如已登入)
gh auth switch -u jerryfcai794238-bit
```

### 3. 切換至公司帳號 (fanchunkao)
若要在此專案還原回公司署名與憑證，請執行：
```powershell
# 移除此專案的本地 Commit 署名（自動套用全域 fanchunkao）
git config --local --unset user.name
git config --local --unset user.email

# 切換 GitHub CLI 憑證帳號 (如已登入)
gh auth switch -u fanchunkao
```
