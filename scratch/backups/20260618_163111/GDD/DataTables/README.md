# 《貪食蛇》Ch16 資料表 Schema

資料來源：`GDD/貪食蛇GDD.md` Ch16.1～Ch16.8。

## 1. `snake_global_parameters`

Ch16 的全域常數建議集中使用 Key-Value 結構，避免每新增參數都修改資料庫欄位。

| 欄位名稱 | 資料型別 | 說明 | 範例／備註 |
| :--- | :--- | :--- | :--- |
| `id` | `INT UNSIGNED (PK, Auto-Inc)` | 唯一識別碼 |  |
| `parameter_key` | `VARCHAR(64) UNIQUE` | Ch16 參數唯一 Key | `GAME_DURATION` |
| `category` | `VARCHAR(32) (Index)` | 參數分類 | `core`、`mode`、`map`、`ai`、`item`、`passive`、`cosmetic` |
| `value_type` | `VARCHAR(24)` | 參數值資料型態 | `INT`、`DECIMAL(4,2)` |
| `int_value` | `BIGINT NULL` | 整數參數值 | 與 `decimal_value` 擇一使用 |
| `decimal_value` | `DECIMAL(12,4) NULL` | 小數參數值 | `AI_INTERCEPT_PREDICT_TIME = 0.5` |
| `unit` | `VARCHAR(16) NULL` | 顯示及換算單位 | `ms`、`s`、`px`、`百分比`、`萬分比` |
| `description` | `VARCHAR(255)` | 參數用途說明 |  |
| `is_active` | `TINYINT UNSIGNED` | 是否啟用 | `0`：停用，`1`：啟用 |
| `updated_time` | `DATETIME` | 更新時間 |  |

約束：`int_value` 與 `decimal_value` 必須且只能有一個非 `NULL`。

## 2. `snake_ai_strategy_parameters`

Ch16.5 的五種 AI 策略為多列配置，不適合塞入單一全域參數值。

| 欄位名稱 | 資料型別 | 說明 | 範例／備註 |
| :--- | :--- | :--- | :--- |
| `id` | `INT UNSIGNED (PK, Auto-Inc)` | 唯一識別碼 |  |
| `strategy_key` | `VARCHAR(32) UNIQUE` | AI 策略代碼 | `beginner`、`evade`、`collector`、`interceptor`、`hunter` |
| `reaction_delay_ms` | `INT UNSIGNED` | 反應延遲 | 50～300 |
| `steering_precision` | `INT UNSIGNED` | 轉彎精準度，萬分比 | 5000～9500 |
| `dash_probability` | `INT UNSIGNED` | 衝刺決策機率，萬分比 | 1000～6000 |
| `evade_distance_px` | `INT UNSIGNED` | 避險檢測半徑 | 50～250 |
| `chase_distance_px` | `INT UNSIGNED` | 追逐／尋路半徑 | 100～500 |
| `is_active` | `TINYINT UNSIGNED` | 是否啟用 | `0`：停用，`1`：啟用 |
| `updated_time` | `DATETIME` | 更新時間 |  |

## 3. `snake_player_progression`

玩家個人的主動技能等級與解鎖狀態不屬於全域參數，需獨立保存。

| 欄位名稱 | 資料型別 | 說明 | 範例／備註 |
| :--- | :--- | :--- | :--- |
| `id` | `INT UNSIGNED (PK, Auto-Inc)` | 唯一識別碼 |  |
| `player_id` | `BIGINT UNSIGNED (Index)` | 玩家唯一識別 ID |  |
| `growth_road_lv` | `TINYINT UNSIGNED` | 成長之路等級 | 預設 0，最高 60 |
| `dash_stamina_lv` | `TINYINT UNSIGNED` | 衝刺體力上限等級 | 預設 0，最高 4 |
| `dash_recover_lv` | `TINYINT UNSIGNED` | 衝刺體力回復速度等級 | 預設 0，最高 4 |
| `voracity_radius_lv` | `TINYINT UNSIGNED` | 暴食吸附半徑等級 | 預設 0，最高 4 |
| `voracity_cd_lv` | `TINYINT UNSIGNED` | 暴食冷卻縮短等級 | 預設 0，最高 4 |
| `is_voracity_unlocked` | `TINYINT UNSIGNED` | 是否解鎖暴食技能 | `0`：未解鎖，`1`：已解鎖 |
| `updated_time` | `DATETIME` | 更新時間 |  |

建議對 `player_id` 建立唯一索引。

## 4. `snake_player_passive_levels`

Ch16.7 的十種被動屬性各自具有 Lv0～Lv40。

| 欄位名稱 | 資料型別 | 說明 | 範例／備註 |
| :--- | :--- | :--- | :--- |
| `id` | `INT UNSIGNED (PK, Auto-Inc)` | 唯一識別碼 |  |
| `player_id` | `BIGINT UNSIGNED (Index)` | 玩家唯一識別 ID |  |
| `passive_key` | `VARCHAR(32)` | 被動屬性代碼 | `magnet_radius`、`river_resist` |
| `level` | `TINYINT UNSIGNED` | 目前強化等級 | 預設 0，最高 40 |
| `updated_time` | `DATETIME` | 更新時間 |  |

建議建立 `UNIQUE(player_id, passive_key)`。

## 5. `snake_player_booster_limits`

局內直購道具的玩家單局次數上限由成長之路解鎖。

| 欄位名稱 | 資料型別 | 說明 | 範例／備註 |
| :--- | :--- | :--- | :--- |
| `id` | `INT UNSIGNED (PK, Auto-Inc)` | 唯一識別碼 |  |
| `player_id` | `BIGINT UNSIGNED (Index)` | 玩家唯一識別 ID |  |
| `booster_key` | `VARCHAR(32)` | 道具代碼 | `eye`、`magnet`、`mushroom`、`candy` |
| `match_use_limit` | `TINYINT UNSIGNED` | 單局使用次數上限 | 預設 2，最高 5 |
| `updated_time` | `DATETIME` | 更新時間 |  |

建議建立 `UNIQUE(player_id, booster_key)`。
