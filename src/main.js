import { Game } from './game.js';
import { Renderer } from './renderer.js';
import { InputHandler } from './input.js';

class Main {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.game = new Game();
        this.renderer = new Renderer(this.canvas);
        this.input = new InputHandler();
        this.lastTime = performance.now();
        this.initEvents();
        document.getElementById('best-score').innerText = this.game.bestScore;
        this.loop(performance.now());
    }

    initEvents() {
        document.getElementById('btn-mode-solo').addEventListener('click', () => this.startGame('solo'));
        document.getElementById('btn-mode-duel').addEventListener('click', () => this.startGame('duel'));
        document.getElementById('btn-restart').addEventListener('click', () => this.startGame(this.game.mode));
        document.getElementById('btn-exit').addEventListener('click', () => this.backToLobby());
    }

    startGame(mode) {
        this.game.init();
        this.game.start(mode);
        this.lastTime = performance.now();
        document.getElementById('lobby').classList.add('hidden');
        document.getElementById('hud-top').classList.remove('hidden');
        document.getElementById('hud-bottom').classList.remove('hidden');
        document.getElementById('game-over').classList.add('hidden');
    }

    backToLobby() {
        this.game.isPlaying = false;
        this.game.isGameOver = false;
        document.getElementById('lobby').classList.remove('hidden');
        document.getElementById('hud-top').classList.add('hidden');
        document.getElementById('hud-bottom').classList.add('hidden');
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('best-score').innerText = this.game.bestScore;
    }

    loop(timestamp) {
        let dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        if (dt > 0.1) dt = 0.016;
        if (this.game.isPlaying && !this.game.isGameOver) {
            this.game.update(this.input, dt);
            this.updateHUD();
        }
        const state = {
            player: this.game.player,
            snakes: this.game.snakes,
            food: this.game.food,
            stones: this.game.stones,
            terrains: this.game.terrains,
            effects: this.game.effects
        };
        if (this.game.player) this.renderer.render(state);

        const gameOverDiv = document.getElementById('game-over');
        if (this.game.isGameOver && gameOverDiv.classList.contains('hidden')) {
            this.populateSettlement();
            gameOverDiv.classList.remove('hidden');
        }
        requestAnimationFrame((t) => this.loop(t));
    }

    updateHUD() {
        const p = this.game.player;
        document.getElementById('current-length').innerText = Math.floor(p.length);
        document.getElementById('total-score').innerText = Math.floor(p.totalEaten);
        const m = Math.floor(this.game.timer / 60);
        const s = this.game.timer % 60;
        document.getElementById('timer').innerText = `${m}:${s.toString().padStart(2, '0')}`;
        
        const sorted = [...this.game.snakes].sort((a, b) => b.totalEaten - a.totalEaten);
        const lbHtml = sorted.map((s, i) => `
            <div class="lb-item ${s.id === 'player' ? 'player' : 'ai'}">
                <span>${i+1}. ${s.name}</span>
                <span>${Math.floor(s.totalEaten)}</span>
            </div>
        `).join('');
        document.getElementById('leaderboard').innerHTML = lbHtml;

        const overlay = document.getElementById('respawn-overlay');
        const respawnData = this.game.respawnQueue.find(item => item.snake === p);
        if (respawnData) {
            overlay.classList.remove('hidden');
            document.getElementById('respawn-sec').innerText = Math.ceil(respawnData.time / 1000);
        } else { overlay.classList.add('hidden'); }
    }

    populateSettlement() {
        const player = this.game.player;
        const bot = this.game.snakes.find(s => s.id === 'ai') || { kills: 0, cuts: 0, deaths: 0, totalEaten: 0, maxLength: 0, totalDashTime: 0 };
        
        const isVictory = player.totalEaten >= bot.totalEaten;
        const title = document.getElementById('game-over-title');
        title.innerText = isVictory ? 'VICTORY' : 'DEFEAT';
        title.style.color = isVictory ? 'var(--neon-gold)' : 'var(--neon-pink)';

        const stats = [
            { label: 'TOTAL SCORE', p: Math.floor(player.totalEaten), b: Math.floor(bot.totalEaten) },
            { label: 'KILLS', p: player.kills, b: bot.kills },
            { label: 'CUTS', p: player.cuts, b: bot.cuts },
            { label: 'DEATHS', p: player.deaths, b: bot.deaths, inverse: true },
            { label: 'MAX LENGTH', p: Math.floor(player.maxLength), b: Math.floor(bot.maxLength) },
            { label: 'DASH TIME (S)', p: player.totalDashTime.toFixed(1), b: bot.totalDashTime.toFixed(1) }
        ];

        const html = stats.map(s => {
            const pWin = s.inverse ? parseFloat(s.p) < parseFloat(s.b) : parseFloat(s.p) > parseFloat(s.b);
            const bWin = s.inverse ? parseFloat(s.b) < parseFloat(s.p) : parseFloat(s.b) > parseFloat(s.p);
            return `
                <tr>
                    <td>${s.label}</td>
                    <td><div class="val-you ${pWin ? 'winner' : ''}">${s.p}</div></td>
                    <td><div class="val-bot ${bWin ? 'winner' : ''}">${s.b}</div></td>
                </tr>
            `;
        }).join('');
        document.getElementById('settlement-stats').innerHTML = html;
    }
}

window.addEventListener('load', () => new Main());
