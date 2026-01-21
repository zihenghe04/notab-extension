#!/bin/bash
# 使用ImageMagick生成图标（如果可用）
# 如果没有ImageMagick，用户需要手动运行generate-icons.html

if command -v convert &> /dev/null; then
    echo "使用ImageMagick生成图标..."
    
    # 生成128x128的基础图标
    convert -size 128x128 \
        gradient:'#667eea-#764ba2' \
        -font Arial-Bold -pointsize 80 \
        -fill white -gravity center \
        -annotate +0+0 'N' \
        icons/icon128.png
    
    # 调整大小生成其他尺寸
    convert icons/icon128.png -resize 48x48 icons/icon48.png
    convert icons/icon128.png -resize 16x16 icons/icon16.png
    
    echo "✅ 图标生成完成！"
else
    echo "⚠️ 未安装ImageMagick"
    echo "请在浏览器中打开 generate-icons.html 来生成图标"
fi
