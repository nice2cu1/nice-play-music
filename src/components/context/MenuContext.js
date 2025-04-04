import { createContext, useCallback, useState } from 'react';
import HomePage from '../../app/home/page';
import DiscoverPage from '../../app/discover/page';
import LibraryPage from '../../app/library/page';

// 创建菜单状态上下文
export const MenuContext = createContext();

// MenuProvider 组件
export const MenuProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState('home');
  const [isPlayerActive, setIsPlayerActive] = useState(false);

  // 获取当前页面标题
  const getCurrentTitle = () => {
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
