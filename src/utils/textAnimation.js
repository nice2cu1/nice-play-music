import { gsap } from 'gsap';

/**
 * 为页面上的文本元素添加快速的自上而下同时动画效果，仅带微小的层次差异
 * @param {Object} options - 动画配置选项
 * @param {string} options.selector - 自定义选择器 (可选)
 * @param {number} options.duration - 基础动画时间 (可选，默认0.35)
 * @param {number} options.distance - Y轴位移距离 (可选，默认12)
 * @param {string} options.ease - 动画缓动函数 (可选，默认'power2.out')
 * @param {Function} options.onComplete - 所有动画完成后的回调 (可选)
 */
export const animateText = (options = {}) => {
  try {
    
    // 默认配置与用户配置合并
    const config = {
      selector: 'h1, h2, h3, h4, p, .text-2xl, .text-xl, .text-base, .text-sm, .text-xs, .text-common, .animate-text',
      duration: 0.35,
      distance: 12,
      ease: 'power2.out',
      onComplete: null,
      ...options
    };
    
    // 获取所有需要动画的文本元素
    const textElements = document.querySelectorAll(config.selector);
    
    // 过滤出需要处理的元素
    const elementsToAnimate = Array.from(textElements).filter(element => {
      return !element.getAttribute('data-animated') && 
             element.textContent.trim() && 
             !element.classList.contains('artist-name') && 
             !element.closest('.artist-name-wrapper') &&
             isElementVisible(element);
    });
    
    if (elementsToAnimate.length === 0) {
      if (typeof config.onComplete === 'function') config.onComplete();
      return;
    }
    
    // 根据元素的垂直位置将它们分组
    // 1. 获取每个元素的位置信息
    const elementPositions = elementsToAnimate.map(element => {
      const rect = element.getBoundingClientRect();
      return {
        element,
        top: rect.top
      };
    });
    
    // 2. 对元素按垂直位置排序
    elementPositions.sort((a, b) => a.top - b.top);
    
    // 设置动画参数
    const baseAnimationDuration = config.duration;
    const maxSlowdown = 0.1; // 最大减速因子
    
    // 找到最高和最低位置来计算相对位置
    const minTop = Math.min(...elementPositions.map(item => item.top));
    const maxTop = Math.max(...elementPositions.map(item => item.top));
    const topRange = maxTop - minTop || 1; // 避免除以零
    
    // 创建动画时间轴以便管理所有动画
    const timeline = gsap.timeline({
      onComplete: () => {
        if (typeof config.onComplete === 'function') config.onComplete();
      }
    });
    
    // 应用动画 - 同步开始但持续时间略有差异
    elementPositions.forEach(({element, top}) => {
      // 标记为已处理
      element.setAttribute('data-animated', 'true');
      
      // 根据元素垂直位置计算减速因子 (0-0.1之间)
      // 越靠下的元素，减速因子越大
      const slowdownFactor = (top - minTop) / topRange * maxSlowdown;
      
      // 最终动画时间 = 基础时间 + 减速因子
      const finalDuration = baseAnimationDuration + slowdownFactor;
      
      // 添加到时间轴，position为0表示同时开始
      timeline.fromTo(
        element,
        { 
          opacity: 0, 
          y: config.distance,
          visibility: 'visible'
        },
        { 
          opacity: 1, 
          y: 0,
          duration: finalDuration,
          ease: config.ease
        },
        0 // 同时开始
      );
    });
  } catch (error) {
    console.error('文本动画错误:', error);
    if (options.onComplete) options.onComplete();
  }
};

/**
 * 检查元素是否在视口内或附近
 */
const isElementVisible = (element) => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  // 扩展检测范围，包括即将进入视口的元素
  const extendedViewport = 300; // 视口外额外的像素范围
  
  return (
    rect.top < windowHeight + extendedViewport &&
    rect.bottom > -extendedViewport
  );
};

/**
 * 重置元素的动画状态
 */
export const resetAnimationState = (element) => {
  if (!element) return;
  
  try {
    const animatedElements = element.querySelectorAll('[data-animated="true"]');
    console.log(`重置 ${animatedElements.length} 个动画元素状态`);
    
    animatedElements.forEach(el => {
      el.removeAttribute('data-animated');
    });
  } catch (error) {
    console.error('重置动画状态错误:', error);
  }
};
