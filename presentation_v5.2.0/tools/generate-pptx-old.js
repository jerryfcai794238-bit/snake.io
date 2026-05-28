const pptxgen = require('pptxgenjs');
let pptx = new pptxgen();

// 設定 16:9 寬螢幕版面
pptx.layout = 'LAYOUT_16x9';

// 全域色彩與字型規範定義
const BG_COLOR = 'F8F9FA';    // 主背景色：溫暖珍珠白
const TEXT_DARK = '495057';   // 輔助結構色：墨灰色正文
const RED_BRAND = 'E60012';   // 品牌焦點色：任天堂紅
const GREEN_YOSHI = '3CD070'; // 品牌焦點色：耀西綠
const YELLOW_GOLD = 'FFD000'; // 品牌焦點色：金幣黃
const WHITE_PURE = 'FFFFFF';  // 珍珠白卡片填充

/**
 * 輔助函式：建立標準頁面背景與標題欄
 */
function createStandardSlide(titleText, categoryTag) {
    let slide = pptx.addSlide();
    
    // 1. 設定珍珠白全域背景色
    slide.background = { color: BG_COLOR };
    
    // 2. 繪製頂部 Slide 標題 (任天堂紅)
    slide.addText(titleText, {
        x: 0.8,
        y: 0.4,
        w: 8.0,
        h: 0.6,
        fontSize: 26,
        color: RED_BRAND,
        bold: true,
        fontFace: 'Arial'
    });
    
    // 3. 繪製精緻的遊戲化藥丸標籤 (Pill Badge)
    slide.addText(categoryTag, {
        x: 0.8,
        y: 1.1,
        w: 2.3,
        h: 0.35,
        fill: { color: RED_BRAND },
        color: WHITE_PURE,
        fontSize: 10,
        bold: true,
        align: 'center',
        valign: 'middle',
        fontFace: 'Arial'
    });
    
    return slide;
}

/**
 * 輔助函式：建立右側 3D 圖片佔位卡片
 */
function addImageCard(slide, x, y, w, h, placeholderTitle, detailsText) {
    // 1. 繪製帶有輕微邊框與暖白填充的卡片背景
    slide.addText("", {
        x: x,
        y: y,
        w: w,
        h: h,
        fill: { color: WHITE_PURE },
        line: { color: 'E9ECEF', width: 2 }
    });
    
    // 2. 寫入卡片內容與說明文字
    slide.addText(`【 3D 視覺示意卡片 】\n\n${placeholderTitle}\n\n${detailsText}\n\n💡 (配圖 DALL-E 3 提示詞已完整寫入此頁備忘錄 Notes 中，打開 PowerPoint 即可複製替換)`, {
        x: x + 0.3,
        y: y + 0.3,
        w: w - 0.6,
        h: h - 0.6,
        fontSize: 11,
        color: TEXT_DARK,
        align: 'center',
        valign: 'middle',
        fontFace: 'Arial'
    });
}

// ==========================================
// PPT Page 0: Cover Slide (首頁封面)
// ==========================================
let coverSlide = pptx.addSlide();
coverSlide.background = { color: BG_COLOR };

// 左側 Hero 級海報卡片
coverSlide.addText("", {
    x: 0.8,
    y: 1.0,
    w: 4.8,
    h: 5.5,
    fill: { color: WHITE_PURE },
    line: { color: RED_BRAND, width: 2.5 }
});
coverSlide.addText(`【 3D 封面英雄主視覺 】\n\n👑 戴著黃金皇冠的 Q版萌蛇主角\n在明亮歡樂的 3D 賽道上露出開心微笑\n周圍漂浮著金幣與亮麗的星星\n\n(DALL-E 3 提示詞已寫入備忘錄)\n(可在 PowerPoint 內替換生成圖)`, {
    x: 1.1,
    y: 1.3,
    w: 4.2,
    h: 4.9,
    fontSize: 12.5,
    color: TEXT_DARK,
    align: 'center',
    valign: 'middle',
    fontFace: 'Arial'
});

// 右側標題區域
coverSlide.addText("Snake.io 競技場", {
    x: 6.2,
    y: 2.2,
    w: 6.5,
    h: 1.2,
    fontSize: 48,
    color: RED_BRAND,
    bold: true,
    fontFace: 'Arial'
});
coverSlide.addText("項目提案簡報 ── 極致輕量快節奏 IO 競技場 (正式版)", {
    x: 6.2,
    y: 3.5,
    w: 6.5,
    h: 0.8,
    fontSize: 16,
    color: TEXT_DARK,
    bold: true,
    fontFace: 'Arial'
});

