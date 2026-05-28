const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 找到投影片的起始與結束
const slidesStartKey = '<!-- Slide 01:';
const slidesStartIdx = html.indexOf(slidesStartKey);

const mainEndKey = '</main>';
const slidesEndIdx = html.indexOf(mainEndKey, slidesStartIdx);

if (slidesStartIdx === -1 || slidesEndIdx === -1) {
    console.error("Could not find start of slides or end of main viewport!");
    process.exit(1);
}

let header = html.substring(0, slidesStartIdx);
let footer = html.substring(slidesEndIdx);
let slidesBlock = html.substring(slidesStartIdx, slidesEndIdx);

// 解析原本的投影片
let slides = slidesBlock.split('<!-- Slide ');
// filter out empty or small strings
slides = slides.filter(s => s.trim().length > 0);

console.log(`Original slides count: ${slides.length}`);

// 修改 HTML Title 和版本
header = header.replace('貪食蛇 ── 項目提案簡報 v5.2.0', '貪食蛇 ── 項目提案簡報 v5.4.0');
header = header.replace('貪食蛇 ── 項目提案簡報', '貪食蛇 ── 項目提案簡報 v5.4.0');
header = header.replace('項目提案簡報 v5.2.0', '項目提案簡報 v5.4.0');

// s[0] -> Slide 01: 封面
slides[0] = `01: 封面 -->
        <section class="slide-container active" data-slide="1"
            style="justify-content: center; align-items: center; text-align: center; flex-direction: column;">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                <h1 class="cover-title">貪食蛇提案說明</h1>
                <div
                    style="background: rgba(0,0,0,0.03); padding: 8px 24px; border-radius: 9999px; font-size: 1.15rem; font-weight: 600; margin-top: 10px; color: var(--text-muted);">
                    線上研三 開發二組 高帆君 (v5.4.0)
                </div>
            </div>
        </section>\n\n        `;

// slides[2] -> Slide 03: 核心玩法前導
slides[2] = `03: 核心玩法前導 -->
        <section class="slide-container" data-slide="3"
            style="justify-content: center; align-items: center; padding: 50px 70px; flex-direction: column;">
            <div style="width: 100%; display: flex; flex-direction: column; align-items: center;">
                <div style="width: 100%; margin-bottom: 30px; text-align: center;">
                    <span class="slide-page-num">Page 03</span>
                    <h2 class="slide-title">遊戲特色</h2>
                </div>
                <div style="text-align: center; margin-bottom: 30px;">
                    <span
                        style="font-size: 2rem; font-weight: 700; color: var(--nintendo-red); letter-spacing: 1px;">多人大亂鬥
                        X 體力控管 X 截斷反殺</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; width: 100%;">
                    <div
                        style="background: var(--bg-pearl); padding: 25px; border-radius: 20px; border-left: 6px solid var(--nintendo-red); box-shadow: var(--inset-shadow);">
                        <h3 style="font-size: 1.5rem; margin-bottom: 8px; color: var(--text-dark);">多人混戰</h3>
                        <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.5;">
                            打破雙人侷限，支援多人同場大亂鬥，節奏快、場面熱烈。</p>
                    </div>
                    <div
                        style="background: var(--bg-pearl); padding: 25px; border-radius: 20px; border-left: 6px solid var(--yoshi-green); box-shadow: var(--inset-shadow);">
                        <h3 style="font-size: 1.5rem; margin-bottom: 8px; color: var(--text-dark);">體力控管</h3>
                        <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.5;">
                            衝刺與疲勞超載機制的精密走位博弈。</p>
                    </div>
                    <div
                        style="background: var(--bg-pearl); padding: 25px; border-radius: 20px; border-left: 6px solid var(--coin-yellow); box-shadow: var(--inset-shadow);">
                        <h3 style="font-size: 1.5rem; margin-bottom: 8px; color: var(--text-dark);">截斷反殺</h3>
                        <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.5;">
                            利用蛇身截斷對手身體，奪取殘骸反超積分。</p>
                    </div>
                </div>
            </div>
        </section>\n\n        `;

