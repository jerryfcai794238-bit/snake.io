---
description: 針對遊戲核心邏輯（AI、物理、勝負判定）進行深度代碼審查，找出隱藏 Bug。
---

# Workflow: Logic Critic

## 審查清單（逐項 grep + 閱讀）

### AI 決策層
- [ ] `chooseDirection()` 是否有 U-turn（180 度反轉）防護？
- [ ] BFS / pathfinding 深度是否 ≥ 20？
- [ ] Survival Space fallback：AI 陷入死路時是否會切換到開放空間優先？
- [ ] HUNT 模式：追蹤頭部時是否有預判位移（而非直接對齊）？
- [ ] PAINT 模式：是否優先前往敵方領地密集區而非中立區？
- [ ] 技能觸發閾值是否與 GDD §7 一致（Shot > 40%、Bloom > 50%）？

### 碰撞與物理層
- [ ] Head-to-Head：雙方是否同幀判定死亡？
- [ ] 撞牆邊界：是否有 off-by-one（用格子座標還是像素座標判斷）？
- [ ] 幽靈狀態（Ghost）：是否確實跳過碰撞檢測？
- [ ] 護盾對撞：兩方帶盾時是否雙方存活？

### 環境物件生命週期
- [ ] 傳送門：使用後是否**立即** despawn 兩端？計時器是否正確清除？
- [ ] 黑洞：每幀引力計算是否會造成蛇速異常累積？
- [ ] 加速帶：退出區域後速度是否正確還原？
- [ ] 槽位管理：是否確保場上同時各有一個 Portal / Boost / Black Hole？

### 技能邊界
- [ ] Dash：穿越 canvas 邊界時是否截斷？
- [ ] Shot：128px 直線是否在邊界處正確截斷？
- [ ] Bloom：100px 圓形同化是否正確只影響範圍內格子？
- [ ] 技能冷卻：開局 3 秒封印（大地圖模式）是否有效？

### 效能層
- [ ] `update()` 內有無 O(n²) 迴圈？
- [ ] 地塊繪製是否有 dirty flag 或只重繪有變化的格子？
- [ ] 每幀 canvas clear 範圍是否最小化？

## 輸出格式

每個問題標記類型 + 行號 + 建議：

```
[BUG]   game.js:L847 — chooseDirection() 缺 U-turn 防護，AI 可能 180 度撞自己
[PERF]  game.js:L1203 — territory 統計在每幀全量掃描，建議改為差分更新
[WARN]  game.js:L502 — Portal despawn 使用 setTimeout，可能與遊戲暫停狀態衝突
```