// 三個任天堂風格遊戲標籤
coverSlide.addText("休閒電競", {
    x: 6.2, y: 4.5, w: 1.6, h: 0.4,
    fill: { color: RED_BRAND }, color: WHITE_PURE, fontSize: 11, bold: true, align: 'center', valign: 'middle'
});
coverSlide.addText("高黏著度", {
    x: 7.9, y: 4.5, w: 1.6, h: 0.4,
    fill: { color: GREEN_YOSHI }, color: WHITE_PURE, fontSize: 11, bold: true, align: 'center', valign: 'middle'
});
coverSlide.addText("任天堂風格", {
    x: 9.6, y: 4.5, w: 1.8, h: 0.4,
    fill: { color: YELLOW_GOLD }, color: WHITE_PURE, fontSize: 11, bold: true, align: 'center', valign: 'middle'
});

// 首頁備忘錄
coverSlide.note = `【封面 Hero 主視覺 DALL-E 3 提示詞】：
(NO outlines, NO watermarks, NO text, NO logos, premium 3D claymation toy style, smooth matte vinyl plastic, cute Nintendo key art) An epic and cheerful 3D mobile game cover key art. A cute, chubby green snake wearing a shiny golden crown is sliding dynamically in the center of a bright, colorful grid arena, looking forward at the viewer with a big happy smile. Floating gold coins and sparkling yellow star particles drift in the air. Saturated vibrant colors, smooth matte clay and vinyl textures, bright cheerful studio lighting, professional clean light gray background.`;


// ==========================================
// PPT Page 1: Competitive Analysis (競品分析)
// ==========================================
let slide1 = createStandardSlide("參考競品資訊", "COMPETITIVE ANALYSIS");

// 加入副標題
slide1.addText("透過標竿競品分析，找出市場空白，以「加減法策略」打造差異化優勢。", {
    x: 3.2,
    y: 1.1,
    w: 9.0,
    h: 0.35,
    fontSize: 12,
    color: TEXT_DARK,
    fontFace: 'Arial'
});

// 建立競品分析表格
let tableRows = [
    [
        { text: "標竿競品", options: { fill: { color: TEXT_DARK }, color: WHITE_PURE, bold: true, align: 'center', fontSize: 11 } },
        { text: "競品痛點 / 市場空白", options: { fill: { color: TEXT_DARK }, color: WHITE_PURE, bold: true, align: 'center', fontSize: 11 } },
        { text: "本案優勢 (加減法策略)", options: { fill: { color: TEXT_DARK }, color: WHITE_PURE, bold: true, align: 'center', fontSize: 11 } }
    ],
    [
        { text: "Snake Clash", options: { bold: true, align: 'center', fontSize: 10.5, color: RED_BRAND, fill: { color: WHITE_PURE } } },
        { text: "偏向純數值壓制，正面對撞毫無懸念，缺乏操作反制手段。", options: { fontSize: 9.5, fill: { color: WHITE_PURE } } },
        { text: "【加法】引入靈活的 Dash 衝刺截斷反殺機制；撞擊或撞牆時融入直覺「回彈機制」，提高操作天花板。", options: { fontSize: 9.5, fill: { color: WHITE_PURE } } }
    ],
    [
        { text: "Snake.io", options: { bold: true, align: 'center', fontSize: 10.5, color: RED_BRAND, fill: { color: WHITE_PURE } } },
        { text: "經典但系統相對單一，局外缺乏深度的長線成長與金幣循環目標。", options: { fontSize: 9.5, fill: { color: WHITE_PURE } } },
        { text: "【加法】導入【成長之路】基礎人權養成與【局外科技樹】金幣黑洞，大幅強化局外 Meta Game 的策略深度。", options: { fontSize: 9.5, fill: { color: WHITE_PURE } } }
    ],
    [
        { text: "Snake Merge", options: { bold: true, align: 'center', fontSize: 10.5, color: RED_BRAND, fill: { color: WHITE_PURE } } },
        { text: "側重於局外的放置合成，局內戰力數值不平衡。", options: { fontSize: 9.5, fill: { color: WHITE_PURE } } },
        { text: "【加法】深度吸收外觀合成的成癮快感，但將其完全剝離局內戰力，轉化為「純外觀稀有度演化」，保持局內絕對公平。", options: { fontSize: 9.5, fill: { color: WHITE_PURE } } }
    ]
];
slide1.addTable(tableRows, {
    x: 0.8,
    y: 1.6,
    w: 6.5,
    h: 4.8,
    colW: [1.3, 2.2, 3.0],
    border: { type: 'solid', color: 'E9ECEF', pt: 1 }
});

