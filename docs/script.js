// ========================================
// NowView 网站 - 交互脚本
// ========================================

document.addEventListener('DOMContentLoaded', function() {

  // 移动端菜单切换
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }

  // FAQ 手风琴效果
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    if (question) {
      question.addEventListener('click', () => {
        // 关闭其他打开的项
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });

        // 切换当前项
        item.classList.toggle('active');
      });
    }
  });

  // 平滑滚动
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // 关闭移动端菜单
        navLinks?.classList.remove('active');
      }
    });
  });

  // 滚动动画效果
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // 观察所有功能卡片
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });

  // 观察所有使用场景项
  const useCaseItems = document.querySelectorAll('.use-case-item');
  useCaseItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(item);
  });

  // 导航栏滚动效果
  let lastScroll = 0;
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
  });

  // 统计数字动画
  const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number');

    stats.forEach(stat => {
      const target = stat.textContent;
      const hasPlus = target.includes('+');
      const hasDecimal = target.includes('.');
      const numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));

      let current = 0;
      const increment = numericValue / 50;
      const duration = 1500;
      const stepTime = duration / 50;

      const updateStat = () => {
        current += increment;
        if (current < numericValue) {
          stat.textContent = (hasDecimal ? current.toFixed(1) : Math.floor(current)) + (hasPlus ? '+' : '');
          setTimeout(updateStat, stepTime);
        } else {
          stat.textContent = target;
        }
      };

      updateStat();
    });
  };

  // 当统计区域进入视口时触发动画
  const statsSection = document.querySelector('.hero-stats');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        animateStats();
        entry.target.classList.add('animated');
      }
    });
  }, { threshold: 0.5 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // 按钮点击效果
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // 创建涟漪效果
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // 添加涟漪动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // 定价卡片高亮效果
  const pricingCards = document.querySelectorAll('.pricing-card');

  pricingCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      pricingCards.forEach(c => {
        if (c !== this) {
          c.style.opacity = '0.7';
        }
      });
      this.style.opacity = '1';
    });

    card.addEventListener('mouseleave', function() {
      pricingCards.forEach(c => {
        c.style.opacity = '1';
      });
    });
  });

  // 模拟预览卡片交互
  const previewItems = document.querySelectorAll('.preview-item');

  previewItems.forEach(item => {
    item.addEventListener('click', function() {
      const text = this.textContent;
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);

      // 可以在这里添加更多交互效果
      console.log(`点击了: ${text}`);
    });
  });

  // 页面加载完成提示
  console.log('🚀 NowView 网站加载完成！');
  console.log('📊 感谢您的访问！');

  // 检测浏览器并显示提示
  const checkBrowser = () => {
    const userAgent = navigator.userAgent;
    let browser = 'unknown';

    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      browser = 'Chrome';
    } else if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browser = 'Safari';
    } else if (userAgent.includes('Edg')) {
      browser = 'Edge';
    }

    console.log(`🌐 检测到浏览器: ${browser}`);

    if (browser !== 'Chrome' && browser !== 'Edge') {
      const downloadBtn = document.querySelector('.download-method.chrome .btn');
      if (downloadBtn) {
        const warning = document.createElement('p');
        warning.style.color = '#f59e0b';
        warning.style.fontSize = '14px';
        warning.style.marginTop = '12px';
        warning.textContent = '⚠️ NowView 目前仅支持 Chrome/Edge 浏览器';
        downloadBtn.parentElement.insertBefore(warning, downloadBtn.nextSibling);
      }
    }
  };

  checkBrowser();

  // 添加复制功能到兑换码
  const demoCode = document.querySelector('.demo-code code');
  if (demoCode) {
    demoCode.style.cursor = 'pointer';
    demoCode.title = '点击复制';

    demoCode.addEventListener('click', function() {
      const code = this.textContent;
      navigator.clipboard.writeText(code).then(() => {
        const original = this.textContent;
        this.textContent = '✅ 已复制！';

        setTimeout(() => {
          this.textContent = original;
        }, 1500);
      }).catch(err => {
        console.error('复制失败:', err);
      });
    });
  }

  // 滚动到顶部按钮
  const createScrollToTop = () => {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      font-size: 24px;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 999;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    `;

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 500) {
        scrollBtn.style.opacity = '1';
        scrollBtn.style.visibility = 'visible';
      } else {
        scrollBtn.style.opacity = '0';
        scrollBtn.style.visibility = 'hidden';
      }
    });

    scrollBtn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px) scale(1.1)';
    });

    scrollBtn.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  };

  createScrollToTop();

  // 添加当前年份到页脚
  const yearSpan = document.querySelector('.footer-bottom p');
  if (yearSpan && yearSpan.textContent.includes('2024')) {
    const currentYear = new Date().getFullYear();
    if (currentYear > 2024) {
      yearSpan.textContent = yearSpan.textContent.replace('2024', currentYear);
    }
  }
});
