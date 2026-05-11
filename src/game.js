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
        
        this.respawnQueue = []; // [{snake, time}]
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

        // 1. Rivers (Reduced by 30%)
        const numRivers = 1; 
        for (let r = 0; r < numRivers; r++) {
            const rx = (Math.random() - 0.5) * size * 0.5;
            const ry = (Math.random() - 0.5) * size * 0.5;
            for (let i = 0; i < 5; i++) {
                this.terrains.push({
                    type: 'river',
                    x: rx + i * 120,
                    y: ry + Math.sin(i * 0.5) * 100,
                    radius: 60 + Math.random() * 20
                });
            }
        }

        // 2. Ice Patches (Reduced by 30% -> 2-4)
        const numIce = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < numIce; i++) {
            this.terrains.push({
                type: 'ice',
                x: (Math.random() - 0.5) * size * 0.8,
                y: (Math.random() - 0.5) * size * 0.8,
                radius: 80 + Math.random() * 60
            });
        }

        // 3. Stones (Reduced by 30% -> 8-14)
        const numStones = Math.floor(Math.random() * 7) + 8;
        const minGap = 80; 
        for (let i = 0; i < numStones; i++) {
            const s = {
                x: (Math.random() - 0.5) * size * 0.9,
                y: (Math.random() - 0.5) * size * 0.9,
                radius: 25 + Math.random() * 30
            };
            const tooClose = this.stones.some(other => {
                const d = Math.sqrt((s.x - other.x)**2 + (s.y - other.y)**2);
                return d < (s.radius + other.radius + minGap);
            });
            const nearCenter = Math.sqrt(s.x**2 + s.y**2) < 200;
            if (!tooClose && !nearCenter) this.stones.push(s);
        }
    }

    getSafeSpawnPoint() {
        const margin = 100;
        let x, y, safe = false;
        let attempts = 0;
        while (!safe && attempts < 50) {
            x = (Math.random() - 0.5) * (CONFIG.WORLD_SIZE - margin * 2);
            y = (Math.random() - 0.5) * (CONFIG.WORLD_SIZE - margin * 2);
            safe = !this.stones.some(s => Math.sqrt((x - s.x)**2 + (y - s.y)**2) < s.radius + 100);
            attempts++;
        }
        return { x, y };
    }

    start(mode) {
        this.mode = mode;
        this.isPlaying = true;
        this.lastSecond = Date.now();
        
        const pPos = this.getSafeSpawnPoint();
        this.player = new Snake('player', 'You', CONFIG.COLORS.PLAYER, pPos.x, pPos.y, false);
        this.snakes = [this.player];

        if (mode === 'duel') {
            const aPos = this.getSafeSpawnPoint();
            this.snakes.push(new Snake('ai', 'Bot', CONFIG.COLORS.AI, aPos.x, aPos.y, true));
        }
        
        // Initial food count reduced by 30% (340 -> 238)
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
            x = t.x + Math.cos(angle) * dist;
            y = t.y + Math.sin(angle) * dist;
            terrainType = t.type;
        } else if (rand < 0.7 && this.stones.length > 0) {
            const stone = this.stones[Math.floor(Math.random() * this.stones.length)];
            const angle = Math.random() * Math.PI * 2;
            const dist = stone.radius + 10 + Math.random() * 50;
            x = stone.x + Math.cos(angle) * dist;
            y = stone.y + Math.sin(angle) * dist;
            isNearStone = true;
        } else {
            x = (Math.random() - 0.5) * (size - 80);
            y = (Math.random() - 0.5) * (size - 80);
        }

        // Boundary/Stone check
        if (Math.abs(x) > size/2 - 20 || Math.abs(y) > size/2 - 20) return;
        for (const s of this.stones) {
            if ((x - s.x)**2 + (y - s.y)**2 < s.radius**2) return; 
        }

        // Food Quality Logic (2/5/10)
        let type = 'SMALL';
        if (isNearStone || terrainType === 'river') {
            type = Math.random() < 0.3 ? 'LARGE' : 'MEDIUM';
        } else if (terrainType === 'ice') {
            type = 'MEDIUM';
        } else {
            if (Math.random() < 0.05) type = 'LARGE';
            else if (Math.random() < 0.2) type = 'MEDIUM';
        }

        const foodData = CONFIG.FOOD_TYPES[type];
        this.food.push({ x, y, size: foodData.size, value: foodData.value });
    }

    update(input, dt) {
        if (!this.isPlaying || this.isGameOver) return;

        // Timer
        const now = Date.now();
        if (now - this.lastSecond >= 1000) {
            this.timer--;
            this.lastSecond = now;
            if (this.timer <= 0) this.endGame();
        }

        // Respawn Queue
        for (let i = this.respawnQueue.length - 1; i >= 0; i--) {
            this.respawnQueue[i].time -= dt * 1000;
            if (this.respawnQueue[i].time <= 0) {
                this.respawn(this.respawnQueue[i].snake);
                this.respawnQueue.splice(i, 1);
            }
        }

        // VFX
        for(let i = this.effects.length - 1; i >= 0; i--) {
            this.effects[i].life -= dt;
            if (this.effects[i].life <= 0) this.effects.splice(i, 1);
        }

        // Update Snakes
        this.snakes.forEach(snake => {
            if (snake.isDead) return;
            
            let speedMod = 1.0;
            let currentTerrain = null;
            this.terrains.forEach(t => {
                if ((snake.head.x - t.x)**2 + (snake.head.y - t.y)**2 < t.radius**2) {
                    currentTerrain = t.type;
                    if (t.type === 'river') speedMod = 0.75;
                }
            });

            const targetAngle = snake === this.player ? (input.isMoving ? input.angle : null) : null;
            const wantsDash = snake === this.player ? input.isDashing : false;
            
            snake.update(targetAngle, wantsDash, dt, { 
                snakes: this.snakes, 
                stones: this.stones,
                food: this.food, 
                terrain: currentTerrain,
                speedMod: speedMod
            });
        });

        this.checkCollisions();
        
        if (this.food.length < 100) this.spawnResource();
    }

    checkCollisions() {
        this.snakes.forEach(snake => {
            if (snake.isDead) return;

            // Boundary
            if (Math.abs(snake.head.x) > CONFIG.WORLD_SIZE/2 || Math.abs(snake.head.y) > CONFIG.WORLD_SIZE/2) {
                this.kill(snake); return;
            }

            // Stones
            this.stones.forEach(s => {
                if ((snake.head.x - s.x)**2 + (snake.head.y - s.y)**2 < (snake.radius + s.radius)**2) {
                    this.kill(snake);
                }
            });

            // Food
            for (let i = this.food.length - 1; i >= 0; i--) {
                const f = this.food[i];
                if ((snake.head.x - f.x)**2 + (snake.head.y - f.y)**2 < (snake.radius + f.size)**2) {
                    // Rule: If length < 50, eating any food restores to 50
                    if (snake.length < CONFIG.INITIAL_LENGTH) {
                        snake.targetLength = CONFIG.INITIAL_LENGTH;
                    } else {
                        snake.targetLength += f.value;
                    }
                    snake.totalEaten += f.value;
                    this.food.splice(i, 1);
                }
            }

            // Combat
            this.snakes.forEach(other => {
                if (other.isDead || snake === other) return;
                
                // Head-Head
                const dHead = (snake.head.x - other.head.x)**2 + (snake.head.y - other.head.y)**2;
                if (dHead < (snake.radius + other.radius)**2) {
                    if (snake.length > other.length) this.kill(other);
                    else this.kill(snake);
                }
                
                // Head-Body (Cutting)
                for(let i = 10; i < other.points.length; i++) {
                    const p = other.points[i];
                    if ((snake.head.x - p.x)**2 + (snake.head.y - p.y)**2 < (snake.radius + 10)**2) {
                        if (snake.isDashing) {
                            this.cut(other, i);
                        } else {
                            this.kill(snake);
                        }
                    }
                }
            });
        });
    }

    cut(snake, idx) {
        const legacy = snake.points.slice(idx);
        snake.points = snake.points.slice(0, idx);
        snake.length = snake.points.length * 2;
        snake.targetLength = snake.length;
        
        legacy.forEach((p, i) => {
            if (i % 5 === 0) this.food.push({ x: p.x, y: p.y, size: 4, value: 2 });
        });
        this.spark(snake.head.x, snake.head.y, snake.color);
    }

    kill(snake) {
        snake.isDead = true;
        this.spark(snake.head.x, snake.head.y, snake.color);
        this.respawnQueue.push({ snake, time: CONFIG.RESPAWN_TIME });
    }

    respawn(snake) {
        const pos = this.getSafeSpawnPoint();
        snake.head = { x: pos.x, y: pos.y };
        snake.points = [{ x: pos.x, y: pos.y }];
        snake.length = CONFIG.INITIAL_LENGTH;
        snake.targetLength = CONFIG.INITIAL_LENGTH;
        snake.isDead = false;
        snake.isDashing = false;
        snake.angle = Math.random() * Math.PI * 2;
    }

    spark(x, y, color) {
        for(let i = 0; i < 15; i++) {
            this.effects.push({ x, y, vx: (Math.random()-0.5)*15, vy: (Math.random()-0.5)*15, color, life: 0.8 });
        }
    }

    endGame() {
        this.isGameOver = true;
        // In v2.2.0, victory is based on totalEaten
        const finalScore = Math.floor(this.player.totalEaten);
        if (finalScore > this.bestScore) {
            this.bestScore = finalScore;
            localStorage.setItem('snake_best', this.bestScore);
        }
    }
}
