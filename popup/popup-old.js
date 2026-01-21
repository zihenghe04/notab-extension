// Popup JavaScript
document.addEventListener('DOMContentLoaded', async () => {
  // 加载设置
  await loadSettings();

  // 更新统计信息
  updateStats();

  // 绑定事件
  bindEvents();
});

/**
 * 加载设置
 */
async function loadSettings() {
  chrome.storage.sync.get('settings', (result) => {
    const settings = result.settings || {};
    const linkPreview = settings.linkPreview || {};
    const theme = settings.theme || 'light';

    // 更新开关状态
    document.getElementById('enableDrag').checked = linkPreview.showOnDrag !== false;
    document.getElementById('enableCtrlClick').checked = linkPreview.showOnCtrlClick !== false;
    document.getElementById('enableHover').checked = linkPreview.showOnHover === true;

    // 高亮当前主题
    document.querySelectorAll('.theme-btn').forEach(btn => {
      if (btn.dataset.theme === theme) {
        btn.classList.add('active');
      }
    });
  });
}

/**
 * 更新统计信息
 */
async function updateStats() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab) {
      chrome.tabs.sendMessage(tab.id, { action: 'getStats' }, (response) => {
        if (response) {
          document.getElementById('activeCount').textContent = response.total || 0;
          document.getElementById('pinnedCount').textContent = response.pinned || 0;
        }
      });
    }
  } catch (error) {
    console.error('Failed to update stats:', error);
  }
}

/**
 * 绑定事件
 */
function bindEvents() {
  // 级联布局
  document.getElementById('cascadeBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'cascadeLayout' });
    showToast('已应用级联布局');
  });

  // 平铺布局
  document.getElementById('tileBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'tileLayout' });
    showToast('已应用平铺布局');
  });

  // 关闭所有
  document.getElementById('closeAllBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'closeAllPreviews' });
    showToast('已关闭所有预览');
    setTimeout(updateStats, 300);
  });

  // 拖拽开关
  document.getElementById('enableDrag').addEventListener('change', (e) => {
    updateSetting('linkPreview.showOnDrag', e.target.checked);
  });

  // Ctrl+点击开关
  document.getElementById('enableCtrlClick').addEventListener('change', (e) => {
    updateSetting('linkPreview.showOnCtrlClick', e.target.checked);
  });

  // 悬停开关
  document.getElementById('enableHover').addEventListener('change', (e) => {
    updateSetting('linkPreview.showOnHover', e.target.checked);
  });

  // 主题切换
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      updateTheme(theme);

      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // 高级设置
  document.getElementById('optionsBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // 帮助
  document.getElementById('helpBtn').addEventListener('click', (e) => {
    e.preventDefault();
    showToast('使用 Ctrl+点击 或 拖拽链接 来预览网页！');
  });
}

/**
 * 更新设置
 */
function updateSetting(key, value) {
  chrome.storage.sync.get('settings', (result) => {
    const settings = result.settings || {};

    // 使用点号分隔的路径设置嵌套值
    const keys = key.split('.');
    let target = settings;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!target[keys[i]]) {
        target[keys[i]] = {};
      }
      target = target[keys[i]];
    }

    target[keys[keys.length - 1]] = value;

    chrome.storage.sync.set({ settings }, () => {
      showToast('设置已保存');
    });
  });
}

/**
 * 更新主题
 */
async function updateTheme(theme) {
  chrome.storage.sync.get('settings', (result) => {
    const settings = result.settings || {};
    settings.theme = theme;

    chrome.storage.sync.set({ settings }, async () => {
      showToast(`已切换到${theme === 'light' ? '亮色' : theme === 'dark' ? '暗色' : '自动'}主题`);

      // 通知所有标签页主题已更改
      try {
        const tabs = await chrome.tabs.query({});

        for (const tab of tabs) {
          // 只向支持的标签页发送消息
          if (tab.url && !tab.url.startsWith('chrome://') &&
              !tab.url.startsWith('chrome-extension://') &&
              !tab.url.startsWith('edge://') &&
              !tab.url.startsWith('about:')) {
            try {
              await chrome.tabs.sendMessage(tab.id, {
                action: 'themeChanged',
                theme: theme
              });
            } catch (err) {
              // 忽略无法发送消息的标签页
              console.debug('Could not send message to tab:', tab.id, err.message);
            }
          }
        }
      } catch (error) {
        console.error('Failed to broadcast theme change:', error);
      }
    });
  });
}

/**
 * 显示提示
 */
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
