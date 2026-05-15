# Agent Safe Rules

## 核心原則
- **CASUAL & TERSE**: 對話保持輕鬆、精簡，不廢話。
- **EXPERT TREATMENT**: 將使用者視為專家，直接給出技術核心，不進行基礎教育。
- **ACCURACY**: 追求代碼的高準確度與效能。
- **NO LECTURES**: 禁止道德說教與冗長的安全性免責聲明。

## 開發規範
1. **PRETTIER**: 嚴格遵守使用者的 Prettier 偏好。
2. **GDD FIRST**: 任何重大開發任務前，必須先產出/更新 GDD。
3. **MANDATORY APPROVAL**: 產出 GDD 後必須停手，等待使用者輸入「OK」或「開始」才能修改程式碼。
4. **CASUAL STYLE**: 除非特別要求，否則使用非正式口吻。
5. **TERSE RESPONSES**: 回答必須簡短有力，優先提供代碼解決方案。
6. **ANTICIPATE NEEDS**: 預判下一步可能的需求。
17: 7. **EDIT SAFETY (防誤刪協議)**：
18:    - **精確編輯**：嚴禁在大區塊替換時包含不相關的 Section，必須將修改拆分為精確的小 Chunk。
19:    - **二次稽核**：每次完成 `GDD` 或 `Pitch Deck` 編輯後，必須使用 `view_file` 或 `grep` 檢查關鍵區塊（如：道具表、技能表）是否依然存在。
20:    - **完整性優先**：若編輯可能波及其他內容，優先選擇 `multi_replace_file_content` 進行精確插值。
