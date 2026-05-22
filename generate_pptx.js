const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');

// 初始化 PptxGenJS
const pptx = new pptxgen();
pptx.defineLayout({ name: 'CUSTOM_16_9', width: 13.33, height: 7.5 });
pptx.layout = 'CUSTOM_16_9';

// 全域設計系統顏色
const COLORS = {
  bg: 'F8F9FA',         // 珍珠白背景
  textDark: '2B2D42',   // 深藍灰文字
  textMuted: '5C677D',  // 灰藍色正文
  nintendoRed: 'E60012',// 任天堂紅
  yoshiGreen: '3CD070', // 耀西綠
  coinYellow: 'FFD000', // 金幣黃
  white: 'FFFFFF',      // 白色卡片背景
  lightGray: 'E2E8F0',  // 邊框淺灰色
  black: '000000'       // 影片容器背景
};

// 全域字體配置
const FONTS = {
  title: 'Microsoft JhengHei', // 標題字型 (微軟正黑體)
  body: 'Microsoft JhengHei',  // 正文字型
  en: 'Arial'                  // 英文/數字字型
};

// 輔助函數：取得多媒體絕對路徑，若不存在則回傳 null
function getMediaPath(filename) {
  const filePath = path.resolve(__dirname, 'presentation_v5.2.0', filename);
  if (fs.existsSync(filePath)) {
    return filePath;
  }
  const rootPath = path.resolve(__dirname, filename);
  if (fs.existsSync(rootPath)) {
    return rootPath;
  }
  console.warn(`Warning: Media file not found: ${filename}`);
  return null;
}

// 輔助函數：建立基礎投影片 (包含珍珠白背景、Page 標籤與頂部紅裝飾線)
function createBaseSlide(pageStr, titleText) {
  const slide = pptx.addSlide();
  
  // 1. 設定珍珠白背景
  slide.background = { fill: COLORS.bg };
  
  // 2. 左上角 Page 標籤
  slide.addText(pageStr, {
    x: 0.5,
    y: 0.4,
    w: 1.2,
    h: 0.3,
    fontSize: 12,
    fontFace: FONTS.en,
    color: COLORS.nintendoRed,
    bold: true,
    align: 'left',
    valign: 'middle'
  });
  
  // 3. 頂部紅色裝飾橫線
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 1.6,
    y: 0.53,
    w: 11.2,
    h: 0.02,
    fill: { color: COLORS.nintendoRed },
    line: null
  });
  
  // 4. 頂部主標題
  slide.addText(titleText, {
    x: 0.5,
    y: 0.7,
    w: 12.3,
    h: 0.6,
    fontSize: 24,
    fontFace: FONTS.title,
    color: COLORS.textDark,
    bold: true,
    align: 'left',
    valign: 'middle'
  });
  
  return slide;
}

// 輔助函數：在投影片中繪製一個白色卡片，左側有粗裝飾邊框 (所有元件均原生、可編輯)
function drawCard(slide, { x, y, w, h, borderLeftColor, title, text }) {
  // 1. 白色卡片背景與灰色細邊框
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: x,
    y: y,
    w: w,
    h: h,
    fill: { color: COLORS.white },
    line: { color: COLORS.lightGray, width: 1 }
  });
  
  // 2. 左側粗邊框 (模擬 border-left: 6px solid)
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: x,
    y: y,
    w: 0.08,
    h: h,
    fill: { color: borderLeftColor },
    line: null
  });
  
  // 3. 卡片內部的標題
  if (title) {
    slide.addText(title, {
      x: x + 0.2,
      y: y + 0.15,
      w: w - 0.3,
      h: 0.35,
      fontSize: 15,
      fontFace: FONTS.title,
      color: COLORS.textDark,
      bold: true,
      align: 'left',
      valign: 'top'
    });
  }
  
  // 4. 卡片內部的正文
  if (text) {
    const textY = title ? y + 0.55 : y + 0.15;
    const textH = title ? h - 0.7 : h - 0.3;
    slide.addText(text, {
      x: x + 0.2,
      y: textY,
      w: w - 0.3,
      h: textH,
      fontSize: 11,
      fontFace: FONTS.body,
      color: COLORS.textMuted,
      align: 'left',
      valign: 'top',
      lineSpacing: 18 // 行高調成更易讀
    });
  }
}

// 輔助函數：建立過渡頁
function createDividerSlide(titleText, englishSubtitle) {
  const slide = pptx.addSlide();
  slide.background = { fill: COLORS.bg };
  
  // 居中大字標題
  slide.addText(titleText, {
    x: 0.5,
    y: 2.8,
    w: 12.33,
    h: 1.0,
    fontSize: 44,
    fontFace: FONTS.title,
    color: COLORS.nintendoRed,
    bold: true,
    align: 'center',
    valign: 'middle'
  });
  
  // 英文副標題
  slide.addText(englishSubtitle, {
    x: 0.5,
    y: 3.9,
    w: 12.33,
    h: 0.6,
    fontSize: 20,
    fontFace: FONTS.en,
    color: COLORS.textMuted,
    bold: true,
    align: 'center',
    valign: 'middle'
  });
  
  return slide;
}

