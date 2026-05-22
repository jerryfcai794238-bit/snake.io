const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'presentation_v5.2.0', 'index.html');
let content = fs.readFileSync(filePath, 'utf-8');

// Boundaries based on comments
const slide06Start = content.indexOf('<!-- Slide 06: 1. 核心玩法 (1/4)：基本操作 -->');
const slide07Start = content.indexOf('<!-- Slide 07: 1. 核心玩法 (2/4)：三大模式與簡易規則 -->');
const slide08Start = content.indexOf('<!-- Slide 08: 衝刺特色 -->');

if (slide06Start !== -1 && slide07Start !== -1 && slide08Start !== -1) {
    let slide06Html = content.substring(slide06Start, slide07Start);
    let slide07Html = content.substring(slide07Start, slide08Start);

    // Swap data-slide and page numbers
    slide06Html = slide06Html.replace(/data-slide="6"/g, 'data-slide="7"');
    slide06Html = slide06Html.replace(/Page 06/g, 'Page 07');
    slide06Html = slide06Html.replace(/1\. 核心玩法 \(1\/4\)/g, '1. 核心玩法 (2/4)');
    slide06Html = slide06Html.replace(/Slide 06:/g, 'Slide 07:');

    slide07Html = slide07Html.replace(/data-slide="7"/g, 'data-slide="6"');
    slide07Html = slide07Html.replace(/Page 07/g, 'Page 06');
    slide07Html = slide07Html.replace(/1\. 核心玩法 \(2\/4\)/g, '1. 核心玩法 (1/4)');
    slide07Html = slide07Html.replace(/Slide 07:/g, 'Slide 06:');

    // Replace the entire block
    content = content.substring(0, slide06Start) + slide07Html + slide06Html + content.substring(slide08Start);

    // Swap divider titles
    const divider06Str = '<div class="divider-subtitle">基本操作</div>\\r?\\n\\s*<div class="divider-subtitle">遊戲模式</div>';
    const dividerRegex = new RegExp(divider06Str);
    content = content.replace(dividerRegex, '<div class="divider-subtitle">遊戲模式</div>\\n            <div class="divider-subtitle">基本操作</div>');

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log("Successfully swapped Slide 06 and 07.");
} else {
    console.log("Could not find boundaries.");
}
