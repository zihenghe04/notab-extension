// ===== 平滑滚动到元素 =====
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===== 导航栏滚动效果 =====
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    
    // 添加阴影效果
    if (scrollTop > 10) {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScrollTop = scrollTop;
});

// ===== 功能展示轮播 =====
const showcaseItems = document.querySelectorAll('.showcase-item');
let currentShowcase = 0;

function rotateShowcase() {
    showcaseItems.forEach(item => item.classList.remove('active'));
    showcaseItems[currentShowcase].classList.add('active');
    
    currentShowcase = (currentShowcase + 1) % showcaseItems.length;
}

// 每 3 秒轮播一次
setInterval(rotateShowcase, 3000);

// ===== 导航链接点击处理 =====
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // 检查是否是内部链接
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // 更新导航栏活跃状态
                document.querySelectorAll('.nav-links a').forEach(a => {
                    a.style.color = '';
                });
                link.style.color = 'var(--primary-color)';
            }
        }
    });
});

// ===== 页面滚动时更新导航栏活跃项 =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollTop >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--primary-color)';
        }
    });
});

// ===== 按钮点击事件 =====
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        // 添加点击反馈
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
    });
});

// ===== FAQ 动画 =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const summary = item.querySelector('summary');
    
    summary.addEventListener('click', (e) => {
        e.preventDefault();
        
        // 关闭其他 FAQ 项
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.hasAttribute('open')) {
                otherItem.removeAttribute('open');
            }
        });
        
        // 切换当前项
        if (item.hasAttribute('open')) {
            item.removeAttribute('open');
        } else {
            item.setAttribute('open', '');
        }
    });
});

// ===== 模块卡片悬停效果 =====
const moduleCards = document.querySelectorAll('.module-card, .feature-card, .doc-card');

moduleCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'var(--transition)';
    });
});

// ===== 计数器动画 =====
function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const text = stat.textContent;
        
        // 处理数字类型的计数
        const match = text.match(/(\d+)/);
        if (match) {
            const finalNumber = parseInt(match[1]);
            const element = stat;
            let current = 0;
            
            const increment = Math.ceil(finalNumber / 30);
            const timer = setInterval(() => {
                current += increment;
                if (current >= finalNumber) {
                    element.textContent = text;
                    clearInterval(timer);
                } else {
                    element.textContent = text.replace(/\d+/, current);
                }
            }, 30);
        }
    });
}

// 页面加载时触发计数器动画
window.addEventListener('load', () => {
    // 延迟执行以确保页面完全加载
    setTimeout(animateCounters, 500);
});

// ===== 代码块点击复制 =====
const codeBlocks = document.querySelectorAll('code');

codeBlocks.forEach(block => {
    block.style.cursor = 'pointer';
    block.style.position = 'relative';
    
    block.addEventListener('click', function() {
        const text = this.textContent;
        
        // 复制到剪贴板
        navigator.clipboard.writeText(text).then(() => {
            // 显示复制提示
            const originalText = this.textContent;
            this.textContent = '✓ 已复制';
            this.style.color = 'var(--success-color)';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.color = '';
            }, 2000);
        }).catch(err => {
            console.error('复制失败:', err);
        });
    });
});

// ===== 响应式菜单（未来功能） =====
function setupResponsiveMenu() {
    const navbar = document.querySelector('.navbar');
    
    // 检查是否是移动设备
    if (window.innerWidth <= 768) {
        // 可以在这里添加移动菜单逻辑
        console.log('移动设备菜单已启用');
    }
}

// 页面加载时设置
window.addEventListener('DOMContentLoaded', setupResponsiveMenu);
window.addEventListener('resize', setupResponsiveMenu);

// ===== 主题检测和应用 =====
function initTheme() {
    // 检查系统主题偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    
    let theme = storedTheme || (prefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', theme);
}

// 页面加载时初始化主题
window.addEventListener('DOMContentLoaded', initTheme);

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const newTheme = e.matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ===== 性能优化：懒加载 =====
function setupLazyLoading() {
    // 如果浏览器支持 IntersectionObserver
    if ('IntersectionObserver' in window) {
        const imageElements = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        imageElements.forEach(img => imageObserver.observe(img));
    }
}

window.addEventListener('DOMContentLoaded', setupLazyLoading);

// ===== 页面加载完成指示 =====
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    console.log('✅ NowView 官网已加载完成');
});

// ===== 初始样式 =====
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0.95';
    
    // 添加加载动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        section {
            animation: fadeIn 0.6s ease-out forwards;
        }
        
        section:nth-child(n) {
            animation-delay: calc(0.1s * var(--section-index, 0));
        }
    `;
    document.head.appendChild(style);
});

// ===== 分析追踪（可选） =====
function trackEvent(eventName, eventData = {}) {
    // 这里可以集成 Google Analytics 或其他分析工具
    console.log(`📊 事件: ${eventName}`, eventData);
}

// 追踪按钮点击
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        const buttonText = this.textContent.trim();
        trackEvent('button_click', { button: buttonText });
    });
});

// ===== 获取用户反馈 =====
function setupFeedback() {
    // 创建反馈按钮（可选）
    const feedbackButton = document.createElement('div');
    feedbackButton.id = 'feedback-button';
    feedbackButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 12px 16px;
        border-radius: 50px;
        cursor: pointer;
        z-index: 999;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 168, 255, 0.4);
        display: none;
    `;
    feedbackButton.innerHTML = '💬 反馈';
    
    feedbackButton.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 6px 16px rgba(0, 168, 255, 0.6)';
    });
    
    feedbackButton.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 12px rgba(0, 168, 255, 0.4)';
    });
    
    feedbackButton.addEventListener('click', function() {
        // 这里可以集成反馈表单或链接
        window.open('https://github.com/yourrepo/issues', '_blank');
        trackEvent('feedback_click');
    });
    
    // 注释掉反馈按钮，如果需要可以打开
    // document.body.appendChild(feedbackButton);
}

window.addEventListener('DOMContentLoaded', setupFeedback);

// ===== 平滑加载图片 =====
function loadImage(img) {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    
    img.onload = function() {
        this.style.opacity = '1';
    };
}

// ===== 防止链接的默认行为（如果需要） =====
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    
    if (link && link.href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(link.href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});

// ===== 性能监控 =====
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ 页面加载时间: ${pageLoadTime}ms`);
    });
}

// ===== 设置页面元数据 =====
function updateMetaTags() {
    // 你可以在这里动态更新 meta 标签
    const description = document.querySelector('meta[name="description"]');
    if (description) {
        console.log('✅ Meta 描述:', description.content);
    }
}

window.addEventListener('DOMContentLoaded', updateMetaTags);

console.log('%c🚀 NowView - 智能链接预览工具', 'color: #00a8ff; font-size: 16px; font-weight: bold;');
console.log('%c完整的链接预览、阅读模式、视频优化、翻译搜索功能', 'color: #666; font-size: 12px;');
console.log('%chttps://github.com/yourname/notab-extension', 'color: #00a8ff; font-size: 12px; text-decoration: underline;');
