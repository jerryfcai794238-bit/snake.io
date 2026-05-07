import { CONFIG } from './constants.js';
import { Snake } from './snake.js';

export class Game {
    constructor() {
        this.snakes = [];
        this.food = [];
        this.energyOrbs = [];
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
    }
    init() {
        this.snakes = [];
        this.food = [];
        this.energyOrbs = [];
        this.stones = [];
        this.terrains = [];
        this.effects = [];
        this.timer = CONFIG.SOLO_TIME;
        this.isGameOver = false;
        
        // Terrains (S-shaped winding river)
        const rx = (Math.random() - 0.5) * CONFIG.WORLD_SIZE * 0.1;
        const ry = (Math.random() - 0.5) * CONFIG.WORLD_SIZE * 0.1;
        for (let i = 0; i < 8; i++) {
            this.terrains.push({
                type: 'river',
                x: rx + i * 110,
                y: ry + Math.sin(i * 0.9) * 100,
                radius: 70 
            });
        }

        this.terrains.push({ 
            type: 'ice', 
            x: (Math.random() - 0.5) * CONFIG.WORLD_SIZE * 0.3, 
            y: (Math.random() - 0.5) * CONFIG.WORLD_SIZE * 0.3, 
            radius: 200 
        });
        
        // Stones
        let attempts = 0;
        const minGap = 45; 
        const margin = 80;
        const spawnRange = CONFIG.WORLD_SIZE - margin * 2;
        while(this.stones.length < 10 && attempts < 100) {
            attempts++;
            const s = {
                x: (Math.random() - 0.5) * spawnRange,
                y: (Math.random() - 0.5) * spawnRange,
                radius: 20 + Math.random() * 35
            };
            const tooClose = this.stones.some(other => {
                const d = Math.sqrt((s.x - other.x)**2 + (s.y - other.y)**2);
                return d < (s.radius + other.radius + minGap);
            });
            
            // Safe zone check for Player/AI spawn
            const nearPlayer = Math.sqrt(s.x**2 + (s.y - 500)**2) < s.radius + 150;
            const nearAI = Math.sqrt(s.x**2 + (s.y + 500)**2) < s.radius + 150;
            
            if (!tooClose && !nearPlayer && !nearAI) this.stones.push(s);
        }
    }

    start(mode) {
        this.mode = mode;
        this.isPlaying = true;
        this.lastSecond = Date.now();
        this.player = new Snake('player', 'You', CONFIG.COLORS.PLAYER, 0, 500);
        this.snakes = [this.player];
        if (mode === 'duel') {
            this.snakes.push(new Snake('ai', 'Bot', CONFIG.COLORS.AI, 0, -500, true));
        }
        for(let i = 0; i < 500; i++) this.spawnResource();
    }

