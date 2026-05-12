import { CONFIG } from './constants.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.camera = { x: 0, y: 0, zoom: 0.5 }; // 縮小比例，視野變廣 (v3.1.0)
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // 動態計算縮放比例 (v3.1.4)：大幅拉近，手機約 0.85，PC 約 1.2
        this.camera.baseZoom = Math.max(0.85, Math.min(1.3, rect.width / 1000));
    }

    render(state) {
        const { player, snakes, food, stones, terrains, effects } = state;
        const ctx = this.ctx;
        
        this.camera.x = player.head.x;
        this.camera.y = player.head.y;
        this.camera.zoom = this.camera.baseZoom; // 使用動態計算的縮放值 (v3.1.2)

        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.save();
        // 修正中心點：需除以 dpr 才能對準螢幕中央 (v3.1.5)
        ctx.translate(this.canvas.width / (2 * dpr), this.canvas.height / (2 * dpr));
        ctx.scale(this.camera.zoom, this.camera.zoom);
        ctx.translate(-this.camera.x, -this.camera.y);

        this.drawTerrains(terrains);
        this.drawGrid();
        this.drawStones(stones);
        this.drawResources(food);
        this.drawEffects(effects);
        
        snakes.forEach(s => this.drawSnake(s, effects));

        ctx.restore();
    }

    drawGrid() {
        const ctx = this.ctx;
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        for(let x = -CONFIG.WORLD_SIZE/2; x <= CONFIG.WORLD_SIZE/2; x += 100) {
            ctx.beginPath(); ctx.moveTo(x, -CONFIG.WORLD_SIZE/2); ctx.lineTo(x, CONFIG.WORLD_SIZE/2); ctx.stroke();
        }
        for(let y = -CONFIG.WORLD_SIZE/2; y <= CONFIG.WORLD_SIZE/2; y += 100) {
            ctx.beginPath(); ctx.moveTo(-CONFIG.WORLD_SIZE/2, y); ctx.lineTo(CONFIG.WORLD_SIZE/2, y); ctx.stroke();
        }
        // Boundary matches Stone Border (Red)
        ctx.strokeStyle = CONFIG.COLORS.BOUNDARY; 
        ctx.lineWidth = 15;
        ctx.strokeRect(-CONFIG.WORLD_SIZE/2, -CONFIG.WORLD_SIZE/2, CONFIG.WORLD_SIZE, CONFIG.WORLD_SIZE);
    }

    drawTerrains(terrains) {
        const ctx = this.ctx;
        terrains.forEach(t => {
            // Enhanced Colors
            ctx.fillStyle = t.type === 'river' ? 'rgba(0,100,255,0.25)' : 'rgba(100, 255, 255, 0.35)';
            ctx.beginPath();
            ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = t.type === 'river' ? 'rgba(0,180,255,0.6)' : 'rgba(180, 255, 255, 0.9)';
            ctx.lineWidth = 3;
            ctx.stroke();
        });
    }

    drawStones(stones) {
        const ctx = this.ctx;
        stones.forEach(s => {
            // Red Border Stone
            ctx.fillStyle = CONFIG.COLORS.STONE;
            ctx.beginPath(); ctx.arc(s.x, s.y, s.radius, 0, Math.PI*2); ctx.fill();
            
            ctx.strokeStyle = CONFIG.COLORS.STONE_BORDER; 
            ctx.lineWidth = 4; 
            ctx.stroke();
            
            // Subtle highlight
            ctx.strokeStyle = 'rgba(255,255,255,0.15)';
            ctx.beginPath();
            ctx.arc(s.x - s.radius*0.3, s.y - s.radius*0.3, s.radius*0.2, 0, Math.PI * 2);
            ctx.stroke();
        });
    }

    drawResources(food) {
        const ctx = this.ctx;
        food.forEach(f => {
            // All food is yellow (#FFD700)
            ctx.fillStyle = CONFIG.COLORS.FOOD;
            ctx.shadowBlur = f.value >= 10 ? 15 : 5; 
            ctx.shadowColor = CONFIG.COLORS.FOOD;
            
            ctx.beginPath(); ctx.arc(f.x, f.y, f.size, 0, Math.PI*2); ctx.fill();
            ctx.shadowBlur = 0;
        });
    }

    drawHeadHUD(snake) {
        const ctx = this.ctx;
        const radius = snake.radius + 18;
        
        // 畫背景環
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(snake.head.x, snake.head.y, radius, 0, Math.PI * 2);
        ctx.stroke();

        // 體力進度環 (v3.2.0)
        const staminaRatio = snake.stamina / CONFIG.STAMINA_MAX;
        
        // 只有在體力不滿或是過熱時才顯示
        if (staminaRatio < 0.99 || snake.isOverloaded) {
            const cyan = '#00FFFF';
            const red = '#FF3333';
            
            // 狀態變色：過熱為紅，加速為亮青，充能為暗青
            if (snake.isOverloaded) {
                ctx.strokeStyle = red;
                ctx.shadowBlur = 10;
                ctx.shadowColor = red;
            } else {
                ctx.strokeStyle = snake.isDashing ? cyan : 'rgba(0, 255, 255, 0.4)';
                ctx.shadowBlur = snake.isDashing ? 20 : 0;
                ctx.shadowColor = cyan;
            }
            
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(snake.head.x, snake.head.y, radius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * staminaRatio));
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }

    drawMagnetHUD(snake) {
        const ctx = this.ctx;
        const x = snake.head.x;
        const y = snake.head.y - snake.radius - 40;
        
        // 畫圖標
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🧲', x, y);
        
        // 畫倒數條
        const barWidth = 40;
        const barHeight = 4;
        const ratio = snake.magnetTime / 10; // 10秒總時長
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(x - barWidth/2, y + 5, barWidth, barHeight);
        
        ctx.fillStyle = '#FF3333';
        ctx.fillRect(x - barWidth/2, y + 5, barWidth * ratio, barHeight);
    }

    drawSnake(snake, effects) {
        if (snake.isDead || snake.points.length < 2) return;
        const ctx = this.ctx;
        ctx.save();
        
        // 速度線特效 (v2.7.1)
        if (snake.isDashing) {
            this.drawSpeedLines(snake);
        }

        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.lineWidth = snake.radius * 2; ctx.strokeStyle = snake.color;
        if (snake.isDashing) { 
            ctx.shadowBlur = 30; // 發光加強
            ctx.shadowColor = snake.color; 
            ctx.lineWidth *= 1.15; 
        }
        
        ctx.beginPath();
        ctx.moveTo(snake.points[0].x, snake.points[0].y);
        for(let i = 1; i < snake.points.length; i++) ctx.lineTo(snake.points[i].x, snake.points[i].y);
        ctx.stroke();

        // Head
        ctx.fillStyle = '#fff'; ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.arc(snake.head.x, snake.head.y, snake.radius, 0, Math.PI*2); ctx.fill();
        
        if (snake.id === 'player') {
            this.drawHeadHUD(snake);
        }

        // Overload Smoke Effect (v3.2.0)
        if (snake.isOverloaded && Math.random() < 0.3) {
            effects.push({
                x: snake.head.x + (Math.random() - 0.5) * 20,
                y: snake.head.y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 3,
                color: 'rgba(150, 150, 150, 0.5)',
                life: 0.6
            });
        }

        // Magnet HUD (v2.9.0)
        if (snake.isMagnetActive) {
            this.drawMagnetHUD(snake);
        }

        // Eyes
        ctx.fillStyle = '#000';
        const offset = 7;
        const x1 = snake.head.x + Math.cos(snake.angle + 0.6) * offset;
        const y1 = snake.head.y + Math.sin(snake.angle + 0.6) * offset;
        const x2 = snake.head.x + Math.cos(snake.angle - 0.6) * offset;
        const y2 = snake.head.y + Math.sin(snake.angle - 0.6) * offset;
        ctx.beginPath(); ctx.arc(x1, y1, 3, 0, Math.PI*2); ctx.arc(x2, y2, 3, 0, Math.PI*2); ctx.fill();
        ctx.restore();
    }

    drawSpeedLines(snake) {
        const ctx = this.ctx;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        
        // 在蛇頭周圍產生後掠線
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
            if (e.type === 'SHOCKWAVE') {
                const alpha = e.life * 2;
                if (!e.radius) e.radius = 0;
                e.radius += 15; // 擴散速度
                ctx.strokeStyle = `rgba(188, 19, 254, ${alpha})`;
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
                ctx.stroke();
            } else {
                ctx.globalAlpha = e.life * 1.5; ctx.fillStyle = e.color;
                ctx.beginPath(); ctx.arc(e.x, e.y, 3, 0, Math.PI*2); ctx.fill();
                if (e.vx) e.x += e.vx; 
                if (e.vy) e.y += e.vy;
            }
        });
        ctx.globalAlpha = 1.0;
    }
}