// slides[3] -> Slide 04: 大綱
slides[3] = `04: 大綱 -->
        <section class="slide-container" data-slide="4"
            style="flex-direction: column; padding: 60px 80px; justify-content: center;">
            <div style="text-align: center; margin-bottom: 35px;">
                <span class="slide-page-num">Page 04</span>
                <h2 class="slide-title">大綱：項目總覽</h2>
            </div>
            <div class="agenda-grid">
                <div class="agenda-item active">
                    <span class="agenda-num">1</span>
                    <span>核心玩法</span>
                </div>
                <div class="agenda-item active">
                    <span class="agenda-num">5</span>
                    <span>成長之路結合</span>
                </div>
                <div class="agenda-item active">
                    <span class="agenda-num">2</span>
                    <span>6+6選品策略</span>
                </div>
                <div class="agenda-item active">
                    <span class="agenda-num">6</span>
                    <span>金流回收方式</span>
                </div>
                <div class="agenda-item active">
                    <span class="agenda-num">3</span>
                    <span>參考競品資訊</span>
                </div>
                <div class="agenda-item active">
                    <span class="agenda-num">7</span>
                    <span>美術風格與場景</span>
                </div>
                <div class="agenda-item active">
                    <span class="agenda-num">4</span>
                    <span>技能與地圖道具</span>
                </div>
                <div class="agenda-item active">
                    <span class="agenda-num">8</span>
                    <span>Q&A</span>
                </div>
            </div>
        </section>\n\n        `;

// slides[4] -> Slide 05: Divider 1
slides[4] = `05: 主題過渡頁 - 1 -->
        <section class="slide-container divider-style full-bg" data-slide="5" style="
                background: white; 
                flex-direction: column;
            ">
            <div class="divider-title">1. 核心玩法</div>
            <div class="divider-subtitle">遊戲模式</div>
            <div class="divider-subtitle">基本操作</div>
            <div class="divider-subtitle">衝刺與社交互動</div>
        </section>\n\n        `;

// slides[5] -> Slide 06: 遊戲模式
slides[5] = `06: 遊戲模式 -->
        <section class="slide-container" data-slide="6"
            style="justify-content: center; align-items: center; padding: 60px 80px; flex-direction: column;">
            <div style="width: 100%; margin-bottom: 30px;">
                <span class="slide-page-num">Page 06</span>
                <h2 class="slide-title">1. 核心玩法 (1/4)：遊戲模式</h2>
            </div>
            <div class="mode-row" style="width: 100%; justify-content: center; margin-bottom: 20px;">
                <div
                    style="background: var(--bg-pearl); padding: 25px; border-radius: 20px; border-left: 6px solid var(--yoshi-green); box-shadow: var(--inset-shadow); flex: 1;">
                    <strong style="font-size: 1.5rem; color: var(--text-dark);">單人練習 (Solo)</strong>
                    <p style="font-size: 1.2rem; color: var(--text-muted); margin-top: 10px; line-height: 1.5;">1玩家 vs 7 電腦<br>電腦強度低，適合新手練習。</p>
                </div>
                <div
                    style="background: var(--bg-pearl); padding: 25px; border-radius: 20px; border-left: 6px solid var(--nintendo-red); box-shadow: var(--inset-shadow); flex: 1;">
                    <strong style="font-size: 1.5rem; color: var(--text-dark);">多人大亂鬥</strong>
                    <p style="font-size: 1.2rem; color: var(--text-muted); margin-top: 10px; line-height: 1.5;">支援 8 人以上玩家與電腦混戰<br>電腦強度高，極具挑戰性與隨機樂趣。</p>
                </div>
                <div
                    style="background: var(--bg-pearl); padding: 25px; border-radius: 20px; border-left: 6px solid var(--coin-yellow); box-shadow: var(--inset-shadow); flex: 1;">
                    <strong style="font-size: 1.5rem; color: var(--text-dark);">多人組隊賽</strong>
                    <p style="font-size: 1.2rem; color: var(--text-muted); margin-top: 10px; line-height: 1.5;">
                        支援好友一同組隊聯手<br>可進行 2v2v2v2 或 4v4 陣營對抗。</p>
                </div>
            </div>

            <!-- 結算評價 -->
            <div
                style="width: 100%; background: white; padding: 20px 25px; border-radius: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 6px solid #4D90FE; display: flex; align-items: center; gap: 15px;">
                <div>
                    <strong style="font-size: 1.3rem; color: var(--text-dark);">結算評價</strong>
                    <p style="font-size: 1.2rem; color: var(--text-muted); margin-top: 5px; line-height: 1.5;">
                        比完排名後，依據 1-8 名給予綜合評價：SSS / SS / S / A / B / C / D / E。
                    </p>
                </div>
            </div>
        </section>\n\n        `;

