export class InputHandler {
    constructor() {
        this.base = document.getElementById('joystick-base');
        this.handle = document.getElementById('joystick-handle');
        
        this.angle = 0;
        this.isMoving = false;
        this.isDashing = false;
        this.distanceRatio = 0; // 0 to 1+
        
        this.keys = { w: false, a: false, s: false, d: false, '1': false, shift: false };
        
        this.initJoystick();
        this.initKeyboard();
    }

    initJoystick() {
        const handleMove = (e) => {
            const touch = e.touches ? e.touches[0] : e;
            const rect = this.base.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const dx = touch.clientX - centerX;
            const dy = touch.clientY - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = rect.width / 2;
            
            this.angle = Math.atan2(dy, dx);
            
            // 阻力邏輯：超過半徑後，移動感降低為 30%
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
            this.handle.style.transform = 'translate(-50%, -50%)';
            this.isMoving = false;
            this.distanceRatio = 0;
            this.updateDashState();
        };

        this.base.addEventListener('touchstart', (e) => { e.preventDefault(); handleMove(e); }, { passive: false });
        this.base.addEventListener('touchmove', (e) => { e.preventDefault(); handleMove(e); }, { passive: false });
        this.base.addEventListener('touchend', handleEnd);
        
        // Mouse support
        this.base.addEventListener('mousedown', (e) => {
            this.isMouseDown = true;
            handleMove(e);
            const onMove = (me) => this.isMouseDown && handleMove(me);
            const onUp = () => { this.isMouseDown = false; handleEnd(); window.removeEventListener('mousemove', onMove); };
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
        });
    }

    initKeyboard() {
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
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
        const joyDash = this.distanceRatio > 1.4;
        const keyDash = this.keys['1'] || this.keys.shift;
        this.isDashing = joyDash || keyDash;
        
        // Visual feedback
        if (this.isDashing && joyDash) {
            this.handle.style.background = 'var(--neon-pink)';
            this.handle.style.boxShadow = '0 0 20px var(--neon-pink)';
        } else {
            this.handle.style.background = '#fff';
            this.handle.style.boxShadow = '0 0 15px rgba(255,255,255,0.3)';
        }
    }
}
