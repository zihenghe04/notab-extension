// Options Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  bindEvents();
});

/**
 * 加载设置
 */
function loadSettings() {
  chrome.storage.sync.get('settings', (result) => {
    const settings = result.settings || getDefaultSettings();

    // 主题
    document.querySelector(`input[name="theme"][value="${settings.theme || 'light'}"]`).checked = true;

    // 链接预览设置
    const linkPreview = settings.linkPreview || {};
    document.getElementById('showOnDrag').checked = linkPreview.showOnDrag !== false;
    document.getElementById('showOnCtrlClick').checked = linkPreview.showOnCtrlClick !== false;
    document.getElementById('showOnHover').checked = linkPreview.showOnHover === true;
    document.getElementById('hoverDelay').value = linkPreview.hoverDelay || 500;
    document.getElementById('hoverDelayValue').textContent = linkPreview.hoverDelay || 500;
    document.getElementById('defaultWidth').value = linkPreview.defaultWidth || 800;
    document.getElementById('defaultHeight').value = linkPreview.defaultHeight || 600;
    document.getElementById('enableMultiPreview').checked = linkPreview.enableMultiPreview !== false;

    // 显示/隐藏悬停延迟设置
    toggleHoverSection(linkPreview.showOnHover);

    // 阅读模式设置
    const readerMode = settings.readerMode || {};
    document.getElementById('fontSize').value = readerMode.fontSize || 18;
    document.getElementById('lineHeight').value = readerMode.lineHeight || 1.6;
    document.getElementById('maxWidth').value = readerMode.maxWidth || 700;
    document.getElementById('fontFamily').value = readerMode.fontFamily || 'Georgia, serif';

    // 翻译设置
    const translator = settings.translator || {};
    document.querySelector(`input[name="translatorApi"][value="${translator.apiProvider || 'LibreTranslate'}"]`).checked = true;
    document.getElementById('showQuickButton').checked = translator.showQuickButton !== false;
    document.getElementById('defaultTargetLang').value = translator.defaultTargetLang || 'auto';
  });
}

/**
 * 绑定事件
 */
function bindEvents() {
  // 标签切换
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      switchTab(tabName);
    });
  });

  // 悬停预览开关
  document.getElementById('showOnHover').addEventListener('change', (e) => {
    toggleHoverSection(e.target.checked);
  });

  // 悬停延迟滑块
  document.getElementById('hoverDelay').addEventListener('input', (e) => {
    document.getElementById('hoverDelayValue').textContent = e.target.value;
  });

  // 保存按钮
  document.getElementById('saveBtn').addEventListener('click', saveSettings);

  // 重置按钮
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('确定要重置所有设置吗？这将清除您的所有自定义设置。')) {
      resetSettings();
    }
  });

  // 导出设置
  document.getElementById('exportBtn').addEventListener('click', exportSettings);

  // 导入设置
  document.getElementById('importBtn').addEventListener('click', importSettings);
}

/**
 * 切换标签
 */
function switchTab(tabName) {
  // 更新标签状态
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });

  // 更新内容显示
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.dataset.content === tabName);
  });
}

/**
 * 切换悬停延迟设置显示
 */
function toggleHoverSection(show) {
  document.getElementById('hoverSection').style.display = show ? 'block' : 'none';
}

/**
 * 保存设置
 */
function saveSettings() {
  const settings = {
    theme: document.querySelector('input[name="theme"]:checked').value,

    linkPreview: {
      showOnDrag: document.getElementById('showOnDrag').checked,
      showOnCtrlClick: document.getElementById('showOnCtrlClick').checked,
      showOnHover: document.getElementById('showOnHover').checked,
      hoverDelay: parseInt(document.getElementById('hoverDelay').value),
      defaultWidth: parseInt(document.getElementById('defaultWidth').value),
      defaultHeight: parseInt(document.getElementById('defaultHeight').value),
      enableMultiPreview: document.getElementById('enableMultiPreview').checked
    },

    readerMode: {
      fontSize: parseInt(document.getElementById('fontSize').value),
      lineHeight: parseFloat(document.getElementById('lineHeight').value),
      maxWidth: parseInt(document.getElementById('maxWidth').value),
      fontFamily: document.getElementById('fontFamily').value
    },

    translator: {
      apiProvider: document.querySelector('input[name="translatorApi"]:checked').value,
      showQuickButton: document.getElementById('showQuickButton').checked,
      defaultTargetLang: document.getElementById('defaultTargetLang').value
    },

    search: {
      defaultEngine: 'Google',
      openInPreview: true
    }
  };

  chrome.storage.sync.set({ settings }, () => {
    showSaveStatus('设置已保存！', 'success');
  });
}

/**
 * 重置设置
 */
function resetSettings() {
  const defaultSettings = getDefaultSettings();

  chrome.storage.sync.set({ settings: defaultSettings }, () => {
    loadSettings();
    showSaveStatus('设置已重置！', 'success');
  });
}

/**
 * 导出设置
 */
function exportSettings() {
  chrome.storage.sync.get('settings', (result) => {
    const settings = result.settings || {};
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'notab-settings.json';
    link.click();

    URL.revokeObjectURL(url);
    showSaveStatus('设置已导出！', 'success');
  });
}

/**
 * 导入设置
 */
function importSettings() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const settings = JSON.parse(event.target.result);

        chrome.storage.sync.set({ settings }, () => {
          loadSettings();
          showSaveStatus('设置已导入！', 'success');
        });
      } catch (error) {
        showSaveStatus('导入失败：文件格式错误', 'error');
      }
    };

    reader.readAsText(file);
  });

  input.click();
}

/**
 * 显示保存状态
 */
function showSaveStatus(message, type = 'success') {
  const status = document.getElementById('saveStatus');
  status.textContent = message;
  status.className = `save-status ${type}`;
  status.style.display = 'block';

  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}

/**
 * 获取默认设置
 */
function getDefaultSettings() {
  return {
    theme: 'light',
    linkPreview: {
      showOnDrag: true,
      showOnCtrlClick: true,
      showOnHover: false,
      hoverDelay: 500,
      defaultWidth: 800,
      defaultHeight: 600,
      enableMultiPreview: true
    },
    readerMode: {
      fontSize: 18,
      lineHeight: 1.6,
      maxWidth: 700,
      fontFamily: 'Georgia, serif'
    },
    translator: {
      apiProvider: 'LibreTranslate',
      showQuickButton: true,
      defaultTargetLang: 'auto'
    },
    search: {
      defaultEngine: 'Google',
      openInPreview: true
    }
  };
}
