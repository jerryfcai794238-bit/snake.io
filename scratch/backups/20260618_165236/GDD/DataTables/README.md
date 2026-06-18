# 《貪食蛇》Ch16 遊戲資料表

## 格式規則

- `B`：Client + Server
- `C`：Client
- `S`：Server
- 資料型態只使用 `int`、`string`、`bool`
- 不使用 `float`；小數時間改用毫秒，倍率與機率使用整數比例

## GlobalParameter

| Item |  |  |  |  |  |  |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 輸出 | B | C | C | B | B | B |
| 名稱 | ID | Name | Desc | Value | Unit | Category |
| 資料型態 | int | string | string | int | string | string |
| 企劃名 | 編號 | 參數名稱 | 參數描述 | 參數值 | 單位 | 參數分類 |
|  | 1 | BASE_SPEED | 基礎跑速單位，400 代表 4.00 px/s | 400 | 0.01 px/s | core |
|  | 2 | STAMINA_MAX | 初始體力上限 | 1000 | 點 | core |
|  | 3 | STAMINA_DRAIN_SPEED | 衝刺每秒體力消耗 | 333 | 點/s | core |
|  | 4 | STAMINA_REGEN_SPEED | 初始每秒體力回復 | 80 | 點/s | core |
|  | 5 | BASE_SUCTION_RADIUS | 基礎吸附食物半徑 | 50 | px | core |
|  | 6 | BASE_VISION_SCALE | 相機基礎視野倍率 | 10000 | 萬分比 | core |
|  | 7 | INITIAL_LENGTH | 開局與重生初始長度 | 50 | 節 | core |
|  | 8 | DASH_SPEED_BONUS | 衝刺加速比例 | 25 | 百分比 | core |
|  | 9 | GLUTTONY_CD | 初始暴食冷卻時間 | 30 | s | core |
|  | 10 | GLUTTONY_RADIUS | 初始暴食吸附半徑 | 200 | px | core |
|  | 11 | GLUTTONY_SUCTION_SPEED | 暴食吸引食物速度 | 12 | px/s | core |
|  | 12 | MAGNET_SUCTION_SPEED | 磁鐵吸引食物速度 | 8 | px/s | core |
|  | 13 | BASE_SUCTION_SPEED | 基礎吃食吸引速度 | 4 | px/s | core |
|  | 14 | POINTS_PER_SECTION | 每增加一節所需積分 | 10 | 分 | core |
|  | 15 | GROWTH_ROAD_MAX_LEVEL | 成長之路最高等級 | 60 | level | core |
|  | 16 | GAME_DURATION | 單局限時 | 120 | s | mode |
|  | 17 | RESPAWN_TIME | 死亡復活倒數 | 5000 | ms | mode |
|  | 18 | GHOST_TIME | 復活幽靈無敵時間 | 2000 | ms | mode |
|  | 19 | ENTRY_ENERGY_SOLO | Solo 入場能量 | 30 | 點 | mode |
|  | 20 | ENTRY_ENERGY_BRAWL | 大亂鬥入場能量 | 30 | 點 | mode |
|  | 21 | ENTRY_ENERGY_TEAM | 陣營對抗入場能量 | 30 | 點 | mode |
|  | 22 | KILL_SCORE | 擊殺敵蛇積分 | 100 | 分 | mode |
|  | 23 | KILL_MASTERY_BONUS | 每次擊殺額外熟練度 | 2 | 點 | mode |
|  | 24 | RATING_BONUS_SSS | SSS 評級額外熟練度 | 50 | 點 | mode |
|  | 25 | RATING_BONUS_SS | SS 評級額外熟練度 | 30 | 點 | mode |
|  | 26 | RATING_BONUS_S | S 評級額外熟練度 | 10 | 點 | mode |
|  | 27 | MAP_WIDTH | 地圖寬度 | 2200 | px | map |
|  | 28 | MAP_HEIGHT | 地圖高度 | 2200 | px | map |
|  | 29 | ROCK_BOUNCE_PENALTY_RATIO | 撞岩石或邊界長度扣除比例 | 5000 | 萬分比 | map |
|  | 30 | RIVER_SLOW_MULTIPLIER | 河流速度修正 | -50 | 百分比 | map |
|  | 31 | FOOD_DIST_ROCK | 岩石區食物分配權重 | 5000 | 萬分比 | map |
|  | 32 | FOOD_DIST_RIVER | 河流區食物分配權重 | 3000 | 萬分比 | map |
|  | 33 | FOOD_DIST_PLAINS | 平地區食物分配權重 | 2000 | 萬分比 | map |
|  | 34 | FOOD_VAL_SMALL | 小食物積分 | 1 | 分 | map |
|  | 35 | FOOD_VAL_MEDIUM | 中食物積分 | 3 | 分 | map |
|  | 36 | FOOD_VAL_LARGE | 大食物積分 | 5 | 分 | map |
|  | 37 | FOOD_VAL_DEBRIS | 殘骸結晶積分 | 10 | 分 | map |
|  | 38 | INITIAL_FOOD_POINTS | 開局食物總分 | 2000 | 分 | map |
|  | 39 | MIN_FOOD_POINTS | 食物補足下限 | 1000 | 分 | map |
|  | 40 | FOOD_REPLENISH_INTERVAL | 食物補充檢測週期 | 10000 | ms | map |
|  | 41 | DEBRIS_PERCENTAGE | 死亡殘骸轉化比例 | 5000 | 萬分比 | map |
|  | 42 | DEBRIS_LIFETIME | 殘骸食物存在時間 | 10 | s | map |
|  | 43 | AI_EVADE_PANIC_DISTANCE | AI 危急逃生半徑 | 80 | px | ai |
|  | 44 | AI_INTERCEPT_PREDICT_TIME | AI 卡位預判時間 | 500 | ms | ai |
|  | 45 | AI_DASH_RESOURCE_DISTANCE | AI 搶奪資源半徑 | 300 | px | ai |
|  | 46 | AI_CHASE_ABORT_DISTANCE | AI 追擊中止距離 | 250 | px | ai |
|  | 47 | AI_CHASE_ABORT_TIME | AI 追擊中止時間 | 1000 | ms | ai |
|  | 48 | AI_PROTECT_MIN_LENGTH | AI 低長度禁用衝刺門檻 | 80 | 節 | ai |
|  | 49 | AI_PROTECT_RECOVERY_LENGTH | AI 恢復衝刺門檻 | 120 | 節 | ai |
|  | 50 | ITEM_MAGNET_RADIUS | 磁鐵吸附半徑 | 100 | px | item |
|  | 51 | ITEM_MAGNET_DURATION | 磁鐵持續時間 | 10 | s | item |
|  | 52 | ITEM_MUSHROOM_DURATION | 巨大蘑菇持續時間 | 10 | s | item |
|  | 53 | ITEM_MUSHROOM_SIZE | 巨大蘑菇體型倍率 | 15000 | 萬分比 | item |
|  | 54 | ITEM_MUSHROOM_SPEED_PENALTY | 巨大蘑菇速度修正 | -25 | 百分比 | item |
|  | 55 | ITEM_LUCKY7_DURATION | 幸運糖持續時間 | 10 | s | item |
|  | 56 | ITEM_CANDY_MULTIPLIER | 幸運糖得分倍率 | 30000 | 萬分比 | item |
|  | 57 | ITEM_EYE_DURATION | 鷹眼持續時間 | 10 | s | item |
|  | 58 | ITEM_EYE_SCALE | 鷹眼視野倍率 | 13500 | 萬分比 | item |
|  | 59 | ITEM_SPAWN_INTERVAL | 地圖道具刷新間隔 | 20 | s | item |
|  | 60 | ITEM_MAX_COUNT | 地圖道具同時存在上限 | 12 | 個 | item |
|  | 61 | ITEM_TEASER_TIME | 道具刷新預告時間 | 2 | s | item |
|  | 62 | ITEM_EYE_BUY_COST | 鷹眼基礎價格 | 2000 | 金幣 | item |
|  | 63 | ITEM_MAGNET_BUY_COST | 磁鐵基礎價格 | 4000 | 金幣 | item |
|  | 64 | ITEM_MUSHROOM_BUY_COST | 巨大蘑菇基礎價格 | 6000 | 金幣 | item |
|  | 65 | ITEM_CANDY_BUY_COST | 幸運糖基礎價格 | 8000 | 金幣 | item |
|  | 66 | BOOSTER_PRICE_MULTIPLIER | 同款道具價格倍率 | 15000 | 萬分比 | item |
|  | 67 | BOOSTER_LIMIT_INITIAL | 高級道具初始單局上限 | 2 | 次 | item |
|  | 68 | BOOSTER_LIMIT_MAX | 高級道具最大單局上限 | 5 | 次 | item |
|  | 69 | PASSIVE_UPGRADE_START_COST | 被動強化初始費用 | 1000 | 金幣 | passive |
|  | 70 | PASSIVE_UPGRADE_END_COST | 被動強化最高費用 | 300000 | 金幣 | passive |
|  | 71 | PASSIVE_UPGRADE_SHAPE_K | S 曲線係數，24 代表 0.024 | 24 | 千分比 | passive |
|  | 72 | PASSIVE_UPGRADE_INFLECTION_X0 | S 曲線拐點 | 190 | 次 | passive |
|  | 73 | EMOTE_DURATION | 表情貼圖顯示時間 | 2500 | ms | cosmetic |

