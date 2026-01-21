# 紧急修复 - v1.2.1

## 问题
Popup 无法访问 theme-manager 和 membership-manager，因为它们只在 content script 中加载。

## 解决方案
在 popup.html 中直接引入管理器脚本：

```html
<script src="../utils/event-bus.js"></script>
<script src="../utils/theme-manager.js"></script>
<script src="../utils/membership.js"></script>
<script src="popup.js"></script>
```

## 修改文件
- ✅ popup/popup.html - 添加脚本引用
- ✅ popup/popup.js - 移除不必要的等待逻辑

## 测试
1. 重新加载扩展
2. 打开 popup
3. 应该立即显示，无错误
4. 主题和会员功能正常

---
修复时间：2024-01-21
版本：v1.2.1
