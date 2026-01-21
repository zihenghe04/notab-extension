# 快速参考卡 - NowView 官网发布

## 🚀 3 步快速发布

```bash
# 1️⃣ 提交代码
git add .
git commit -m "创建官网"
git push origin main

# 2️⃣ 配置 GitHub Pages
# Settings > Pages > Source
# Branch: main → Folder: /docs → Save

# 3️⃣ 完成！
# 网站地址：https://yourname.github.io/your-repo/
```

---

## 📁 关键文件位置

```
✅ 官网文件
   docs/
   ├─ index.html (主页面)
   ├─ style.css (样式)
   ├─ script.js (交互)
   └─ README.md (指南)

✅ 项目文档
   ├─ PROJECT_DESCRIPTION.md (完整说明)
   ├─ GITHUB_PAGES_SETUP.md (部署指南)
   └─ WEBSITE_SUMMARY.md (官网总结)

✅ Chrome 扩展
   ├─ manifest.json
   ├─ background/
   ├─ content/
   ├─ popup/
   ├─ options/
   └─ utils/
```

---

## ✏️ 常见修改

### 改颜色主题
📝 编辑 `docs/style.css` 第一行：
```css
:root {
    --primary-color: #00a8ff;  /* 改这里 */
}
```

### 改项目名称
📝 编辑 `docs/index.html`，搜索 "NowView" 替换

### 改 GitHub 链接
📝 编辑 `docs/index.html`，搜索 `https://github.com` 替换

### 改文档内容
📝 直接编辑 `docs/index.html` 的内容部分

---

## 🧪 本地测试

```bash
# Python 3
cd docs
python -m http.server 8000

# 打开浏览器访问
http://localhost:8000
```

---

## 📊 官网统计

| 项目 | 数值 |
|------|------|
| 总大小 | ~65 KB |
| 页面区段 | 13 个 |
| 功能 | 9 个 |
| 响应式 | ✅ 支持所有设备 |
| 深色主题 | ✅ 自适应 |
| 外部依赖 | 零 |

---

## 📚 完整指南

| 需要 | 查看文档 |
|------|---------|
| 快速发布 | [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md) |
| 详细部署 | [docs/README.md](docs/README.md) |
| 项目说明 | [PROJECT_DESCRIPTION.md](PROJECT_DESCRIPTION.md) |
| 项目总结 | [WEBSITE_SUMMARY.md](WEBSITE_SUMMARY.md) |
| 完成清单 | [PROJECT_COMPLETED.md](PROJECT_COMPLETED.md) |

---

## ✨ 就这么简单！

你的官网已经准备好了，现在就可以发布！

**需要帮助？** 查看上面的文档链接。

---

**最后更新**：2026年1月21日
