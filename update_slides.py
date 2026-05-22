import re

with open('presentation_v5.2.0/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# --- TASK 1: MOVE Slide 05 (產品特色) to after Slide 02 and change layout ---
slide_05_match = re.search(r'<!-- Slide 05: 核心玩法前導 \(嚴禁裝飾圖\) -->.*?</section>', content, re.DOTALL)
if slide_05_match:
    slide_05_html = slide_05_match.group(0)
    
    # Modify Slide 05 layout to match Slide 02
    new_slide_05_html = slide_05_html.replace(
        'style="flex-direction: column; padding: 60px 80px; justify-content: center;"',
        'style="justify-content: center; align-items: center; padding: 50px 70px; flex-direction: column;"'
    )
    new_slide_05_html = re.sub(
        r'<span class="slide-page-num">Page 05</span>\s*<div style="margin-bottom: 15px;">\s*<h2 class="slide-title">1\. 核心玩法 \(1/4\)：產品特色</h2>\s*</div>',
        '<div style="width: 95%; max-width: 1300px; display: flex; flex-direction: column; align-items: center;">\n<div style="width: 100%; margin-bottom: 30px; text-align: center;">\n<span class="slide-page-num" style="margin: 0 auto 10px auto; display: block; width: fit-content;">Page 05</span>\n<h2 class="slide-title">1. 核心玩法 (1/4)：產品特色</h2>\n</div>',
        new_slide_05_html
    )
    new_slide_05_html = new_slide_05_html.replace(
        '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; margin-bottom: 35px;">',
        '<div style="display: flex; flex-direction: row; gap: 20px; width: 100%;">'
    )
    new_slide_05_html = new_slide_05_html.replace('</section>', '</div>\n        </section>') # Close the wrapper div
    
    # Remove Slide 05 from its original place
    content = content.replace(slide_05_html + '\n\n', '')
    
    # Insert it after Slide 02
    slide_02_end = content.find('</section>', content.find('<!-- Slide 02: 遊戲前導頁 -->')) + 10
    content = content[:slide_02_end] + '\n\n        ' + new_slide_05_html + content[slide_02_end:]


# --- TASK 2 & 3: Modify Slide 08 (Dash) and Create Slide 09 (Magnet) ---
# Slide 08 is currently: <!-- Slide 08: 衝刺特色 -->
slide_08_start = content.find('<!-- Slide 08: 衝刺特色 -->')
slide_08_end = content.find('</section>', slide_08_start) + 10
old_slide_08_html = content[slide_08_start:slide_08_end]

# We want Slide 08 to be a left-right layout with the Dash video.
new_slide_08_html = '''<!-- Slide 08: 衝刺特色 -->
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
        </section>'''

# Create Slide 09 (Magnet) with same layout
new_slide_09_html = '''<!-- Slide 09: 磁力漩渦 -->
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
        </section>'''

# Replace old Slide 08 with new 08 and insert 09
content = content[:slide_08_start] + new_slide_08_html + '\n\n        ' + new_slide_09_html + content[slide_08_end:]

# --- TASK 4: Remove videos from Slide 16 ---
slide_16_start = content.find('<!-- Slide 16: 主動技能 (1/2) -->')
slide_16_end = content.find('</section>', slide_16_start) + 10
slide_16_html = content[slide_16_start:slide_16_end]

# Slide 16 has a top-bottom structure: <!-- 上半部文字與卡片 --> and <!-- 下半部影片區域 -->
# We want to remove the bottom section and remove top-bottom layout constraint.
slide_16_html = slide_16_html.replace('class="slide-container top-bottom"', 'class="slide-container"')
slide_16_html = slide_16_html.replace('style="justify-content: center; gap: 20px;"', 'style="justify-content: flex-start; padding: 60px 80px; flex-direction: column;"')
# Extract just the top section and format it so the cards span better.
top_part_match = re.search(r'<!-- 上半部文字與卡片 -->\s*<div class="slide-left".*?>(.*?)</div>\s*<!-- 下半部影片區域 -->', slide_16_html, re.DOTALL)
if top_part_match:
    inner_content = top_part_match.group(1).strip()
    new_slide_16_html = f'''<!-- Slide 16: 主動技能 (1/2) -->
        <section class="slide-container" data-slide="16" style="justify-content: center; align-items: center; padding: 60px 80px; flex-direction: column;">
            {inner_content}
        </section>'''
    content = content[:slide_16_start] + new_slide_16_html + content[slide_16_end:]

# --- TASK 5: Renumber ALL slides sequentially ---
# Split by <section class="slide-container"
parts = content.split('<section class="slide-container')
new_content = parts[0]
for i in range(1, len(parts)):
    # each part is the rest of the slide section
    part = parts[i]
    
    # update data-slide="X"
    part = re.sub(r'data-slide="\d+"', f'data-slide="{i}"', part, count=1)
    
    # update Page XX
    part = re.sub(r'<span class="slide-page-num"[^>]*>Page \d+</span>', f'<span class="slide-page-num">Page {i:02d}</span>', part)
    
    # update Slide comment
    # wait, the comment is before the <section ... so it's in the previous part.
    # We can fix comments via regex globally later.
    
    new_content += '<section class="slide-container' + part

content = new_content

# Fix titles like 核心玩法 (4/X) to be correctly numbered.
# In core gameplay we have:
# Page 04 is 核心玩法前導 (new 05 because of moving old 05)
# Let's just fix the (X/X) dynamically
core_slides = re.findall(r'1\. 核心玩法 \([^)]+\)：', content)
core_count = len(core_slides)
for idx, match in enumerate(core_slides):
    content = content.replace(match, f'1. 核心玩法 ({idx+1}/{core_count})：', 1)

# Fix HTML comments <!-- Slide XX: ... -->
def fix_comment(m):
    return f"<!-- Slide {int(m.group(1)):02d}: {m.group(2)} -->"
# Wait, the comments are tied to the order. It's easier to just find them in order and replace them.
comments = re.findall(r'<!-- Slide \d+: (.*?) -->', content)
for idx, comment_text in enumerate(comments):
    content = re.sub(r'<!-- Slide \d+: ' + re.escape(comment_text) + r' -->', f'<!-- Slide {idx+1:02d}: {comment_text} -->', content, count=1)

with open('presentation_v5.2.0/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
