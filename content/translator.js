// 翻译模块
class Translator {
  constructor() {
    this.translationAPIs = window.NOTAB_CONSTANTS.TRANSLATION_APIS;
    this.selectedText = '';
    this.floatingUI = null;
    this.resultBox = null;
    this.requestQueue = [];
    this.isProcessing = false;
    this.cache = new Map();

    this.init();
  }

  /**
   * 初始化
   */
  init() {
    this.bindTextSelection();
  }

  /**
   * 监听文本选择
   */
  bindTextSelection() {
    document.addEventListener('mouseup', (e) => {
      // 延迟检查选择，确保选择已完成
      setTimeout(() => {
        const selection = window.getSelection();
        const text = selection.toString().trim();

        // 忽略预览窗口内的选择
        if (e.target.closest('.notab-preview-container')) {
          return;
        }

        if (text.length > 0 && text.length < 5000) {
          this.selectedText = text;
          this.showTranslateButton(e.clientX, e.clientY);
        } else {
          this.hideTranslateButton();
        }
      }, 10);
    });

    // 点击页面其他地方时隐藏按钮
    document.addEventListener('mousedown', (e) => {
      if (!e.target.closest('.notab-translate-button') &&
          !e.target.closest('.notab-translation-result')) {
        this.hideTranslateButton();
        this.hideResult();
      }
    });
  }

  /**
   * 显示翻译按钮
   */
  showTranslateButton(x, y) {
    if (!this.floatingUI) {
      this.floatingUI = window.notabDomUtils.createFromHTML(`
        <div class="notab-translate-button">
          <button class="notab-btn translate-btn" title="翻译">🌐</button>
          <button class="notab-btn search-btn" title="搜索">🔍</button>
        </div>
      `);

      document.body.appendChild(this.floatingUI);

      // 绑定事件
      this.floatingUI.querySelector('.translate-btn').addEventListener('click', () => {
        this.translate(this.selectedText);
      });

      this.floatingUI.querySelector('.search-btn').addEventListener('click', () => {
        window.notabSearch?.searchSelectedText(this.selectedText);
      });
    }

    // 调整位置
    this.floatingUI.style.left = `${x}px`;
    this.floatingUI.style.top = `${y - 50}px`;
    this.floatingUI.style.display = 'flex';

    // 确保在视口内
    setTimeout(() => {
      const rect = this.floatingUI.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        this.floatingUI.style.left = `${window.innerWidth - rect.width - 10}px`;
      }
      if (rect.bottom > window.innerHeight) {
        this.floatingUI.style.top = `${y + 10}px`;
      }
    }, 0);
  }

  /**
   * 隐藏翻译按钮
   */
  hideTranslateButton() {
    if (this.floatingUI) {
      this.floatingUI.style.display = 'none';
    }
  }

  /**
   * 翻译文本
   */
  async translate(text) {
    if (!text) return;

    this.hideTranslateButton();

    // 检查缓存
    const targetLang = await this.detectTargetLanguage(text);
    const cacheKey = `${text}_${targetLang}`;

    if (this.cache.has(cacheKey)) {
      this.showTranslationResult(text, this.cache.get(cacheKey));
      return;
    }

    // 显示加载中
    this.showTranslationResult(text, '翻译中...', true);

    try {
      // 尝试使用LibreTranslate
      let result = await this.translateWithLibreTranslate(text, targetLang);

      if (!result) {
        // 降级使用MyMemory
        result = await this.translateWithMyMemory(text, targetLang);
      }

      if (result) {
        this.cache.set(cacheKey, result);
        this.showTranslationResult(text, result);
      } else {
        this.showTranslationResult(text, '翻译失败，请稍后重试');
      }

    } catch (error) {
      console.error('Translation error:', error);
      this.showTranslationResult(text, '翻译失败：' + error.message);
    }
  }

  /**
   * 使用LibreTranslate翻译
   */
  async translateWithLibreTranslate(text, targetLang) {
    try {
      const response = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q: text,
          source: 'auto',
          target: targetLang,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error('LibreTranslate request failed');
      }

      const data = await response.json();
      return data.translatedText;

    } catch (error) {
      console.error('LibreTranslate error:', error);
      return null;
    }
  }

  /**
   * 使用MyMemory翻译
   */
  async translateWithMyMemory(text, targetLang) {
    try {
      const sourceLang = await this.detectLanguage(text);
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('MyMemory request failed');
      }

      const data = await response.json();
      return data.responseData.translatedText;

    } catch (error) {
      console.error('MyMemory error:', error);
      return null;
    }
  }

  /**
   * 检测语言
   */
  async detectLanguage(text) {
    // 简单的语言检测
    const chineseRegex = /[\u4e00-\u9fa5]/;
    const japaneseRegex = /[\u3040-\u309f\u30a0-\u30ff]/;
    const koreanRegex = /[\uac00-\ud7af]/;

    if (chineseRegex.test(text)) return 'zh';
    if (japaneseRegex.test(text)) return 'ja';
    if (koreanRegex.test(text)) return 'ko';

    return 'en';
  }

  /**
   * 检测目标语言
   */
  async detectTargetLanguage(text) {
    const sourceLang = await this.detectLanguage(text);

    // 中文翻译成英文，其他语言翻译成中文
    return sourceLang === 'zh' ? 'en' : 'zh';
  }

  /**
   * 显示翻译结果
   */
  showTranslationResult(originalText, translatedText, isLoading = false) {
    if (!this.resultBox) {
      this.resultBox = window.notabDomUtils.createFromHTML(`
        <div class="notab-translation-result">
          <div class="translation-header">
            <span>翻译结果</span>
            <button class="notab-btn close-btn" title="关闭">✕</button>
          </div>
          <div class="translation-body">
            <div class="translation-original"></div>
            <div class="translation-divider">↓</div>
            <div class="translation-translated"></div>
          </div>
        </div>
      `);

      document.body.appendChild(this.resultBox);

      // 绑定关闭按钮
      this.resultBox.querySelector('.close-btn').addEventListener('click', () => {
        this.hideResult();
      });
    }

    // 更新内容
    const originalDiv = this.resultBox.querySelector('.translation-original');
    const translatedDiv = this.resultBox.querySelector('.translation-translated');

    originalDiv.textContent = originalText;
    translatedDiv.textContent = translatedText;

    if (isLoading) {
      translatedDiv.classList.add('loading');
    } else {
      translatedDiv.classList.remove('loading');
    }

    this.resultBox.style.display = 'block';

    // 居中显示
    setTimeout(() => {
      const rect = this.resultBox.getBoundingClientRect();
      const left = (window.innerWidth - rect.width) / 2;
      const top = (window.innerHeight - rect.height) / 2;

      this.resultBox.style.left = `${Math.max(10, left)}px`;
      this.resultBox.style.top = `${Math.max(10, top)}px`;
    }, 0);
  }

  /**
   * 隐藏翻译结果
   */
  hideResult() {
    if (this.resultBox) {
      this.resultBox.style.display = 'none';
    }
  }
}

// 创建全局实例
window.notabTranslator = new Translator();
