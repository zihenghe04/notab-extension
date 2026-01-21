// 视频模式模块
class VideoMode {
  constructor() {
    this.videoPatterns = window.NOTAB_CONSTANTS.VIDEO_PATTERNS;
    this.videoSelectors = window.NOTAB_CONSTANTS.VIDEO_SELECTORS;
  }

  /**
   * 激活视频模式
   */
  async activateVideoMode(container) {
    const iframe = container.querySelector('iframe');

    if (!iframe) {
      this.showMessage(container, '无法启用视频模式：未找到内容');
      return;
    }

    const url = iframe.src;

    // 检查URL是否是已知视频网站
    const videoInfo = this.detectVideoFromUrl(url);

    if (videoInfo) {
      this.createEmbedVideoView(container, videoInfo);
      return;
    }

    // 尝试在iframe中检测视频
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const video = this.detectVideoInDocument(iframeDoc);

      if (video) {
        this.createVideoView(container, video, url);
      } else {
        this.showMessage(container, '未检测到视频内容');
      }
    } catch (error) {
      // 跨域限制
      console.log('Cross-origin iframe, cannot detect video');
      this.showMessage(container, '无法访问跨域视频内容');
    }
  }

  /**
   * 从URL检测视频类型
   */
  detectVideoFromUrl(url) {
    for (const { pattern, type } of this.videoPatterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          type,
          id: match[1],
          url
        };
      }
    }
    return null;
  }

  /**
   * 在文档中检测视频
   */
  detectVideoInDocument(doc) {
    for (const selector of this.videoSelectors) {
      const element = doc.querySelector(selector);
      if (element) {
        return element;
      }
    }
    return null;
  }

  /**
   * 创建嵌入式视频视图（YouTube, Vimeo等）
   */
  createEmbedVideoView(container, videoInfo) {
    const body = container.querySelector('.notab-preview-body');
    let embedUrl = '';

    switch (videoInfo.type) {
      case 'youtube':
        embedUrl = `https://www.youtube.com/embed/${videoInfo.id}?autoplay=0&controls=1&rel=0`;
        break;
      case 'vimeo':
        embedUrl = `https://player.vimeo.com/video/${videoInfo.id}?title=1&byline=1`;
        break;
      case 'dailymotion':
        embedUrl = `https://www.dailymotion.com/embed/video/${videoInfo.id}`;
        break;
      default:
        embedUrl = videoInfo.url;
    }

    const videoHTML = `
      <div class="notab-video-view">
        <iframe
          src="${embedUrl}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowfullscreen
          class="notab-video-iframe"
        ></iframe>
        <div class="notab-video-controls">
          <button class="notab-btn notab-fullscreen-toggle" title="全屏">⛶</button>
        </div>
      </div>
    `;

    body.innerHTML = videoHTML;
    container.classList.add(window.NOTAB_CONSTANTS.CLASSES.VIDEO_MODE);

    // 绑定全屏按钮
    this.bindFullscreenEvent(container);
  }

  /**
   * 创建视频视图（原生video元素）
   */
  createVideoView(container, videoElement, sourceUrl) {
    const body = container.querySelector('.notab-preview-body');

    // 克隆video元素
    let videoHTML = '';

    if (videoElement.tagName === 'VIDEO') {
      const videoClone = videoElement.cloneNode(true);
      videoClone.controls = true;
      videoClone.className = 'notab-video-element';
      videoHTML = videoClone.outerHTML;
    } else if (videoElement.tagName === 'IFRAME') {
      videoHTML = `
        <iframe
          src="${videoElement.src}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowfullscreen
          class="notab-video-iframe"
        ></iframe>
      `;
    }

    const viewHTML = `
      <div class="notab-video-view">
        ${videoHTML}
        <div class="notab-video-controls">
          <button class="notab-btn notab-fullscreen-toggle" title="全屏">⛶</button>
          <a href="${sourceUrl}" target="_blank" class="notab-btn" title="源页面">🔗</a>
        </div>
      </div>
    `;

    body.innerHTML = viewHTML;
    container.classList.add(window.NOTAB_CONSTANTS.CLASSES.VIDEO_MODE);

    // 绑定全屏按钮
    this.bindFullscreenEvent(container);
  }

  /**
   * 绑定全屏事件
   */
  bindFullscreenEvent(container) {
    const fullscreenBtn = container.querySelector('.notab-fullscreen-toggle');
    if (!fullscreenBtn) return;

    fullscreenBtn.addEventListener('click', () => {
      const videoView = container.querySelector('.notab-video-view');

      if (!document.fullscreenElement) {
        if (videoView.requestFullscreen) {
          videoView.requestFullscreen();
        } else if (videoView.webkitRequestFullscreen) {
          videoView.webkitRequestFullscreen();
        } else if (videoView.mozRequestFullScreen) {
          videoView.mozRequestFullScreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });

    // 监听全屏变化
    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) {
        fullscreenBtn.textContent = '⛶';
      } else {
        fullscreenBtn.textContent = '⛶';
      }
    });
  }

  /**
   * 显示消息
   */
  showMessage(container, message) {
    const body = container.querySelector('.notab-preview-body');
    body.innerHTML = `
      <div class="notab-message">
        <p>${message}</p>
      </div>
    `;
  }
}

// 创建全局实例
window.notabVideoMode = new VideoMode();
