import { CONFIG } from './constants.js';
import { Snake } from './snake.js';

export class Game {
    constructor() {
        this.snakes = [];
        this.food = [];
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
    }

    init() {
        this.snakes = [];
        this.food = [];
        this.stones = [];
        this.terrains = [];
        this.effects = [];
        this.respawnQueue = [];
        this.timer = CONFIG.SOLO_TIME;
        this.isGameOver = false;
        const size = CONFIG.WORLD_SIZE;
        const numRivers = 1; 
        for (let r = 0; r < numRivers; r++) {
            const rx = (Math.random() - 0.5) * size * 0.5;
            const ry = (Math.random() - 0.5) * size * 0.5;
            for (let i = 0; i < 5; i++) {
                this.terrains.push({ type: 'river', x: rx + i * 120, y: ry + Math.sin(i * 0.5) * 100, radius: 60 + Math.random() * 20 });
            }
        }
        const numStones = Math.floor(Math.random() * 7) + 8;
        for (let i = 0; i < numStones; i++) {
            const s = { x: (Math.random() - 0.5) * size * 0.9, y: (Math.random() - 0.5) * size * 0.9, radius: 25 + Math.random() * 30 };
            const tooClose = this.stones.some(other => Math.sqrt((s.x - other.x)**2 + (s.y - other.y)**2) < (s.radius + other.radius + 80));
            const nearCenter = Math.sqrt(s.x**2 + s.y**2) < 200;
            if (!tooClose && !nearCenter) this.stones.push(s);
        }
    }

    getSafeSpawnPoint() {
        const margin = 100;
        const minSnakeDist = 400; // Keep away from other snakes
        let x, y, safe = false;
        let attempts = 0;
        while (!safe && attempts < 100) {
            x = (Math.random() - 0.5) * (CONFIG.WORLD_SIZE - margin * 2);
            y = (Math.random() - 0.5) * (CONFIG.WORLD_SIZE - margin * 2);
            
            // Check Stones
            const stoneSafe = !this.stones.some(s => Math.sqrt((x - s.x)**2 + (y - s.y)**2) < s.radius + 80);
            // Check Snakes (if any are alive)
            const snakeSafe = !this.snakes.some(s => !s.isDead && Math.sqrt((x - s.head.x)**2 + (y - s.head.y)**2) < minSnakeDist);
            
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
                    const perpDistSq = (sdx*sdx + sdy*sdy) - dot*dot;
                    if (perpDistSq < s.radius*s.radius) {
                        const distToIntersection = dot - Math.sqrt(s.radius*s.radius - perpDistSq);
                        if (distToIntersection > 0) dStone = Math.min(dStone, distToIntersection);
                    }
                }
            }

