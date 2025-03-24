import { Card, CardHeader, CardFooter, Image, Button } from "@heroui/react";
import { VerticalCarousel } from "@/components/banner/VerticalCarousel";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const defaultItems = [
    {
        id: 1,
        title: '额尔古纳的日出',
        description: '走向地平线的那抹橙色，向生而行',
        imageUrl: "http://8.217.105.136:5244/d/NicePlayMusic/banner/1.jpg",
        musicName: '额尔古纳 - 陈鸿宇',
        lyric: '饮别了春深 又别过时年'
    },
    {
        id: 2,
        title: '山海',
        description: '行走山间，心向大海',
        imageUrl: "http://8.217.105.136:5244/d/NicePlayMusic/banner/2.jpg",
        musicName: '山海 - 草东没有派对',
        lyric: '我看着 天真的我自己'
    },
    {
        id: 3,
        title: '穿越光年',
        description: '在宇宙尘埃中寻找永恒的共振',
        imageUrl: "http://8.217.105.136:5244/d/NicePlayMusic/banner/3.jpg",
        musicName: '光年之外 - 邓紫棋',
        lyric: '缘分让我们相遇乱世以外'
    },
    {
        id: 4,
        title: '火照黑云',
        description: '不披上这件衣裳，众生怎知我尘缘已断，金海尽干？',
        imageUrl: "http://8.217.105.136:5244/d/NicePlayMusic/banner/4.jpg",
        musicName: '看见 - 陈鸿宇',
        lyric: '一生功名轻如烟 最苦人无再少年'
    },
];

export default function HomePage() {
    // 使用state跟踪当前显示的轮播项
    const [currentItem, setCurrentItem] = useState(defaultItems[0]);
    // 添加方向状态和下一个项的状态
    const [direction, setDirection] = useState(0);
    const [nextItem, setNextItem] = useState(null);

    // 创建引用来访问DOM元素
    const headerRef = useRef(null);
    const footerContentRef = useRef(null);

    // 获取目标索引的轮播项
    const getItemByIndex = (index) => defaultItems[index];

    // 处理轮播切换
    const handleSlideChange = (index) => {
        // 只记录索引变化，不立即更新UI
    };

    // 处理动画开始
    const handleAnimationStart = (direction, targetIndex) => {
        if (!headerRef.current || !footerContentRef.current) return;

        // 设置方向
        setDirection(direction);

        // 设置下一个要显示的项
        const target = getItemByIndex(targetIndex);
        setNextItem(target);

        // 使用GSAP动画设置文字淡出和淡入效果
        const timeline = gsap.timeline();

        // 计算方向相关的位移
        const exitY = direction > 0 ? -30 : 30;
        const enterY = direction > 0 ? 30 : -30;

        // 淡出当前内容
        timeline.to([headerRef.current, footerContentRef.current], {
            opacity: 0,
            y: exitY,
            duration: 0.35,
            ease: "power1.in",
            onComplete: () => {
                // 在淡出完成后更新内容
                setCurrentItem(target);

                // 在内容更新后，设置新内容的进入动画
                gsap.fromTo(
                    [headerRef.current, footerContentRef.current],
                    { opacity: 0, y: enterY },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.45,
                        ease: "power2.out",
                        clearProps: "all" // 确保动画后清除内联样式
                    }
                );
            }
        });
    };

    return (
        <div className="ml-4">
            <div>
                <Card isFooterBlurred className="w-[55%] h-[280px] col-span-12 sm:col-span-7">
                    <CardHeader ref={headerRef} className="absolute z-10 top-1 flex-col items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold text-xl">
                            {currentItem.title}
                        </p>
                        <h4 className="text-white/90 font-medium text-2xl filter drop-shadow-lg">
                            {currentItem.description}
                        </h4>
                    </CardHeader>

                    <VerticalCarousel
                        removeWrapper
                        alt="Relaxing app background"
                        className="z-0 w-full h-full object-cover"
                        items={defaultItems}
                        onSlideChange={handleSlideChange}
                        onAnimationStart={handleAnimationStart}
                    />

                    <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                        <div className="flex flex-grow gap-2 items-center">
                            <div ref={footerContentRef} className="flex flex-col">
                                <p className="text-tiny text-white/60 text-xl">
                                    {currentItem.musicName}
                                </p>
                                <p className="text-tiny text-white/60 text-lg">
                                    {currentItem.lyric}
                                </p>
                            </div>
                        </div>
                        <Button radius="full" size="sm">
                            立即播放
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}