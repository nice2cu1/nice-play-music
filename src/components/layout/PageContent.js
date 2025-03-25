import { Card, CardHeader, CardBody, Input } from "@heroui/react";
import { useContext, useEffect, useRef, useState } from 'react';
import { gsap } from "gsap";
import { MenuContext } from '../context/MenuContext';

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

  // 添加搜索状态
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  // 处理搜索输入变化
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // 这里可以添加搜索逻辑或者防抖处理
  };

  // 处理搜索提交
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // 执行搜索操作
    console.log("搜索内容:", searchQuery);
  };

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

    // 始终隐藏横向滚动条
    card.style.overflowX = "hidden";
    cardBody.style.overflowX = "hidden";
    content.style.overflowX = "hidden";

    // 取消所有正在进行的动画
    gsap.killTweensOf([card, content, header]);

    const originalOverflow = cardBody.style.overflowY;
    cardBody.style.overflowY = "hidden";

    // 从普通状态到播放器状态 (100% -> 70%)
    if (isPlayerActive && !prevPlayerActive.current) {
      console.log("开始播放器模式动画");

      // 设置变换原点为右侧
      gsap.set(card, { transformOrigin: "right center", width: "100%" });

      // 使用时间轴实现连贯动画
      const tl = gsap.timeline({
        onComplete: () => {
          console.log("播放器动画完成");
          cardBody.style.overflowY = originalOverflow;
          card.style.overflowX = "hidden";
          cardBody.style.overflowX = "hidden";
          content.style.overflowX = "hidden";
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
          cardBody.style.overflowY = originalOverflow;
          // 确保动画完成后仍然隐藏横向滚动条
          card.style.overflowX = "hidden";
          cardBody.style.overflowX = "hidden";
          content.style.overflowX = "hidden";
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
          cardBody.style.overflowY = originalOverflow;
          card.style.overflowX = "hidden";
          cardBody.style.overflowX = "hidden";
          content.style.overflowX = "hidden";
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

  // 确保组件挂载后立即设置所有层级的overflow-x为hidden
  useEffect(() => {
    if (cardRef.current && contentRef.current && cardBodyRef.current) {
      cardRef.current.style.overflowX = "hidden";
      cardBodyRef.current.style.overflowX = "hidden";
      contentRef.current.style.overflowX = "hidden";
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex justify-end overflow-hidden"
    >
      <Card
        ref={cardRef}
        className="bg-[#FAFAFA] overflow-hidden shadow-sm"
        style={{
          height: "100%",
          width: isPlayerActive ? "70%" : "100%",
          transformOrigin: "right center",
          borderRadius: "12px",
          overflow: "hidden",
          overflowX: "hidden"
        }}
      >
        <CardHeader
          ref={headerRef}
          className="overflow-hidden mt-2 flex flex-row items-center border-none"
          style={{ background: 'transparent' }}
        >
          <h1 className="text-4xl ml-8 text-common" style={{ fontWeight: 'bold' }}>
            {getCurrentTitle()}
          </h1>

          {/* 搜索框部分*/}
          <form
            onSubmit={handleSearchSubmit}
            className="relative ml-auto mr-4 max-w-[220px]" 
          >
            <Input
              ref={searchInputRef}
              type="search"
              variant="bordered"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="搜索音乐、歌手或专辑..."
              className="bg-gray-100 dark:bg-gray-800 rounded-full border-0 w-full"
              isClearable
              size="lg"
              startContent={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="#000" d="M12 4a8 8 0 1 0 0 16a8 8 0 0 0 0-16M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12" /></g></svg>
              }
              classNames={{
                inputWrapper: "h-9 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700",
                input: "text-sm"
              }}
              onClear={() => setSearchQuery('')}
            />
          </form>
        </CardHeader>

        <CardBody
          ref={cardBodyRef}
          className="overflow-y-auto overflow-x-hidden"
          style={{
            WebkitOverflowScrolling: "touch",
            overflowX: "hidden",
            maxWidth: "100%"
          }}
        >
          <div
            ref={contentRef}
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: "center top",
              overflowX: "hidden",
              maxWidth: "100%" // 限制最大宽度
            }}
          >
            {getCurrentPage()}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PageContent;
