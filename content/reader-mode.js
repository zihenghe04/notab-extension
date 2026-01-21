// 阅读模式模块
class ReaderMode {
  constructor() {
    this.isActive = false;
  }

  /**
   * 激活阅读模式
   */
  async activateReaderMode(container) {
    const iframe = container.querySelector('iframe');

    if (!iframe) {
      this.showMessage(container, '无法启用阅读模式：未找到内容');
      return;
    }

    // 显示加载提示
    const body = container.querySelector('.notab-preview-body');
    const loading = document.createElement('div');
    loading.className = 'notab-loading';
    loading.innerHTML = '<div class="notab-spinner"></div><p>正在提取内容...</p>';
    body.appendChild(loading);

    try {
      // 等待iframe加载完成
      await this.waitForIframeLoad(iframe);

      // 尝试访问iframe内容
      let article = null;

      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        article = this.extractArticle(iframeDoc);
      } catch (error) {
        // 跨域限制，使用background script获取
        console.log('Cross-origin iframe, fetching via background script');
        article = await this.fetchAndExtractArticle(iframe.src);
      }

      if (article) {
        this.showReaderView(container, article);
      } else {
        this.showMessage(container, '无法提取文章内容，请尝试在新标签中打开');
      }

    } catch (error) {
      console.error('Reader mode error:', error);
      this.showMessage(container, '阅读模式失败');
    } finally {
      if (loading.parentNode) {
        loading.remove();
      }
    }
  }

  /**
   * 等待iframe加载
   */
  waitForIframeLoad(iframe) {
    return new Promise((resolve) => {
      if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
        resolve();
      } else {
        iframe.addEventListener('load', () => resolve(), { once: true });
        // 超时保护
        setTimeout(() => resolve(), 5000);
      }
    });
  }

  /**
   * 提取文章内容（简化版Readability）
   */
  extractArticle(doc) {
    // 尝试查找主要内容区域
    const articleSelectors = [
      'article',
      '[role="main"]',
      'main',
      '.article-content',
      '.post-content',
      '.entry-content',
      '#content',
      '.content'
    ];

    let mainContent = null;
    for (const selector of articleSelectors) {
      mainContent = doc.querySelector(selector);
      if (mainContent && mainContent.textContent.trim().length > 200) {
        break;
      }
    }

    if (!mainContent || mainContent.textContent.trim().length < 100) {
      // 回退到body
      mainContent = doc.body;
    }

    // 提取标题
    const title = doc.querySelector('h1')?.textContent.trim() ||
                  doc.title ||
                  '无标题';

    // 提取作者信息
    const bylineSelectors = [
      '[rel="author"]',
      '.author',
      '.byline',
      '[class*="author"]'
    ];

    let byline = '';
    for (const selector of bylineSelectors) {
      const el = doc.querySelector(selector);
      if (el) {
        byline = el.textContent.trim();
        break;
      }
    }

    // 清理内容
    const content = this.cleanContent(mainContent.cloneNode(true));

    if (!content || content.textContent.trim().length < 100) {
      return null;
    }

    return {
      title,
      byline,
      content: content.innerHTML
    };
  }

  /**
   * 清理内容
   */
  cleanContent(element) {
    // 移除不需要的元素
    const unwantedSelectors = [
      'script',
      'style',
      'nav',
      'header',
      'footer',
      'aside',
      '.advertisement',
      '.ads',
      '.social-share',
      '.comments',
      '[class*="sidebar"]',
      '[class*="related"]'
    ];

    unwantedSelectors.forEach(selector => {
      element.querySelectorAll(selector).forEach(el => el.remove());
    });

    return element;
  }

  /**
   * 通过background script获取并提取文章
   */
  async fetchAndExtractArticle(url) {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'fetchUrl',
        url: url
      });

      if (response && response.success) {
        // 解析HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.html, 'text/html');
        return this.extractArticle(doc);
      }
    } catch (error) {
      console.error('Failed to fetch article:', error);
    }
    return null;
  }

  /**
   * 显示阅读器视图
   */
  showReaderView(container, article) {
    const body = container.querySelector('.notab-preview-body');

    const readerHTML = `
      <div class="notab-reader-view">
        <div class="reader-header">
          <h1 class="reader-title">${this.escapeHtml(article.title)}</h1>
          ${article.byline ? `<div class="reader-byline">作者：${this.escapeHtml(article.byline)}</div>` : ''}
        </div>
        <div class="reader-content">${article.content}</div>
      </div>
    `;

    body.innerHTML = readerHTML;
    container.classList.add(window.NOTAB_CONSTANTS.CLASSES.READER_MODE);
    this.isActive = true;
  }

  /**
   * 显示消息
   */
  showMessage(container, message) {
    const body = container.querySelector('.notab-preview-body');
    body.innerHTML = `
      <div class="notab-message">
        <p>${this.escapeHtml(message)}</p>
      </div>
    `;
  }

  /**
   * HTML转义
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// 创建全局实例
window.notabReaderMode = new ReaderMode();