// slides[6] -> Slide 07: 基本操作
slides[6] = `07: 基本操作 -->
        <section class="slide-container top-bottom" data-slide="7" style="justify-content: center; gap: 40px;">
            <!-- 左側文字區域 -->
            <div class="slide-left" style="
                    height: auto;
                    width: 100%;
                    padding: 0 60px;
                    flex-direction: column;
                    justify-content: center;
                    align-items: stretch;
                    border-bottom: none;
                ">
                <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 15px;
                    ">
                    <div>
                        <span class="slide-page-num">Page 07</span>
                        <h2 class="slide-title">
                            1. 核心玩法 (2/4)：基本操作與社交互動
                        </h2>
                    </div>
                </div>

                <div style="
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 20px;
                    ">
                    <!-- 動態虛擬搖桿 -->
                    <div style="
                            background: var(--bg-pearl);
                            padding: 20px;
                            border-radius: 16px;
                            border-left: 5px solid var(--nintendo-red);
                        ">
                        <h3 style="font-size: 1.5rem; margin-bottom: 8px; color: var(--text-dark);">
                            動態虛擬搖桿
                        </h3>
                        <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.4;">
                            隨滑隨動，零延遲提供精細走位避險與切入空間。
                        </p>
                    </div>

                    <!-- 雙主動技能 -->
                    <div style="
                            background: var(--bg-pearl);
                            padding: 20px;
                            border-radius: 16px;
                            border-left: 5px solid var(--yoshi-green);
                        ">
                        <h3 style="font-size: 1.5rem; margin-bottom: 8px; color: var(--text-dark);">
                            雙主動技能
                        </h3>
                        <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.4;">
                            包含「衝刺」加速技巧與「磁力漩渦」大範圍食物吸附。
                        </p>
                    </div>

                    <!-- 社交頭像與貼圖 -->
                    <div style="
                            background: var(--bg-pearl);
                            padding: 20px;
                            border-radius: 16px;
                            border-left: 5px solid var(--coin-yellow);
                        ">
                        <h3 style="font-size: 1.5rem; margin-bottom: 8px; color: var(--text-dark);">
                            社交與貼圖互動
                        </h3>
                        <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.4;">
                            顯現角色頭像（上傳個人照片），局內發送搞怪表情貼圖互動。
                        </p>
                    </div>
                </div>
            </div>

            <!-- 右側圖片區域 (下半部) -->
            <div class="slide-right"
                style="width: 100%; height: auto; padding: 0 60px; display: flex; align-items: center; justify-content: center;">
                <div class="illustration-card" style="width: 85%; height: auto; max-width: 1100px; border-radius: 15px; overflow: hidden; box-shadow: var(--card-shadow);">
                    <div class="illustration-header"><span>📺</span> 雙平台虛擬搖桿與對戰畫面</div>
                    <div class="illustration-body" style="padding: 0; background: black; display: block;">
                        <video class="real-image" autoplay muted loop playsinline
                            style="width: 100%; height: auto; display: block; position: static;">
                            <source src="Demo_01.mp4" type="video/mp4">
                        </video>
                    </div>
                </div>
            </div>
        </section>\n\n        `;

// slides[10] -> Slide 11: 6+6選品策略
slides[10] = `11: 6+6選品策略 -->
        <section class="slide-container grid-layout" data-slide="11" style="justify-content: center;">
            <span class="slide-page-num">Page 11</span>
            <div style="margin-bottom: 25px;">
                <h2 class="slide-title">2. 6+6 選品策略 (1/1)：經典再造與心理驅動</h2>
            </div>
            <div class="six-six-container">
                <!-- 左側：落實兩大成功策略 -->
                <div class="six-six-column">
                    <h3 style="font-family: 'Fredoka', sans-serif; font-size: 1.5rem; color: var(--nintendo-red);">
                        落實兩大成功策略</h3>

                    <div class="six-six-card strategy">
                        <h3>玩法深化．體驗升級</h3>
                        <p>「截斷反殺」實現以小博大<br>「多人大亂鬥」打破雙人侷限<br>「多人組隊」翻倍好友樂趣</p>
                    </div>

                    <div class="six-six-card strategy">
                        <h3>玩法融合．創造藍海</h3>
                        <p>「經典走位」結合天賦養成<br>「雙軌技能」釋放玩法變化<br>「地圖道具」翻新傳統體驗</p>
                    </div>
                </div>

                <!-- 右側：對齊兩大心理驅動 -->
                <div class="six-six-column">
                    <h3 style="font-family: 'Fredoka', sans-serif; font-size: 1.5rem; color: var(--yoshi-green);">
                        對齊兩大核心心理驅動</h3>

                    <div class="six-six-card psychology">
                        <h3>ASMR效應與感官滿足</h3>
                        <p>「感官反饋」放大拾取體驗<br>「爆炸衝擊」引爆擊殺爽感<br>「觸覺震動」提供極致紓壓</p>
                    </div>

                    <div class="six-six-card psychology">
                        <h3>熟悉與新奇黃金平衡</h3>
                        <p>「直覺操作」實現零學習成本<br>「體力衝刺」創造博弈快感<br>「道具升級」翻倍成就體驗</p>
                    </div>
                </div>
            </div>
        </section>\n\n        `;