// 輔助函數：在指定區域嵌入影片或圖片，並加上黑色外框容器 (若不存在則預留版面)
function drawMedia(slide, { x, y, w, h, filename, isVideo = false }) {
  const mediaPath = getMediaPath(filename);
  
  // 1. 先畫黑色背景容器，使其有高級感與統一外觀
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: x,
    y: y,
    w: w,
    h: h,
    fill: { color: COLORS.black },
    line: { color: COLORS.lightGray, width: 1 }
  });
  
  if (mediaPath) {
    if (isVideo) {
      // 2. 嵌入影片 (絕對路徑)
      slide.addMedia({
        type: 'video',
        path: mediaPath,
        x: x,
        y: y,
        w: w,
        h: h
      });
    } else {
      // 3. 嵌入圖片，設定 contain 縮放模式
      slide.addImage({
        path: mediaPath,
        x: x,
        y: y,
        w: w,
        h: h,
        sizing: { type: 'contain', w: w, h: h }
      });
    }
  } else {
    // 預留版面給使用者在 PowerPoint 中手動修改或插入
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: x,
      y: y,
      w: w,
      h: h,
      fill: { color: 'F1F5F9' },
      line: { color: COLORS.lightGray, width: 1, dashType: 'dash' }
    });
    
    slide.addText(`[ 點選此處手動插入${isVideo ? '影片' : '圖片'}: ${filename} ]`, {
      x: x + 0.2,
      y: y + 0.2,
      w: w - 0.4,
      h: h - 0.4,
      fontSize: 12,
      fontFace: FONTS.title,
      color: COLORS.textMuted,
      align: 'center',
      valign: 'middle'
    });
  }
}

// ==========================================
// 開始建構 26 頁投影片
// ==========================================

console.log('Generating PPTX presentation slides...');

// ------------------------------------------
// Slide 01: 封面
// ------------------------------------------
const s1 = pptx.addSlide();
s1.background = { fill: COLORS.bg };

// 紅色漸層點綴裝飾 (左側一條粗紅豎線)
s1.addShape(pptx.shapes.RECTANGLE, {
  x: 0,
  y: 0,
  w: 0.3,
  h: 7.5,
  fill: { color: COLORS.nintendoRed },
  line: null
});

// 主標題
s1.addText('貪食蛇提案說明', {
  x: 1.0,
  y: 2.3,
  w: 11.33,
  h: 1.5,
  fontSize: 48,
  fontFace: FONTS.title,
  color: COLORS.nintendoRed,
  bold: true,
  align: 'left',
  valign: 'middle'
});

// 作者
s1.addText('線上研三 開發二組 高帆君', {
  x: 1.0,
  y: 3.8,
  w: 11.33,
  h: 0.8,
  fontSize: 20,
  fontFace: FONTS.body,
  color: COLORS.textDark,
  bold: true,
  align: 'left',
  valign: 'top'
});

// 裝飾小方塊
s1.addShape(pptx.shapes.RECTANGLE, {
  x: 1.0,
  y: 2.1,
  w: 1.5,
  h: 0.08,
  fill: { color: COLORS.nintendoRed },
  line: null
});


// ------------------------------------------
// Slide 02: 遊戲前導
// ------------------------------------------
const s2 = createBaseSlide('PAGE 02', '遊戲前導');

drawCard(s2, {
  x: 0.8,
  y: 1.8,
  w: 11.7,
  h: 1.4,
  borderLeftColor: COLORS.nintendoRed,
  title: '基本玩法',
  text: '在地圖中不斷吞食食物與對手殘骸，快速增加自身長度與積分。'
});

drawCard(s2, {
  x: 0.8,
  y: 3.4,
  w: 11.7,
  h: 1.4,
  borderLeftColor: COLORS.coinYellow,
  title: '技能博弈',
  text: '搭配主動技能「衝刺」技巧截斷對手；「磁力漩渦」快速吞食食物。'
});

drawCard(s2, {
  x: 0.8,
  y: 5.0,
  w: 11.7,
  h: 1.4,
  borderLeftColor: COLORS.yoshiGreen,
  title: '死亡與復活',
  text: '死亡後的屍體會被他人吞食，但透過復活機制，可快速重返戰場。'
});


// ------------------------------------------
// Slide 03: 遊戲特色
// ------------------------------------------
const s3 = createBaseSlide('PAGE 03', '遊戲特色');

