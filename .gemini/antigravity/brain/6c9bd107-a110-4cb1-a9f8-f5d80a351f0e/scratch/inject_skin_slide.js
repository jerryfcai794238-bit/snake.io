const fs = require('fs');

const filePath = 'C:\\Users\\fanchunkao\\Documents\\Antigravity\\snake.io\\presentation_v5.2.0\\index.html';
let html = fs.readFileSync(filePath, 'utf8');

// 1. 先把 Slide 19, 20, 21 往後推成 20, 21, 22
for (let i = 21; i >= 19; i--) {
    html = html.replace(new RegExp(`data-slide="${i}"`, 'g'), `data-slide="${i + 1}"`);
    html = html.replace(`<!-- Slide ${i}:`, `<!-- Slide ${i + 1}:`);
    html = html.replace(new RegExp(`Page ${i}([^0-9])`, 'g'), `Page ${i + 1}$1`);
}

// 2. 更新 totalSlides
html = html.replace('const totalSlides = 21;', 'const totalSlides = 22;');

// 3. 新 Slide 19 插入在 <!-- Slide 20: 主題過渡頁 - 7 --> 之前
const newSlide = `        <!-- Slide 19: 6. 金流回收方式 (2/2)：Skin 系統 -->
        <section class="slide-container" data-slide="19">
            <div class="slide-left" style="width: 50%; padding: 40px 50px; justify-content: center; gap: 18px;">
                <span class="slide-page-num">Page 19</span>
                <h2 class="slide-title" style="font-size: 2.1rem; margin-bottom: 5px;">6. 金流回收方式 (2/2)：Skin 系統</h2>

                <div style="background: var(--bg-pearl); padding: 20px; border-radius: 16px; border-left: 6px solid var(--coin-yellow); box-shadow: var(--inset-shadow);">
                    <h3 style="font-size: 1.15rem; margin-bottom: 8px; color: var(--text-dark);">🐍 個性化外觀 (Skin) 系統</h3>
                    <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">
                        提供多種獨特的 3D 黏土風格蛇身皮膚，包含特色拖尾特效與擊殺爆炸動畫，讓每位玩家都能展現個人風格。
                    </p>
                </div>

                <div style="background: var(--bg-pearl); padding: 20px; border-radius: 16px; border-left: 6px solid var(--yoshi-green); box-shadow: var(--inset-shadow);">
                    <h3 style="font-size: 1.15rem; margin-bottom: 12px; color: var(--text-dark);">🎁 Skin 獲取管道</h3>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <div style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: white; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.06);">
                            <span style="font-size: 1.4rem;">🏆</span>
                            <div>
                                <div style="font-size: 0.9rem; font-weight: 700; color: var(--text-dark);">里程碑贈送</div>
                                <div style="font-size: 0.8rem; color: var(--text-muted);">成長之路里程碑達成，免費解鎖限定外觀</div>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: white; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.06);">
                            <span style="font-size: 1.4rem;">⚔️</span>
                            <div>
                                <div style="font-size: 0.9rem; font-weight: 700; color: var(--text-dark);">局內獎勵</div>
                                <div style="font-size: 0.8rem; color: var(--text-muted);">完成局內挑戰任務，獲取限定皮膚碎片</div>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: white; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.06);">
                            <span style="font-size: 1.4rem;">🪙</span>
                            <div>
                                <div style="font-size: 0.9rem; font-weight: 700; color: var(--text-dark);">局外金幣商店兌換</div>
                                <div style="font-size: 0.8rem; color: var(--text-muted);">溢出金幣直接回收，建立長線穩定金流</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="slide-right" style="width: 50%; padding: 30px; display: flex; align-items: center; justify-content: center;">
                <div class="illustration-card" style="width: 100%; height: 100%;">
                    <div class="illustration-header"><span>🎨</span> Skin 系統實機展示</div>
                    <div class="illustration-body" style="padding: 0; background: black;">
                        <video class="real-image" autoplay muted loop playsinline
                            style="object-fit: contain; width: 100%; height: 100%;">
                            <source src="skin系統.mp4" type="video/mp4">
                        </video>
                    </div>
                </div>
            </div>
        </section>

`;

// 插入在 <!-- Slide 20: 主題過渡頁 - 7 --> 之前
html = html.replace('        <!-- Slide 20: 主題過渡頁 - 7 -->', newSlide + '        <!-- Slide 20: 主題過渡頁 - 7 -->');

fs.writeFileSync(filePath, html, 'utf8');
console.log('Done! Slide 19 (Skin 系統) inserted.');
