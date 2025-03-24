import React, { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

export const VerticalCarousel = ({
  items,
  height = "500px",
  width = "full",
  maxWidth = "800px",
  autoPlayDuration = 5000,
  onSlideChange = () => {},
  onAnimationStart = () => {}
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const autoPlayInterval = React.useRef();
  
  // 添加一个动画锁，防止动画重叠
  const isAnimating = useRef(false);
  const isDragging = useRef(false);

  // 修改动画效果，加入更多动态感
  const slideVariants = {
    enter: (direction) => ({
      y: direction > 0 ? 350 : -350, // 增大距离
      scale: 0.85,
      opacity: 0.3,
      zIndex: 0,
      rotate: direction > 0 ? 2 : -2, // 轻微旋转
    }),
    center: {
      y: 0,
      scale: 1,
      opacity: 1,
      zIndex: 1,
      rotate: 0,
    },
    exit: (direction) => ({
      y: direction < 0 ? 350 : -350, // 出场方向相反
      scale: 0.85,
      opacity: 0,
      zIndex: 0,
      rotate: direction < 0 ? 2 : -2, // 轻微旋转
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  // 优化页面切换函数，添加防重复触发机制
  const paginate = useCallback((newDirection) => {
    if (!items || items.length === 0) return;
    if (isAnimating.current) return; // 如果动画正在进行中，则忽略
    
    isAnimating.current = true;
    
    const newIndex = calculateNewIndex(newDirection);
    
    // 先触发动画开始回调，传入方向和目标索引
    onAnimationStart(newDirection, newIndex);
    
    setDirection(newDirection);
    setCurrentIndex(newIndex);
    
    // 动画结束后释放锁定
    setTimeout(() => {
      isAnimating.current = false;
    }, 800); // 设置时间稍长于动画总时长
  }, [items, currentIndex, onAnimationStart]);
  
  // 计算新索引的辅助函数
  const calculateNewIndex = (newDirection) => {
    let newIndex = currentIndex + newDirection;
    if (newIndex < 0) newIndex = items.length - 1;
    if (newIndex >= items.length) newIndex = 0;
    return newIndex;
  };

  // 处理导航点点击 - 确保检查是否可以切换
  const handleNavDotClick = (index) => {
    if (index === currentIndex) return;
    if (isAnimating.current) return; // 如果动画正在进行中，则忽略
    
    isAnimating.current = true;
    
    // 计算方向
    const newDirection = index > currentIndex ? 1 : -1;
    
    // 触发动画开始回调，传入方向和目标索引
    onAnimationStart(newDirection, index);
    
    // 更新状态
    setDirection(newDirection);
    setCurrentIndex(index);
    
    // 动画结束后释放锁定
    setTimeout(() => {
      isAnimating.current = false;
    }, 800);
  };

  // 处理拖拽开始
  const handleDragStart = () => {
    isDragging.current = true;
    // 停止自动播放
    if (autoPlayInterval.current) {
      clearInterval(autoPlayInterval.current);
    }
  };

  // 处理拖拽结束 - 添加锁检查
  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = swipePower(offset.y, velocity.y);
    
    // 动画完成后恢复自动播放
    setTimeout(() => {
      isDragging.current = false;
      if (isPlaying) {
        setupAutoPlay();
      }
    }, 100);
    
    if (isAnimating.current) return; // 如果动画正在进行中，则忽略
    
    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  // 封装自动播放设置为函数
  const setupAutoPlay = useCallback(() => {
    if (autoPlayInterval.current) {
      clearInterval(autoPlayInterval.current);
    }
    
    autoPlayInterval.current = window.setInterval(() => {
      if (!isAnimating.current && !isDragging.current) {
        paginate(1);
      }
    }, autoPlayDuration);
    
    return () => {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
      }
    };
  }, [paginate, autoPlayDuration]);

  // 确保自动播放正确设置和清理
  React.useEffect(() => {
    if (!items || items.length === 0) return;
    
    if (isPlaying) {
      return setupAutoPlay();
    } else {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
      }
    }
    
    return () => {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
      }
    };
  }, [isPlaying, items, setupAutoPlay]);

  // 在初始渲染时通知父组件当前索引
  React.useEffect(() => {
    onSlideChange(currentIndex);
  }, []);

  // 添加GSAP动画效果到导航点 - 修复选择器
  useEffect(() => {
    if (!items || items.length === 0) return;
    
    // 使用正确的选择器匹配导航点元素
    const navDots = document.querySelectorAll(".carousel-indicator");
    
    // 为导航点添加进入动画
    gsap.from(navDots, {
      scale: 0,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: "back.out(1.7)",
      delay: 0.5
    });
    
    // 当前活动点的脉冲动画
    const activeNavDot = document.querySelector(".carousel-indicator.active");
    if (activeNavDot) {
      gsap.to(activeNavDot, {
        boxShadow: "0 0 8px 2px rgba(255, 255, 255, 0.7)",
        duration: 0.8,
        repeat: -1,
        yoyo: true
      });
    }
    
    return () => {
      gsap.killTweensOf(".carousel-indicator.active");
    };
  }, [items]);
  
  // 在当前索引变化时更新活动点的动画
  useEffect(() => {
    if (!items || items.length === 0) return;
    
    const navDots = document.querySelectorAll(".carousel-indicator");
    const activeNavDot = document.querySelector(".carousel-indicator.active");
    
    if (activeNavDot) {
      gsap.fromTo(activeNavDot, 
        { scale: 0.9 },
        { 
          scale: 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)"
        }
      );
    }
    
  }, [currentIndex, items]);

  // 在当前索引变化时更新活动点的动画
  useEffect(() => {
    if (!items || items.length === 0) return;
    
    // 在控制台记录导航点元素，便于调试
    console.log('Current dots:', document.querySelectorAll('.nav-indicator').length);
    
  }, [currentIndex, items]);

  // 监听当前索引变化
  useEffect(() => {
    // 必须确保即使索引变化不是由 paginate 触发的也会执行文字动画
    if (items && items.length > 0) {
      // 仅在非初始化时触发
      if (direction !== 0) {
        onSlideChange(currentIndex);
      }
    }
  }, [currentIndex]);

  // 空状态处理
  if (!items || items.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-default-100 rounded-2xl"
        style={{ height, width: width === 'full' ? '100%' : width, maxWidth }}
      >
        <p className="text-default-500">No carousel items</p>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-black rounded-2xl perspective-1000 ${width === 'full' ? 'w-full' : ''} mx-auto`}
      style={{
        height,
        width: width !== 'full' ? width : undefined,
        maxWidth,
        position: 'relative' // 确保相对定位
      }}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* 预加载下一张图片 */}
      <div className="hidden">
        {items.map((item, idx) => (
          <img
            key={`preload-${idx}`}
            src={item.imageUrl}
            alt="Preloading"
            aria-hidden="true"
          />
        ))}
      </div>

      <AnimatePresence
        initial={false}
        custom={direction}
        mode="crossfade"
      >
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { type: "spring", stiffness: 250, damping: 25 }, // 调整弹簧参数
            scale: { type: "spring", stiffness: 280, damping: 22 },
            opacity: { duration: 0.4 },
            rotate: { duration: 0.5, ease: "easeInOut" }, // 添加旋转过渡
          }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={1}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className="absolute w-full h-full bg-black-500"
        >
          <img
            src={items[currentIndex].imageUrl}
            alt={items[currentIndex].title}
            className="w-full h-full object-cover"
            style={{
              backfaceVisibility: "hidden",
            }}
          />
        </motion.div>      
      </AnimatePresence>      
      {/* 导航点 */}
      <div 
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 999,
          pointerEvents: 'all' // 确保点击事件生效
        }}
      >
        {items.map((_, index) => (
          <div
            key={index}
            onClick={() => handleNavDotClick(index)}
            className="nav-indicator"
            style={{
              width: index === currentIndex ? '8px' : '8px',
              height: index === currentIndex ? '32px' : '8px',
              backgroundColor: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
              borderRadius: '9999px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
};