    spawnResource() {
        let x, y, isNear = false, currentTerrainType = null;
        const margin = 40;
        const safeSize = CONFIG.WORLD_SIZE - margin * 2;
        
        if (Math.random() < 0.4) {
            const t = this.terrains[Math.floor(Math.random() * this.terrains.length)];
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * t.radius;
            x = t.x + Math.cos(angle) * dist;
            y = t.y + Math.sin(angle) * dist;
            currentTerrainType = t.type;
        } else if (Math.random() < 0.4) {
            const stone = this.stones[Math.floor(Math.random() * this.stones.length)];
            const angle = Math.random() * Math.PI * 2;
            const dist = stone.radius + 15 + Math.random() * 40;
            x = stone.x + Math.cos(angle) * dist;
            y = stone.y + Math.sin(angle) * dist;
            isNear = true;
        } else {
            x = (Math.random() - 0.5) * safeSize;
            y = (Math.random() - 0.5) * safeSize;
        }

        // Final boundary check
        if (Math.abs(x) > CONFIG.WORLD_SIZE/2 - 20 || Math.abs(y) > CONFIG.WORLD_SIZE/2 - 20) return;

        // Inside stone check
        for (const s of this.stones) {
            const d = (x - s.x)**2 + (y - s.y)**2;
            if (d < s.radius**2) return; 
        }

        // Slightly increased Energy Orb density
        const orbChance = currentTerrainType === 'ice' ? 0.1 : (currentTerrainType === 'river' ? 0.08 : 0.05);
        
        if (Math.random() < orbChance) {
            this.energyOrbs.push({ x, y, size: 8, value: CONFIG.ENERGY_ORB_VALUE });
        } else {
            // Refined Risk/Reward Loot Matrix
            let size = 4, value = 1.5;
            const roll = Math.random();

            if (currentTerrainType === 'ice') {
                size = 3; value = 2; // Small but rewarding
            } else if (currentTerrainType === 'river') {
                size = 4.5; value = 3.5; // Medium
            } else if (isNear) {
                // Stones: 60% Big, 40% Normal
                if (roll < 0.6) { size = 9; value = 12; } 
                else { size = 4.5; value = 2; }
            } else {
                // Open Areas: 10% Surprise Big, 90% Normal
                if (roll < 0.1) { size = 9; value = 12; }
                else { size = 4.5; value = 1.5; }
            }
            this.food.push({ x, y, size, value });
        }
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
                const d = (snake.head.x - t.x)**2 + (snake.head.y - t.y)**2;
                if (d < t.radius**2) {
                    currentTerrain = t.type;
                    if (t.type === 'river') speedMod = 0.75; // 25% slowdown
                }
            });

            const targetAngle = snake === this.player ? (input.isMoving ? input.angle : null) : null;
            const wantsDash = snake === this.player ? input.isDashing : false;
            
            snake.update(targetAngle, wantsDash, dt, { 
                snakes: this.snakes, 
                stones: this.stones,
                food: this.food, 
                orbs: this.energyOrbs,
                terrain: currentTerrain,
                speedMod: speedMod
            });
        });

        this.checkCollisions();
        
        if (this.food.length < 250) this.spawnResource();
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
                const d = (snake.head.x - s.x)**2 + (snake.head.y - s.y)**2;
                if (d < (snake.radius + s.radius)**2) this.kill(snake);
            });

            // Resources
            this.food.forEach((f, i) => {
                if ((snake.head.x - f.x)**2 + (snake.head.y - f.y)**2 < (snake.radius + f.size)**2) {
                    snake.targetLength += f.value;
                    this.food.splice(i, 1);
                }
            });
            this.energyOrbs.forEach((o, i) => {
                if ((snake.head.x - o.x)**2 + (snake.head.y - o.y)**2 < (snake.radius + o.size)**2) {
                    snake.addEnergy(o.value);
                    this.energyOrbs.splice(i, 1);
                }
            });

            // Combat (Cutting)
            this.snakes.forEach(other => {
                if (other.isDead) return;
                if (snake !== other) {
                    // Head-Head
                    const dHead = (snake.head.x - other.head.x)**2 + (snake.head.y - other.head.y)**2;
                    if (dHead < (snake.radius + other.radius)**2) {
                        if (snake.length > other.length) this.kill(other);
                        else this.kill(snake);
                    }
                    // Head-Body
                    for(let i = 10; i < other.points.length; i++) {
                        const p = other.points[i];
                        if ((snake.head.x - p.x)**2 + (snake.head.y - p.y)**2 < (snake.radius + other.radius)**2) {
                            if (snake.isDashing) {
                                this.cut(other, i);
                                snake.addEnergy(30);
                            } else {
                                this.kill(snake);
                            }
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
        
        // Tactical Logging for AI Optimization
        if (snake.id === 'ai') {
            const cutPoint = legacy[0];
            const dx = this.player.head.x - cutPoint.x;
            const dy = this.player.head.y - cutPoint.y;
            const angle = Math.atan2(dy, dx);
            const relativeAngle = angle - this.player.angle;
            console.log(`[TACTICAL CUT] Player cut AI! Angle: ${(relativeAngle * 180 / Math.PI).toFixed(1)}deg, Dist: ${Math.sqrt(dx*dx+dy*dy).toFixed(1)}px`);
        }

        legacy.forEach((p, i) => {
            if (i % 5 === 0) this.food.push({ x: p.x, y: p.y, size: 6, value: 3 });
        });
        this.spark(snake.head.x, snake.head.y, snake.color);
    }

    kill(snake) {
        snake.isDead = true;
        this.spark(snake.head.x, snake.head.y, snake.color);
        if (snake === this.player) this.endGame();
    }

    spark(x, y, color) {
        for(let i = 0; i < 12; i++) {
            this.effects.push({ x, y, vx: (Math.random()-0.5)*12, vy: (Math.random()-0.5)*12, color, life: 0.6 });
        }
    }

    endGame() {
        this.isGameOver = true;
        if (this.player.length > this.bestScore) {
            this.bestScore = Math.floor(this.player.length);
            localStorage.setItem('snake_best', this.bestScore);
        }
    }
}
