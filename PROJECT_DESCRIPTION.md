# NowView - 智能链接预览 Chrome 扩展

## 项目概述

**NowView** 是一个功能强大的 Chrome 浏览器扩展，完全复刻 notab.pro 的功能。它提供了一套完整的链接预览、内容管理和阅读增强工具，帮助用户在浏览网页时获得更高效和沉浸式的体验。

### 项目信息
- **名称**：NowView
- **类型**：Chrome 浏览器扩展（Manifest V3）
- **版本**：v1.0.0（稳定版）
- **开发语言**：JavaScript、HTML、CSS
- **项目状态**：功能完整，持续迭代优化

---

## ✨ 核心功能特性

### 1. **智能链接预览** 🔗
在当前页面浮窗中预览链接内容，无需打开新标签页。支持多种交互方式：
- **Ctrl+点击** - 快速预览
- **右键菜单** - 在预览窗口中打开
- **拖拽链接** - 拖拽到页面空白处预览

### 2. **沉浸式阅读模式** 📖
自动提取网页的主要内容，去除广告、侧栏等干扰元素，提供沉浸式阅读体验。支持：
- 自动内容提取
- 优化的排版和间距
- 舒适的字体大小

### 3. **视频播放优化** 🎬
自动检测视频网站内容，提供优化的视频播放体验：
- 全屏播放支持
- 自动视频检测
- 流畅的视频加载

### 4. **快速翻译** 🌐
选中文本一键翻译，支持多语言翻译需求：
- 浮窗快速翻译
- 多语言支持
- 即时翻译反馈

### 5. **快速搜索** 🔍
快速搜索选中的文本，支持多个搜索引擎：
- 多搜索引擎支持
- 快速搜索触发
- 自定义搜索配置

### 6. **主题切换系统** 🎨
提供灵活的主题管理：
- **亮色主题** - 明亮清爽的界面
- **暗色主题** - 护眼的深色模式
- **自动切换** - 根据系统时间自动切换
- **自定义主题** - 支持主题自定义扩展

### 7. **多窗口管理** 📌
同时预览多个链接，轻松管理多个窗口：
- **Pin 功能** - 固定重要窗口，防止意外关闭
- **浮窗管理** - 拖拽移动窗口位置
- **活动/固定统计** - 实时显示窗口数量统计

### 8. **iframe 限制绕过** 🔐
使用 declarativeNetRequest + Service Worker 清除机制，突破网站的 iframe 限制：
- 自动移除 X-Frame-Options 头
- 自动清除浏览器 Service Workers
- 支持大部分需要 iframe 限制绕过的网站

### 9. **数据同步** ☁️
使用 Chrome Storage API 进行数据同步：
- 自动保存用户设置
- 跨设备同步功能支持
- 隐私保护的本地存储

---

## 📁 项目结构

```
notab-extension/
├── manifest.json                    # 扩展配置文件（Manifest V3）
├── rules.json                       # declarativeNetRequest 规则
│
├── background/
│   └── service-worker.js           # 后台服务工作线程
│
├── content/
│   ├── content-script.js           # 主入口脚本
│   ├── link-preview.js             # 链接预览核心模块
│   ├── preview-manager.js          # 预览窗口管理
│   ├── ui-manager.js               # UI 交互管理
│   ├── reader-mode.js              # 阅读模式
│   ├── video-mode.js               # 视频模式
│   ├── translator.js               # 翻译功能
│   ├── search.js                   # 搜索功能
│   └── content-styles.css          # 内容脚本样式
│
├── popup/
│   ├── popup.html                  # 弹出窗口 UI
│   ├── popup.css                   # 弹出窗口样式
│   ├── popup.js                    # 弹出窗口逻辑
│   └── [backup files]              # 旧版本备份
│
├── options/
│   ├── options.html                # 设置页面 UI
│   ├── options.css                 # 设置页面样式
│   └── options.js                  # 设置页面逻辑
│
├── utils/
│   ├── constants.js                # 常量定义
│   ├── event-bus.js                # 事件总线（发布订阅）
│   ├── dom-utils.js                # DOM 操作工具函数
│   ├── storage.js                  # 存储管理
│   ├── theme-manager.js            # 主题管理
│   └── membership.js               # 会员系统管理
│
├── themes/
│   └── [主题文件]                  # 预设主题定义
│
├── icons/
│   └── [扩展图标文件]              # 扩展显示图标
│
└── [文档文件]
    ├── README.md                   # 项目说明
    ├── VERSION_V1.md               # v1.0.0 版本说明
    ├── PROJECT_SUMMARY.md          # 项目总结
    ├── TESTING_GUIDE_V1.2.md       # 测试指南
    └── [其他版本/修复文档]
```