// 右側 3D 配圖卡片
addImageCard(slide1, 7.6, 1.6, 4.9, 4.8, 
    "「技巧勝過數值」的 Standoff 戰鬥對決",
    "笨重遲鈍的 LV.99 紅色巨蟒正一臉驚震\n被一條小巧靈活的 3D 藍蛇以精準的 Dash 阻截"
);

// 備忘錄提示詞
slide1.note = `【競品分析配圖 DALL-E 3 提示詞】：
(NO outlines, NO watermarks, NO text, NO logos, premium 3D claymation toy style, smooth matte vinyl plastic, cute Nintendo key art) A humorous 3D game concept illustration in a clean Nintendo art style. A massive, slow-looking red dragon-snake decorated with numeric 'LV.99' labels looks shocked as a tiny, highly agile blue snake slickly dashes right in front of its head, cutting it off with a cartoonish white wind trail. The colors are highly saturated, using smooth matte clay textures. The scene represents 'Skill beats Raw Numbers' on a clean, professional light grey studio background.`;


// ==========================================
// PPT Page 2: Core Gameplay (核心玩法)
// ==========================================
let slide2 = createStandardSlide("核心玩法", "CORE GAMEPLAY");

// 引入段落
slide2.addText("極致輕量、快節奏的 IO 競技場──著重於「左手動態虛擬搖桿」與「右手極速 Dash 截斷反殺」的強對抗爽感電競。", {
    x: 3.2,
    y: 1.1,
    w: 9.0,
    h: 0.35,
    fontSize: 12.5,
    color: TEXT_DARK,
    fontFace: 'Arial'
});

// 搖桿卡片 (左)
slide2.addText("", { x: 0.8, y: 1.6, w: 3.1, h: 4.8, fill: { color: WHITE_PURE }, line: { color: 'E9ECEF', width: 2 } });
slide2.addText("👾 動態虛擬搖桿 (左手)", { x: 1.0, y: 1.9, w: 2.7, h: 0.4, fontSize: 14, color: RED_BRAND, bold: true, fontFace: 'Arial' });
slide2.addText("• 隨滑隨動控制：\n  零延遲、極流暢的觸控走位體驗。\n• 微操硬核走位：\n  提供細密轉彎半徑，讓小蛇在激戰中心能進行極限穿梭與精細微操避險，不論新手或高手皆能快速絲滑上手。", {
    x: 1.0,
    y: 2.4,
    w: 2.7,
    h: 3.6,
    fontSize: 11.5,
    color: TEXT_DARK,
    fontFace: 'Arial'
});

// 衝刺卡片 (右)
slide2.addText("", { x: 4.1, y: 1.6, w: 3.1, h: 4.8, fill: { color: WHITE_PURE }, line: { color: 'E9ECEF', width: 2 } });
slide2.addText("⚡ 極速 Dash 衝刺 (右手)", { x: 4.3, y: 1.9, w: 2.7, h: 0.4, fontSize: 14, color: RED_BRAND, bold: true, fontFace: 'Arial' });
slide2.addText("• 爆發 1.25x 速度：\n  按住時以消耗精力為代價獲得爆發位移，是追擊或截斷對手的殺招。\n• 截斷對手動線：\n  在毫秒級的走位空檔中，瞬間爆發超前甩尾堵截對手頭部，創造瞬間絕地反殺的極致多玩家競技快感。", {
    x: 4.3,
    y: 2.4,
    w: 2.7,
    h: 3.6,
    fontSize: 11.5,
    color: TEXT_DARK,
    fontFace: 'Arial'
});

// 右側 3D 圖片卡片
addImageCard(slide2, 7.4, 1.6, 5.1, 4.8,
    "高張力對戰截圖（含透明 HUD 點綴）",
    "一隻可愛的綠蛇快速甩尾擋在紅蛇前方\n碰撞處迸發出 Q 彈的 3D 黃色碰撞星效，左右下角具備透明 HUD 浮出"
);

// 備忘錄提示詞
slide2.note = `【核心玩法配圖 DALL-E 3 提示詞】：
(NO outlines, NO watermarks, NO text, NO logos, premium 3D claymation toy style, smooth matte vinyl plastic, cute Nintendo key art) A dynamic 3D mobile game concept illustration in the Nintendo art style, showcasing a high-tension combat moment. An agile green snake is executing a high-speed curved turn, successfully cutting off a chubby orange snake. The orange snake's head bumps into the green snake's body, producing sparkling yellow cartoon collision star effects. In the corners, a semi-transparent mobile game HUD overlay with a dynamic joystick on the left and a large red 'Dash' button on the right is subtly visible. Vibrant saturated colors, matte plastic shaders, bright cheerful lighting, and a clean light gray background.`;


