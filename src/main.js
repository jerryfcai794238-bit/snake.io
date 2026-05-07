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
        
        // Initial UI
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
        this.game.isGameOver = false; // Reset state!
        document.getElementById('lobby').classList.remove('hidden');
        document.getElementById('hud-top').classList.add('hidden');
        document.getElementById('hud-bottom').classList.add('hidden');
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('best-score').innerText = this.game.bestScore;
    }

    loop(timestamp) {
        let dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        if (dt > 0.1) dt = 0.016; // Cap DT to prevent spikes

        if (this.game.isPlaying && !this.game.isGameOver) {
            this.game.update(this.input, dt);
            this.updateHUD();
        }

        const state = {
            player: this.game.player,
            snakes: this.game.snakes.filter(s => !s.isDead),
            food: this.game.food,
            orbs: this.game.energyOrbs,
            stones: this.game.stones,
            terrains: this.game.terrains,
            effects: this.game.effects
        };
        
        if (this.game.player) {
            this.renderer.render(state);
        }

        // Corrected check: only trigger ONCE when game over happens
        const gameOverDiv = document.getElementById('game-over');
        if (this.game.isGameOver && gameOverDiv.classList.contains('hidden')) {
            gameOverDiv.classList.remove('hidden');
            document.getElementById('final-score').innerText = Math.floor(this.game.player.length - 50);
        }

        requestAnimationFrame((t) => this.loop(t));
    }

    updateHUD() {
        const p = this.game.player;
        document.getElementById('current-length').innerText = Math.max(0, Math.floor(p.length - 50));
        
        // Leaderboard
        const sortedSnakes = [...this.game.snakes]
            .filter(s => !s.isDead)
            .sort((a, b) => b.length - a.length);
            
        const lbHtml = sortedSnakes.map((s, i) => `
            <div class="lb-item ${s.id === 'player' ? 'player' : 'ai'}">
                <span>${i+1}. ${s.name}</span>
                <span>${Math.max(0, Math.floor(s.length - 50))}</span>
            </div>
        `).join('');
        document.getElementById('leaderboard').innerHTML = lbHtml;

        const m = Math.floor(this.game.timer / 60);
        const s = this.game.timer % 60;
        document.getElementById('timer').innerText = `${m}:${s.toString().padStart(2, '0')}`;
        
        const bar = document.getElementById('energy-fill');
        const container = document.getElementById('energy-container');
        bar.style.width = `${p.energy}%`;
        
        if (p.isDashing) container.classList.add('dashing');
        else container.classList.remove('dashing');
        
        if (p.energy < 10) container.style.borderColor = 'rgba(255,0,0,0.5)';
        else container.style.borderColor = 'rgba(255,255,255,0.05)';
    }
}

window.addEventListener('load', () => new Main());