---

## 🔧 技术架构

### 核心技术栈
- **Manifest V3** - Chrome 扩展最新标准
- **Service Worker** - 后台服务脚本
- **Content Script** - 页面内容脚本注入
- **Chrome Storage API** - 数据持久化与同步
- **declarativeNetRequest** - 网络请求过滤与修改
- **Event-driven Architecture** - 事件驱动架构（EventBus）

### 架构设计特点

#### 1. **模块化设计**
- 功能模块相互独立（reader-mode、video-mode、translator、search）
- 通过 EventBus 实现模块间通信
- 易于扩展和维护

#### 2. **Service Worker 机制**
```javascript
// Service Worker 负责：
- 监听 declarativeNetRequest 规则执行
- 清除旧 Service Workers（绕过 iframe 限制）
- 管理后台任务和定时器
```

#### 3. **事件驱动通信**
```javascript
// 通过 EventBus 进行模块间通信，避免直接耦合
EventBus.emit('preview:open', { url, position })
EventBus.on('theme:changed', (theme) => { /* ... */ })
```

#### 4. **主题系统**
- 中央化主题管理（theme-manager.js）
- 主题变化时广播至全部模块
- 支持亮/暗/自动三种模式

#### 5. **存储层抽象**
- 统一的 storage.js 接口
- 自动处理本地/同步存储切换
- 支持数据加密和压缩扩展

---

## 📋 核心模块说明

### Service Worker (`background/service-worker.js`)
**职责**：
- 监听扩展生命周期事件
- 管理 declarativeNetRequest 规则
- 定期清除浏览器 Service Workers（iframe 限制绕过）
- 处理后台计时任务

**关键特性**：
```javascript
// 定期清除 Service Workers，绕过 iframe X-Frame-Options 限制
chrome.alarms.create('clearWorkers', { periodInMinutes: 5 })
// 自动清除历史记录中的 Service Workers
```

### 链接预览模块 (`content/link-preview.js`)
**职责**：
- 监听页面链接的交互事件
- 创建和管理预览浮窗
- 处理内容 iframe 加载
- 集成 Service Worker 清除机制

**核心交互**：
```javascript
// Ctrl+Click 触发预览
document.addEventListener('click', handleLinkClick)

// 浮窗管理
createPreviewWindow(url, position)
cleanupPreviewWindow(windowId)
```

### 预览管理器 (`content/preview-manager.js`)
**职责**：
- 管理所有活跃预览窗口
- 处理窗口位置和大小
- 实现 Pin 功能（固定窗口）
- 统计活跃/固定窗口数量

**主要功能**：
```javascript
// Pin 功能 - 固定重要窗口
togglePin(windowId) // 切换固定状态

// 统计 - 用于 popup 显示
getStatistics() // { activeCount, pinnedCount }

// 清理 - 自动清理已关闭窗口
cleanup()
```

### UI 管理器 (`content/ui-manager.js`)
**职责**：
- 处理用户交互事件
- 管理浮窗上的按钮和控件
- 实现拖拽、缩放等交互
- 消息传递给各功能模块

**交互流程**：
```javascript
// 用户点击按钮
button.addEventListener('click', async (e) => {
  // 根据按钮类型触发相应模块
  if (button.classList.contains('reader-btn')) {
    EventBus.emit('reader:toggle', { windowId })
  }
})
```

### 阅读模式 (`content/reader-mode.js`)
**职责**：
- 提取网页主要内容
- 清除广告和干扰元素
- 优化排版和可读性
- 保存阅读状态

### 视频模式 (`content/video-mode.js`)
**职责**：
- 检测视频资源
- 优化视频播放体验
- 处理全屏显示
- 自适应分辨率

