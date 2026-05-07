import { CONFIG } from './constants.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.camera = { x: 0, y: 0, zoom: 1 };
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.canvas.parentElement.offsetWidth;
        this.canvas.height = this.canvas.parentElement.offsetHeight;
    }

    render(state) {
        const { player, snakes, food, orbs, stones, terrains, effects } = state;
        const ctx = this.ctx;
        
        // Camera Update (Fixed Zoom)
        this.camera.x = player.head.x;
        this.camera.y = player.head.y;
        this.camera.zoom = 0.85;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.save();
        ctx.translate(this.canvas.width/2, this.canvas.height/2);
        ctx.scale(this.camera.zoom, this.camera.zoom);
        ctx.translate(-this.camera.x, -this.camera.y);

        this.drawTerrains(terrains);
        this.drawGrid();
        this.drawStones(stones);
        this.drawResources(food, orbs);
        this.drawEffects(effects);
        
        snakes.forEach(s => this.drawSnake(s));

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
        ctx.strokeStyle = 'darkred'; ctx.lineWidth = 15;
        ctx.strokeRect(-CONFIG.WORLD_SIZE/2, -CONFIG.WORLD_SIZE/2, CONFIG.WORLD_SIZE, CONFIG.WORLD_SIZE);
    }

    drawTerrains(terrains) {
        const ctx = this.ctx;
        terrains.forEach(t => {
            ctx.fillStyle = t.type === 'river' ? 'rgba(0,120,255,0.15)' : 'rgba(200,240,255,0.1)';
            ctx.beginPath();
            ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = t.type === 'river' ? 'rgba(0,180,255,0.3)' : 'rgba(255,255,255,0.2)';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }

    drawStones(stones) {
        const ctx = this.ctx;
        stones.forEach(s => {
            ctx.fillStyle = CONFIG.COLORS.STONE;
            ctx.beginPath(); ctx.arc(s.x, s.y, s.radius, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#444'; ctx.lineWidth = 3; ctx.stroke();
        });
    }

    drawResources(food, orbs) {
        const ctx = this.ctx;
        food.forEach(f => {
            // Unified Neon Gold (#ffcc00) for all food
            ctx.fillStyle = '#ffcc00';
            if (f.value > 1) {
                ctx.shadowBlur = 10; ctx.shadowColor = '#ffcc00';
            }
            ctx.beginPath(); ctx.arc(f.x, f.y, f.size, 0, Math.PI*2); ctx.fill();
            ctx.shadowBlur = 0;
        });
        orbs.forEach(o => {
            ctx.fillStyle = CONFIG.COLORS.ENERGY; ctx.shadowBlur = 10; ctx.shadowColor = CONFIG.COLORS.ENERGY;
            ctx.beginPath(); ctx.arc(o.x, o.y, o.size + Math.sin(Date.now()/200)*2, 0, Math.PI*2); ctx.fill();
            ctx.shadowBlur = 0;
        });
    }

    drawSnake(snake) {
        if (snake.isDead || snake.points.length < 2) return;
        const ctx = this.ctx;
        ctx.save();
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.lineWidth = snake.radius * 2; ctx.strokeStyle = snake.color;
        if (snake.isDashing) { ctx.shadowBlur = 20; ctx.shadowColor = snake.color; ctx.lineWidth *= 1.1; }
        
        ctx.beginPath();
        ctx.moveTo(snake.points[0].x, snake.points[0].y);
        for(let i = 1; i < snake.points.length; i++) ctx.lineTo(snake.points[i].x, snake.points[i].y);
        ctx.stroke();

        // Head
        ctx.fillStyle = '#fff'; ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.arc(snake.head.x, snake.head.y, snake.radius, 0, Math.PI*2); ctx.fill();
        
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

    drawEffects(effects) {
        const ctx = this.ctx;
        effects.forEach(e => {
            ctx.globalAlpha = e.life * 1.5; ctx.fillStyle = e.color;
            ctx.beginPath(); ctx.arc(e.x, e.y, 3, 0, Math.PI*2); ctx.fill();
            e.x += e.vx; e.y += e.vy;
        });
        ctx.globalAlpha = 1.0;
    }
}
