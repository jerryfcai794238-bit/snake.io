import { CONFIG } from './constants.js';

export class Snake {
    constructor(id, name, color, x, y, isAI = false, startAngle = null) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.isAI = isAI;

        this.head = { x, y };
        this.points = [{ x, y }];
        this.length = CONFIG.INITIAL_LENGTH;
        this.targetLength = CONFIG.INITIAL_LENGTH;
        this.radius = CONFIG.HEAD_RADIUS;
        this.angle = startAngle !== null ? startAngle : Math.random() * Math.PI * 2;

        this.isDashing = false;
        this.speed = CONFIG.BASE_SPEED;
        this.isDead = false;

        // Stats
        this.totalEaten = 0;
        this.kills = 0;
        this.cuts = 0;
        this.deaths = 0;

        // 技能狀態
        this.magnetTime = 0;
        this.magnetCooldown = 0;
        this.eagleEyeTime = 0;
        this.eagleEyeCooldown = 0;
        this.inkTime = 0; 
        this.inkCooldown = 0;
        this.blindnessAlpha = 0;

        this.slowTimer = 0; 
        this.hitTimer = 0; 
        this.stamina = CONFIG.STAMINA_MAX;
        this.isOverloaded = false;

        this.lucky7Time = 0;
        this.titanTime = 0;
        this.ghostTime = 0;
        
        // AI 專屬 (v4.5.7)
        this.aiTargetAngle = this.angle;
        this.aiRandomAngle = 0;
        this.aiRandomTimer = 0;

