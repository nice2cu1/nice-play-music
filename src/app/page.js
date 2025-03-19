'use client';

import { addToast, Button, Avatar, Card, CardHeader, CardBody, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { useRouter } from 'next/navigation';
import { gsap } from "gsap";
import { createContext, useEffect, useState, useRef, memo, useCallback, useContext } from 'react';
import Image from 'next/image';
import gradientBg from '../assets/images/default-gradient.webp';

import homeIcon from '../assets/icons/lights/home.svg';
import discoverIcon from '../assets/icons/lights/discover.svg';
import libraryIcon from '../assets/icons/lights/library.svg';
import playerIcon from '../assets/icons/lights/player.svg';
import settingsIcon from '../assets/icons/lights/settings.svg';

import homeIconPressed from '../assets/icons/lights/home_pressed.svg';
import discoverIconPressed from '../assets/icons/lights/discover_pressed.svg';
import libraryIconPressed from '../assets/icons/lights/library_pressed.svg';
import playerIconPressed from '../assets/icons/lights/player_pressed.svg';
import settingsIconPressed from '../assets/icons/lights/settings_pressed.svg';

import HomePage from './home/page';
import DiscoverPage from './discover/page';
import LibraryPage from './library/page';

// 创建菜单状态上下文
const MenuContext = createContext();

// MenuProvider 组件
const MenuProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState('home');
  const [isPlayerActive, setIsPlayerActive] = useState(false);

  // 获取当前页面标题
  const getCurrentTitle = () => {
    switch (activeMenu) {
      case 'home': return "Home";
      case 'discover': return "Discover";
      case 'library': return "Library";
      case 'settings': return "设置";
      default: return "首页";
    }
  };

  // 获取当前页面组件
  const getCurrentPage = () => {
    switch (activeMenu) {
      case 'home': return <HomePage />;
      case 'discover': return <DiscoverPage />;
      case 'library': return <LibraryPage />;
      case 'settings': return <div>设置页面开发中...</div>;
      default: return <HomePage />;
    }
  };

  // handleMenuClick逻辑
  const handleMenuClick = useCallback((menuId) => {
    if (menuId === 'player') {
      // 点击播放器按钮只切换播放器模式，不改变当前页面
      setIsPlayerActive(prev => !prev);
    } else {
      // 点击其他菜单按钮，切换到对应页面
      setActiveMenu(menuId);
    }
  }, []);

  return (
    <MenuContext.Provider value={{
      activeMenu,
      handleMenuClick,
      getCurrentTitle,
      getCurrentPage,
      isPlayerActive
    }}>
      {children}
    </MenuContext.Provider>
  );
};

// 导航按钮组件
// NavButton 组件优化
const NavButton = memo(({ id, icon, iconPressed, marginTop = 0 }) => {
  const { activeMenu, handleMenuClick, isPlayerActive } = useContext(MenuContext);

  // 根据按钮类型判断激活状态
  const isActive = id === 'player'
    ? isPlayerActive  // player按钮根据播放器模式判断激活状态
    : activeMenu === id;  // 其他按钮根据当前页面判断激活状态

  const handleClick = useCallback(() => {
    handleMenuClick(id);
  }, [id, handleMenuClick]);

  // 获取提示文本
  const getTooltipText = () => {
    switch (id) {
      case 'home': return '首页';
      case 'discover': return '发现';
      case 'library': return '音乐库';
      case 'player': return isPlayerActive ? '关闭播放器' : '打开播放器';
      case 'settings': return '设置';
      default: return id;
    }
  };

  return (
    <Tooltip
      content={getTooltipText()}
      placement="right"
      delay={300}
      closeDelay={0}
      motionProps={{
        transition: { duration: 0.2 }
      }}
    >
      <Button
        isIconOnly
        color="transparent"
        radius="none"
        style={{ marginTop: marginTop ? `${marginTop}px` : 0 }}
        onPress={handleClick}
        className={isActive ? "opacity-100" : "opacity-70 hover:opacity-100"}
        isDisabled={id !== 'player' && isActive}
      >
        <div className="relative w-10 h-10 overflow-hidden">
          {/* 普通状态图标 */}
          <div
            className="absolute inset-0"
            style={{
              opacity: isActive ? 0 : 1,
              transition: "opacity 180ms cubic-bezier(0.25, 0.1, 0.25, 1), transform 180ms cubic-bezier(0.25, 0.1, 0.25, 1)",
              transform: isActive ? "scale(0.92)" : "scale(1)",
              willChange: "opacity, transform"
            }}
          >
            <img
              src={icon.src}
              alt={`${id} icon`}
              width={40}
              height={40}
              style={{ width: '40px', height: '40px' }}
              className="select-none"
              draggable="false"
            />
          </div>
          {/* 激活状态图标 */}
          <div
            className="absolute inset-0"
            style={{
              opacity: isActive ? 1 : 0,
              transition: "opacity 180ms cubic-bezier(0.25, 0.1, 0.25, 1), transform 180ms cubic-bezier(0.25, 0.1, 0.25, 1)",
              transform: isActive ? "scale(1)" : "scale(1.08)",
              willChange: "opacity, transform"
            }}
          >
            <img
              src={iconPressed.src}
              alt={`${id} active icon`}
              width={40}
              height={40}
              style={{ width: '40px', height: '40px' }}
              className="select-none"
              draggable="false"
            />
          </div>
        </div>
      </Button>
    </Tooltip>
  );
});

