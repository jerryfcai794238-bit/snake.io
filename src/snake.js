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

        // Stats Tracking (v2.3.0)
        this.totalEaten = 0;
        this.maxLength = CONFIG.INITIAL_LENGTH;
        this.sessionMax = CONFIG.INITIAL_LENGTH; // 整場絕對最高
        this.kills = 0;
        this.cuts = 0;
        this.deaths = 0;
        this.totalDashTime = 0;

        // 技能系統 (v3.3.3 修正：恢復冷卻計時)
        this.magnetTime = 0;
        this.magnetCooldown = 0;
        this.eagleEyeTime = 0;
        this.eagleEyeCooldown = 0;
        this.inkTime = 0; // 被噴墨後的致盲時間
        this.inkCooldown = 0; // 噴墨冷卻

        this.slowTimer = 0; // 減速時間
        this.hitTimer = 0; // 受傷閃爍時間
        this.deathPos = null; // 紀錄死亡座標 (v3.6.1)
        this.stamina = CONFIG.STAMINA_MAX;
        this.isOverloaded = false;

        // 隨機道具狀態 (v4.0)
        this.lucky7Time = 0;
        this.titanTime = 0;
        this.ghostTime = 0;
    }

    update(targetAngle, wantsToDash, dt, worldContext) {
        // 更新技能計時器 (即使死亡也要倒數 v2.9.6)
        if (this.magnetTime > 0) {
            this.magnetTime -= dt;
            if (this.magnetTime <= 0) {
                this.magnetTime = 0;
                this.isMagnetActive = false;
            }
        }
        if (this.magnetCooldown > 0) {
            this.magnetCooldown -= dt;
        }
        if (this.eagleEyeTime > 0) this.eagleEyeTime -= dt;
        if (this.eagleEyeCooldown > 0) this.eagleEyeCooldown -= dt;
        if (this.inkTime > 0) this.inkTime -= dt;
        if (this.inkCooldown > 0) this.inkCooldown -= dt;
        if (this.slowTimer > 0) this.slowTimer -= dt;
        if (this.hitTimer > 0) this.hitTimer -= dt;

        // 道具計時器 (v4.0)
        if (this.lucky7Time > 0) this.lucky7Time -= dt;
        if (this.titanTime > 0) this.titanTime -= dt;
        if (this.ghostTime > 0) this.ghostTime -= dt;

        if (this.isDead) {
            // 鎖定死亡座標 (v3.6.1)
            if (!this.deathPos) this.deathPos = { x: this.head.x, y: this.head.y };
            return;
        }
        
        // 存活時清除死亡座標
        this.deathPos = null;

        if (this.isAI) {
            this.updateAI(worldContext);
            targetAngle = this.angle;
            wantsToDash = this.isDashing;
        }

        if (targetAngle !== null) {
            // 基礎轉向速率 (v3.5.7)
            let turnSpeed = 0.15; 
            
            // 衝刺時轉向更靈巧 (1.5x 轉向速率)
            if (this.isDashing) turnSpeed *= 1.5;
            
            // 角度補間平滑處理
            this.angle = this.lerpAngle(this.angle, targetAngle, turnSpeed);
        }

        const canDash = wantsToDash && !this.isOverloaded && this.stamina > 0;
        let baseSpeed = CONFIG.BASE_SPEED;

        // 減速 90% (v3.0.0)
        if (this.slowTimer > 0) baseSpeed *= 0.1;

        if (canDash) {
            this.isDashing = true;
            this.speed = baseSpeed * CONFIG.DASH_MULTIPLIER;
            this.totalDashTime += dt;

            // 體力消耗 (v3.2.0)
            this.stamina -= CONFIG.STAMINA_DRAIN_SPEED * dt;
            if (this.stamina <= 0) {
                this.stamina = 0;
                this.isOverloaded = true;
                this.isDashing = false;
            }
        } else {
            this.isDashing = false;
            this.speed = baseSpeed;

            // 體力回充 (非加速狀態持續回充)
            this.stamina += CONFIG.STAMINA_REGEN_SPEED * dt;
            if (this.stamina >= CONFIG.STAMINA_MAX) {
                this.stamina = CONFIG.STAMINA_MAX;
                this.isOverloaded = false; // 只有回滿才能解除過熱鎖定
            }
        }

        // 巨大化屬性修正 (v4.0)
        let titanSpeedMod = 1.0;
        let titanSizeMod = 1.0;
        if (this.titanTime > 0) {
            titanSpeedMod = CONFIG.ITEM_TYPES.MUSHROOM.speedMod;
            titanSizeMod = CONFIG.ITEM_TYPES.MUSHROOM.sizeMod;
        }

        const worldSpeedMod = worldContext.speedMod || 1.0;
        const currentSpeed = this.speed * worldSpeedMod * titanSpeedMod;
        this.head.x += Math.cos(this.angle) * currentSpeed;
        this.head.y += Math.sin(this.angle) * currentSpeed;

        this.radius = CONFIG.HEAD_RADIUS * titanSizeMod;

        this.points.unshift({ x: this.head.x, y: this.head.y });
        
        // 動態成長速度 (v4.0)：差距越大成長越快，增強沙漏回饋感
        const diff = this.targetLength - this.length;
        if (diff > 0) {
            const growthRate = diff > 100 ? 5.0 : 1.0;
            this.length += Math.min(diff, growthRate);
        } else if (diff < 0) {
            this.length -= 0.5;
        }
        this.maxLength = Math.max(this.maxLength, this.length);
        this.sessionMax = Math.max(this.sessionMax, this.length);

        const maxPoints = Math.max(5, Math.floor(this.length / 2));
        if (this.points.length > maxPoints) this.points.length = maxPoints;
    }

    getTailPosition() {
        return this.points[this.points.length - 1];
    }

    updateAI(world) {
        const head = this.head;
        const halfSize = CONFIG.WORLD_SIZE / 2;
        let visionRange = 400;
        
        // 致盲效果影響 AI (v3.3.9)
        if (this.inkTime > 0) {
            visionRange = 100; // 視野大幅縮減
        }

        const rayAngles = [-60, -30, -15, 0, 15, 30, 60].map(a => a * Math.PI / 180);
        let bestScore = -Infinity;
        let bestAngle = this.angle;
        let shouldDash = false;
        const player = world.snakes.find(s => s.id === 'player');

        rayAngles.forEach(offset => {
            const rayAngle = this.angle + offset;
            let score = 0;
            for (let dist = 40; dist <= visionRange; dist += 80) {
                const rx = head.x + Math.cos(rayAngle) * dist;
                const ry = head.y + Math.sin(rayAngle) * dist;
                if (Math.abs(rx) > halfSize - 30 || Math.abs(ry) > halfSize - 30) { score -= 30000 / (dist / 40); break; }
                for (const s of world.stones) {
                    const d2 = (rx - s.x) ** 2 + (ry - s.y) ** 2;
                    if (d2 < (s.radius + 30) ** 2) { score -= 25000 / (dist / 40); break; }
                }
                if (player && !player.isDead) {
                    let bodyHitIdx = -1;
                    for (let i = 0; i < player.points.length; i += 10) {
                        const p = player.points[i];
                        if ((rx - p.x) ** 2 + (ry - p.y) ** 2 < 70 ** 2) { bodyHitIdx = i; break; }
                    }
                    if (bodyHitIdx !== -1) {
                        if (this.length > CONFIG.INITIAL_LENGTH + 50) { score += 8000; shouldDash = true; }
                        else { score -= 20000 / (dist / 40); }
                    }
                }
                world.food.forEach(f => {
                    const d2 = (rx - f.x) ** 2 + (ry - f.y) ** 2;
                    if (d2 < 150 ** 2) { score += (f.value * 100) / (Math.sqrt(d2) / 40 + 1); }
                });
            }
            if (score > bestScore) { bestScore = score; bestAngle = rayAngle; }
        });

        // 致盲時增加隨機偏向與恐慌加速 (v3.3.9)
        if (this.inkTime > 0) {
            bestAngle += (Math.random() - 0.5) * 1.8; // 更劇烈的亂竄
            if (Math.random() < 0.1) shouldDash = true; // 10% 機率恐慌加速
        }

        let diff = bestAngle - this.angle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        this.angle += diff * 0.2;
        this.isDashing = shouldDash && this.length > CONFIG.INITIAL_LENGTH + 50;
    }
    triggerMagnet() {
        if (this.magnetCooldown <= 0) {
            this.magnetTime = 8;
            this.magnetCooldown = 30;
            return true;
        }
        return false;
    }

    triggerEagleEye() {
        if (this.eagleEyeCooldown <= 0) {
            this.eagleEyeTime = 12;
            this.eagleEyeCooldown = 25; // 設置冷卻 (v3.3.3)
            return true;
        }
        return false;
    }

    triggerInkCloud(effects) {
        if (this.inkCooldown <= 0) {
            // 回歸蛇頭釋放，並記錄擁有者 (v3.3.8)
            effects.push({
                type: 'INK_CLOUD',
                ownerId: this.id,
                x: this.head.x,
                y: this.head.y,
                life: 6.0,
                maxLife: 6.0,
                radius: 80 // 提升至 80px (v3.5.5)
            });
            this.inkCooldown = 20;
            return true;
        }
        return false;
    }

    // 輔助函數：處理角度平滑過渡 (處理 -PI 到 PI 的跨越問題)
    lerpAngle(a, b, t) {
        let diff = b - a;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        return a + diff * t;
    }
}