## AIStrategy

| Item |  |  |  |  |  |  |  |  |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 輸出 | B | C | C | B | B | B | B | B |
| 名稱 | ID | Name | Desc | ReactionDelay | SteeringPrecision | DashProbability | EvadeDistance | ChaseDistance |
| 資料型態 | int | string | string | int | int | int | int | int |
| 企劃名 | 編號 | 策略名稱 | 策略描述 | 反應延遲(ms) | 轉彎精準度(萬分比) | 衝刺機率(萬分比) | 避險半徑(px) | 追逐半徑(px) |
|  | 1 | 初階 BOT | 基礎隨機移動 AI | 300 | 5000 | 1000 | 50 | 100 |
|  | 2 | 避險型 AI | 優先閃避威脅 | 150 | 7000 | 2000 | 250 | 150 |
|  | 3 | 收集型 AI | 優先收集食物與道具 | 120 | 8000 | 3000 | 150 | 400 |
|  | 4 | 截斷型 AI | 主動卡位截斷敵蛇 | 100 | 9000 | 5000 | 180 | 350 |
|  | 5 | 追獵型 AI | 追擊高分與長蛇 | 50 | 9500 | 6000 | 200 | 500 |

## PassiveUpgrade

| Item |  |  |  |  |  |  |  |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 輸出 | B | C | C | B | B | B | B |
| 名稱 | ID | Name | Desc | StartValue | MaxValue | LevelAdd | Unit |
| 資料型態 | int | string | string | int | int | int | string |
| 企劃名 | 編號 | 參數名稱 | 參數描述 | Lv0 數值 | Lv40 數值 | 每級增量 | 單位 |
|  | 1 | PASSIVE_MAGNET_UPGRADE | 磁吸半徑永久強化 | 1000 | 2000 | 25 | 0.1 px |
|  | 2 | PASSIVE_SPEED_UPGRADE | 巨大蘑菇跑速強化 | -25 | 15 | 1 | 百分比 |
|  | 3 | PASSIVE_LUCKY7_UPGRADE | 幸運糖倍率強化 | 30000 | 70000 | 1000 | 萬分比 |
|  | 4 | PASSIVE_EYE_UPGRADE | 鷹眼視野強化 | 13500 | 17500 | 100 | 萬分比 |
|  | 5 | PASSIVE_MAGNET_DUR | 磁鐵時長強化 | 10000 | 20000 | 250 | ms |
|  | 6 | PASSIVE_MUSHROOM_DUR | 巨大蘑菇時長強化 | 10000 | 20000 | 250 | ms |
|  | 7 | PASSIVE_CANDY_DUR | 幸運糖時長強化 | 10000 | 20000 | 250 | ms |
|  | 8 | PASSIVE_EYE_DUR | 鷹眼時長強化 | 10000 | 20000 | 250 | ms |
|  | 9 | PASSIVE_ROCK_RESIST | 岩石扣長減免 | -5000 | -1000 | 100 | 萬分比 |
|  | 10 | PASSIVE_RIVER_RESIST | 河流減速減免 | -50 | -10 | 1 | 百分比 |