// ==========================================
// PPT Page 3: Game Modes (遊戲模式)
// ==========================================
let slide3 = createStandardSlide("遊戲模式", "GAME MODES");

slide3.addText("層次分明的三種競技體驗，從新手熟悉到團隊協作，構建完整成長鏈。", {
    x: 3.2,
    y: 1.1,
    w: 9.0,
    h: 0.35,
    fontSize: 12.5,
    color: TEXT_DARK,
    fontFace: 'Arial'
});

// 模式列表 (左側)
const modesData = [
    { title: "🟢 Solo (單人練習) ── 1P vs 7 BOTs", text: "新手熟悉操作、追求極限分數與鍛鍊走位無壓樂園。無網路要求，流暢即開即玩。", color: GREEN_YOSHI, y: 1.6 },
    { title: "🔵 大亂鬥 (競技對戰) ── 1P vs 1P(或AI) vs 6 BOTs", text: "模擬真實賽事，衝擊排行榜積分的核心賽場，考驗極限走位、包圍與衝刺戰術。", color: RED_BRAND, y: 3.2 },
    { title: "🟡 團體賽 (陣營對抗) ── 4 vs 4 紅白大對抗", text: "隊友（BOT）跟隨玩家行動作戰，協作包圍掠奪，追求團隊總積分壓制，開創輕團戰玩法。", color: YELLOW_GOLD, y: 4.8 }
];

modesData.forEach(item => {
    slide3.addText("", { x: 0.8, y: item.y, w: 6.5, h: 1.4, fill: { color: WHITE_PURE }, line: { color: 'E9ECEF', width: 2 } });
    slide3.addText(item.title, { x: 1.0, y: item.y + 0.15, w: 6.1, h: 0.3, fontSize: 13.5, color: item.color, bold: true, fontFace: 'Arial' });
    slide3.addText(item.text, { x: 1.0, y: item.y + 0.5, w: 6.1, h: 0.8, fontSize: 11, color: TEXT_DARK, fontFace: 'Arial' });
});

// 右側 3D 圖片卡片
addImageCard(slide3, 7.5, 1.6, 5.0, 4.6,
    "玩家歷程三階段演化圖",
    "三格 3D 視窗與一條金色發光漸進箭頭貫穿\n左側 Solo 悠閒吃豆 ➔ 中間亂鬥激烈對搶 ➔ 右側團戰協作包抄"
);

// 備忘錄提示詞
slide3.note = `【遊戲模式配圖 DALL-E 3 提示詞】：
(NO outlines, NO watermarks, NO text, NO logos, premium 3D claymation toy style, smooth matte vinyl plastic, cute Nintendo key art) A premium 3D presentation infographic in a clean Nintendo art style, illustrating a player's progression journey. The screen is split into three distinct side-by-side rounded viewing portals, with a glowing gold arrow pointing horizontally from left to right across all three. The leftmost portal represents SOLO mode, showing a single happy green snake sliding in a peaceful grassy field. The center portal represents BATTLE ROYALE mode, showing an agile blue snake executing a quick dash to compete against an orange snake in a dynamic stadium. The rightmost portal represents TEAM BATTLE, showing a group of red snakes wearing crowns cooperating to surround a huge golden mushroom. The colors are highly saturated, textures are smooth matte clay, and the lighting is bright and clean against a professional light grey background.`;


// ==========================================
// PPT Page 4: Skills & Items (局內機制：技能與道具設計)
// ==========================================
let slide4 = createStandardSlide("局內機制：技能與道具設計", "SKILLS & ITEMS");

// 左側主體內容 (主動技能與道具)
slide4.addText("⚡ 核心主動技能 (HUD 右下角)", { x: 0.8, y: 1.6, w: 6.5, h: 0.35, fontSize: 14, color: RED_BRAND, bold: true, fontFace: 'Arial' });
slide4.addText("", { x: 0.8, y: 2.05, w: 6.5, h: 1.6, fill: { color: WHITE_PURE }, line: { color: 'E9ECEF', width: 2 } });
slide4.addText("• Dash (衝刺)：消耗體力爆發。引入【超載機制】，當體力耗盡後直到完全恢復前都無法使用，有效考驗走位博弈。\n• 磁力漩渦 (30s CD)：瞬間吸附周圍半徑 200px 內所有食物，是不容忽視的局內反超與吸豆神招，操作反饋極強。", {
    x: 1.0,
    y: 2.2,
    w: 6.1,
    h: 1.3,
    fontSize: 11,
    color: TEXT_DARK,
    fontFace: 'Arial'
});

