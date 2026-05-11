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
        this.totalEaten = 0; // Total score for victory
    }

    update(targetAngle, wantsToDash, dt, worldContext) {
        if (this.isDead) return;

        // 1. AI Decision
        if (this.isAI) {
            this.updateAI(worldContext);
            targetAngle = this.angle;
            wantsToDash = this.isDashing;
        }

        // 2. Turn Logic
        if (targetAngle !== null) {
            let diff = targetAngle - this.angle;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            
            const turnSensitivity = worldContext.terrain === 'ice' ? 0.03 : 0.15;
            this.angle += diff * turnSensitivity;
        }

        // 3. Dash Logic (Length-based)
        const canDash = wantsToDash && this.length > CONFIG.INITIAL_LENGTH;
        
        if (canDash) {
            this.isDashing = true;
            this.speed = CONFIG.BASE_SPEED * CONFIG.DASH_MULTIPLIER;
            // Consume length
            this.targetLength -= CONFIG.DASH_LENGTH_CONSUME_RATE * dt;
            if (this.targetLength < CONFIG.INITIAL_LENGTH) {
                this.targetLength = CONFIG.INITIAL_LENGTH;
            }
        } else {
            this.isDashing = false;
            this.speed = CONFIG.BASE_SPEED;
        }
        
        // 4. Move
        const speedMod = worldContext.speedMod || 1.0;
        const currentSpeed = this.speed * speedMod;

        this.head.x += Math.cos(this.angle) * currentSpeed;
        this.head.y += Math.sin(this.angle) * currentSpeed;
        
        // 5. Path & Length Management
        this.points.unshift({ x: this.head.x, y: this.head.y });
        
        if (this.length < this.targetLength) this.length += 1.0;
        if (this.length > this.targetLength) this.length -= 0.5;

        const maxPoints = Math.max(5, Math.floor(this.length / 2));
        if (this.points.length > maxPoints) {
            this.points.length = maxPoints;
        }
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

                if (Math.abs(rx) > halfSize - 30 || Math.abs(ry) > halfSize - 30) {
                    score -= 30000 / (dist/40);
                    break;
                }

                for (const s of world.stones) {
                    const d2 = (rx - s.x)**2 + (ry - s.y)**2;
                    if (d2 < (s.radius + 30)**2) {
                        score -= 25000 / (dist/40);
                        break;
                    }
                }

                if (player && !player.isDead) {
                    // Avoid player body or try to cut
                    let bodyHitIdx = -1;
                    for (let i = 0; i < player.points.length; i += 10) {
                        const p = player.points[i];
                        if ((rx - p.x)**2 + (ry - p.y)**2 < 70**2) {
                            bodyHitIdx = i;
                            break;
                        }
                    }

                    if (bodyHitIdx !== -1) {
                        if (this.length > CONFIG.INITIAL_LENGTH + 20) {
                            score += 8000; // Aggressive cut
                            shouldDash = true;
                        } else {
                            score -= 20000 / (dist/40);
                        }
                    }
                }

                // Food
                world.food.forEach(f => {
                    const d2 = (rx - f.x)**2 + (ry - f.y)**2;
                    if (d2 < 150**2) {
                        const distVal = Math.sqrt(d2);
                        score += (f.value * 100) / (distVal/40 + 1);
                    }
                });
            }

            if (score > bestScore) {
                bestScore = score;
                bestAngle = rayAngle;
            }
        });

        let diff = bestAngle - this.angle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        this.angle += diff * 0.2;

        this.isDashing = shouldDash && this.length > CONFIG.INITIAL_LENGTH + 30;
    }
}
