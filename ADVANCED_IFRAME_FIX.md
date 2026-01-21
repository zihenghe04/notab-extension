# 🔧 绕过 iframe 限制的完整解决方案

根据最新的研究和搜索结果，我发现了几个关键问题和解决方案。

## 问题分析

### 为什么 GitHub 和知乎仍然无法加载？

即使移除了 `X-Frame-Options` 和 `Content-Security-Policy` 头部，某些网站仍然无法在 iframe 中显示，原因包括：

1. **Service Workers 绕过了 declarativeNetRequest**
   - Service Workers 的响应不会被 declarativeNetRequest 拦截
   - GitHub 和很多现代网站都使用了 Service Workers
   - 这些 SW 缓存的响应仍然包含原始的 CSP 头部

2. **resourceTypes 配置不完整**
   - 之前只设置了 `["sub_frame"]`
   - 应该同时包含 `["main_frame", "sub_frame"]`

3. **initiatorDomains 限制问题**
   - `initiatorDomains: ["*"]` 在某些情况下不生效
   - 对于扩展内的 offscreen page 可能无法正常工作

4. **Cookie 问题**
   - `SameSite=Lax` 或 `SameSite=Strict` 的 Cookie 不会被发送到 iframe
   - 导致登录状态丢失或功能受限

## 解决方案汇总

### 方案 1: 修复 declarativeNetRequest 规则 ✅ (已实施)

**修改内容：**
```json
{
  "resourceTypes": ["main_frame", "sub_frame"],  // 添加 main_frame
  // 移除 initiatorDomains 限制
}
```

### 方案 2: 清除 Service Workers (需要实施)

**问题：** Service Workers 的响应绕过了 declarativeNetRequest

**解决方案：** 在加载 iframe 之前清除目标网站的 Service Workers

```javascript
// 清除 Service Workers
async function clearServiceWorkers(url) {
  const urlObj = new URL(url);
  const origin = urlObj.origin;

  try {
    await chrome.browsingData.removeServiceWorkers({
      origins: [origin]
    });
  } catch (error) {
    console.warn('Failed to clear service workers:', error);
  }
}
```

**需要的权限：**
```json
"permissions": [
  "browsingData"  // 新增
]
```

### 方案 3: 使用 Offscreen Document (替代方案)

**原理：** 不使用 iframe，而是在扩展的 offscreen document 中加载内容

**优点：**
- 完全绕过 CSP 和 X-Frame-Options
- 可以正常接收 Cookie
- 性能更好

**缺点：**
- 实现复杂度较高
- 需要重构现有代码

### 方案 4: 代理服务器 (不推荐)

**原理：** 通过后端代理服务器获取内容，重新渲染

**缺点：**
- 需要后端服务器
- 隐私问题
- 性能问题

## 推荐实施方案

### 短期方案：修复 rules.json (已完成)

✅ **已修改 rules.json：**
- 添加 `"main_frame"` 到 resourceTypes
- 移除 `initiatorDomains` 限制
- 添加 `"Frame-Options"` 头部移除

### 中期方案：添加 Service Worker 清除功能

需要实施以下修改：

#### 1. 修改 manifest.json

```json
"permissions": [
  "storage",
  "activeTab",
  "scripting",
  "contextMenus",
  "declarativeNetRequest",
  "browsingData"  // 新增
]
```

#### 2. 修改 link-preview.js

在加载 iframe 之前清除 Service Workers：

```javascript
async loadContent(container, url) {
  const body = container.querySelector('.notab-preview-body');

  try {
    // 先清除 Service Workers
    await this.clearServiceWorkers(url);

    // 然后加载 iframe
    const iframe = document.createElement('iframe');
    iframe.src = url;
    // ... 其余代码
  } catch (error) {
    console.error('Failed to load preview:', error);
  }
}

async clearServiceWorkers(url) {
  try {
    const urlObj = new URL(url);
    const origin = urlObj.origin;

    await chrome.browsingData.removeServiceWorkers({
      origins: [origin]
    });

    console.log('Service workers cleared for:', origin);
  } catch (error) {
    console.warn('Failed to clear service workers:', error);
  }
}
```

## 当前状态

### ✅ 已完成
1. declarativeNetRequest API 配置
2. 移除 X-Frame-Options 和 CSP 头部
3. 修复 resourceTypes 配置
4. 移除 initiatorDomains 限制

### ⏳ 待实施
1. 添加 browsingData 权限
2. 实现 Service Worker 清除功能
3. 测试 GitHub、知乎等网站

## 测试步骤

### 当前版本测试

1. **重新加载扩展**
   - 完全关闭再打开扩展

2. **测试简单网站** (应该可以)
   - Google
   - 百度
   - 简单的新闻网站

3. **测试复杂网站** (可能仍无法加载)
   - GitHub
   - 知乎
   - Twitter/X

### 完整版本测试 (实施 Service Worker 清除后)

所有网站都应该可以正常加载。

## 技术细节

### declarativeNetRequest 的限制

根据搜索结果，declarativeNetRequest 有以下已知限制：

1. **不拦截 Service Worker 响应**
   - SW 缓存的内容仍包含原始头部
   - 需要手动清除 SW

2. **无法修改部分头部**
   - 只能完全移除或完全替换
   - 不能追加或修改 CSP 的部分指令

3. **Cookie 限制**
   - SameSite Cookie 仍然受限
   - 无法通过 declarativeNetRequest 解决

## 参考资料

基于网络搜索的发现：

- [GitHub Issue: declarativeNetRequest and Service Workers](https://github.com/w3c/webextensions/issues/...)
- [Stack Overflow: Bypass CSP in Chrome Extension](https://stackoverflow.com/...)
- [Chrome Extension API: declarativeNetRequest](https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/)

## 下一步行动

### 立即测试 (当前版本)

重新加载扩展，测试 rules.json 的修复是否生效：

```bash
1. chrome://extensions/
2. 关闭再打开 "NoTab Pro Clone"
3. 测试 GitHub、知乎等网站
```

### 如果仍无法加载

实施 Service Worker 清除功能：

1. 修改 manifest.json 添加 browsingData 权限
2. 在 link-preview.js 中添加 clearServiceWorkers 方法
3. 在加载 iframe 前调用清除功能

---

**Sources:**
- [Requestly: Bypass X-Frame-Options](https://requestly.com)
- [GitHub: declarativeNetRequest Service Worker Issue](https://github.com/w3c/webextensions)
- [Stack Overflow: Chrome Extension CSP Bypass](https://stackoverflow.com)
- [Chrome Developers: declarativeNetRequest API](https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/)
- [Medium: Understanding CSP frame-ancestors](https://medium.com)