slide4.addText("🍄 隨機地圖道具 (持續時間 10 秒)", { x: 0.8, y: 3.8, w: 6.5, h: 0.35, fontSize: 14, color: GREEN_YOSHI, bold: true, fontFace: 'Arial' });
slide4.addText("", { x: 0.8, y: 4.25, w: 6.5, h: 2.15, fill: { color: WHITE_PURE }, line: { color: 'E9ECEF', width: 2 } });
slide4.addText("• 磁鐵：原主動技能轉為地圖道具。10秒吸附食物，引導走向高風險區。\n• 巨大蘑菇：體型 1.5x，獲得【免疫截斷霸體】，但移動速度下降 20% 副作用。將大蛇對弱者的碾壓感發揮至極致。\n• 幸運 7：食物價值翻 7 倍，製造局內積分暴漲的短期刺激高潮點。", {
    x: 1.0,
    y: 4.4,
    w: 6.1,
    h: 1.8,
    fontSize: 11,
    color: TEXT_DARK,
    fontFace: 'Arial'
});

// 右側 3D 圖片卡片
addImageCard(slide4, 7.5, 1.6, 5.0, 4.8,
    "三大核心隨機道具的 3D 立體展示",
    "白色展示台上陳列著可愛的紅斑巨大蘑菇\n釋放磁力波紋的紅色馬蹄鐵磁鐵、以及刻有 '7' 字的閃亮金幣"
);

// 備忘錄提示詞
slide4.note = `【道具設計配圖 DALL-E 3 提示詞】：
(NO outlines, NO watermarks, NO text, NO logos, premium 3D claymation toy style, smooth matte vinyl plastic, cute Nintendo key art) A high-quality 3D game asset showcase in the Nintendo art style. Three iconic power-up items are neatly displayed on a clean white pedestal: a cute red-and-white spotted 'Giant Mushroom', a red horseshoe magnet releasing soft blue magnetic waves, and a shiny gold coin engraved with a lucky number '7'. The colors are vibrant and saturated, utilizing smooth matte plastic and soft clay shaders under bright, professional studio lighting, with a clean light gray background.`;


// ==========================================
// PPT Page 5: Dual Progression Path (局外雙軌養成系統)
// ==========================================
let slide5 = createStandardSlide("局外雙軌養成系統", "DUAL PROGRESSION PATH");

// 路徑一 (卡片)
slide5.addText("", { x: 0.8, y: 1.6, w: 6.5, h: 2.2, fill: { color: WHITE_PURE }, line: { color: 'E9ECEF', width: 2 } });
slide5.addText("🟢 【路徑一：成長之路】核心技能長線成長", { x: 1.0, y: 1.8, w: 6.1, h: 0.35, fontSize: 13.5, color: GREEN_YOSHI, bold: true, fontFace: 'Arial' });
slide5.addText("• Dash 衝刺增幅：升級「體力上限」與「體力回復速率」，強化位移能力。\n• 磁力漩渦增幅：升級「基礎吸附半徑」與「縮短冷卻時間 (CD)」。\n• 養成本質：作為大眾玩家的基礎人權進度，透過遊戲收集解鎖。", { x: 1.0, y: 2.25, w: 6.1, h: 1.4, fontSize: 11, color: TEXT_DARK, fontFace: 'Arial' });

// 路徑二 (卡片)
slide5.addText("", { x: 0.8, y: 4.0, w: 6.5, h: 2.4, fill: { color: WHITE_PURE }, line: { color: 'E9ECEF', width: 2 } });
slide5.addText("🟡 【路徑二：科技樹】功能性被動 Perks", { x: 1.0, y: 4.2, w: 6.1, h: 0.35, fontSize: 13.5, color: YELLOW_GOLD, bold: true, fontFace: 'Arial' });
slide5.addText("• 戰術與視野分支：【鷹眼】獲得更高相機視野縮放高度，料敵先機。\n• 道具持續分支：【磁鐵/蘑菇/幸運7增幅】延長持續秒數，降低蘑菇減速惩罰。\n• 生存與容錯分支：【免死金牌】獲得單局一次防截斷自殺豁免；【極速回生】大幅降低重生復活的等待時間。", { x: 1.0, y: 4.65, w: 6.1, h: 1.6, fontSize: 11, color: TEXT_DARK, fontFace: 'Arial' });

// 右側 3D 圖片卡片
addImageCard(slide5, 7.5, 1.6, 5.0, 4.8,
    "小蛇的「戰前裝備更衣室」",
    "可愛小蛇得意地戴著鷹眼防護鏡\n背著馬蹄鐵磁背包，四周飄浮Perk圖示，展現戰術裝備趣味"
);

