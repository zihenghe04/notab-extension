# 图标文件说明

请在此目录下放置以下尺寸的PNG图标文件：

- icon16.png (16x16 像素)
- icon48.png (48x48 像素)  
- icon128.png (128x128 像素)

## 设计建议

- 背景：紫色渐变 (#667eea -> #764ba2)
- 图案：白色大写字母 "N"
- 风格：现代、简洁

## 快速创建图标

### 方法1：使用在线工具
访问 https://www.canva.com 或 https://www.figma.com 创建图标

### 方法2：使用代码生成
在浏览器中打开以下HTML文件生成图标：

```html
<!DOCTYPE html>
<html>
<head><title>NoTab Icon Generator</title></head>
<body>
<canvas id="c" width="128" height="128"></canvas>
<script>
const c = document.getElementById('c');
const ctx = c.getContext('2d');

// 渐变背景
const g = ctx.createLinearGradient(0, 0, 128, 128);
g.addColorStop(0, '#667eea');
g.addColorStop(1, '#764ba2');
ctx.fillStyle = g;
ctx.fillRect(0, 0, 128, 128);

// 白色N
ctx.fillStyle = 'white';
ctx.font = 'bold 80px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('N', 64, 64);

// 下载
c.toBlob(b => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = 'icon128.png';
  a.click();
});
</script>
</body>
</html>
```

## 临时占位符

在正式图标创建之前，可以使用纯色占位符：
- 128x128的紫色正方形即可
