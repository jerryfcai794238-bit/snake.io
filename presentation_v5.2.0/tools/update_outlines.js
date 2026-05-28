const fs = require('fs');

// Gamma 版
let gammaContent = fs.readFileSync('提案簡報大綱_Gamma專用版.txt', 'utf8');

for (let i = 10; i >= 2; i--) {
    gammaContent = gammaContent.replace(new RegExp('Page ' + i + ':', 'g'), 'Page ' + (i+1) + ':');
}

const gammaNewPage = `## ## Page 2: 競品市場下載數據分析
### 主流休閒 .io 龐大的用戶基數潛力
- **Snake.io (Kooapps)**：
  - **總下載量**：約 5 億 ~ 6 億次以上（Google Play 5億+，iOS 數千萬次）。
  - **亮點**：該品類移動端用戶基數最龐大的產品之一。
- **Snake Clash! (Supercent)**：
  - **總下載量**：約 1.1 億 ~ 1.3 億次（Google Play 1億+，iOS 約 2,000萬次）。
  - **亮點**：2023年中推出的黑馬，單月仍維持數百萬全球增量。
- **Snake Merge (Hippo Lab)**：
  - **總下載量**：約 5,200 萬 ~ 5,500 萬次（Google Play 5,000萬+）。
  - **亮點**：將 Merge 養成結合 .io 輕競技，展現複合玩法的吸量能力。

\`\`\`text
⚠️ [此框僅用於生圖，請勿貼入簡報文字]
【插圖主旨】：三款競品的下載量數據視覺化比較（柱狀圖與立體金幣）
【核心動作提示詞】(直接複製貼入 Gamma 生圖框即可)：
A premium 3D business infographic in Nintendo style. A colorful, glossy 3D bar chart showing three towering pillars of different heights (representing Snake.io, Snake Clash, and Snake Merge). Cute chubby toy snakes are sitting on top of each glowing pillar, with stacks of shiny gold coins scattered around the base. Soft volumetric lighting, clean studio background.
\`\`\`

---

`;
gammaContent = gammaContent.replace('## ## Page 3: 參考競品與加減法策略', gammaNewPage + '## ## Page 3: 參考競品與加減法策略');
fs.writeFileSync('提案簡報大綱_Gamma專用版.txt', gammaContent);


// 正常版
let normalContent = fs.readFileSync('提案簡報大綱.txt', 'utf8');

for (let i = 10; i >= 1; i--) {
    normalContent = normalContent.replace(new RegExp('PPT Page ' + i + ':', 'g'), 'PPT Page ' + (i+1) + ':');
}

const normalNewPage = `## PPT Page 1: 競品市場下載數據分析 (Market Data Analysis)
- **主流休閒 .io 龐大的用戶基數潛力**：
  * **Snake.io (Kooapps)**：雙平台累計約 **5 億 ~ 6 億次以上**（Google Play 5億+，iOS 數千萬次）。該品類移動端用戶基數最龐大的產品。
  * **Snake Clash! (Supercent)**：雙平台累計約 **1.1 億 ~ 1.3 億次**（Google Play 1億+，iOS 約 2,000萬次）。2023年中推出的黑馬。
  * **Snake Merge (Hippo Lab)**：雙平台累計約 **5,200 萬 ~ 5,500 萬次**（Google Play 5,000萬+）。融合養成與輕競技的複合玩法成功案例。
- **數據來源備註**：官方商店（Google Play/App Store）公開數據，以及 Sensor Tower、AppMagic 等第三方市場平台推估模型。
- **[視覺與圖表建議]**：
  * **下載量對比立體柱狀圖**：以三個不同高度的高質感 3D 圓柱體代表這三款遊戲，圓柱體上方各坐著一隻對應風格的萌蛇，柱體周圍散落大量金幣，直觀呈現市場量級。
  * **AI 繪圖提示詞 (Midjourney / Gemini 適用)**：
    > \`A premium 3D business infographic in Nintendo Mario-style. A colorful, glossy 3D bar chart showing three towering pillars of different heights. Cute chubby toy snakes are sitting on top of each glowing pillar, with stacks of shiny gold coins scattered around the base. Saturated colors, smooth matte plastic textures, bright clean lighting, clean light gray background --ar 16:9 --v 6.0\`

---

`;
normalContent = normalContent.replace('## PPT Page 2: 參考競品資訊 (Competitive Analysis)', normalNewPage + '## PPT Page 2: 參考競品資訊 (Competitive Analysis)');
fs.writeFileSync('提案簡報大綱.txt', normalContent);
console.log('Update successful');
