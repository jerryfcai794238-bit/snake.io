const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'presentation_v5.2.0', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// The file might have BOM or be UTF-16, let's make sure it's read properly.
// The previous node script read it as utf8 fine though.

// We need to parse the slides.
let slides = html.split('<!-- Slide ');
if (slides.length !== 24) {
    console.error("Expected 23 slides, found: " + (slides.length - 1));
    // It's 24 parts (1 header + 23 slides)
}

let header = slides[0];
let s = slides.slice(1);

// s[0] -> Slide 01
// s[1] -> Slide 02 (Outline)
// s[2] -> Slide 03 (Divider 1)
// ...

// Step 1: Create new Page 02
let newPage02 = `02: 遊戲前導頁 -->
        <section class="slide-container" data-slide="2" style="justify-content: center; align-items: center; padding: 60px; text-align: center;">
            <div style="width: 100%; margin-bottom: 40px;">
                <span class="slide-page-num">Page 02</span>
                <h2 class="slide-title" style="font-size: 4rem; color: var(--nintendo-red);">遊戲核心概念</h2>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 25px; width: 80%; max-width: 1000px;">
                <!-- 基礎循環 -->
                <div style="background: var(--bg-pearl); padding: 30px; border-radius: 20px; border-left: 8px solid var(--yoshi-green); box-shadow: var(--inset-shadow); text-align: left;">
                    <h3 style="font-size: 2rem; color: var(--text-dark); margin-bottom: 10px;">🔄 基礎循環</h3>
                    <p style="font-size: 1.6rem; color: var(--text-muted); line-height: 1.5;">在地圖中不斷吞食食物與對手殘骸，快速增加自身長度與積分。</p>
                </div>
                
                <!-- 技能博弈 -->
                <div style="background: var(--bg-pearl); padding: 30px; border-radius: 20px; border-left: 8px solid #4D90FE; box-shadow: var(--inset-shadow); text-align: left;">
                    <h3 style="font-size: 2rem; color: var(--text-dark); margin-bottom: 10px;">⚔️ 技能博弈</h3>
                    <p style="font-size: 1.6rem; color: var(--text-muted); line-height: 1.5;">搭配主動技能「衝刺」技巧截斷對手；「磁力漩渦」快速吞食食物。</p>
                </div>

                <!-- 死亡與復活 -->
                <div style="background: var(--bg-pearl); padding: 30px; border-radius: 20px; border-left: 8px solid var(--nintendo-red); box-shadow: var(--inset-shadow); text-align: left;">
                    <h3 style="font-size: 2rem; color: var(--text-dark); margin-bottom: 10px;">👻 死亡與復活</h3>
                    <p style="font-size: 1.6rem; color: var(--text-muted); line-height: 1.5;">死亡後將掉落殘骸供他人爭奪，但透過復活機制，可快速重返戰場。</p>
                </div>
            </div>
        </section>\n\n        `;

// Step 2: Modify old slides
// Outline
s[1] = s[1].replace('1. 核心玩法 ／ 5. 成長之路結合', '1. 核心玩法 ／ 4. 成長之路結合');
s[1] = s[1].replace('1. 6+6 選品策略 ／ 6. 金流回收方式', '2. 6+6 選品策略 ／ 5. 金流回收方式');
s[1] = s[1].replace('1. 參考競品資訊 ／ 7. 美術視覺介紹', '3. 參考競品資訊 ／ 6. 美術視覺介紹');
s[1] = s[1].replace('1. 技能/道具設計 ／ 8. Q&A', '4. 技能與地圖道具 ／ 7. Q&A');

// Divider 1
s[2] = s[2].replace('基本操作 ／ 遊戲模式 ／ 碰撞規則', '基本操作 ／ 遊戲模式 ／ 衝刺特色');

// Core 1
s[3] = s[3].replace('1. 核心玩法 (1/4)：多人亂鬥', '1. 核心玩法 (1/4)：雙人對戰');
s[3] = s[3].replace('多人亂鬥', '雙人對戰');
s[3] = s[3].replace('120 秒快節奏混戰，多人與擬真 AI 同場競技。', '120 秒快節奏混戰，人+人 或 人+電腦競技。');
s[3] = s[3].replace('利用蛇身切斷對手動線，奪取殘骸反超積分。', '利用蛇身截斷對手身體，奪取殘骸反超積分。');

