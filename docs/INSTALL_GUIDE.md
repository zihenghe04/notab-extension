# NowView 安装指南

## 📦 下载扩展

**下载地址：** https://zihenghe04.github.io/notab-extension/#download

点击"⬇️ 立即下载"按钮，下载 `notab-extension-v1.2.zip` 文件（75KB）

---

## 🚀 安装步骤

### Chrome / Edge 浏览器

#### 方法 1：加载已解压的扩展（推荐）

1. **下载并解压**
   - 下载 `notab-extension-v1.2.zip`
   - 解压到任意文件夹（例如：`~/Downloads/notab-extension/`）

2. **打开扩展管理页面**
   - 在地址栏输入：`chrome://extensions/`（Chrome）
   - 或：`edge://extensions/`（Edge）
   - 或点击菜单：`更多工具 → 扩展程序`

3. **开启开发者模式**
   - 右上角找到"开发者模式"开关
   - 打开开关

4. **加载扩展**
   - 点击左上角"加载已解压的扩展程序"按钮
   - 选择解压后的文件夹（**注意：选择包含 `manifest.json` 的文件夹**）
   - ⚠️ **重要：** 如果解压后是 `notab-build` 文件夹，请选择 `notab-build` 文件夹

5. **确认安装**
   - 扩展列表中出现"NowView"
   - 图标显示在浏览器工具栏

#### 方法 2：拖拽安装

1. 下载并解压 zip 文件
2. 打开 `chrome://extensions/`
3. 开启"开发者模式"
4. 将解压后的文件夹直接拖拽到扩展页面

---

## ✅ 验证安装

安装成功后，你应该看到：

1. **扩展图标**
   - 浏览器工具栏出现 NowView 图标

2. **点击图标测试**
   - 点击图标打开 Popup
   - 显示"NowView"标题和会员状态

3. **功能测试**
   - 在任意网页上，按住 `Ctrl` 键（Mac: `Cmd`）点击链接
   - 应该弹出预览窗口

---

## ❓ 常见问题

### Q1: 提示"Invalid value for key 'declarative_net_request'"

**原因：** 选择的文件夹不正确

**解决：**
- 确保选择包含 `manifest.json` 的文件夹
- 如果解压后看到 `notab-build` 文件夹，请进入该文件夹
- 正确的文件夹应该包含：
  ```
  manifest.json
  rules.json
  icons/
  background/
  content/
  popup/
  utils/
  options/
  ```

### Q2: 下载的文件是 .zip 格式吗？

是的，当前版本使用 `.zip` 格式，更通用且兼容性更好。

### Q3: 可以从 Chrome 商店安装吗？

目前还在审核中，敬请期待！暂时只能通过手动安装。

### Q4: 安装后图标不显示？

1. 检查是否已固定扩展：点击扩展图标（拼图形状）→ 找到 NowView → 固定
2. 刷新页面
3. 重启浏览器

### Q5: Free 版本有什么限制？

- 每天可预览 10 次
- 可使用 5 种主题
- 所有核心功能完全可用

升级 Pro 版本可解锁：
- 无限次预览
- 专属紫霞主题
- 优先功能更新

---

## 🔄 更新扩展

当有新版本时：

1. 下载新的 zip 文件
2. 在 `chrome://extensions/` 中点击"刷新"图标
3. 或删除旧版本，重新安装

---

## 🗑️ 卸载扩展

1. 打开 `chrome://extensions/`
2. 找到 NowView
3. 点击"移除"按钮
4. 确认删除

---

## 💡 提示

- **开发者模式**：可以保持开启，不影响其他扩展
- **自动更新**：手动安装的版本需要手动更新
- **备份数据**：卸载前可在设置中查看会员信息

---

## 🆘 需要帮助？

- 查看 [GitHub Issues](https://github.com/zihenghe04/notab-extension/issues)
- 阅读 [完整文档](https://github.com/zihenghe04/notab-extension)

---

**版本：** v1.2
**更新日期：** 2024-01-22