// slides[11] -> Slide 12: Divider 3
slides[11] = `12: 主題過渡頁 - 3 -->
        <section class="slide-container divider-style full-bg" data-slide="12"
            style="background: white; flex-direction: column;">
            <div class="divider-title green">3. 參考競品資訊</div>
            <div class="divider-subtitle">Snake.io ／ Snake Clash! ／ Snake Merge ／ Pump Snake</div>
        </section>\n\n        `;

// 新增 Slide 16 for Pump Snake (插入在 slides[14] / Slide 15 之後)
let pumpSnakeSlide = `16: 參考競品 (4/4)：Pump Snake -->
        <section class="slide-container" data-slide="16">
            <div class="slide-left" style="width: 50%; padding: 40px 50px; justify-content: center; gap: 15px;">
                <span class="slide-page-num">Page 16</span>
                <h2 class="slide-title" style=" margin-bottom: 5px;">3. 參考競品 (4/4)：Pump Snake</h2>
                <div class="competitor-card pump-snake"
                    style="display: flex; flex-direction: column; gap: 15px; padding: 25px; background: var(--bg-pearl); border-radius: 20px; border-left: 6px solid var(--nintendo-red);">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <span style="font-size: 3rem;">🐍</span>
                        <div>
                            <h3 style="font-size: 1.7rem; color: var(--text-dark);">Pump Snake</h3>
                            <span class="competitor-tag red" style="margin-top: 5px; display: inline-block;">直播與社群同樂爆紅</span>
                        </div>
                    </div>
                    <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.6;">
                        「強直播傳播力」：具極強話題性與多人同樂性。未來可朝舉辦賽事（Tournament）與多人組隊方向規劃，打通社群裂變。
                    </p>
                </div>
            </div>
            <div class="slide-right"
                style="width: 50%; padding: 30px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #FDF2F2 0%, #F5E6E6 100%);">
                <div class="illustration-card" style="width: 100%; height: 100%;">
                    <div class="illustration-header"><span>📺</span> Pump Snake 多人賽事與社群同樂</div>
                    <div class="illustration-body" style="padding: 20px; text-align: center; justify-content: center; display: flex; flex-direction: column; gap: 10px;">
                        <span style="font-size: 4rem;">🏆</span>
                        <strong style="font-size: 1.4rem; color: var(--text-dark);">極具直播同樂與話題傳播性</strong>
                        <p style="font-size: 1.1rem; color: var(--text-muted);">規劃錦標賽/好友對抗，提升多人組隊開黑爽感</p>
                    </div>
                </div>
            </div>
        </section>\n\n        `;

slides.splice(15, 0, pumpSnakeSlide); // 原來 slides[15] 之後插入

// slides[16] (原 slides[15]) -> Slide 17: Divider 4
slides[16] = `17: 主題過渡頁 - 4 -->
        <section class="slide-container divider-style full-bg" data-slide="17"
            style="background: white; flex-direction: column;">
            <div class="divider-title yellow">4. 技能與地圖道具</div>
            <div class="divider-subtitle">主動技道具化 ／ 被動永久天賦 ／ Skin與貼圖互動</div>
        </section>\n\n        `;

