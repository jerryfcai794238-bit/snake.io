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
|  | 50 | item | 地圖道具刷新間隔 | ITEM_SPAWN_INTERVAL | 20 | s |
|  | 51 | item | 地圖道具同時存在上限 | ITEM_MAX_COUNT | 12 | 個 |
|  | 52 | item | 道具刷新預告時間 | ITEM_TEASER_TIME | 2 | s |
|  | 53 | item | 鷹眼基礎價格 | ITEM_EYE_BUY_COST | 2000 | 金幣 |
|  | 54 | item | 磁鐵基礎價格 | ITEM_MAGNET_BUY_COST | 4000 | 金幣 |
|  | 55 | item | 巨大蘑菇基礎價格 | ITEM_MUSHROOM_BUY_COST | 6000 | 金幣 |
|  | 56 | item | 幸運糖基礎價格 | ITEM_CANDY_BUY_COST | 8000 | 金幣 |
|  | 57 | item | 同款道具價格倍率 | BOOSTER_PRICE_MULTIPLIER | 15000 | 萬分比 |
|  | 58 | item | 高級道具初始單局上限 | BOOSTER_LIMIT_INITIAL | 2 | 次 |
|  | 59 | item | 高級道具最大單局上限 | BOOSTER_LIMIT_MAX | 5 | 次 |
|  | 60 | passive | 被動強化初始費用 | PASSIVE_UPGRADE_START_COST | 1000 | 金幣 |
|  | 61 | passive | 被動強化最高費用 | PASSIVE_UPGRADE_END_COST | 300000 | 金幣 |
|  | 62 | passive | S 曲線係數，24 代表 0.024 | PASSIVE_UPGRADE_SHAPE_K | 24 | 千分比 |
|  | 63 | passive | S 曲線拐點 | PASSIVE_UPGRADE_INFLECTION_X0 | 190 | 次 |
|  | 64 | cosmetic | 表情貼圖顯示時間 | EMOTE_DURATION | 2500 | ms |

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

## ActiveSkill

| Item |  |  |  |  |  |  |  |  |  |  |  |
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

## Skin

> 價格、貨幣類型、限時狀態與字串表編號尚未在 GDD／美術需求定義，暫留空白。

| Item |  |  |  |  |  |  |  |  |  |  |  |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 輸出 | B |  | C |  | C | C | B | B | B | B | B |
| 名稱 | ID |  | NameStrID |  | DescStrID | AssetID | Price | CurrencyType | DefaultUnlock | IsLimited | IsEnabled |
| 資料型態 | int |  | int |  | int | string | int | int | bool | bool | bool |
| 企劃名 | 編號 | 造型名稱 | 名稱字串表編號 | 造型描述 | 描述字串表編號 | 資源 ID | 價格 | 貨幣類型 | 預設解鎖 | 限時商品 | 啟用狀態 |
|  | 1 | 經典綠蛇 |  | 綠色、乾淨、最基礎的蛇身 |  | Skin-001 |  |  | true |  | true |
|  | 2 | 藍莓蛇 |  | 藍紫色、果凍質感 |  | Skin-002 |  |  | false |  | true |
|  | 3 | 草莓蛇 |  | 紅粉色、草莓籽點綴 |  | Skin-003 |  |  | false |  | true |
|  | 4 | 橘子蛇 |  | 橘色、果皮紋路 |  | Skin-004 |  |  | false |  | true |
|  | 5 | 西瓜蛇 |  | 綠皮紅肉或西瓜條紋 |  | Skin-005 |  |  | false |  | true |
|  | 6 | 蜂蜜蛇 |  | 黃金色、蜂蜜滴落感 |  | Skin-006 |  |  | false |  | true |
|  | 7 | 奶油蛇 |  | 淡色、奶油捲感 |  | Skin-007 |  |  | false |  | true |
|  | 8 | 火焰蛇 |  | 紅橘火焰紋 |  | Skin-008 |  |  | false |  | true |
|  | 9 | 冰晶蛇 |  | 淺藍冰晶、透明感 |  | Skin-009 |  |  | false |  | true |
|  | 10 | 雷電蛇 |  | 黃紫電光紋 |  | Skin-010 |  |  | false |  | true |
|  | 11 | 星光蛇 |  | 深色底、星星點綴 |  | Skin-011 |  |  | false |  | true |
|  | 12 | 彩虹蛇 |  | 多色漸層節點 |  | Skin-012 |  |  | false |  | true |
|  | 13 | 機械蛇 |  | 金屬節點、螺絲或裝甲 |  | Skin-013 |  |  | false |  | true |
|  | 14 | 忍者蛇 |  | 深色布條、忍者頭巾 |  | Skin-014 |  |  | false |  | true |
|  | 15 | 海盜蛇 |  | 眼罩、條紋、海盜元素 |  | Skin-015 |  |  | false |  | true |
|  | 16 | 牛仔蛇 |  | 牛仔帽、皮革色系 |  | Skin-016 |  |  | false |  | true |
|  | 17 | 太空蛇 |  | 太空衣、星艦感 |  | Skin-017 |  |  | false |  | true |
|  | 18 | 甜甜圈蛇 |  | 糖霜、甜甜圈配色 |  | Skin-018 |  |  | false |  | true |
|  | 19 | 龍紋蛇 |  | 東方龍鱗、鬚角簡化 |  | Skin-019 |  |  | false |  | true |
|  | 20 | 霓虹蛇 |  | 亮色線條、夜光感 |  | Skin-020 |  |  | false |  | true |
|  | 21 | 破壞王蛇 |  | 龐克、貼紙、裂紋 |  | Skin-021 |  |  | false |  | true |