// 导航菜单组件
const NavigationMenu = () => {
  return (
    <>
      {/* 主要菜单 */}
      <div style={{ marginTop: "150px" }} className="flex flex-col items-center">
        <NavButton
          id="home"
          icon={homeIcon}
          iconPressed={homeIconPressed}
        />
        <NavButton
          id="discover"
          icon={discoverIcon}
          iconPressed={discoverIconPressed}
          marginTop={36}
        />
        <NavButton
          id="library"
          icon={libraryIcon}
          iconPressed={libraryIconPressed}
          marginTop={36}
        />
      </div>

      {/* 次要菜单 */}
      <div style={{ marginTop: "150px" }} className="flex flex-col items-center">
        <NavButton
          id="player"
          icon={playerIcon}
          iconPressed={playerIconPressed}
        />
        <NavButton
          id="settings"
          icon={settingsIcon}
          iconPressed={settingsIconPressed}
          marginTop={36}
        />
      </div>
    </>
  );
};

// PageContent 组件
const PageContent = () => {
  const { getCurrentTitle, getCurrentPage, isPlayerActive, activeMenu } = useContext(MenuContext);
  const cardRef = useRef(null);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const cardBodyRef = useRef(null);
  const headerRef = useRef(null);
  const isInitialRender = useRef(true);
  const prevPlayerActive = useRef(isPlayerActive);
  const prevActiveMenu = useRef(activeMenu);

  // 获取页面索引，用于确定动画方向
  const getPageIndex = (menu) => {
    const indices = { home: 0, discover: 1, library: 2, settings: 3, player: 4 };
    return indices[menu] || 0;
  };

  // 使用 GSAP 实现动画效果
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      prevPlayerActive.current = isPlayerActive;
      prevActiveMenu.current = activeMenu;
      return;
    }

    if (!cardRef.current || !contentRef.current || !cardBodyRef.current) return;

    const card = cardRef.current;
    const content = contentRef.current;
    const cardBody = cardBodyRef.current;
    const header = headerRef.current;

    // 取消所有正在进行的动画
    gsap.killTweensOf([card, content, header]);

    // 动画开始前，临时隐藏滚动条
    const originalOverflow = cardBody.style.overflow;
    cardBody.style.overflow = "hidden";

    // 从普通状态到播放器状态 (100% -> 70%)
    if (isPlayerActive && !prevPlayerActive.current) {
      console.log("开始播放器模式动画");

      // 设置变换原点为右侧
      gsap.set(card, { transformOrigin: "right center", width: "100%" });

      // 使用时间轴实现连贯动画
      const tl = gsap.timeline({
        onComplete: () => {
          console.log("播放器动画完成");
          cardBody.style.overflow = originalOverflow;
        }
      });

      // 单阶段动画：直接到70%
      tl.to(card, {
        width: "70%",
        duration: 1,
        ease: "back.out(1)",
        clearProps: "transform"
      });

      // 标题和内容动画同步
      tl.to([header, content], {
        scale: 0.97,
        x: -5,
        opacity: 0.95,
        duration: 0.55,
        ease: "power3.out"
      }, 0);
    }
    // 从播放器状态到普通状态 (70% -> 100%)
    else if (!isPlayerActive && prevPlayerActive.current) {
      // 设置变换原点为右侧
      gsap.set(card, { transformOrigin: "right center", width: "70%" });

      // 使用时间轴实现连贯动画
      const tl = gsap.timeline({
        onComplete: () => {
          cardBody.style.overflow = originalOverflow;
        }
      });

      // 单阶段动画 - 直接到100%
      tl.to(card, {
        width: "100%",
        duration: 0.95,
        ease: "expo.out",
        clearProps: "transform"
      });

      // 标题和内容动画同步
      tl.to([header, content], {
        scale: 1,
        x: 0,
        opacity: 1,
        duration: 0.65,
        ease: "power3.out"
      }, 0);
    }
    // 页面切换动画
    else if (activeMenu !== prevActiveMenu.current) {
      const currentIndex = getPageIndex(activeMenu);
      const previousIndex = getPageIndex(prevActiveMenu.current);
      const direction = currentIndex > previousIndex ? 1 : -1;

      // 使用时间轴管理页面切换动画
      const tl = gsap.timeline({
        onComplete: () => {
          cardBody.style.overflow = originalOverflow;
        }
      });

      // 旧内容淡出
      tl.to(content, {
        opacity: 0,
        x: -30 * direction,
        duration: 0.3,
        ease: "power1.out"
      }, 0);

      // 标题动画 - 与内容同步
      tl.to(header, {
        opacity: 0.7,
        x: -5 * direction,
        duration: 0.3,
        ease: "power1.out"
      }, 0);

      // 新内容淡入和标题恢复
      tl.fromTo(content,
        { opacity: 0, x: 30 * direction },
        {
          opacity: 1,
          x: 0,
          duration: 0.3,
          ease: "power1.out"
        },
        "+=0.05"
      );

      // 标题恢复
      tl.to(header, {
        opacity: 1,
        x: 0,
        duration: 0.3,
        ease: "power1.out"
      }, "-=0.3");
    }

    // 更新前一个状态
    prevPlayerActive.current = isPlayerActive;
    prevActiveMenu.current = activeMenu;

  }, [isPlayerActive, activeMenu]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex justify-end overflow-hidden"
    >
      <Card
        ref={cardRef}
        className="bg-white overflow-hidden shadow-sm"
        style={{
          height: "100%",
          width: isPlayerActive ? "70%" : "100%",
          transformOrigin: "right center",
          borderRadius: "12px",
          overflow: "hidden"
        }}
      >
        <CardHeader ref={headerRef} className="overflow-hidden">
          <h1 className="text-4xl" style={{ fontWeight: 'bold' }}>
            {getCurrentTitle()}
          </h1>
        </CardHeader>

        <CardBody
          ref={cardBodyRef}
          className="overflow-y-auto overflow-x-hidden" 
          style={{ WebkitOverflowScrolling: "touch", overflowX: "hidden" }} 
        >
          <div
            ref={contentRef}
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: "center top"
            }}
          >
            {getCurrentPage()}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default function Home() {
  const router = useRouter();
  // 头像相关状态
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("http://8.217.105.136:5244/d/NicePlayMusic/avatars/avatar1.jpg");
  const [tempAvatarUrl, setTempAvatarUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const gradientRefs = useRef([]);

  // 处理修改头像点击事件
  const handleChangeAvatar = useCallback(() => {
    setTempAvatarUrl(avatarPreview);
    setIsAvatarModalOpen(true);
  }, [avatarPreview]);

  // 处理选择文件
  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      // 验证文件类型
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        // 创建文件预览
        const reader = new FileReader();
        reader.onload = (e) => {
          setTempAvatarUrl(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        // 显示错误提示
        addToast({
          title: "格式不支持",
          description: "请选择JPG或PNG格式的图片",
          color: "danger",
          timeout: 3000,
        });
      }
    }
  }, []);

  // 保存头像
  const saveAvatar = useCallback(() => {
    if (tempAvatarUrl && tempAvatarUrl !== avatarPreview) {
      setIsUploading(true);
      
      // 模拟上传延迟
      setTimeout(() => {
        setAvatarPreview(tempAvatarUrl);
        setIsUploading(false);
        setIsAvatarModalOpen(false);
        
        // 显示成功提示
        addToast({
          title: "头像已更新",
          description: "您的头像已成功保存",
          color: "success",
          timeout: 3000,
        });
      }, 800);
    } else {
      setIsAvatarModalOpen(false);
    }
  }, [tempAvatarUrl, avatarPreview]);

  // 处理退出登录点击事件
  const handleLogout = useCallback(() => {
    // 清除登录Cookie
    document.cookie = "isLogin=0; path=/; max-age=0";
    
    // 显示退出成功提示
    addToast({
      title: "退出成功",
      description: "您已成功退出登录",
      color: "success",
      timeout: 3000,
      shouldShowTimeoutProgress: true,
    });
    
    // 重定向到登录页面
    router.push('/login');
  }, [router]);

  useEffect(() => {
    // 预加载图标
    const preloadImages = [
      homeIcon.src, homeIconPressed.src,
      discoverIcon.src, discoverIconPressed.src,
      libraryIcon.src, libraryIconPressed.src,
      playerIcon.src, playerIconPressed.src,
      settingsIcon.src, settingsIconPressed.src
    ];

    preloadImages.forEach(src => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    // 登录状态检查
    const isLogin = document.cookie.split('; ').find(row => row.startsWith('isLogin='));
    if (!isLogin || isLogin.split('=')[1] !== '1') {
      console.log("未登录，跳转到登录页面");
      
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

  useEffect(() => {
    gradientRefs.current.forEach((ref, index) => {
      gsap.to(ref, {
        duration: 10,
        rotate: `+=${Math.random() * 360}`,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    });
  }, []);

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

  return (
    <div className="relative flex items-center justify-center w-full h-screen overflow-hidden bg-gray-50">
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

      {/* 内容图层 */}
      <div className="relative z-10 flex w-full h-full">
        {/* 使用MenuProvider包装整个UI */}
        <MenuProvider>
          {/* 左侧导航栏 */}
          <div style={{
            width: "220px",
            height: "100%",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* 头像带下拉菜单 */}
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    style={{ width: "60px", height: "60px", marginTop: "60px", cursor: "pointer" }}
                    isBordered
                    radius="md"
                    src={avatarPreview}
                    className="transition-transform hover:scale-105"
                  />
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="用户操作"
                  variant="bordered"
                >
                  <DropdownItem 
                    key="profile" 
                    description="更换您的个人头像"
                    onPress={handleChangeAvatar}
                  >
                    修改头像
                  </DropdownItem>
                  <DropdownItem 
                    key="logout" 
                    className="text-danger" 
                    color="danger" 
                    description="退出您的账户"
                    onPress={handleLogout}
                  >
                    退出登录
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              {/* 导航菜单 */}
              <NavigationMenu />
            </div>
          </div>

          {/* 右侧内容区域 */}
          <div className="flex-1 overflow-hidden" style={{
            paddingTop: "16px",
            paddingRight: "16px",
            paddingBottom: "16px",
            paddingLeft: "0",
            height: "100%",
            display: "flex",
          }}>
            <PageContent />
          </div>
        </MenuProvider>
      </div>

      <Modal 
        isOpen={isAvatarModalOpen} 
        onClose={() => setIsAvatarModalOpen(false)}
        size="md"
        hideCloseButton
      >
        <ModalContent>
          <ModalHeader className="border-b border-gray-200">
            <h4 className="text-base font-medium text-gray-800">头像设置</h4>
          </ModalHeader>
          <ModalBody className="py-6">
            <div className="space-y-6">
              {/* 隐藏的文件输入框 */}
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileSelect}
              />
              
              {/* 当前头像预览 */}
              <div className="flex flex-col items-center gap-4">
                <div 
                  className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Avatar
                    src={tempAvatarUrl || avatarPreview}
                    className="w-full h-full"
                    alt="头像预览"
                  />
                </div>
                
                <Button
                  color="primary"
                  variant="light"
                  size="sm"
                  onPress={() => fileInputRef.current?.click()}
                >
                  选择新头像
                </Button>
                
                <div className="text-sm text-gray-500 text-center">
                  支持上传JPG、PNG格式图片，文件大小不超过5MB。
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="border-t border-gray-200">
            <Button
              color="default"
              variant="light"
              onPress={() => setIsAvatarModalOpen(false)}
            >
              取消
            </Button>
            <Button
              color="primary"
              isLoading={isUploading}
              isDisabled={isUploading || !tempAvatarUrl || tempAvatarUrl === avatarPreview}
              onPress={saveAvatar}
            >
              {isUploading ? "保存中..." : "保存更改"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
