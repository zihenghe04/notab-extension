// 会员管理器 - Membership Manager
class MembershipManager {
  constructor() {
    this.membershipStatus = {
      plan: 'free',  // 'free' or 'pro'
      activatedAt: null,
      expiresAt: null,
      code: null
    };

    // Pro 兑换码列表（实际应该在后端验证）
    this.validCodes = [
      'NOWVIEW-PRO-2024',
      'WELCOME-PRO-001',
      'BETA-TESTER-PRO',
      'EARLYBIRD-2024'
    ];

    this.init();
  }

  /**
   * 初始化会员管理器
   */
  async init() {
    // 从存储读取会员状态
    const status = await this.getMembershipStatus();
    this.membershipStatus = status;

    // 检查是否过期
    this.checkExpiration();
  }

  /**
   * 获取会员状态
   */
  async getMembershipStatus() {
    return new Promise((resolve) => {
      chrome.storage.sync.get('membershipStatus', (result) => {
        resolve(result.membershipStatus || {
          plan: 'free',
          activatedAt: null,
          expiresAt: null,
          code: null
        });
      });
    });
  }

  /**
   * 保存会员状态
   */
  async saveMembershipStatus() {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ membershipStatus: this.membershipStatus }, () => {
        // 触发会员状态变化事件
        window.notabEventBus?.emit('membershipChanged', this.membershipStatus);
        resolve();
      });
    });
  }

  /**
   * 验证兑换码
   */
  async validateCode(code) {
    // 清理兑换码（去除空格，转大写）
    code = code.trim().toUpperCase();

    // 检查兑换码是否有效
    if (!this.validCodes.includes(code)) {
      return {
        success: false,
        message: '兑换码无效，请检查后重试'
      };
    }

    // 检查是否已经是 Pro 用户
    if (this.membershipStatus.plan === 'pro') {
      return {
        success: false,
        message: '您已经是 Pro 会员了'
      };
    }

    // 激活 Pro 会员
    this.membershipStatus.plan = 'pro';
    this.membershipStatus.activatedAt = Date.now();
    this.membershipStatus.expiresAt = null;  // 永久激活
    this.membershipStatus.code = code;

    await this.saveMembershipStatus();

    return {
      success: true,
      message: '🎉 恭喜！Pro 会员激活成功'
    };
  }

  /**
   * 检查是否为 Pro 用户
   */
  async isPro() {
    const status = await this.getMembershipStatus();

    // 检查是否过期
    if (status.expiresAt && status.expiresAt < Date.now()) {
      return false;
    }

    return status.plan === 'pro';
  }

  /**
   * 检查过期
   */
  async checkExpiration() {
    if (this.membershipStatus.expiresAt &&
        this.membershipStatus.expiresAt < Date.now()) {
      // 已过期，降级为 Free
      this.membershipStatus.plan = 'free';
      this.membershipStatus.expiresAt = null;
      await this.saveMembershipStatus();

      console.log('Pro membership expired, downgraded to Free');
    }
  }

  /**
   * 获取会员信息
   */
  getMembershipInfo() {
    return {
      plan: this.membershipStatus.plan,
      isPro: this.membershipStatus.plan === 'pro',
      activatedAt: this.membershipStatus.activatedAt,
      expiresAt: this.membershipStatus.expiresAt,
      code: this.membershipStatus.code
    };
  }

  /**
   * 检查是否可以创建预览（Free用户有次数限制）
   */
  async canCreatePreview() {
    const isPro = this.membershipStatus.plan === 'pro';

    // Pro 用户无限制
    if (isPro) {
      return {
        allowed: true,
        remaining: -1 // -1 表示无限制
      };
    }

    // Free 用户每天限制 10 次
    const today = new Date().toDateString();
    const usage = await this.getUsageToday();

    const limit = 10;
    const remaining = limit - usage.count;

    if (remaining <= 0) {
      return {
        allowed: false,
        remaining: 0,
        message: '今日预览次数已用完，升级 Pro 解锁无限预览！'
      };
    }

    return {
      allowed: true,
      remaining: remaining,
      message: remaining <= 3 ? `今日还剩 ${remaining} 次预览` : null
    };
  }

  /**
   * 记录预览使用
   */
  async recordPreviewUsage() {
    const isPro = this.membershipStatus.plan === 'pro';
    if (isPro) return; // Pro 用户不记录

    const today = new Date().toDateString();

    return new Promise((resolve) => {
      chrome.storage.local.get('previewUsage', (result) => {
        const usage = result.previewUsage || {};

        if (!usage[today]) {
          usage[today] = { count: 0, dates: [] };
        }

        usage[today].count++;
        usage[today].dates.push(Date.now());

        // 只保留最近7天的数据
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        Object.keys(usage).forEach(date => {
          if (new Date(date) < sevenDaysAgo) {
            delete usage[date];
          }
        });

        chrome.storage.local.set({ previewUsage: usage }, resolve);
      });
    });
  }

  /**
   * 获取今日使用次数
   */
  async getUsageToday() {
    const today = new Date().toDateString();

    return new Promise((resolve) => {
      chrome.storage.local.get('previewUsage', (result) => {
        const usage = result.previewUsage || {};
        resolve(usage[today] || { count: 0, dates: [] });
      });
    });
  }

  /**
   * 重置会员状态（测试用）
   */
  async resetMembership() {
    this.membershipStatus = {
      plan: 'free',
      activatedAt: null,
      expiresAt: null,
      code: null
    };
    await this.saveMembershipStatus();
    console.log('Membership reset to Free');
  }
}

// 创建全局会员管理器实例
window.membershipManager = new MembershipManager();
