const puppeteer = require('puppeteer');
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

(async () => {
    console.log('🚀 啟動 Puppeteer 瀏覽器...');
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
    page.on('requestfailed', request => {
        // 忽略 mp4 取消的錯誤日誌，避免混淆
        if (!request.url().endsWith('.mp4')) {
            console.log(`REQUEST FAILED: ${request.url()} - ${request.failure().errorText}`);
        }
    });

    // 設定 16:9 視窗大小
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 2 // 使用 2x 縮放以獲得高畫質截圖
    });

    // 使用 file:// 載入本機 HTML
    const absolutePath = path.resolve(__dirname, '..', 'index.html');
    const targetUrl = `file:///${absolutePath.replace(/\\/g, '/')}`;
    console.log(`🌐 正在使用 file:// 協議開啟: ${targetUrl}...`);
    
    // 使用 domcontentloaded 避免大影片檔案導致 networkidle 逾時
    await page.goto(targetUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
    });

    // 等待 2 秒讓基本資源與腳本執行完畢
    await new Promise(resolve => setTimeout(resolve, 2000));

    const pageTitle = await page.title();
    console.log(`Page title: ${pageTitle}`);

    // 取得投影片數量
    const totalSlides = await page.evaluate(() => {
        const els = document.querySelectorAll('.slide-container');
        return els.length;
    });
    console.log(`📊 偵測到共有 ${totalSlides} 頁投影片。`);

    if (totalSlides === 0) {
        console.log('❌ 未偵測到投影片，結束程序。');
        await browser.close();
        return;
    }

    // 注入 CSS 以移除邊距、陰影、圓角與導覽列，讓投影片填滿整個視窗
    console.log('🎨 注入簡報全螢幕無邊框 CSS 樣式...');
    await page.addStyleTag({
        content: `
            .slide-container {
                width: 100vw !important;
                height: 100vh !important;
                max-width: none !important;
                max-height: none !important;
                border-radius: 0 !important;
                border: none !important;
                box-shadow: none !important;
                top: 0 !important;
                left: 0 !important;
                position: fixed !important;
                transform: none !important;
                transition: none !important;
                opacity: 0 !important;
            }
            .slide-container.active {
                opacity: 1 !important;
            }
            .bottom-controls, .nav-controls, .fullscreen-btn {
                display: none !important;
            }
            body {
                padding: 0 !important;
                margin: 0 !important;
                overflow: hidden !important;
                background: #F8F9FA !important;
            }
        `
    });

    const tempDir = path.join(__dirname, 'temp_slides');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';

    for (let i = 1; i <= totalSlides; i++) {
        console.log(`📸 正在擷取第 ${i} / ${totalSlides} 頁...`);
        
        // 切換到指定投影片
        await page.evaluate((slideNum) => {
            if (typeof window.goToSlide === 'function') {
                window.goToSlide(slideNum);
            } else {
                console.error('goToSlide is not defined!');
            }
        }, i);

        // 等待 CSS 動畫/轉場或影片載入完成
        await new Promise(resolve => setTimeout(resolve, 800));

        const imagePath = path.join(tempDir, `slide_${i}.png`);
        await page.screenshot({ path: imagePath });

        // 將截圖加入 PPTX
        let slide = pptx.addSlide();
        slide.addImage({
            path: imagePath,
            x: 0,
            y: 0,
            w: '100%',
            h: '100%'
        });
    }

    const outputFilePath = path.join(__dirname, '..', 'Snake.io_競技場_提案簡報_v5.2.0.pptx');
    console.log(`💾 正在產生 PPTX 檔案並儲存至: ${outputFilePath}...`);
    
    await pptx.writeFile({ fileName: outputFilePath });
    console.log('🎉 PPTX 匯出成功！');

    // 清理暫存圖片
    console.log('🧹 清理暫存截圖檔案...');
    const files = fs.readdirSync(tempDir);
    for (const file of files) {
        fs.unlinkSync(path.join(tempDir, file));
    }
    fs.rmdirSync(tempDir);

    await browser.close();
    console.log('🏁 轉換程序完成。');
})();