// 副標
s3.addText('雙人對戰  X  體力控管  X  截斷反殺', {
  x: 0.5,
  y: 1.3,
  w: 12.3,
  h: 0.4,
  fontSize: 16,
  fontFace: FONTS.title,
  color: COLORS.nintendoRed,
  bold: true
});

// 三個並排卡片
drawCard(s3, {
  x: 0.8,
  y: 2.0,
  w: 3.6,
  h: 4.5,
  borderLeftColor: COLORS.nintendoRed,
  title: '雙人對戰',
  text: '120 秒快節奏混戰，人+人 或 人+電腦競技。'
});

drawCard(s3, {
  x: 4.85,
  y: 2.0,
  w: 3.6,
  h: 4.5,
  borderLeftColor: COLORS.coinYellow,
  title: '體力控管',
  text: '衝刺與疲勞超載機制的精密走位博弈。'
});

drawCard(s3, {
  x: 8.9,
  y: 2.0,
  w: 3.6,
  h: 4.5,
  borderLeftColor: COLORS.yoshiGreen,
  title: '截斷反殺',
  text: '利用蛇身截斷對手身體，奪取殘骸反超積分。'
});


// ------------------------------------------
// Slide 04: 大綱：項目總覽
// ------------------------------------------
const s4 = createBaseSlide('PAGE 04', '大綱：項目總覽');

const agendaItems = [
  { num: '1', title: '核心玩法' },
  { num: '5', title: '成長之路結合' },
  { num: '2', title: '6+6選品策略' },
  { num: '6', title: '金流回收方式' },
  { num: '3', title: '參考競品資訊' },
  { num: '7', title: '美術風格' },
  { num: '4', title: '技能/道具設計' },
  { num: '8', title: 'Q&A' }
];

agendaItems.forEach((item, index) => {
  const col = index % 2;
  const row = Math.floor(index / 2);
  const cardX = 0.8 + col * 6.0;
  const cardY = 1.8 + row * 1.2;
  const cardW = 5.7;
  const cardH = 0.9;
  
  // 畫白色背景
  s4.addShape(pptx.shapes.RECTANGLE, {
    x: cardX,
    y: cardY,
    w: cardW,
    h: cardH,
    fill: { color: COLORS.white },
    line: { color: COLORS.lightGray, width: 1 }
  });
  
  // 畫紅色左邊飾線
  s4.addShape(pptx.shapes.RECTANGLE, {
    x: cardX,
    y: cardY,
    w: 0.08,
    h: cardH,
    fill: { color: COLORS.nintendoRed },
    line: null
  });
  
  // 數字
  s4.addText(item.num, {
    x: cardX + 0.2,
    y: cardY + 0.15,
    w: 0.5,
    h: 0.6,
    fontSize: 22,
    fontFace: FONTS.en,
    color: COLORS.nintendoRed,
    bold: true,
    align: 'center',
    valign: 'middle'
  });
  
  // 標題
  s4.addText(item.title, {
    x: cardX + 0.8,
    y: cardY + 0.15,
    w: 4.6,
    h: 0.6,
    fontSize: 16,
    fontFace: FONTS.title,
    color: COLORS.textDark,
    bold: true,
    align: 'left',
    valign: 'middle'
  });
});


// ------------------------------------------
// Slide 05: Divider 1
// ------------------------------------------
createDividerSlide('1. 核心玩法', 'Core Gameplay');


// ------------------------------------------
// Slide 06: 核心玩法 (1/4)：遊戲模式
// ------------------------------------------
const s6 = createBaseSlide('PAGE 06', '1. 核心玩法 (1/4)：遊戲模式');

// 左側三個模式卡片
drawCard(s6, {
  x: 0.8,
  y: 1.8,
  w: 5.8,
  h: 1.4,
  borderLeftColor: COLORS.nintendoRed,
  title: '單人模式',
  text: '1 玩家 vs 7 電腦 (電腦強度低)。適合新手熱身與熟悉基本走位。'
});

drawCard(s6, {
  x: 0.8,
  y: 3.4,
  w: 5.8,
  h: 1.4,
  borderLeftColor: COLORS.coinYellow,
  title: '對抗模式',
  text: '1 玩家 vs 1 對手玩家 vs 6 電腦 (電腦強度高)。若匹配不到玩家則由強檔電腦替代。'
});

drawCard(s6, {
  x: 0.8,
  y: 5.0,
  w: 5.8,
  h: 1.4,
  borderLeftColor: COLORS.yoshiGreen,
  title: '陣營模式',
  text: '1 玩家+3 電腦 vs 1 對手玩家+3 電腦 (電腦強度高)。考求團隊協同與戰術包抄。'
});

