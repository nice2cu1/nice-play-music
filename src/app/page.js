'use client';

import { addToast } from "@heroui/react";
import { useRouter } from 'next/navigation';
import { useState, useRef, useCallback, useEffect } from 'react';
import useUserStore from '../store/useUserStore';
import api from '../axios/api';


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

      try {
        // 从Base64字符串中提取文件数据
        const base64Data = tempAvatarUrl.split(',')[1];
        const binaryData = atob(base64Data);
        const arrayBuffer = new ArrayBuffer(binaryData.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < binaryData.length; i++) {
          uint8Array[i] = binaryData.charCodeAt(i);
        }

        const blob = new Blob([uint8Array]);

        // 确定文件类型
        const fileType = tempAvatarUrl.startsWith('data:image/png') ? 'png' : 'jpg';

        // 计算文件内容的哈希值
        crypto.subtle.digest('SHA-256', arrayBuffer)
          .then(hashBuffer => {
            // 将哈希值转换为十六进制字符串
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            // 使用哈希值作为文件名
            const filename = `${hashHex}.${fileType}`;

            // 调用上传API
            return api.uploadAvatar(blob, filename);
          })
          .then(response => {
            // 更新状态管理中的头像
            useUserStore.getState().updateAvatar(tempAvatarUrl);

            setIsUploading(false);
            setIsAvatarModalOpen(false);

            // 显示成功提示
            addToast({
              title: "头像已更新",
              description: "您的头像已成功上传并保存",
              color: "success",
              timeout: 3000,
            });
          })
          .catch(error => {
            console.error('头像上传失败:', error);
            setIsUploading(false);

            // 显示错误提示
            addToast({
              title: "上传失败",
              description: "头像上传过程中发生错误，请稍后重试",
              color: "danger",
              timeout: 3000,
            });
          });
      } catch (error) {
        console.error('处理头像数据时出错:', error);
        setIsUploading(false);

        addToast({
          title: "处理失败",
          description: "处理头像数据时出错，请重新选择图片",
          color: "danger",
          timeout: 3000,
        });
      }
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