## Emote

> `TriggerType`：`0` 通用、`1` 擊殺、`2` 截斷、`3` 死亡、`4` 被截斷、`5` 擦身。價格、貨幣類型與字串表編號尚未定義，暫留空白。

| Item |  |  |  |  |  |  |  |  |  |  |  |  |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 輸出 | B |  | C |  | C | C | B | B | B | B | B | B |
| 名稱 | ID |  | NameStrID |  | DescStrID | AssetID | TriggerType | Price | CurrencyType | DefaultUnlock | IsEnabled | Duration |
| 資料型態 | int |  | int |  | int | string | int | int | int | bool | bool | int |
| 企劃名 | 編號 | 貼圖名稱 | 名稱字串表編號 | 貼圖描述 | 描述字串表編號 | 資源 ID | 觸發類型 | 價格 | 貨幣類型 | 預設解鎖 | 啟用狀態 | 顯示時間(ms) |
|  | 1 | 開心 |  | 大笑、閃光、正向 |  | Emote-B01 | 0 |  |  | true | true | 2500 |
|  | 2 | 生氣 |  | 鼓臉、怒符號 |  | Emote-B02 | 0 |  |  | true | true | 2500 |
|  | 3 | 哭哭 |  | 淚眼、委屈 |  | Emote-B03 | 0 |  |  | true | true | 2500 |
|  | 4 | 驚訝 |  | 張嘴、問號或驚嘆號 |  | Emote-B04 | 0 |  |  | true | true | 2500 |
|  | 5 | 得意 |  | 墨鏡、挑眉、勝利感 |  | Emote-B05 | 0 |  |  | true | true | 2500 |
|  | 6 | 帥氣收割 |  | 墨鏡、光芒 |  | Emote-Kill-01 | 1 |  |  | false | true | 2500 |
|  | 7 | 小惡魔笑 |  | 調皮壞笑 |  | Emote-Kill-02 | 1 |  |  | false | true | 2500 |
|  | 8 | 連擊興奮 |  | 火花、上揚 |  | Emote-Kill-03 | 1 |  |  | false | true | 2500 |
|  | 9 | 王者姿態 |  | 皇冠、挺胸 |  | Emote-Kill-04 | 1 |  |  | false | true | 2500 |
|  | 10 | 拍手叫好 |  | 手掌、星星 |  | Emote-Kill-05 | 1 |  |  | false | true | 2500 |
|  | 11 | 冷酷轉身 |  | 背影、風線 |  | Emote-Kill-06 | 1 |  |  | false | true | 2500 |
|  | 12 | 爽快爆笑 |  | 大笑、動感線 |  | Emote-Kill-07 | 1 |  |  | false | true | 2500 |
|  | 13 | 剪刀手 |  | 剪刀或切線 |  | Emote-Cut-01 | 2 |  |  | false | true | 2500 |
|  | 14 | 精準命中 |  | 靶心、閃光 |  | Emote-Cut-02 | 2 |  |  | false | true | 2500 |
|  | 15 | 切開啦 |  | 誇張切痕但不血腥 |  | Emote-Cut-03 | 2 |  |  | false | true | 2500 |
|  | 16 | 神操作 |  | 星星眼 |  | Emote-Cut-04 | 2 |  |  | false | true | 2500 |
|  | 17 | 擋路成功 |  | 路障、得意 |  | Emote-Cut-05 | 2 |  |  | false | true | 2500 |
|  | 18 | 驚險一刀 |  | 速度線 |  | Emote-Cut-06 | 2 |  |  | false | true | 2500 |
|  | 19 | 技巧炫耀 |  | 手勢、閃耀 |  | Emote-Cut-07 | 2 |  |  | false | true | 2500 |
|  | 20 | 暈倒 |  | 轉圈眼 |  | Emote-Death-01 | 3 |  |  | false | true | 2500 |
|  | 21 | 碎掉了 |  | 破裂表情 |  | Emote-Death-02 | 3 |  |  | false | true | 2500 |
|  | 22 | 不敢相信 |  | 問號、驚訝 |  | Emote-Death-03 | 3 |  |  | false | true | 2500 |
|  | 23 | 哭到變形 |  | 大哭 |  | Emote-Death-04 | 3 |  |  | false | true | 2500 |
|  | 24 | 被撞飛 |  | 星星、飛出感 |  | Emote-Death-05 | 3 |  |  | false | true | 2500 |
|  | 25 | 再來一次 |  | 握拳、燃起 |  | Emote-Death-06 | 3 |  |  | false | true | 2500 |
|  | 26 | 靈魂出竅 |  | 小幽默靈魂感，不恐怖 |  | Emote-Death-07 | 3 |  |  | false | true | 2500 |
|  | 27 | 啊被切了 |  | 驚嚇、切線 |  | Emote-CutBy-01 | 4 |  |  | false | true | 2500 |
|  | 28 | 大失算 |  | 冷汗 |  | Emote-CutBy-02 | 4 |  |  | false | true | 2500 |
|  | 29 | 不服氣 |  | 鼓臉 |  | Emote-CutBy-03 | 4 |  |  | false | true | 2500 |
|  | 30 | 快跑啊 |  | 慌張腳步 |  | Emote-CutBy-04 | 4 |  |  | false | true | 2500 |
|  | 31 | 求放過 |  | 雙手合十 |  | Emote-CutBy-05 | 4 |  |  | false | true | 2500 |
|  | 32 | 差一點 |  | 流汗、驚嘆號 |  | Emote-CutBy-06 | 4 |  |  | false | true | 2500 |
|  | 33 | 記住你了 |  | 盯著看 |  | Emote-CutBy-07 | 4 |  |  | false | true | 2500 |
|  | 34 | 好險 |  | 冷汗、鬆口氣 |  | Emote-Near-01 | 5 |  |  | false | true | 2500 |
|  | 35 | 差點撞 |  | 震驚眼 |  | Emote-Near-02 | 5 |  |  | false | true | 2500 |
|  | 36 | 神閃避 |  | 閃電、殘影 |  | Emote-Near-03 | 5 |  |  | false | true | 2500 |
|  | 37 | 太刺激 |  | 星星眼 |  | Emote-Near-04 | 5 |  |  | false | true | 2500 |
|  | 38 | 心跳加速 |  | 心跳線 |  | Emote-Near-05 | 5 |  |  | false | true | 2500 |
|  | 39 | 你追不到 |  | 調皮吐舌 |  | Emote-Near-06 | 5 |  |  | false | true | 2500 |
|  | 40 | 近距離挑釁 |  | 嘻笑、手勢 |  | Emote-Near-07 | 5 |  |  | false | true | 2500 |