// slides[17] (原 slides[16]) -> Slide 18: 主動技能
slides[17] = `18: 主動技能 (1/3) -->
        <section class="slide-container" data-slide="18"
            style="justify-content: center; align-items: center; padding: 60px 80px; flex-direction: column;">
            <div style="margin-bottom: 15px;">
                <span class="slide-page-num">Page 18</span>
                <h2 class="slide-title">4. 技能與地圖道具 (1/3)：主動技能</h2>
                <p style="font-size: 1.15rem; color: var(--text-muted); margin-top: 5px;">⚡ 主動技能道具化（可單次購買/儲存庫存），開局前可消耗金幣或鑽石啟用</p>
            </div>
            <div style="display: flex; gap: 20px; width: 100%;">
                <!-- 衝刺卡片 -->
                <div
                    style="flex: 1; background: var(--bg-pearl); padding: 20px; border-radius: 20px; border-left: 6px solid var(--nintendo-red);">
                    <h3 style="font-size: 1.6rem; color: var(--text-dark); margin-bottom: 5px;">1. 衝刺</h3>
                    <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.4;">
                        消耗體力獲得加速，體力耗盡需回滿才能再次使用。
                    </p>
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ccc;">
                        <strong style="color: var(--nintendo-red); font-size: 1.1rem;">升級與強化 (耗金幣/鑽石)：</strong><br>
                        <span style="font-size: 1.1rem;">• 提升衝刺體力上限<br>• 提升體力回復速度</span>
                    </div>
                </div>
                <!-- 磁力漩渦卡片 -->
                <div
                    style="flex: 1; background: var(--bg-pearl); padding: 20px; border-radius: 20px; border-left: 6px solid var(--coin-yellow);">
                    <h3 style="font-size: 1.6rem; color: var(--text-dark); margin-bottom: 5px;">2. 磁力漩渦</h3>
                    <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.4;">
                        瞬間吸入大範圍內的所有食物，有冷卻時間限制。
                    </p>
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ccc;">
                        <strong style="color: var(--coin-yellow); font-size: 1.1rem;">升級與強化 (耗金幣/鑽石)：</strong><br>
                        <span style="font-size: 1.1rem;">• 擴大漩渦磁吸半徑<br>• 縮短冷卻時間 (CD)</span>
                    </div>
                </div>
            </div>
        </section>\n\n        `;

// slides[18] (原 slides[17]) -> Slide 19: 地圖道具與被動升級
slides[18] = `19: 地圖道具與被動升級 (2/3) -->
        <section class="slide-container" data-slide="19"
            style="justify-content: center; align-items: center; padding: 60px 80px; flex-direction: column;">
            <div style="width: 100%; margin-bottom: 20px;">
                <span class="slide-page-num">Page 19</span>
                <h2 class="slide-title">4. 技能與地圖道具 (2/3)：地圖道具與被動永久升級</h2>
                <p style="font-size: 1.15rem; color: var(--text-muted); margin-top: 5px;">📦 地圖中隨機拾取的道具，其基礎效果可透過局外被動升級進行永久強化 (金幣養成)</p>
            </div>

            <div
                style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; width: 100%; margin-bottom: 20px;">
                <div
                    style="background: var(--bg-pearl); padding: 20px; border-radius: 16px; border-left: 5px solid #4D90FE;">
                    <h3 style="font-size: 1.6rem; color: var(--text-dark); margin-bottom: 10px;">1. 磁鐵</h3>
                    <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.4;">自動吸附周圍食物。</p>
                    <div style="margin-top: 10px; color: #4D90FE;"><strong>被動升級：</strong>磁鐵吸附半徑</div>
                </div>
                <div
                    style="background: var(--bg-pearl); padding: 20px; border-radius: 16px; border-left: 5px solid var(--nintendo-red);">
                    <h3 style="font-size: 1.6rem; color: var(--text-dark); margin-bottom: 10px;">2. 巨大蘑菇</h3>
                    <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.4;">體型變大、免疫截斷。</p>
                    <div style="margin-top: 10px; color: var(--nintendo-red);"><strong>被動升級：</strong>移動速度</div>
                </div>
                <div
                    style="background: var(--bg-pearl); padding: 20px; border-radius: 16px; border-left: 5px solid var(--coin-yellow);">
                    <h3 style="font-size: 1.6rem; color: var(--text-dark); margin-bottom: 10px;">3. 幸運 7</h3>
                    <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.4;">吞食食物價值提升。</p>
                    <div style="margin-top: 10px; color: var(--coin-yellow);"><strong>被動升級：</strong>食物倍率</div>
                </div>
            </div>

            <div
                style="width: 100%; background: white; padding: 20px; border-radius: 15px; border-left: 6px solid var(--yoshi-green); box-shadow: var(--inset-shadow);">
                <h3 style="font-size: 1.5rem; color: var(--text-dark); margin-bottom: 5px;">✨ 其他被動養成 (天賦屬性升級)</h3>
                <div style="display: flex; gap: 30px; font-size: 1.2rem; color: var(--text-muted);">
                    <div><strong>鷹眼：</strong>視野範圍永久變大，及早預警敵情。</div>
                    <div><strong>拾荒者：</strong>地圖道具持續時間永久增加，延長優勢。</div>
                </div>
            </div>
        </section>\n\n        `;

