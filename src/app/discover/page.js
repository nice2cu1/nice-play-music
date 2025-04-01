'use client';

import { Image, ScrollShadow } from '@heroui/react';
import { useEffect, useState } from 'react';
import { useTextAnimation } from '@/utils/textAnimation';

export default function DiscoverPage() {
    // 使用state跟踪组件是否已挂载
    const [mounted, setMounted] = useState(false);

    // 使用文本动画hook
    const [contentRef, triggerAnimation, resetAnimation] = useTextAnimation({
        duration: 0.6,
        distance: 15,
        ease: 'power2.out',
        onComplete: () => { }
    });

    // 当组件挂载后设置mounted状态
    useEffect(() => {
        setMounted(true);
    }, []);

    // 在DOM完全加载后触发动画
    useEffect(() => {
        if (mounted) {
            // 给DOM足够的时间渲染，然后触发动画
            const timer = setTimeout(() => {
                triggerAnimation();
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [mounted, triggerAnimation]);

    // Apple Music 推荐歌单数据
    const appleMusicPlaylists = [
        {
            id: 'am1',
            title: 'Happy Hits',
            coverUrl: 'http://8.217.105.136:5244/d/NicePlayMusic/recommend/playlist/applemusic/1.jpg',
            description: 'by Apple Music'
        },
        {
            id: 'am2',
            title: 'Mandopop',
            coverUrl: 'http://8.217.105.136:5244/d/NicePlayMusic/recommend/playlist/applemusic/2.jpg',
            description: 'by Apple Music'
        },
        {
            id: 'am3',
            title: 'Heartbreak Pop',
            coverUrl: 'http://8.217.105.136:5244/d/NicePlayMusic/recommend/playlist/applemusic/3.jpg',
            description: 'by Apple Music'
        },
        {
            id: 'am4',
            title: 'Festival Bangers',
            coverUrl: 'http://8.217.105.136:5244/d/NicePlayMusic/recommend/playlist/applemusic/4.jpg',
            description: 'by Apple Music'
        },
        {
            id: 'am5',
            title: 'Bedtime Beats',
            coverUrl: 'http://8.217.105.136:5244/d/NicePlayMusic/recommend/playlist/applemusic/5.jpg',
            description: 'by Apple Music'
        },
    ];

    const recommendPlaylists = [
        {
            id: 'r1',
            title: "干嘛听苦情歌 以为有多浪漫",
            coverUrl: "http://8.217.105.136:5244/d/NicePlayMusic/recommend/playlist/1.jpg",
            description: "沉迷虚伪世界 清醒活在其中"
        },
        {
            id: 'r2',
            title: "温暖纯净 浪漫到入骨的温柔",
            coverUrl: "http://8.217.105.136:5244/d/NicePlayMusic/recommend/playlist/2.jpg",
            description: "精选推荐"
        },
        {
            id: 'r3',
            title: "好心情营业ing✨笑迎生活点滴温暖",
            coverUrl: "http://8.217.105.136:5244/d/NicePlayMusic/recommend/playlist/3.jpg",
            description: "精选推荐"
        },
        {
            id: 'r4',
            title: "愿你独立且清醒，又酷又温柔",
            coverUrl: "http://8.217.105.136:5244/d/NicePlayMusic/recommend/playlist/4.jpg",
            description: "精选推荐"
        },
        {
            id: 'r5',
            title: "孤独与守望者的悲鸣",
            coverUrl: "http://8.217.105.136:5244/d/NicePlayMusic/recommend/playlist/5.jpg",
            description: "精选推荐"
        },
        {
            id: 'r6',
            title: "愿你独立且清醒，又酷又温柔",
            coverUrl: "http://8.217.105.136:5244/d/NicePlayMusic/recommend/playlist/4.jpg",
            description: "精选推荐"
        },
        {
            id: 'r7',
            title: "愿你独立且清醒，又酷又温柔",
            coverUrl: "http://8.217.105.136:5244/d/NicePlayMusic/recommend/playlist/4.jpg",
            description: "精选推荐"
        },
        {
            id: 'r8',
            title: "愿你独立且清醒，又酷又温柔",
            coverUrl: "http://8.217.105.136:5244/d/NicePlayMusic/recommend/playlist/4.jpg",
            description: "精选推荐"
        }, {
            id: 'r9',
            title: "愿你独立且清醒，又酷又温柔",
            coverUrl: "http://8.217.105.136:5244/d/NicePlayMusic/recommend/playlist/4.jpg",
            description: "精选推荐"
        },
    ];

    // 处理Apple Music歌单点击
    const handleAppleMusicPlaylistClick = (index) => {
    };

    // 处理推荐歌单点击
    const handleRecommendPlaylistClick = (index) => {
    };

    return (
        <ScrollShadow
            className="w-full ml-8 pr-8 h-full overflow-auto"
            hideScrollBar
            size={20}
            orientation="vertical"
            ref={contentRef}
        >
            <div className="py-4">
                {/* By Apple Music*/}
                <div className="w-full mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl text-common">By Apple Music</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {appleMusicPlaylists.map((playlist, index) => (
                            <div key={playlist.id} className="flex flex-col items-center sm:items-start mb-2">
                                <div
                                    className="relative cursor-pointer group overflow-hidden rounded-2xl w-[170px]"
                                    onClick={() => handleAppleMusicPlaylistClick(index)}
                                >
                                    <Image
                                        src={playlist.coverUrl}
                                        alt={playlist.title}
                                        className="w-[170px] h-[170px] object-cover bg-gray-800 transition-transform duration-300 group-hover:scale-105 rounded-2xl"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">播放</span>
                                    </div>
                                </div>
                                <div className="mt-3 text-left w-[170px]">
                                    <h3 className="text-common text-base font-medium break-words">{playlist.title}</h3>
                                    <p className="text-gray-400 text-sm mt-1 break-words">{playlist.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 推荐歌单 */}
                <div className="w-full mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl text-common">推荐歌单</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {recommendPlaylists.map((playlist, index) => (
                            <div key={playlist.id} className="flex flex-col items-center sm:items-start mb-2">
                                <div
                                    className="relative cursor-pointer group overflow-hidden rounded-2xl w-[170px]"
                                    onClick={() => handleRecommendPlaylistClick(index)}
                                >
                                    <Image
                                        src={playlist.coverUrl}
                                        alt={playlist.title}
                                        className="w-[170px] h-[170px] object-cover bg-gray-800 transition-transform duration-300 group-hover:scale-105 rounded-2xl"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">播放</span>
                                    </div>
                                </div>
                                <div className="mt-3 text-left w-[170px]">
                                    <h3 className="text-common text-base font-medium break-words">{playlist.title}</h3>
                                    <p className="text-gray-400 text-[13px] mt-1 break-words">{playlist.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ScrollShadow>
    );
}