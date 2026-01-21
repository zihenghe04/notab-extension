// 搜索模块
class Search {
  constructor() {
    this.searchEngines = window.NOTAB_CONSTANTS.SEARCH_ENGINES;
    this.defaultEngine = 'Google';
    this.searchMenu = null;
  }

  /**
   * 搜索选中的文本
   */
  searchSelectedText(text) {
    if (!text) return;

    // 获取设置
    this.getSearchSettings().then(settings => {
      if (settings.openInPreview) {
        // 在预览窗口中打开
        this.searchInPreview(text, settings.defaultEngine);
      } else {
        // 在新标签中打开
        this.searchInNewTab(text, settings.defaultEngine);
      }
    });
  }

  /**
   * 在预览窗口中搜索
   */
  searchInPreview(text, engineName = null) {
    const engine = this.getEngine(engineName || this.defaultEngine);
    const searchUrl = engine.url + encodeURIComponent(text);

    // 使用链接预览功能
    if (window.notabLinkPreview) {
      window.notabLinkPreview.showPreview(searchUrl, 100, 100);
    }
  }

  /**
   * 在新标签中搜索
   */
  searchInNewTab(text, engineName = null) {
    const engine = this.getEngine(engineName || this.defaultEngine);
    const searchUrl = engine.url + encodeURIComponent(text);
    window.open(searchUrl, '_blank');
  }

  /**
   * 显示搜索引擎菜单
   */
  showSearchMenu(x, y, text) {
    if (!this.searchMenu) {
      const menuItems = this.searchEngines.map(engine => `
        <div class="search-engine-item" data-engine="${engine.name}">
          <span>${engine.name}</span>
        </div>
      `).join('');

      this.searchMenu = window.notabDomUtils.createFromHTML(`
        <div class="notab-search-menu">
          ${menuItems}
        </div>
      `);

      document.body.appendChild(this.searchMenu);

      // 绑定点击事件
      this.searchMenu.addEventListener('click', (e) => {
        const item = e.target.closest('.search-engine-item');
        if (item) {
          const engineName = item.dataset.engine;
          this.searchInPreview(text, engineName);
          this.hideSearchMenu();
        }
      });

      // 点击外部关闭
      document.addEventListener('mousedown', (e) => {
        if (!e.target.closest('.notab-search-menu')) {
          this.hideSearchMenu();
        }
      });
    }

    this.searchMenu.style.left = `${x}px`;
    this.searchMenu.style.top = `${y}px`;
    this.searchMenu.style.display = 'block';
  }

  /**
   * 隐藏搜索菜单
   */
  hideSearchMenu() {
    if (this.searchMenu) {
      this.searchMenu.style.display = 'none';
    }
  }

  /**
   * 获取搜索引擎
   */
  getEngine(name) {
    return this.searchEngines.find(e => e.name === name) || this.searchEngines[0];
  }

  /**
   * 获取搜索设置
   */
  async getSearchSettings() {
    const settings = await window.notabStorage.getSetting('search');
    return settings || {
      defaultEngine: 'Google',
      openInPreview: true
    };
  }

  /**
   * 更新搜索设置
   */
  async updateSearchSettings(settings) {
    await window.notabStorage.updateSetting('search', settings);
  }
}

// 创建全局实例
window.notabSearch = new Search();