// Core 2
s[4] = s[4].replace(/消耗體力獲得 1\.25x 爆發加速，用以切斷對手動線。/g, '消耗體力獲得加速，若體力耗盡要等到回滿才能再次使用。');
s[4] = s[4].replace(/點擊觸發大範圍吸取周圍資源，冷卻制（CD），快速發育。/g, '瞬間吸入大範圍內的所有食物。');
s[4] = s[4].replace(/Dash 衝刺/g, '衝刺');

// Core 3
s[5] = s[5].replace(/1P vs 7\s*BOTs<br>BOT 反應較慢，適合新手熟悉操作。/, '1玩家 vs 7電腦<br>電腦強度低。');
s[5] = s[5].replace(/1P vs\s*1擬人AI vs 6 BOTs<br>與一名強力對手競爭，考驗玩家在混亂中的生存與獵殺能力。/, '1玩家 vs 1對手玩家 vs 6電腦<br>（若對手玩家匹配不到由電腦代替），電腦強度高。');
s[5] = s[5].replace(/1名玩家\+3名BOT\s*vs 1名AI\+3名BOT<br>紅白對抗，隊友間共享積分和地圖道具。/, '1玩家+3電腦 vs 1對手玩家+3電腦。');
// Add eval text
let evalHTML = `
            <div style="width: 100%; margin-top: 15px; background: white; padding: 15px 25px; border-radius: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 6px solid var(--coin-yellow); display: flex; align-items: center; gap: 15px;">
                <div style="font-size: 2rem;">🏆</div>
                <div>
                    <strong style="font-size: 1.3rem; color: var(--text-dark);">結算評價</strong>
                    <p style="font-size: 1.2rem; color: var(--text-muted); margin-top: 5px; line-height: 1.5;">比完排名後，依據 1-8 名給予綜合評價：SSS / SS / S / A / B / C / D / E。</p>
                </div>
            </div>`;
// Replace the old common goal banner
s[5] = s[5].replace(/<!-- 共通目標：吞食與成長 -->[\s\S]*?<\/div>\s*<\/div>/, evalHTML);

// Core 4 (Collision rules -> Dash features)
let newCore4 = `08: 核心玩法 (4/4)：衝刺特色 -->
        <section class="slide-container" data-slide="8" style="justify-content: center; align-items: center; padding: 60px 80px; flex-direction: column;">
            <div style="width: 100%; margin-bottom: 40px; text-align: left;">
                <span class="slide-page-num">Page 08</span>
                <h2 class="slide-title">1. 核心玩法 (4/4)：衝刺特色</h2>
            </div>
            <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
                <div style="background: var(--bg-pearl); padding: 40px; border-radius: 20px; border-left: 8px solid var(--nintendo-red); box-shadow: var(--inset-shadow); text-align: left; max-width: 900px;">
                    <h3 style="font-size: 2.2rem; color: var(--text-dark); margin-bottom: 20px;">⚔️ 技巧走位，博弈快感</h3>
                    <p style="font-size: 1.6rem; color: var(--text-muted); line-height: 1.8;">
                        衝刺不僅僅是加速，更是遊戲中最核心的博弈手段。<br><br>
                        玩家必須精準控制體力消耗，利用衝刺來截斷對手的動線。這項機制成功打破了傳統 IO 遊戲中「純粹依靠長度與數值壓制」的單調玩法，讓每一次交鋒都充滿了技巧博弈與反殺的刺激感。
                    </p>
                </div>
            </div>
        </section>\n\n        `;
s[6] = newCore4.replace('08: 核心玩法 (4/4)：衝刺特色 -->', '07: 核心玩法 (4/4)：衝刺特色 -->'); // Temporary name, will fix numbers later

// 6+6 Selection Strategy
s[8] = s[8].replace(/<!-- 掌控感與秩序建立 -->[\s\S]*?<\/div>/, '');

// Divider 4 (Skills)
s[13] = s[13].replace('4. 技能/道具設計', '4. 技能與地圖道具');
s[13] = s[13].replace('主動爆發與隨機地圖道具', '主動技能 ／ 地圖道具');

