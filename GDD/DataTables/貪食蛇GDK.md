# 《貪食蛇》Ch16 遊戲資料表

## 格式規則

- `B`：Client + Server
- `C`：Client
- `S`：Server
- 資料型態只使用 `int`、`string`、`bool`
- 不使用 `float`；小數時間改用毫秒，倍率與機率使用整數比例

## Module

| Module |  |  |  |  |  |  |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 輸出 | B |  |  | B | B |  |
| 名稱 | ID |  |  | Name | Value |  |
| 資料型態 | int |  |  | string | int |  |
| 企劃名 | 編號 | 參數分類 | 參數描述 | 參數名稱 | 參數值 | 單位 |
|  | 1 | core | 基礎跑速單位，4000 代表 40.00 px/s | BaseMoveSpeed | 4000 | 0.01 px/s |
|  | 2 | core | 初始體力上限 | BaseMaxStamina | 1000 | 點 |
|  | 3 | core | 衝刺每秒體力消耗 | DashStaminaCostRate | 333 | 點/s |
|  | 4 | core | 初始每秒體力回復 | BaseStaminaRecoverRate | 80 | 點/s |
|  | 5 | core | 基礎吸附食物半徑 | BaseSuctionRadius | 50 | px |
|  | 6 | core | 相機基礎視野倍率 | BaseVisionScale | 10000 | 萬分比 |
|  | 7 | core | 開局與重生初始長度 | BaseSnakeSegment | 50 | 節 |
|  | 8 | core | 衝刺加速比例 | DashSpeedFactor | 2500 | 萬分比 |
|  | 9 | core | 初始暴食冷卻時間 | GluttonyCD | 30 | s |
|  | 10 | core | 初始暴食吸附半徑 | GluttonySuctionRadius | 200 | px |
|  | 11 | core | 暴食吸附飛行時間；Dev Setting 可供測試覆寫，未覆寫時使用本預設值 | GluttonySuctionTravelTime | 350 | ms |
|  | 12 | core | 磁鐵吸附飛行時間 | MagnetSuctionTravelTime | 400 | ms |
|  | 13 | core | 基礎吃食吸附飛行時間 | BaseSuctionTravelTime | 450 | ms |
|  | 14 | core | 每增加一節所需積分 | PointPerSegment | 10 | 分 |
|  | 15 | core | 成長之路最高等級 | (不使用參數)讀已存在其他表格 | 60 | level |
|  | 16 | mode | 單局限時 | GameTime | 120 | s |
|  | 17 | mode | 死亡復活倒數 | RespawnTime | 5000 | ms |
|  | 18 | mode | Solo 入場能量 | EntryEnergy_Solo | 30 | 點 |
|  | 19 | mode | 大亂鬥入場能量 | EntryEnergy_Brawl | 30 | 點 |
|  | 20 | mode | 陣營對抗入場能量 | EntryEnergy_Team | 30 | 點 |
|  | 21 | mode | 擊殺敵蛇積分 | KillScore | 100 | 分 |
|  | 22 | mode | 每次擊殺額外熟練度 | MasterBonus_Kill | 2 | 點 |
|  | 23 | mode | SSS 評級額外熟練度 | MasterBonus_SSS | 50 | 點 |
|  | 24 | mode | SS 評級額外熟練度 | MasterBonus_SS | 30 | 點 |
|  | 25 | mode | S 評級額外熟練度 | MasterBonus_S | 10 | 點 |
|  | 26 | map | 地圖寬度 | MapWidth | 1536 | px |
|  | 27 | map | 地圖高度 | MapHeight | 1536 | px |
|  | 28 | map | 撞岩石或邊界長度扣除比例 | ImpactBoundaryLengthDeductionRatio | 5000 | 萬分比 |
|  | 29 | map | 緩速區速度修正 | SlowZoneSpeedFactor | -5000 | 萬分比 |
|  | 30 | map | 岩石區食物分配權重 | FoodDeployWeight_RockZone | 5000 | 萬分比 |
|  | 31 | map | 緩速區食物分配權重 | FoodDeployWeight_SlowZone | 3000 | 萬分比 |
|  | 32 | map | 平地區食物分配權重 | FoodDeployWeight_LandZone | 2000 | 萬分比 |
|  | 33 | map | 小食物積分 | FoodPoint_S | 1 | 分 |
|  | 34 | map | 中食物積分 | FoodPoint_M | 3 | 分 |
|  | 35 | map | 大食物積分 | FoodPoint_L | 5 | 分 |
|  | 36 | map | 殘骸結晶積分 | FoodPoint_Crystal | 10 | 分 |
|  | 37 | map | 開局食物總分 | InitialFoodPoints | 2000 | 分 |
|  | 38 | map | 食物補足下限 | MinFoodPoints | 1000 | 分 |
|  | 39 | map | 食物補充檢測週期 | FoodReplenishInterval | 10000 | ms |
|  | 40 | map | 死亡殘骸轉化比例 | DeathDebrisConversionRate | 5000 | 萬分比 |
|  | 41 | map | 殘骸食物存在時間 | CrystalLifeTime | 10 | s |
|  | 42 | item | 地圖道具刷新間隔 | ItemSpawnInterval | 20 | s |
|  | 43 | item | 地圖道具同時存在上限 | ItemMaxCount | 12 | 個 |
|  | 44 | item | 道具刷新預告時間 | ItemTeaserTime | 2 | s |
|  | 45 | item | 同款道具價格倍率 | BoosterPriceMultiplier | 15000 | 萬分比 |
|  | 46 | item | 高級道具初始單局上限 | BoosterInitialCount | 2 | 次 |
|  | 47 | item | 高級道具最大單局上限 | BoosterMaximumCount | 5 | 次 |
|  | 52 | cosmetic | 表情貼圖顯示時間 | EmoteDuration | 2500 | ms |
|  | 53 | core | 蛇頭碰撞半徑 | SnakeHeadCollisionRadius | 12 | px |
|  | 54 | core | 蛇身碰撞半徑 | SnakeBodyCollisionRadius | 8 | px |
|  | 55 | core | 蛇節視覺間距 | SnakeSegmentSpacing | 10 | px |
|  | 56 | combat | 截斷判定避開蛇頭前段節數 | CutHeadSafeSegment | 10 | 節 |
|  | 57 | map | 岩石彼此、不同條緩速區外緣與食物／地圖道具中心偏移的額外安全間隙；同一條緩速區內相鄰格及岩石與緩速區重疊不適用 | ObjectSpawnMinDist | 2 | px |
|  | 58 | item | 巨大蘑菇體型放大倍率 | ItemMushroom_Size | 15000 | 萬分比 |
|  | 59 | ui | 局內排行榜顯示行數 | RankingDisplayCount | 4 | 行 |
|  | 60 | ui | 對局倒數警示門檻 | TimeWarningThreshold | 30 | s |
|  | 61 | mode | 中離最低評價獎勵比例 | EarlyLeaveRewardRatio | 5000 | 萬分比 |
|  | 62 | map | 殘骸分數捨去倍數 | CrystalScoreRoundUnit | 10 | 分 |
|  | 63 | social | 房間碼位數 | RoomCodeDigits | 5 | 位 |
|  | 64 | social | 好友房最少開始人數 | RoomMinPlayers | 2 | 人 |
|  | 65 | social | 好友房隊伍人數上限 | RoomMaxPlayers | 4 | 人 |
|  | 66 | map | 岩石區判定半徑 | RockRegionRadius | 100 | px |
|  | 67 | item | 地圖磁鐵出現權重 | ItemMagnetSpawnWeight | 2500 | 萬分比 |
|  | 68 | item | 地圖巨大蘑菇出現權重 | ItemMushroomSpawnWeight | 2500 | 萬分比 |
|  | 69 | item | 地圖幸運糖出現權重 | ItemCandySpawnWeight | 2500 | 萬分比 |
|  | 70 | item | 地圖鷹眼出現權重 | ItemEyeSpawnWeight | 2500 | 萬分比 |
|  | 71 | item | 地圖中心圈道具分布權重 | MapCenterItemSpawnWeight | 5000 | 萬分比 |
|  | 72 | item | 地圖中圈道具分布權重 | MapMidItemSpawnWeight | 3000 | 萬分比 |
|  | 73 | item | 地圖外圈道具分布權重 | MapOuterItemSpawnWeight | 2000 | 萬分比 |
|  | 74 | item | 地圖中心圈半徑比例 | MapCenterRadiusRatio | 3333 | 萬分比 |
|  | 75 | item | 地圖中圈半徑比例 | MapMidRadiusRatio | 6667 | 萬分比 |
|  | 76 | map | 小食物生成權重 | FoodSpawnWeight_S | 6000 | 萬分比 |
|  | 77 | map | 中食物生成權重 | FoodSpawnWeight_M | 3000 | 萬分比 |
|  | 78 | map | 大食物生成權重 | FoodSpawnWeight_L | 1000 | 萬分比 |
|  | 79 | map | 撞擊岩石或邊界後的輸入鎖定時間 | ImpactBoundaryInputLockDuration | 350 | ms |
|  | 80 | core | 每個自然體型階段的節數 | SnakeBodyGrowthStageSegment | 50 | 節 |
|  | 81 | core | 每個自然體型階段的倍率增量 | SnakeBodyGrowthStageScaleIncrement | 1000 | 萬分比 |
|  | 82 | core | 蛇身依長度自然成長時可達的最大體型倍率 | SnakeBodyGrowthScaleMax | 15000 | 萬分比 |
|  | 83 | core | 自然體型倍率達到上限的門檻節數；不限制蛇身繼續成長 | SnakeBodyGrowthScaleMaxThresholdSegment | 300 | 節 |
|  | 84 | core | 蛇隻渲染尺寸、碰撞半徑與體型跟隨鏡頭由舊值過渡至新值的線性時間 | SnakeBodyScaleTransitionTime | 250 | ms |
|  | 85 | ui | 最終體型倍率反映至體型跟隨鏡頭的比例 | SnakeBodyVisionFollowRatio | 4000 | 萬分比 |
|  | 86 | ui | 鷹眼鏡頭倍率由舊值過渡至新值的線性時間 | EagleEyeVisionTransitionTime | 500 | ms |
|  | 87 | ui | 鷹眼乘算後的最終鏡頭倍率上限 | SnakeFinalVisionScaleMax | 50000 | 萬分比 |
|  | 88 | passive | 第 1 次被動強化成本 | PassiveUpgradeStartCost | 1000 | 金幣 |
|  | 89 | passive | 第 100 次被動強化成本 | PassiveUpgradeCostNode100 | 40000 | 金幣 |
|  | 90 | passive | 第 200 次被動強化成本 | PassiveUpgradeCostNode200 | 120000 | 金幣 |
|  | 91 | passive | 第 300 次被動強化成本 | PassiveUpgradeCostNode300 | 240000 | 金幣 |
|  | 92 | passive | 第 400 次被動強化成本 | PassiveUpgradeEndCost | 300000 | 金幣 |
|  | 93 | map | 每局岩石生成數量下限；初始值由程式端暫定並可調整 | RockSpawnCountMin |  | 個 |
|  | 94 | map | 每局岩石生成數量上限；初始值由程式端暫定並可調整 | RockSpawnCountMax |  | 個 |
|  | 95 | map | 岩石半徑下限 R；初始值由程式端暫定並可調整 | RockRadiusMin |  | px |
|  | 96 | map | 岩石半徑上限 R；初始值由程式端暫定並可調整 | RockRadiusMax |  | px |


