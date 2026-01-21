// Background Service Worker
console.log('NoTab Extension Background Service Worker loaded');

// 处理来自content script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);

  switch (request.action) {
    case 'fetchUrl':
      handleFetchUrl(request.url, sendResponse);
      return true; // 保持消息通道开启

    case 'openPreview':
      handleOpenPreview(request.url, sender.tab.id);
      sendResponse({ success: true });
      break;

    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }

  return true;
});

/**
 * 处理URL获取请求（解决CORS问题）
 */
async function handleFetchUrl(url, sendResponse) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    sendResponse({ success: true, html: html });

  } catch (error) {
    console.error('Fetch error:', error);
    sendResponse({
      success: false,
      error: error.message || '无法获取页面内容'
    });
  }
}

/**
 * 打开预览窗口
 */
async function handleOpenPreview(url, tabId) {
  try {
    await chrome.tabs.sendMessage(tabId, {
      action: 'previewLink',
      url: url
    });
  } catch (error) {
    console.error('Failed to open preview:', error);
  }
}

// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  console.log('NoTab Extension installed');

  // 创建右键菜单项
  chrome.contextMenus.create({
    id: 'notab-preview-link',
    title: '在预览窗口中打开',
    contexts: ['link']
  });

  chrome.contextMenus.create({
    id: 'notab-preview-page',
    title: '在预览窗口中打开此页面',
    contexts: ['page']
  });

  chrome.contextMenus.create({
    id: 'notab-separator',
    type: 'separator',
    contexts: ['link', 'page']
  });

  chrome.contextMenus.create({
    id: 'notab-close-all',
    title: '关闭所有预览窗口',
    contexts: ['page']
  });
});

// 处理右键菜单点击
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  try {
    switch (info.menuItemId) {
      case 'notab-preview-link':
        if (info.linkUrl) {
          await chrome.tabs.sendMessage(tab.id, {
            action: 'previewLink',
            url: info.linkUrl
          });
        }
        break;

      case 'notab-preview-page':
        if (info.pageUrl) {
          await chrome.tabs.sendMessage(tab.id, {
            action: 'previewLink',
            url: info.pageUrl
          });
        }
        break;

      case 'notab-close-all':
        await chrome.tabs.sendMessage(tab.id, {
          action: 'closeAllPreviews'
        });
        break;
    }
  } catch (error) {
    console.error('Error sending message to content script:', error);
    // 可能是因为页面还没有加载完成，尝试注入 content script
    if (error.message?.includes('Could not establish connection')) {
      console.log('Content script not ready, attempting to inject...');
      // 这里可以选择重新注入脚本，或者提示用户刷新页面
    }
  }
});

// 处理快捷键命令
chrome.commands.onCommand.addListener(async (command) => {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tabs[0]) {
      switch (command) {
        case 'close-all-previews':
          await chrome.tabs.sendMessage(tabs[0].id, {
            action: 'closeAllPreviews'
          });
          break;

        case 'cascade-layout':
          await chrome.tabs.sendMessage(tabs[0].id, {
            action: 'cascadeLayout'
          });
          break;

        case 'tile-layout':
          await chrome.tabs.sendMessage(tabs[0].id, {
            action: 'tileLayout'
          });
          break;
      }
    }
  } catch (error) {
    console.error('Error executing command:', error);
  }
});

// 监听扩展图标点击
chrome.action.onClicked.addListener((tab) => {
  // 打开popup（如果设置了default_popup，这个不会触发）
  console.log('Extension icon clicked');
});