// 右側結算評價卡片 (完全以原生 PowerPoint 元素重構)
s6.addShape(pptx.shapes.RECTANGLE, {
  x: 7.0,
  y: 1.8,
  w: 5.5,
  h: 4.6,
  fill: { color: COLORS.white },
  line: { color: COLORS.lightGray, width: 1 }
});

s6.addShape(pptx.shapes.RECTANGLE, {
  x: 7.0,
  y: 1.8,
  w: 5.5,
  h: 0.6,
  fill: { color: COLORS.nintendoRed },
  line: null
});

s6.addText('🏆 結算評價機制', {
  x: 7.2,
  y: 1.9,
  w: 5.1,
  h: 0.4,
  fontSize: 14,
  fontFace: FONTS.title,
  color: COLORS.white,
  bold: true,
  valign: 'middle'
});

const evaluationText = `比完排名後，依據 1-8 名給予 SSS 至 E 的結算評價：

•  第 1 名: SSS (最優發育評價)
•  第 2 名: SS
•  第 3 名: S
•  第 4-5 名: A / B
•  第 6-8 名: C / D / E (基本評價)

獲得的 SSS 級評價是解鎖局外高級外觀與獲取大量升級熟練度的必備管道。`;

s6.addText(evaluationText, {
  x: 7.2,
  y: 2.6,
  w: 5.1,
  h: 3.6,
  fontSize: 11,
  fontFace: FONTS.body,
  color: COLORS.textMuted,
  align: 'left',
  valign: 'top',
  lineSpacing: 18
});


// ------------------------------------------
// Slide 07: 核心玩法 (2/4)：基本操作
// ------------------------------------------
const s7 = createBaseSlide('PAGE 07', '1. 核心玩法 (2/4)：基本操作');

// 左側三大操作卡片
drawCard(s7, {
  x: 0.8,
  y: 1.8,
  w: 5.8,
  h: 1.4,
  borderLeftColor: COLORS.yoshiGreen,
  title: '動態虛擬搖桿 (左手)',
  text: '隨滑隨動，零延遲提供精細走位避險與切入空間。'
});

drawCard(s7, {
  x: 0.8,
  y: 3.4,
  w: 5.8,
  h: 1.4,
  borderLeftColor: COLORS.nintendoRed,
  title: '衝刺 (右手)',
  text: '消耗體力獲得加速，若體力耗盡要等到回滿才能再次使用。'
});

drawCard(s7, {
  x: 0.8,
  y: 5.0,
  w: 5.8,
  h: 1.4,
  borderLeftColor: COLORS.coinYellow,
  title: '磁力漩渦 (右手)',
  text: '瞬間吸入大範圍內的所有食物。'
});

// 右側 Demo 影片區域
drawMedia(s7, {
  x: 7.0,
  y: 1.8,
  w: 5.5,
  h: 4.6,
  filename: 'Demo_01.mp4',
  isVideo: true
});


// ------------------------------------------
// Slide 08: 核心玩法 (3/4)：衝刺
// ------------------------------------------
const s8 = createBaseSlide('PAGE 08', '1. 核心玩法 (3/4)：衝刺');

// 左側文字大卡片
drawCard(s8, {
  x: 0.8,
  y: 1.8,
  w: 5.8,
  h: 4.6,
  borderLeftColor: COLORS.nintendoRed,
  title: '⚔️ 技巧走位，博弈快感',
  text: '衝刺是遊戲中最核心的博弈手段。 不僅僅是加速，還能無敵進行攻擊或防禦。\n\n玩家必須精準控制體力消耗，利用衝刺來截斷對手走位。\n\n這打破了傳統 IO 遊戲中「純粹依靠長度與數值壓制」的單調玩法，讓每一次交鋒都充滿了以小博大、截斷反殺的刺激感！'
});

// 右側展示影片
drawMedia(s8, {
  x: 7.0,
  y: 1.8,
  w: 5.5,
  h: 4.6,
  filename: '衝刺demo.mp4',
  isVideo: true
});


// ------------------------------------------
// Slide 09: 核心玩法 (4/4)：磁力漩渦
// ------------------------------------------
const s9 = createBaseSlide('PAGE 09', '1. 核心玩法 (4/4)：磁力漩渦');

// 左側文字大卡片
drawCard(s9, {
  x: 0.8,
  y: 1.8,
  w: 5.8,
  h: 4.6,
  borderLeftColor: COLORS.coinYellow,
  title: '🧲 瞬間收割，扭轉戰局',
  text: '磁力漩渦能夠瞬間吸入大範圍內的所有食物，是極具戰略價值的輔助技能。\n\n在資源密集區或對手死亡後，適時啟動磁力漩渦能迅速搶奪戰利品，大幅縮短發育時間。\n\n這是在混亂戰局中逆轉積分、取得優勢的關鍵操作。'
});