## AIStrategy

| AIStrategy |  |  |  |  |  |  |  |  |  |  |  |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 輸出 | B |  | C |  | C | B | B | B | B | B | B |
| 名稱 | ID |  | NameStrID |  | DescStrID | SpawnWeight | ReactionDelay | SteeringPrecision | DashProbability | EvadeDistance | ChaseDistance |
| 資料型態 | int |  | int |  | int | int | int | int | int | int | int |
| 企劃名 | 編號 | 策略名稱 | 名稱字串表編號 | 策略描述 | 描述字串表編號 | 出現權重(萬分比) | 反應延遲(ms) | 轉彎精準度(萬分比) | 衝刺機率(萬分比) | 避險半徑(px) | 追逐半徑(px) |
|  | 1 | 初階 BOT |  | 基礎隨機移動 AI |  | 0 | 300 | 5000 | 1000 | 50 | 100 |
|  | 2 | 避險型 AI |  | 優先閃避威脅 |  | 2500 | 150 | 7000 | 2000 | 250 | 150 |
|  | 3 | 收集型 AI |  | 優先收集食物與道具 |  | 2500 | 120 | 8000 | 3000 | 150 | 400 |
|  | 4 | 截斷型 AI |  | 主動卡位截斷敵蛇 |  | 2500 | 100 | 9000 | 5000 | 180 | 350 |
|  | 5 | 追獵型 AI |  | 追擊高分與長蛇 |  | 2500 | 50 | 9500 | 6000 | 200 | 500 |

