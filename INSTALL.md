# NoTab 插件安装指南

## 安装步骤

### 1. 准备图标文件

在开始之前，您需要在 `icons/` 目录下创建三个图标文件：
- icon16.png (16x16)
- icon48.png (48x48)
- icon128.png (128x128)

**快速创建方法：**

1. 打开浏览器
2. 创建一个HTML文件，粘贴以下代码：

```html
<!DOCTYPE html>
<html>
<body>
<canvas id="c16" width="16" height="16"></canvas>
<canvas id="c48" width="48" height="48"></canvas>
<canvas id="c128" width="128" height="128"></canvas>
<script>
[16, 48, 128].forEach(size => {
  const c = document.getElementById('c' + size);
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, size, size);
  g.addColorStop(0, '#667eea');
  g.addColorStop(1, '#764ba2');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = 'white';
  ctx.font = 'bold ' + (size * 0.6) + 'px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('N', size/2, size/2);
  c.toBlob(b => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = 'icon' + size + '.png';
    a.click();
  });
});
</script>
</body>
</html>
```

3. 保存为 `generate-icons.html`
4. 用浏览器打开，会自动下载3个图标文件
5. 将下载的图标文件移动到 `icons/` 目录

### 2. 加载插件到Chrome

1. 打开Chrome浏览器
2. 在地址栏输入：`chrome://extensions/`
3. 打开右上角的"开发者模式"开关
4. 点击"加载已解压的扩展程序"按钮
5. 选择 `notab-extension` 文件夹
6. 完成！

### 3. 验证安装

安装成功后，您应该看到：
- Chrome工具栏出现紫色的 "N" 图标
- 扩展程序列表中显示 "NoTab Pro Clone"

### 4. 首次使用

1. 访问任意网页（例如：https://www.wikipedia.org）
2. 尝试以下操作：
   - **Ctrl + 点击**任意链接 → 应该弹出预览窗口
   - **拖拽**链接到页面空白处 → 应该弹出预览窗口
   - **选中文本** → 应该出现翻译和搜索按钮

### 5. 自定义设置

1. 点击工具栏的插件图标
2. 或右键图标选择"选项"
3. 在设置页面中自定义您的偏好

## 故障排除

### 问题1：图标不显示
**解决方法**：确保 `icons/` 目录下有 icon16.png, icon48.png, icon128.png 三个文件

### 问题2：无法预览链接
**解决方法**：
- 确保在 `chrome://extensions/` 中插件已启用
- 刷新页面后重试
- 某些网站（如Chrome商店）无法注入内容脚本

### 问题3：翻译功能不工作
**解决方法**：
- 检查网络连接
- 翻译API可能有速率限制，稍后重试

## 卸载

1. 进入 `chrome://extensions/`
2. 找到 "NoTab Pro Clone"
3. 点击"移除"按钮

## 下一步

- 查看 [README.md](README.md) 了解完整功能
- 访问设置页面自定义您的体验
- 享受无标签浏览！
