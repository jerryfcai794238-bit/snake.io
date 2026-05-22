const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'presentation_v5.2.0', 'index.html');
let content = fs.readFileSync(filePath, 'utf-8');

// --- TASK 1: MOVE Slide 05 (產品特色) to after Slide 02 and change layout ---
const slide05Regex = /<!-- Slide 05: 核心玩法前導 \(嚴禁裝飾圖\) -->[\s\S]*?<\/section>/;
const slide05Match = content.match(slide05Regex);

if (slide05Match) {
    let slide05Html = slide05Match[0];
    
    // Modify Slide 05 layout
    slide05Html = slide05Html.replace(
        'style="flex-direction: column; padding: 60px 80px; justify-content: center;"',
        'style="justify-content: center; align-items: center; padding: 50px 70px; flex-direction: column;"'
    );
    
    // Modify Title
    const titleRegex = /<span class="slide-page-num">Page 05<\/span>\s*<div style="margin-bottom: 15px;">\s*<h2 class="slide-title">1\. 核心玩法 \(1\/4\)：產品特色<\/h2>\s*<\/div>/;
    const newTitle = `<div style="width: 95%; max-width: 1300px; display: flex; flex-direction: column; align-items: center;">
<div style="width: 100%; margin-bottom: 30px; text-align: center;">
<span class="slide-page-num" style="margin: 0 auto 10px auto; display: block; width: fit-content;">Page 05</span>
<h2 class="slide-title">1. 核心玩法 (1/4)：產品特色</h2>
</div>`;
    slide05Html = slide05Html.replace(titleRegex, newTitle);
    
    // Modify Grid to Flex
    slide05Html = slide05Html.replace(
        '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; margin-bottom: 35px;">',
        '<div style="display: flex; flex-direction: row; gap: 20px; width: 100%;">'
    );
    
    // Close the wrapper div
    slide05Html = slide05Html.replace('</section>', '</div>\n        </section>');
    
    // Remove original
    content = content.replace(slide05Match[0], '');
    
    // Insert after Slide 02
    const slide02EndIndex = content.indexOf('</section>', content.indexOf('<!-- Slide 02: 遊戲前導頁 -->')) + 10;
    content = content.substring(0, slide02EndIndex) + '\n\n        ' + slide05Html + content.substring(slide02EndIndex);
}

// --- TASK 2 & 3: Modify Slide 08 and create Slide 09 ---
const slide08Start = content.indexOf('<!-- Slide 08: 衝刺特色 -->');
const slide08End = content.indexOf('</section>', slide08Start) + 10;

const newSlide08Html = `<!-- Slide 08: 衝刺特色 -->
        <section class="slide-container" data-slide="8" style="justify-content: flex-start; align-items: stretch; flex-direction: row;">
            <!-- 左側文字區域 -->
            <div style="flex: 1; padding: 60px 40px 60px 80px; display: flex; flex-direction: column; justify-content: center;">
                <div style="width: 100%; margin-bottom: 30px; text-align: left;">
                    <span class="slide-page-num">Page 08</span>
                    <h2 class="slide-title">1. 核心玩法 (4/X)：衝刺</h2>
                </div>
                <div style="background: var(--bg-pearl); padding: 40px; border-radius: 20px; border-left: 8px solid var(--nintendo-red); box-shadow: var(--inset-shadow); text-align: left;">
                    <h3 style="font-size: 2.2rem; color: var(--text-dark); margin-bottom: 20px;">⚔️ 技巧走位，博弈快感</h3>
                    <p style="font-size: 1.4rem; color: var(--text-muted); line-height: 1.8;">
                        衝刺不僅僅是加速，更是遊戲中最核心的博弈手段。<br>
                        玩家必須精準控制體力消耗，利用衝刺來截斷對手的動線。<br>
                        打破傳統 IO 遊戲中「純粹依靠長度與數值壓制」的單調玩法，讓每一次交鋒都充滿了技巧博弈與反殺的刺激感。
                    </p>
                </div>
            </div>
            <!-- 右側影片區域 -->
            <div style="flex: 1; padding: 60px 80px 60px 40px; display: flex; justify-content: center; align-items: center;">
                <div style="width: 100%; height: 100%; border-radius: 20px; overflow: hidden; background: black; box-shadow: var(--card-shadow); display: flex; align-items: center; justify-content: center;">
                    <video class="demo-video" autoplay muted loop playsinline style="width: 100%; height: 100%; object-fit: contain;">
                        <source src="衝刺demo.mp4" type="video/mp4">
                    </video>
                </div>
            </div>
        </section>`;