### 翻译模块 (`content/translator.js`)
**职责**：
- 快速翻译选中文本
- 支持多语言
- 浮窗显示翻译结果
- 缓存翻译记录

### 搜索模块 (`content/search.js`)
**职责**：
- 快速搜索选中文本
- 支持多搜索引擎
- 自定义搜索配置
- 记录搜索历史

### 主题管理器 (`utils/theme-manager.js`)
**职责**：
- 加载和切换主题
- 应用主题样式
- 监听系统主题变化（自动模式）
- 广播主题变化事件

---

## 🚀 快速开始

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/yourusername/notab-extension.git
   cd notab-extension
   ```

2. **加载到 Chrome**
   - 打开 `chrome://extensions/`
   - 开启右上角 **"开发者模式"**
   - 点击 **"加载已解压的扩展程序"**
   - 选择项目文件夹
   - 完成！

3. **验证安装**
   - Chrome 右上角应显示 **"NowView"** 图标
   - 点击图标查看统计和设置

### 使用指南

#### 基础预览
| 操作 | 效果 |
|------|------|
| **Ctrl + 点击** 链接 | 在浮窗中预览 |
| **右键** 链接 → "在预览窗口中打开" | 右键菜单预览 |
| **拖拽** 链接到空白区 | 拖拽预览 |
| **Ctrl + Shift + P** | 打开/关闭所有预览 |

#### 高级功能
1. **固定窗口** - 点击📌 按钮固定重要内容，防止意外关闭
2. **阅读模式** - 点击📖 按钮提取文章主要内容
3. **视频模式** - 自动检测视频网站，点击🎬 查看视频
4. **翻译** - 选中文本，点击🌐 即时翻译
5. **搜索** - 选中文本，点击🔍 快速搜索

#### 设置页面
右键点击扩展图标 → "选项" 或在 popup 中点击⚙️：
- 🎨 主题选择（亮色/暗色/自动）
- 🌐 语言设置
- 📊 查看使用统计
- 🔐 隐私设置

---

## 📊 版本历史

### v1.0.0（稳定版） ✅ 当前版本
**发布日期**：2026年1月

**功能完整**：
- ✅ iframe 限制绕过（declarativeNetRequest + Service Worker 清除）
- ✅ Pin 功能（固定窗口）
- ✅ 统计计数（活动预览/固定预览）
- ✅ 主题切换（亮色/暗色/自动）
- ✅ 链接预览核心功能
- ✅ 阅读模式
- ✅ 视频模式
- ✅ 翻译功能
- ✅ 搜索功能

**已知限制**：
- popup-broken.html 包含未完成的改版，暂不使用

### 后续计划

#### 第一阶段：UI 优化 🎨
- [ ] 优化 popup 样式和布局
- [ ] 改进浮窗设计
- [ ] 添加会员状态显示（Free 标识）
- [ ] 优化按钮和卡片视觉

#### 第二阶段：主题扩展 🌈
- [ ] 创建 4-5 个主题预设
- [ ] 在 popup 中添加主题选择器
- [ ] 主题预览功能
- [ ] 自定义主题编辑器

#### 第三阶段：会员系统 👑
- [ ] 创建会员管理模块
- [ ] 实现兑换码验证系统
- [ ] Free/Pro 功能区分
- [ ] 会员激活页面
- [ ] 订阅管理

---

## 🧪 测试指南

### 本地测试流程

1. **重新加载扩展**
   - 打开 `chrome://extensions/`
   - 找到 "NowView" 扩展
   - 点击刷新按钮或关闭后再打开

2. **测试基础功能**
   - ✅ 预览链接（Ctrl+点击）
   - ✅ Pin 功能（点击📌固定/解除）
   - ✅ 统计计数（查看 popup 显示）
   - ✅ 主题切换（亮/暗/自动）
   - ✅ GitHub、知乎等主流网站预览

3. **检查控制台日志**
   - 打开浏览器控制台（F12）
   - 查找 Service Worker 清除日志：`✅ Service workers cleared for: ...`
   - 确认没有 JavaScript 错误
   - 验证主题切换正常工作

4. **测试 iframe 限制绕过**
   ```javascript
   // 在控制台验证 X-Frame-Options 是否被移除
   fetch('https://example.com').then(r => {
     console.log('X-Frame-Options:', r.headers.get('X-Frame-Options'))
   })
   ```

