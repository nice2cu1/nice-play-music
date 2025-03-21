import { Card, CardHeader, CardBody } from "@heroui/react";
import { useContext, useEffect, useRef } from 'react';
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
        className="bg-white overflow-hidden shadow-sm"
        style={{
          height: "100%",
          width: isPlayerActive ? "70%" : "100%",
          transformOrigin: "right center",
          borderRadius: "12px",
          overflow: "hidden",
          overflowX: "hidden"
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
