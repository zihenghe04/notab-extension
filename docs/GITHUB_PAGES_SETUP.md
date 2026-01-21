# GitHub Pages 部署快速指南

## ⚡ 3 步快速部署你的 NowView 官网

### 第 1 步：推送代码到 GitHub

```bash
# 如果还没有 Git 仓库，先初始化
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "初始化 NowView 官网"

# 添加远程仓库（替换 yourname 和 your-repo）
git remote add origin https://github.com/yourname/your-repo.git

# 推送到 main 分支
git push -u origin main
```

### 第 2 步：配置 GitHub Pages

1. 打开你的 GitHub 仓库
2. 点击 **Settings** → **Pages**
3. 在 "Source" 部分，选择：
   - **Branch**: `main`
   - **Folder**: `/docs`
4. 点击 **Save**

### 第 3 步：访问你的网站

等待 1-2 分钟后，GitHub 会在 Settings > Pages 中显示你的网站 URL：

```
https://yourname.github.io/your-repo/
```

就这么简单！🎉

---

## 📋 更新网站内容

编辑以下文件来自定义你的网站：

| 文件 | 描述 |
|------|------|
| `docs/index.html` | 主页面内容 |
| `docs/style.css` | 样式和配色 |
| `docs/script.js` | 交互功能 |

### 修改示例

**修改标题色彩**：
```css
/* 在 style.css 中找到并修改 */
:root {
    --primary-color: #00a8ff;  /* 改为你喜欢的颜色 */
}
```

**修改 GitHub 链接**：
在 `index.html` 中搜索 `https://github.com` 并替换为你的仓库 URL

**修改项目描述**：
在 `index.html` 中搜索对应的文本并修改

---

## 🔗 下一步

1. ✅ [查看官网](https://yourname.github.io/your-repo/)
2. ✅ [编辑网站内容](#修改网站内容)
3. ✅ [配置自定义域名](docs/README.md#方法二使用自定义域名可选)
4. ✅ [添加 Google Analytics](docs/README.md#添加-google-analytics)

---

## 💡 常见问题

**Q: 修改后网站还没有更新？**  
A: GitHub 需要 1-2 分钟来重新部署。如果还没有更新，尝试硬刷新浏览器（Ctrl+Shift+R）。

**Q: 我可以使用自定义域名吗？**  
A: 可以！详见 [docs/README.md](docs/README.md#方法二使用自定义域名可选)

**Q: 如何在本地测试网站？**  
A: 使用 `python -m http.server 8000` 或 `npx http-server`，详见 [docs/README.md](docs/README.md#本地开发)

---

**现在可以开始自定义你的 NowView 官网了！** 🚀
