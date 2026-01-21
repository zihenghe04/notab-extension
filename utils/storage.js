// 存储管理器 - 处理chrome.storage.sync
class StorageManager {
  constructor() {
    this.defaultSettings = {
      theme: 'light',
      linkPreview: {
        triggerMethod: 'drag',
        hoverDelay: 500,
        enableMultiPreview: true,
        defaultWidth: 800,
        defaultHeight: 600,
        showOnHover: false,
        showOnCtrlClick: true,
        showOnDrag: true
      },
      readerMode: {
        fontSize: 18,
        fontFamily: 'Georgia, serif',
        lineHeight: 1.6,
        maxWidth: 700,
        backgroundColor: '#fafafa',
        textColor: '#333'
      },
      videoMode: {
        autoDetect: true,
        autoFullscreen: false
      },
      translator: {
        defaultTargetLang: 'auto',
        showQuickButton: true,
        apiProvider: 'LibreTranslate'
      },
      search: {
        defaultEngine: 'Google',
        openInPreview: true
      }
    };
  }

  /**
   * 获取所有设置
   */
  async getSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get('settings', (result) => {
        resolve(result.settings || this.defaultSettings);
      });
    });
  }

  /**
   * 保存所有设置
   */
  async saveSettings(settings) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ settings }, () => {
        // 触发设置更新事件
        window.notabEventBus?.emit(
          window.NOTAB_CONSTANTS.EVENTS.SETTINGS_UPDATED,
          settings
        );
        resolve();
      });
    });
  }

  /**
   * 获取单个设置项
   */
  async getSetting(key) {
    const settings = await this.getSettings();
    return this.getNestedValue(settings, key);
  }

  /**
   * 更新单个设置项
   */
  async updateSetting(key, value) {
    const settings = await this.getSettings();
    this.setNestedValue(settings, key, value);
    await this.saveSettings(settings);
  }

  /**
   * 监听设置变化
   */
  onSettingsChange(callback) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'sync' && changes.settings) {
        callback(changes.settings.newValue);
      }
    });
  }

  /**
   * 重置为默认设置
   */
  async resetToDefaults() {
    await this.saveSettings(this.defaultSettings);
  }

  /**
   * 获取嵌套对象的值
   */
  getNestedValue(obj, path) {
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
      result = result?.[key];
      if (result === undefined) return undefined;
    }
    return result;
  }

  /**
   * 设置嵌套对象的值
   */
  setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let target = obj;

    for (const key of keys) {
      if (!(key in target)) {
        target[key] = {};
      }
      target = target[key];
    }

    target[lastKey] = value;
  }

  /**
   * 导出设置为JSON
   */
  async exportSettings() {
    const settings = await this.getSettings();
    return JSON.stringify(settings, null, 2);
  }

  /**
   * 从JSON导入设置
   */
  async importSettings(jsonString) {
    try {
      const settings = JSON.parse(jsonString);
      await this.saveSettings(settings);
      return true;
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  }
}

// 创建全局存储管理器实例
window.notabStorage = new StorageManager();
