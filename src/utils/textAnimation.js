import { gsap } from 'gsap';
import { useRef, useEffect, useState } from 'react';

/**
 * React Hook：为文本元素容器添加平滑的动画效果
 * @param {Object} options - 动画配置选项
 * @param {number} options.duration - 基础动画时间 (可选，默认0.55)
 * @param {number} options.distance - Y轴位移距离 (可选，默认12)
 * @param {string} options.ease - 动画缓动函数 (可选，默认'power2.out')
 * @param {Function} options.onComplete - 所有动画完成后的回调 (可选)
 * @param {boolean} options.enabled - 是否启用动画 (可选，默认true)
 * @returns {[React.RefObject, Function, Function]} 返回一个数组，包含容器ref、触发动画函数和重置动画函数
 */
export const useTextAnimation = (options = {}) => {
  const containerRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  
  const config = {
    duration: 0.2,
    distance: 12,
    ease: 'back.inOut(1.7)',
    onComplete: null,
    enabled: true,
    ...options
  };
  
  // 手动触发动画的函数
  const triggerAnimation = () => {
    if (config.enabled) {
      setShouldAnimate(true);
    }
  };
  
  // 重置动画状态的函数
  const resetAnimation = () => {
    hasAnimatedRef.current = false;
    setShouldAnimate(true);
  };
  
  useEffect(() => {
    if (!shouldAnimate || !containerRef.current || !config.enabled || hasAnimatedRef.current) {
      return;
    }
    
    // 查找容器内的文本元素
    const container = containerRef.current;
    const textElements = Array.from(container.querySelectorAll('h1, h2, h3, h4, p, .text-2xl, .text-xl, .text-base, .text-sm, .text-xs, .text-common, .animate-text'))
      .filter(element => element.textContent.trim() && 
              !element.classList.contains('artist-name') && 
              !element.closest('.artist-name-wrapper'));
    
    if (textElements.length === 0) {
      if (typeof config.onComplete === 'function') config.onComplete();
      return;
    }
    
    // 根据元素的垂直位置将它们分组
    const elementPositions = textElements.map(element => {
      const rect = element.getBoundingClientRect();
      return {
        element,
        top: rect.top
      };
    });
    
    // 对元素按垂直位置排序
    elementPositions.sort((a, b) => a.top - b.top);
    
    // 设置动画参数
    const baseAnimationDuration = config.duration;
    const maxSlowdown = 0.7; // 最大减速因子
    
    // 找到最高和最低位置来计算相对位置
    const minTop = Math.min(...elementPositions.map(item => item.top));
    const maxTop = Math.max(...elementPositions.map(item => item.top));
    const topRange = maxTop - minTop || 1; // 避免除以零
    
    // 创建动画时间轴
    const timeline = gsap.timeline({
      onComplete: () => {
        hasAnimatedRef.current = true;
        setShouldAnimate(false);
        if (typeof config.onComplete === 'function') config.onComplete();
      }
    });
    
    // 应用动画 - 同步开始但持续时间略有差异
    elementPositions.forEach(({element, top}) => {
      // 根据元素垂直位置计算减速因子
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
    
    return () => {
      // 清理动画
      timeline.kill();
    };
  }, [shouldAnimate, config]);
  
  return [containerRef, triggerAnimation, resetAnimation];
};
