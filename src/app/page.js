'use client';

import { addToast } from "@heroui/react";
import { useRouter } from 'next/navigation';
import { useState, useRef, useCallback, useEffect } from 'react';
import useUserStore from '../store/useUserStore';
import api from '../axios/api';
import { animateText } from "@/utils/textAnimation";

// 导入组件
import { MenuProvider } from '../components/context/MenuContext';
import NavigationMenu from '../components/navigation/NavigationMenu';
import PageContent from '../components/layout/PageContent';
import GradientBackground from '../components/background/GradientBackground';
import AvatarDropdown from '../components/user/AvatarDropdown';
import AvatarModal from '../components/user/AvatarModal';

// 预加载图标
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

export default function Home() {
  const router = useRouter();

  // 使用状态管理获取用户信息
  const { user, isLoggedIn } = useUserStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // 头像相关状态
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // 处理修改头像点击事件
  const handleChangeAvatar = useCallback(() => {
    setTempAvatarUrl(user?.avatar);
    setIsAvatarModalOpen(true);
  }, [user?.avatar]);

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
    if (tempAvatarUrl && tempAvatarUrl !== user?.avatar) {
      setIsUploading(true);

      // 模拟上传延迟
      setTimeout(() => {
        // 更新状态管理中的头像
        useUserStore.getState().updateAvatar(tempAvatarUrl);

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
  }, [tempAvatarUrl, user?.avatar]);

  // 处理退出登录点击事件
  const handleLogout = useCallback(() => {
    // 调用API中的注销方法
    api.user.logout();

    // 显示提示并重定向
    addToast({ title: "退出成功", color: "success", timeout: 3000 });
    router.push('/login');
  }, [router]);

  // 预加载图标
  useEffect(() => {
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

  // 检查登录状态
  useEffect(() => {
    // 确认store中有用户数据且cookie存在
    const hasUser = useUserStore.getState().user !== null;
    const hasCookie = document.cookie.includes('isLogin=1');

    // 如果未认证，重定向到登录页
    if (!(hasUser && hasCookie)) {
      // 清除cookie并重定向
      document.cookie = "isLogin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.replace('/login');
      addToast({ title: "请先登录", color: "warning", timeout: 3000 });
    }

    // 完成认证检查
    setIsCheckingAuth(false);
  }, [router]);

  // 添加文本动画效果
  useEffect(() => {
    // 确保在用户登录后应用文本动画
    if (isLoggedIn && !isCheckingAuth) {
      // 给DOM足够的时间完全渲染
      const timer = setTimeout(() => {
        console.log('触发主页文本动画');
        animateText();
      }, 300); // 增加延迟确保DOM已渲染
      
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, isCheckingAuth]);

  // 如果正在检查认证状态，显示加载界面
  if (isCheckingAuth) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="text-white text-2xl">
          正在加载...
        </div>
      </div>
    );
  }

  // 如果未登录，不显示任何内容
  if (!isLoggedIn) {
    return null;
  }

  // 只有已登录才渲染完整界面
  return (
    <div className="relative flex items-center justify-center w-full h-screen overflow-hidden bg-black">
      {/* 背景 */}
      <GradientBackground />

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
              <AvatarDropdown
                avatarUrl={user?.avatar}
                onChangeAvatar={handleChangeAvatar}
                onLogout={handleLogout}
              />

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

      {/* 头像编辑模态框 */}
      <AvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        avatarPreview={user?.avatar}
        tempAvatarUrl={tempAvatarUrl}
        isUploading={isUploading}
        onSave={saveAvatar}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
}