## ActiveSkill

| ActiveSkill |  |  |  |  |  |  |  |  |  |  |  |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 輸出 | B |  | C |  | C | B | B | B | B | B |  |
| 名稱 | ID |  | NameStrID |  | DescStrID | Lv0 | Lv1 | Lv2 | Lv3 | Lv4 |  |
| 資料型態 | int |  | int |  | int | int | int | int | int | int |  |
| 企劃名 | 編號 | 主動技能名稱 | 名稱字串表編號 | 主動技能描述 | 描述字串表編號 | Lv0 參數 | Lv1 參數 | Lv2 參數 | Lv3 參數 | Lv4 參數 | 單位 |
|  | 1 | 衝刺體力上限 |  | 提升衝刺體力上限 |  | 1000 | 1125 | 1250 | 1375 | 1500 | 點 |
|  | 2 | 衝刺體力回復速度 |  | 提升衝刺體力回復速度 |  | 80 | 100 | 125 | 158 | 200 | 點/s |
|  | 3 | 暴食吸附半徑 |  | 提升暴食吸附範圍 |  | 200 | 250 | 300 | 350 | 400 | px |
|  | 4 | 暴食冷卻時間 |  | 縮短暴食冷卻時間 |  | 30 | 29 | 28 | 27 | 25 | 秒 |

