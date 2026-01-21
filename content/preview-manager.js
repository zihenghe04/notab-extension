// 预览管理器 - 管理多个预览窗口
class PreviewManager {
  constructor() {
    this.previews = new Map(); // url -> preview data
    this.maxZIndex = window.NOTAB_CONSTANTS.PREVIEW.Z_INDEX_BASE;
    this.maxPreviews = window.NOTAB_CONSTANTS.PREVIEW.MAX_PREVIEWS;
  }

  /**
   * 添加预览窗口
   */
  addPreview(container, url) {
    // 检查是否已存在相同URL的预览
    if (this.previews.has(url)) {
      this.bringToFront(url);
      return false;
    }

    // 检查预览数量限制
    if (this.previews.size >= this.maxPreviews) {
      this.removeOldestUnpinned();
    }

    // 添加到管理器
    const previewData = {
      container: container,
      url: url,
      isPinned: false,
      zIndex: ++this.maxZIndex,
      createdAt: Date.now()
    };

    this.previews.set(url, previewData);
    container.style.zIndex = previewData.zIndex;
    container.dataset.previewUrl = url;

    // 点击时置顶
    container.addEventListener('mousedown', () => {
      this.bringToFront(url);
    });

    // 触发创建事件
    window.notabEventBus.emit(
      window.NOTAB_CONSTANTS.EVENTS.PREVIEW_CREATED,
      { url, container }
    );

    return true;
  }

  /**
   * 移除预览窗口
   */
  removePreview(url) {
    const preview = this.previews.get(url);
    if (!preview) return false;

    // 如果已固定，不移除
    if (preview.isPinned) {
      return false;
    }

    // 移除DOM元素
    if (preview.container && preview.container.parentNode) {
      preview.container.remove();
    }

    // 从管理器中移除
    this.previews.delete(url);

    // 触发关闭事件
    window.notabEventBus.emit(
      window.NOTAB_CONSTANTS.EVENTS.PREVIEW_CLOSED,
      { url }
    );

    return true;
  }

  /**
   * 通过容器元素移除预览
   */
  removePreviewByContainer(container) {
    const url = container.dataset.previewUrl;
    if (url) {
      return this.removePreview(url);
    }
    return false;
  }

  /**
   * 置顶预览窗口
   */
  bringToFront(url) {
    const preview = this.previews.get(url);
    if (!preview) return;

    preview.zIndex = ++this.maxZIndex;
    preview.container.style.zIndex = preview.zIndex;
  }

  /**
   * 切换固定状态
   */
  togglePin(url) {
    const preview = this.previews.get(url);
    if (!preview) return;

    preview.isPinned = !preview.isPinned;
    preview.container.classList.toggle(
      window.NOTAB_CONSTANTS.CLASSES.PINNED,
      preview.isPinned
    );

    // 触发固定事件
    window.notabEventBus.emit(
      window.NOTAB_CONSTANTS.EVENTS.PREVIEW_PINNED,
      { url, isPinned: preview.isPinned }
    );
  }

  /**
   * 移除最旧的未固定预览
   */
  removeOldestUnpinned() {
    let oldestUrl = null;
    let oldestTime = Infinity;

    this.previews.forEach((preview, url) => {
      if (!preview.isPinned && preview.createdAt < oldestTime) {
        oldestTime = preview.createdAt;
        oldestUrl = url;
      }
    });

    if (oldestUrl) {
      this.removePreview(oldestUrl);
    }
  }

  /**
   * 关闭所有未固定的预览
   */
  closeAllUnpinned() {
    const urlsToRemove = [];

    this.previews.forEach((preview, url) => {
      if (!preview.isPinned) {
        urlsToRemove.push(url);
      }
    });

    urlsToRemove.forEach(url => this.removePreview(url));
  }

  /**
   * 关闭所有预览（包括固定的）
   */
  closeAll() {
    this.previews.forEach((preview, url) => {
      if (preview.container && preview.container.parentNode) {
        preview.container.remove();
      }
    });

    this.previews.clear();
  }

  /**
   * 级联布局
   */
  cascadeLayout() {
    let offsetX = 50;
    let offsetY = 50;
    const increment = 30;

    this.previews.forEach(preview => {
      preview.container.style.left = `${offsetX}px`;
      preview.container.style.top = `${offsetY}px`;

      offsetX += increment;
      offsetY += increment;

      // 重置偏移避免超出屏幕
      if (offsetX > window.innerWidth - 400 || offsetY > window.innerHeight - 300) {
        offsetX = 50;
        offsetY = 50;
      }
    });
  }

  /**
   * 平铺布局
   */
  tileLayout() {
    const count = this.previews.size;
    if (count === 0) return;

    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);

    const padding = 10;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const previewWidth = (windowWidth - (cols + 1) * padding) / cols;
    const previewHeight = (windowHeight - (rows + 1) * padding) / rows;

    let index = 0;
    this.previews.forEach(preview => {
      const col = index % cols;
      const row = Math.floor(index / cols);

      const left = col * (previewWidth + padding) + padding;
      const top = row * (previewHeight + padding) + padding;

      preview.container.style.left = `${left}px`;
      preview.container.style.top = `${top}px`;
      preview.container.style.width = `${previewWidth}px`;
      preview.container.style.height = `${previewHeight}px`;

      index++;
    });
  }

  /**
   * 获取预览数量
   */
  getCount() {
    return this.previews.size;
  }

  /**
   * 获取固定的预览数量
   */
  getPinnedCount() {
    let count = 0;
    this.previews.forEach(preview => {
      if (preview.isPinned) count++;
    });
    return count;
  }

  /**
   * 检查URL是否已有预览
   */
  hasPreview(url) {
    return this.previews.has(url);
  }

  /**
   * 获取所有预览URL列表
   */
  getAllUrls() {
    return Array.from(this.previews.keys());
  }
}

// 创建全局预览管理器实例
window.notabPreviewManager = new PreviewManager();
