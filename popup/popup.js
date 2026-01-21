// Popup JavaScript - NowView v1.2
let membershipManager = null;
let themeManager = null;

document.addEventListener('DOMContentLoaded', async () => {
  console.log('NowView Popup loaded');

  // 直接初始化管理器（它们已经在 HTML 中加载）
  membershipManager = window.membershipManager;
  themeManager = window.themeManager;

  // 等待管理器初始化完成
  await new Promise(resolve => setTimeout(resolve, 100));

  // 初始化所有功能
  await initMembership();
  await initThemes();
  await loadSettings();
  updateStats();
  bindEvents();
});

/**
 * 初始化会员状态
 */
async function initMembership() {
  const membershipInfo = membershipManager?.getMembershipInfo();
  const badge = document.getElementById('membershipBadge');
  const upgradeCard = document.getElementById('proUpgradeCard');

  if (membershipInfo?.isPro) {
    // Pro 用户
    badge.classList.add('pro');
    badge.querySelector('.badge-icon').textContent = '👑';
    badge.querySelector('.badge-text').textContent = 'Pro';
    upgradeCard.style.display = 'none';
  } else {
    // Free 用户
    badge.classList.remove('pro');
    badge.querySelector('.badge-icon').textContent = '✨';
    badge.querySelector('.badge-text').textContent = 'Free';
    upgradeCard.style.display = 'block';

    // 显示剩余预览次数
    await updatePreviewLimit();
  }
}

/**
 * 更新预览次数限制显示
 */
async function updatePreviewLimit() {
  const canPreview = await membershipManager?.canCreatePreview();
  const upgradeCard = document.getElementById('proUpgradeCard');

  if (canPreview && !canPreview.allowed) {
    // 已用完
    upgradeCard.querySelector('.upgrade-header p').innerHTML =
      `⚠️ <strong style="color: #ff6b6b;">今日预览次数已用完</strong>`;
  } else if (canPreview && canPreview.remaining >= 0) {
    // 还有剩余
    const remaining = canPreview.remaining;
    const color = remaining <= 3 ? '#ff6b6b' : '#ffa94d';
    upgradeCard.querySelector('.upgrade-header p').innerHTML =
      `今日还剩 <strong style="color: ${color};">${remaining}/10</strong> 次预览`;
  }
}

/**
 * 初始化主题
 */
async function initThemes() {
  const themeGrid = document.getElementById('themeGrid');
  const themes = themeManager?.getAllThemes() || [];
  const currentTheme = themeManager?.getCurrentTheme() || 'light';
  const isPro = membershipManager?.getMembershipInfo()?.isPro || false;

  themeGrid.innerHTML = '';

  themes.forEach(theme => {
    const themeCard = document.createElement('button');
    themeCard.className = 'theme-card';
    themeCard.dataset.theme = theme.id;

    // 设置主题色
    themeCard.style.setProperty('--theme-color', theme.colors.primary);
    themeCard.style.setProperty('--theme-preview-bg',
      `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`);

    // 检查是否为 Pro 主题
    const isLocked = theme.isPro && !isPro;
    if (isLocked) {
      themeCard.classList.add('pro-locked');
    }

    // 当前选中的主题
    if (theme.id === currentTheme) {
      themeCard.classList.add('active');
    }

    themeCard.innerHTML = `
      <div class="theme-preview" style="background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})"></div>
      <span class="theme-name">${theme.emoji} ${theme.name}</span>
    `;

    // 点击事件
    themeCard.addEventListener('click', async () => {
      if (isLocked) {
        showUpgradeModal();
        return;
      }

      const success = await themeManager.applyTheme(theme.id);
      if (success) {
        // 更新选中状态
        document.querySelectorAll('.theme-card').forEach(card => {
          card.classList.remove('active');
        });
        themeCard.classList.add('active');
        showToast(`已切换到 ${theme.emoji} ${theme.name} 主题`);
      }
    });

    themeGrid.appendChild(themeCard);
  });
}

/**
 * 显示升级模态框
 */
function showUpgradeModal() {
  const modal = document.getElementById('activationModal');
  modal.style.display = 'flex';
}

/**
 * 关闭模态框
 */
function closeModal() {
  const modal = document.getElementById('activationModal');
  const codeInput = document.getElementById('codeInput');
  const codeMessage = document.getElementById('codeMessage');

  modal.style.display = 'none';
  codeInput.value = '';
  codeMessage.textContent = '';
  codeMessage.className = 'code-message';
}

/**
 * 激活 Pro
 */
async function activatePro() {
  const codeInput = document.getElementById('codeInput');
  const codeMessage = document.getElementById('codeMessage');
  const code = codeInput.value.trim();

  if (!code) {
    codeMessage.textContent = '请输入兑换码';
    codeMessage.className = 'code-message error';
    return;
  }

  codeMessage.textContent = '验证中...';
  codeMessage.className = 'code-message';

  const result = await membershipManager.validateCode(code);

  if (result.success) {
    codeMessage.textContent = result.message;
    codeMessage.className = 'code-message success';

    // 延迟关闭模态框并刷新
    setTimeout(() => {
      closeModal();
      initMembership();
      initThemes();
      showToast('🎉 Pro 会员激活成功！');
    }, 1500);
  } else {
    codeMessage.textContent = result.message;
    codeMessage.className = 'code-message error';
  }
}

/**
 * 加载设置
 */
async function loadSettings() {
  chrome.storage.sync.get('settings', (result) => {
    const settings = result.settings || {};
    const linkPreview = settings.linkPreview || {};

    // 更新开关状态
    document.getElementById('enableDrag').checked = linkPreview.showOnDrag !== false;
    document.getElementById('enableCtrlClick').checked = linkPreview.showOnCtrlClick !== false;
    document.getElementById('enableHover').checked = linkPreview.showOnHover === true;
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
  // 布局按钮
  document.getElementById('cascadeBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'cascadeLayout' });
    showToast('已应用级联布局');
  });

  document.getElementById('tileBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'tileLayout' });
    showToast('已应用平铺布局');
  });

  document.getElementById('closeAllBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'closeAllPreviews' });
    showToast('已关闭所有预览');
    setTimeout(updateStats, 300);
  });

  // 设置开关
  document.getElementById('enableDrag').addEventListener('change', (e) => {
    updateSetting('linkPreview.showOnDrag', e.target.checked);
  });

  document.getElementById('enableCtrlClick').addEventListener('change', (e) => {
    updateSetting('linkPreview.showOnCtrlClick', e.target.checked);
  });

  document.getElementById('enableHover').addEventListener('change', (e) => {
    updateSetting('linkPreview.showOnHover', e.target.checked);
  });

  // Pro 激活按钮
  document.getElementById('activateProBtn').addEventListener('click', showUpgradeModal);

  // 模态框控制
  document.getElementById('closeModal').addEventListener('click', closeModal);
  document.getElementById('cancelBtn').addEventListener('click', closeModal);
  document.getElementById('activateBtn').addEventListener('click', activatePro);

  // 点击遮罩关闭
  document.querySelector('.modal-overlay').addEventListener('click', closeModal);

  // Enter 键激活
  document.getElementById('codeInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      activatePro();
    }
  });

  // 高级设置
  document.getElementById('optionsBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // 帮助
  document.getElementById('helpBtn').addEventListener('click', (e) => {
    e.preventDefault();
    showToast('💡 Ctrl+点击 或 拖拽链接 来预览网页！');
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
 * 显示提示
 */
function showToast(message) {
  // 移除已存在的 toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

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