## PassiveSkill

| PassiveSkill |  |  |  |  |  |  |  |  |  |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 輸出 | B | B |  | C |  | C | B | B |  |
| 名稱 | ID | Name |  | NameStrID |  | DescStrID | StartValue | MaxValue |  |
| 資料型態 | int | string |  | int |  | int | int | int |  |
| 企劃名 | 編號 | 參數名稱 | 被動技名稱 | 名稱字串表編號 | 被動技描述 | 描述字串表編號 | Lv0 參數 | Lv40 參數 | 單位 |
|  | 1 | ITEM_MAGNET_RADIUS | 磁吸半徑 |  | 磁吸半徑永久強化 |  | 100 | 200 | px |
|  | 2 | ITEM_MUSHROOM_SPEED | 巨大蘑菇跑速 |  | 巨大蘑菇跑速強化 |  | -2500 | 1500 | 萬分比 |
|  | 3 | ITEM_CANDY_MULTIPLIER | 幸運糖倍率 |  | 幸運糖倍率強化 |  | 30000 | 70000 | 萬分比 |
|  | 4 | ITEM_EYE_SCALE | 鷹眼視野 |  | 鷹眼視野強化 |  | 13500 | 17500 | 萬分比 |
|  | 5 | ITEM_MAGNET_DURATION | 磁鐵時長 |  | 磁鐵時長強化 |  | 10 | 20 | s |
|  | 6 | ITEM_MUSHROOM_DURATION | 巨大蘑菇時長 |  | 巨大蘑菇時長強化 |  | 10 | 20 | s |
|  | 7 | ITEM_CANDY_DURATION | 幸運糖時長 |  | 幸運糖時長強化 |  | 10 | 20 | s |
|  | 8 | ITEM_EYE_DURATION | 鷹眼時長 |  | 鷹眼時長強化 |  | 10 | 20 | s |
|  | 9 | PASSIVE_ROCK_RESIST | 岩石抗性 |  | 岩石扣長減免 |  | -5000 | -1000 | 萬分比 |
|  | 10 | PASSIVE_RIVER_RESIST | 河流抗性 |  | 河流減速減免 |  | -5000 | -1000 | 萬分比 |

## RatingReward

| RatingReward |  |  |  |  |  |  |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 輸出 | B | B | B | B | B | B |
| 名稱 | ID | Rating | MinScore | MaxScore | CoinReward | MasteryBonus |
| 資料型態 | int | string | int | int | int | int |
| 企劃名 | 編號 | 評級 | 最低積分 | 最高積分 | 金幣獎勵 | 額外熟練度 |
|  | 1 | SSS | 2000 | -1 | 3000 | 50 |
|  | 2 | SS | 1500 | 1999 | 2800 | 30 |
|  | 3 | S | 1000 | 1499 | 2600 | 10 |
|  | 4 | A | 800 | 999 | 2400 | 0 |
|  | 5 | B | 500 | 799 | 2200 | 0 |
|  | 6 | C | 300 | 499 | 2000 | 0 |
|  | 7 | D | 100 | 299 | 1800 | 0 |
|  | 8 | E | 0 | 99 | 1600 | 0 |

## Food

