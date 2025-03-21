import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from "gsap";
import gradientBg from '../../assets/images/default-gradient.webp';

const GradientBackground = () => {
  const gradientRefs = useRef([]);

  // 弥散图像数据
  const gradientItems = [
    { top: '-20%', left: '-15%', size: 900, rotate: -12, opacity: 0.8 },
    { top: '10%', left: '-18%', size: 800, rotate: 25, opacity: 0.6 },
    { top: '-25%', right: '-20%', size: 950, rotate: 15, opacity: 0.7 },
    { top: '15%', right: '-30%', size: 880, rotate: -20, opacity: 0.65 },
    { top: '30%', left: '20%', size: 1000, rotate: 30, opacity: 0.5 },
    { top: '25%', right: '5%', size: 920, rotate: -35, opacity: 0.55 },
    { bottom: '-30%', left: '0%', size: 950, rotate: 40, opacity: 0.7 },
    { bottom: '-25%', right: '-15%', size: 1050, rotate: -25, opacity: 0.65 },
    { top: '45%', left: '-35%', size: 1150, rotate: 18, opacity: 0.4 },
    { bottom: '15%', right: '25%', size: 1100, rotate: -8, opacity: 0.5 }
  ];

  useEffect(() => {
    // 为每个弥散图像创建更明显的动画效果
    gradientRefs.current.forEach((ref, index) => {
      if (!ref) return;
      
      // 随机选择不同的动画效果
      const animationType = index % 3;
      const duration = 10 + Math.random() * 15; // 10-25秒
      const delay = Math.random() * 2; // 0-2秒延迟
      
      // 大幅增加移动距离
      const moveX = 70 + Math.random() * 100; // 70-170px
      const moveY = 70 + Math.random() * 100; // 70-170px
      
      const easeTypes = [
        "sine.inOut", 
        "power1.inOut", 
        "circ.inOut"
      ];
      
      const easeType = easeTypes[index % easeTypes.length];
      
      switch (animationType) {
        case 0: // 随机移动
          gsap.to(ref, {
            duration: duration,
            x: (Math.random() > 0.5 ? moveX : -moveX),
            y: (Math.random() > 0.5 ? moveY : -moveY),
            repeat: -1,
            yoyo: true,
            ease: easeType,
            delay: delay
          });
          break;
        
        case 1: // 移动 透明度变化
          gsap.to(ref, {
            duration: duration * 0.7,
            x: (Math.random() > 0.5 ? moveX : -moveX) * 0.9,
            y: (Math.random() > 0.5 ? moveY : -moveY) * 0.9,
            opacity: index => Math.max(0.2, parseFloat(ref.style.opacity) * 0.6),
            repeat: -1,
            yoyo: true,
            ease: easeType,
            delay: delay
          });
          break;
        
        case 2: // 移动 缩放
          gsap.to(ref, {
            duration: duration * 0.8,
            x: (Math.random() > 0.5 ? moveX : -moveX) * 0.8,
            y: (Math.random() > 0.5 ? moveY : -moveY) * 0.8,
            scale: 1 + (Math.random() * 0.25), // 最多放大25%
            repeat: -1,
            yoyo: true,
            ease: easeType,
            delay: delay
          });
          break;
      }
    });
  }, []);

  return (
    <>
      {/* 半透明黑色遮罩层 */}
      <div
        className="absolute"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 1)',
          zIndex: -1
        }}
      ></div>

      {/* 分布的弥散图像 */}
      {gradientItems.map((item, index) => (
        <div
          key={index}
          className="absolute z-0"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
            userSelect: 'none'
          }}
        >
          <div
            className="relative"
            style={{
              width: `${item.size}px`,
              height: `${item.size}px`,
              transform: `rotate(${item.rotate}deg)`,
              opacity: item.opacity
            }}
            ref={el => gradientRefs.current[index] = el}
          >
            <Image
              src={gradientBg}
              alt="Gradient effect"
              width={item.size}
              height={item.size}
              style={{ objectFit: 'contain', width: 'auto', height: 'auto' }}
              priority
              draggable="false"
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default GradientBackground;
