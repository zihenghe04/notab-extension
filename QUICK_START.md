# 🚀 NoTab 快速启动指南

## 3步开始使用

### Step 1️⃣: 生成图标

在浏览器中打开项目根目录的 `generate-icons.html` 文件：

```bash
# Mac/Linux
open generate-icons.html

# Windows
start generate-icons.html

# 或者直接双击 generate-icons.html 文件
```

点击页面上的"生成所有图标"按钮，会自动下载3个PNG文件。

将下载的文件移动到 `icons/` 目录：
- icon16.png
- icon48.png  
- icon128.png

### Step 2️⃣: 加载插件到Chrome

1. 打开Chrome浏览器
2. 地址栏输入：`chrome://extensions/`
3. 打开右上角"开发者模式"开关
4. 点击"加载已解压的扩展程序"
5. 选择 `notab-extension` 文件夹
6. 完成！

### Step 3️⃣: 开始使用

访问任意网页（如 https://www.wikipedia.org），尝试：

**预览链接：**
- 按住 `Ctrl` 点击任意链接
- 或者拖拽链接到页面空白处

**翻译文本：**
- 选中任意文本
- 点击浮动的 🌐 按钮

**搜索文本：**
- 选中任意文本  
- 点击浮动的 🔍 按钮

---

## 🎮 快捷键

- `Esc` - 关闭所有未固定的预览
- `Ctrl+Shift+C` - 级联布局
- `Ctrl+Shift+T` - 平铺布局

## ⚙️ 自定义设置

点击工具栏的插件图标，或右键选择"选项"进入设置页面。

---

## 📚 更多文档

- `README.md` - 完整功能文档
- `INSTALL.md` - 详细安装步骤  
- `TEST_CHECKLIST.md` - 测试清单
- `PROJECT_SUMMARY.md` - 开发总结

---

## ❓ 常见问题

**Q: 图标不显示怎么办？**
A: 确保 `icons/` 目录下有3个PNG文件

**Q: 某些网站无法预览？**
A: 正常现象，某些网站禁止iframe嵌入

**Q: 翻译不工作？**
A: 检查网络连接，翻译API可能有速率限制

---

**享受无标签浏览体验！** 🎉