| Food |  |  |  |  |  |  |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 輸出 | B | C | B | B | C | C |
| 名稱 | ID | Name | Score | CollisionRadius | RenderScaleMin | RenderScaleMax |
| 資料型態 | int | string | int | int | int | int |
| 企劃名 | 編號 | 食物名稱 | 分數 | 碰撞半徑 | 最小渲染倍率 | 最大渲染倍率 |
|  | 1 | 小食物 | 1 | 4 | 10000 | 10000 |
|  | 2 | 中食物 | 3 | 7 | 10000 | 10000 |
|  | 3 | 大食物 | 5 | 10 | 10000 | 10000 |
|  | 4 | 殘骸結晶 | 10 | 12 | 10000 | 12000 |

## ModeBotComposition

| ModeBotComposition |  |  |  |  |  |  |  |  |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 輸出 | B | B | B | B | B | B | B | B |
| 名稱 | ID | Mode | BotCount | Beginner | Evade | Collect | Cut | Hunt |
| 資料型態 | int | string | int | int | int | int | int | int |
| 企劃名 | 編號 | 模式 | 電腦總數 | 初階 | 避險 | 收集 | 截斷 | 追獵 |
|  | 1 | Solo | 7 | 2 | 2 | 1 | 1 | 1 |
|  | 2 | Brawl | 7 | 0 | 1 | 2 | 2 | 2 |
|  | 3 | TeamPerSide | 3 | 0 | 0 | 1 | 1 | 1 |

## Tutorial

> 每個教學步驟一列；`LevelID + StepOrder` 必須唯一且連續。完成條件只填於該關最後一步，StepCount 由列數自動計算。

| Tutorial |  |  |  |  |  |  |  |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 輸出 | B | B | C | C | C | B | B |
| 名稱 | ID | LevelID | LevelName | StepOrder | TextKey | CompletionRule | OverrideGluttony |
| 資料型態 | int | int | string | int | string | string | bool |
| 企劃名 | 編號 | 教學關卡編號 | 關卡名稱 | 步驟順序 | 文字 Key | 完成條件 | 教學覆寫暴食 |
|  | 1 | 1 | 基本移動 | 1 | ui_tutorial_l1_move |  | false |
|  | 2 | 1 | 基本移動 | 2 | ui_tutorial_l1_food |  | false |
|  | 3 | 1 | 基本移動 | 3 | ui_tutorial_l1_grow | 完成至少 1 次方向轉換、吃到 10 顆食物，並觸發至少 1 次蛇身增長。 | false |
|  | 4 | 2 | 衝刺 | 1 | ui_tutorial_l2_dash |  | false |
|  | 5 | 2 | 衝刺 | 2 | ui_tutorial_l2_overload |  | false |
|  | 6 | 2 | 衝刺 | 3 | ui_tutorial_l2_speed |  | false |
|  | 7 | 2 | 衝刺 | 4 | ui_tutorial_l2_kill | 完成 1 次衝刺，成功截斷或擊殺 BOT 1 次。 | false |
|  | 8 | 3 | 暴食 | 1 | ui_tutorial_l3_gluttony |  | true |
|  | 9 | 3 | 暴食 | 2 | ui_tutorial_l3_absorb |  | true |
|  | 10 | 3 | 暴食 | 3 | ui_tutorial_l3_cooldown | 使用暴食 2 次、吸附至少 10 顆食物。 | true |
## StringTable

