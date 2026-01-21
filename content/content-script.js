// Content Script 主入口文件
(function() {
  'use strict';

  console.log('NoTab Extension loaded');

  // 初始化标记
  let isInitialized = false;

  /**
   * 立即设置消息监听器（在初始化之前）
   * 这样可以确保 background 发送消息时接收端已存在
   */
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request);

    switch (request.action) {
      case 'previewLink':
        if (request.url) {
          // 等待初始化完成后再执行
          if (window.notabLinkPreview) {
            window.notabLinkPreview.showPreview(request.url, 100, 100);
            sendResponse({ success: true });
          } else {
            console.warn('LinkPreview not ready yet');
            sendResponse({ success: false, error: 'Extension not initialized' });
          }
        }
        break;

      case 'closeAllPreviews':
        if (window.notabPreviewManager) {
          window.notabPreviewManager.closeAll();
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false, error: 'Extension not initialized' });
        }
        break;

      case 'cascadeLayout':
        if (window.notabPreviewManager) {
          window.notabPreviewManager.cascadeLayout();
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false, error: 'Extension not initialized' });
        }
        break;

      case 'tileLayout':
        if (window.notabPreviewManager) {
          window.notabPreviewManager.tileLayout();
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false, error: 'Extension not initialized' });
        }
        break;

      case 'getStats':
        // 返回当前统计信息
        if (window.notabPreviewManager) {
          const total = window.notabPreviewManager.getCount();
          const pinned = window.notabPreviewManager.getPinnedCount();
          sendResponse({ success: true, total, pinned });
        } else {
          sendResponse({ success: false, total: 0, pinned: 0 });
        }
        break;

      case 'themeChanged':
        // 主题切换
        if (request.theme) {
          applyThemeChange(request.theme);
          sendResponse({ success: true });
        }
        break;

      default:
        sendResponse({ success: false, error: 'Unknown action' });
    }

    return true; // 保持消息通道开启
  });

  /**
   * 初始化扩展
   */
  async function initialize() {
    if (isInitialized) return;
    isInitialized = true;

    console.log('Initializing NoTab Extension...');

    // 加载用户设置
    await loadUserSettings();

    // 应用主题
    await applyTheme();

    // 监听键盘快捷键
    bindKeyboardShortcuts();

    // 绑定全局点击处理（点击外部关闭未固定预览）
    bindGlobalClickHandler();

    console.log('NoTab Extension initialized successfully');
  }

  /**
   * 加载用户设置
   */
  async function loadUserSettings() {
    try {
      const settings = await window.notabStorage.getSettings();
      console.log('Settings loaded:', settings);

      // 应用链接预览设置
      if (window.notabLinkPreview && settings.linkPreview) {
        window.notabLinkPreview.config = {
          ...window.notabLinkPreview.config,
          ...settings.linkPreview
        };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  /**
   * 应用主题
   */
  async function applyTheme() {
    try {
      const theme = await window.notabStorage.getSetting('theme');
      applyThemeChange(theme);

      // 监听主题变化
      window.notabEventBus.on(window.NOTAB_CONSTANTS.EVENTS.THEME_CHANGED, (newTheme) => {
        applyThemeChange(newTheme);
      });

      // 监听系统主题变化（仅在 auto 模式下）
      if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', async () => {
          const currentTheme = await window.notabStorage.getSetting('theme');
          if (currentTheme === 'auto') {
            applyThemeChange('auto');
          }
        });
      }

    } catch (error) {
      console.error('Failed to apply theme:', error);
    }
  }

  /**
   * 应用主题变化
   */
  function applyThemeChange(theme) {
    console.log('Applying theme:', theme);

    // 移除所有主题类
    document.documentElement.classList.remove('notab-dark-theme');
    document.documentElement.classList.remove('notab-light-theme');

    if (theme === 'dark') {
      document.documentElement.classList.add('notab-dark-theme');
    } else if (theme === 'light') {
      document.documentElement.classList.add('notab-light-theme');
    } else if (theme === 'auto') {
      // 根据系统偏好
      if (window.notabDomUtils?.isDarkMode()) {
        document.documentElement.classList.add('notab-dark-theme');
      } else {
        document.documentElement.classList.add('notab-light-theme');
      }
    }

    // 触发主题变化事件
    window.notabEventBus?.emit(
      window.NOTAB_CONSTANTS.EVENTS.THEME_CHANGED,
      theme
    );
  }

  /**
   * 绑定键盘快捷键
   */
  function bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Esc - 关闭所有未固定的预览
      if (e.key === 'Escape') {
        window.notabPreviewManager?.closeAllUnpinned();
      }

      // Ctrl+Shift+C - 级联布局
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        window.notabPreviewManager?.cascadeLayout();
      }

      // Ctrl+Shift+T - 平铺布局
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        window.notabPreviewManager?.tileLayout();
      }

      // Ctrl+Shift+X - 关闭所有预览
      if (e.ctrlKey && e.shiftKey && e.key === 'X') {
        e.preventDefault();
        window.notabPreviewManager?.closeAll();
      }
    });
  }

  /**
   * 绑定全局点击事件 - 点击预览窗口外部关闭未固定的预览
   */
  function bindGlobalClickHandler() {
    document.addEventListener('mousedown', (e) => {
      // 检查是否点击了预览窗口外部
      const clickedPreview = e.target.closest('.notab-preview-container');

      if (!clickedPreview && window.notabPreviewManager) {
        // 点击了外部区域，关闭所有未固定的预览
        window.notabPreviewManager.closeAllUnpinned();
      }
    }, true); // 使用捕获阶段，确保能够捕获到点击事件
  }

  /**
   * 页面加载完成后初始化
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();
