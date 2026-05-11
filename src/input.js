export class InputHandler {
    constructor(game) {
        this.game = game;
        this.zone = document.getElementById('joystick-zone');
        this.base = document.getElementById('joystick-base');
        this.handle = document.getElementById('joystick-handle');
        this.dashBtn = document.getElementById('dash-btn');
        
        this.angle = 0;
        this.isMoving = false;
        this.isDashing = false;
        this.isDashButtonPressed = false;
        this.distanceRatio = 0; 
        
        this.centerX = 0;
        this.centerY = 0;
        
        this.keys = { w: false, a: false, s: false, d: false, '1': false, shift: false };
        
        this.initJoystick();
        this.initDashButton();
        this.initKeyboard();
    }

    initJoystick() {
        const handleStart = (e) => {
            if (e.target.closest('#dash-btn')) return;

            const touch = e.touches ? e.touches[0] : e;
            const rect = this.zone.getBoundingClientRect();
            
            this.centerX = touch.clientX - rect.left;
            this.centerY = touch.clientY - rect.top;
            
            this.base.style.display = 'block';
            this.base.style.left = `${this.centerX - 50}px`;
            this.base.style.top = `${this.centerY - 50}px`;
            
            handleMove(e);
        };

        const handleMove = (e) => {
            if (!this.isMoving && !this.isMouseDown && (!e.touches || e.touches.length === 0)) return;
            
            const touch = e.touches ? e.touches[0] : e;
            const rect = this.zone.getBoundingClientRect();
            const currentX = touch.clientX - rect.left;
            const currentY = touch.clientY - rect.top;

            const dx = currentX - this.centerX;
            const dy = currentY - this.centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = 50;
            
            this.angle = Math.atan2(dy, dx);
            
            let visualDist;
            if (dist <= radius) {
                visualDist = dist;
            } else {
                visualDist = radius + (dist - radius) * 0.3;
            }
            
            this.distanceRatio = dist / radius;
            this.isMoving = dist > 5;
            
            const moveX = Math.cos(this.angle) * visualDist;
            const moveY = Math.sin(this.angle) * visualDist;
            this.handle.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
            
            this.updateDashState();
        };

        const handleEnd = () => {
            this.base.style.display = 'none';
            this.handle.style.transform = 'translate(-50%, -50%)';
            this.isMoving = false;
            this.distanceRatio = 0;
            this.updateDashState();
        };

        this.zone.addEventListener('touchstart', (e) => { 
            if (e.target.closest('#dash-btn')) return;
            e.preventDefault(); 
            handleStart(e); 
        }, { passive: false });
        this.zone.addEventListener('touchmove', (e) => { 
            if (e.target.closest('#dash-btn')) return;
            e.preventDefault(); 
            handleMove(e); 
        }, { passive: false });
        this.zone.addEventListener('touchend', (e) => {
            if (e.target.closest('#dash-btn')) return;
            handleEnd();
        });
        
        this.zone.addEventListener('mousedown', (e) => {
            if (e.target.closest('#dash-btn')) return;
            this.isMouseDown = true;
            handleStart(e);
            const onMove = (me) => this.isMouseDown && handleMove(me);
            const onUp = () => { this.isMouseDown = false; handleEnd(); window.removeEventListener('mousemove', onMove); };
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
        });
    }

    initDashButton() {
        const startDash = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.isDashButtonPressed = true;
            this.dashBtn.classList.add('active');
            this.updateDashState();
        };
        const endDash = (e) => {
            this.isDashButtonPressed = false;
            this.dashBtn.classList.remove('active');
            this.updateDashState();
        };

        this.dashBtn.addEventListener('touchstart', startDash, { passive: false });
        this.dashBtn.addEventListener('touchend', endDash);
        this.dashBtn.addEventListener('mousedown', startDash);
        this.dashBtn.addEventListener('mouseup', endDash);
        this.dashBtn.addEventListener('mouseleave', endDash);

        // Magnet Skill (v2.9.0)
        const magnetBtn = document.getElementById('magnet-btn');
        const triggerMagnet = (e) => {
            if (e) e.preventDefault();
            const p = this.game.player;
            if (p && p.magnetCooldown <= 0) {
                p.isMagnetActive = true;
                p.magnetTime = 10;
                p.magnetCooldown = 30;
            }
        };
        magnetBtn.addEventListener('touchstart', triggerMagnet, { passive: false });
        magnetBtn.addEventListener('mousedown', triggerMagnet);
    }

    initKeyboard() {
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            
            // 磁鐵技能快捷鍵 (v2.9.1)
            if (key === '2' || key === 'e') {
                const p = this.game.player;
                if (p && p.magnetCooldown <= 0) {
                    p.isMagnetActive = true;
                    p.magnetTime = 10;
                    p.magnetCooldown = 30;
                }
            }

            if (this.keys.hasOwnProperty(key)) {
                this.keys[key] = true;
                this.updateKeyboardInput();
            }
        });
        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (this.keys.hasOwnProperty(key)) {
                this.keys[key] = false;
                this.updateKeyboardInput();
            }
        });
    }

    updateKeyboardInput() {
        let vx = 0, vy = 0;
        if (this.keys.w) vy -= 1;
        if (this.keys.s) vy += 1;
        if (this.keys.a) vx -= 1;
        if (this.keys.d) vx += 1;

        if (vx !== 0 || vy !== 0) {
            this.angle = Math.atan2(vy, vx);
            this.isMoving = true;
        } else {
            this.isMoving = false;
        }
        this.updateDashState();
    }

    updateDashState() {
        const keyDash = this.keys['1'] || this.keys.shift;
        this.isDashing = this.isDashButtonPressed || keyDash;
        
        if (this.isDashing) {
            this.handle.style.background = 'var(--neon-pink)';
            this.handle.style.boxShadow = '0 0 20px var(--neon-pink)';
        } else {
            this.handle.style.background = '#fff';
            this.handle.style.boxShadow = '0 0 15px rgba(255,255,255,0.3)';
        }
    }
}
