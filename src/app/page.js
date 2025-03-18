'use client';

import { addToast, Button, Avatar, AvatarGroup, AvatarIcon } from "@heroui/react";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import gradientBg from '../assets/images/default-gradient.webp';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const isLogin = document.cookie.split('; ').find(row => row.startsWith('isLogin='));
    if (!isLogin || isLogin.split('=')[1] !== '1') {
      router.push('/login');
      addToast({
        title: "你还没有登陆哦~",
        description: "请先登陆再访问这个页面",
        color: "warning",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    }
  }, [router]);

  // 弥散图像数据 - 尺寸大小、位置、旋转角度、透明度
  const gradientItems = [
    // 左上区域 - 超大尺寸
    { top: '-20%', left: '-15%', size: 900, rotate: -12, opacity: 0.8 },
    { top: '10%', left: '-18%', size: 800, rotate: 25, opacity: 0.6 },

    // 右上区域
    { top: '-25%', right: '-20%', size: 950, rotate: 15, opacity: 0.7 },
    { top: '15%', right: '-30%', size: 880, rotate: -20, opacity: 0.65 },

    // 中间区域 - 更大更模糊
    { top: '30%', left: '20%', size: 1000, rotate: 30, opacity: 0.5 },
    { top: '25%', right: '5%', size: 920, rotate: -35, opacity: 0.55 },

    // 底部区域
    { bottom: '-30%', left: '0%', size: 950, rotate: 40, opacity: 0.7 },
    { bottom: '-25%', right: '-15%', size: 1050, rotate: -25, opacity: 0.65 },

    // 额外添加几个超大图片增强弥散感
    { top: '45%', left: '-35%', size: 1150, rotate: 18, opacity: 0.4 },
    { bottom: '15%', right: '25%', size: 1100, rotate: -8, opacity: 0.5 }
  ];

  return (
    <div className="relative flex items-center justify-center w-full h-screen overflow-hidden bg-gray-50">
      {/* 半透明黑色遮罩层 - 置于最底层 */}
      <div
        className="absolute"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 1)', // 50%透明度的黑色
          zIndex: -1 // 设置为负值，确保在弥散图像下方
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
          >
            <Image
              src={gradientBg}
              alt="Gradient effect"
              width={item.size}
              height={item.size}
              style={{ objectFit: 'contain' }}
              priority={index < 3} // 只给前几个图片高优先级加载
              draggable="false" // 禁止拖拽
            />
          </div>
        </div>
      ))}

      {/* 内容图层 */}
      <div className="relative z-10 text-center">
        <Avatar isBordered radius="md" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />

      </div>
    </div>
  );
}
