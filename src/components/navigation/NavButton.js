import { Button, Tooltip } from "@heroui/react";
import { memo, useCallback, useContext } from 'react';
import { MenuContext } from '../context/MenuContext';

// NavButton 组件
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

export default NavButton;
