import { CONFIG } from './constants.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.camera = { x: 0, y: 0, zoom: 0.5 }; 
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.camera.baseZoom = Math.max(0.75, Math.min(1.2, rect.width / 1100));
    }

    render(state) {
        const { player, snakes, food, items, stones, terrains, effects } = state;
        const ctx = this.ctx;

        const sortedSnakes = [...snakes].sort((a, b) => b.totalEaten - a.totalEaten);
        const leader = sortedSnakes[0];
        const isPlayerLeader = leader && leader.id === player.id;
        effects.isPlayerLeader = isPlayerLeader;

        this.camera.x = player.head.x;
        this.camera.y = player.head.y;

        let targetZoom = this.camera.baseZoom;
        if (player.eagleEyeTime > 0) targetZoom *= 0.75;

        if (!this.camera.currentZoom) this.camera.currentZoom = targetZoom;
        this.camera.currentZoom += (targetZoom - this.camera.currentZoom) * 0.04;
        this.camera.zoom = this.camera.currentZoom;

        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.save();
        ctx.translate(this.canvas.width / (2 * dpr), this.canvas.height / (2 * dpr));
        ctx.scale(this.camera.zoom, this.camera.zoom);
        ctx.translate(-this.camera.x, -this.camera.y);

        this.drawTerrains(terrains);
        this.drawGrid();
        this.drawStones(stones);
        this.drawResources(food);
        this.drawItems(items);
        this.drawEffects(effects);

        snakes.forEach(s => {
            s.isLeader = leader && s.id === leader.id;
            this.drawSnake(s, effects);
        });

        ctx.restore();

        if (player.blindnessAlpha > 0) this.drawInkOverlay(player.blindnessAlpha);
        this.drawLeaderMarker(state, leader);
    }

    drawGrid() {
        const ctx = this.ctx;
        const size = CONFIG.WORLD_SIZE;
        
        // 1. 基礎格線
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        for (let x = -size / 2; x <= size / 2; x += 100) {
            ctx.beginPath(); ctx.moveTo(x, -size / 2); ctx.lineTo(x, size / 2); ctx.stroke();
        }
        for (let y = -size / 2; y <= size / 2; y += 100) {
            ctx.beginPath(); ctx.moveTo(-size / 2, y); ctx.lineTo(size / 2, y); ctx.stroke();
        }

        // 2. 分層視覺引導 (v4.1.0 隱形呼吸特效)
        const pulse = 0.04 + Math.sin(Date.now() / 1000) * 0.02; // 6.3s 慢速呼吸
        
        ctx.save();
        // 核心地帶中心光暈 (呼吸效果)
        const grad = ctx.createRadialGradient(0, 0, 50, 0, 0, 400);
        grad.addColorStop(0, `rgba(255, 215, 0, ${pulse})`);
        grad.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, 400, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 3. 世界邊界
        ctx.strokeStyle = CONFIG.COLORS.BOUNDARY;
        ctx.lineWidth = 15;
        ctx.strokeRect(-size / 2, -size / 2, size, size);
    }

    drawTerrains(terrains) {
        const ctx = this.ctx;
        terrains.forEach(t => {
            ctx.fillStyle = t.type === 'river' ? 'rgba(0,100,255,0.25)' : 'rgba(100, 255, 255, 0.35)';
            ctx.beginPath(); ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = t.type === 'river' ? 'rgba(0,180,255,0.6)' : 'rgba(180, 255, 255, 0.9)';
            ctx.lineWidth = 3; ctx.stroke();
        });
    }

    drawStones(stones) {
        const ctx = this.ctx;
        stones.forEach(s => {
            ctx.fillStyle = CONFIG.COLORS.STONE;
            ctx.beginPath(); ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = CONFIG.COLORS.STONE_BORDER;
            ctx.lineWidth = 4; ctx.stroke();
        });
    }

    drawResources(food) {
        const ctx = this.ctx;
        food.forEach(f => {
            ctx.fillStyle = f.color || CONFIG.COLORS.FOOD;
            ctx.beginPath(); ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2); ctx.fill();
        });
    }

    drawItems(items) {
        const ctx = this.ctx;
        if (!items) return;
        items.forEach(it => {
            const cfg = it.config;
            if (it.teaserTime > 0) {
                // 繪製生成預告 (粒子匯聚) - v4.1.0 強化幸運 7 視覺
                const progress = it.teaserTime / CONFIG.ITEM_TEASER_TIME;
                const isLucky7 = it.id === 'LUCKY7';
                const particleCount = isLucky7 ? 12 : 8;
                const spread = isLucky7 ? 120 : 60;

                ctx.save();
                ctx.globalAlpha = 0.6;
                
                // 匯聚點粒子
                for (let i = 0; i < particleCount; i++) {
                    const angle = (Date.now() * 0.01 + i * (Math.PI * 2 / particleCount));
                    const r = spread * progress;
                    ctx.fillStyle = isLucky7 ? '#FFD700' : (cfg.color || '#FFF');
                    ctx.beginPath();
                    ctx.arc(it.x + Math.cos(angle)*r, it.y + Math.sin(angle)*r, isLucky7 ? 4 : 2.5, 0, Math.PI * 2);
                    ctx.fill();
                }

                // 中心亮點 (幸運 7 專屬)
                if (isLucky7) {
                    ctx.shadowBlur = 25;
                    ctx.shadowColor = '#FFD700';
                    ctx.globalAlpha = (1 - progress) * 0.8;
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath(); ctx.arc(it.x, it.y, 10, 0, Math.PI * 2); ctx.fill();
                }
                ctx.restore();
            } else {
                // 繪製道具實體 (v4.0)
                ctx.save();
                ctx.shadowBlur = 15;
                ctx.shadowColor = cfg.color;
                
                // 背景圈
                ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                ctx.beginPath(); ctx.arc(it.x, it.y, 25, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = cfg.color;
                ctx.lineWidth = 3;
                ctx.stroke();

                // 圖標
                ctx.font = 'bold 28px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = (it.id === 'LUCKY7') ? '#FFFF00' : '#FFF';
                ctx.fillText(cfg.icon, it.x, it.y + (it.id === 'LUCKY7' ? 2 : 0));
                
                ctx.restore();
            }
        });
    }

    drawHeadHUD(snake) {
        const ctx = this.ctx;
        const radius = snake.radius + 18;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(snake.head.x, snake.head.y, radius, 0, Math.PI * 2); ctx.stroke();

        const staminaRatio = snake.stamina / CONFIG.STAMINA_MAX;
        if (snake.id === 'player' || staminaRatio < 0.99 || snake.isOverloaded || snake.isDashing) {
            const cyan = '#00FFFF';
            const red = '#FF3333';
            if (snake.isOverloaded) {
                ctx.strokeStyle = red; ctx.shadowBlur = 10; ctx.shadowColor = red;
            } else {
                ctx.strokeStyle = snake.isDashing ? cyan : 'rgba(0, 255, 255, 0.4)';
                ctx.shadowBlur = snake.isDashing ? 20 : 0; ctx.shadowColor = cyan;
            }
            ctx.lineWidth = 6;
            ctx.beginPath(); ctx.arc(snake.head.x, snake.head.y, radius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * staminaRatio));
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }

    drawSkillHUD(snake, icon, timeLeft, maxTime, y, color = '#FF3333') {
        const ctx = this.ctx;
        const x = snake.head.x;
        ctx.font = '20px Arial'; ctx.textAlign = 'center'; ctx.fillText(icon, x, y);
        const barWidth = 36, barHeight = 3, ratio = timeLeft / maxTime;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(x - barWidth / 2, y + 5, barWidth, barHeight);
        ctx.fillStyle = color; 
        ctx.fillRect(x - barWidth / 2, y + 5, barWidth * ratio, barHeight);
    }

    drawSnake(snake, effects) {
        if (snake.isDead || snake.points.length < 2) return;
        const ctx = this.ctx;
        ctx.save();

        if (snake.isDashing) this.drawSpeedLines(snake);

        // 幽靈狀態處理 (v4.0)
        if (snake.ghostTime > 0) {
            const isFlashing = snake.ghostTime < 3 && Math.floor(Date.now() / 200) % 2 === 0;
            ctx.globalAlpha = isFlashing ? 0.7 : 0.35;
        }

        // 受傷閃爍
        let displayColor = snake.color;
        if (snake.hitTimer > 0) {
            const isWhite = Math.floor(Date.now() / 50) % 2 === 0;
            displayColor = isWhite ? '#FFFFFF' : '#FF0000';
        }

        // 巨大化光暈 (v4.0)
        // 巨大化光暈 (v4.2.1 優化：僅繪製前半段路徑減少繪圖開銷)
        if (snake.titanTime > 0) {
            const isFlashing = snake.titanTime < 3 && Math.floor(Date.now() / 200) % 2 === 0;
            if (!isFlashing) {
                ctx.strokeStyle = 'rgba(255, 100, 0, 0.25)';
                ctx.lineWidth = snake.radius * 2.8;
                ctx.beginPath();
                const limit = Math.min(snake.points.length, 50); // 巨大化光暈僅覆蓋前半段
                ctx.moveTo(snake.points[0].x, snake.points[0].y);
                for (let i = 1; i < limit; i++) ctx.lineTo(snake.points[i].x, snake.points[i].y);
                ctx.stroke();
            }
        }

        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.lineWidth = snake.radius * 2; ctx.strokeStyle = displayColor;
        if (snake.isDashing) { 
            // 效能優化：僅對玩家或短蛇使用高品質發光 (v4.2.1)
            if (snake.id === 'player' || snake.points.length < 100) {
                ctx.shadowBlur = 15; 
                ctx.shadowColor = displayColor; 
            }
            ctx.lineWidth *= 1.15; 
        }

        ctx.beginPath();
        ctx.moveTo(snake.points[0].x, snake.points[0].y);
        for (let i = 1; i < snake.points.length; i++) ctx.lineTo(snake.points[i].x, snake.points[i].y);
        ctx.stroke();

        // 蛇頭
        ctx.fillStyle = '#fff'; ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.arc(snake.head.x, snake.head.y, snake.radius, 0, Math.PI * 2); ctx.fill();

        if (snake.id === 'player') this.drawHeadHUD(snake);
        if (snake.isLeader || (snake.id === 'player' && effects.isPlayerLeader)) {
            ctx.save(); ctx.font = '36px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
            ctx.shadowBlur = 20; ctx.shadowColor = '#FFD700';
            ctx.fillText('👑', snake.head.x, snake.head.y - snake.radius - 15); ctx.restore();
        }

        // 道具 HUD 堆疊
        let hudY = snake.head.y - snake.radius - 45;
        if (snake.lucky7Time > 0) {
            this.drawSkillHUD(snake, '7️⃣', snake.lucky7Time, 10, hudY, '#FFFF00');
            hudY -= 35;
        }
        if (snake.titanTime > 0) {
            this.drawSkillHUD(snake, '🍄', snake.titanTime, 10, hudY, '#FF4400');
            hudY -= 35;
        }
        if (snake.ghostTime > 0) {
            this.drawSkillHUD(snake, '👻', snake.ghostTime, 10, hudY, '#AAAAAA');
            hudY -= 35;
        }
        if (snake.magnetTime > 0) { this.drawSkillHUD(snake, '🧲', snake.magnetTime, 8, hudY); hudY -= 35; }
        if (snake.eagleEyeTime > 0) { this.drawSkillHUD(snake, '🦅', snake.eagleEyeTime, 12, hudY); hudY -= 35; }
        if (snake.inkTime > 0) { this.drawSkillHUD(snake, '🌑', snake.inkTime, 3, hudY); hudY -= 35; }

        // 眼睛
        ctx.fillStyle = '#000';
        const offset = snake.radius * 0.5;
        ctx.beginPath();
        ctx.arc(snake.head.x + Math.cos(snake.angle + 0.6) * offset, snake.head.y + Math.sin(snake.angle + 0.6) * offset, 3, 0, Math.PI * 2);
        ctx.arc(snake.head.x + Math.cos(snake.angle - 0.6) * offset, snake.head.y + Math.sin(snake.angle - 0.6) * offset, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawSpeedLines(snake) {
        const ctx = this.ctx; ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'; ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            const angleOffset = (Math.random() - 0.5) * 1.5;
            const lineLen = 30 + Math.random() * 50;
            const startDist = snake.radius + 5;
            const ax = Math.cos(snake.angle + Math.PI + angleOffset);
            const ay = Math.sin(snake.angle + Math.PI + angleOffset);
            ctx.beginPath();
            ctx.moveTo(snake.head.x + ax * startDist, snake.head.y + ay * startDist);
            ctx.lineTo(snake.head.x + ax * (startDist + lineLen), snake.head.y + ay * (startDist + lineLen));
            ctx.stroke();
        }
    }

    drawEffects(effects) {
        const ctx = this.ctx;
        effects.forEach(e => {
            if (e.type === 'SHOCKWAVE' || e.type === 'TITAN_WAVE') {
                const alpha = e.life * 2;
                if (!e.radius) e.radius = 0; e.radius += 10;
                ctx.strokeStyle = e.color || `rgba(188, 19, 254, ${alpha})`;
                ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2); ctx.stroke();
            } else if (e.type === 'TAIL_SHATTER') {
                const fadeTime = 1.0;
                let visibleCount = e.points.length; let alpha = 0.6; let sizeScale = 1.0;
                if (e.life < fadeTime) { const progress = e.life / fadeTime; visibleCount = Math.floor(e.points.length * progress); alpha = 0.6 * progress; sizeScale = progress; }
                ctx.globalAlpha = alpha; ctx.fillStyle = e.color;
                for (let i = 0; i < visibleCount; i++) { if (i % 2 === 0) { const p = e.points[i]; ctx.beginPath(); ctx.arc(p.x, p.y, 8 * sizeScale, 0, Math.PI * 2); ctx.fill(); } }
                ctx.globalAlpha = 1.0;
            } else if (e.type === 'ITEM_PICKUP') {
                ctx.save(); ctx.globalAlpha = e.life; ctx.strokeStyle = e.color; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(e.x, e.y, 30 + (1 - e.life) * 50, 0, Math.PI * 2); ctx.stroke();
                ctx.restore();
            } else if (e.type === 'INK_CLOUD') {
                const alpha = Math.min(1, e.life);
                const isPlayer = e.ownerId === 'player';
                const baseColor = isPlayer ? 'rgba(191, 0, 255, ' : 'rgba(75, 0, 130, ';
                ctx.fillStyle = baseColor + (alpha * 0.7) + ')';
                for (let j = 0; j < 5; j++) {
                    const r = e.radius * (0.7 + Math.sin(Date.now() * 0.004 + j) * 0.15);
                    ctx.beginPath(); ctx.arc(e.x + Math.cos(j * 1.25)*e.radius*0.4, e.y + Math.sin(j * 1.25)*e.radius*0.4, r, 0, Math.PI * 2); ctx.fill();
                }
            } else {
                ctx.globalAlpha = e.life * 1.5; ctx.fillStyle = e.color;
                ctx.beginPath(); ctx.arc(e.x, e.y, 3, 0, Math.PI * 2); ctx.fill();
                if (e.vx) e.x += e.vx; if (e.vy) e.y += e.vy;
            }
        });
        ctx.globalAlpha = 1.0;
    }

    drawInkOverlay(alpha) {
        const ctx = this.ctx; const w = this.canvas.width; const h = this.canvas.height;
        ctx.save(); 
        
        // 由 Alpha (0-1) 驅動的過渡邏輯 (v4.5.6)
        // alpha=0 為清晰, alpha=1 為致盲
        const innerMin = 160;
        const outerMin = 500;
        const maxDist = 1000;

        // 使用平方曲線讓過渡更自然
        const ease = 1 - Math.pow(alpha, 2); 
        const innerRadius = innerMin + ease * maxDist;
        const outerRadius = outerMin + ease * maxDist;

        const grad = ctx.createRadialGradient(w / 2, h / 2, innerRadius, w / 2, h / 2, outerRadius);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)'); grad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h); ctx.restore();
    }

    drawLeaderMarker(state, leader) {
        const { player } = state;
        if (!leader || leader.id === player.id || (leader.isDead && !leader.deathPos)) return;
        const ctx = this.ctx; const dpr = window.devicePixelRatio || 1; const w = this.canvas.width / dpr, h = this.canvas.height / dpr;
        const targetX = leader.isDead ? (leader.deathPos?.x || leader.head.x) : leader.head.x;
        const targetY = leader.isDead ? (leader.deathPos?.y || leader.head.y) : leader.head.y;
        const dx = (targetX - player.head.x) * this.camera.zoom, dy = (targetY - player.head.y) * this.camera.zoom;
        const margin = 40; const halfW = w / 2 - margin, halfH = h / 2 - margin;
        if (Math.abs(dx) < halfW && Math.abs(dy) < halfH) return;
        const scale = Math.min(halfW / Math.abs(dx), halfH / Math.abs(dy));
        ctx.save(); ctx.translate(w / 2 + dx * scale, h / 2 + dy * scale);
        ctx.shadowBlur = 15; ctx.shadowColor = leader.isDead ? '#FF0000' : '#FFD700';
        ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(0, 0, 17, 0, Math.PI * 2); ctx.fill();
        ctx.font = '18px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(leader.isDead ? '💀' : '👑', 0, -2);
        const dist = Math.floor(Math.sqrt((targetX - player.head.x)**2 + (targetY - player.head.y)**2));
        ctx.font = 'bold 10px Arial'; ctx.fillStyle = leader.isDead ? '#FF0000' : '#D4AF37'; ctx.fillText(`${dist}m`, 0, 16);
        ctx.restore();
    }
}