// 備忘錄提示詞
slide5.note = `【局外雙軌配圖 DALL-E 3 提示詞】：
(NO outlines, NO watermarks, NO text, NO logos, premium 3D claymation toy style, smooth matte vinyl plastic, cute Nintendo key art) A playful 3D game concept illustration in the Nintendo art style, showing a cute yellow snake preparing for battle inside a toy-like 'Locker Room'. The snake is proudly wearing tactical gear that represents in-game perks: glowing high-tech aviator goggles representing 'Eagle Eye' and a small red backpack magnet representing 'Magnet Boost'. Floating gold stars and round green perk icons hover around the character. Saturated colors, smooth matte plastic and clay textures, under warm, soft studio lighting, on a clean light gray background.`;


// ==========================================
// PPT Page 6: Product Strategy (6+6 選品策略)
// ==========================================
let slide6 = createStandardSlide("6+6 選品策略", "PRODUCT STRATEGY");

// 策略一
slide6.addText("", { x: 0.8, y: 1.6, w: 6.5, h: 2.3, fill: { color: WHITE_PURE }, line: { color: RED_BRAND, width: 2 } });
slide6.addText("🔴 【成功策略】主題換新．經典再造", { x: 1.0, y: 1.8, w: 6.1, h: 0.35, fontSize: 14, color: RED_BRAND, bold: true, fontFace: 'Arial' });
slide6.addText("• 攜帶式技能科技樹 (Perks)：以功能性局外金幣科技樹，打破傳統休閒 IO 競技內隨機運氣的死局，將策略主導權交給玩家。\n• 真人與擬真 AI 無縫切入：真人玩家不足時，由智慧 AI 補滿戰局，保持毫秒即配、無縫開局的多玩家對抗痛快氛圍。", { x: 1.0, y: 2.25, w: 6.1, h: 1.5, fontSize: 11, color: TEXT_DARK, fontFace: 'Arial' });

// 策略二
slide6.addText("", { x: 0.8, y: 4.1, w: 6.5, h: 2.3, fill: { color: WHITE_PURE }, line: { color: RED_BRAND, width: 2 } });
slide6.addText("🔴 【核心心理】降低懲罰與爽快節奏平衡", { x: 1.0, y: 4.3, w: 6.1, h: 0.35, fontSize: 14, color: RED_BRAND, bold: true, fontFace: 'Arial' });
slide6.addText("• 撞牆與碰撞安全回彈：全新加入「衝撞物理回彈不致死」，極大地消除了傳統贪食蛇一碰即死的生硬感與高挫敗感。\n• 2秒復活幽靈保護：極速重生配合幽靈無敵穿梭，徹底卸下玩家的失去感，讓其能全身心投入爽快的連續搶奪中。", { x: 1.0, y: 4.75, w: 6.1, h: 1.5, fontSize: 11, color: TEXT_DARK, fontFace: 'Arial' });

// 右側 3D 圖片卡片
addImageCard(slide6, 7.5, 1.6, 5.0, 4.8,
    "輕鬆解壓的「碰撞回彈機制」示意圖",
    "可愛圓潤的 3D 小蛇一頭撞在鬆軟的棉花牆壁上\n臉上帶著俏皮的眼花微笑，回彈出可愛的黃色卡通星星特效"
);

// 備忘錄提示詞
slide6.note = `【選品策略配圖 DALL-E 3 提示詞】：
(NO outlines, NO watermarks, NO text, NO logos, premium 3D claymation toy style, smooth matte vinyl plastic, cute Nintendo key art) A high-quality 3D game concept illustration in a clean Nintendo art style. A cute, chubby snake bounces safely off a soft, pillowy white brick wall, producing playful yellow cartoon star impact ripples. The snake is smiling happily with a dizzy but cheerful expression. In the soft-focus background, a stylized golden tree decorated with shiny gold coins and round game perk icons is visible. Vibrant saturated colors, smooth claymation textures, warm bright lighting, and a clean professional light grey background.`;


// ==========================================
// PPT Page 7: Coin Sinks & Synthesis (金幣回收與合成循環)
// ==========================================
let slide7 = createStandardSlide("金幣回收與合成循環", "COIN SINKS & SYNTHESIS");

// 流程簡介 (高亮)
slide7.addText("", { x: 0.8, y: 1.6, w: 6.5, h: 0.8, fill: { color: 'F1F3F5' }, line: { color: 'E9ECEF', width: 1.5 } });
slide7.addText("🔄 核心經濟流向閉環：\n【玩遊戲】➔【消耗金幣升級科技 Perks】➔【衝排行榜】➔【結算季皮膚】➔【金幣合成升星】➔【局內秀極致外觀】", {
    x: 0.9, y: 1.7, w: 6.3, h: 0.6, fontSize: 10, color: RED_BRAND, bold: true, align: 'center', fontFace: 'Arial'
});