            let dSnake = Infinity;
            for (const s of this.snakes) {
                if (s.isDead) continue;
                // Treat snake head as a stone for simplicity in facing calculation
                const sdx = s.head.x - x;
                const sdy = s.head.y - y;
                const dot = sdx * dx + sdy * dy;
                if (dot > 0) {
                    const distSq = sdx*sdx + sdy*sdy;
                    if (distSq < 400**2) { // Only care about nearby enemies
                        dSnake = Math.min(dSnake, Math.sqrt(distSq));
                    }
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
                { name: 'Bot Gamma', color: '#00CCFF' }
            ];

            aiConfigs.forEach((cfg, index) => {
                const aPos = this.getSafeSpawnPoint();
                this.snakes.push(new Snake(`ai-${index}`, cfg.name, cfg.color, aPos.x, aPos.y, true, this.calculateBestStartAngle(aPos.x, aPos.y)));
            });
        }
        for(let i = 0; i < 238; i++) this.spawnResource();
    }

    spawnResource() {
        let x, y, isNearStone = false, terrainType = null;
        const size = CONFIG.WORLD_SIZE;
        const rand = Math.random();
        if (rand < 0.4 && this.terrains.length > 0) {
            const t = this.terrains[Math.floor(Math.random() * this.terrains.length)];
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * t.radius;
            x = t.x + Math.cos(angle) * dist; y = t.y + Math.sin(angle) * dist;
            terrainType = t.type;
        } else if (rand < 0.7 && this.stones.length > 0) {
            const stone = this.stones[Math.floor(Math.random() * this.stones.length)];
            const angle = Math.random() * Math.PI * 2;
            const dist = stone.radius + 10 + Math.random() * 50;
            x = stone.x + Math.cos(angle) * dist; y = stone.y + Math.sin(angle) * dist;
            isNearStone = true;
        } else {
            x = (Math.random() - 0.5) * (size - 80); y = (Math.random() - 0.5) * (size - 80);
        }
        if (Math.abs(x) > size/2 - 20 || Math.abs(y) > size/2 - 20) return;
        for (const s of this.stones) { if ((x - s.x)**2 + (y - s.y)**2 < s.radius**2) return; }
        let type = 'SMALL';
        if (isNearStone || terrainType === 'river') type = Math.random() < 0.3 ? 'LARGE' : 'MEDIUM';
        else if (terrainType === 'ice') type = 'MEDIUM';
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
        for(let i = this.effects.length - 1; i >= 0; i--) {
            this.effects[i].life -= dt; if (this.effects[i].life <= 0) this.effects.splice(i, 1);
        }
        for(let i = this.food.length - 1; i >= 0; i--) {
            if (this.food[i].expires !== undefined) {
                this.food[i].expires -= dt;
                if (this.food[i].expires <= 0) this.food.splice(i, 1);
            }
        }

        // 磁鐵吸取邏輯 (v2.9.0)
        this.food.forEach(f => {
            this.snakes.forEach(snake => {
                if (snake.isDead || !snake.isMagnetActive) return;
                const dx = snake.head.x - f.x;
                const dy = snake.head.y - f.y;
                const distSq = dx*dx + dy*dy;
                const magnetRadius = 75; // 吸取半徑 (直徑 150px)
                if (distSq < magnetRadius * magnetRadius) {
                    const dist = Math.sqrt(distSq);
                    const attractSpeed = 10; // 吸取速度
                    f.x += (dx / dist) * attractSpeed;
                    f.y += (dy / dist) * attractSpeed;
                }
            });
        });

        this.snakes.forEach(snake => {
            let speedMod = 1.0, currentTerrain = null;
            this.terrains.forEach(t => { if ((snake.head.x - t.x)**2 + (snake.head.y - t.y)**2 < t.radius**2) { currentTerrain = t.type; if (t.type === 'river') speedMod = 0.75; } });
            const targetAngle = snake === this.player ? (input.isMoving ? input.angle : null) : null;
            const wantsDash = snake === this.player ? input.isDashing : false;
            snake.update(targetAngle, wantsDash, dt, { 
                snakes: this.snakes, stones: this.stones, food: this.food, 
                terrain: currentTerrain, speedMod: speedMod,
                onDropFood: (s, v) => this.dropTailFood(s, v)
            });
        });
        this.checkCollisions();
        if (this.food.length < 100) this.spawnResource();
    }

    checkCollisions() {
        this.snakes.forEach(snake => {
            if (snake.isDead) return;
            
            const halfSize = CONFIG.WORLD_SIZE / 2;
            const margin = snake.radius;
            
            // 牆壁碰撞：改為回彈 (加強版：向內推回一段距離)
            const bounceDist = 20; 
            if (Math.abs(snake.head.x) > halfSize - margin || Math.abs(snake.head.y) > halfSize - margin) {
                if (snake.head.x > halfSize - margin) { 
                    snake.head.x = halfSize - margin - bounceDist; 
                    snake.angle = Math.PI - snake.angle; 
                }
                if (snake.head.x < -halfSize + margin) { 
                    snake.head.x = -halfSize + margin + bounceDist; 
                    snake.angle = Math.PI - snake.angle; 
                }
                if (snake.head.y > halfSize - margin) { 
                    snake.head.y = halfSize - margin - bounceDist; 
                    snake.angle = -snake.angle; 
                }
                if (snake.head.y < -halfSize + margin) { 
                    snake.head.y = -halfSize + margin + bounceDist; 
                    snake.angle = -snake.angle; 
                }
                return; 
            }

            // 石頭碰撞：改為回彈 (加強版)
            this.stones.forEach(s => {
                const dx = snake.head.x - s.x;
                const dy = snake.head.y - s.y;
                const distSq = dx*dx + dy*dy;
                const minDist = snake.radius + s.radius;
                if (distSq < minDist*minDist) {
                    const angle = Math.atan2(dy, dx);
                    // 向外推回一段距離
                    snake.head.x = s.x + Math.cos(angle) * (minDist + bounceDist);
                    snake.head.y = s.y + Math.sin(angle) * (minDist + bounceDist);
                    snake.angle = angle; 
                }
            });

            // 食物碰撞
            for (let i = this.food.length - 1; i >= 0; i--) {
                const f = this.food[i];
                if ((snake.head.x - f.x)**2 + (snake.head.y - f.y)**2 < (snake.radius + f.size)**2) {
                    if (snake.length < CONFIG.INITIAL_LENGTH) snake.targetLength = CONFIG.INITIAL_LENGTH;
                    else snake.targetLength += f.value;
                    snake.totalEaten += f.value;
                    this.food.splice(i, 1);
                }
            }

            // 蛇與蛇碰撞 (核心戰鬥邏輯)
            this.snakes.forEach(other => {
                if (other.isDead || snake === other) return;
                
                const dHead = (snake.head.x - other.head.x)**2 + (snake.head.y - other.head.y)**2;
                if (dHead < (snake.radius + other.radius)**2) {
                    // 頭部對撞
                    if (snake.isDashing && other.isDashing) {
                        // 雙方都加速：互相回彈
                        const angle = Math.atan2(snake.head.y - other.head.y, snake.head.x - other.head.x);
                        snake.angle = angle;
                        other.angle = angle + Math.PI;
                    } else if (snake.isDashing) {
                        this.kill(other, snake); // 你加速你贏
                    } else if (other.isDashing) {
                        this.kill(snake, other); // 對方加速對方贏
                    } else {
                        // 都沒加速：大吃小
                        if (snake.length > other.length) { this.kill(other, snake); }
                        else { this.kill(snake, other); }
                    }
                    return;
                }

                // 撞到身體
                for(let i = 10; i < other.points.length; i++) {
                    const p = other.points[i];
                    if ((snake.head.x - p.x)**2 + (snake.head.y - p.y)**2 < (snake.radius + 10)**2) {
                        if (snake.isDashing && other.isDashing) {
                            // 雙方都在加速：撞到身體也要回彈 (v2.8.3)
                            const angle = Math.atan2(snake.head.y - p.y, snake.head.x - p.x);
                            const bounceDist = 30;
                            snake.head.x = p.x + Math.cos(angle) * (snake.radius + 10 + bounceDist);
                            snake.head.y = p.y + Math.sin(angle) * (snake.radius + 10 + bounceDist);
                            snake.angle = angle;
                        } else if (snake.isDashing) {
                            // 只有你加速：截斷對方
                            this.cut(other, i, snake);
                        } else if (!other.isDashing) {
                            // 你沒加速且對方也沒加速：你死
                            this.kill(snake, other);
                        } else {
                            // 對方加速你沒加：你死 (被無敵星撞到)
                            this.kill(snake, other);
                        }
                    }
                }
            });
        });
    }

    cut(snake, idx, killer) {
        if (killer) killer.cuts++;
        const legacy = snake.points.slice(idx);
        snake.points = snake.points.slice(0, idx);
        snake.length = snake.points.length * 2;
        snake.targetLength = snake.length;
        legacy.forEach((p, i) => { if (i % 5 === 0) this.food.push({ x: p.x, y: p.y, size: 4, value: 2 }); });
        this.spark(snake.head.x, snake.head.y, snake.color);
    }

    kill(snake, killer) {
        snake.isDead = true;
        snake.deaths++;
        if (killer) killer.kills++;
        
        // 死亡瞬間立即計算 70% 懲罰 (v2.8.4)
        const penaltyLength = Math.max(CONFIG.INITIAL_LENGTH, snake.maxLength * 0.7);
        snake.length = penaltyLength;
        snake.targetLength = penaltyLength;
        snake.maxLength = penaltyLength; // 重置最高紀錄，確保連續死亡會持續扣除長度

        // 恢復掉落食物機制
        snake.points.forEach((p, i) => { if (i % 6 === 0) this.food.push({ x: p.x, y: p.y, size: 4, value: 9.6, expires: 5.0 }); });
        
        this.spark(snake.head.x, snake.head.y, snake.color);
        this.respawnQueue.push({ snake, time: CONFIG.RESPAWN_TIME });
    }

    respawn(snake) {
        const pos = this.getSafeSpawnPoint();
        snake.head = { x: pos.x, y: pos.y };
        snake.points = [{ x: pos.x, y: pos.y }];
        
        // 長度已在 kill 階段計算過，此處僅確保狀態重置
        snake.isDead = false;
        snake.isDashing = false;
        snake.angle = this.calculateBestStartAngle(pos.x, pos.y);
    }

    spark(x, y, color) {
        for(let i = 0; i < 15; i++) { this.effects.push({ x, y, vx: (Math.random()-0.5)*15, vy: (Math.random()-0.5)*15, color, life: 0.8 }); }
    }

    endGame() {
        this.isGameOver = true;
        const finalScore = Math.floor(this.player.length); // 改為最終長度 (v2.7.5)
        if (finalScore > this.bestScore) { this.bestScore = finalScore; localStorage.setItem('snake_best', this.bestScore); }
    }
}