// 右側展示影片
drawMedia(s9, {
  x: 7.0,
  y: 1.8,
  w: 5.5,
  h: 4.6,
  filename: '磁鐵demo.mp4',
  isVideo: true
});


// ------------------------------------------
// Slide 10: Divider 2
// ------------------------------------------
createDividerSlide('2. 6+6 選品策略', '6+6 Selection Strategy');


// ------------------------------------------
// Slide 11: 2. 6+6選品策略 (1/1)：經典再造與心理驅動
// ------------------------------------------
const s11 = createBaseSlide('PAGE 11', '2. 6+6 選品策略 (1/1)：經典再造與心理驅動');

const strategyText = `【玩法深化．體驗升級】
•  「截斷反殺」實現以小博大
•  「極速復活」消弭死亡挫敗
•  「多人同樂」翻倍局內樂趣

【玩法融合．創造藍海】
•  「經典走位」結合局外養成
•  「雙軌技能」釋放玩法變化
•  「地圖道具」翻新傳統體驗`;

drawCard(s11, {
  x: 0.8,
  y: 1.8,
  w: 5.6,
  h: 4.6,
  borderLeftColor: COLORS.nintendoRed,
  title: '💡 落實兩大成功策略',
  text: strategyText
});

const psychologyText = `【ASMR 效應與感官滿足】
•  「感官反饋」放大拾取體驗
•  「爆炸衝擊」引爆擊殺爽感
•  「觸覺震動」提供極致紓壓

【熟悉與新奇黃金平衡】
•  「直覺操作」實現零學習成本
•  「體力衝刺」創造博弈快感
•  「技能養成」翻倍成就體驗`;

drawCard(s11, {
  x: 6.9,
  y: 1.8,
  w: 5.6,
  h: 4.6,
  borderLeftColor: COLORS.yoshiGreen,
  title: '🎯 對齊兩大核心心理驅動',
  text: psychologyText
});


// ------------------------------------------
// Slide 12: Divider 3
// ------------------------------------------
createDividerSlide('3. 參考競品資訊', 'Competitor Analysis');


// ------------------------------------------
// Slide 13: 3. 參考競品 (1/3)：Snake.io
// ------------------------------------------
const s13 = createBaseSlide('PAGE 13', '3. 參考競品 (1/3)：Snake.io');

// AppIcon 區 (完全由原生 PowerPoint 圖片元件與文字構成)
const icon1 = getMediaPath('SnakeIO_AppIcon.jpg');
if (icon1) {
  s13.addImage({
    path: icon1,
    x: 0.8,
    y: 1.8,
    w: 1.0,
    h: 1.0
  });
}
s13.addText('Snake.io ↗', {
  x: 2.0,
  y: 1.8,
  w: 4.0,
  h: 0.5,
  fontSize: 20,
  fontFace: FONTS.title,
  color: COLORS.nintendoRed,
  bold: true,
  valign: 'middle'
});
s13.addText('Google Play 1億+ 下載', {
  x: 2.0,
  y: 2.3,
  w: 4.0,
  h: 0.4,
  fontSize: 12,
  fontFace: FONTS.title,
  color: COLORS.textMuted,
  valign: 'middle'
});

// 左下說明卡片
drawCard(s13, {
  x: 0.8,
  y: 3.0,
  w: 5.2,
  h: 3.4,
  borderLeftColor: COLORS.nintendoRed,
  title: '競品核心特色',
  text: '「憑走位突圍」：聚焦最純粹的短局期純手感競技。\n\n沒有花哨的數值干擾，完全憑藉玩家靈巧操作進行截擊。這是目前 IO 貪食蛇領域的絕對龍頭，玩法極具成癮性。'
});

// 右側上方下載量數據
drawMedia(s13, {
  x: 6.4,
  y: 1.8,
  w: 6.1,
  h: 2.1,
  filename: 'SnakeIO_download.png',
  isVideo: false
});

// 右側下方展示影片
drawMedia(s13, {
  x: 6.4,
  y: 4.1,
  w: 6.1,
  h: 2.3,
  filename: 'SnakeIO_Demo.mp4',
  isVideo: true
});


// ------------------------------------------
// Slide 14: 3. 參考競品 (2/3)：Snake Clash!
// ------------------------------------------
const s14 = createBaseSlide('PAGE 14', '3. 參考競品 (2/3)：Snake Clash!');