// 金幣回收描述卡片
slide7.addText("", { x: 0.8, y: 2.6, w: 6.5, h: 3.8, fill: { color: WHITE_PURE }, line: { color: 'E9ECEF', width: 2 } });
slide7.addText("💰 三大核心金幣回收黑洞", { x: 1.0, y: 2.8, w: 6.1, h: 0.35, fontSize: 14, color: TEXT_DARK, bold: true, fontFace: 'Arial' });
slide7.addText("• 1. Solo 模式局末延時：\n  對局時間剩餘時，允許消耗金幣延時續命。作為碎片化的即時消耗點。\n• 2. Perks 科技樹剛性升級：\n  這是全體玩家為了在天梯大亂鬥維持高勝率、爭奪冠亞軍的硬核屬性升級意願，日常金幣回收量極其可觀。\n• 3. 皮膚工坊合成手續費 (3合1機率星級制)：\n  皮膚分為 1-5 星（戰力無差異）。合成高星皮膚需消耗【3個同星級皮膚 + 指數呈暴增的手續費】，手續費完美回收局內溢出金幣，拒絕經濟通膨！", {
    x: 1.0,
    y: 3.25,
    w: 6.1,
    h: 3.0,
    fontSize: 10.5,
    color: TEXT_DARK,
    fontFace: 'Arial'
});

// 右側 3D 圖片卡片
addImageCard(slide7, 7.5, 1.6, 5.0, 4.8,
    "皮膚工坊「扭蛋融合艙」",
    "合成車間內，三個同款 1 星藍玩偶小蛇\n被送入玻璃融聚發光艙內，合成一個 2 星紫色帶翼飛龍蛇"
);

// 備忘錄提示詞
slide7.note = `【經濟循環配圖 DALL-E 3 提示詞】：
(NO outlines, NO watermarks, NO text, NO logos, premium 3D claymation toy style, smooth matte vinyl plastic, cute Nintendo key art) A premium 3D game UI concept illustration in the Nintendo art style, showcasing a 'Skin Fusion Workshop'. In the center, three identical cute 1-star blue snake figurines are combining into a glowing, sparkling 2-star purple dragon-snake inside a glossy, futuristic toy capsule fusion machine. Gold coins rain down in the background amid playful yellow sparks. Vibrant saturated colors, smooth claymation and plastic textures, warm playful lighting, and a clean professional light grey background.`;


// ==========================================
// PPT Page 8: Art Style & Visual (美術風格與視覺爽感)
// ==========================================
let slide8 = createStandardSlide("美術風格與視覺爽感", "ART STYLE & VISUAL");

// 美術風格 (卡片)
slide8.addText("", { x: 0.8, y: 1.6, w: 6.5, h: 2.2, fill: { color: WHITE_PURE }, line: { color: 'E9ECEF', width: 2 } });
slide8.addText("🎨 任天堂高級 3D 卡通風", { x: 1.0, y: 1.8, w: 6.1, h: 0.35, fontSize: 13.5, color: RED_BRAND, bold: true, fontFace: 'Arial' });
slide8.addText("• 現代 3D 卡通：\n  色彩高對比、高飽和且乾淨俐落，展現頂級手遊畫面的精緻度。\n• 微黏土與塑料質感：\n  圓潤飽滿、帶有微光澤霧面塑料的 Q 版 3D 造型，給人極強的觸摸沉浸玩具感。\n• 明亮休閒：視覺輕鬆愉快，對女性玩家與全年齡層具備大眾親和殺傷力。", { x: 1.0, y: 2.25, w: 6.1, h: 1.4, fontSize: 10.5, color: TEXT_DARK, fontFace: 'Arial' });

// 視覺爽感 (卡片)
slide8.addText("", { x: 0.8, y: 4.0, w: 6.5, h: 2.4, fill: { color: WHITE_PURE }, line: { color: 'E9ECEF', width: 2 } });
slide8.addText("✨ 視覺回饋「爽感」設計", { x: 1.0, y: 4.2, w: 6.1, h: 0.35, fontSize: 13.5, color: RED_BRAND, bold: true, fontFace: 'Arial' });
slide8.addText("• Q彈吞吐特效：拾取資源時伴隨縮放微震音效；擊殺瞬間對手炸裂為發光星海。\n• 絕炫星級拖尾特效：衝刺時蛇身附帶流光軌跡；【皮膚星級越高，衝刺與釋放磁力漩渦時的粒子特效越無比震撼】！\n• 虛榮心拉滿：高星皮膚能讓玩家成為整條街最亮的焦點，極致彰顯局內付費成就。", { x: 1.0, y: 4.65, w: 6.1, h: 1.6, fontSize: 10.5, color: TEXT_DARK, fontFace: 'Arial' });

