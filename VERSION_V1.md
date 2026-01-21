# NowView v1.0.0 - 稳定版本

## 当前状态

✅ **基础功能已完成：**
1. iframe 限制绕过（declarativeNetRequest + Service Worker 清除）
2. Pin 功能（点击外部关闭未固定窗口）
3. 统计计数（活动预览/固定预览）
4. 主题切换（亮色/暗色/自动）
5. 插件名称已改为 NowView

## v1 版本文件清单

### 核心文件
- `manifest.json` - 插件配置（已更新为 NowView）
- `rules.json` - declarativeNetRequest 规则

### 背景脚本
- `background/service-worker.js` - 后台服务

### 内容脚本
- `content/content-script.js` - 主入口
- `content/link-preview.js` - 链接预览（含 Service Worker 清除）
- `content/preview-manager.js` - 预览管理
- `content/ui-manager.js` - UI 交互
- `content/reader-mode.js` - 阅读模式
- `content/video-mode.js` - 视频模式
- `content/translator.js` - 翻译
- `content/search.js` - 搜索
- `content/content-styles.css` - 样式

### 工具类
- `utils/constants.js` - 常量
- `utils/event-bus.js` - 事件总线
- `utils/dom-utils.js` - DOM 工具
- `utils/storage.js` - 存储管理

### UI 界面
- `popup/popup.html` - 弹出窗口（已恢复稳定版本）
- `popup/popup.css` - 弹出窗口样式
- `popup/popup.js` - 弹出窗口逻辑
- `options/options.html` - 设置页面
- `options/options.css` - 设置页面样式
- `options/options.js` - 设置页面逻辑

## 测试 v1 版本

### 步骤 1: 重新加载扩展
1. 打开 `chrome://extensions/`
2. 找到 "NowView" 扩展
3. 关闭再打开扩展（或点击刷新）

### 步骤 2: 测试基础功能
- ✅ 预览链接（Ctrl+点击）
- ✅ Pin 功能
- ✅ 统计计数
- ✅ 主题切换
- ✅ GitHub、知乎等网站预览

### 步骤 3: 确认无错误
打开浏览器控制台（F12），确认：
- 没有报错
- Service Worker 清除日志显示 `✅ Service workers cleared for: ...`
- 主题切换正常工作

## 下一步计划

v1 版本稳定后，将逐步添加以下功能：

### 第一阶段：小步优化 UI
1. 优化 popup 样式（保持原结构，只改进视觉）
2. 添加会员状态显示（Free 标识）
3. 优化按钮和卡片设计

### 第二阶段：多主题支持
1. 添加主题管理模块
2. 创建 4-5 个主题预设
3. 在 popup 中添加主题选择器

### 第三阶段：会员系统
1. 创建会员管理模块
2. 实现兑换码验证
3. 区分 Free 和 Pro 功能
4. 添加激活界面

## 注意事项

⚠️ **优化原则：**
- 小步迭代，每次只改一个功能
- 每次修改后立即测试
- 保留旧版本文件作为备份
- 不要一次性大改，避免引入错误

⚠️ **已知问题：**
- popup-broken.html 包含了未完成的改版，暂时不使用
- 需要逐步将新功能整合到稳定版本中

## 版本记录

- **v1.0.0** - 基础功能完成，插件更名为 NowView
  - iframe 限制绕过
  - Pin 功能
  - 统计计数
  - 主题切换
  - Service Worker 清除