// AppIcon 區
const icon2 = getMediaPath('SnakeClash_App_Icon.jpg');
if (icon2) {
  s14.addImage({
    path: icon2,
    x: 0.8,
    y: 1.8,
    w: 1.0,
    h: 1.0
  });
}
s14.addText('Snake Clash! ↗', {
  x: 2.0,
  y: 1.8,
  w: 4.0,
  h: 0.5,
  fontSize: 20,
  fontFace: FONTS.title,
  color: COLORS.nintendoRed,
  bold: true,
  valign: 'middle'
});
s14.addText('Google Play 1億+ 下載', {
  x: 2.0,
  y: 2.3,
  w: 4.0,
  h: 0.4,
  fontSize: 12,
  fontFace: FONTS.title,
  color: COLORS.textMuted,
  valign: 'middle'
});

// 左下說明卡片
drawCard(s14, {
  x: 0.8,
  y: 3.0,
  w: 5.2,
  h: 3.4,
  borderLeftColor: COLORS.coinYellow,
  title: '競品核心特色',
  text: '「以數值壓制」：聚焦局外養成帶來的開局優勢。\n\n玩家可以透過升級長度、速度等屬性，在開局時獲得領先地位。此模式大幅降低了新手的操作門檻，具有強烈的爽感回饋。'
});

// 右側上方下載量數據
drawMedia(s14, {
  x: 6.4,
  y: 1.8,
  w: 6.1,
  h: 2.1,
  filename: 'SnakeClash_download.png',
  isVideo: false
});

// 右側下方展示影片
drawMedia(s14, {
  x: 6.4,
  y: 4.1,
  w: 6.1,
  h: 2.3,
  filename: 'SnakeClash_Demo.mp4',
  isVideo: true
});


// ------------------------------------------
// Slide 15: 3. 參考競品 (3/3)：Snake Merge
// ------------------------------------------
const s15 = createBaseSlide('PAGE 15', '3. 參考競品 (3/3)：Snake Merge');

// AppIcon 區
const icon3 = getMediaPath('SnakeMerge_AppIcon.jpg');
if (icon3) {
  s15.addImage({
    path: icon3,
    x: 0.8,
    y: 1.8,
    w: 1.0,
    h: 1.0
  });
}
s15.addText('Snake Merge ↗', {
  x: 2.0,
  y: 1.8,
  w: 4.0,
  h: 0.5,
  fontSize: 20,
  fontFace: FONTS.title,
  color: COLORS.nintendoRed,
  bold: true,
  valign: 'middle'
});
s15.addText('Google Play 5000萬+ 下載', {
  x: 2.0,
  y: 2.3,
  w: 4.0,
  h: 0.4,
  fontSize: 12,
  fontFace: FONTS.title,
  color: COLORS.textMuted,
  valign: 'middle'
});

// 左下說明卡片
drawCard(s15, {
  x: 0.8,
  y: 3.0,
  w: 5.2,
  h: 3.4,
  borderLeftColor: COLORS.yoshiGreen,
  title: '競品核心特色',
  text: '「靠道具反轉」：利用道具帶來的局內戰術。\n\n局內有豐富的隨機道具（如磁鐵、護盾、加速等），玩家可隨機拾取並在危急關頭實現反殺，極大增強了遊戲的策略深度與隨機樂趣。'
});

// 右側上方下載量數據
drawMedia(s15, {
  x: 6.4,
  y: 1.8,
  w: 6.1,
  h: 2.1,
  filename: 'SnakeMerge_download.png',
  isVideo: false
});

// 右側下方展示影片
drawMedia(s15, {
  x: 6.4,
  y: 4.1,
  w: 6.1,
  h: 2.3,
  filename: 'SnakeMerge_Demo.mp4',
  isVideo: true
});


// ------------------------------------------
// Slide 16: Divider 4
// ------------------------------------------
createDividerSlide('4. 技能/道具設計', 'Skills & Items Design');


// ------------------------------------------
// Slide 17: 4. 技能/道具設計 (1/3)：主動技
// ------------------------------------------
const s17 = createBaseSlide('PAGE 17', '4. 技能/道具設計 (1/3)：主動技');

drawCard(s17, {
  x: 0.8,
  y: 1.8,
  w: 5.6,
  h: 4.6,
  borderLeftColor: COLORS.nintendoRed,
  title: '⚡ 1. 衝刺',
  text: '消耗體力獲得加速。若體力耗盡要等到回滿才能再次使用。\n\n【主動技升級效果】\n• 提升衝刺體力上限\n• 提升衝刺體力回復速度'
});

drawCard(s17, {
  x: 6.9,
  y: 1.8,
  w: 5.6,
  h: 4.6,
  borderLeftColor: COLORS.coinYellow,
  title: '🧲 2. 磁力漩渦',
  text: '瞬間吸入大範圍內的所有食物。有冷卻時間。\n\n【主動技升級效果】\n• 擴大磁吸漩渦半徑\n• 縮短磁吸漩渦冷卻時間'
});


