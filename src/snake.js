import { CONFIG } from './constants.js';

export class Snake {
    constructor(id, name, color, x, y, isAI = false, startAngle = null) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.isAI = isAI;
        
        this.head = { x, y };
        this.points = [{ x, y }]; // High-res path for body
        this.length = 50;
        this.targetLength = 50;
        this.radius = CONFIG.HEAD_RADIUS;
        this.angle = startAngle !== null ? startAngle : Math.random() * Math.PI * 2;
        
        this.energy = 10;
        this.isDashing = false;
        this.speed = CONFIG.BASE_SPEED;
        this.isDead = false;
    }

    update(targetAngle, wantsToDash, dt, worldContext) {
        if (this.isDead) return;

        // 1. AI Decision Override
        if (this.isAI) {
            this.updateAI(worldContext);
            targetAngle = this.angle;
            wantsToDash = this.isDashing;
        }

        // 2. Turn Logic (Inertia on Ice)
        if (targetAngle !== null) {
            let diff = targetAngle - this.angle;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            
            const turnSensitivity = worldContext.terrain === 'ice' ? 0.03 : 0.15;
            this.angle += diff * turnSensitivity;
        }

        // 3. Dash & Energy Logic
        const canStart = wantsToDash && this.energy >= CONFIG.ENERGY_STARTUP_THRESHOLD;
        const canContinue = wantsToDash && this.energy > 0;
        
        if (this.isDashing) {
            if (canContinue) {
                this.speed = CONFIG.BASE_SPEED * CONFIG.DASH_MULTIPLIER;
                this.energy -= CONFIG.ENERGY_CONSUME_RATE * dt;
            } else {
                this.isDashing = false;
                this.speed = CONFIG.BASE_SPEED;
            }
        } else {
            if (canStart) {
                this.isDashing = true;
                this.speed = CONFIG.BASE_SPEED * CONFIG.DASH_MULTIPLIER;
                this.energy -= CONFIG.ENERGY_CONSUME_RATE * dt;
            } else {
                this.speed = CONFIG.BASE_SPEED;
            }
        }
        this.energy = Math.max(0, Math.min(CONFIG.ENERGY_MAX, this.energy));
        
        // 4. Apply Speed Modifier & Move
        const speedMod = worldContext.speedMod || 1.0;
        const currentSpeed = this.speed * speedMod;

        this.head.x += Math.cos(this.angle) * currentSpeed;
        this.head.y += Math.sin(this.angle) * currentSpeed;
        
        // 5. Update Path & Length
        this.points.unshift({ x: this.head.x, y: this.head.y });
        
        if (this.length < this.targetLength) this.length += 1.0;
        if (this.length > this.targetLength) this.length -= 0.5;

        const maxPoints = Math.floor(this.length / 2);
        if (this.points.length > maxPoints) {
            this.points.length = maxPoints;
        }
    }

    addEnergy(amount) {
        this.energy = Math.min(CONFIG.ENERGY_MAX, this.energy + amount);
    }

    updateAI(world) {
        const head = this.head;
        const halfSize = CONFIG.WORLD_SIZE / 2;
        const visionRange = 300;
        
        // 1. Setup 7 Vision Rays (-60 to +60 degrees)
        const rayAngles = [-60, -30, -15, 0, 15, 30, 60].map(a => a * Math.PI / 180);
        let bestScore = -Infinity;
        let bestAngle = this.angle;
        let shouldDash = false;

        const player = world.snakes.find(s => s.id === 'player');

        rayAngles.forEach(offset => {
            const rayAngle = this.angle + offset;
            let score = 0;
            
            // Check along the ray at 3 key distances
            for (let dist = 40; dist <= visionRange; dist += 80) {
                const rx = head.x + Math.cos(rayAngle) * dist;
                const ry = head.y + Math.sin(rayAngle) * dist;

                // A. Boundary/Walls (Critical Penalty)
                if (Math.abs(rx) > halfSize - 20 || Math.abs(ry) > halfSize - 20) {
                    score -= 20000 / (dist/40); // Hard penalty, prioritized
                    break;
                }

                // B. Stones (Critical Penalty)
                for (const s of world.stones) {
                    const d2 = (rx - s.x)**2 + (ry - s.y)**2;
                    if (d2 < (s.radius + 20)**2) {
                        score -= 15000 / (dist/40);
                        break;
                    }
                }

                // C. Player Body (Tactical Cross-Through Cut)
                if (player && !player.isDead) {
                    let bodyHitIdx = -1;
                    for (let i = 0; i < player.points.length; i += 10) {
                        const p = player.points[i];
                        if ((rx - p.x)**2 + (ry - p.y)**2 < 60**2) {
                            bodyHitIdx = i;
                            break;
                        }
                    }

                    if (bodyHitIdx !== -1) {
                        // TACTICAL DECISION: If we have energy, perform a CROSS-THROUGH CUT
                        if (this.energy > 30 && this.length > 150) {
                            // Target a point BEYOND the body to ensure we cross the path
                            // We use the current ray direction but extend the vision to "see through"
                            score += 5000; 
                            shouldDash = true;
                        } else {
                            // No energy or too small: Extreme avoidance
                            score -= 18000 / (dist/40);
                        }
                    }

                    // D. Combat: Aggressive Head Interception
                    if (bodyHitIdx === -1) {
                        const dHead2 = (rx - player.head.x)**2 + (ry - player.head.y)**2;
                        if (dHead2 < 180**2) {
                            if (this.length > 100) {
                                score += 3000;
                                if (dist < 250) shouldDash = true; 
                            }
                        }
                    }
                }

                // E. Food & Orbs (Reward)
                for (let i = 0; i < Math.min(world.food.length, 30); i++) {
                    const f = world.food[i];
                    if ((rx - f.x)**2 + (ry - f.y)**2 < 120**2) {
                        score += (this.length < 200 ? 180 : 40);
                    }
                }
            }

            if (score > bestScore) {
                bestScore = score;
                bestAngle = rayAngle;
            }
        });

        // Apply smoothed turn
        let diff = bestAngle - this.angle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        this.angle += diff * 0.15;

        // Energy management for Dash
        this.isDashing = shouldDash && this.energy > 30 && this.length > 150;
    }
}
