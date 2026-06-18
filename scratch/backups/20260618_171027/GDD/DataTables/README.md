# 《貪食蛇》Ch16 遊戲資料表

## 格式規則

- `B`：Client + Server
- `C`：Client
- `S`：Server
- 資料型態只使用 `int`、`string`、`bool`
- 不使用 `float`；小數時間改用毫秒，倍率與機率使用整數比例

## Module

| Item |  |  |  |  |  |  |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 輸出 | B | B |  | B | B |  |
| 名稱 | ID | Category |  | Name | Value |  |
| 資料型態 | int | string |  | string | int |  |
| 企劃名 | 編號 | 參數分類 | 參數描述 | 參數名稱 | 參數值 | 單位 |
|  | 1 | core | 基礎跑速單位，400 代表 4.00 px/s | BASE_SPEED | 400 | 0.01 px/s |
|  | 2 | core | 初始體力上限 | STAMINA_MAX | 1000 | 點 |
|  | 3 | core | 衝刺每秒體力消耗 | STAMINA_DRAIN_SPEED | 333 | 點/s |
|  | 4 | core | 初始每秒體力回復 | STAMINA_REGEN_SPEED | 80 | 點/s |
|  | 5 | core | 基礎吸附食物半徑 | BASE_SUCTION_RADIUS | 50 | px |
|  | 6 | core | 相機基礎視野倍率 | BASE_VISION_SCALE | 10000 | 萬分比 |
|  | 7 | core | 開局與重生初始長度 | INITIAL_LENGTH | 50 | 節 |
|  | 8 | core | 衝刺加速比例 | DASH_SPEED_BONUS | 25 | 百分比 |
|  | 9 | core | 初始暴食冷卻時間 | GLUTTONY_CD | 30 | s |
|  | 10 | core | 初始暴食吸附半徑 | GLUTTONY_RADIUS | 200 | px |
|  | 11 | core | 暴食吸引食物速度 | GLUTTONY_SUCTION_SPEED | 12 | px/s |
|  | 12 | core | 磁鐵吸引食物速度 | MAGNET_SUCTION_SPEED | 8 | px/s |
|  | 13 | core | 基礎吃食吸引速度 | BASE_SUCTION_SPEED | 4 | px/s |
|  | 14 | core | 每增加一節所需積分 | POINTS_PER_SECTION | 10 | 分 |
|  | 15 | core | 成長之路最高等級 | GROWTH_ROAD_MAX_LEVEL | 60 | level |
|  | 16 | mode | 單局限時 | GAME_DURATION | 120 | s |
|  | 17 | mode | 死亡復活倒數 | RESPAWN_TIME | 5000 | ms |
|  | 18 | mode | 復活幽靈無敵時間 | GHOST_TIME | 2000 | ms |
|  | 19 | mode | Solo 入場能量 | ENTRY_ENERGY_SOLO | 30 | 點 |
|  | 20 | mode | 大亂鬥入場能量 | ENTRY_ENERGY_BRAWL | 30 | 點 |
|  | 21 | mode | 陣營對抗入場能量 | ENTRY_ENERGY_TEAM | 30 | 點 |
|  | 22 | mode | 擊殺敵蛇積分 | KILL_SCORE | 100 | 分 |
|  | 23 | mode | 每次擊殺額外熟練度 | KILL_MASTERY_BONUS | 2 | 點 |
|  | 24 | mode | SSS 評級額外熟練度 | RATING_BONUS_SSS | 50 | 點 |
|  | 25 | mode | SS 評級額外熟練度 | RATING_BONUS_SS | 30 | 點 |
|  | 26 | mode | S 評級額外熟練度 | RATING_BONUS_S | 10 | 點 |
|  | 27 | map | 地圖寬度 | MAP_WIDTH | 2200 | px |
|  | 28 | map | 地圖高度 | MAP_HEIGHT | 2200 | px |
|  | 29 | map | 撞岩石或邊界長度扣除比例 | ROCK_BOUNCE_PENALTY_RATIO | 5000 | 萬分比 |
|  | 30 | map | 河流速度修正 | RIVER_SLOW_MULTIPLIER | -50 | 百分比 |
|  | 31 | map | 岩石區食物分配權重 | FOOD_DIST_ROCK | 5000 | 萬分比 |
|  | 32 | map | 河流區食物分配權重 | FOOD_DIST_RIVER | 3000 | 萬分比 |
|  | 33 | map | 平地區食物分配權重 | FOOD_DIST_PLAINS | 2000 | 萬分比 |
|  | 34 | map | 小食物積分 | FOOD_VAL_SMALL | 1 | 分 |
|  | 35 | map | 中食物積分 | FOOD_VAL_MEDIUM | 3 | 分 |
|  | 36 | map | 大食物積分 | FOOD_VAL_LARGE | 5 | 分 |
|  | 37 | map | 殘骸結晶積分 | FOOD_VAL_DEBRIS | 10 | 分 |
|  | 38 | map | 開局食物總分 | INITIAL_FOOD_POINTS | 2000 | 分 |
|  | 39 | map | 食物補足下限 | MIN_FOOD_POINTS | 1000 | 分 |
|  | 40 | map | 食物補充檢測週期 | FOOD_REPLENISH_INTERVAL | 10000 | ms |
|  | 41 | map | 死亡殘骸轉化比例 | DEBRIS_PERCENTAGE | 5000 | 萬分比 |
|  | 42 | map | 殘骸食物存在時間 | DEBRIS_LIFETIME | 10 | s |
|  | 43 | ai | AI 危急逃生半徑 | AI_EVADE_PANIC_DISTANCE | 80 | px |
|  | 44 | ai | AI 卡位預判時間 | AI_INTERCEPT_PREDICT_TIME | 500 | ms |
|  | 45 | ai | AI 搶奪資源半徑 | AI_DASH_RESOURCE_DISTANCE | 300 | px |
|  | 46 | ai | AI 追擊中止距離 | AI_CHASE_ABORT_DISTANCE | 250 | px |
|  | 47 | ai | AI 追擊中止時間 | AI_CHASE_ABORT_TIME | 1000 | ms |
|  | 48 | ai | AI 低長度禁用衝刺門檻 | AI_PROTECT_MIN_LENGTH | 80 | 節 |
|  | 49 | ai | AI 恢復衝刺門檻 | AI_PROTECT_RECOVERY_LENGTH | 120 | 節 |
|  | 50 | item | 磁鐵吸附半徑 | ITEM_MAGNET_RADIUS | 100 | px |
|  | 51 | item | 磁鐵持續時間 | ITEM_MAGNET_DURATION | 10 | s |
|  | 52 | item | 巨大蘑菇持續時間 | ITEM_MUSHROOM_DURATION | 10 | s |
|  | 53 | item | 巨大蘑菇體型倍率 | ITEM_MUSHROOM_SIZE | 15000 | 萬分比 |
|  | 54 | item | 巨大蘑菇速度修正 | ITEM_MUSHROOM_SPEED_PENALTY | -25 | 百分比 |
|  | 55 | item | 幸運糖持續時間 | ITEM_LUCKY7_DURATION | 10 | s |
|  | 56 | item | 幸運糖得分倍率 | ITEM_CANDY_MULTIPLIER | 30000 | 萬分比 |
|  | 57 | item | 鷹眼持續時間 | ITEM_EYE_DURATION | 10 | s |
|  | 58 | item | 鷹眼視野倍率 | ITEM_EYE_SCALE | 13500 | 萬分比 |
|  | 59 | item | 地圖道具刷新間隔 | ITEM_SPAWN_INTERVAL | 20 | s |
|  | 60 | item | 地圖道具同時存在上限 | ITEM_MAX_COUNT | 12 | 個 |
|  | 61 | item | 道具刷新預告時間 | ITEM_TEASER_TIME | 2 | s |
|  | 62 | item | 鷹眼基礎價格 | ITEM_EYE_BUY_COST | 2000 | 金幣 |
|  | 63 | item | 磁鐵基礎價格 | ITEM_MAGNET_BUY_COST | 4000 | 金幣 |
|  | 64 | item | 巨大蘑菇基礎價格 | ITEM_MUSHROOM_BUY_COST | 6000 | 金幣 |
|  | 65 | item | 幸運糖基礎價格 | ITEM_CANDY_BUY_COST | 8000 | 金幣 |
|  | 66 | item | 同款道具價格倍率 | BOOSTER_PRICE_MULTIPLIER | 15000 | 萬分比 |
|  | 67 | item | 高級道具初始單局上限 | BOOSTER_LIMIT_INITIAL | 2 | 次 |
|  | 68 | item | 高級道具最大單局上限 | BOOSTER_LIMIT_MAX | 5 | 次 |
|  | 69 | passive | 被動強化初始費用 | PASSIVE_UPGRADE_START_COST | 1000 | 金幣 |
|  | 70 | passive | 被動強化最高費用 | PASSIVE_UPGRADE_END_COST | 300000 | 金幣 |
|  | 71 | passive | S 曲線係數，24 代表 0.024 | PASSIVE_UPGRADE_SHAPE_K | 24 | 千分比 |
|  | 72 | passive | S 曲線拐點 | PASSIVE_UPGRADE_INFLECTION_X0 | 190 | 次 |
|  | 73 | cosmetic | 表情貼圖顯示時間 | EMOTE_DURATION | 2500 | ms |