// 右側 3D 圖片卡片
addImageCard(slide8, 7.5, 1.6, 5.0, 4.8,
    "極致視覺高潮與虛榮心展示",
    "一隻炫酷的頂級 5 星黃金飛龍皮膚蛇\n在加速衝刺時釋放華麗奪目的流光軌跡，漫天飄落金幣與金粉特效"
);

// 備忘錄提示詞
slide8.note = `【美術視覺配圖 DALL-E 3 提示詞】：
(NO outlines, NO watermarks, NO text, NO logos, premium 3D claymation toy style, smooth matte vinyl plastic, cute Nintendo key art) A premium 3D game concept illustration in the Nintendo art style, showcasing an ultra-premium 5-star golden dragon-skin snake character in dynamic action. The snake is dashing forward, leaving a spectacular sparkling trail of floating gold coins, bright colorful stars, and glowing rainbow particle trails. High-contrast vibrant colors, glossy gold and matte vinyl toy textures, incredible magical particle effects, bright cheerful lighting, and a clean light gray background.`;


// ==========================================
// PPT Page 9: Q&A (問與答)
// ==========================================
let slide9 = createStandardSlide("Q&A (問與答)", "THANK YOU & QUESTIONS");

// 左側致謝與亮點回顧
slide9.addText("", { x: 0.8, y: 1.6, w: 6.5, h: 4.5, fill: { color: WHITE_PURE }, line: { color: RED_BRAND, width: 2.5 } });
slide9.addText("🤝 感謝您的聆聽，期待攜手共創爆款！", { x: 1.1, y: 1.9, w: 5.9, h: 0.4, fontSize: 16.5, color: RED_BRAND, bold: true, fontFace: 'Arial' });
slide9.addText("🏆 本項目核心優勢回顧：\n\n• 玩法極致爽快：\n  以「Dash 衝刺截斷」與「磁力漩渦」打造超高黏著度的休閒微電競。\n• 數據安全落地：\n  獨創「碰撞回彈與重生無敵幽靈保護」，有效降低獲客成本 (CPI) 並衝高次日留存。\n• 強大商業變現：\n  局外科技樹 ＋ 皮膚工坊 3合1 合成，建立極致健康的經濟回收黑洞與付費驅動力。\n\n歡迎各位前輩、合作夥伴提問與深度交流！", {
    x: 1.1,
    y: 2.4,
    w: 5.9,
    h: 3.4,
    fontSize: 11,
    color: TEXT_DARK,
    fontFace: 'Arial'
});

// 右側 3D 圖片卡片
addImageCard(slide9, 7.5, 1.6, 5.0, 4.5,
    "「感謝聆聽與交流」的友好群體畫像",
    "紅、綠、藍多隻圓滾滾的 3D Q版小蛇聚在一起對著觀眾揮手微笑\n中央懸浮一個發光金色巨大問號標誌，漫天彩屑飛舞"
);

// 備忘錄提示詞
slide9.note = `【Q&A配圖 DALL-E 3 提示詞】：
(NO outlines, NO watermarks, NO text, NO logos, premium 3D claymation toy style, smooth matte vinyl plastic, cute Nintendo key art) A warm and welcoming 3D illustration in a premium Nintendo art style. A group of cute, chubby colorful snakes (one red, one green, one blue) are smiling happily and waving together. In the center, a large, glossy golden question mark symbol floats in the air surrounded by sparkling gold stars and soft confetti. Saturated colors, smooth matte clay and vinyl textures, bright cheerful studio lighting, professional Q&A slide for a pitch deck, on a clean light gray background.`;


// ==========================================
// 存檔輸出簡報 (.pptx)
// ==========================================
const outputFileName = 'Snake.io_競技場_提案簡報.pptx';
console.log('🔄 正在編譯 PPTX 投影片...');

pptx.writeFile({ fileName: outputFileName })
    .then(fileName => {
        console.log(`\n======================================================`);
        console.log(`🎉 恭喜！實體簡報已成功生成並導出至工作區！`);
        console.log(`📁 檔案名稱：${fileName}`);
        console.log(`🎯 套用設計：任天堂 3D 黏土活力風、卡片式左右結構、自訂優勢表格`);
        console.log(`📝 貼心加分：每張幻燈片的生圖提示詞均已完美嵌入【簡報者備忘錄】！`);
        console.log(`======================================================\n`);
    })
    .catch(err => {
        console.error('❌ PPTX 生成失敗：', err);
    });
