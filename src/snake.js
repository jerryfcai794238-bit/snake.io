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

        // Magnet Skill (v2.9.0)
        this.isMagnetActive = false;
        this.magnetTime = 0; 
        this.magnetCooldown = 0;

        // Shockwave Skill (v3.0.0)
        this.shockwaveCooldown = 0;
        this.slowTimer = 0; // 被擊中後的減速時間
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
            if (this.magnetCooldown <= 0) this.magnetCooldown = 0;
        }
        if (this.shockwaveCooldown > 0) {
            this.shockwaveCooldown -= dt;
            if (this.shockwaveCooldown <= 0) this.shockwaveCooldown = 0;
        }
        if (this.slowTimer > 0) {
            this.slowTimer -= dt;
            if (this.slowTimer <= 0) this.slowTimer = 0;
        }

        if (this.isDead) return;

        if (this.isAI) {
            this.updateAI(worldContext);
            targetAngle = this.angle;
            wantsToDash = this.isDashing;
        }

        if (targetAngle !== null) {
            this.angle = targetAngle;
        }

        const canDash = wantsToDash && this.targetLength > CONFIG.INITIAL_LENGTH + 5;
        let baseSpeed = CONFIG.BASE_SPEED;
        
        // 減速 90% (v3.0.0)
        if (this.slowTimer > 0) baseSpeed *= 0.1;

        if (canDash) {
            this.isDashing = true;
            this.speed = baseSpeed * CONFIG.DASH_MULTIPLIER;
            this.totalDashTime += dt;
            
            // 動態消耗：確保大約 2.5 秒內會消耗完所有儲備長度 (v2.7.4)
            const reserveLength = this.targetLength - CONFIG.INITIAL_LENGTH;
            const dynamicDrain = reserveLength / 2.5; // 2.5秒內噴完
            
            // 取「基本消耗率」與「動態消耗率」的最大值
            const drainRate = Math.max(CONFIG.DASH_LENGTH_CONSUME_RATE, dynamicDrain);
            const amountToConsume = drainRate * dt;
            
            this.targetLength -= amountToConsume;
            if (this.targetLength < CONFIG.INITIAL_LENGTH) {
                this.targetLength = CONFIG.INITIAL_LENGTH;
            }
            
            if (worldContext.onDropFood) {
                worldContext.onDropFood(this, amountToConsume * 0.6);
            }
        } else {
            this.isDashing = false;
            this.speed = CONFIG.BASE_SPEED;
        }
        
        const speedMod = worldContext.speedMod || 1.0;
        const currentSpeed = this.speed * speedMod;
        this.head.x += Math.cos(this.angle) * currentSpeed;
        this.head.y += Math.sin(this.angle) * currentSpeed;
        
        this.points.unshift({ x: this.head.x, y: this.head.y });
        if (this.length < this.targetLength) this.length += 1.0;
        if (this.length > this.targetLength) this.length -= 0.5;
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
        const visionRange = 400;
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
                if (Math.abs(rx) > halfSize - 30 || Math.abs(ry) > halfSize - 30) { score -= 30000 / (dist/40); break; }
                for (const s of world.stones) {
                    const d2 = (rx - s.x)**2 + (ry - s.y)**2;
                    if (d2 < (s.radius + 30)**2) { score -= 25000 / (dist/40); break; }
                }
                if (player && !player.isDead) {
                    let bodyHitIdx = -1;
                    for (let i = 0; i < player.points.length; i += 10) {
                        const p = player.points[i];
                        if ((rx - p.x)**2 + (ry - p.y)**2 < 70**2) { bodyHitIdx = i; break; }
                    }
                    if (bodyHitIdx !== -1) {
                        if (this.length > CONFIG.INITIAL_LENGTH + 50) { score += 8000; shouldDash = true; } 
                        else { score -= 20000 / (dist/40); }
                    }
                }
                world.food.forEach(f => {
                    const d2 = (rx - f.x)**2 + (ry - f.y)**2;
                    if (d2 < 150**2) { score += (f.value * 100) / (Math.sqrt(d2)/40 + 1); }
                });
            }
            if (score > bestScore) { bestScore = score; bestAngle = rayAngle; }
        });
        let diff = bestAngle - this.angle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        this.angle += diff * 0.2;
        this.isDashing = shouldDash && this.length > CONFIG.INITIAL_LENGTH + 50;
    }
}