// Old Slide 15: Split into 16 and 17
let old15 = s[14];
let slide16 = `16: 主動技能 (1/2) -->
        <section class="slide-container" data-slide="16" style="justify-content: center; align-items: center; padding: 60px 80px; flex-direction: column;">
            <div style="width: 100%; margin-bottom: 30px;">
                <span class="slide-page-num">Page 16</span>
                <h2 class="slide-title">4. 技能與地圖道具 (1/2)：主動技能</h2>
                <p style="font-size: 1.4rem; color: var(--text-muted); margin-top: 10px;">說明：局前消耗金幣啟用與升級效果</p>
            </div>
            <div style="display: flex; gap: 20px; width: 100%;">
                <div style="flex: 1; background: var(--bg-pearl); padding: 25px; border-radius: 20px; border-left: 6px solid var(--nintendo-red);">
                    <h3 style="font-size: 1.8rem; color: var(--text-dark); margin-bottom: 10px;">1. 衝刺</h3>
                    <p style="font-size: 1.3rem; color: var(--text-muted); line-height: 1.5;">消耗體力獲得加速，若體力耗盡要等到回滿才能再次使用。</p>
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #ccc;">
                        <strong style="color: var(--nintendo-red);">升級效果：</strong><br>
                        衝刺體力上限、衝刺體力回復速度
                    </div>
                </div>
                <div style="flex: 1; background: var(--bg-pearl); padding: 25px; border-radius: 20px; border-left: 6px solid var(--coin-yellow);">
                    <h3 style="font-size: 1.8rem; color: var(--text-dark); margin-bottom: 10px;">2. 磁力漩渦</h3>
                    <p style="font-size: 1.3rem; color: var(--text-muted); line-height: 1.5;">瞬間吸入大範圍內的所有食物。</p>
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #ccc;">
                        <strong style="color: var(--coin-yellow);">升級效果：</strong><br>
                        磁吸漩渦半徑、磁吸漩渦冷卻時間
                    </div>
                </div>
            </div>
        </section>\n\n        `;

let slide17 = `17: 地圖道具 (2/2) -->
        <section class="slide-container" data-slide="17" style="justify-content: center; align-items: center; padding: 60px 80px; flex-direction: column;">
            <div style="width: 100%; margin-bottom: 30px;">
                <span class="slide-page-num">Page 17</span>
                <h2 class="slide-title">4. 技能與地圖道具 (2/2)：地圖道具</h2>
                <p style="font-size: 1.4rem; color: var(--text-muted); margin-top: 10px;">說明：局前消耗金幣啟用與升級效果</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; width: 100%; margin-bottom: 20px;">
                <div style="background: var(--bg-pearl); padding: 20px; border-radius: 16px; border-left: 5px solid #4D90FE;">
                    <h3 style="font-size: 1.6rem; color: var(--text-dark); margin-bottom: 10px;">1. 磁鐵</h3>
                    <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.4;">自動吸附周圍食物。</p>
                    <div style="margin-top: 10px; color: #4D90FE;"><strong>升級效果：</strong>吸附半徑</div>
                </div>
                <div style="background: var(--bg-pearl); padding: 20px; border-radius: 16px; border-left: 5px solid var(--nintendo-red);">
                    <h3 style="font-size: 1.6rem; color: var(--text-dark); margin-bottom: 10px;">2. 巨大蘑菇</h3>
                    <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.4;">體型變大且免疫截斷。</p>
                    <div style="margin-top: 10px; color: var(--nintendo-red);"><strong>升級效果：</strong>移動速度</div>
                </div>
                <div style="background: var(--bg-pearl); padding: 20px; border-radius: 16px; border-left: 5px solid var(--coin-yellow);">
                    <h3 style="font-size: 1.6rem; color: var(--text-dark); margin-bottom: 10px;">3. 幸運 7</h3>
                    <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.4;">食物價值大幅提升。</p>
                    <div style="margin-top: 10px; color: var(--coin-yellow);"><strong>升級效果：</strong>食物倍率</div>
                </div>
            </div>
            
            <div style="width: 100%; background: white; padding: 20px; border-radius: 15px; border-left: 6px solid var(--yoshi-green); box-shadow: var(--inset-shadow);">
                <h3 style="font-size: 1.5rem; color: var(--text-dark); margin-bottom: 10px;">✨ 其他升級效果</h3>
                <div style="display: flex; gap: 30px; font-size: 1.3rem; color: var(--text-muted);">
                    <div><strong>鷹眼：</strong>視野變大</div>
                    <div><strong>拾荒者：</strong>地圖道具時間增加</div>
                </div>
            </div>
        </section>\n\n        `;

