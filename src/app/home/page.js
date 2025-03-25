import { Card, CardHeader, CardFooter, Button } from "@heroui/react";
import { VerticalCarousel } from "@/components/banner/VerticalCarousel";
import { useState, useRef } from "react";
import { gsap } from "gsap";

import aurthorIcon from "@/assets/icons/lights/author.svg";
import rankUP from "@/assets/icons/lights/rank_up.svg";
import rankDown from "@/assets/icons/lights/rank_down.svg";

// 轮播数据
const bannerItems = [
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

// 排行榜数据
const rankingItems = [
    { id: 1, title: "唯一", artist: "G.E.M 邓紫棋", songId: 1234, img: "http://8.217.105.136:5244/d/NicePlayMusic/rank/1.png" },
    { id: 2, title: "我怀念的", artist: "孙燕姿", songId: 12345, img: "http://8.217.105.136:5244/d/NicePlayMusic/rank/2.png" },
    { id: 3, title: "红色高跟鞋", artist: "蔡健雅", songId: 12346, img: "http://8.217.105.136:5244/d/NicePlayMusic/rank/3.png" },
];

// 推荐歌曲数据
const recommendedSongs = [
    { id: 1, title: "见到你真开心！", artist: "小鷹", songId: 2001, img: "http://8.217.105.136:5244/d/NicePlayMusic/recommend/songs/1.jpg" },
    { id: 2, title: "一点", artist: "Muyoi / Pezzi", songId: 2002, img: "http://8.217.105.136:5244/d/NicePlayMusic/recommend/songs/2.jpg" },
    { id: 3, title: "蓝莲花", artist: "许巍", songId: 2003, img: "http://8.217.105.136:5244/d/NicePlayMusic/recommend/songs/3.jpg" },
    { id: 4, title: "一万次悲伤", artist: "逃跑计划", songId: 2004, img: "http://8.217.105.136:5244/d/NicePlayMusic/recommend/songs/4.jpg" },
    { id: 5, title: "认真地老去", artist: "张希 / 曹方", songId: 2005, img: "http://8.217.105.136:5244/d/NicePlayMusic/recommend/songs/5.jpg" },
];

// 最近爱听歌单数据
const recentPlaylists = [
    { id: 1, title: "Synthwave合成器浪潮", tracks: 15, plays: 3420, img: "http://8.217.105.136:5244/d/NicePlayMusic/recently/1.jpg" },
    { id: 2, title: "华语民谣", tracks: 12, plays: 2850, img: "http://8.217.105.136:5244/d/NicePlayMusic/recently/2.jpg" },
    { id: 3, title: "宝岛台湾的温柔海风", tracks: 10, plays: 1752, img: "http://8.217.105.136:5244/d/NicePlayMusic/recently/3.jpg" },
    { id: 4, title: "沉溺于绮旷的荒芜之境 ", tracks: 14, plays: 2135, img: "http://8.217.105.136:5244/d/NicePlayMusic/recently/4.jpg" },
];

export default function HomePage() {
    // 使用state跟踪当前显示的轮播项
    const [currentItem, setCurrentItem] = useState(bannerItems[0]);
    // 方向状态用于动画
    const [direction, setDirection] = useState(0);

    // 创建引用来访问DOM元素
    const headerRef = useRef(null);
    const footerContentRef = useRef(null);

    // 获取目标索引的轮播项
    const getItemByIndex = (index) => bannerItems[index];

    // 处理动画开始
    const handleAnimationStart = (direction, targetIndex) => {
        if (!headerRef.current || !footerContentRef.current) return;

        // 设置方向
        setDirection(direction);

        // 获取下一个要显示的项
        const target = getItemByIndex(targetIndex);

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
        <div className="flex flex-col gap-4 pr-4">
            <div className="ml-8 flex gap-20">
                <Card isFooterBlurred className="w-[55%] h-[280px] col-span-12 sm:col-span-7 mt-2">
                    <CardHeader ref={headerRef} className="absolute z-10 top-1 flex-col items-start">
                        <p className="text-white/60 uppercase font-bold text-xl">
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
                        items={bannerItems}
                        onAnimationStart={handleAnimationStart}
                    />

                    <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                        <div className="flex flex-grow gap-2 items-center">
                            <div ref={footerContentRef} className="flex flex-col">
                                <p className="text-white text-xl">
                                    {currentItem.musicName}
                                </p>
                                <p className="text-white/60 text-lg">
                                    {currentItem.lyric}
                                </p>
                            </div>
                        </div>
                        <Button radius="full" size="sm">
                            立即播放
                        </Button>
                    </CardFooter>
                </Card>

                <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-2xl font-bold text-common">排行榜</h4>
                        <Button size="sm" variant="light" className="text-primary">
                            查看全部
                        </Button>
                    </div>
                    <div className="h-[250px] overflow-hidden p-2">
                        <div className="flex-col gap-0 pt-0 pb-1 flex-1">
                            <div className="w-full h-full flex flex-col justify-between">
                                {rankingItems.map((item, index) => (
                                    <Card
                                        key={item.id}
                                        isPressable
                                        
                                        className="flex items-center py-2 border-b border-gray-100 last:border-none transition-colors mb-1"
                                        classNames={{
                                            base: "shadow-none bg-transparent",
                                            body: "p-0 overflow-visible"
                                        }}
                                    >
                                        <div className="flex w-full items-center pl-1">
                                            <div className="w-12 h-12 mr-4 rounded-lg overflow-hidden relative shadow-sm flex-shrink-0">
                                                {/* 封面图片 */}
                                                <img
                                                    src={item.img}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className={`absolute bottom-0 right-0 w-5 h-5 flex items-center justify-center text-xs font-bold text-white ${index === 0 ? "bg-primary" :
                                                    index === 1 ? "bg-[#007BFF]" :
                                                        "bg-[#339AF0]"
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                            </div>

                                            <div className="flex-grow text-left">
                                                <p className="text-base font-medium text-common text-left">{item.title}</p>
                                                <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                                                    <img
                                                        src={aurthorIcon.src}
                                                        className="w-4 h-4 object-contain"
                                                    />
                                                    <p className="text-gray-500 text-sm">{item.artist}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center pr-2">
                                                <div className="flex items-center mr-3">
                                                    <div className="w-5 h-5 flex items-center justify-center">
                                                        {index === 0 && (
                                                            <img
                                                                src={rankUP.src}
                                                                width="20"
                                                                height="20"
                                                                className="object-contain"
                                                            />
                                                        )}
                                                        {index === 1 && (
                                                            <img
                                                                src={rankDown.src}
                                                                width="20"
                                                                height="20"
                                                                className="object-contain"
                                                            />
                                                        )}
                                                        {index === 2 && (
                                                            <div
                                                                className="w-4 h-1 bg-[#DADADA] rounded-full"
                                                            ></div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="ml-8 flex gap-20 mt-2">
                <div className="w-[55%]">
                    <div className="flex justify-between items-center mb-1">
                        <h4 className="text-2xl font-bold text-common">为你推荐</h4>
                        <Button size="sm" variant="light" className="text-primary">
                            更多推荐
                        </Button>
                    </div>
                    <div className="h-[300px] overflow-hidden p-1">
                        <div className="flex-col pt-0 pb-0 flex-1">
                            <div className="w-full flex flex-col gap-0">
                                {recommendedSongs.map((song) => (
                                    <Card
                                        key={song.id}
                                        className="flex items-center py-2 transition-colors h-[52px] mb-1 mt-1"
                                        classNames={{
                                            base: "shadow-none bg-transparent",
                                            body: "p-0 overflow-visible flex-1 w-full"
                                        }}
                                    >
                                        <div className="flex w-full items-center pl-1">
                                            <div className="w-10 h-10 mr-3 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                                <img
                                                    src={song.img}
                                                    alt={song.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex-grow text-left">
                                                <p className="text-base font-medium text-common text-left">{song.title}</p>
                                                <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                                                    <img
                                                        src={aurthorIcon.src}
                                                        className="w-4 h-4 object-contain"
                                                    />
                                                    <p className="text-gray-500">{song.artist}</p>
                                                </div>
                                            </div>
                                            <Button size="sm" radius="full" className="mr-1">
                                                播放
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 最近爱听*/}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                        <h4 className="text-2xl font-bold text-common">最近爱听</h4>
                        <Button size="sm" variant="light" className="text-primary">
                            查看全部
                        </Button>
                    </div>
                    <div className="h-[300px] overflow-hidden p-2">
                        <div className="flex-col pt-0 pb-0 flex-1">
                            <div className="w-full grid grid-cols-2 gap-x-3 gap-y-3 h-full">
                                {recentPlaylists.map((playlist) => (
                                    <div key={playlist.id} className="flex flex-col">
                                        <div className="w-full h-[100px] rounded-lg overflow-hidden mb-1 shadow-sm relative group cursor-pointer">
                                            <img
                                                src={playlist.img}
                                                alt={playlist.title}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                                                <Button
                                                    radius="full"
                                                    size="sm"
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                >
                                                    播放
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-common truncate">{playlist.title}</p>
                                        <p className="text-xs text-gray-500 truncate">{playlist.tracks}首歌曲 • {playlist.plays.toLocaleString()}次播放</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}