## AIStrategy

| Item |  |  |  |  |  |  |  |  |  |  |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 輸出 | B |  | C |  | C | B | B | B | B | B |
| 名稱 | ID |  | NameStrID |  | DescStrID | ReactionDelay | SteeringPrecision | DashProbability | EvadeDistance | ChaseDistance |
| 資料型態 | int |  | int |  | int | int | int | int | int | int |
| 企劃名 | 編號 | 策略名稱 | 名稱字串表編號 | 策略描述 | 描述字串表編號 | 反應延遲(ms) | 轉彎精準度(萬分比) | 衝刺機率(萬分比) | 避險半徑(px) | 追逐半徑(px) |
|  | 1 | 初階 BOT |  | 基礎隨機移動 AI |  | 300 | 5000 | 1000 | 50 | 100 |
|  | 2 | 避險型 AI |  | 優先閃避威脅 |  | 150 | 7000 | 2000 | 250 | 150 |
|  | 3 | 收集型 AI |  | 優先收集食物與道具 |  | 120 | 8000 | 3000 | 150 | 400 |
|  | 4 | 截斷型 AI |  | 主動卡位截斷敵蛇 |  | 100 | 9000 | 5000 | 180 | 350 |
|  | 5 | 追獵型 AI |  | 追擊高分與長蛇 |  | 50 | 9500 | 6000 | 200 | 500 |