// slides[19] (原 slides[18]) -> Slide 20: Skin 系統與表情貼圖
slides[19] = `20: Skin 系統與表情貼圖 (3/3) -->
        <section class="slide-container" data-slide="20">
            <div class="slide-left" style="width: 50%; padding: 40px 50px; justify-content: center; gap: 18px;">
                <span class="slide-page-num">Page 20</span>
                <h2 class="slide-title" style=" margin-bottom: 5px;">4. 技能與地圖道具 (3/3)：Skin系統與表情互動</h2>

                <div
                    style="background: var(--bg-pearl); padding: 20px; border-radius: 16px; border-left: 6px solid var(--coin-yellow); box-shadow: var(--inset-shadow);">
                    <h3 style="font-size: 1.5rem; margin-bottom: 8px; color: var(--text-dark);">醜萌搞怪風格外觀</h3>
                    <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.6;">
                        外觀朝向「醜萌」、「搞怪」、「可愛」等多樣化 3D 黏土風格設計，在多人同場競技下更具吸引力與炫耀性。
                    </p>
                </div>

                <div
                    style="background: var(--bg-pearl); padding: 20px; border-radius: 16px; border-left: 6px solid var(--yoshi-green); box-shadow: var(--inset-shadow);">
                    <h3 style="font-size: 1.5rem; margin-bottom: 12px; color: var(--text-dark);">表情貼圖即時互動</h3>
                    <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.6;">
                        局內可發送醜萌、搞怪表情貼圖，實現即時挑釁、求饒或慶祝，大幅增強直播同樂與局內綜藝感。
                    </p>
                </div>
            </div>
            <div class="slide-right"
                style="width: 50%; padding: 30px; display: flex; align-items: center; justify-content: center;">
                <div class="illustration-card" style="width: 100%; height: 100%;">
                    <div class="illustration-header"><span>🎨</span> Skin 系統與表情貼圖展示</div>
                    <div class="illustration-body" style="padding: 0; background: black;">
                        <video class="real-image" autoplay muted loop playsinline
                            style="object-fit: contain; width: 100%; height: 100%;">
                            <source src="skin系統.mp4" type="video/mp4">
                        </video>
                    </div>
                </div>
            </div>
        </section>\n\n        `;

// slides[20] -> Slide 21: Divider 5
slides[20] = `21: 主題過渡頁 - 5 -->
        <section class="slide-container divider-style full-bg" data-slide="21"
            style="background: white; flex-direction: column;">
            <div class="divider-title slate">5. 成長之路結合</div>
            <div class="divider-subtitle">主動技能解鎖</div>
        </section>\n\n        `;

// slides[21] -> Slide 22: 成長之路
slides[21] = `22: 成長之路 (1/1) -->
        <section class="slide-container" data-slide="22">
            <!-- 左側文字與解鎖清單 -->
            <div class="slide-left" style="
                    width: 55%; 
                    padding: 40px 50px; 
                    justify-content: center; 
                    gap: 15px;
                    border-right: none;
                ">
                <span class="slide-page-num">Page 22</span>
                <div style="margin-bottom: 5px;">
                    <h2 class="slide-title">
                        5. 成長之路結合 (1/1)：主動技能解鎖
                    </h2>
                    <p class="slide-subtitle" style="margin-top: 5px;">
                        引入等級里程碑，提供明確的局外長線技能解鎖目標
                    </p>
                </div>

                <!-- 機制說明 -->
                <div style="
                        background: var(--bg-pearl); 
                        padding: 15px 20px; 
                        border-radius: 16px; 
                        border-left: 6px solid var(--yoshi-green); 
                        box-shadow: var(--inset-shadow);
                    ">
                    <h3 style="font-size: 1.5rem; margin-bottom: 4px; color: var(--text-dark);">
                        主動技能解鎖機制
                    </h3>
                    <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.5;">
                        累積每局積分 -> 提升里程碑等級。成長里程碑不再提供數值被動屬性，而是解鎖新的「主動技能」（例如達到某等級里程碑時解鎖「磁力漩渦」）。
                    </p>
                </div>
            </div>

            <!-- 右側參考圖片 -->
            <div class="slide-right" style="
                    width: 45%; 
                    padding: 25px;
                    border-left: none;
                ">
                <div class="illustration-card">
                    <div class="illustration-header">
                        <span>📈</span> 成長之路
                    </div>
                    <div class="illustration-body">
                        <img src="玩星派對_成長之路_圖.png" alt="成長之路參考圖" class="real-image"
                            onerror="this.src='../presentation_v5.0.0/images/slide_5.png'">
                    </div>
                </div>
            </div>
        </section>\n\n        `;

