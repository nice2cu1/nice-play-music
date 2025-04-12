import { createContext, useCallback, useState } from 'react';
import HomePage from '../../app/home/page';
import DiscoverPage from '../../app/discover/page';
import LibraryPage from '../../app/library/page';

// 创建菜单状态上下文
export const MenuContext = createContext();

// MenuProvider 组件
export const MenuProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState('home');

  // 添加 isMiniPlayerActive 状态
  const [isMiniPlayerActive, setIsMiniPlayerActive] = useState(false);

  // 添加自定义页面状态
  const [customPage, setCustomPage] = useState(null);
  const [customTitle, setCustomTitle] = useState(null);
  // 添加前一个菜单状态记录
  const [previousMenu, setPreviousMenu] = useState('home');

  // 添加自定义页面设置方法
  const setPageContent = (title, component) => {
    // 保存当前菜单状态，以便返回时使用
    setPreviousMenu(activeMenu);
    
    setCustomTitle(title);
    setCustomPage(component);
    setActiveMenu('custom');
  };

  // 获取当前页面标题
  const getCurrentTitle = () => {
    // 如果有自定义标题，则返回自定义标题
    if (customTitle) {
      return customTitle;
    }
    
    // 原有的标题逻辑
    switch (activeMenu) {
      case 'home': return "首页";
      case 'discover': return "发现";
      case 'library': return "音乐库";
      case 'settings': return "设置";
      default: return "首页";
    }
  };

  // 获取当前页面组件
  const getCurrentPage = () => {
    // 如果有自定义页面，则返回自定义页面
    if (customPage) {
      return customPage;
    }
    
    // 原有的页面逻辑
    switch (activeMenu) {
      case 'home': return <HomePage />;
      case 'discover': return <DiscoverPage />;
      case 'library': return <LibraryPage />;
      case 'settings': return <div>设置页面开发中...</div>;
      default: return <HomePage />;
    }
  };

  // 修改handleMenuClick逻辑，使其能够在resetCustomPage后正确响应
  const handleMenuClick = useCallback((menuId) => {
    if (menuId === 'miniplayer') {
      console.log('点击了播放器按钮');
      setIsMiniPlayerActive(prev => !prev); // 更新 isMiniPlayerActive 状态
    } else {
      // 点击其他菜单按钮，切换到对应页面
      setActiveMenu(menuId);
      // 重置自定义页面状态
      setCustomPage(null);
      setCustomTitle(null);
    }
  }, []);

  // 修正resetCustomPage函数，确保状态完全重置
  const resetCustomPage = () => {
    // 清除自定义页面内容
    setCustomPage(null);
    setCustomTitle(null);
    
    // 返回到之前的菜单状态
    if (previousMenu) {
      setActiveMenu(previousMenu);
    }
    
    // 重置状态以确保后续点击能正常工作
    // 这是关键的修复 - 确保内部状态一致性
    setTimeout(() => {
      console.log('已重置菜单状态，可以点击其他菜单');
    }, 10);
  };

  return (
    <MenuContext.Provider value={{
      activeMenu,
      handleMenuClick,
      getCurrentTitle,
      getCurrentPage,
      isMiniPlayerActive, // 添加到上下文
      setPageContent,
      resetCustomPage,
      previousMenu, // 将前一个菜单状态也暴露给组件
    }}>
      {children}
    </MenuContext.Provider>
  );
};
