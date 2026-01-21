# NowView 官网部署指南

这是 NowView Chrome 扩展的官方网站，使用 GitHub Pages 进行托管。

## 📁 文件结构

```
docs/
├── index.html       # 主页面
├── style.css        # 样式文件
├── script.js        # 交互脚本
└── README.md        # 本文件
```

## 🚀 部署到 GitHub Pages

### 方法一：使用 GitHub Pages 自动部署（推荐）

1. **确保仓库设置正确**
   - 打开 GitHub 仓库的 Settings
   - 向下滚动到 "Pages" 部分
   - 在 "Source" 下选择：
     - Branch: `main`（或你的主分支）
     - Folder: `/docs`
   - 点击 Save

2. **等待部署完成**
   - GitHub 会自动构建和部署网站
   - 部署通常需要 1-2 分钟
   - 你会在 Pages 部分看到网站 URL

3. **访问网站**
   - 打开 `https://yourusername.github.io/notab-extension/`
   - 网站应该可以访问

### 方法二：使用自定义域名（可选）

1. **购买或配置域名**
   - 获取一个域名（例如 nowview.com）

2. **配置 DNS**
   - 根据你的域名提供商的指引配置 DNS
   - 通常需要添加 CNAME 记录或 A 记录

3. **在 GitHub Pages 中配置**
   - 在 Settings > Pages 中的 "Custom domain" 输入框添加域名
   - 点击 Save

4. **验证 SSL 证书**
   - GitHub 会自动为你的域名创建 SSL 证书
   - 选中 "Enforce HTTPS" 复选框

## 📝 本地开发

### 运行本地服务器

可以使用多种方式在本地开发：

#### 使用 Python（Python 3）
```bash
cd docs
python -m http.server 8000
```

#### 使用 Python 2
```bash
cd docs
python -m SimpleHTTPServer 8000
```

#### 使用 Node.js
```bash
npm install -g http-server
cd docs
http-server
```

#### 使用 Ruby
```bash
cd docs
ruby -run -ehttpd . -p8000
```

然后打开浏览器访问 `http://localhost:8000`

## 🎨 自定义网站

### 修改颜色主题

编辑 `style.css` 文件中的 CSS 变量：

```css
:root {
    /* 改变这些值来自定义颜色 */
    --primary-color: #00a8ff;
    --primary-dark: #0084cc;
    --primary-light: #33bbff;
    /* ... 其他颜色变量 */
}
```

### 修改内容

编辑 `index.html` 文件来修改页面内容：

- 修改英雄区文本：搜索 `<section class="hero">`
- 修改功能描述：搜索 `<section id="features">`
- 修改版本信息：搜索 `<section class="roadmap">`

### 添加新部分

复制现有的部分，修改 id、标题和内容，然后在 `index.html` 中添加相应的导航链接。

## 🔗 链接更新

确保更新以下内容中的链接：

1. **GitHub 仓库链接**
   - 在 `index.html` 中搜索 `https://github.com`
   - 替换为你的真实仓库链接

2. **文档链接**
   - 在 `index.html` 中搜索 `<a href="#"` class="doc-card">`
   - 根据需要指向实际的文档 URL

3. **联系方式**
   - 更新页脚中的社交媒体链接
   - 添加邮件或其他联系方式

## 📊 分析与追踪（可选）

### 添加 Google Analytics

在 `index.html` 的 `<head>` 部分添加：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

将 `GA_MEASUREMENT_ID` 替换为你的实际 ID。

## 🚀 部署检查清单

在部署前，检查以下内容：

- [ ] 所有链接都指向正确的 URL
- [ ] 所有外部资源都可以访问
- [ ] 手机和桌面视图都正常显示
- [ ] 所有按钮都有正确的行为
- [ ] 没有控制台错误
- [ ] 加载时间在 3 秒以内
- [ ] SEO 元标签正确设置
- [ ] 社交媒体分享链接已配置

## 🔍 SEO 优化

### 元标签

文件中已包含基本的 SEO 元标签：

```html
<meta name="description" content="...">
<meta name="keywords" content="...">
<meta name="author" content="...">
```

建议添加更多：

```html
<!-- Open Graph for Social Sharing -->
<meta property="og:title" content="NowView">
<meta property="og:description" content="智能链接预览 Chrome 扩展">
<meta property="og:image" content="https://...">
<meta property="og:url" content="https://...">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="NowView">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="...">
```

## 📱 响应式设计

网站已经包含响应式设计：
- 桌面版本（1200px+）
- 平板版本（768px - 1200px）
- 手机版本（480px - 768px）
- 超小屏版本（<480px）

在浏览器开发者工具中测试所有屏幕尺寸。

## 🐛 故障排除

### 网站不显示
1. 检查 GitHub Pages 设置中的 Source 是否设置为 `/docs`
2. 确认文件已提交并推送到 GitHub
3. 等待 2-3 分钟后重新加载页面

### 样式不加载
1. 硬刷新页面（Ctrl+Shift+R 或 Cmd+Shift+R）
2. 检查浏览器控制台是否有 CORS 错误
3. 确认 `style.css` 文件在 `docs` 文件夹中

### 脚本不工作
1. 检查浏览器控制台中的 JavaScript 错误
2. 确认 `script.js` 文件在 `docs` 文件夹中
3. 检查脚本中的 DOM 选择器是否正确

## 📚 常用资源

- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [GitHub Pages 配置](https://github.com/settings/pages)
- [MDN Web 文档](https://developer.mozilla.org/)
- [Can I Use - 浏览器兼容性查询](https://caniuse.com/)

## 💡 最佳实践

1. **定期更新内容**
   - 保持文档和功能描述最新
   - 定期更新版本信息

2. **监控性能**
   - 使用 Google PageSpeed Insights 检查性能
   - 优化图片大小
   - 最小化 CSS 和 JavaScript

3. **备份内容**
   - 保留所有源代码的备份
   - 在 Git 中提交所有更改

4. **安全性**
   - 使用 HTTPS（GitHub Pages 自动提供）
   - 不要在网站中存储敏感信息
   - 定期检查依赖项的安全性

## 📞 支持和反馈

如有问题或建议：
1. 在 GitHub 仓库中提交 Issue
2. 通过电子邮件联系团队
3. 在社交媒体上联系我们

---

**最后更新**：2026年1月21日

Happy deploying! 🚀