// slides[22] -> Slide 23: Divider 6
slides[22] = `23: 主題過渡頁 - 6 -->
        <section class="slide-container divider-style full-bg" data-slide="23"
            style="background: white; flex-direction: column;">
            <div class="divider-title">6. 金流回收方式</div>
            <div class="divider-subtitle">單局消耗 ／ 被動天賦 ／ 外觀直購</div>
        </section>\n\n        `;

// slides[23] -> Slide 24: 金流回收
slides[23] = `24: 金流回收方式 (1/1) -->
        <section class="slide-container" data-slide="24">
            <div class="slide-left" style="width: 55%; padding: 40px 50px; justify-content: center; gap: 20px;">
                <span class="slide-page-num">Page 24</span>
                <h2 class="slide-title" style=" margin-bottom: 5px;">6. 金流回收方式 (1/1)：循環體系</h2>

                <div
                    style="background: var(--bg-pearl); padding: 20px; border-radius: 16px; border-left: 6px solid var(--coin-yellow); box-shadow: var(--inset-shadow);">
                    <h3 style="font-size: 1.5rem; margin-bottom: 6px; color: var(--text-dark);">回收一：單局道具消耗 (金幣與鑽石雙回收)</h3>
                    <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.5;">
                        開局前玩家可消耗金幣或鑽石購買/啟動單局的主動技能使用次數或開局屬性增益，增加局前戰術選擇。
                    </p>
                </div>

                <div
                    style="background: var(--bg-pearl); padding: 20px; border-radius: 16px; border-left: 6px solid var(--nintendo-red); box-shadow: var(--inset-shadow);">
                    <h3 style="font-size: 1.5rem; margin-bottom: 6px; color: var(--text-dark);">回收二：被動永久天賦升級 (長線金幣回收)</h3>
                    <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.5;">
                        消耗遊戲金幣，永久且逐步升級被動天賦效果（如跑速、鷹眼視野、地圖道具吸附半徑等），維持深度的金幣消耗。
                    </p>
                </div>

                <div
                    style="background: var(--bg-pearl); padding: 20px; border-radius: 16px; border-left: 6px solid var(--yoshi-green); box-shadow: var(--inset-shadow);">
                    <h3 style="font-size: 1.5rem; margin-bottom: 6px; color: var(--text-dark);">回收三：外觀與表情貼圖 (鑽石主回收)</h3>
                    <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.5;">
                        局外金幣與鑽石商店，玩家可直接購買特色醜萌 Skin 外觀或趣味表情貼圖，實現個性展示。
                    </p>
                </div>

            </div>
            <div class="slide-right" style="width: 45%; padding: 25px;">
                <div class="illustration-card">
                    <div class="illustration-header"><span>🧬</span> 局外天賦系統 (弓箭傳說天賦系統.mp4)</div>
                    <div class="illustration-body">
                        <video class="real-image" autoplay muted loop playsinline
                            style="object-fit: contain; width: 100%; height: 100%;">
                            <source src="弓箭傳說強化系統.mp4" type="video/mp4">
                        </video>
                    </div>
                </div>
            </div>
        </section>\n\n        `;

// slides[24] -> Slide 25: Divider 7
slides[24] = `25: 主題過渡頁 - 7 -->
        <section class="slide-container divider-style full-bg" data-slide="25"
            style="background: white; flex-direction: column;">
            <div class="divider-title slate">7. 美術風格</div>
            <div class="divider-subtitle">任天堂風格 ／ 多樣化場景</div>
        </section>\n\n        `;