| StringTable |  |  |  |  |
| :--- | :--- | :--- | :--- | :--- |
| 輸出 | C | C | C | C |
| 名稱 | ID | Key | ZH_TW | EN |
| 資料型態 | int | string | string | string |
| 企劃名 | 編號 | 字串 Key | 繁中 | 英文 |
|  | 1 | ui_lobby_btn_solo | 單人練習 | Solo Practice |
|  | 2 | ui_lobby_btn_brawl | 多人大亂鬥 | Brawl |
|  | 3 | ui_lobby_btn_team | 陣營對抗 | Team Battle |
|  | 4 | ui_lobby_btn_tutorial | 教學模式 | Tutorial |
|  | 5 | ui_tutorial_continue | 點擊繼續 | Tap to Continue |
|  | 6 | ui_tutorial_l1_move | 拖曳搖桿控制方向 | Drag the joystick to steer |
|  | 7 | ui_tutorial_l1_food | 移動並吃掉食物 | Move and eat food |
|  | 8 | ui_tutorial_l1_grow | 吃食物讓身體變長 | Eat food to grow longer |
|  | 9 | ui_tutorial_l2_dash | 按下衝刺 | Hold the Dash button |
|  | 10 | ui_tutorial_l2_overload | 體力耗盡會超載 | Empty stamina causes overload |
|  | 11 | ui_tutorial_l2_speed | 衝刺讓蛇隻加速 | Dash makes the snake move faster |
|  | 12 | ui_tutorial_l2_kill | 截斷或擊殺對手 | Cut or defeat opponents |
|  | 13 | ui_tutorial_l3_gluttony | 點擊使用暴食 | Tap to use Gluttony |
|  | 14 | ui_tutorial_l3_absorb | 瞬間大範圍吸收 | Instantly absorb a wide area |
|  | 15 | ui_tutorial_l3_cooldown | 等待冷卻後再次使用 | Wait for cooldown to use it again |
|  | 16 | ui_tutorial_exit_desc | 離開教學將返回關卡選擇，尚未完成的進度不會保留，確定離開嗎？ | Leave the tutorial and discard unfinished progress? |
|  | 17 | ui_lobby_btn_create_room | 創建好友房 | Create Room |
|  | 18 | ui_lobby_btn_join_room | 加入好友房 | Join Room |
|  | 19 | ui_matchmaking_title | 配對中 | Matchmaking |
|  | 20 | ui_matchmaking_cancel | 取消配對 | Cancel |
|  | 21 | ui_matchmaking_team_mode | 陣營對抗 | Team Battle |
|  | 22 | ui_exit_popup_title | 離開對局？ | Leave Match? |
|  | 23 | ui_exit_popup_desc | 僅獲得最低評價50%獎勵 | Only receive 50% of the lowest rating reward |
|  | 24 | ui_common_yes | 是 | Yes |
|  | 25 | ui_common_no | 否 | No |
|  | 26 | ui_common_back | 返回 | Back |
|  | 27 | ui_common_close | 關閉 | Close |
|  | 28 | ui_result_rank_retry | 再接再厲 | Better Luck Next Time |
|  | 29 | ui_result_leave_status | 中途離開 | Left Early |
|  | 30 | ui_result_leave_reward | 最低評價獎勵 50% | 50% Lowest Rating Reward |
|  | 31 | ui_result_coin_reward | 本局可獲得金幣 | Coins Earned |
|  | 32 | ui_result_no_drop | 未獲得隨機掉落獎勵 | No random drop reward |
|  | 33 | ui_room_code_title | 輸入房間碼 | Enter Room Code |
|  | 34 | ui_room_code_invalid | 房間碼無效或已逾時 | Room code is invalid or expired |
|  | 35 | ui_room_ready | 準備 | Ready |
|  | 36 | ui_room_unready | 取消準備 | Cancel Ready |
|  | 37 | ui_room_start | 開始配對 | Start Matchmaking |
|  | 38 | ui_room_start_disabled | 至少需要 2 人才能開始 | At least 2 players are required |
|  | 39 | ui_room_kicked | 已離開隊伍 | Removed from room |
|  | 40 | ui_tip_energy_not_enough | 能量不足 | Not enough energy |
|  | 41 | ui_tip_coin_not_enough | 金幣不足！ | Not enough coins! |
|  | 42 | ui_tip_effect_active | 效果生效中！ | Effect is active! |
|  | 43 | ui_tip_limit_reached | 已達單局使用上限！ | Match use limit reached! |
|  | 44 | ui_passive_info_title | 被動強化規則說明 | Passive Upgrade Rules |
|  | 45 | ui_passive_maxed | 所有被動屬性已滿級 | All passive attributes are maxed |
|  | 46 | ui_passive_btn_maxed | 強化已達上限 | Level Max |
|  | 47 | ui_growth_next_preview | 下一級預覽 | Next Level Preview |
|  | 48 | ui_growth_claimable | 可領取 | Claimable |
|  | 49 | ui_growth_active | 已生效 | Active |
|  | 50 | ui_shop_owned | 已擁有 | Owned |
|  | 51 | ui_shop_equipped | 使用中 | Equipped |
|  | 52 | ui_shop_currency_lack | 貨幣不足 | Not enough currency |
|  | 53 | ui_shop_limited | 限時 | Limited |

## Skin

> 取得方式尚未逐筆定義，`AcquireType`、`AcquireParam0`、`AcquireParam1` 暫留空白；造型名稱、描述與資源 ID 沿用既有資料。

