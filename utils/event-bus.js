// 事件总线 - 用于模块间通信
class EventBus {
  constructor() {
    this.events = {};
  }

  // 订阅事件
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);

    // 返回取消订阅函数
    return () => this.off(eventName, callback);
  }

  // 取消订阅
  off(eventName, callback) {
    if (!this.events[eventName]) return;

    this.events[eventName] = this.events[eventName].filter(
      cb => cb !== callback
    );
  }

  // 发布事件
  emit(eventName, data) {
    if (!this.events[eventName]) return;

    this.events[eventName].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event handler for ${eventName}:`, error);
      }
    });
  }

  // 只订阅一次
  once(eventName, callback) {
    const onceCallback = (data) => {
      callback(data);
      this.off(eventName, onceCallback);
    };
    this.on(eventName, onceCallback);
  }

  // 清除所有事件监听
  clear() {
    this.events = {};
  }
}

// 创建全局事件总线实例
window.notabEventBus = new EventBus();
