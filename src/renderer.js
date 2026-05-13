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

        // 動態計算縮放比例 (v3.5.9)：初始視距稍微拉遠，預設從 0.85 調降為 0.75
        this.camera.baseZoom = Math.max(0.75, Math.min(1.2, rect.width / 1100));
    }

    render(state) {
        const { player, snakes, food, stones, terrains, effects } = state;
        const ctx = this.ctx;

        // 全局王者判定 (v3.6.5): snakes 陣列已包含 player，直接排序
        // 必須使用 totalEaten 進行排序，以與排行榜 (Main.js) 邏輯一致
        const sortedSnakes = [...snakes].sort((a, b) => b.totalEaten - a.totalEaten);
        const leader = sortedSnakes[0];
        const isPlayerLeader = leader && leader.id === player.id;
        effects.isPlayerLeader = isPlayerLeader;

        this.camera.x = player.head.x;
        this.camera.y = player.head.y;

        // 渲染時計算目標 Zoom (v3.3.3)
        let targetZoom = this.camera.baseZoom;
        if (player.eagleEyeTime > 0) {
            targetZoom *= 0.75; // 視野擴張 (從 0.6 調整為 0.75，視野適中) (v3.5.2)
        }

        // 平滑縮放 (Lerp) - 係數調小使過程更絲滑 (v3.3.4)
        if (!this.camera.currentZoom) this.camera.currentZoom = targetZoom;
        this.camera.currentZoom += (targetZoom - this.camera.currentZoom) * 0.04;
        this.camera.zoom = this.camera.currentZoom;


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

        // 遍歷所有蛇進行渲染，並標記王者狀態 (v3.6.5)
        snakes.forEach(s => {
            s.isLeader = leader && s.id === leader.id;
            this.drawSnake(s, effects);
        });

        ctx.restore();

        // 噴墨致盲遮罩 (v3.3.0)
        if (player.inkTime > 0) {
            this.drawInkOverlay(player.inkTime);
        }

        // 第一名方位指引 (v3.5.9)
        this.drawLeaderMarker(state, leader);
    }



    drawGrid() {
        const ctx = this.ctx;
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        for (let x = -CONFIG.WORLD_SIZE / 2; x <= CONFIG.WORLD_SIZE / 2; x += 100) {
            ctx.beginPath(); ctx.moveTo(x, -CONFIG.WORLD_SIZE / 2); ctx.lineTo(x, CONFIG.WORLD_SIZE / 2); ctx.stroke();
        }
        for (let y = -CONFIG.WORLD_SIZE / 2; y <= CONFIG.WORLD_SIZE / 2; y += 100) {
            ctx.beginPath(); ctx.moveTo(-CONFIG.WORLD_SIZE / 2, y); ctx.lineTo(CONFIG.WORLD_SIZE / 2, y); ctx.stroke();
        }
        // Boundary matches Stone Border (Red)
        ctx.strokeStyle = CONFIG.COLORS.BOUNDARY;
        ctx.lineWidth = 15;
        ctx.strokeRect(-CONFIG.WORLD_SIZE / 2, -CONFIG.WORLD_SIZE / 2, CONFIG.WORLD_SIZE, CONFIG.WORLD_SIZE);
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
            ctx.beginPath(); ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2); ctx.fill();

            ctx.strokeStyle = CONFIG.COLORS.STONE_BORDER;
            ctx.lineWidth = 4;
            ctx.stroke();

            // Subtle highlight
            ctx.strokeStyle = 'rgba(255,255,255,0.15)';
            ctx.beginPath();
            ctx.arc(s.x - s.radius * 0.3, s.y - s.radius * 0.3, s.radius * 0.2, 0, Math.PI * 2);
            ctx.stroke();
        });
    }

    drawResources(food) {
        const ctx = this.ctx;
        food.forEach(f => {
            ctx.fillStyle = f.color || CONFIG.COLORS.FOOD; // 支援自定義顏色 (v3.5.4)
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
            ctx.fill();
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

        // 體力進度環 (v3.2.2)
        const staminaRatio = snake.stamina / CONFIG.STAMINA_MAX;

        // 玩家始終顯示，其餘蛇只有在體力不滿、過熱或加速時才顯示
        if (snake.id === 'player' || staminaRatio < 0.99 || snake.isOverloaded || snake.isDashing) {
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

    drawSkillHUD(snake, icon, timeLeft, maxTime, y) {
        const ctx = this.ctx;
        const x = snake.head.x;

        // 畫圖標
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(icon, x, y);

        // 畫倒數條
        const barWidth = 36;
        const barHeight = 3;
        const ratio = timeLeft / maxTime;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(x - barWidth / 2, y + 5, barWidth, barHeight);

        ctx.fillStyle = '#FF3333'; // 統一使用紅色跑條 (v3.3.6)
        ctx.fillRect(x - barWidth / 2, y + 5, barWidth * ratio, barHeight);
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

        // 受傷閃爍處理 (v3.3.2)
        let displayColor = snake.color;
        if (snake.hitTimer > 0) {
            const isWhite = Math.floor(Date.now() / 50) % 2 === 0;
            displayColor = isWhite ? '#FFFFFF' : '#FF0000';
        }

        ctx.lineWidth = snake.radius * 2; ctx.strokeStyle = displayColor;
        if (snake.isDashing) {
            ctx.shadowBlur = 30; // 發光加強
            ctx.shadowColor = displayColor;
            ctx.lineWidth *= 1.15;
        }

        ctx.beginPath();
        ctx.moveTo(snake.points[0].x, snake.points[0].y);
        for (let i = 1; i < snake.points.length; i++) ctx.lineTo(snake.points[i].x, snake.points[i].y);
        ctx.stroke();

        // Head
        ctx.fillStyle = '#fff'; ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.arc(snake.head.x, snake.head.y, snake.radius, 0, Math.PI * 2); ctx.fill();

        if (snake.id === 'player') {
            this.drawHeadHUD(snake);
            
            // 如果玩家是第一名，戴上皇冠 (v3.6.2)
            if (effects && effects.isPlayerLeader) {
                ctx.save();
                ctx.font = '36px Arial'; // 略微放大
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#FFD700';
                ctx.fillText('👑', snake.head.x, snake.head.y - snake.radius - 15);
                ctx.restore();
            }
        } else {
            // AI 如果是第一名，也要戴皇冠 (v3.6.5)
            if (snake.isLeader) {
                ctx.save();
                ctx.font = '30px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#FFD700';
                ctx.fillText('👑', snake.head.x, snake.head.y - snake.radius - 15); // AI 高度對齊
                ctx.restore();
            }
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

        // 技能圖標 HUD (v3.3.5: 磁鐵 & 鷹眼 垂直堆疊)
        let hudY = snake.head.y - snake.radius - 45;
        if (snake.magnetTime > 0) {
            this.drawSkillHUD(snake, '🧲', snake.magnetTime, 8, hudY);
            hudY -= 35; // 向上堆疊下一個圖標
        }
        if (snake.eagleEyeTime > 0) {
            this.drawSkillHUD(snake, '🦅', snake.eagleEyeTime, 12, hudY);
            hudY -= 35;
        }
        if (snake.inkTime > 0) {
            this.drawSkillHUD(snake, '🌑', snake.inkTime, 3, hudY);
            hudY -= 35;
        }

        // Eyes
        ctx.fillStyle = '#000';
        const offset = 7;
        const x1 = snake.head.x + Math.cos(snake.angle + 0.6) * offset;
        const y1 = snake.head.y + Math.sin(snake.angle + 0.6) * offset;
        const x2 = snake.head.x + Math.cos(snake.angle - 0.6) * offset;
        const y2 = snake.head.y + Math.sin(snake.angle - 0.6) * offset;
        ctx.beginPath(); ctx.arc(x1, y1, 3, 0, Math.PI * 2); ctx.arc(x2, y2, 3, 0, Math.PI * 2); ctx.fill();
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
            } else if (e.type === 'TAIL_SHATTER') {
                // 總時長 2秒：停滯 1秒，消逝 1秒 (v3.2.5)
                const fadeTime = 1.0;
                let visibleCount = e.points.length;
                let alpha = 0.6;
                let sizeScale = 1.0;

                if (e.life < fadeTime) {
                    const progress = e.life / fadeTime; // 1.0 -> 0.0
                    // 從末端開始消逝 (points 最後面是尾尖)
                    visibleCount = Math.floor(e.points.length * progress);
                    alpha = 0.6 * progress;
                    sizeScale = progress;
                }

                ctx.globalAlpha = alpha;
                ctx.fillStyle = e.color;
                for (let i = 0; i < visibleCount; i++) {
                    if (i % 2 === 0) {
                        const p = e.points[i];
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, 8 * sizeScale, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                ctx.globalAlpha = 1.0;
            } else if (e.type === 'INK_CLOUD') {
                const alpha = Math.min(1, e.life);
                // 高飽和霓虹紫色 (v3.3.8)
                const isPlayer = e.ownerId === 'player';
                const baseColor = isPlayer ? 'rgba(191, 0, 255, ' : 'rgba(75, 0, 130, '; // Electric Purple vs Indigo

                ctx.fillStyle = baseColor + (alpha * 0.7) + ')';

                // 繪製墨漬
                for (let j = 0; j < 5; j++) {
                    const offsetX = Math.cos(j * 1.25) * (e.radius * 0.4);
                    const offsetY = Math.sin(j * 1.25) * (e.radius * 0.4);
                    const r = e.radius * (0.7 + Math.sin(Date.now() * 0.004 + j) * 0.15);
                    ctx.beginPath();
                    ctx.arc(e.x + offsetX, e.y + offsetY, r, 0, Math.PI * 2);
                    ctx.fill();
                }

                // 中心核心 (玩家的有發光感)
                if (isPlayer) {
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = '#BF00FF';
                    ctx.fillStyle = `rgba(224, 102, 255, ${alpha * 0.9})`; // Lighter Purple
                } else {
                    ctx.fillStyle = `rgba(40, 0, 80, ${alpha * 0.8})`;
                }

                ctx.beginPath();
                ctx.arc(e.x, e.y, e.radius * 0.6, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            } else {
                ctx.globalAlpha = e.life * 1.5; ctx.fillStyle = e.color;
                ctx.beginPath(); ctx.arc(e.x, e.y, 3, 0, Math.PI * 2); ctx.fill();
                if (e.vx) e.x += e.vx;
                if (e.vy) e.y += e.vy;
            }
        });
        ctx.globalAlpha = 1.0;
    }

    drawInkOverlay(time) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.save();
        const grad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, 350);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();    }

    drawLeaderMarker(state, leader) {
        const { player } = state;
        
        // 如果第一名是玩家自己，或者場上沒有其他蛇，就不顯示 (v3.6.3 強化判定)
        if (!leader || leader.id === player.id || (leader.isDead && !leader.deathPos)) return;

        const ctx = this.ctx;
        const dpr = window.devicePixelRatio || 1;
        const w = this.canvas.width / dpr;
        const h = this.canvas.height / dpr;

        // 目標位置：存活則跟隨頭部，死亡則指向屍體 (v3.6.1)
        const targetX = leader.isDead ? (leader.deathPos?.x || leader.head.x) : leader.head.x;
        const targetY = leader.isDead ? (leader.deathPos?.y || leader.head.y) : leader.head.y;

        // 計算向量（相對於螢幕中心/玩家位置）
        const dx = (targetX - player.head.x) * this.camera.zoom;
        const dy = (targetY - player.head.y) * this.camera.zoom;
        
        // 判斷是否在螢幕外
        const margin = 40;
        const halfW = w / 2 - margin;
        const halfH = h / 2 - margin;

        if (Math.abs(dx) < halfW && Math.abs(dy) < halfH) return;

        // 計算與螢幕邊緣的交點 (Ray-Box Intersection)
        const scale = Math.min(halfW / Math.abs(dx), halfH / Math.abs(dy));
        const edgeX = w / 2 + dx * scale;
        const edgeY = h / 2 + dy * scale;

        // 渲染標記
        ctx.save();
        ctx.translate(edgeX, edgeY);

        // 霓虹發光背景 (v3.6.6: 縮小 50%)
        ctx.shadowBlur = 15;
        ctx.shadowColor = leader.isDead ? '#FF0000' : '#FFD700';
        ctx.fillStyle = '#FFFFFF'; 
        ctx.beginPath();
        ctx.arc(0, 0, 17, 0, Math.PI * 2); // 33 -> 17
        ctx.fill();

        // 皇冠或骷髏圖標 (v3.6.6: 縮小 50%)
        ctx.font = '18px Arial'; // 36 -> 18
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(leader.isDead ? '💀' : '👑', 0, -2);

        // 距離顯示 (v3.6.6: 縮小 50%)
        const dist = Math.floor(Math.sqrt((targetX - player.head.x)**2 + (targetY - player.head.y)**2));
        ctx.font = 'bold 10px Arial'; // 18 -> 10
        ctx.fillStyle = leader.isDead ? '#FF0000' : '#D4AF37'; 
        ctx.fillText(`${dist}m`, 0, 16); // 上移

        ctx.restore();
    }
}
