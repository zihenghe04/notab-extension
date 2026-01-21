// 常量定义
window.NOTAB_CONSTANTS = {
  // 预览窗口默认配置
  PREVIEW: {
    DEFAULT_WIDTH: 800,
    DEFAULT_HEIGHT: 600,
    MIN_WIDTH: 300,
    MIN_HEIGHT: 200,
    MAX_PREVIEWS: 5,
    Z_INDEX_BASE: 10000
  },

  // 触发方式
  TRIGGER_METHODS: {
    DRAG: 'drag',
    HOVER: 'hover',
    CTRL_CLICK: 'ctrl+click',
    ALT_CLICK: 'alt+click'
  },

  // 事件类型
  EVENTS: {
    PREVIEW_CREATED: 'notab:preview:created',
    PREVIEW_CLOSED: 'notab:preview:closed',
    PREVIEW_PINNED: 'notab:preview:pinned',
    THEME_CHANGED: 'notab:theme:changed',
    SETTINGS_UPDATED: 'notab:settings:updated'
  },

  // CSS类名
  CLASSES: {
    PREVIEW_CONTAINER: 'notab-preview-container',
    PREVIEW_HEADER: 'notab-preview-header',
    PREVIEW_BODY: 'notab-preview-body',
    READER_MODE: 'reader-mode-active',
    VIDEO_MODE: 'video-mode-active',
    PINNED: 'pinned',
    DARK_THEME: 'notab-dark-theme'
  },

  // 搜索引擎
  SEARCH_ENGINES: [
    { name: 'Google', url: 'https://www.google.com/search?q=' },
    { name: 'Bing', url: 'https://www.bing.com/search?q=' },
    { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
    { name: 'Baidu', url: 'https://www.baidu.com/s?wd=' }
  ],

  // 翻译API
  TRANSLATION_APIS: [
    {
      name: 'LibreTranslate',
      url: 'https://libretranslate.de/translate',
      free: true
    },
    {
      name: 'MyMemory',
      url: 'https://api.mymemory.translated.net/get',
      free: true
    }
  ],

  // 视频网站模式
  VIDEO_PATTERNS: [
    { pattern: /youtube\.com\/watch\?v=([^&]+)/, type: 'youtube' },
    { pattern: /youtu\.be\/([^?]+)/, type: 'youtube' },
    { pattern: /vimeo\.com\/(\d+)/, type: 'vimeo' },
    { pattern: /dailymotion\.com\/video\/([^_]+)/, type: 'dailymotion' }
  ],

  // 视频元素选择器
  VIDEO_SELECTORS: [
    'video',
    'iframe[src*="youtube.com"]',
    'iframe[src*="vimeo.com"]',
    'iframe[src*="dailymotion.com"]',
    '.video-player',
    '[class*="video"]'
  ]
};