// slides[25] -> Slide 26: 美術風格
slides[25] = `26: 美術風格 (1/1) -->
        <section class="slide-container" data-slide="26">
            <div class="slide-left" style="width: 40%; padding: 40px; justify-content: center; gap: 20px;">
                <span class="slide-page-num">Page 26</span>
                <h2 class="slide-title" style=" color: var(--text-dark);">7. 美術風格 (1/1)：風格與場景</h2>

                <div
                    style="background: var(--bg-pearl); padding: 25px; border-radius: 20px; border-left: 6px solid var(--nintendo-red); box-shadow: var(--inset-shadow);">
                    <h3 style="font-size: 1.5rem; margin-bottom: 8px; color: var(--text-dark);">任天堂風與多樣化場景</h3>
                    <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.6;">
                        主打 3D 微黏土質感外，亦規劃多樣化的主題地圖場景（如：玩具工廠、糖果世界、復古像素），提升視覺新鮮感與對局樂趣。
                    </p>
                </div>
            </div>
            <div class="slide-right" style="width: 60%; padding: 25px; background: white;">
                <div class="mario-gallery">
                    <div class="gallery-card">
                        <img src="瑪利歐網球圖1.jpg" alt="瑪利歐網球"
                            onerror="this.src='../presentation_v5.0.0/images/slide_9.png'">
                        <span>《瑪利歐網球》</span>
                    </div>
                    <div class="gallery-card">
                        <img src="瑪利歐派對圖1.png" alt="瑪利歐派對"
                            onerror="this.src='../presentation_v5.0.0/images/slide_9.png'">
                        <span>《瑪利歐派對》</span>
                    </div>
                    <div class="gallery-card">
                        <img src="瑪利歐賽車8圖1.jpg" alt="瑪利歐賽車1"
                            onerror="this.src='../presentation_v5.0.0/images/slide_9.png'">
                        <span>《瑪利歐賽車 8》</span>
                    </div>
                    <div class="gallery-card">
                        <img src="瑪利歐賽車8圖2.jpg" alt="瑪利歐賽車2"
                            onerror="this.src='../presentation_v5.0.0/images/slide_9.png'">
                        <span>《瑪利歐賽車 8》</span>
                    </div>
                </div>
            </div>
        </section>\n\n        `;

// slides[26] -> Slide 27: Q&A
slides[26] = `27: Q&A -->
        <section class="slide-container full-bg" data-slide="27" style="background: white;">
            <div class="divider-title" style="font-size: 6.2rem; letter-spacing: 5px;">Q&A</div>
        </section>\n\n        `;

// 新增 Slide 28: 感謝頁面
let thankYouSlide = `28: 感謝頁面 -->
        <section class="slide-container" data-slide="28" style="background: white; flex-direction: column; justify-content: center; align-items: center;">
            <h1 class="cover-title" style="font-size: 3.5rem; margin-bottom: 20px;">感謝聆聽，敬請指教</h1>
            <div style="background: rgba(0,0,0,0.03); padding: 8px 24px; border-radius: 9999px; font-size: 1.15rem; font-weight: 600; color: var(--text-muted);">
                SNAKE 貪食蛇 競技場 (v5.4.0)
            </div>
        </section>\n\n        `;

slides.push(thankYouSlide);

// 重新進行頁碼與順序編號
for (let i = 0; i < slides.length; i++) {
    let pageNum = i + 1;
    let pageStr = String(pageNum).padStart(2, '0');
    
    // 替換註解 `XX: Name -->`
    slides[i] = slides[i].replace(/^\d{2}: /, `${pageStr}: `);
    
    // 替換 data-slide="X"
    slides[i] = slides[i].replace(/data-slide="\d+"/g, `data-slide="${pageNum}"`);
    
    // 替換 <span class="slide-page-num">Page XX</span>
    slides[i] = slides[i].replace(/Page \d{2}/g, `Page ${pageStr}`);
}

let slidesContent = slides.join('<!-- Slide ');

// 拼接回完整的 HTML
let finalHtml = header + '<!-- Slide ' + slidesContent + footer;

// 寫入更新後的 index.html
fs.writeFileSync(filePath, finalHtml, 'utf8');
console.log(`HTML update complete! Total slides: ${slides.length}`);
