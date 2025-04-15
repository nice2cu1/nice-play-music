'use client';

import { useEffect, useState, useContext, useRef } from 'react';
import { Image, Button, Card, Spinner } from '@heroui/react';
import { playlistAPI } from '@/axios/api';
import musicPlayerInstance from '@/utils/musicPlayerInstance';
import { MenuContext } from '@/components/context/MenuContext';
import { formatDate, formatDuration } from '@/utils/formatters';
import { gsap } from 'gsap';
import useCommonPlaylistStore from '@/store/useCommonPlaylistStore';
import useUserStore from '@/store/useUserStore';

import like from '@/assets/icons/lights/like.svg';
import like_pressed from '@/assets/icons/lights/like_pressed.svg';
import playAllIcon from '@/assets/icons/lights/play.svg';
import likePlaylistIcon from '@/assets/icons/lights/like.svg';
import likePlaylistFilledIcon from '@/assets/icons/lights/like_pressed.svg';


const PlaylistContent = ({ playlist }) => {
    // 获取菜单上下文
    const menuContext = useContext(MenuContext);
    const isMiniPlayerActive = menuContext?.isMiniPlayerActive || false;
    const handleMenuClick = menuContext?.handleMenuClick;

    // 组件状态
    const [playlistSongs, setPlaylistSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likedSongs, setLikedSongs] = useState({});
    const [isPlaylistLiked, setIsPlaylistLiked] = useState(false);

    // refs
    const songsContainerRef = useRef(null);
    const headerInfoRef = useRef(null);
    const lastSelectedMusicRef = useRef(null); // 添加lastSelectedMusicRef

    // 添加动画执行状态跟踪
    const [animationExecuted, setAnimationExecuted] = useState(false);
    const animationTimeoutRef = useRef(null);

    // 获取状态管理器中的方法
    const { setPlaylist } = useCommonPlaylistStore();
    const setSelectedMusic = useUserStore((state) => state.setSelectedMusic);
    const selectedMusic = useUserStore((state) => state.selectedMusic);

    // 修改初始动画效果，使用gsap直接处理动画
    useEffect(() => {
        // 如果动画已经执行过，则不再触发
        if (animationExecuted) return;

        // 清除之前可能存在的timeout
        if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current);
        }

        // 确保组件完全挂载后再触发动画
        animationTimeoutRef.current = setTimeout(() => {
            // 添加封面和信息的动画
            if (headerInfoRef.current) {
                gsap.fromTo(
                    headerInfoRef.current.querySelector('.playlist-cover'),
                    { opacity: 0, scale: 0.9 },
                    { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)" }
                );

                gsap.fromTo(
                    headerInfoRef.current.querySelector('.playlist-info'),
                    { opacity: 0, x: 20 },
                    { opacity: 1, x: 0, duration: 0.7, ease: "power2.out", delay: 0.2 }
                );
            }

            // 标记动画已执行
            setAnimationExecuted(true);
        }, 200);

        return () => {
            // 清除timeout
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }
        };
    }, [animationExecuted]);

    // 当playlist变化时重置动画状态，以便新歌单能够触发动画
    useEffect(() => {
        setAnimationExecuted(false);
    }, [playlist?.id]);

    // 获取歌单内歌曲
    useEffect(() => {
        const fetchPlaylistSongs = async () => {
            if (!playlist || !playlist.id) {
                setError('无效的歌单信息');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                // 调用API获取歌单歌曲
                const response = await playlistAPI.getPlaylistById(playlist.id);
                console.log('获取歌单歌曲:', response);

                if (response && response.songs) {
                    setPlaylistSongs(response.songs);
                    
                    // 将歌单信息和歌曲列表存入通用歌单状态管理器
                    setPlaylist(response.songs, {
                        id: playlist.id,
                        name: playlist.name,
                        description: playlist.description,
                        cover_url: playlist.cover_url,
                        tracks: playlist.tracks,
                        plays: playlist.plays,
                        created_at: playlist.created_at,
                        file_path: playlist.file_path,
                        lrc_path: playlist.lrc_path,
                    });
                    

                    // 添加列表动画 - 在渲染后执行
                    setTimeout(() => {
                        if (songsContainerRef.current) {
                            const songItems = songsContainerRef.current.querySelectorAll('.song-item');

                            // 清除已存在的动画
                            gsap.killTweensOf(songItems);

                            gsap.fromTo(songItems,
                                { opacity: 0, y: 20 },
                                {
                                    opacity: 1,
                                    y: 0,
                                    stagger: 0.05,
                                    duration: 0.5,
                                    ease: "power2.out",
                                    delay: 0.3,
                                    overwrite: true
                                }
                            );
                        }
                    }, 50);
                } else {
                    setError('获取歌单歌曲数据格式不正确');
                }
            } catch (error) {
                console.error('获取歌单歌曲失败:', error);
                setError(`获取歌单歌曲失败: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaylistSongs();
    }, [playlist, setPlaylist]);

    // 当selectedMusic变化时，更新lastSelectedMusicRef
    useEffect(() => {
        if (selectedMusic) {
            lastSelectedMusicRef.current = selectedMusic;
        }
    }, [selectedMusic]);

    // 处理歌曲播放
    const handlePlaySong = (id, playlistId) => {
        console.log('播放歌曲:', id, playlistId);

        setSelectedMusic(id); // 更新选中的音乐ID
        lastSelectedMusicRef.current = id; // 更新lastSelectedMusicRef

        musicPlayerInstance.handlePlayMusic(id, playlistId);

        // 如果播放器未激活，则激活播放器
        if (!isMiniPlayerActive && handleMenuClick) {
            handleMenuClick('miniplayer');
        }

        // 添加点击动画
        gsap.to(`[data-song-id="${id}"]`, {
            scale: 0.97,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    };

    // 处理播放全部
    const handlePlayAll = () => {
        console.log('全部歌曲:', playlistSongs);
        
        if (playlistSongs.length > 0) {
            // 播放第一首歌
            const firstSong = playlistSongs[0];
            musicPlayerInstance.handlePlayMusic(firstSong.id, playlist.id);

            // 如果播放器未激活，则激活播放器
            if (!isMiniPlayerActive && handleMenuClick) {
                handleMenuClick('miniplayer');
            }

            // 添加按钮动画
            gsap.to(".play-all-btn", {
                scale: 0.9,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        }
    };

    // 处理喜欢歌曲
    const handleToggleLike = (id) => {
        setLikedSongs(prev => ({
            ...prev,
            [id]: !prev[id]
        }));

        // 添加按钮动画
        gsap.to(`[data-like-id="${id}"]`, {
            scale: 0.8,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    };

    // 处理喜欢歌单
    const handleToggleLikePlaylist = () => {
        setIsPlaylistLiked(!isPlaylistLiked);

        // 添加按钮动画
        gsap.to(".like-playlist-btn", {
            scale: 0.8,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    };

    // 渲染加载状态
    const renderLoadingState = () => (
        <div className="flex justify-center items-center h-64 w-full">
            <Spinner color="primary" size="lg" />
            <p className="ml-4 text-common">加载歌单中...</p>
        </div>
    );

    // 渲染错误状态
    const renderErrorState = () => (
        <div className="flex justify-center items-center h-64 w-full">
            <p className="text-red-500">{error}</p>
        </div>
    );

    // 渲染空数据状态
    const renderEmptyState = () => (
        <div className="flex justify-center items-center h-64 w-full">
            <p className="text-gray-500">歌单内暂无歌曲</p>
        </div>
    );

    // 格式化歌单创建时间
    const formattedDate = playlist?.created_at ? formatDate(playlist.created_at) : '';

    return (
        <div className="w-full h-full overflow-y-auto pr-4 no-scrollbar">
            {/* 歌单头部信息 */}
            <div className="ml-8 mb-8" ref={headerInfoRef}>
                <div className="flex flex-col md:flex-row items-start gap-8">
                    {/* 歌单封面 */}
                    <div className="playlist-cover w-64 h-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src={playlist?.cover_url || 'http://8.217.105.136:5244/d/NicePlayMusic/library/mylike/1.jpg'}
                            alt={playlist?.name || '歌单封面'}
                            className="w-full h-full object-cover bg-gray-800"
                        />
                    </div>

                    {/* 歌单信息 */}
                    <div className="playlist-info flex-1 flex flex-col justify-between py-2">
                        <div>
                            <h1 className="text-4xl font-bold text-common mb-3">{playlist?.name || '未知歌单'}</h1>
                            <p className="text-gray-600 text-lg mb-6">{playlist?.description || '暂无描述'}</p>

                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
                                <span>创建于 {formattedDate}</span>
                                <span>|</span>
                                <span>{playlist?.tracks || 0} 首歌曲</span>
                                <span>|</span>
                                <span>{playlist?.plays?.toLocaleString() || 0} 次播放</span>
                            </div>
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex items-center gap-4">
                            <Button
                                color="primary"
                                radius="full"
                                className="px-6 play-all-btn"
                                onPress={handlePlayAll}
                                startContent={
                                    <img src={playAllIcon.src} alt="播放全部" className="w-5 h-5" />
                                }
                            >
                                播放全部
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 歌曲列表 */}
            <div className="ml-8 mt-6 mb-4">
                <h2 className="text-2xl font-bold text-common mb-4">歌曲列表</h2>

                {isLoading ? (
                    renderLoadingState()
                ) : error ? (
                    renderErrorState()
                ) : playlistSongs.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <div className="w-full" ref={songsContainerRef}>
                        {/* 表头 */}
                        <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200 text-gray-500 text-sm">
                            <div className="col-span-1">#</div>
                            <div className="col-span-4">歌曲名</div>
                            <div className="col-span-3">歌手</div>
                            <div className="col-span-2">时长</div>
                            <div className="col-span-1"></div>
                        </div>

                        {/* 歌曲列表 */}
                        {playlistSongs.map((song, index) => (
                            <Card
                                key={song.id}
                                className={`grid grid-cols-12 gap-4 items-center p-4 song-item ${selectedMusic === song.id ? 'bg-[#e6ecfc]' : ''}`}
                                classNames={{
                                    base: "shadow-none bg-transparent",
                                    body: "p-0 overflow-visible"
                                }}
                                data-song-id={song.id}
                                
                            >
                                <div className={`col-span-1font-medium ${selectedMusic === song.id ? 'banner-lyric-text' : ''}`}>
                                    {String(index + 1).padStart(2, '0')}
                                </div>

                                <div className="col-span-4 flex items-center">
                                    <div className="w-10 h-10 mr-3 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                        <img
                                            src={song.img || song.cover_path}
                                            alt={song.title}
                                            className="w-full h-full object-cover select-none"
                                        />
                                    </div>
                                    <p className={`font-medium text-common truncate ${ selectedMusic === song.id ? 'banner-lyric-text' : '' }`}>{song.title}</p>
                                </div>

                                <div className="col-span-3 flex items-center gap-2 text-gray-500">
                                    <p className={`truncate ${ selectedMusic === song.id ? 'banner-lyric-text' : '' }`}>{song.artist}</p>
                                </div>

                                <div className={`col-span-2  text-sm ${ selectedMusic === song.id ? 'banner-lyric-text' : 'text-gray-400' }`}>
                                    {formatDuration(song.duration)}
                                </div>

                                <div className="col-span-2 flex items-center justify-between">
                                    <div
                                        className="cursor-pointer mr-4"
                                        onClick={() => handleToggleLike(song.id)}
                                        data-like-id={song.id}
                                    >
                                        <img
                                            src={likedSongs[song.id] ? like_pressed.src : like.src}
                                            width="20"
                                            height="20"
                                            className="object-contain select-none"
                                        />
                                    </div>

                                    <Button
                                        size="sm"
                                        radius="full"
                                        onPress={() => handlePlaySong(song.id, playlist.id)}
                                    >
                                        播放
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistContent;