| Skin |  |  |  |  |  |  |  |  |  |  |  |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 輸出 | B |  | C |  | C | C | B | B | B | B | B |
| 名稱 | ID |  | NameStrID |  | DescStrID | AssetID | AcquireType | AcquireParam0 | AcquireParam1 | DefaultUnlock | IsLimited |
| 資料型態 | int |  | int |  | int | string | int | string | string | bool | bool |
| 企劃名 | 編號 | 造型名稱 | 名稱字串表編號 | 造型描述 | 描述字串表編號 | 資源 ID | 獲得條件類型 | 參數{0} | 參數{1} | 預設解鎖 | 限時商品 |
|  | 1 | 經典紫蛇 |  | 高飽和深紫色，搭配亮黃色腹部或淺色外框；實色霧面、乾淨基礎 |  | Skin-001 | | |  | true |  |
|  | 2 | 藍莓蛇 |  | 藍紫色、果凍質感 |  | Skin-002 | | |  | true |  |
|  | 3 | 草莓蛇 |  | 紅粉色、草莓籽點綴 |  | Skin-003 | | |  | true |  |
|  | 4 | 橘子蛇 |  | 橘色、果皮紋路 |  | Skin-004 | | |  | false |  |
|  | 5 | 西瓜蛇 |  | 綠皮紅肉或西瓜條紋 |  | Skin-005 | | |  | false |  |
|  | 6 | 蜂蜜蛇 |  | 黃金色、蜂蜜滴落感 |  | Skin-006 | | |  | false |  |
|  | 7 | 奶油蛇 |  | 淡色、奶油捲感 |  | Skin-007 | | |  | false |  |
|  | 8 | 火焰蛇 |  | 紅橘火焰紋 |  | Skin-008 | | |  | false |  |
|  | 9 | 冰晶蛇 |  | 淺藍冰晶、透明感 |  | Skin-009 | | |  | false |  |
|  | 10 | 雷電蛇 |  | 黃紫電光紋 |  | Skin-010 | | |  | false |  |
|  | 11 | 星光蛇 |  | 深色底、星星點綴 |  | Skin-011 | | |  | false |  |
|  | 12 | 彩虹蛇 |  | 多色漸層節點 |  | Skin-012 | | |  | false |  |
|  | 13 | 機械蛇 |  | 金屬節點、螺絲或裝甲 |  | Skin-013 | | |  | false |  |
|  | 14 | 忍者蛇 |  | 深色布條、忍者頭巾 |  | Skin-014 | | |  | false |  |
|  | 15 | 海盜蛇 |  | 眼罩、條紋、海盜元素 |  | Skin-015 | | |  | false |  |
|  | 16 | 牛仔蛇 |  | 牛仔帽、皮革色系 |  | Skin-016 | | |  | false |  |
|  | 17 | 太空蛇 |  | 太空衣、星艦感 |  | Skin-017 | | |  | false |  |
|  | 18 | 甜甜圈蛇 |  | 糖霜、甜甜圈配色 |  | Skin-018 | | |  | false |  |
|  | 19 | 龍紋蛇 |  | 東方龍鱗、鬚角簡化 |  | Skin-019 | | |  | false |  |
|  | 20 | 霓虹蛇 |  | 亮色線條、夜光感 |  | Skin-020 | | |  | false |  |
|  | 21 | 破壞王蛇 |  | 龐克、貼紙、裂紋 |  | Skin-021 | | |  | false |  |

## Emote

> 表情貼圖僅支援資源購買；`ResourceID`、`ResourceAmount` 尚未逐筆定義，暫留空白。顯示時間由 Module 的 `EMOTE_DURATION` 控制。

