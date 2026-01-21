# NowView 网站发布页

## 📁 文件结构

```
website/
├── index.html      # 主页面
├── styles.css      # 样式文件
└── script.js       # 交互脚本
```

## 🚀 如何使用

### 方法 1: 本地预览

1. 使用任意静态服务器打开：

```bash
# 使用 Python 3
cd website
python -m http.server 8000

# 使用 Python 2
python -m SimpleHTTPServer 8000

# 使用 Node.js (http-server)
npx http-server website -p 8000

# 使用 PHP
php -S localhost:8000
```

2. 在浏览器中访问 `http://localhost:8000`

### 方法 2: 直接打开

直接在浏览器中打开 `index.html` 文件即可（但某些功能可能受限）。

### 方法 3: 部署到网络

#### GitHub Pages

1. 将整个 `website` 文件夹推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择主分支作为发布源
4. 访问 `https://yourusername.github.io/repository-name`

#### Netlify

1. 访问 [Netlify Drop](https://app.netlify.com/drop)
2. 拖拽 `website` 文件夹到页面中
3. 等待部署完成

#### Vercel

1. 安装 Vercel CLI: `npm i -g vercel`
2. 在 `website` 目录运行: `vercel`
3. 按照提示完成部署

## 🎨 功能特点

### 1. 响应式设计
- 完美适配桌面、平板和手机
- 移动端菜单优化

### 2. 交互动画
- 平滑滚动导航
- FAQ 手风琴效果
- 元素滚动入场动画
- 按钮涟漪效果
- 统计数字动画

### 3. 核心内容

#### Hero 区域
- 吸引眼球的标题
- 清晰的价值主张
- 用户统计数据
- CTA 按钮

#### 功能展示
- 6 个核心功能卡片
- 悬停动画效果
- 图标化展示

#### 使用场景
- 4 种典型场景
- 视觉化图标
- 实际应用描述

#### 定价方案
- Free vs Pro 对比
- 明确的功能列表
- 兑换码说明

#### 常见问题
- 5 个核心问题
- 手风琴展开/收起
- 代码高亮显示

#### 下载指引
- 3 种下载方式
- Chrome 商店
- 手动安装
- GitHub 开源

### 4. 性能优化
- CSS 变量统一管理
- 最小化重排重绘
- 懒加载动画
- 平滑的过渡效果

## 🛠️ 自定义配置

### 修改主题颜色

在 `styles.css` 中修改 CSS 变量：

```css
:root {
  --primary: #667eea;      /* 主色调 */
  --secondary: #764ba2;    /* 次要色 */
  --accent: #f59e0b;       /* 强调色 */
  --dark: #1e293b;         /* 深色文本 */
  --light: #f8fafc;        /* 浅色背景 */
  --gray: #64748b;         /* 灰色文本 */
}
```

### 修改统计数据

在 `index.html` 中修改 `.hero-stats` 部分：

```html
<div class="stat">
  <div class="stat-number">10,000+</div>
  <div class="stat-label">活跃用户</div>
</div>
```

### 修改定价

在 `index.html` 中修改 `.pricing-card` 部分，可以调整：
- 价格数字
- 功能列表
- 按钮链接

### 添加兑换码

在 `index.html` 的 `.demo-code` 部分修改：

```html
<code>NOWVIEW-PRO-2024</code>
```

## 📊 分析和追踪

### 添加 Google Analytics

在 `<head>` 中添加：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🔗 扩展下载链接

### Chrome 商店链接

在发布到 Chrome 商店后，更新 `.download-method.chrome` 按钮：

```html
<a href="https://chrome.google.com/webstore/detail/your-extension-id" class="btn btn-primary">
  前往下载
</a>
```

### GitHub 链接

更新 `.download-method.github` 链接：

```html
<a href="https://github.com/yourusername/notab-extension" class="btn btn-outline">
  查看项目
</a>
```

## 🎯 SEO 优化

### Meta 标签

已在 `index.html` 中包含基本 meta 标签，可以根据需要调整：

```html
<meta name="description" content="...">
<meta name="keywords" content="...">
```

### Open Graph 标签（社交媒体分享）

可以添加到 `<head>`：

```html
<meta property="og:title" content="NowView - 重新定义网页预览体验">
<meta property="og:description" content="在不打开新标签页的情况下快速预览网页">
<meta property="og:image" content="https://your-site.com/preview-image.png">
<meta property="og:url" content="https://your-site.com">
<meta property="og:type" content="website">
```

### Favicon

添加到 `<head>`：

```html
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
```

## 🌐 多语言支持

如需添加英文版本，可以：

1. 创建 `index-en.html`
2. 或使用 JavaScript 进行语言切换
3. 或使用后端模板引擎

## 📱 浏览器兼容性

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🎨 设计资源

### 图标
- Emoji 直接使用系统字符
- 可替换为 Font Awesome 或其他图标库

### 配色
- 主渐变: `#667eea` → `#764ba2`
- 辅助色: `#f59e0b`
- 可参考 [Coolors](https://coolors.co/) 生成配色

### 字体
- 系统默认字体栈
- 可替换为 Google Fonts

## 🚀 部署检查清单

部署前请检查：

- [ ] 所有链接正确
- [ ] 图片正常显示
- [ ] 在不同浏览器测试
- [ ] 移动端适配良好
- [ ] 代码分析工具（如果使用）
- [ ] SEO meta 标签
- [ ] Favicon 已添加
- [ ] 下载链接可用
- [ ] 兑换码正确

## 📝 维护建议

1. **定期更新**
   - 用户统计数据
   - 功能截图
   - 版本号

2. **监控**
   - 网站访问量
   - 下载转化率
   - 用户反馈

3. **优化**
   - 页面加载速度
   - SEO 排名
   - 用户体验

## 🔧 故障排除

### 样式不生效
- 确认 `styles.css` 路径正确
- 检查浏览器缓存

### 交互不工作
- 确认 `script.js` 路径正确
- 检查浏览器控制台错误

### 图片不显示
- 确认图片路径正确
- 检查文件大小和格式

## 📞 支持

如有问题，请：
- 查看 GitHub Issues
- 发送邮件至 support@example.com
- 加入我们的 Discord 社区

---

**Made with ❤️ for NowView**
