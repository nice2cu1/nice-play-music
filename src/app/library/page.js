'use client'
import useUserStore from "@/store/useUserStore";
import useLikedSongsStore from "@/store/useLikedSongsStore";
import useUserPlaylistsStore from "@/store/useUserPlaylistsStore";
import { Button, Card, CardBody, CardFooter, CardHeader, Image, Spinner } from "@heroui/react";
import { useState, useEffect, useContext, useRef } from "react";
import { MenuContext } from "@/components/context/MenuContext";
import { useTextAnimation } from "@/utils/textAnimation";
import musicPlayerInstance from "@/utils/musicPlayerInstance";
import { playlistAPI } from "@/axios/api";

import playIcon from "@/assets/icons/lights/ci-play-circle.svg";
import PlaylistContent from "@/components/layout/PlaylistContent"; // 导入PlaylistContent组件

export default function LibraryPage() {
    // 从全局状态获取选中的音乐
    const selectedMusic = useUserStore((state) => state.selectedMusic);
    const setSelectedMusic = useUserStore((state) => state.setSelectedMusic);
    const user = useUserStore((state) => state.user);

    // 从状态管理中获取喜欢的音乐数据和方法
    const {
        likedSongs: storeLikedSongs,
        playlistInfo: storePlaylistInfo,
        isLoaded: likedSongsIsLoaded,
        setLikedSongs
    } = useLikedSongsStore();

    // 从状态管理中获取用户歌单数据和方法
    const {
        userPlaylists: storeUserPlaylists,
        isLoaded: userPlaylistsIsLoaded,
        setUserPlaylists
    } = useUserPlaylistsStore();

    // 本地状态管理 - 喜欢的音乐
    const [favoriteMusic, setFavoriteMusic] = useState([]);
    const [likedPlaylistInfo, setLikedPlaylistInfo] = useState(null);
    const [isLikedSongsLoading, setIsLikedSongsLoading] = useState(true);
    const [likedSongsError, setLikedSongsError] = useState(null);
    // 添加随机歌词状态
    const [randomLyric, setRandomLyric] = useState("");
    // 添加随机歌词对应的歌曲ID
    const [randomSongId, setRandomSongId] = useState(null);

    // 本地状态管理 - 所有歌单
    const [allPlaylists, setAllPlaylists] = useState([]);
    const [isPlaylistsLoading, setIsPlaylistsLoading] = useState(true);
    const [playlistsError, setPlaylistsError] = useState(null);

    // 访问 context
    const menuContext = useContext(MenuContext);
    const isMiniPlayerActive = menuContext?.isMiniPlayerActive || false;
    const handleMenuClick = menuContext?.handleMenuClick;

    const lastSelectedMusicRef = useRef(null);
    const [contentRef, triggerAnimation, resetAnimation] = useTextAnimation({
        duration: 0.55,
        distance: 15
    });

    // 处理歌词中的转义字符
    const processLyrics = (lyrics) => {
        if (!lyrics) return "";

        // 将 \t 替换为实际的制表符，\n 替换为实际的换行符
        return lyrics
            .replace(/\\t/g, '\t')
            .replace(/\\n/g, '\n');
    };

    // 获取用户喜欢的音乐
    useEffect(() => {
        const fetchLikedSongs = async () => {
            if (!user || !user.id) return;

            try {
                setIsLikedSongsLoading(true);
                setLikedSongsError(null);

                // 检查状态存储中是否已有数据
                if (likedSongsIsLoaded && storeLikedSongs.length > 0) {
                    setFavoriteMusic(storeLikedSongs);
                    setLikedPlaylistInfo(storePlaylistInfo);

                    // 从已加载的歌曲中随机选择一首的banner_lrc
                    if (storeLikedSongs.some(song => song.banner_lrc)) {
                        const songsWithLyrics = storeLikedSongs.filter(song => song.banner_lrc);
                        if (songsWithLyrics.length > 0) {
                            const randomSong = songsWithLyrics[Math.floor(Math.random() * songsWithLyrics.length)];
                            // 处理歌词中的转义字符
                            setRandomLyric(processLyrics(randomSong.banner_lrc));
                            // 记录随机选择的歌曲ID
                            setRandomSongId(randomSong.id);
                        }
                    }

                    setIsLikedSongsLoading(false);
                    return;
                }

                // 否则从API获取数据
                const response = await playlistAPI.getLikedSongs(user.id);

                if (response && response.songs) {
                    const playlistInfo = {
                        name: response.playlist_name,
                        description: response.description,
                        tracks: response.songs.length,
                        id: response.playlist_id
                    };

                    // 更新本地状态
                    setFavoriteMusic(response.songs);
                    setLikedPlaylistInfo(playlistInfo);

                    // 随机选择一首歌的banner_lrc
                    if (response.songs.some(song => song.banner_lrc)) {
                        const songsWithLyrics = response.songs.filter(song => song.banner_lrc);
                        if (songsWithLyrics.length > 0) {
                            const randomSong = songsWithLyrics[Math.floor(Math.random() * songsWithLyrics.length)];
                            // 处理歌词中的转义字符
                            setRandomLyric(processLyrics(randomSong.banner_lrc));
                            // 记录随机选择的歌曲ID
                            setRandomSongId(randomSong.id);
                        }
                    }

                    // 同时更新状态管理
                    setLikedSongs(response.songs, playlistInfo);
                }
            } catch (err) {
                console.error("获取喜欢的音乐失败:", err);
                setLikedSongsError("获取喜欢的音乐失败，请稍后重试");
            } finally {
                setIsLikedSongsLoading(false);
            }
        };

        fetchLikedSongs();
    }, [user, likedSongsIsLoaded, storeLikedSongs, storePlaylistInfo, setLikedSongs]);

    // 获取用户的所有歌单
    useEffect(() => {
        const fetchUserPlaylists = async () => {
            if (!user || !user.id) return;

            try {
                setIsPlaylistsLoading(true);
                setPlaylistsError(null);

                // 检查状态存储中是否已有数据
                if (userPlaylistsIsLoaded && storeUserPlaylists.length > 0) {
                    setAllPlaylists(storeUserPlaylists);
                    setIsPlaylistsLoading(false);
                    return;
                }

                // 否则从API获取数据
                const response = await playlistAPI.getUserPlaylists(user.id);

                if (response && response.playlists) {
                    // 更新本地状态
                    setAllPlaylists(response.playlists);

                    // 同时更新状态管理
                    setUserPlaylists(response.playlists);
                } else {
                    console.error('获取用户歌单响应格式不正确:', response);
                    setPlaylistsError('获取歌单数据格式不正确');
                }
            } catch (err) {
                console.error("获取用户歌单失败:", err);
                setPlaylistsError("获取用户歌单失败，请稍后重试");
            } finally {
                setIsPlaylistsLoading(false);
            }
        };

        fetchUserPlaylists();
    }, [user, userPlaylistsIsLoaded, storeUserPlaylists, setUserPlaylists]);

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

        const selected = favoriteMusic.find((m) => m.id === musicId);
        console.log(`Playing: ${selected ? selected.title : '未知音乐'}`);

        // 所属歌单ID
        const playlistId = likedPlaylistInfo ? likedPlaylistInfo.id : null;
        console.log(`所属歌单ID: ${playlistId}`);

        // 调用音乐播放器实例的播放方法
        musicPlayerInstance.handlePlayMusic(musicId, playlistId);


        // 如果播放器未激活，则激活播放器
        if (!isMiniPlayerActive && handleMenuClick) {
            handleMenuClick('miniplayer');
        }
    };

    // 修改歌单选择处理函数，实现页面跳转
    const handlePlaylistSelect = (playlist) => {
        console.log('选择的歌单:', playlist);
        
        // 如果没有上下文或setPageContent方法，则直接返回
        if (!menuContext || !menuContext.setPageContent) {
            console.error('无法切换页面：MenuContext.setPageContent未定义');
            return;
        }
        
        // 创建PlaylistContent组件实例，传入playlist数据
        const playlistContentComponent = (
            <PlaylistContent playlist={playlist} />
        );
        
        // 使用上下文方法设置自定义页面和标题
        menuContext.setPageContent('歌单详情', playlistContentComponent);
    };

    // 处理歌词卡片播放按钮点击
    const handlePlayRandomSong = () => {
        if (randomSongId && likedPlaylistInfo) {
            console.log(`播放歌曲ID: ${randomSongId}, 歌单ID: ${likedPlaylistInfo.id}`);
            // 调用音乐播放器实例的播放方法
            musicPlayerInstance.handlePlayMusic(randomSongId, likedPlaylistInfo.id);

            // 如果播放器未激活，则激活播放器
            if (!isMiniPlayerActive && handleMenuClick) {
                handleMenuClick('miniplayer');
            }

            // 同时更新选中的音乐ID
            setSelectedMusic(randomSongId);
            lastSelectedMusicRef.current = randomSongId;
        } else {
            console.warn('无法播放随机歌曲: 缺少歌曲ID或歌单信息');
        }
    };

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
                            {randomLyric}
                        </CardHeader>
                        <CardBody>

                        </CardBody>
                        <CardFooter>
                            <div className="flex items-center justify-between w-full">
                                <div>
                                    <p className="banner-lyric-text text-2xl font-bold">
                                        {likedPlaylistInfo?.name || "我喜欢的音乐"}
                                    </p>
                                    <p className="banner-lyric-text text-base font-bold">
                                        {likedPlaylistInfo?.tracks || 0} 首歌
                                    </p>
                                </div>
                                <Button
                                    radius="full"
                                    isIconOnly
                                    color="primary"
                                    size="lg"
                                    onPress={handlePlayRandomSong}
                                    aria-label="播放"
                                >
                                    <Image
                                        height={200}
                                        width={200}
                                        src={playIcon.src}
                                        alt="播放"
                                    />
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                    <div className="w-[60%] h-[260px]">
                        {isLikedSongsLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <Spinner color="primary" size="lg" />
                            </div>
                        ) : likedSongsError ? (
                            <div className="flex items-center justify-center h-full text-red-500">
                                {likedSongsError}
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-1 h-full">
                                {favoriteMusic.slice(0, 12).map((music) => (
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
                        )}
                    </div>
                </div>
                {/* 全部歌单 */}
                <div>
                    <div className="flex items-center justify-between mt-6 mb-3">
                        <h2 className="text-3xl text-common ml-1">全部歌单</h2>
                    </div>
                    {isPlaylistsLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Spinner color="primary" size="lg" />
                        </div>
                    ) : playlistsError ? (
                        <div className="flex items-center justify-center py-8 text-red-500">
                            {playlistsError}
                        </div>
                    ) : allPlaylists.length === 0 ? (
                        <div className="flex items-center justify-center py-8 text-gray-500">
                            暂无歌单
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {allPlaylists.map((playlist) => (
                                <div key={playlist.id} className="flex flex-col items-center sm:items-start mb-2">
                                    <div
                                        className="relative cursor-pointer group overflow-hidden rounded-2xl w-[170px]"
                                        onClick={() => handlePlaylistSelect(playlist)}
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
                    )}
                </div>
            </div>
        </div>
    );
}