// UI管理器 - 处理拖拽和调整大小
class UIManager {
  constructor() {
    this.isDragging = false;
    this.isResizing = false;
    this.currentElement = null;
    this.resizeDirection = null;
    this.startX = 0;
    this.startY = 0;
    this.startWidth = 0;
    this.startHeight = 0;
    this.startLeft = 0;
    this.startTop = 0;

    this.bindGlobalEvents();
  }

  /**
   * 使容器可拖拽
   */
  makeDraggable(container) {
    const header = container.querySelector('.notab-preview-header');
    if (!header) return;

    header.style.cursor = 'grab';

    header.addEventListener('mousedown', (e) => {
      // 忽略按钮点击
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        return;
      }

      this.isDragging = true;
      this.currentElement = container;
      this.startX = e.clientX - container.offsetLeft;
      this.startY = e.clientY - container.offsetTop;

      container.style.cursor = 'grabbing';
      header.style.cursor = 'grabbing';

      e.preventDefault();
    });
  }

  /**
   * 使容器可调整大小
   */
  makeResizable(container) {
    const handles = container.querySelectorAll('.resize-handle');

    handles.forEach(handle => {
      handle.addEventListener('mousedown', (e) => {
        this.isResizing = true;
        this.currentElement = container;

        // 获取调整方向
        const classList = Array.from(handle.classList);
        const directionClass = classList.find(c => c.startsWith('resize-'));
        this.resizeDirection = directionClass ? directionClass.replace('resize-', '') : '';

        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startWidth = container.offsetWidth;
        this.startHeight = container.offsetHeight;
        this.startLeft = container.offsetLeft;
        this.startTop = container.offsetTop;

        e.preventDefault();
        e.stopPropagation();
      });
    });
  }

  /**
   * 绑定全局事件
   */
  bindGlobalEvents() {
    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.handleDrag(e);
      } else if (this.isResizing) {
        this.handleResize(e);
      }
    });

    document.addEventListener('mouseup', () => {
      if (this.isDragging && this.currentElement) {
        const header = this.currentElement.querySelector('.notab-preview-header');
        if (header) {
          this.currentElement.style.cursor = '';
          header.style.cursor = 'grab';
        }
      }

      this.isDragging = false;
      this.isResizing = false;
      this.currentElement = null;
      this.resizeDirection = null;
    });
  }

  /**
   * 处理拖拽
   */
  handleDrag(e) {
    if (!this.currentElement) return;

    let left = e.clientX - this.startX;
    let top = e.clientY - this.startY;

    // 边界检查
    const maxLeft = window.innerWidth - 100;
    const maxTop = window.innerHeight - 40;

    left = Math.max(0, Math.min(left, maxLeft));
    top = Math.max(0, Math.min(top, maxTop));

    this.currentElement.style.left = `${left}px`;
    this.currentElement.style.top = `${top}px`;
  }

  /**
   * 处理调整大小
   */
  handleResize(e) {
    if (!this.currentElement || !this.resizeDirection) return;

    const deltaX = e.clientX - this.startX;
    const deltaY = e.clientY - this.startY;

    let newWidth = this.startWidth;
    let newHeight = this.startHeight;
    let newLeft = this.startLeft;
    let newTop = this.startTop;

    const minWidth = window.NOTAB_CONSTANTS.PREVIEW.MIN_WIDTH;
    const minHeight = window.NOTAB_CONSTANTS.PREVIEW.MIN_HEIGHT;

    // 根据方向调整大小
    if (this.resizeDirection.includes('e')) {
      newWidth = Math.max(minWidth, this.startWidth + deltaX);
    }
    if (this.resizeDirection.includes('w')) {
      const proposedWidth = this.startWidth - deltaX;
      if (proposedWidth >= minWidth) {
        newWidth = proposedWidth;
        newLeft = this.startLeft + deltaX;
      }
    }
    if (this.resizeDirection.includes('s')) {
      newHeight = Math.max(minHeight, this.startHeight + deltaY);
    }
    if (this.resizeDirection.includes('n')) {
      const proposedHeight = this.startHeight - deltaY;
      if (proposedHeight >= minHeight) {
        newHeight = proposedHeight;
        newTop = this.startTop + deltaY;
      }
    }

    // 应用新尺寸和位置
    this.currentElement.style.width = `${newWidth}px`;
    this.currentElement.style.height = `${newHeight}px`;
    this.currentElement.style.left = `${newLeft}px`;
    this.currentElement.style.top = `${newTop}px`;
  }

  /**
   * 居中显示元素
   */
  centerElement(element) {
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    element.style.left = `${Math.max(0, left)}px`;
    element.style.top = `${Math.max(0, top)}px`;
  }

  /**
   * 确保元素在视口内
   */
  ensureInViewport(element) {
    const rect = element.getBoundingClientRect();
    let left = element.offsetLeft;
    let top = element.offsetTop;

    // 检查右边界
    if (rect.right > window.innerWidth) {
      left = window.innerWidth - rect.width - 10;
    }

    // 检查底部边界
    if (rect.bottom > window.innerHeight) {
      top = window.innerHeight - rect.height - 10;
    }

    // 检查左边界
    if (rect.left < 0) {
      left = 10;
    }

    // 检查顶部边界
    if (rect.top < 0) {
      top = 10;
    }

    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
  }
}

// 创建全局UI管理器实例
window.notabUIManager = new UIManager();