// ------------------------------------------
// Slide 18: 4. 技能/道具設計 (2/3)：地圖道具與被動技
// ------------------------------------------
const s18 = createBaseSlide('PAGE 18', '4. 技能/道具設計 (2/3)：地圖道具與被動技');

// 左邊三個並排小卡片
drawCard(s18, {
  x: 0.8,
  y: 1.8,
  w: 3.6,
  h: 4.6,
  borderLeftColor: COLORS.coinYellow,
  title: '🧲 1. 磁鐵',
  text: '自動吸附周圍食物。\n\n【被動技升級】\n• 增加吸附半徑'
});

drawCard(s18, {
  x: 4.7,
  y: 1.8,
  w: 3.6,
  h: 4.6,
  borderLeftColor: COLORS.nintendoRed,
  title: '🍄 2. 巨大蘑菇',
  text: '體型變大、免疫截斷。\n\n【被動技升級】\n• 提升移動速度'
});

drawCard(s18, {
  x: 8.6,
  y: 1.8,
  w: 3.6,
  h: 4.6,
  borderLeftColor: COLORS.yoshiGreen,
  title: '⭐ 3. 幸運 7',
  text: '吞食食物價值提升。\n\n【被動技升級】\n• 提升食物倍率'
});

// 下方一個橫跨的額外資訊卡
drawCard(s18, {
  x: 0.8,
  y: 5.0,
  w: 11.4,
  h: 1.4,
  borderLeftColor: COLORS.textMuted,
  title: '✨ 其他被動技升級效果',
  text: '【鷹眼】視野變大，提供更早的戰略防禦與包抄視野。  /  【拾荒者】地圖道具持續時間增加，延長優勢狀態。'
});


// ------------------------------------------
// Slide 19: 4. 技能/道具設計 (3/3)：個性化外觀
// ------------------------------------------
const s19 = createBaseSlide('PAGE 19', '4. 技能/道具設計 (3/3)：個性化外觀');

drawCard(s19, {
  x: 0.8,
  y: 1.8,
  w: 5.8,
  h: 4.6,
  borderLeftColor: COLORS.nintendoRed,
  title: '🎨 Skin 系統與獲取管道',
  text: '個性化外觀 (Skin) 系統提供多種獨特的 3D 黏土風格蛇身皮膚，凸顯玩家的個性與榮譽感。\n\n【主要獲取管道】\n\n•  成長之路：升級階段解鎖限定外觀。\n•  局內獎勵：完成特定局內挑戰以獲取皮膚碎片。\n•  局外商店：積累遊戲金幣直接購買解鎖。'
});

// 右側展示影片
drawMedia(s19, {
  x: 7.0,
  y: 1.8,
  w: 5.5,
  h: 4.6,
  filename: 'skin系統.mp4',
  isVideo: true
});


// ------------------------------------------
// Slide 20: Divider 5
// ------------------------------------------
createDividerSlide('5. 成長之路結合', 'Growth Road Integration');


// ------------------------------------------
// Slide 21: 5. 成長之路結合 (1/1)：被動技提升
// ------------------------------------------
const s21 = createBaseSlide('PAGE 21', '5. 成長之路結合 (1/1)：被動技提升');

drawCard(s21, {
  x: 0.8,
  y: 1.8,
  w: 5.8,
  h: 4.6,
  borderLeftColor: COLORS.nintendoRed,
  title: '📈 長線養成與效果加成',
  text: '透過與「成長之路」的緊密結合，提供玩家明確的長線局外目標，進一步提高留存率。\n\n【養成核心機制】\n\n•  熟練度累積：完成每局比賽（不論勝負）皆可依名次獲取熟練度。\n•  被動天賦升級：熟練度滿即可消耗金幣升級被動天賦，獲得更強大的開局屬性優勢。'
});

// 右側成長之路圖片
drawMedia(s21, {
  x: 7.0,
  y: 1.8,
  w: 5.5,
  h: 4.6,
  filename: '玩星派對_成長之路_圖.png',
  isVideo: false
});


// ------------------------------------------
// Slide 22: Divider 6
// ------------------------------------------
createDividerSlide('6. 金流回收方式', 'Monetization Strategy');


// ------------------------------------------
// Slide 23: 6. 金流回收方式 (1/1)：被動技、天賦、外觀
// ------------------------------------------
const s23 = createBaseSlide('PAGE 23', '6. 金流回收方式 (1/1)：被動技、天賦、外觀');

// 左側三個獨立的白色圓角卡片 (完全還原網頁版，可獨立選取並修改內容)
drawCard(s23, {
  x: 0.8,
  y: 1.8,
  w: 5.8,
  h: 1.4,
  borderLeftColor: COLORS.nintendoRed,
  title: '回收一：被動技',
  text: '開局前，玩家可消耗金幣啟動各種被動技能。'
});

