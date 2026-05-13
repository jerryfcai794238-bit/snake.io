import { CONFIG } from './constants.js';
import { Snake } from './snake.js';

export class Game {
    constructor() {
        this.snakes = [];
        this.food = [];
        this.items = []; // 隨機道具 (v4.0)
        this.stones = [];
        this.terrains = [];
        this.effects = [];
        this.player = null;
        this.mode = 'solo';
        this.isPlaying = false;
        this.isGameOver = false;
        this.timer = CONFIG.SOLO_TIME;
        this.lastSecond = 0;
        this.bestScore = localStorage.getItem('snake_best') || 0;
        this.respawnQueue = [];
        this.itemSpawnTimer = 0;
    }

    init() {
        this.snakes = [];
        this.food = [];
        this.items = [];
        this.stones = [];
        this.terrains = [];
        this.effects = [];
        this.respawnQueue = [];
        this.timer = CONFIG.SOLO_TIME;
        this.isGameOver = false;
        this.itemSpawnTimer = 0;
        
        const size = CONFIG.WORLD_SIZE;
        const numRivers = 2;
        for (let r = 0; r < numRivers; r++) {
            const rx = (Math.random() - 0.5) * size * 0.5;
            const ry = (Math.random() - 0.5) * size * 0.5;
            for (let i = 0; i < 5; i++) {
                this.terrains.push({ type: 'river', x: rx + i * 120, y: ry + Math.sin(i * 0.5) * 100, radius: 60 + Math.random() * 20 });
            }
        }
        const numStones = Math.floor(Math.random() * 10) + 25; // 稍微增加石頭
        for (let i = 0; i < numStones; i++) {
            const s = { x: (Math.random() - 0.5) * size * 0.9, y: (Math.random() - 0.5) * size * 0.9, radius: 25 + Math.random() * 30 };
            const tooClose = this.stones.some(other => Math.sqrt((s.x - other.x) ** 2 + (s.y - other.y) ** 2) < (s.radius + other.radius + 80));
            const nearCenter = Math.sqrt(s.x ** 2 + s.y ** 2) < 200;
            if (!tooClose && !nearCenter) this.stones.push(s);
        }
    }

    getSafeSpawnPoint() {
        const margin = 100;
        const minSnakeDist = 400; 
        let x, y, safe = false;
        let attempts = 0;
        while (!safe && attempts < 100) {
            x = (Math.random() - 0.5) * (CONFIG.WORLD_SIZE - margin * 2);
            y = (Math.random() - 0.5) * (CONFIG.WORLD_SIZE - margin * 2);
            const stoneSafe = !this.stones.some(s => Math.sqrt((x - s.x) ** 2 + (y - s.y) ** 2) < s.radius + 80);
            const snakeSafe = !this.snakes.some(s => !s.isDead && Math.sqrt((x - s.head.x) ** 2 + (y - s.head.y) ** 2) < minSnakeDist);
            safe = stoneSafe && snakeSafe;
            attempts++;
        }
        return { x, y };
    }