        // 磁吸漩渦主動技標記
        this.triggerVortexFlag = false;
    }

    update(targetAngle, wantsToDash, dt, world) {
        if (this.magnetTime > 0) this.magnetTime -= dt;
        if (this.magnetCooldown > 0) this.magnetCooldown -= dt;
        if (this.eagleEyeTime > 0) this.eagleEyeTime -= dt;
        if (this.eagleEyeCooldown > 0) this.eagleEyeCooldown -= dt;
        if (this.inkTime > 0) this.inkTime -= dt;
        if (this.inkCooldown > 0) this.inkCooldown -= dt;
        if (this.slowTimer > 0) this.slowTimer -= dt;
        if (this.hitTimer > 0) this.hitTimer -= dt;
        if (this.lucky7Time > 0) this.lucky7Time -= dt;
        if (this.titanTime > 0) this.titanTime -= dt;
        if (this.ghostTime > 0) this.ghostTime -= dt;

        if (this.triggerVortexFlag) {
            this.triggerVortexFlag = false;
            if (world && world.food) {
                world.food.forEach(f => {
                    const d2 = (f.x - this.head.x)**2 + (f.y - this.head.y)**2;
                    if (d2 < 400**2) f.vortexTarget = this;
                });
            }
        }

        const animSpeed = 2.5;
        if (this.inkTime > 0) {
            this.blindnessAlpha = Math.min(1, this.blindnessAlpha + dt * animSpeed);
        } else {
            this.blindnessAlpha = Math.max(0, this.blindnessAlpha - dt * animSpeed);
        }

        if (this.isDead) return;

        if (this.isAI) {
            this.updateAI(world, dt);
            targetAngle = this.aiTargetAngle; // 使用 AI 計算出的目標角度
            wantsToDash = this.isDashing;
        }

        if (targetAngle !== null) {
            // AI 轉向速度補償，避免致盲時繞死圈 (v4.5.7)
            const turnSpeed = this.isDashing ? 0.22 : 0.16;
            this.angle = this.lerpAngle(this.angle, targetAngle, turnSpeed);
        }

        const canDash = wantsToDash && !this.isOverloaded && this.stamina > 0;
        let baseSpeed = CONFIG.BASE_SPEED;
        if (this.slowTimer > 0) baseSpeed *= 0.1;

        if (canDash) {
            this.isDashing = true;
            this.speed = baseSpeed * CONFIG.DASH_MULTIPLIER;
            this.stamina -= CONFIG.STAMINA_DRAIN_SPEED * dt;
            if (this.stamina <= 0) { this.stamina = 0; this.isOverloaded = true; }
        } else {
            this.isDashing = false;
            this.speed = baseSpeed;
            this.stamina += CONFIG.STAMINA_REGEN_SPEED * dt;
            if (this.stamina >= CONFIG.STAMINA_MAX) { this.stamina = CONFIG.STAMINA_MAX; this.isOverloaded = false; }
        }

        const worldSpeedMod = world.speedMod || 1.0;
        const titanSpeedMod = this.titanTime > 0 ? CONFIG.ITEM_TYPES.MUSHROOM.speedMod : 1.0;
        const currentSpeed = this.speed * worldSpeedMod * titanSpeedMod;
        
        this.head.x += Math.cos(this.angle) * currentSpeed;
        this.head.y += Math.sin(this.angle) * currentSpeed;
        this.radius = CONFIG.HEAD_RADIUS * (this.titanTime > 0 ? CONFIG.ITEM_TYPES.MUSHROOM.sizeMod : 1.0);

        this.points.unshift({ x: this.head.x, y: this.head.y });
        const diff = this.targetLength - this.length;
        if (diff > 0) this.length += Math.min(diff, diff > 100 ? 5.0 : 1.2);
        else if (diff < 0) this.length -= 0.5;

        const maxPoints = Math.max(5, Math.floor(this.length / 2));
        if (this.points.length > maxPoints) this.points.length = maxPoints;
    }

    updateAI(world, dt) {
        const { foodGrid, gridSize, snakes, stones, food, effects } = world;
        const head = this.head;
        const halfSize = CONFIG.WORLD_SIZE / 2;
        
        // 致盲視野從 120 提升至 180 (v4.5.7)
        let visionRange = this.inkTime > 0 ? 180 : 450;

        const gx = Math.floor(head.x / gridSize), gy = Math.floor(head.y / gridSize);
        let nearbyFoodCount = 0;
        for (let ox = -1; ox <= 1; ox++) {
            for (let oy = -1; oy <= 1; oy++) {
                const indices = foodGrid.get(`${gx + ox},${gy + oy}`);
                if (indices) nearbyFoodCount += indices.length;
            }
        }

        if (nearbyFoodCount > 15 && this.magnetCooldown <= 0) this.triggerMagnet();
        
        const enemyBehind = snakes.some(s => {
            if (s === this || s.isDead) return false;
            const dx = s.head.x - head.x, dy = s.head.y - head.y;
            const dot = dx * Math.cos(this.angle) + dy * Math.sin(this.angle);
            return (dx*dx + dy*dy) < 180**2 && dot < 0;
        });
        // 技能已關閉，禁用 AI 噴墨
        // if (enemyBehind) this.triggerInkCloud(effects || []);

        // 導航探測 (細化步進為 40px)
        const rayAngles = [-75, -45, -20, 0, 20, 45, 75].map(a => a * Math.PI / 180);
        let bestScore = -Infinity, bestAngle = this.angle, shouldDash = false;

        rayAngles.forEach(offset => {
            const rayAngle = this.angle + offset;
            const cosA = Math.cos(rayAngle), sinA = Math.sin(rayAngle);
            let score = 0;

            for (let dist = 40; dist <= visionRange; dist += 40) {
                const rx = head.x + cosA * dist, ry = head.y + sinA * dist;
                if (Math.abs(rx) > halfSize - 40 || Math.abs(ry) > halfSize - 40) { score -= 100000; break; }
                const hitStone = stones.some(s => (rx - s.x)**2 + (ry - s.y)**2 < (s.radius + 35)**2);
                if (hitStone) { score -= 80000; break; }

                const rgx = Math.floor(rx / gridSize), rgy = Math.floor(ry / gridSize);
                const foodInCell = foodGrid.get(`${rgx},${rgy}`);
                if (foodInCell) {
                    foodInCell.forEach(idx => {
                        const f = food[idx];
                        const d2 = (rx - f.x)**2 + (ry - f.y)**2;
                        if (d2 < 120**2) {
                            score += (f.value * 300) / (dist / 40 + 1);
                            if (dist < 200 && f.value > 5) shouldDash = true;
                        }
                    });
                }
                // 檢查其他蛇的頭部與身體 (跳躍取樣優化效能)
                let hitBody = false;
                for (let s of snakes) {
                    if (s === this || s.isDead) continue;
                    if (s.ghostTime > 0) continue; // 幽靈狀態無視碰撞

                    // 檢查對方頭部周圍 (正面衝突)
                    const distToHeadSq = (rx - s.head.x)**2 + (ry - s.head.y)**2;
                    if (distToHeadSq < 150**2) {
                        if (this.length > s.length + 30) { 
                            score += 15000; 
                            shouldDash = true; 
                        } else { 
                            score -= 50000; 
                        }
                    }

                    // 檢查對方身體節點 (每 3 個節點取樣一次)
                    for (let i = 0; i < s.points.length; i += 3) {
                        const pt = s.points[i];
                        const safeDist = s.radius + 35;
                        if ((rx - pt.x)**2 + (ry - pt.y)**2 < safeDist**2) {
                            hitBody = true;
                            break;
                        }
                    }
                    if (hitBody) break;
                }

                if (hitBody) {
                    score -= 80000; // 視為死路
                    break;
                }
            }
            if (score > bestScore) { bestScore = score; bestAngle = rayAngle; }
        });

        if (this.inkTime > 0) {
            this.aiRandomTimer -= dt;
            if (this.aiRandomTimer <= 0) {
                // 降低亂竄幅度 (2.0 -> 0.8) 避免原地轉圈 (v4.5.7)
                this.aiRandomAngle = (Math.random() - 0.5) * 0.8;
                this.aiRandomTimer = 0.5 + Math.random() * 0.5;
            }
            bestAngle += this.aiRandomAngle;
        }

        this.aiTargetAngle = bestAngle; // 設定目標角度，交給 update 進行平滑插值
        this.isDashing = shouldDash && this.length > CONFIG.INITIAL_LENGTH + 20;
    }

    triggerMagnet() {
        if (this.magnetCooldown <= 0) {
            this.triggerVortexFlag = true; 
            this.magnetCooldown = 30;
            return true;
        }
        return false;
    }
    triggerEagleEye() {
        // 技能已關閉
        return false;
    }
    triggerInkCloud(effects) {
        // 技能已關閉
        return false;
    }

    lerpAngle(a, b, t) {
        let diff = b - a;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        return a + diff * t;
    }
}