| Emote |  |  |  |  |  |  |  |  |  |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 輸出 | B |  | C |  | C | C | B | B | B |
| 名稱 | ID |  | NameStrID |  | DescStrID | AssetID | ResourceID | ResourceAmount | DefaultUnlock |
| 資料型態 | int |  | int |  | int | string | string | int | bool |
| 企劃名 | 編號 | 貼圖名稱 | 名稱字串表編號 | 貼圖描述 | 描述字串表編號 | 資源 ID | 購買資源 ID | 購買資源數量 | 預設解鎖 |
|  | 1 | 開心 |  | 大笑、閃光、正向 |  | Emote-B01 |  |  | true |
|  | 2 | 生氣 |  | 鼓臉、怒符號 |  | Emote-B02 |  |  | true |
|  | 3 | 哭哭 |  | 淚眼、委屈 |  | Emote-B03 |  |  | true |
|  | 4 | 驚訝 |  | 張嘴、問號或驚嘆號 |  | Emote-B04 |  |  | true |
|  | 5 | 得意 |  | 墨鏡、挑眉、勝利感 |  | Emote-B05 |  |  | true |
|  | 6 | 帥氣收割 |  | 墨鏡、光芒 |  | Emote-Kill-01 |  |  | false |
|  | 7 | 小惡魔笑 |  | 調皮壞笑 |  | Emote-Kill-02 |  |  | false |
|  | 8 | 連擊興奮 |  | 火花、上揚 |  | Emote-Kill-03 |  |  | false |
|  | 9 | 王者姿態 |  | 皇冠、挺胸 |  | Emote-Kill-04 |  |  | false |
|  | 10 | 拍手叫好 |  | 手掌、星星 |  | Emote-Kill-05 |  |  | false |
|  | 11 | 冷酷轉身 |  | 背影、風線 |  | Emote-Kill-06 |  |  | false |
|  | 12 | 爽快爆笑 |  | 大笑、動感線 |  | Emote-Kill-07 |  |  | false |
|  | 13 | 剪刀手 |  | 剪刀或切線 |  | Emote-Cut-01 |  |  | false |
|  | 14 | 精準命中 |  | 靶心、閃光 |  | Emote-Cut-02 |  |  | false |
|  | 15 | 切開啦 |  | 誇張切痕但不血腥 |  | Emote-Cut-03 |  |  | false |
|  | 16 | 神操作 |  | 星星眼 |  | Emote-Cut-04 |  |  | false |
|  | 17 | 擋路成功 |  | 路障、得意 |  | Emote-Cut-05 |  |  | false |
|  | 18 | 驚險一刀 |  | 速度線 |  | Emote-Cut-06 |  |  | false |
|  | 19 | 技巧炫耀 |  | 手勢、閃耀 |  | Emote-Cut-07 |  |  | false |
|  | 20 | 暈倒 |  | 轉圈眼 |  | Emote-Death-01 |  |  | false |
|  | 21 | 碎掉了 |  | 破裂表情 |  | Emote-Death-02 |  |  | false |
|  | 22 | 不敢相信 |  | 問號、驚訝 |  | Emote-Death-03 |  |  | false |
|  | 23 | 哭到變形 |  | 大哭 |  | Emote-Death-04 |  |  | false |
|  | 24 | 被撞飛 |  | 星星、飛出感 |  | Emote-Death-05 |  |  | false |
|  | 25 | 再來一次 |  | 握拳、燃起 |  | Emote-Death-06 |  |  | false |
|  | 26 | 靈魂出竅 |  | 小幽默靈魂感，不恐怖 |  | Emote-Death-07 |  |  | false |
|  | 27 | 啊被切了 |  | 驚嚇、切線 |  | Emote-CutBy-01 |  |  | false |
|  | 28 | 大失算 |  | 冷汗 |  | Emote-CutBy-02 |  |  | false |
|  | 29 | 不服氣 |  | 鼓臉 |  | Emote-CutBy-03 |  |  | false |
|  | 30 | 快跑啊 |  | 慌張腳步 |  | Emote-CutBy-04 |  |  | false |
|  | 31 | 求放過 |  | 雙手合十 |  | Emote-CutBy-05 |  |  | false |
|  | 32 | 差一點 |  | 流汗、驚嘆號 |  | Emote-CutBy-06 |  |  | false |
|  | 33 | 記住你了 |  | 盯著看 |  | Emote-CutBy-07 |  |  | false |
|  | 34 | 好險 |  | 冷汗、鬆口氣 |  | Emote-Near-01 |  |  | false |
|  | 35 | 差點撞 |  | 震驚眼 |  | Emote-Near-02 |  |  | false |
|  | 36 | 神閃避 |  | 閃電、殘影 |  | Emote-Near-03 |  |  | false |
|  | 37 | 太刺激 |  | 星星眼 |  | Emote-Near-04 |  |  | false |
|  | 38 | 心跳加速 |  | 心跳線 |  | Emote-Near-05 |  |  | false |
|  | 39 | 你追不到 |  | 調皮吐舌 |  | Emote-Near-06 |  |  | false |
|  | 40 | 近距離挑釁 |  | 嘻笑、手勢 |  | Emote-Near-07 |  |  | false |