    calculateBestStartAngle(x, y) {
        let bestAngle = 0;
        let maxDist = -1;
        const halfSize = CONFIG.WORLD_SIZE / 2;
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI * 2) / 12;
            const dx = Math.cos(angle);
            const dy = Math.sin(angle);
            let dWall = Infinity;
            if (dx > 0) dWall = Math.min(dWall, (halfSize - x) / dx);
            if (dx < 0) dWall = Math.min(dWall, (-halfSize - x) / dx);
            if (dy > 0) dWall = Math.min(dWall, (halfSize - y) / dy);
            if (dy < 0) dWall = Math.min(dWall, (-halfSize - y) / dy);
            let dStone = Infinity;
            for (const s of this.stones) {
                const sdx = s.x - x;
                const sdy = s.y - y;
                const dot = sdx * dx + sdy * dy;
                if (dot > 0) {
                    const perpDistSq = (sdx * sdx + sdy * sdy) - dot * dot;
                    if (perpDistSq < s.radius * s.radius) {
                        const distToIntersection = dot - Math.sqrt(s.radius * s.radius - perpDistSq);
                        if (distToIntersection > 0) dStone = Math.min(dStone, distToIntersection);
                    }
                }
            }
            let dSnake = Infinity;
            for (const s of this.snakes) {
                if (s.isDead) continue;
                const sdx = s.head.x - x;
                const sdy = s.head.y - y;
                const dot = sdx * dx + sdy * dy;
                if (dot > 0) {
                    const distSq = sdx * sdx + sdy * sdy;
                    if (distSq < 400 ** 2) dSnake = Math.min(dSnake, Math.sqrt(distSq));
                }
            }
            const score = Math.min(dWall, dStone, dSnake);
            if (score > maxDist) { maxDist = score; bestAngle = angle; }
        }
        return bestAngle;
    }

    start(mode) {
        this.mode = mode;
        this.isPlaying = true;
        this.lastSecond = Date.now();
        const pPos = this.getSafeSpawnPoint();
        this.player = new Snake('player', 'You', CONFIG.COLORS.PLAYER, pPos.x, pPos.y, false, this.calculateBestStartAngle(pPos.x, pPos.y));
        this.snakes = [this.player];

        if (mode === 'duel') {
            const aiConfigs = [
                { name: 'Bot Alpha', color: '#FF44CC' },
                { name: 'Bot Beta', color: '#FF8800' },
                { name: 'Bot Gamma', color: '#00CCFF' },
                { name: 'Bot Delta', color: '#FF3333' },
                { name: 'Bot Epsilon', color: '#FFFF00' },
                { name: 'Bot Zeta', color: '#00FF00' },
                { name: 'Bot Eta', color: '#BC13FE' }
            ];
            aiConfigs.forEach((cfg, index) => {
                const aPos = this.getSafeSpawnPoint();
                this.snakes.push(new Snake(`ai-${index}`, cfg.name, cfg.color, aPos.x, aPos.y, true, this.calculateBestStartAngle(aPos.x, aPos.y)));
            });
        }
        for (let i = 0; i < 1000; i++) this.spawnResource();
    }

    spawnResource() {
        let x, y, isNearStone = false, terrainType = null;
        const size = CONFIG.WORLD_SIZE;
        const rand = Math.random();
        if (rand < 0.2 && this.terrains.length > 0) {
            const t = this.terrains[Math.floor(Math.random() * this.terrains.length)];
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * t.radius;
            x = t.x + Math.cos(angle) * dist; y = t.y + Math.sin(angle) * dist;
            terrainType = t.type;
        } else if (rand < 0.5 && this.stones.length > 0) {
            const stone = this.stones[Math.floor(Math.random() * this.stones.length)];
            const angle = Math.random() * Math.PI * 2;
            const dist = stone.radius + 10 + Math.random() * 50;
            x = stone.x + Math.cos(angle) * dist; y = stone.y + Math.sin(angle) * dist;
            isNearStone = true;
        } else {
            x = (Math.random() - 0.5) * (size - 80); y = (Math.random() - 0.5) * (size - 80);
        }
        if (Math.abs(x) > size / 2 - 20 || Math.abs(y) > size / 2 - 20) return;
        for (const s of this.stones) { if ((x - s.x) ** 2 + (y - s.y) ** 2 < s.radius ** 2) return; }
        let type = 'SMALL';
        if (isNearStone || terrainType === 'river') type = Math.random() < 0.3 ? 'LARGE' : 'MEDIUM';
        else { if (Math.random() < 0.05) type = 'LARGE'; else if (Math.random() < 0.2) type = 'MEDIUM'; }
        const foodData = CONFIG.FOOD_TYPES[type];
        this.food.push({ x, y, size: foodData.size, value: foodData.value });
    }

    dropTailFood(snake, value) {
        if (value < 0.1) return;
        const pos = snake.getTailPosition();
        if (!pos) return;
        this.food.push({ x: pos.x, y: pos.y, size: 3.5, value: value });
    }

    update(input, dt) {
        if (!this.isPlaying || this.isGameOver) return;
        const now = Date.now();
        if (now - this.lastSecond >= 1000) { this.timer--; this.lastSecond = now; if (this.timer <= 0) this.endGame(); }
        
        for (let i = this.respawnQueue.length - 1; i >= 0; i--) {
            this.respawnQueue[i].time -= dt * 1000;
            if (this.respawnQueue[i].time <= 0) { this.respawn(this.respawnQueue[i].snake); this.respawnQueue.splice(i, 1); }
        }
        for (let i = this.effects.length - 1; i >= 0; i--) {
            this.effects[i].life -= dt; if (this.effects[i].life <= 0) this.effects.splice(i, 1);
        }
        for (let i = this.food.length - 1; i >= 0; i--) {
            if (this.food[i].expires !== undefined) {
                this.food[i].expires -= dt;
                if (this.food[i].expires <= 0) this.food.splice(i, 1);
            }
        }

        // 更新隨機道具計時與生成 (v4.0)
        this.itemSpawnTimer -= dt * 1000;
        if (this.itemSpawnTimer <= 0) {
            this.analyzeAndSpawnItems();
            this.itemSpawnTimer = CONFIG.ITEM_SPAWN_INTERVAL;
        }
        for (let i = this.items.length - 1; i >= 0; i--) {
            if (this.items[i].teaserTime > 0) {
                this.items[i].teaserTime -= dt;
            }
        }

        // 食物吸力邏輯 (磁力漩渦演出與基礎吸力)
        for (let i = this.food.length - 1; i >= 0; i--) {
            const f = this.food[i];
            this.snakes.forEach(snake => {
                if (snake.isDead) return;
                
                const dx = snake.head.x - f.x;
                const dy = snake.head.y - f.y;
                const distSq = dx * dx + dy * dy;
                
                // 演出級吸力 (磁力漩渦道具效果)
                if (f.vortexTarget === snake) {
                    const dist = Math.sqrt(distSq);
                    if (dist < 10) {
                        // 吃到食物
                        const multiplier = (snake.lucky7Time > 0) ? CONFIG.ITEM_TYPES.LUCKY7.multiplier : 1;
                        const val = f.value * multiplier;
                        snake.targetLength += val;
                        snake.totalEaten += val;
                        this.food.splice(i, 1);
                    } else {
                        // 快速飛向蛇頭
                        const speed = 25; 
                        f.x += (dx / dist) * speed;
                        f.y += (dy / dist) * speed;
                    }
                    return;
                }

                // 基礎吸力 (技能或被動)
                const isMagnetActive = snake.magnetTime > 0;
                const suctionRadius = isMagnetActive ? 120 : 45;
                const suctionSpeed = isMagnetActive ? 18 : 12;
                if (distSq < suctionRadius * suctionRadius) {
                    const dist = Math.sqrt(distSq);
                    if (dist > 5) {
                        f.x += (dx / dist) * suctionSpeed;
                        f.y += (dy / dist) * suctionSpeed;
                    }
                }
            });
        }

        this.snakes.forEach(snake => {
            let speedMod = 1.0, currentTerrain = null;
            this.terrains.forEach(t => { if ((snake.head.x - t.x) ** 2 + (snake.head.y - t.y) ** 2 < t.radius ** 2) { currentTerrain = t.type; if (t.type === 'river') speedMod = 0.75; } });
            const targetAngle = snake === this.player ? (input.isMoving ? input.angle : null) : null;
            const wantsDash = snake === this.player ? input.isDashing : false;
            snake.update(targetAngle, wantsDash, dt, {
                snakes: this.snakes, stones: this.stones, food: this.food,
                terrain: currentTerrain, speedMod: speedMod,
                onDropFood: (s, v) => this.dropTailFood(s, v)
            });
        });

        this.snakes.forEach(snake => {
            this.effects.forEach(e => {
                if (e.type === 'INK_CLOUD') {
                    if (snake.id === e.ownerId) return;
                    const dx = snake.head.x - e.x;
                    const dy = snake.head.y - e.y;
                    if (dx * dx + dy * dy < e.radius * e.radius) snake.inkTime = 3.0;
                }
            });
        });

        this.checkCollisions();
        this.checkItemCollisions();
        if (this.food.length < 500) this.spawnResource();
    }

    getSafeItemSpawnPoint(nearX = null, nearY = null) {
        const size = CONFIG.WORLD_SIZE;
        const margin = 100;
        let x, y, attempts = 0;
        while (attempts < 50) {
            if (nearX !== null && nearY !== null) {
                const angle = Math.random() * Math.PI * 2;
                const dist = 300 + Math.random() * 400;
                x = nearX + Math.cos(angle) * dist;
                y = nearY + Math.sin(angle) * dist;
            } else {
                x = (Math.random() - 0.5) * (size - margin * 2);
                y = (Math.random() - 0.5) * (size - margin * 2);
            }
            
            // 邊界檢查
            if (Math.abs(x) > size / 2 - 60 || Math.abs(y) > size / 2 - 60) { attempts++; continue; }
            
            // 石頭檢查
            const inStone = this.stones.some(s => Math.sqrt((x - s.x)**2 + (y - s.y)**2) < s.radius + 40);
            if (!inStone) return { x, y };
            attempts++;
        }
        return null;
    }

    analyzeAndSpawnItems() {
        if (this.items.length >= CONFIG.ITEM_MAX_COUNT) return;

        // 救濟機制：血量危急時在前方生沙漏
        if (this.player && !this.player.isDead && this.player.length < CONFIG.INITIAL_LENGTH * 0.8) {
            const hasH = this.items.some(it => it.id === 'HOURGLASS');
            if (!hasH) {
                const p = this.getSafeItemSpawnPoint(this.player.head.x, this.player.head.y);
                if (p) this.spawnItem('HOURGLASS', p.x, p.y);
            }
        }

        // 定位生成點：40% 聚焦玩家/AI 附近，60% 全域隨機
        let spawnPos = null;
        if (Math.random() < 0.4 && this.snakes.length > 0) {
            const targetSnake = this.snakes[Math.floor(Math.random() * this.snakes.length)];
            if (!targetSnake.isDead) spawnPos = this.getSafeItemSpawnPoint(targetSnake.head.x, targetSnake.head.y);
        }
        if (!spawnPos) spawnPos = this.getSafeItemSpawnPoint();
        if (!spawnPos) return;

        // 局部掃描判定類別
        let snakeCount = 0, foodCount = 0;
        this.snakes.forEach(s => { if (!s.isDead && Math.sqrt((s.head.x - spawnPos.x)**2 + (s.head.y - spawnPos.y)**2) < 400) snakeCount++; });
        this.food.forEach(f => { if (Math.sqrt((f.x - spawnPos.x)**2 + (f.y - spawnPos.y)**2) < 200) foodCount++; });

        let pool = [];
        if (snakeCount >= 2) pool = ['LUCKY7', 'MUSHROOM', 'CLOAK']; // 提高對抗類權重
        else if (foodCount > 10) pool = ['VORTEX', 'LUCKY7', 'CLOAK'];
        else pool = ['SODA', 'HOURGLASS', 'VORTEX'];

        // 道具特殊限制
        const hourglasses = this.items.filter(it => it.id === 'HOURGLASS');
        const lucky7s = this.items.filter(it => it.id === 'LUCKY7');
        
        const pickType = () => {
            let type = pool[Math.floor(Math.random() * pool.length)];
            if (type === 'HOURGLASS') {
                if (hourglasses.length >= 2) return pool.filter(t => t !== 'HOURGLASS')[0] || 'SODA';
                if (hourglasses.some(h => Math.sqrt((h.x - spawnPos.x)**2 + (h.y - spawnPos.y)**2) < 1000)) return 'SODA';
            }
            if (type === 'LUCKY7') {
                if (lucky7s.length >= 1) return pool.filter(t => t !== 'LUCKY7')[0] || 'VORTEX';
            }
            return type;
        };

        const finalType = pickType();
        this.spawnItem(finalType, spawnPos.x, spawnPos.y);
    }

    spawnItem(type, x, y) {
        // 邊界檢查
        const half = CONFIG.WORLD_SIZE / 2 - 50;
        x = Math.max(-half, Math.min(half, x));
        y = Math.max(-half, Math.min(half, y));
        
        this.items.push({
            id: type,
            config: CONFIG.ITEM_TYPES[type],
            x, y,
            teaserTime: CONFIG.ITEM_TEASER_TIME
        });
    }

    checkItemCollisions() {
        this.snakes.forEach(snake => {
            if (snake.isDead) return;
            for (let i = this.items.length - 1; i >= 0; i--) {
                const it = this.items[i];
                if (it.teaserTime > 0) continue;

                const distSq = (snake.head.x - it.x)**2 + (snake.head.y - it.y)**2;
                if (distSq < (snake.radius + 25)**2) {
                    this.applyItemEffect(snake, it);
                    this.items.splice(i, 1);
                }
            }
        });
    }

    applyItemEffect(snake, item) {
        const type = item.id;
        const cfg = item.config;
        
        switch(type) {
            case 'HOURGLASS':
                snake.targetLength = snake.sessionMax;
                break;
            case 'SODA':
                snake.stamina = CONFIG.STAMINA_MAX;
                snake.isOverloaded = false;
                break;
            case 'VORTEX':
                // 瞬間標記 R=400 內所有食物，使其飛向蛇頭
                this.food.forEach(f => {
                    const d2 = (f.x - item.x)**2 + (f.y - item.y)**2;
                    if (d2 < 400**2) {
                        f.vortexTarget = snake;
                    }
                });
                break;
            case 'LUCKY7':
                snake.lucky7Time = cfg.duration;
                break;
            case 'MUSHROOM':
                snake.titanTime = cfg.duration;
                // 觸發一次擴張衝擊波特效
                this.effects.push({
                    type: 'TITAN_WAVE',
                    x: snake.head.x, y: snake.head.y,
                    radius: 0, maxRadius: 150, life: 0.6, color: cfg.color
                });
                break;
            case 'CLOAK':
                snake.ghostTime = cfg.duration;
                break;
        }
        
        // 拾取音效/特效
        this.effects.push({
            type: 'ITEM_PICKUP',
            x: item.x, y: item.y, color: cfg.color, life: 0.8
        });
    }

    checkCollisions() {
        this.snakes.forEach(snake => {
            if (snake.isDead) return;
            const halfSize = CONFIG.WORLD_SIZE / 2;
            const margin = snake.radius;
            const bounceDist = 20;

            // 邊界與障礙物判定 (跳過幽靈狀態？不，幽靈仍會撞牆與石頭)
            if (Math.abs(snake.head.x) > halfSize - margin || Math.abs(snake.head.y) > halfSize - margin) {
                if (snake.head.x > halfSize - margin) { snake.head.x = halfSize - margin - bounceDist; snake.angle = Math.PI - snake.angle; }
                if (snake.head.x < -halfSize + margin) { snake.head.x = -halfSize + margin + bounceDist; snake.angle = Math.PI - snake.angle; }
                if (snake.head.y > halfSize - margin) { snake.head.y = halfSize - margin - bounceDist; snake.angle = -snake.angle; }
                if (snake.head.y < -halfSize + margin) { snake.head.y = -halfSize + margin + bounceDist; snake.angle = -snake.angle; }
                const penalty = snake.length * 0.15;
                snake.targetLength = Math.max(CONFIG.INITIAL_LENGTH, snake.targetLength - penalty);
                snake.length = Math.max(CONFIG.INITIAL_LENGTH, snake.length - penalty);
                this.spark(snake.head.x, snake.head.y, '#FFFFFF');
                return;
            }

            this.stones.forEach(s => {
                const dx = snake.head.x - s.x;
                const dy = snake.head.y - s.y;
                const distSq = dx * dx + dy * dy;
                const minDist = snake.radius + s.radius;
                if (distSq < minDist * minDist) {
                    const angle = Math.atan2(dy, dx);
                    snake.head.x = s.x + Math.cos(angle) * (minDist + bounceDist);
                    snake.head.y = s.y + Math.sin(angle) * (minDist + bounceDist);
                    snake.angle = angle;
                    const penalty = snake.length * 0.15;
                    snake.targetLength = Math.max(CONFIG.INITIAL_LENGTH, snake.targetLength - penalty);
                    snake.length = Math.max(CONFIG.INITIAL_LENGTH, snake.length - penalty);
                    this.spark(snake.head.x, snake.head.y, '#FFFFFF');
                }
            });

            // 食物碰撞 (考慮幸運 7 倍率)
            const multiplier = (snake.lucky7Time > 0) ? CONFIG.ITEM_TYPES.LUCKY7.multiplier : 1;
            for (let i = this.food.length - 1; i >= 0; i--) {
                const f = this.food[i];
                if ((snake.head.x - f.x) ** 2 + (snake.head.y - f.y) ** 2 < (snake.radius + 5) ** 2) {
                    const val = f.value * multiplier;
                    snake.targetLength += val;
                    snake.totalEaten += val;
                    this.food.splice(i, 1);
                }
            }

            // 蛇與蛇碰撞 (幽靈披風穿透邏輯)
            if (snake.ghostTime > 0) return; // 幽靈狀態不撞別人

            this.snakes.forEach(other => {
                if (other.isDead || snake === other) return;
                // 如果對方是幽靈，我也撞不到他
                if (other.ghostTime > 0) return;

                const dHead = (snake.head.x - other.head.x) ** 2 + (snake.head.y - other.head.y) ** 2;
                if (dHead < (snake.radius + other.radius) ** 2) {
                    if (snake.isDashing && other.isDashing) {
                        const angle = Math.atan2(snake.head.y - other.head.y, snake.head.x - other.head.x);
                        snake.angle = angle; other.angle = angle + Math.PI;
                    } else if (snake.isDashing) this.kill(other, snake);
                    else if (other.isDashing) this.kill(snake, other);
                    else {
                        if (snake.length > other.length) this.kill(other, snake);
                        else this.kill(snake, other);
                    }
                    return;
                }

                // 撞到身體 (巨大蘑菇免疫截斷)
                for (let i = 10; i < other.points.length; i++) {
                    const p = other.points[i];
                    if ((snake.head.x - p.x) ** 2 + (snake.head.y - p.y) ** 2 < (snake.radius + 10) ** 2) {
                        if (snake.isDashing) {
                            if (other.titanTime > 0) {
                                // 巨大蘑菇免疫截斷：改為回彈
                                const angle = Math.atan2(snake.head.y - p.y, snake.head.x - p.x);
                                snake.angle = angle;
                                snake.head.x += Math.cos(angle) * 30;
                                snake.head.y += Math.sin(angle) * 30;
                            } else {
                                this.cut(other, i, snake);
                            }
                        } else {
                            this.kill(snake, other);
                        }
                    }
                }
            });
        });
    }

    cut(snake, idx, killer) {
        if (snake.titanTime > 0) return; // 雙重保護
        snake.hitTimer = 0.5;
        if (killer) killer.cuts++;
        const legacy = snake.points.slice(idx);
        snake.points = snake.points.slice(0, idx);
        const lostLength = legacy.length * 2;
        const totalFoodValue = lostLength * 0.5;
        const dropRate = 5;
        const foodValuePerItem = totalFoodValue / (legacy.length / dropRate);
        snake.length = snake.points.length * 2;
        snake.targetLength = snake.length;
        legacy.forEach((p, i) => { if (i % dropRate === 0) this.food.push({ x: p.x, y: p.y, size: 4, value: foodValuePerItem, color: snake.color }); });
        this.spark(snake.head.x, snake.head.y, snake.color);
    }

    kill(snake, killer) {
        snake.hitTimer = 0.5;
        snake.isDead = true;
        snake.deaths++;
        if (killer) killer.kills++;
        const originalLength = snake.length;
        const penaltyLength = Math.max(CONFIG.INITIAL_LENGTH, originalLength * 0.5);
        const lostLength = originalLength - penaltyLength;
        const totalFoodValue = lostLength * 0.5;
        snake.length = penaltyLength;
        snake.targetLength = penaltyLength;
        snake.maxLength = penaltyLength; 
        const dropRate = 6;
        const foodValuePerItem = totalFoodValue / (snake.points.length / dropRate);
        snake.points.forEach((p, i) => { if (i % dropRate === 0) this.food.push({ x: p.x, y: p.y, size: 4, value: foodValuePerItem, expires: 8.0, color: snake.color }); });
        this.spark(snake.head.x, snake.head.y, snake.color);
        this.respawnQueue.push({ snake, time: CONFIG.RESPAWN_TIME });
    }

    respawn(snake) {
        const pos = this.getSafeSpawnPoint();
        snake.head = { x: pos.x, y: pos.y };
        snake.points = [{ x: pos.x, y: pos.y }];
        snake.isDead = false;
        snake.isDashing = false;
        snake.angle = this.calculateBestStartAngle(pos.x, pos.y);
        // 重置 Buff
        snake.lucky7Time = 0;
        snake.titanTime = 0;
        snake.ghostTime = 0;
    }

    spark(x, y, color) {
        for (let i = 0; i < 15; i++) { this.effects.push({ x, y, vx: (Math.random() - 0.5) * 15, vy: (Math.random() - 0.5) * 15, color, life: 0.8 }); }
    }

    endGame() {
        this.isGameOver = true;
        const finalScore = Math.floor(this.player.totalEaten);
        if (finalScore > this.bestScore) { this.bestScore = finalScore; localStorage.setItem('snake_best', this.bestScore); }
    }
}