let slide18 = s[19]; // The old Skin system slide

let slide20 = s[16]; // 成長之路結合 (1/1)
// Remove the 被動技能效果 card
slide20 = slide20.replace(/<!-- 被動技能效果升級 -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '</div></div>');

let slide22 = s[18]; // 金流回收方式 (1/2)
slide22 = slide22.replace('6. 金流回收方式 (1/2)：局前消耗與天賦升級', '6. 金流回收方式 (1/1)：循環體系');
slide22 = slide22.replace('開局前消耗金幣自選被動技能：鷹眼（視野 +）、磁鐵增幅（吸附半徑 +）、巨大蘑菇（速度降低減少）、幸運 7 增幅（倍率 +）。', '開局前消耗金幣啟用被動技能（如鷹眼、拾荒者、地圖道具強化等）。');
slide22 = slide22.replace('參考《弓箭傳說》天賦系統，消耗金幣隨機升級主動技能效果（體力上限／回復、磁吸漩渦半徑／CD）。', '消耗金幣永久升級主動技能效果（體力上限、磁吸半徑等）。');
// Add Skin
let skinRecovery = `
                    <div style="margin-bottom: 15px;">
                        <span class="pill pill-blue">回收手段 3：個性化外觀 (Skin 直購)</span>
                        <p style="font-size: 1.2rem; color: var(--text-muted); margin-top: 8px;">局外金幣商店兌換特色 Skin 外觀。</p>
                    </div>`;
slide22 = slide22.replace('<!-- 回收手段 2 -->', skinRecovery + '\n                    <!-- 回收手段 2 -->');


// Reconstruct
let newSlides = [];
newSlides.push(s[0]); // 01 Cover
newSlides.push(newPage02); // 02
newSlides.push(s[1]); // 03 Outline
newSlides.push(s[2]); // 04 Divider
newSlides.push(s[3]); // 05 Core 1
newSlides.push(s[4]); // 06 Core 2
newSlides.push(s[5]); // 07 Core 3
newSlides.push(s[6]); // 08 Core 4
newSlides.push(s[7]); // 09 Divider
newSlides.push(s[8]); // 10 6+6 Selection
newSlides.push(s[9]); // 11 Divider
newSlides.push(s[10]); // 12 Snake.io
newSlides.push(s[11]); // 13 Snake Clash
newSlides.push(s[12]); // 14 Snake Merge
newSlides.push(s[13]); // 15 Divider
newSlides.push(slide16); // 16 主動技能
newSlides.push(slide17); // 17 地圖道具
newSlides.push(slide18); // 18 Skin (old 20)
newSlides.push(s[15]); // 19 Divider 成長之路 (old 16)
newSlides.push(slide20); // 20 成長之路 (old 17)
newSlides.push(s[17]); // 21 Divider 金流 (old 18)
newSlides.push(slide22); // 22 金流 (old 19)
newSlides.push(s[20]); // 23 Divider 美術 (old 21)
newSlides.push(s[21]); // 24 美術 (old 22)
newSlides.push(s[22]); // 25 Q&A (old 23)

// Renumbering logic
for (let i = 0; i < newSlides.length; i++) {
    let pageNum = i + 1;
    let pageStr = String(pageNum).padStart(2, '0');
    
    // Replace the slide comment tag `XX: Name -->`
    newSlides[i] = newSlides[i].replace(/^\d{2}: /, `${pageStr}: `);
    
    // Replace data-slide="X"
    newSlides[i] = newSlides[i].replace(/data-slide="\d+"/g, `data-slide="${pageNum}"`);
    
    // Replace <span class="slide-page-num">Page XX</span>
    newSlides[i] = newSlides[i].replace(/<span class="slide-page-num">Page \d{2}<\/span>/g, `<span class="slide-page-num">Page ${pageStr}</span>`);
}

let finalHtml = header + '<!-- Slide ' + newSlides.join('<!-- Slide ');

// Global text replacements
finalHtml = finalHtml.replace(/Dash/g, '衝刺');
finalHtml = finalHtml.replace(/隨機道具/g, '地圖道具');
finalHtml = finalHtml.replace(/核心主動技能/g, '主動技能');

fs.writeFileSync(filePath, finalHtml);
console.log("HTML update complete!");