const newSlide09Html = `<!-- Slide 09: 磁力漩渦 -->
        <section class="slide-container" data-slide="9" style="justify-content: flex-start; align-items: stretch; flex-direction: row;">
            <!-- 左側文字區域 -->
            <div style="flex: 1; padding: 60px 40px 60px 80px; display: flex; flex-direction: column; justify-content: center;">
                <div style="width: 100%; margin-bottom: 30px; text-align: left;">
                    <span class="slide-page-num">Page 09</span>
                    <h2 class="slide-title">1. 核心玩法 (5/X)：磁力漩渦</h2>
                </div>
                <div style="background: var(--bg-pearl); padding: 40px; border-radius: 20px; border-left: 8px solid var(--coin-yellow); box-shadow: var(--inset-shadow); text-align: left;">
                    <h3 style="font-size: 2.2rem; color: var(--text-dark); margin-bottom: 20px;">🧲 瞬間收割，扭轉戰局</h3>
                    <p style="font-size: 1.4rem; color: var(--text-muted); line-height: 1.8;">
                        磁力漩渦能夠瞬間吸入大範圍內的所有食物，是極具戰略價值的輔助技能。<br>
                        在資源密集區或對手死亡後，適時啟動磁力漩渦能迅速搶奪戰利品，大幅縮短發育時間，成為逆轉積分的關鍵操作。
                    </p>
                </div>
            </div>
            <!-- 右側影片區域 -->
            <div style="flex: 1; padding: 60px 80px 60px 40px; display: flex; justify-content: center; align-items: center;">
                <div style="width: 100%; height: 100%; border-radius: 20px; overflow: hidden; background: black; box-shadow: var(--card-shadow); display: flex; align-items: center; justify-content: center;">
                    <video class="demo-video" autoplay muted loop playsinline style="width: 100%; height: 100%; object-fit: contain;">
                        <source src="磁鐵demo.mp4" type="video/mp4">
                    </video>
                </div>
            </div>
        </section>`;

content = content.substring(0, slide08Start) + newSlide08Html + '\n\n        ' + newSlide09Html + content.substring(slide08End);


// --- TASK 4: Remove videos from Slide 16 ---
const slide16Start = content.indexOf('<!-- Slide 16: 主動技能 (1/2) -->');
if (slide16Start !== -1) {
    const slide16End = content.indexOf('</section>', slide16Start) + 10;
    let slide16Html = content.substring(slide16Start, slide16End);
    
    slide16Html = slide16Html.replace('class="slide-container top-bottom"', 'class="slide-container"');
    slide16Html = slide16Html.replace('style="justify-content: center; gap: 20px;"', 'style="justify-content: center; align-items: center; padding: 60px 80px; flex-direction: column;"');
    
    const topPartMatch = slide16Html.match(/<!-- 上半部文字與卡片 -->\s*<div class="slide-left"[\s\S]*?>([\s\S]*?)<\/div>\s*<!-- 下半部影片區域 -->/);
    if (topPartMatch) {
        const innerContent = topPartMatch[1].trim();
        const newSlide16Html = `<!-- Slide 16: 主動技能 (1/2) -->
        <section class="slide-container" data-slide="16" style="justify-content: center; align-items: center; padding: 60px 80px; flex-direction: column;">
            ${innerContent}
        </section>`;
        content = content.substring(0, slide16Start) + newSlide16Html + content.substring(slide16End);
    }
}


// --- TASK 5: Renumber ALL slides sequentially ---
const parts = content.split('<section class="slide-container');
let newContent = parts[0];

for (let i = 1; i < parts.length; i++) {
    let part = parts[i];
    
    // replace data-slide
    part = part.replace(/data-slide="\d+"/, `data-slide="${i}"`);
    
    // replace Page XX
    part = part.replace(/<span class="slide-page-num"[^>]*>Page \d+<\/span>/, `<span class="slide-page-num">Page ${String(i).padStart(2, '0')}</span>`);
    
    newContent += '<section class="slide-container' + part;
}
content = newContent;

// Fix 1. 核心玩法 (X/Y) numbering
const coreSlidesMatches = [...content.matchAll(/1\. 核心玩法 \((.*?)\)：/g)];
const coreCount = coreSlidesMatches.length;
let coreIndex = 1;
content = content.replace(/1\. 核心玩法 \((.*?)\)：/g, () => {
    return `1. 核心玩法 (${coreIndex++}/${coreCount})：`;
});

// Fix <!-- Slide XX: ... --> comments
let slideCommentIndex = 1;
content = content.replace(/<!-- Slide \d+: (.*?) -->/g, (match, title) => {
    return `<!-- Slide ${String(slideCommentIndex++).padStart(2, '0')}: ${title} -->`;
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully updated index.html');
