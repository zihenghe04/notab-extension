// 链接预览核心模块
class LinkPreview {
  constructor() {
    this.config = {
      triggerMethod: 'drag',
      hoverDelay: 500,
      enableMultiPreview: true,
      showOnHover: false,
      showOnCtrlClick: true,
      showOnDrag: true
    };

    this.hoverTimer = null;
    this.draggedLink = null;

    this.init();
  }

  /**
   * 初始化
   */
  async init() {
    // 加载设置
    await this.loadSettings();

    // 绑定事件
    this.bindLinkEvents();

    // 监听设置变化
    window.notabStorage.onSettingsChange((settings) => {
      this.config = { ...this.config, ...settings.linkPreview };
    });

    // 监听主题变化
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === 'themeChanged') {
        this.applyThemeToAllPreviews(message.theme);
      }
    });
  }

  /**
   * 应用主题到所有预览窗口
   */
  async applyThemeToAllPreviews(themeName) {
    const theme = window.themeManager?.themes[themeName];
    if (!theme) return;

    const containers = document.querySelectorAll('.notab-preview-container');
    containers.forEach(container => {
      // 移除所有主题类
      container.classList.remove('theme-light', 'theme-dark', 'theme-ocean', 'theme-sunset', 'theme-forest', 'theme-purple');

      // 添加当前主题类
      container.classList.add(`theme-${themeName}`);

      // 更新头部渐变色
      const header = container.querySelector('.notab-preview-header');
      if (header) {
        header.style.background = theme.colors.gradient;
      }
    });
  }

  /**
   * 加载设置
   */
  async loadSettings() {
    const settings = await window.notabStorage.getSetting('linkPreview');
    if (settings) {
      this.config = { ...this.config, ...settings };
    }
  }

  /**
   * 绑定链接事件
   */
  bindLinkEvents() {
    // Ctrl/Alt + 点击
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link || !link.href) return;

      if ((e.ctrlKey || e.metaKey) && this.config.showOnCtrlClick) {
        e.preventDefault();
        this.showPreview(link.href, e.clientX, e.clientY);
      } else if (e.altKey) {
        e.preventDefault();
        this.showPreview(link.href, e.clientX, e.clientY);
      }
    });

    // Hover预览
    if (this.config.showOnHover) {
      document.addEventListener('mouseover', (e) => {
        const link = e.target.closest('a');
        if (!link || !link.href) return;

        this.hoverTimer = setTimeout(() => {
          const rect = link.getBoundingClientRect();
          this.showPreview(link.href, rect.left, rect.bottom + 5);
        }, this.config.hoverDelay);
      });

      document.addEventListener('mouseout', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        if (this.hoverTimer) {
          clearTimeout(this.hoverTimer);
          this.hoverTimer = null;
        }
      });
    }

    // 拖拽预览
    if (this.config.showOnDrag) {
      document.addEventListener('dragstart', (e) => {
        const link = e.target.closest('a');
        if (link && link.href) {
          this.draggedLink = link.href;
          e.dataTransfer.setData('text/uri-list', link.href);
          e.dataTransfer.effectAllowed = 'link';
        }
      });

      document.addEventListener('dragover', (e) => {
        if (this.draggedLink) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'link';
        }
      });

      document.addEventListener('drop', (e) => {
        if (this.draggedLink) {
          e.preventDefault();
          this.showPreview(this.draggedLink, e.clientX, e.clientY);
          this.draggedLink = null;
        }
      });

      document.addEventListener('dragend', () => {
        this.draggedLink = null;
      });
    }

    // 右键菜单（通过background script）
    document.addEventListener('contextmenu', (e) => {
      const link = e.target.closest('a');
      if (link && link.href) {
        // 存储当前链接供右键菜单使用
        window.notabCurrentContextLink = link.href;
      }
    });
  }

  /**
   * 显示预览
   */
  async showPreview(url, x, y) {
    // 验证URL
    if (!window.notabDomUtils.isValidUrl(url)) {
      console.warn('Invalid URL:', url);
      return;
    }

    // 检查是否已存在
    if (window.notabPreviewManager.hasPreview(url)) {
      window.notabPreviewManager.bringToFront(url);
      return;
    }

    // 检查预览次数限制（Free用户）
    const canPreview = await window.membershipManager?.canCreatePreview();
    if (canPreview && !canPreview.allowed) {
      this.showLimitMessage(canPreview.message);
      return;
    }

    // 如果即将用完，显示提示
    if (canPreview?.message) {
      this.showWarningToast(canPreview.message);
    }

    // 创建预览容器
    const container = await this.createPreviewContainer(url, x, y);
    document.body.appendChild(container);

    // 添加到管理器
    window.notabPreviewManager.addPreview(container, url);

    // 使容器可拖拽和调整大小
    window.notabUIManager.makeDraggable(container);
    window.notabUIManager.makeResizable(container);

    // 加载内容
    this.loadContent(container, url);

    // 绑定控制按钮
    this.bindControlEvents(container, url);

    // 添加动画
    setTimeout(() => {
      container.classList.add('notab-preview-show');
    }, 10);

    // 记录使用次数
    await window.membershipManager?.recordPreviewUsage();
  }

  /**
   * 显示次数限制提示
   */
  showLimitMessage(message) {
    const limitToast = window.notabDomUtils.createFromHTML(`
      <div class="notab-limit-toast">
        <div class="notab-limit-content">
          <div class="notab-limit-icon">⚠️</div>
          <div class="notab-limit-text">
            <h4>${message}</h4>
            <p>点击升级按钮输入兑换码即可解锁</p>
          </div>
          <button class="notab-limit-upgrade">🎫 升级 Pro</button>
          <button class="notab-limit-close">✕</button>
        </div>
      </div>
    `);

    document.body.appendChild(limitToast);

    // 升级按钮
    limitToast.querySelector('.notab-limit-upgrade').addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'openPopup' });
      limitToast.remove();
    });

    // 关闭按钮
    limitToast.querySelector('.notab-limit-close').addEventListener('click', () => {
      limitToast.remove();
    });

    // 动画显示
    setTimeout(() => limitToast.classList.add('show'), 10);

    // 10秒后自动关闭
    setTimeout(() => {
      limitToast.classList.remove('show');
      setTimeout(() => limitToast.remove(), 300);
    }, 10000);
  }

  /**
   * 显示警告提示
   */
  showWarningToast(message) {
    const toast = window.notabDomUtils.createFromHTML(`
      <div class="notab-warning-toast">${message}</div>
    `);

    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * 创建预览容器
   */
  async createPreviewContainer(url, x, y) {
    const container = window.notabDomUtils.createFromHTML(`
      <div class="notab-preview-container">
        <div class="notab-preview-header">
          <span class="notab-preview-title">${this.getTitleFromUrl(url)}</span>
          <div class="notab-preview-controls">
            <button class="notab-btn notab-reader-mode" title="阅读模式">📖</button>
            <button class="notab-btn notab-video-mode" title="视频模式">🎬</button>
            <button class="notab-btn notab-open-new" title="新标签打开">🔗</button>
            <button class="notab-btn notab-pin" title="固定">📌</button>
            <button class="notab-btn notab-close" title="关闭">✕</button>
          </div>
        </div>
        <div class="notab-preview-body">
          <div class="notab-loading">
            <div class="notab-spinner"></div>
            <p>加载中...</p>
          </div>
        </div>
        <div class="notab-resize-handles">
          <div class="resize-handle resize-n"></div>
          <div class="resize-handle resize-ne"></div>
          <div class="resize-handle resize-e"></div>
          <div class="resize-handle resize-se"></div>
          <div class="resize-handle resize-s"></div>
          <div class="resize-handle resize-sw"></div>
          <div class="resize-handle resize-w"></div>
          <div class="resize-handle resize-nw"></div>
        </div>
      </div>
    `);

    // 设置初始位置和大小
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
    container.style.width = `${this.config.defaultWidth}px`;
    container.style.height = `${this.config.defaultHeight}px`;

    // 应用当前主题
    await this.applyCurrentTheme(container);

    // 确保在视口内
    setTimeout(() => {
      window.notabUIManager.ensureInViewport(container);
    }, 0);

    return container;
  }

  /**
   * 应用当前主题到容器
   */
  async applyCurrentTheme(container) {
    const currentTheme = await window.themeManager?.getSavedTheme() || 'light';
    const theme = window.themeManager?.themes[currentTheme];

    if (!theme) return;

    // 添加主题类
    container.classList.add(`theme-${currentTheme}`);

    // 更新头部渐变色
    const header = container.querySelector('.notab-preview-header');
    if (header) {
      header.style.background = theme.colors.gradient;
    }
  }

  /**
   * 加载内容
   */
  async loadContent(container, url) {
    const body = container.querySelector('.notab-preview-body');

    try {
      // 先清除 Service Workers (关键步骤！)
      await this.clearServiceWorkers(url);

      // 尝试直接使用iframe加载
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.sandbox = 'allow-same-origin allow-scripts allow-popups allow-forms allow-modals';

      // 加载完成处理
      iframe.addEventListener('load', () => {
        const loading = body.querySelector('.notab-loading');
        if (loading) loading.remove();
      });

      // 错误处理
      iframe.addEventListener('error', async () => {
        // iframe加载失败，尝试使用background script fetch
        await this.loadContentViaFetch(container, url);
      });

      body.appendChild(iframe);

      // 超时处理
      setTimeout(() => {
        const loading = body.querySelector('.notab-loading');
        if (loading) {
          loading.innerHTML = '<p>⚠️ 页面加载较慢，请稍候...</p>';
        }
      }, 5000);

    } catch (error) {
      console.error('Failed to load preview:', error);
      this.showError(body, '无法加载预览');
    }
  }

  /**
   * 清除 Service Workers
   * 这是绕过 GitHub、知乎等网站限制的关键！
   */
  async clearServiceWorkers(url) {
    try {
      const urlObj = new URL(url);
      const origin = urlObj.origin;

      // 使用 browsingData API 清除特定来源的 Service Workers
      await chrome.browsingData.removeServiceWorkers({
        origins: [origin]
      });

      console.log('✅ Service workers cleared for:', origin);
    } catch (error) {
      // 如果清除失败，只记录警告，不影响后续加载
      console.warn('⚠️ Failed to clear service workers:', error);
    }
  }

  /**
   * 显示错误
   */
  showError(container, message) {
    container.innerHTML = `
      <div class="notab-error">
        <p>⚠️ ${message}</p>
        <p class="notab-error-hint">某些网站禁止在iframe中显示。</p>
      </div>
    `;
  }

  /**
   * 通过fetch加载内容（处理CORS限制）
   */
  async loadContentViaFetch(container, url) {
    const body = container.querySelector('.notab-preview-body');

    try {
      // 向background script发送请求
      const response = await chrome.runtime.sendMessage({
        action: 'fetchUrl',
        url: url
      });

      if (response && response.success) {
        // 创建shadow DOM来隔离样式
        const shadowHost = document.createElement('div');
        shadowHost.className = 'notab-shadow-host';
        const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = response.html;

        body.innerHTML = '';
        body.appendChild(shadowHost);
      } else {
        this.showError(body, response?.error || '无法加载此页面');
      }
    } catch (error) {
      console.error('Fetch failed:', error);
      this.showError(body, '网络请求失败');
    }
  }

  /**
   * 绑定控制按钮事件
   */
  bindControlEvents(container, url) {
    // 关闭按钮
    const closeBtn = container.querySelector('.notab-close');
    closeBtn.addEventListener('click', () => {
      container.classList.remove('notab-preview-show');
      setTimeout(() => {
        window.notabPreviewManager.removePreview(url);
      }, 200);
    });

    // 固定按钮
    const pinBtn = container.querySelector('.notab-pin');
    pinBtn.addEventListener('click', () => {
      window.notabPreviewManager.togglePin(url);
      pinBtn.textContent = container.classList.contains('pinned') ? '📍' : '📌';
    });

    // 新标签打开
    const openBtn = container.querySelector('.notab-open-new');
    openBtn.addEventListener('click', () => {
      window.open(url, '_blank');
    });

    // 阅读模式
    const readerBtn = container.querySelector('.notab-reader-mode');
    readerBtn.addEventListener('click', () => {
      window.notabReaderMode?.activateReaderMode(container);
    });

    // 视频模式
    const videoBtn = container.querySelector('.notab-video-mode');
    videoBtn.addEventListener('click', () => {
      window.notabVideoMode?.activateVideoMode(container);
    });
  }

  /**
   * 从URL提取标题
   */
  getTitleFromUrl(url) {
    return window.notabDomUtils.getTitleFromUrl(url);
  }
}

// 创建全局实例
window.notabLinkPreview = new LinkPreview();
