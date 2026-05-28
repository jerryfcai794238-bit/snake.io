const fs = require('fs');

let html = fs.readFileSync('presentation_v5.0.0/index.html', 'utf8');

// 1. Shift slides from 13 down to 3
for (let i = 13; i >= 3; i--) {
    // Shift data-slide="i" to data-slide="i+1"
    html = html.replace(new RegExp(`data-slide="${i}"`, 'g'), `data-slide="${i+1}"`);
    // Shift Page i (zero padded)
    const oldPage = `Page ${i.toString().padStart(2, '0')}`;
    const newPage = `Page ${(i+1).toString().padStart(2, '0')}`;
    html = html.replace(new RegExp(oldPage, 'g'), newPage);
    // Shift Slide i
    html = html.replace(new RegExp(`Slide ${i}:`, 'g'), `Slide ${i+1}:`);
}

// 2. Update totalSlides
html = html.replace('const totalSlides = 13;', 'const totalSlides = 14;');

// 3. Inject new slide 3 before <!-- Slide 4:
const newSlideContent = `        <!-- Slide 3: 競品市場下載數據分析 -->
        <section class="slide-container" data-slide="3" style="flex-direction: column; padding: 40px 60px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <span class="slide-page-num" style="justify-content: center;">Page 03</span>
                <h2 class="slide-title">競品市場下載數據分析</h2>
                <p class="slide-subtitle">主流休閒 .io 龐大的用戶基數潛力</p>
            </div>
            <div style="display: flex; gap: 30px; height: 100%; align-items: stretch; justify-content: center; margin-top: 20px;">
                <div style="flex: 1; display: flex; flex-direction: column; gap: 15px; background: rgba(230,0,18,0.05); border-left: 5px solid var(--nintendo-red); padding: 25px 30px; border-radius: 16px; box-shadow: var(--card-shadow); justify-content: center;">
                    <h3 style="font-size: 1.6rem; color: var(--nintendo-red); margin-bottom: 10px; font-weight: 800;">Snake.io (Kooapps)</h3>
                    <div style="font-size: 1.25rem; margin-bottom: 15px; font-weight: 700; color: var(--text-dark);">
                        雙平台累計下載：<span style="font-size: 1.6rem; color: var(--nintendo-red);">5 億 ~ 6 億+</span>
                    </div>
                    <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin: 0;">
                        Android 單一平台突破 5 億+ 下載，為該品類最龐大用戶基數產品。iOS 長期穩居動作與街機分類榜單前列。
                    </p>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; gap: 15px; background: rgba(60,208,112,0.05); border-left: 5px solid var(--yoshi-green); padding: 25px 30px; border-radius: 16px; box-shadow: var(--card-shadow); justify-content: center;">
                    <h3 style="font-size: 1.6rem; color: var(--yoshi-green); margin-bottom: 10px; font-weight: 800;">Snake Clash! (Supercent)</h3>
                    <div style="font-size: 1.25rem; margin-bottom: 15px; font-weight: 700; color: var(--text-dark);">
                        雙平台累計下載：<span style="font-size: 1.6rem; color: var(--yoshi-green);">1.1 億 ~ 1.3 億</span>
                    </div>
                    <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin: 0;">
                        超休閒巨頭 2023 年中力作。Android 衝破 1 億+，iOS 貢獻約 2000 萬次。單月仍維持數百萬全球增量。
                    </p>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; gap: 15px; background: rgba(255,208,0,0.05); border-left: 5px solid var(--coin-yellow); padding: 25px 30px; border-radius: 16px; box-shadow: var(--card-shadow); justify-content: center;">
                    <h3 style="font-size: 1.6rem; color: var(--coin-yellow); margin-bottom: 10px; font-weight: 800;">Snake Merge (Hippo Lab)</h3>
                    <div style="font-size: 1.25rem; margin-bottom: 15px; font-weight: 700; color: var(--text-dark);">
                        雙平台累計下載：<span style="font-size: 1.6rem; color: var(--coin-yellow);">5200 萬 ~ 5500 萬</span>
                    </div>
                    <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin: 0;">
                        複合玩法的代表作（Merge 養成 + .io 競技）。下載主力在 Android（5000 萬+），證明了養成吸量策略的成功。
                    </p>
                </div>
            </div>
            <div style="text-align: center; margin-top: 30px; font-size: 0.85rem; color: var(--text-muted);">
                數據來源：App Store / Google Play 官方公開分級，以及 Sensor Tower 與 AppMagic 行動市場情報推估。
            </div>
        </section>

`;

html = html.replace('        <!-- Slide 4: 參考競品與加減法策略 (反向排版: 圖左字右) -->', newSlideContent + '        <!-- Slide 4: 參考競品與加減法策略 (反向排版: 圖左字右) -->');

fs.writeFileSync('presentation_v5.0.0/index.html', html);
console.log('Slide 3 injected successfully.');
