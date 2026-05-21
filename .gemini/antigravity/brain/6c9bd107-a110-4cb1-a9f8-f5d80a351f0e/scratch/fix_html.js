const fs = require('fs');

const filePath = 'C:\\Users\\fanchunkao\\Documents\\Antigravity\\snake.io\\presentation_v5.2.0\\index.html';
console.log("Reading file:", filePath);

let content = fs.readFileSync(filePath, 'utf8');

const slide12Index = content.indexOf('<!-- Slide 12:');
const slide13Index = content.indexOf('<!-- Slide 13:');

if (slide12Index !== -1 && slide13Index !== -1) {
    console.log("Found original block.");
    
    const newBlock = `<!-- Slide 12: 3. 參考競品 (3/3)：Snake Merge -->
        <section class="slide-container" data-slide="12">
            <div class="slide-left" style="width: 45%; padding: 40px 50px; justify-content: center; gap: 15px;">
                <span class="slide-page-num">Page 12</span>
                <h2 class="slide-title" style="font-size: 2.1rem; margin-bottom: 5px;">3. 參考競品 (3/3)：Snake Merge</h2>
                <div class="competitor-card snake-merge"
                    style="display: flex; flex-direction: column; gap: 15px; padding: 25px; background: var(--bg-pearl); border-radius: 20px; border-left: 6px solid var(--coin-yellow);">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <img src="SnakeMerge_AppIcon.jpg" alt="Snake Merge Icon"
                            style="width: 80px; height: 80px; border-radius: 16px; object-fit: contain;">
                        <div>
                            <h3 style="font-size: 1.5rem; color: var(--text-dark);">Snake Merge</h3>
                            <span class="competitor-tag yellow" style="margin-top: 5px; display: inline-block;">Google
                                Play 5000萬+ 下載</span>
                        </div>
                    </div>
                    <p style="font-size: 1rem; color: var(--text-muted); line-height: 1.6;">
                        融合了合成養成 (Merge) 與輕競技玩法。玩家可在局外透過合成系統解鎖多種獨特外觀，並在局內享受完全剝離數值、絕對公平的競技對抗。透過局外的長線合成與局內的高頻滿足，成功創造出極具成癮性的複合玩法體驗。
                    </p>
                </div>
            </div>
            <div class="slide-right"
                style="width: 55%; padding: 30px; display: flex; align-items: center; justify-content: center;">
                <div class="illustration-card" style="width: 100%; height: 100%;">
                    <div class="illustration-header"><span>📺</span> Snake Merge 實機展示</div>
                    <div class="illustration-body" style="padding: 0; background: black;">
                        <video class="real-image" autoplay muted loop playsinline
                            style="object-fit: contain; width: 100%; height: 100%;">
                            <source src="SnakeMerge_Demo.mp4" type="video/mp4">
                        </video>
                    </div>
                </div>
            </div>
        </section>
        `;
        
    content = content.substring(0, slide12Index) + newBlock + content.substring(slide13Index);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Successfully replaced the block and wrote to file!");
} else {
    console.log("Error: could not find Slide 12 or Slide 13 in HTML!");
}
