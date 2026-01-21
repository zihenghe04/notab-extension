// DOM操作工具函数
window.notabDomUtils = {
  /**
   * 创建元素
   */
  createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);

    // 设置属性
    Object.keys(attributes).forEach(key => {
      if (key === 'className') {
        element.className = attributes[key];
      } else if (key === 'style' && typeof attributes[key] === 'object') {
        Object.assign(element.style, attributes[key]);
      } else if (key.startsWith('on') && typeof attributes[key] === 'function') {
        const eventName = key.substring(2).toLowerCase();
        element.addEventListener(eventName, attributes[key]);
      } else {
        element.setAttribute(key, attributes[key]);
      }
    });

    // 添加子元素
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        element.appendChild(child);
      }
    });

    return element;
  },

  /**
   * 从HTML字符串创建元素
   */
  createFromHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
  },

  /**
   * 获取元素位置
   */
  getPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height
    };
  },

  /**
   * 检查元素是否在视口内
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  },

  /**
   * 滚动元素到视口内
   */
  scrollIntoView(element, options = {}) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
      ...options
    });
  },

  /**
   * 检测暗色模式
   */
  isDarkMode() {
    return window.matchMedia &&
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  },

  /**
   * 防抖函数
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * 节流函数
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * 获取文本选择
   */
  getSelectedText() {
    const selection = window.getSelection();
    return selection.toString().trim();
  },

  /**
   * 清除文本选择
   */
  clearSelection() {
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
  },

  /**
   * 复制文本到剪贴板
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      return false;
    }
  },

  /**
   * 检查URL是否有效
   */
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  },

  /**
   * 从URL提取域名
   */
  getDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (_) {
      return '';
    }
  },

  /**
   * 从URL提取标题
   */
  getTitleFromUrl(url) {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const parts = pathname.split('/').filter(p => p);
      return parts[parts.length - 1] || urlObj.hostname;
    } catch (_) {
      return 'Preview';
    }
  }
};
