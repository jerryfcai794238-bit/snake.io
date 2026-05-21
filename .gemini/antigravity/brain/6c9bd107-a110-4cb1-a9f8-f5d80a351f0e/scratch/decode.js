const iconv = require('iconv-lite');

// 亂碼字串 1: 3. ?€奎??閮?(3/3)嚗nake Merge
// 亂碼字串 2: 蝯?鈭蝵桀???(Merge) ???貉痕憌??拇??摰嗅隞亙撅€憭€???蝟餌絞閫???車?函憡???嚗蒂?典??找澈??詨€潛??砍像蝡嗆???皛踵??格€抒??園?閬??臬?€憭抒?脯€?

const c1 = "3. ?€奎??閮?(3/3)嚗nake Merge";
const c2 = "蝯?鈭蝵桀???(Merge) ???貉痕憌??拇??摰嗅隞亙撅€憭€???蝟餌絞閫???車?函憡???嚗蒂?典??找澈??詨€潛??砍像蝡嗆???皛踵??格€抒??園?閬??臬?€憭抒?脯€?";

const encodings = ['big5', 'cp950', 'gbk', 'gb2312', 'latin1', 'utf-8', 'utf-16'];

console.log("--- Decoding c1 ---");
for (const enc1 of encodings) {
    for (const enc2 of encodings) {
        if (enc1 === enc2) continue;
        try {
            // 用 enc1 將 corrupted 字串編碼為 Buffer
            const buf = iconv.encode(c1, enc1);
            // 用 enc2 將 Buffer 解碼為字串
            const res = iconv.decode(buf, enc2);
            if (res.includes("參考") || res.includes("競品") || res.includes("市場") || res.includes("數據")) {
                console.log(`Success: ${enc1} -> ${enc2}: ${res}`);
            }
        } catch(e) {}
    }
}

console.log("\n--- Decoding c2 ---");
for (const enc1 of encodings) {
    for (const enc2 of encodings) {
        if (enc1 === enc2) continue;
        try {
            const buf = iconv.encode(c2, enc1);
            const res = iconv.decode(buf, enc2);
            if (res.includes("合") || res.includes("玩") || res.includes("體") || res.includes("競") || res.includes("屬") || res.includes("外")) {
                console.log(`Success: ${enc1} -> ${enc2}: ${res}`);
            }
        } catch(e) {}
    }
}