## PassiveUpgrade

| Item |  |  |  |  |  |  |  |  |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 輸出 | B |  | C |  | C | B | B |  |
| 名稱 | ID |  | NameStrID |  | DescStrID | StartValue | MaxValue |  |
| 資料型態 | int |  | int |  | int | int | int |  |
| 企劃名 | 編號 | 被動技名稱 | 名稱字串表編號 | 被動技描述 | 描述字串表編號 | Lv0 參數 | Lv40 參數 | 單位 |
|  | 1 | 磁吸半徑 |  | 磁吸半徑永久強化 |  | 100 | 200 | px |
|  | 2 | 巨大蘑菇跑速 |  | 巨大蘑菇跑速強化 |  | -2500 | 1500 | 萬分比 |
|  | 3 | 幸運糖倍率 |  | 幸運糖倍率強化 |  | 30000 | 70000 | 萬分比 |
|  | 4 | 鷹眼視野 |  | 鷹眼視野強化 |  | 13500 | 17500 | 萬分比 |
|  | 5 | 磁鐵時長 |  | 磁鐵時長強化 |  | 10 | 20 | 秒 |
|  | 6 | 巨大蘑菇時長 |  | 巨大蘑菇時長強化 |  | 10 | 20 | 秒 |
|  | 7 | 幸運糖時長 |  | 幸運糖時長強化 |  | 10 | 20 | 秒 |
|  | 8 | 鷹眼時長 |  | 鷹眼時長強化 |  | 10 | 20 | 秒 |
|  | 9 | 岩石抗性 |  | 岩石扣長減免 |  | -5000 | -1000 | 萬分比 |
|  | 10 | 河流抗性 |  | 河流減速減免 |  | -5000 | -1000 | 萬分比 |
