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
            snakes: this.game.snakes.filter(s => !s.isDead),
            food: this.game.food,
            stones: this.game.stones,
            terrains: this.game.terrains,
            effects: this.game.effects
        };
        
        if (this.game.player) {
            this.renderer.render(state);
        }

        const gameOverDiv = document.getElementById('game-over');
        if (this.game.isGameOver && gameOverDiv.classList.contains('hidden')) {
            const title = document.getElementById('game-over-title');
            title.innerText = 'MATCH OVER';
            title.style.color = 'var(--neon-gold)';

            document.getElementById('stat-score').innerText = Math.floor(this.game.player.totalEaten);
            document.getElementById('stat-length').innerText = Math.floor(this.game.player.length);
            
            const duration = 90 - this.game.timer; 
            const mins = Math.floor(duration / 60).toString().padStart(2, '0');
            const secs = (duration % 60).toString().padStart(2, '0');
            document.getElementById('stat-time').innerText = `${mins}:${secs}`;
            
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
        
        // Respawn Overlay
        const overlay = document.getElementById('respawn-overlay');
        const respawnData = this.game.respawnQueue.find(item => item.snake === p);
        if (respawnData) {
            overlay.classList.remove('hidden');
            document.getElementById('respawn-sec').innerText = Math.ceil(respawnData.time / 1000);
        } else {
            overlay.classList.add('hidden');
        }
    }
}

window.addEventListener('load', () => new Main());
