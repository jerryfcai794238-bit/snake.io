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
        this.itemQuotas = {
            'LUCKY7': { max: 1, cd: 45, ring: 'CORE' },
            'MUSHROOM': { max: 2, cd: 25, ring: 'MID' },
            'CLOAK': { max: 0, cd: 25, ring: 'MID' }, // 暫時關閉幽靈
            'VORTEX': { max: 2, cd: 20, ring: 'MID' },
            'HOURGLASS': { max: 0, cd: 20, ring: 'OUTER' }, // 暫時關閉時間沙漏
            'SODA': { max: 0, cd: 15, ring: 'OUTER' } // 暫時關閉能量飲料
        };
        this.itemRespawnQueue = []; // { type, time }
        this.heatSpots = []; // { x, y, time, radius }
        this.foodGrid = new Map(); // 空間網格 (v4.5.0)
        this.gridSize = 200;
    }

    init() {
        this.snakes = [];
        this.food = [];
        this.items = [];
        this.itemRespawnQueue = [];
        this.stones = [];
        this.terrains = [];
        this.effects = [];
        this.respawnQueue = [];
        this.timer = CONFIG.SOLO_TIME;
        this.isGameOver = false;
        
        // 初始道具投放
        Object.keys(this.itemQuotas).forEach(type => {
            const q = this.itemQuotas[type];
            for (let i = 0; i < q.max; i++) {
                const p = this.getSafeTieredSpawnPoint(q.ring);
                if (p) this.spawnItem(type, p.x, p.y);
            }
        });
        
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
        const margin = 150; // 增加邊距緩衝
        const minSnakeDist = 500; // 增加安全半徑
        const minBodyDist = 120;  // 新增：與蛇身的最小安全距離
        let x, y, safe = false;
        let attempts = 0;

        while (!safe && attempts < 150) {
            x = (Math.random() - 0.5) * (CONFIG.WORLD_SIZE - margin * 2);
            y = (Math.random() - 0.5) * (CONFIG.WORLD_SIZE - margin * 2);

            // 1. 檢查石頭
            const stoneSafe = !this.stones.some(s => Math.sqrt((x - s.x) ** 2 + (y - s.y) ** 2) < s.radius + 100);
            
            // 2. 檢查所有敵對蛇的頭部與身體 (關鍵修正)
            const snakeSafe = !this.snakes.some(s => {
                if (s.isDead) return false;
                
                // 檢查頭部距離
                const distHead = Math.sqrt((x - s.head.x) ** 2 + (y - s.head.y) ** 2);
                if (distHead < minSnakeDist) return true;

                // 檢查身體所有節點 (避免重生在長蛇陣中間)
                return s.points.some(p => Math.sqrt((x - p.x) ** 2 + (y - p.y) ** 2) < minBodyDist);
            });

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
        for (let i = 0; i < 800; i++) this.spawnResource();
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
        // 修正：增加 30px 安全邊距，防止蛇頭因碰撞彈開而吃不到 (v4.4.1)
        for (const s of this.stones) { if ((x - s.x) ** 2 + (y - s.y) ** 2 < (s.radius + 30) ** 2) return; }
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
        // 遺產食物也要避開石頭 (v4.4.1)
        const inStone = this.stones.some(s => (pos.x - s.x)**2 + (pos.y - s.y)**2 < (s.radius + 20)**2);
        if (inStone) return;
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

        // 更新空間網格 (v4.5.0)
        this.foodGrid.clear();
        for (let i = 0; i < this.food.length; i++) {
            const f = this.food[i];
            const gx = Math.floor(f.x / this.gridSize);
            const gy = Math.floor(f.y / this.gridSize);
            const key = `${gx},${gy}`;
            if (!this.foodGrid.has(key)) this.foodGrid.set(key, []);
            this.foodGrid.get(key).push(i);
        }

        // 更新熱點計時 (v4.1.0)
        for (let i = this.heatSpots.length - 1; i >= 0; i--) {
            this.heatSpots[i].time -= dt;
            if (this.heatSpots[i].time <= 0) this.heatSpots.splice(i, 1);
        }

        // 更新隨機道具重生隊列 (Adaptive 模式 v4.1.0)
        for (let i = this.itemRespawnQueue.length - 1; i >= 0; i--) {
            const task = this.itemRespawnQueue[i];
            task.time -= dt;
            if (task.time <= 0) {
                const q = this.itemQuotas[task.type];
                let spawnPos = null;

                // 行為導引：弱者導引與強者推送 (v4.1.0)
                if (this.player && !this.player.isDead) {
                    const isWeak = this.player.length < CONFIG.INITIAL_LENGTH * 0.8;
                    const isStrong = this.player.length > 300; // 暫定強者門檻

                    if (isWeak && task.type === 'SODA') {
                        // 弱者：引導向外圍
                        const angle = this.player.angle + (Math.random()-0.5);
                        const dist = 400;
                        const tx = this.player.head.x + Math.cos(angle) * dist;
                        const ty = this.player.head.y + Math.sin(angle) * dist;
                        // 確保目標點比當前更靠近外圍
                        if (tx*tx + ty*ty > this.player.head.x**2 + this.player.head.y**2) {
                            spawnPos = this.getSafeTieredSpawnPoint('OUTER', tx, ty);
                        }
                    } else if (isStrong && (Math.abs(this.player.head.x) > 400 || Math.abs(this.player.head.y) > 400)) {
                        // 強者在非核心區：不再其身邊生成，強制向 CORE 偏移
                        if (task.type === 'LUCKY7' || task.type === 'MUSHROOM') {
                            spawnPos = this.getSafeTieredSpawnPoint('CORE');
                        }
                    }
                }

                // 熱點聯動：高價值道具優先向熱點偏移 (若行為導引未攔截)
                if (!spawnPos && (task.type === 'LUCKY7' || task.type === 'MUSHROOM') && this.heatSpots.length > 0) {
                    const spot = this.heatSpots[Math.floor(Math.random() * this.heatSpots.length)];
                    if (Math.random() < 0.7) { // 70% 機率偏移
                        spawnPos = this.getSafeTieredSpawnPoint(q.ring, spot.x, spot.y);
                    }
                }

                if (!spawnPos) spawnPos = this.getSafeTieredSpawnPoint(q.ring);

                if (spawnPos) {
                    this.spawnItem(task.type, spawnPos.x, spawnPos.y);
                    this.itemRespawnQueue.splice(i, 1);
                } else {
                    task.time = 1.0; 
                }
            }
        }

        for (let i = this.items.length - 1; i >= 0; i--) {
            if (this.items[i].teaserTime > 0) {
                this.items[i].teaserTime -= dt;
            }
        }

        // 食物吸力邏輯 (空間網格優化 O(1) 查詢 v4.5.0)
        const eatenIndices = new Set();
        this.snakes.forEach(snake => {
            if (snake.isDead) return;
            
            const gx = Math.floor(snake.head.x / this.gridSize);
            const gy = Math.floor(snake.head.y / this.gridSize);
            const suctionRadius = (snake.magnetTime > 0) ? 120 : 45;
            const checkRange = Math.ceil(suctionRadius / this.gridSize);

            for (let ox = -1; ox <= 1; ox++) {
                for (let oy = -1; oy <= 1; oy++) {
                    const key = `${gx + ox},${gy + oy}`;
                    const indices = this.foodGrid.get(key);
                    if (!indices) continue;

                    for (let j = indices.length - 1; j >= 0; j--) {
                        const idx = indices[j];
                        if (eatenIndices.has(idx)) continue;
                        const f = this.food[idx];
                        
                        const dx = snake.head.x - f.x;
                        const dy = snake.head.y - f.y;
                        const distSq = dx * dx + dy * dy;

                        if (f.vortexTarget === snake) {
                            const dist = Math.sqrt(distSq);
                            if (dist < 15) {
                                eatenIndices.add(idx);
                                const multiplier = (snake.lucky7Time > 0) ? CONFIG.ITEM_TYPES.LUCKY7.multiplier : 1;
                                snake.targetLength += f.value * multiplier;
                                snake.totalEaten += f.value * multiplier;
                            } else {
                                const speed = (10 + (1 - dist/400)*25) * dt * 60;
                                f.x += (dx/dist) * Math.min(dist, speed);
                                f.y += (dy/dist) * Math.min(dist, speed);
                            }
                        } else if (distSq < suctionRadius**2) {
                            const dist = Math.sqrt(distSq);
                            if (dist > 5) {
                                const speed = (snake.magnetTime > 0 ? 18 : 12);
                                f.x += (dx/dist) * speed;
                                f.y += (dy/dist) * speed;
                            }
                        }
                    }
                }
            }
        });
        // 統一刪除被吃掉的食物
        const sortedIndices = Array.from(eatenIndices).sort((a, b) => b - a);
        sortedIndices.forEach(idx => this.food.splice(idx, 1));

        this.snakes.forEach(snake => {
            let speedMod = 1.0, currentTerrain = null;
            this.terrains.forEach(t => { if ((snake.head.x - t.x) ** 2 + (snake.head.y - t.y) ** 2 < t.radius ** 2) { currentTerrain = t.type; if (t.type === 'river') speedMod = 0.75; } });
            const targetAngle = snake === this.player ? (input.isMoving ? input.angle : null) : null;
            const wantsDash = snake === this.player ? input.isDashing : false;
            snake.update(targetAngle, wantsDash, dt, {
                snakes: this.snakes, stones: this.stones, food: this.food,
                foodGrid: this.foodGrid, gridSize: this.gridSize, // 傳入網格上下文 (v4.5.0)
                terrain: currentTerrain, speedMod: speedMod,
                effects: this.effects,
                onDropFood: (s, v) => this.dropTailFood(s, v)
            });
        });

        this.snakes.forEach(snake => {
            this.effects.forEach(e => {
                if (e.type === 'INK_CLOUD') {
                    if (snake.id === e.ownerId) return;
                    const dx = snake.head.x - e.x;
                    const dy = snake.head.y - e.y;
                    if (dx * dx + dy * dy < e.radius * e.radius) snake.inkTime = 5.0;
                }
            });
        });

        this.checkCollisions();
        this.checkItemCollisions();
        if (this.food.length < 400) this.spawnResource();
    }

    getSafeTieredSpawnPoint(ring, nearX = null, nearY = null) {
        const size = CONFIG.WORLD_SIZE;
        let minR = 0, maxR = size / 2;
        if (ring === 'CORE') { minR = 0; maxR = 400; }
        else if (ring === 'MID') { minR = 400; maxR = 900; }
        else if (ring === 'OUTER') { minR = 900; maxR = 1100; }

        let attempts = 0;
        while (attempts < 50) {
            let x, y;
            if (nearX !== null && nearY !== null && Math.random() < 0.8) {
                // 嘗試在參考點附近生成
                const angle = Math.random() * Math.PI * 2;
                const r = Math.random() * 300;
                x = nearX + Math.cos(angle) * r;
                y = nearY + Math.sin(angle) * r;
            } else {
                const angle = Math.random() * Math.PI * 2;
                const r = minR + Math.random() * (maxR - minR);
                x = Math.cos(angle) * r;
                y = Math.sin(angle) * r;
            }

            // 邊界檢查
            if (Math.abs(x) > size / 2 - 60 || Math.abs(y) > size / 2 - 60) { attempts++; continue; }
            
            // 石頭檢查：道具需要比食物更大的安全間距 (v4.4.2)
            const inStone = this.stones.some(s => (x - s.x)**2 + (y - s.y)**2 < (s.radius + 60)**2);
            if (inStone) { attempts++; continue; }

            // 與同類道具間距檢查
            const tooClose = this.items.some(it => Math.sqrt((x - it.x)**2 + (y - it.y)**2) < 300);
            if (tooClose) { attempts++; continue; }

            return { x, y };
        }
        return null;
    }

    analyzeAndSpawnItems() {
        // MOBA 模式下不再使用 analyzeAndSpawnItems 進行全域掃描，
        // 邏輯已移至 updateItems 的重生隊列。
    }

    spawnItem(type, x, y) {
        // 邊界檢查
        const half = CONFIG.WORLD_SIZE / 2 - 50;
        x = Math.max(-half, Math.min(half, x));
        y = Math.max(-half, Math.min(half, y));
        
        // 二度檢查：確保邊界校準後不會壓在石頭上 (v4.4.2)
        for (const s of this.stones) {
            const dx = x - s.x;
            const dy = y - s.y;
            const distSq = dx*dx + dy*dy;
            const minDist = s.radius + 60;
            if (distSq < minDist * minDist) {
                const angle = Math.atan2(dy, dx);
                x = s.x + Math.cos(angle) * minDist;
                y = s.y + Math.sin(angle) * minDist;
            }
        }
        
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
        
        // 進入重生冷卻 (MOBA 模式)
        const q = this.itemQuotas[type];
        if (q) {
            this.itemRespawnQueue.push({ type, time: q.cd });
        }
        
        switch(type) {
            case 'HOURGLASS':
                snake.targetLength = snake.sessionMax;
                break;
            case 'SODA':
                snake.stamina = CONFIG.STAMINA_MAX;
                snake.isOverloaded = false;
                break;
            case 'VORTEX':
                // 改成磁鐵效果
                snake.magnetTime = cfg.duration || 10;
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
        if (snake === this.player) this.triggerHaptic('ITEM_PICKUP');
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
                if (snake === this.player) this.triggerHaptic('BUMP');
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
                    if (snake === this.player) this.triggerHaptic('BUMP');
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
                            if (other.titanTime > 0 || other.isDashing) {
                                // 巨大蘑菇免疫截斷，或對方也在衝刺 (v4.5.7)：改為回彈
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
        if (killer) {
            killer.cuts++;
            if (killer === this.player) this.triggerHaptic('CUT');
        }
        if (snake === this.player) this.triggerHaptic('BEING_CUT');
        const legacy = snake.points.slice(idx);
        snake.points = snake.points.slice(0, idx);
        const lostLength = legacy.length * 2;
        const totalFoodValue = lostLength * 0.5;
        const dropRate = 5;
        const foodValuePerItem = totalFoodValue / (legacy.length / dropRate);
        snake.length = snake.points.length * 2;
        snake.targetLength = snake.length;
        legacy.forEach((p, i) => { 
            if (i % dropRate === 0) {
                // 檢查是否掉在石頭裡，若是則跳過 (v4.4.1)
                const inStone = this.stones.some(s => (p.x - s.x)**2 + (p.y - s.y)**2 < (s.radius + 20)**2);
                if (!inStone) {
                    this.food.push({ x: p.x, y: p.y, size: 4, value: foodValuePerItem, color: snake.color }); 
                }
            }
        });
        this.spark(snake.head.x, snake.head.y, snake.color);

        // 截斷也會產生小型熱點 (v4.1.0)
        if (lostLength > 100) {
            this.heatSpots.push({
                x: snake.head.x,
                y: snake.head.y,
                time: 15,
                radius: 300
            });
        }
    }

    kill(snake, killer) {
        snake.hitTimer = 0.5;
        snake.isDead = true;
        snake.deaths++;
        if (killer) {
            killer.kills++;
            if (killer === this.player) this.triggerHaptic('KILL');
        }
        if (snake === this.player) this.triggerHaptic('DEATH');
        const originalLength = snake.length;
        const penaltyLength = Math.max(CONFIG.INITIAL_LENGTH, originalLength * 0.5);
        const lostLength = originalLength - penaltyLength;
        const totalFoodValue = lostLength * 0.5;
        snake.length = penaltyLength;
        snake.targetLength = penaltyLength;
        snake.maxLength = penaltyLength; 
        const dropRate = 6;
        const foodValuePerItem = totalFoodValue / (snake.points.length / dropRate);
        snake.points.forEach((p, i) => { 
            if (i % dropRate === 0) {
                const inStone = this.stones.some(s => (p.x - s.x)**2 + (p.y - s.y)**2 < (s.radius + 20)**2);
                if (!inStone) {
                    this.food.push({ x: p.x, y: p.y, size: 4, value: foodValuePerItem, expires: 8.0, color: snake.color }); 
                }
            }
        });
        this.spark(snake.head.x, snake.head.y, snake.color);
        this.respawnQueue.push({ snake, time: CONFIG.RESPAWN_TIME });

        // 產生熱點 (v4.1.0)
        if (originalLength > 200) {
            this.heatSpots.push({
                x: snake.head.x,
                y: snake.head.y,
                time: 30,
                radius: 500
            });
        }
    }

    respawn(snake) {
        const pos = this.getSafeSpawnPoint();
        snake.head = { x: pos.x, y: pos.y };
        snake.points = [{ x: pos.x, y: pos.y }];
        snake.isDead = false;
        snake.isDashing = false;
        snake.angle = this.calculateBestStartAngle(pos.x, pos.y);
        // 重置 Buff 並給予重生保護 (v4.5.7)
        snake.lucky7Time = 0;
        snake.titanTime = 0;
        snake.ghostTime = 2.5; // 2.5 秒重生幽靈保護
    }

    spark(x, y, color) {
        for (let i = 0; i < 15; i++) { this.effects.push({ x, y, vx: (Math.random() - 0.5) * 15, vy: (Math.random() - 0.5) * 15, color, life: 0.8 }); }
    }

    endGame() {
        this.isGameOver = true;
        this.triggerHaptic('DEATH');
        const finalScore = Math.floor(this.player.totalEaten);
        if (finalScore > this.bestScore) { this.bestScore = finalScore; localStorage.setItem('snake_best', this.bestScore); }
    }

    triggerHaptic(type) {
        if (!navigator.vibrate) return;
        const pattern = CONFIG.HAPTIC_PATTERNS[type];
        if (pattern) navigator.vibrate(pattern);
    }
}
