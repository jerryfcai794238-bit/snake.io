export class InputHandler {
    constructor() {
        this.zone = document.getElementById('joystick-zone');
        this.base = document.getElementById('joystick-base');
        this.handle = document.getElementById('joystick-handle');
        
        this.angle = 0;
        this.isMoving = false;
        this.isDashing = false;
        this.distanceRatio = 0; 
        
        this.centerX = 0;
        this.centerY = 0;
        
        this.keys = { w: false, a: false, s: false, d: false, '1': false, shift: false };
        
        this.initJoystick();
        this.initKeyboard();
    }

    initJoystick() {
        const handleStart = (e) => {
            const touch = e.touches ? e.touches[0] : e;
            const rect = this.zone.getBoundingClientRect();
            
            // 記錄起始點作為中心 (相對於容器內部)
            this.centerX = touch.clientX - rect.left;
            this.centerY = touch.clientY - rect.top;
            
            // 定位底座並顯示
            this.base.style.display = 'block';
            this.base.style.left = `${this.centerX - 90}px`;
            this.base.style.top = `${this.centerY - 90}px`;
            
            // handleMove 也需要統一的座標系，所以我們傳入修正後的座標
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
            const radius = 90; // 固定半徑 (180/2)
            
            this.angle = Math.atan2(dy, dx);
            
            // 阻力邏輯
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

        this.zone.addEventListener('touchstart', (e) => { e.preventDefault(); handleStart(e); }, { passive: false });
        this.zone.addEventListener('touchmove', (e) => { e.preventDefault(); handleMove(e); }, { passive: false });
        this.zone.addEventListener('touchend', handleEnd);
        
        this.zone.addEventListener('mousedown', (e) => {
            this.isMouseDown = true;
            handleStart(e);
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
