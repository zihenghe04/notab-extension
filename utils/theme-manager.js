// 主题管理器 - Theme Manager
class ThemeManager {
  constructor() {
    this.themes = {
      light: {
        name: '明亮',
        emoji: '☀️',
        colors: {
          primary: '#667eea',
          secondary: '#764ba2',
          background: '#ffffff',
          surface: '#f8f9fa',
          text: '#333333',
          textSecondary: '#666666',
          border: '#e0e0e0',
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        isPro: false
      },
      dark: {
        name: '暗夜',
        emoji: '🌙',
        colors: {
          primary: '#8b5cf6',
          secondary: '#6366f1',
          background: '#0f172a',
          surface: '#1e293b',
          text: '#f1f5f9',
          textSecondary: '#94a3b8',
          border: '#334155',
          gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'
        },
        isPro: false
      },
      ocean: {
        name: '海洋',
        emoji: '🌊',
        colors: {
          primary: '#06b6d4',
          secondary: '#3b82f6',
          background: '#f0f9ff',
          surface: '#e0f2fe',
          text: '#0c4a6e',
          textSecondary: '#0369a1',
          border: '#7dd3fc',
          gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
        },
        isPro: false
      },
      sunset: {
        name: '日落',
        emoji: '🌅',
        colors: {
          primary: '#f59e0b',
          secondary: '#f97316',
          background: '#fffbeb',
          surface: '#fef3c7',
          text: '#78350f',
          textSecondary: '#92400e',
          border: '#fcd34d',
          gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'
        },
        isPro: false
      },
      forest: {
        name: '森林',
        emoji: '🌲',
        colors: {
          primary: '#10b981',
          secondary: '#059669',
          background: '#f0fdf4',
          surface: '#dcfce7',
          text: '#064e3b',
          textSecondary: '#065f46',
          border: '#86efac',
          gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        },
        isPro: false
      },
      purple: {
        name: '紫霞',
        emoji: '💜',
        colors: {
          primary: '#a855f7',
          secondary: '#ec4899',
          background: '#faf5ff',
          surface: '#f3e8ff',
          text: '#581c87',
          textSecondary: '#6b21a8',
          border: '#d8b4fe',
          gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)'
        },
        isPro: true  // Pro 专属
      }
    };

    this.currentTheme = 'light';
    this.init();
  }

  /**
   * 初始化主题管理器
   */
  async init() {
    // 从存储读取当前主题
    const theme = await this.getSavedTheme();
    this.applyTheme(theme);
  }

  /**
   * 获取保存的主题
   */
  async getSavedTheme() {
    return new Promise((resolve) => {
      chrome.storage.sync.get('theme', (result) => {
        resolve(result.theme || 'light');
      });
    });
  }

  /**
   * 保存主题
   */
  async saveTheme(themeName) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ theme: themeName }, () => {
        resolve();
      });
    });
  }

  /**
   * 应用主题
   */
  async applyTheme(themeName) {
    // 检查主题是否存在
    if (!this.themes[themeName]) {
      console.warn(`Theme ${themeName} not found, using light`);
      themeName = 'light';
    }

    // 检查是否为 Pro 主题
    const theme = this.themes[themeName];
    if (theme.isPro) {
      const isPro = await window.membershipManager?.isPro();
      if (!isPro) {
        console.warn('Pro theme requires membership');
        return false;
      }
    }

    this.currentTheme = themeName;

    // 保存主题选择
    await this.saveTheme(themeName);

    // 应用主题到页面
    this.applyThemeToPage(theme, themeName);

    console.log(`✅ Theme applied: ${theme.emoji} ${theme.name}`);
    return true;
  }

  /**
   * 应用主题到页面
   */
  applyThemeToPage(theme, themeName) {
    const root = document.documentElement;

    // 移除所有主题类
    root.classList.remove('theme-light', 'theme-dark', 'theme-ocean', 'theme-sunset', 'theme-forest', 'theme-purple');

    // 添加当前主题类
    root.classList.add(`theme-${themeName}`);

    // 应用 CSS 变量
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--color-border', theme.colors.border);
    root.style.setProperty('--gradient-primary', theme.colors.gradient);

    // 同步到所有预览窗口
    this.applyThemeToPreviewContainers(theme, themeName);

    // 通知其他页面主题已更改
    this.broadcastThemeChange(themeName);
  }

  /**
   * 应用主题到预览容器
   */
  applyThemeToPreviewContainers(theme, themeName) {
    // 获取所有预览容器
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
   * 广播主题变化
   */
  broadcastThemeChange(themeName) {
    // 发送消息到其他标签页
    chrome.runtime.sendMessage({
      action: 'themeChanged',
      theme: themeName
    }).catch(() => {
      // 忽略错误（popup 关闭时会报错）
    });
  }

  /**
   * 获取主题配置
   */
  getThemeColors(themeName) {
    return this.themes[themeName]?.colors || this.themes.light.colors;
  }

  /**
   * 获取所有主题列表
   */
  getAllThemes() {
    return Object.keys(this.themes).map(key => ({
      id: key,
      ...this.themes[key]
    }));
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * 检查主题是否需要 Pro
   */
  isProTheme(themeName) {
    return this.themes[themeName]?.isPro || false;
  }
}

// 创建全局主题管理器实例
window.themeManager = new ThemeManager();

