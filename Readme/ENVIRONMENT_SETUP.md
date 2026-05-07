# Vibe Coding 快速上手指南

本文件旨在幫助非技術或初級開發人員快速建立開發環境，並透過 AI (Vibe Coding) 模式接手本專案的遊戲開發工作。

## 1. 核心技術棧 (Tech Stack)

本專案採用現代化的 Web 開發技術，旨在提供流暢的開發體驗與高效的渲染性能：

*   **框架 (Framework)**: [React 19](https://react.dev/) - **核心 UI 框架**。不論選用哪種遊戲引擎，所有的使用者介面 (UI) 與遊戲狀態管理都必須使用 React 實作。
*   **引擎 (Engine)**: 
    *   [Babylon.js 8](https://www.babylonjs.com/) - 強大的 3D 渲染引擎，負責高度沉浸的 3D 場景。
    *   [Phaser 3](https://phaser.io/) - 頂級的 2D 遊戲引擎，適合快速開發 2D 橫向捲軸或拼圖類遊戲。
*   **物理 (Physics)**: [Havok Physics](https://www.babylonjs.com/havok/) - 用於 Babylon.js 的物理運算。
*   **開發語言 (Language)**: [TypeScript](https://www.typescriptlang.org/) - 核心開發語言。
*   **構建工具 (Build Tool)**: [Vite](https://vitejs.dev/) - 開發與構建工具。

---

## 2. 遊戲引擎選擇指南 (Engine Selection)

當開發新遊戲模式時，AI 應主動提醒開發者根據遊戲性質選擇最合適的引擎。以下是比較參考：

| 特性 | Babylon.js (3D) | Phaser (2D) |
| :--- | :--- | :--- |
| **適用場景** | 3D 場景、高度光影、空間探索 | 2D 平面、像素風、卡牌、拼圖 |
| **效能優勢** | 強大的 GPU 渲染、PBR 材質 | 輕量、資源載入快、2D 碰撞優化 |
| **開發難度** | 高（需考慮相機角度、深度與光源） | 低（座標系統單純，適合 Vibe Coding） |
| **物理系統** | 複雜（3D 剛體、布料、複雜碰撞） | 直覺（2D 基礎物理、磁吸、瓦片地圖） |

### 我該選哪一個？
> [!TIP]
> **如果你想要的是 2D 遊戲**，AI 將優先建議使用 **Phaser**。
> 使用 Phaser 的優點是開發節奏極快，非常適合 Vibe Coding 模式，能縮短從「構思」到「成品」的時間。

---

## 3. 環境建置流程 (Environment Setup)

請依照以下步驟在你的電腦上建立開發環境：

### 步驟 1：安裝 Node.js
前往 [Node.js 官網](https://nodejs.org/) 下載並安裝 **LTS (長期支援)** 版本。
> [!NOTE]
> 安裝完成後，在電腦終端機輸入 `node -v` 確保版本高於 v18。

### 步驟 2：下載與準備專案
將專案程式碼下載至本地資料夾，並使用 **Antigravity** 開啟此資料夾。

### 步驟 3：安裝依賴套件
在 Antigravity 中開啟終端機，輸入以下指令：
```bash
npm install
```
這將下載所有專案運行所需的工具與函式庫。

### 步驟 4：啟動預覽 (自動化流程)
本專案已配置「一鍵啟動」。你可以**直接跳過手動輸入指令的步驟**，進入下方的「除錯指南」。

> [!IMPORTANT]
> 當你按下 **F5** 開始除錯時，系統會自動在後台執行 `npm run dev` 並開啟瀏覽器。你不需要（也不建議）手動開啟終端機執行指令，這能讓你專注於遊戲開發本身。

---

## 5. 常用指令 (Common Commands)

雖然大部份流程已自動化，但有時 AI 可能需要執行以下指令來檢查品質：

*   `npm run lint`：檢查代碼格式與潛在錯誤。建議在請求 AI 實作大功能後執行。
*   `npm run build`：驗證專案是否能成功打包（編譯檢查）。
*   `npm run preview`：預覽打包後的最終成果。

---

## 6. 版本控制與備份 (Version Control - Git)

在進行 Vibe Coding (AI 輔助開發) 時，程式碼變動速度極快。為了防止 AI 寫壞程式碼且無法恢復，強烈建議使用 Git：

*   **隨時提交 (Commit)**：每當 AI 完成一個穩定的小功能且驗證通過後，請務必進行 Commit。
*   **不怕寫壞**：如果 AI 的新嘗試導致遊戲崩潰，你可以透過 Git 輕鬆找回上一個穩定版本。
*   **操作方式**：點擊 Antigravity 左側選單的「原始碼控制」(Source Control) 圖示，輸入描述（例：`feat: 新增單字碰撞效果`）並點擊「提交」。

---

## 7. 除錯指南 (Debugging Guide)

本專案已預先配置好 **Antigravity / VS Code** 的除錯設定 (`.vscode/launch.json`)，讓你無需手動設定即可開始偵錯。

### 如何開始一鍵除錯？
本專案支援「一鍵啟動」，你不需要手動開啟終端機輸入指令：

1.  **開啟除錯介面**：點擊 Antigravity 左側選單的「執行與偵錯」(Run and Debug) 圖示（快速鍵：`Ctrl + Shift + D`）。
2.  **執行設定**：
    *   在頂部的下拉選單中選擇 **「Launch Chrome against localhost」**。
    *   按下綠色的 **開始執行 (F5)** 按鈕。
3.  **自動化流程**：Antigravity 會自動幫你啟動伺服器 (`npm run dev`) 並開啟 Chrome 瀏覽器。

---

## 8. Vibe Coding 工具推薦

為了最大化 AI 輔助開發的效率，建議配置以下工具：

1.  **Antigravity**: 本專案原生的 AI 編程環境，具備強大的 Context 感知與 Agent 能力。
2.  **瀏覽器開發者工具**: 按 `F12` 開啟主控台 (Console)，你可以看到目前的遊戲狀態與錯誤訊息，並將這些訊息餵給 AI 進行除錯。

---

## 9. 設計模式：MVP (Model-View-Presenter)

為了讓 AI 能穩定地擴充功能，本專案嚴格遵守 MVP 模式。請在下指令給 AI 時確保它遵循以下分工：

### Model (模型) - `/src/model`
*   **職責**：處理遊戲狀態與數據邏輯（例如：檢查單字是否正確、計算分數）。
*   **規範**：不允許引入任何渲染引擎（Babylon.js 或 Phaser）的代碼，保持邏輯純粹。

### View (視圖) - `/src/view`
*   **職責**：負責視覺渲染與輸入監聽。
    *   **BabylonView / PhaserView**：處理角色動作、特效、場景物件。
    *   **ReactView (HUD)**：處理按鈕、選單、血條等 UI。
*   **規範**：只負責「畫」跟「回傳事件」，不包含任何遊戲規則邏輯。

### Presenter (仲介) - `/src/presenter`
*   **職責**：擔任中間人，串聯模型與視圖。
    *   監聽來自 View 的事件（例如：碰撞、點擊）。
    *   向 Model 詢問運算結果。
    *   根據結果命令 View 進行演出（例如：播放成功特效）。

---

## 10. 核心開發規範 (Core Development Rules)

為了確保 AI 產出的程式碼符合專案品質，請要求 AI 遵守以下規則：

1.  **類型安全 (TypeScript)**：
    *   所有的 Interface 或 Type 必須使用 `import type` 引入。
    *   Enum 必須定義為 `const enum` 以優化效能。
2.  **數據持久化 (Data SOP)**：
    *   修改任何 `.json` 或持久化數據時，必須遵循 `Read -> Modify -> Write` 模式，嚴禁直接覆蓋。
3.  **溝通風格**：
    *   AI 在調整參數或節點時，必須一步一步說明修改原因與位置。
4.  **檔案命名**：
    *   建立新版本檔案時應使用 `v1`, `v2` 等序號，而非 `FINAL`。

---

## 11. 專案結構簡覽 (給 AI 接手者的地圖)

如果你想調整遊戲的核心邏輯或數據，請引導 AI 關注以下目錄：

*   `/docs`: **企劃文件與規格書**。請使用者將遊戲設計文件 (GDD)、數值表或新功能需求放在這裡。這是 AI 理解遊戲核心玩法的首要參考點。
*   `/public/assets`: **美術素材與資源**。包括 3D 模型 (`/models`)、貼圖 (`/textures`)、音效與圖片。
*   `/public/configs`: **JSON 配置檔**。外部靜態數據，如單字庫、初始玩家資料。
*   `/src/config`: **程式端配置**。相機參數、硬編碼數值與類型定義。
*   `/src/view`: **視覺呈現 (Babylon.js)**。控制 3D 場景、角色、特效的邏輯。
*   `/src/presenter`: **中間層邏輯**。負責將資料與視覺呈現串聯起來。
*   `/src/manager`: **全域管理**。例如 `DataManager` 負責進度存檔，`AudioManager` 負責音效。

### 資源載入規範 (Asset Policy)
*   **3D 模型 / 大型貼圖**：必須放在 `/public/assets`，代碼中透過路徑字串（如 `/assets/models/player.glb`）存取。
*   **UI 圖片 / 圖示**：建議放在 `/src/assets`，透過 `import` 方式引入 React 組件中。

---

## 12. 如何與 AI 合作 (Vibe Coding SOP)

為了讓 AI 能精準接手，建議採用以下標準作業流程：

1.  **第一階段：定義規格**
    *   在 `/docs` 下建立或更新文件（如 `GDD.md` 或 `feature_v1.md`），寫下你想做的功能。
2.  **第二階段：初始化任務**
    *   對 AI 說：「請讀取 `@/docs/ENVIRONMENT_SETUP.md` 與 `@/docs/新功能文件.md`，並為我規劃實作步驟。」
3.  **第三階段：逐步執行**
    *   要求 AI 每次只修改一個模組。
    *   **品質檢查**：修改完成後，要求 AI 執行 `npm run lint` 確保沒有破壞類型規範。
4.  **第四階段：驗證與歸檔**
    *   驗證功能正確後，通知 AI 更新 `/docs` 下的技術規格。
    *   **最後步驟**：使用 Git 提交變更。