### 常见问题排查

| 问题 | 解决方案 |
|------|--------|
| 预览窗口不显示 | 重新加载扩展，检查控制台错误 |
| Service Worker 清除失败 | 检查 rules.json 权限配置 |
| 主题切换无效 | 清除浏览器缓存和存储 |
| iframe 加载失败 | 检查目标网站是否有特殊限制 |

---

## 🔐 隐私与安全

### 数据处理
- **本地存储** - 所有用户数据存储在本地浏览器
- **无外部通信** - 除非用户主动触发翻译/搜索，否则不发送数据
- **翻译服务** - 使用第三方翻译 API（用户可配置）
- **搜索** - 直接转发到搜索引擎，无中间处理

### 权限说明
| 权限 | 用途 |
|------|------|
| `storage` | 保存用户设置和统计数据 |
| `activeTab` | 获取当前活跃标签信息 |
| `scripting` | 在页面注入内容脚本 |
| `contextMenus` | 添加右键菜单项 |
| `declarativeNetRequest` | 移除 iframe 限制头 |
| `browsingData` | 清除 Service Workers |
| `<all_urls>` | 在所有网站上运行 |

---

## 🛠️ 开发指南

### 环境要求
- Chrome 浏览器 88+（支持 Manifest V3）
- 文本编辑器（VS Code 推荐）
- 基础的 JavaScript/HTML/CSS 知识

### 项目开发原则

⚠️ **优化原则**：
1. **小步迭代** - 每次只改一个功能
2. **及时测试** - 每次修改后立即在 Chrome 中加载和测试
3. **备份旧版本** - 保留旧版本文件以便回滚
4. **避免大改** - 不要一次性修改多个文件，易引入错误

### 添加新功能

1. **创建新模块文件**
   ```bash
   touch content/new-feature.js
   ```

2. **通过 EventBus 集成**
   ```javascript
   // new-feature.js
   EventBus.on('preview:open', ({ windowId, url }) => {
     // 实现新功能
   })
   
   EventBus.emit('newFeature:done', { result })
   ```

3. **在 manifest.json 中注册**
   ```json
   "content_scripts": [{
     "js": ["content/new-feature.js"]
   }]
   ```

4. **测试新功能**
   - 重新加载扩展
   - 验证功能正常
   - 检查控制台错误

### 调试技巧

```javascript
// 在 content 脚本中调试
console.log('%c[NowView]', 'color: #00a8ff; font-weight: bold;', 'message')

// 在 Service Worker 中调试
chrome://serviceworker-internals/

// 查看存储的数据
chrome.storage.local.get(null, (items) => {
  console.table(items)
})
```

---

## 📚 文档索引

| 文档 | 描述 |
|------|------|
| [README.md](README.md) | 项目基本说明和使用指南 |
| [VERSION_V1.md](VERSION_V1.md) | v1.0.0 版本详细说明 |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | 项目总体总结 |
| [TESTING_GUIDE_V1.2.md](TESTING_GUIDE_V1.2.md) | 详细的测试指南 |
| [OPTIMIZATION_PLAN.md](OPTIMIZATION_PLAN.md) | 性能优化计划 |

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 报告 Bug
1. 描述问题现象
2. 提供复现步骤
3. 附加浏览器版本和控制台错误信息
4. 截图或视频演示

### 提交改进
1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

---

## 📝 许可证

待定（根据项目实际情况选择）

---

## 📞 联系方式

如有问题或建议，欢迎通过以下方式联系：
- GitHub Issues
- 邮件反馈
- Chrome 商店评论

---

## 🎯 项目愿景

**NowView** 的目标是成为最智能、最易用的 Chrome 链接预览工具，帮助用户：
- 📱 提升浏览效率 - 无需打开新标签即可预览
- 🎯 专注内容阅读 - 沉浸式阅读模式去除干扰
- 🌍 跨越语言障碍 - 一键翻译任意选中内容
- 🔐 保护用户隐私 - 完全本地存储，无外部追踪
- 🎨 个性化体验 - 灵活的主题和设置系统

---

**最后更新**：2026年1月21日
**维护者**：NowView 开发团队