drawCard(s23, {
  x: 0.8,
  y: 3.4,
  w: 5.8,
  h: 1.4,
  borderLeftColor: COLORS.coinYellow,
  title: '回收二：天賦',
  text: '參考《弓箭傳說》天賦系統。消耗金幣隨機升級主動技能效果。'
});

drawCard(s23, {
  x: 0.8,
  y: 5.0,
  w: 5.8,
  h: 1.4,
  borderLeftColor: COLORS.yoshiGreen,
  title: '回收三：外觀',
  text: '提供多種獨特的 3D 黏土風格蛇身皮膚，玩家可使用大量金幣直接購買，快速享有特色外觀。'
});

// 右側展示影片
drawMedia(s23, {
  x: 7.0,
  y: 1.8,
  w: 5.5,
  h: 4.6,
  filename: '弓箭傳說強化系統.mp4',
  isVideo: true
});


// ------------------------------------------
// Slide 24: Divider 7
// ------------------------------------------
createDividerSlide('7. 美術風格', 'Art Style & Aesthetics');


// ------------------------------------------
// Slide 25: 7. 美術風格 (1/1)：風格參考
// ------------------------------------------
const s25 = createBaseSlide('PAGE 25', '7. 美術風格 (1/1)：風格參考');

drawCard(s25, {
  x: 0.8,
  y: 1.8,
  w: 5.2,
  h: 4.6,
  borderLeftColor: COLORS.nintendoRed,
  title: '🎨 活力任天堂風格',
  text: '遊戲主打高對比、高飽和色彩，打造圓潤且富彈性的 3D 微黏土與霧面塑料材質視覺效果。\n\n【核心美學設計】\n\n•  視覺觸感: 微凹凸的軟Q黏土表面質感。\n•  高對比度: 亮麗的黃、綠、紅與深邃背景色交織。\n•  親和力: 排除寫實感，以卡通化的角色與動態表情拉近與大眾玩家的距離。'
});

// 右側 2x2 圖片矩陣
const matrixX = 6.4;
const matrixY = 1.8;
const cellW = 3.0;
const cellH = 2.2;
const gap = 0.2;

// 1. 瑪利歐網球
drawMedia(s25, {
  x: matrixX,
  y: matrixY,
  w: cellW,
  h: cellH,
  filename: '瑪利歐網球圖1.jpg',
  isVideo: false
});

// 2. 瑪利歐派對
drawMedia(s25, {
  x: matrixX + cellW + gap,
  y: matrixY,
  w: cellW,
  h: cellH,
  filename: '瑪利歐派對圖1.png',
  isVideo: false
});

// 3. 瑪利歐賽車 8 (1)
drawMedia(s25, {
  x: matrixX,
  y: matrixY + cellH + gap,
  w: cellW,
  h: cellH,
  filename: '瑪利歐賽車8圖1.jpg',
  isVideo: false
});

// 4. 瑪利歐賽車 8 (2)
drawMedia(s25, {
  x: matrixX + cellW + gap,
  y: matrixY + cellH + gap,
  w: cellW,
  h: cellH,
  filename: '瑪利歐賽車8圖2.jpg',
  isVideo: false
});


// ------------------------------------------
// Slide 26: Q&A
// ------------------------------------------
const s26 = pptx.addSlide();
s26.background = { fill: COLORS.bg };

// 裝飾紅方塊
s26.addShape(pptx.shapes.RECTANGLE, {
  x: 5.66,
  y: 2.2,
  w: 2.0,
  h: 0.1,
  fill: { color: COLORS.nintendoRed },
  line: null
});

// Q&A 置中大標
s26.addText('Q & A', {
  x: 0.5,
  y: 2.5,
  w: 12.33,
  h: 1.5,
  fontSize: 64,
  fontFace: FONTS.en,
  color: COLORS.nintendoRed,
  bold: true,
  align: 'center',
  valign: 'middle'
});

s26.addText('感謝聆聽，敬請指教', {
  x: 0.5,
  y: 4.2,
  w: 12.33,
  h: 0.8,
  fontSize: 22,
  fontFace: FONTS.body,
  color: COLORS.textDark,
  bold: true,
  align: 'center',
  valign: 'top'
});

// ==========================================
// 存檔產出 PPTX 簡報 (覆蓋舊的截圖版簡報)
// ==========================================
const outputFilename = path.join(__dirname, 'presentation_v5.2.0', 'Snake.io_競技場_提案簡報_v5.2.0.pptx');
pptx.writeFile({ fileName: outputFilename })
  .then(() => {
    console.log(`Successfully generated ${outputFilename}`);
  })
  .catch(err => {
    console.error('Error generating PPTX:', err);
  });
