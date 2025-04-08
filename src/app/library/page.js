'use client'
import useUserStore from "@/store/useUserStore";
import { Button, Card, CardBody, CardFooter, CardHeader, Image } from "@heroui/react";
import { useState, useEffect, useContext, useRef } from "react";
import { MenuContext } from "@/components/context/MenuContext";
import { useTextAnimation } from "@/utils/textAnimation";

import playIcon from "@/assets/icons/lights/ci-play-circle.svg";

export default function LibraryPage() {
    // 从全局状态获取选中的音乐
    const selectedMusic = useUserStore((state) => state.selectedMusic);
    const setSelectedMusic = useUserStore((state) => state.setSelectedMusic);

    // 访问 context
    const menuContext = useContext(MenuContext);
    const isMiniPlayerActive = menuContext?.isMiniPlayerActive || false; // 从 MenuContext 获取 isMiniPlayerActive
    const handleMenuClick = menuContext?.handleMenuClick;

    const lastSelectedMusicRef = useRef(null);
    const [contentRef, triggerAnimation, resetAnimation] = useTextAnimation({
        duration: 0.55,
        distance: 15
    });

    const lyric = "你眼中有一场雨\n落在我绵密的心上"

    const allPlaylists = [
        {
            "cover_url": "http://8.217.105.136:5244/d/NicePlayMusic/library/mylike/like.jpg",
            "plays": 9999,
            "name": "我喜欢的音乐",
            "description": "属于自己的最爱音乐",
            "created_at": "2025-04-03T06:43:03.000+00:00",
            "id": 10,
            "tracks": 12
        },
        {
            "cover_url": "http://8.217.105.136:5244/d/NicePlayMusic/library/mylike/outerwilds.jpg",
            "plays": 3412,
            "name": "OuterWilds",
            "description": "宇宙的意义，就是组乐队",
            "created_at": "2025-04-03T06:45:04.000+00:00",
            "id": 11,
            "tracks": 12
        },
        {
            "cover_url": "http://8.217.105.136:5244/d/NicePlayMusic/library/mylike/chen.jpg",
            "plays": 1453,
            "name": "陈陈陈",
            "description": "早春不过一棵树",
            "created_at": "2025-04-03T06:45:04.000+00:00",
            "id": 12,
            "tracks": 16
        },
        {
            "cover_url": "http://8.217.105.136:5244/d/NicePlayMusic/library/mylike/ds.jpg",
            "plays": 1234,
            "name": "死亡搁浅内置播放器",
            "description": "连接到开罗尔网络",
            "created_at": "2025-04-03T06:45:04.000+00:00",
            "id": 13,
            "tracks": 46
        }
    ]

    // 当组件挂载后触发动画
    useEffect(() => {
        // 确保组件完全挂载后再触发动画
        const timer = setTimeout(() => {
            triggerAnimation();
        }, 200);

        return () => clearTimeout(timer);
    }, [triggerAnimation]);

    // 在从其他页面切换回library时恢复上次选择的音乐
    useEffect(() => {
        if (lastSelectedMusicRef.current) {
            setSelectedMusic(lastSelectedMusicRef.current);
        }
    }, [setSelectedMusic]);

    // 当用户选择音乐时，同时更新引用并打开播放器
    const handleMusicSelect = (musicId) => {
        setSelectedMusic(musicId);
        lastSelectedMusicRef.current = musicId;

        // 修复日志输出，确保从 favoriteMusic 中正确获取音乐信息
        const selected = favoriteMusic.find((m) => m.id === musicId);
        console.log(`Playing: ${selected ? selected.title : '未知音乐'}`);

        // 如果播放器未激活，则激活播放器
        if (!isMiniPlayerActive && handleMenuClick) {
            handleMenuClick('miniplayer');
        }
    };

    const handlePlaylistSelect = (playlistId) => {
        console.log(`Selected playlist: ${playlistId}`);
    }

    const favoriteMusic = [
        { id: '1', title: '给你一瓶魔法药水', artist: '告五人', cover_path: 'http://8.217.105.136:5244/d/NicePlayMusic/library/mylike/1.jpg' },
        { id: '2', title: '被你遗忘的森林', artist: '原子邦妮', cover_path: 'http://8.217.105.136:5244/d/NicePlayMusic/library/mylike/2.jpg' },
        { id: '3', title: '星海遥', artist: '陈鸿宇', cover_path: 'http://8.217.105.136:5244/d/NicePlayMusic/library/mylike/3.jpg' },
        { id: '4', title: 'I Really Want to Stay at Your House', artist: 'Rosa Walton, Hallie Coggins', cover_path: 'http://8.217.105.136:5244/d/NicePlayMusic/library/mylike/4.jpg' },
        { id: '5', title: 'Tek It', artist: 'Cafuné', cover_path: 'http://8.217.105.136:5244/d/NicePlayMusic/library/mylike/5.jpg' },
        { id: '6', title: 'A Moment Apart', artist: 'ODESZA', cover_path: 'http://8.217.105.136:5244/d/NicePlayMusic/library/mylike/6.jpg' },
        { id: '7', title: '整夜大雨后 - Live', artist: '邱比', cover_path: 'http://8.217.105.136:5244/d/NicePlayMusic/library/mylike/7.jpg' },
        { id: '8', title: '#imissyousobad', artist: '原子邦妮, Yalu', cover_path: 'http://8.217.105.136:5244/d/NicePlayMusic/library/mylike/8.jpg' },
        { id: '9', title: '秋日南风', artist: '陈鸿宇', cover_path: 'http://8.217.105.136:5244/d/NicePlayMusic/library/mylike/9.jpg' },
        { id: '10', title: '夏如白鸟飞', artist: '陈鸿宇', cover_path: 'http://8.217.105.136:5244/d/NicePlayMusic/library/mylike/10.jpg' },
        { id: '11', title: '无用清净梦', artist: '陈鸿宇', cover_path: 'http://8.217.105.136:5244/d/NicePlayMusic/library/mylike/11.jpg' },
        { id: '12', title: '理想三旬', artist: '陈鸿宇', cover_path: 'http://8.217.105.136:5244/d/NicePlayMusic/library/mylike/12.jpg' },
    ];

    return (
        <div className="py-6 w-full ml-8 pr-8 h-full overflow-auto" ref={contentRef}>
            <div className="w-full mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-3xl text-common ml-1">{useUserStore.getState().user?.nickname}的音乐库</h2>
                </div>
                <div className="flex flex-row gap-7">
                    {/* 大卡片 */}
                    <Card className="bg-[#e6ecfe] p-4 rounded-2xl shadow-none h-[260px] w-[530px]">
                        <CardHeader className="whitespace-pre-line banner-lyric-text text-xl font-bold">
                            {lyric}
                        </CardHeader>
                        <CardBody>

                        </CardBody>
                        <CardFooter>
                            <div className="flex items-center justify-between w-full">
                                <div>
                                    <p className="banner-lyric-text text-2xl font-bold">我喜欢的音乐</p>
                                    <p className="banner-lyric-text text-base font-bold">40 首歌</p>
                                </div>
                                <Button
                                    radius="full"
                                    isIconOnly
                                    color="primary"
                                    size="lg"
                                >
                                    <Image
                                        height={200}
                                        width={200}
                                        src={playIcon.src}
                                    />
                                </Button>

                            </div>
                        </CardFooter>
                    </Card>
                    <div className="w-[60%] h-[260px]">
                        <div className="grid grid-cols-3 gap-1 h-full">
                            {favoriteMusic.map((music) => (
                                <Card
                                    key={music.id}
                                    className={`transition-all duration-200 shadow-none bg-transparent w-full cursor-pointer select-none
                                              ${selectedMusic === music.id
                                            ? 'bg-[#e6ecfe]'
                                            : 'hover:bg-gray-100 active:bg-gray-200'}`}
                                    onDoubleClick={() => handleMusicSelect(music.id)}
                                >
                                    <CardBody className="p-1 flex flex-row items-center gap-1 no-scrollbar">
                                        <div
                                            className={`overflow-hidden transition-all duration-500 ease-in-out flex-shrink-0 ${isMiniPlayerActive
                                                ? 'opacity-0 scale-0'
                                                : 'opacity-100 scale-100'
                                                }`}
                                            style={{
                                                width: isMiniPlayerActive ? '0px' : '40px',
                                                height: isMiniPlayerActive ? '0px' : '40px',
                                                minWidth: isMiniPlayerActive ? '0px' : '40px',
                                                minHeight: isMiniPlayerActive ? '0px' : '40px',
                                                marginRight: isMiniPlayerActive ? '0px' : '4px',
                                                transformOrigin: 'left center'
                                            }}
                                        >
                                            <Image
                                                src={music.cover_path}
                                                width={40}
                                                height={40}
                                                className="rounded-md shadow-sm w-[40px] h-[40px] object-cover select-none"
                                                alt={music.title}
                                            />
                                        </div>

                                        <div className="flex flex-col justify-center min-w-0 flex-grow transition-all duration-500 ease-in-out">
                                            <p className={`text-[15px] font-medium truncate select-none ${selectedMusic === music.id ? 'banner-lyric-text' : ''}`} title={music.title}>
                                                {music.title}
                                            </p>
                                            <p className={`text-[12px] truncate select-none ${selectedMusic === music.id ? 'banner-lyric-text' : 'text-gray-500'}`} title={music.artist}>
                                                {music.artist}
                                            </p>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
                {/* 全部歌单 */}
                <div>
                    <div className="flex items-center justify-between mt-6 mb-3">
                        <h2 className="text-3xl text-common ml-1">全部歌单</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {allPlaylists.map((playlist, index) => (
                            <div key={playlist.id} className="flex flex-col items-center sm:items-start mb-2">
                                <div
                                    className="relative cursor-pointer group overflow-hidden rounded-2xl w-[170px]"
                                    onClick={() => handlePlaylistSelect(playlist.id)}
                                >
                                    <Image
                                        src={playlist.cover_url}
                                        alt={playlist.name}
                                        className="w-[170px] h-[170px] object-cover bg-gray-800 transition-transform duration-300 group-hover:scale-105 rounded-2xl select-none"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">播放</span>
                                    </div>
                                </div>
                                <div className="mt-3 text-left w-[170px]">
                                    <h3 className="text-common text-base font-medium break-words">{playlist.name}</h3>
                                    {/* <p className="text-gray-400 text-sm mt-1 break-words">{playlist.description}</p> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}