"use client";
import { Card, CardHeader, CardFooter, Button } from "@heroui/react";
import { VerticalCarousel } from "@/components/banner/VerticalCarousel";
import { useState, useRef, useEffect, useContext } from "react";
import { gsap } from "gsap";
import { useTextAnimation } from "@/utils/textAnimation";
import useRecommendationStore from "@/store/useRecommendationStore"; // 推荐歌曲状态管理
import useBannerStore from "@/store/useBannerStore"; // 轮播数据状态管理
import useRankingStore from "@/store/useRankingStore"; // 排行榜状态管理
import useRecentlyPlayedStore from "@/store/useRecentlyPlayedStore"; // 最近爱听状态管理
import { useMediaQuery } from 'react-responsive'; // 导入 react-responsive
import musicPlayerInstance from "@/utils/musicPlayerInstance"; // 音乐播放控制器实例
import { MenuContext } from "@/components/context/MenuContext";
import PlaylistContent from "@/components/layout/PlaylistContent"; // 导入PlaylistContent组件

import aurthorIcon from "@/assets/icons/lights/author.svg";
import rankUP from "@/assets/icons/lights/rank_up.svg";
import rankDown from "@/assets/icons/lights/rank_down.svg";
import like from "@/assets/icons/lights/like.svg";
import like_pressed from "@/assets/icons/lights/like_pressed.svg";

export default function HomePage() {
    const menuContext = useContext(MenuContext);
    const isMiniPlayerActive = menuContext?.isMiniPlayerActive || false;
    const handleMenuClick = menuContext?.handleMenuClick;

    const isDesktop = useMediaQuery({ minWidth: 1024 });
    const isMobile = useMediaQuery({ maxWidth: 767 });

    // 从轮播状态管理中获取数据
    const {
        bannerItems,
        fetchBannerItems
    } = useBannerStore();

    // 轮播数据状态
    const [carouselItems, setCarouselItems] = useState([]);
    const [isLoadingBanner, setIsLoadingBanner] = useState(true);
    const [bannerError, setBannerError] = useState(null);

    // 使用state跟踪当前显示的轮播项
    const [currentItem, setCurrentItem] = useState(null);
    // 方向状态用于动画
    const [direction, setDirection] = useState(0);

    // 创建引用来访问DOM元素
    const headerRef = useRef(null);
    const footerContentRef = useRef(null);

    // 动画hook
    const [contentRef, triggerAnimation, resetAnimation] = useTextAnimation({
        duration: 0.55,
    });

    // 歌曲喜欢状态
    const [likedSongs, setLikedSongs] = useState({});

    // 从推荐状态管理中获取数据和方法
    const {
        todayRecommendations,
        fetchTodayRecommendations
    } = useRecommendationStore();

    // 推荐歌曲状态
    const [recommendedSongs, setRecommendedSongs] = useState([]);
    const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
    const [recommendationsError, setRecommendationsError] = useState(null);

    // 从排行榜状态管理中获取数据
    const {
        rankingItems: storeRankingItems,
        fetchRankingItems
    } = useRankingStore();

    // 排行榜数据状态
    const [rankingItems, setRankingItems] = useState([]);
    const [isLoadingRanking, setIsLoadingRanking] = useState(true);
    const [rankingFetchError, setRankingFetchError] = useState(null);

    // 从最近爱听状态管理中获取数据
    const {
        recentItems: storeRecentItems,
        fetchRecentItems
    } = useRecentlyPlayedStore();

    // 最近爱听数据状态
    const [recentPlaylists, setRecentPlaylists] = useState([]);
    const [isLoadingRecent, setIsLoadingRecent] = useState(true);
    const [recentFetchError, setRecentFetchError] = useState(null);

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

    // 获取轮播数据
    useEffect(() => {
        const getBannerData = async () => {
            try {
                setIsLoadingBanner(true);

                if (bannerItems.length > 0) {
                    // 如果状态管理中已有数据，直接使用
                    // console.log('从状态管理中获取轮播数据');
                    setCarouselItems(bannerItems);
                    // 只有在currentItem为null时才设置初始值，避免重置用户当前查看的项
                    if (!currentItem) {
                        setCurrentItem(bannerItems[0]);
                    }
                    setBannerError(null);
                    setIsLoadingBanner(false);
                } else {
                    // 如果状态管理中没有数据，则从API获取
                    // console.log('从API获取轮播数据并存入状态管理');
                    fetchBannerItems()
                        .then(items => {
                            setCarouselItems(items);
                            // 只有在currentItem为null时才设置初始值
                            if (!currentItem && items.length > 0) {
                                setCurrentItem(items[0]);
                            }
                            setBannerError(null);
                        })
                        .catch(error => {
                            console.error("获取轮播数据失败:", error);
                            setBannerError(`获取轮播数据失败: ${error.message}`);
                        })
                        .finally(() => {
                            setIsLoadingBanner(false);
                        });
                }
            } catch (error) {
                console.error("获取轮播数据异常:", error);
                setBannerError(`获取轮播数据失败: ${error.message}`);
                setIsLoadingBanner(false);
            }
        };

        getBannerData();
        // 移除currentItem依赖，只在bannerItems或fetchBannerItems变化时执行
    }, [bannerItems, fetchBannerItems]);

    // 获取今日推荐歌曲 - 修改为从状态管理中获取
    useEffect(() => {
        const getRecommendations = async () => {
            try {
                setIsLoadingRecommendations(true);

                if (todayRecommendations.length > 0) {
                    // 如果状态管理中已有数据，直接使用
                    // console.log('从状态管理中获取今日推荐数据');
                    setRecommendedSongs(todayRecommendations);
                    setRecommendationsError(null);
                    setIsLoadingRecommendations(false);
                } else {
                    // 如果状态管理中没有数据，则从API获取
                    // console.log('从API获取今日推荐数据并存入状态管理');
                    fetchTodayRecommendations()
                        .then(songs => {
                            setRecommendedSongs(songs);
                            setRecommendationsError(null);
                        })
                        .catch(error => {
                            console.error("获取今日推荐失败:", error);
                            setRecommendationsError(`获取推荐歌曲失败: ${error.message}`);
                        })
                        .finally(() => {
                            setIsLoadingRecommendations(false);
                        });
                }
            } catch (error) {
                console.error("获取今日推荐异常:", error);
                setRecommendationsError(`获取推荐歌曲失败: ${error.message}`);
                setIsLoadingRecommendations(false);
            }
        };

        getRecommendations();
    }, [todayRecommendations]);

    // 获取排行榜数据
    useEffect(() => {
        const getRankingData = async () => {
            try {
                setIsLoadingRanking(true);

                if (storeRankingItems.length > 0) {
                    // 如果状态管理中已有数据，直接使用
                    // console.log('从状态管理中获取排行榜数据');
                    setRankingItems(storeRankingItems);
                    setRankingFetchError(null);
                    setIsLoadingRanking(false);
                } else {
                    // 如果状态管理中没有数据，则从API获取
                    // console.log('从API获取排行榜数据并存入状态管理');
                    fetchRankingItems()
                        .then(items => {
                            setRankingItems(items);
                            setRankingFetchError(null);
                        })
                        .catch(error => {
                            console.error("获取排行榜数据失败:", error);
                            setRankingFetchError(`获取排行榜失败: ${error.message}`);
                        })
                        .finally(() => {
                            setIsLoadingRanking(false);
                        });
                }
            } catch (error) {
                console.error("获取排行榜异常:", error);
                setRankingFetchError(`获取排行榜失败: ${error.message}`);
                setIsLoadingRanking(false);
            }
        };

        getRankingData();
    }, [storeRankingItems, fetchRankingItems]);

    // 获取最近爱听数据
    useEffect(() => {
        const getRecentData = async () => {
            try {
                setIsLoadingRecent(true);

                if (storeRecentItems.length > 0) {
                    // 如果状态管理中已有数据，直接使用
                    // console.log('从状态管理中获取最近爱听数据');
                    setRecentPlaylists(storeRecentItems);
                    setRecentFetchError(null);
                    setIsLoadingRecent(false);
                } else {
                    // 如果状态管理中没有数据，则从API获取
                    // console.log('从API获取最近爱听数据并存入状态管理');
                    fetchRecentItems()
                        .then(items => {
                            console.log('获取到的最近爱听数据:', items);
                            
                            setRecentPlaylists(items);
                            setRecentFetchError(null);
                        })
                        .catch(error => {
                            console.error("获取最近爱听数据失败:", error);
                            setRecentFetchError(`获取最近爱听失败: ${error.message}`);
                        })
                        .finally(() => {
                            setIsLoadingRecent(false);
                        });
                }
            } catch (error) {
                console.error("获取最近爱听异常:", error);
                setRecentFetchError(`获取最近爱听失败: ${error.message}`);
                setIsLoadingRecent(false);
            }
        };

        getRecentData();
    }, [storeRecentItems, fetchRecentItems]);

    // 使用useEffect监听likedSongs变化
    useEffect(() => {
        // console.log('喜欢状态更新:', likedSongs);
    }, [likedSongs]);

    // 使用动画hook触发初始动画
    useEffect(() => {
        // 确保组件完全挂载后再触发动画
        const timer = setTimeout(() => {
            triggerAnimation();
        }, 200);

        return () => clearTimeout(timer);
    }, [triggerAnimation]);

    // 获取目标索引的轮播项
    const getItemByIndex = (index) => {
        if (!carouselItems || carouselItems.length === 0) return null;
        return carouselItems[index];
    };

    // 修改处理动画开始函数，区分用户交互与自动轮播
    const handleAnimationStart = (direction, targetIndex, isUserInteraction = false) => {
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
                        clearProps: "all", // 确保动画后清除内联样式
                        onComplete: () => {
                            if (isUserInteraction) {
                                try {
                                    // 重置动画
                                    resetAnimation();
                                } catch (error) {

                                }
                            }
                        }
                    }
                );
            }
        });
    };

    // 处理喜欢按钮点击
    const handleToggleLike = (songId) => {
        setLikedSongs(prev => ({
            ...prev,
            [songId]: !prev[songId]
        }));
    };

    // 渲染加载状态
    const renderLoadingState = () => (
        <div className="flex justify-center items-center h-[300px]">
            <p className="text-gray-500">加载推荐歌曲中...</p>
        </div>
    );

    // 渲染错误状态
    const renderErrorState = () => (
        <div className="flex justify-center items-center h-[300px]">
            <p className="text-red-500">{recommendationsError}</p>
        </div>
    );

    // 渲染空数据状态
    const renderEmptyState = () => (
        <div className="flex justify-center items-center h-[300px]">
            <p className="text-gray-500">暂无推荐歌曲</p>
        </div>
    );

    // 渲染轮播加载状态
    const renderBannerLoadingState = () => (
        <div className="w-[55%] h-[280px] flex justify-center items-center bg-gray-100 rounded-lg">
            <p className="text-gray-500">加载轮播数据中...</p>
        </div>
    );

    // 渲染轮播错误状态
    const renderBannerErrorState = () => (
        <div className="w-[55%] h-[280px] flex justify-center items-center bg-gray-100 rounded-lg">
            <p className="text-red-500">{bannerError}</p>
        </div>
    );

    // 渲染排行榜加载状态
    const renderRankingLoadingState = () => (
        <div className="flex-1 h-[250px] flex justify-center items-center bg-gray-100 rounded-lg">
            <p className="text-gray-500">加载排行榜中...</p>
        </div>
    );

    // 渲染排行榜错误状态
    const renderRankingErrorState = () => (
        <div className="flex-1 h-[250px] flex justify-center items-center bg-gray-100 rounded-lg">
            <p className="text-red-500">{rankingFetchError}</p>
        </div>
    );

    // 渲染最近爱听加载状态
    const renderRecentLoadingState = () => (
        <div className="flex-1 h-[300px] flex justify-center items-center bg-gray-100 rounded-lg">
            <p className="text-gray-500">加载最近爱听中...</p>
        </div>
    );

    // 渲染最近爱听错误状态
    const renderRecentErrorState = () => (
        <div className="flex-1 h-[300px] flex justify-center items-center bg-gray-100 rounded-lg">
            <p className="text-red-500">{recentFetchError}</p>
        </div>
    );

    return (
        <div className="flex flex-col gap-4 pr-4" ref={contentRef}>
            {/* 顶部区域 - 轮播和排行榜 */}
            <div className={`ml-8 ${isDesktop ? 'flex gap-20' : 'flex flex-col gap-6'}`}>
                {isLoadingBanner ? (
                    renderBannerLoadingState()
                ) : bannerError ? (
                    renderBannerErrorState()
                ) : carouselItems.length === 0 || !currentItem ? (
                    <div className={`${isDesktop ? 'w-[55%]' : 'w-full'} h-[280px] flex justify-center items-center bg-gray-100 rounded-lg`}>
                        <p className="text-gray-500">暂无轮播数据</p>
                    </div>
                ) : (
                    <Card isFooterBlurred isBlurred className={`${isDesktop ? 'w-[55%]' : 'w-full'} h-[280px] col-span-12 sm:col-span-7 mt-2 shadow-sm`}>
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
                            className="z-0 w-full h-full object-cover select-text"
                            items={carouselItems}
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
                            <Button radius="full" size="sm" onPress={() => {
                                musicPlayerInstance.handlePlayMusic(currentItem.songId, 'bannerSong');
                                if (!isMiniPlayerActive && handleMenuClick) {
                                    handleMenuClick('miniplayer');
                                }
                            }}>
                                立即播放
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* 排行榜 */}
                {isLoadingRanking ? (
                    renderRankingLoadingState()
                ) : rankingFetchError ? (
                    renderRankingErrorState()
                ) : rankingItems.length === 0 ? (
                    <div className={`${isDesktop ? 'flex-1' : 'w-full'} h-[250px] flex justify-center items-center bg-gray-100 rounded-lg`}>
                        <p className="text-gray-500">暂无排行榜数据</p>
                    </div>
                ) : (
                    <div className={`${isDesktop ? 'flex-1' : 'w-full'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-2xl font-bold text-common">排行榜</h4>
                            <Button size="sm" variant="light" className="text-primary">
                                查看全部
                            </Button>
                        </div>
                        <div className="h-[250px] overflow-hidden p-2">
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
                                        onDoubleClick={() => {
                                            musicPlayerInstance.handlePlayMusic(item.songId, 'rank');
                                            if (!isMiniPlayerActive && handleMenuClick) {
                                                handleMenuClick('miniplayer');
                                            }
                                        }}
                                    >
                                        <div className="flex w-full items-center pl-1">
                                            <div className="w-12 h-12 mr-4 rounded-lg overflow-hidden relative shadow-sm flex-shrink-0">
                                                {/* 封面图片 */}
                                                <img
                                                    src={item.img}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover select-none"
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
                                                        className="w-4 h-4 object-contain select-none"
                                                    />
                                                    <span className="artist-name-wrapper">
                                                        <p className="text-gray-500 text-sm artist-name" >
                                                            {item.artist}
                                                        </p>
                                                    </span>
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
                                                                className="object-contain select-none"
                                                            />
                                                        )}
                                                        {index === 1 && (
                                                            <img
                                                                src={rankDown.src}
                                                                width="20"
                                                                height="20"
                                                                className="object-contain select-none"
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
                )}
            </div>

            {/* 今日推荐和最近爱听 */}
            <div className={`ml-8 ${isDesktop ? 'flex gap-20' : 'flex flex-col gap-6'} mt-2`}>
                <div className={`${isDesktop ? 'w-[55%]' : 'w-full'}`}>
                    <div className="flex justify-between items-center mb-1">
                        <h4 className="text-2xl font-bold text-common">今日推荐</h4>
                        <Button size="sm" variant="light" className="text-primary">
                            更多推荐
                        </Button>
                    </div>
                    <div className="h-[300px] overflow-hidden p-1">
                        {isLoadingRecommendations ? (
                            renderLoadingState()
                        ) : recommendationsError ? (
                            renderErrorState()
                        ) : recommendedSongs.length === 0 ? (
                            renderEmptyState()
                        ) : (
                            <div className="flex-col pt-0 pb-0 flex-1">
                                <div className="w-full flex flex-col gap-0">
                                    {recommendedSongs.map((song, index) => (
                                        <Card
                                            key={song.id}
                                            className="flex items-center py-2 transition-colors h-[52px] mb-1 mt-1"
                                            classNames={{
                                                base: "shadow-none bg-transparent",
                                                body: "p-0 overflow-visible flex-1 w-full"
                                            }}
                                        >
                                            <div className="flex w-full items-center justify-between pl-1">
                                                <div className="flex items-center w-[50%]">
                                                    <div className="w-7 flex-shrink-0 mr-4 text-center">
                                                        <span className="text-lg text-gray-500 font-bold">
                                                            {String(index + 1).padStart(2, '0')}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center ml-6">
                                                        <div className="w-10 h-10 mr-3 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                                            <img
                                                                src={song.img}
                                                                alt={song.title}
                                                                className="w-full h-full object-cover select-none"
                                                            />
                                                        </div>

                                                        <div className="text-left flex-grow max-w-[70%]">
                                                            <p className="text-[14px] font-medium text-common truncate">{song.title}</p>
                                                            <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                                                                <img
                                                                    src={aurthorIcon.src}
                                                                    className="w-4 h-4 object-contain flex-shrink-0 select-none"
                                                                />
                                                                <p className="text-gray-500 truncate">{song.artist}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 时长 */}
                                                <div className="flex items-center w-[15%] justify-center">
                                                    <div className="text-gray-400 text-sm">
                                                        {song.duration}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between w-[30%]">
                                                    {/* 喜欢按钮 */}
                                                    <div
                                                        className="cursor-pointer flex justify-center w-1/2"
                                                        onClick={() => handleToggleLike(song.id)}
                                                    >
                                                        <img
                                                            src={likedSongs[song.id] ? like_pressed.src : like.src}
                                                            width="20"
                                                            height="20"
                                                            className="object-contain select-none"
                                                        />
                                                    </div>
                                                    {/* 播放按钮 */}
                                                    <div className="flex justify-end w-1/2">
                                                        <Button size="sm" radius="full" onPress={() => {
                                                            musicPlayerInstance.handlePlayMusic(song.songId, 'recommend');
                                                            // 如果播放器未激活，则激活播放器
                                                            if (!isMiniPlayerActive && handleMenuClick) {
                                                                handleMenuClick('miniplayer');
                                                            }
                                                        }}>
                                                            播放
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 最近爱听*/}
                {isLoadingRecent ? (
                    renderRecentLoadingState()
                ) : recentFetchError ? (
                    renderRecentErrorState()
                ) : recentPlaylists.length === 0 ? (
                    <div className={`${isDesktop ? 'flex-1' : 'w-full'} h-[300px] flex justify-center items-center bg-gray-100 rounded-lg`}>
                        <p className="text-gray-500">暂无最近爱听数据</p>
                    </div>
                ) : (
                    <div className={`${isDesktop ? 'flex-1' : 'w-full'}`}>
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="text-2xl font-bold text-common">最近爱听</h4>
                            <Button size="sm" variant="light" className="text-primary">
                                查看全部
                            </Button>
                        </div>
                        <div className="h-[300px] overflow-hidden p-2">
                            <div className="flex-col pt-0 pb-0 flex-1">
                                <div className={`w-full grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-x-3 gap-y-3 h-full`}>
                                    {recentPlaylists.map((playlist) => (
                                        <div key={playlist.id} className="flex flex-col">
                                            <div className="w-full h-[100px] rounded-lg overflow-hidden mb-1 shadow-sm relative group cursor-pointer">
                                                <img
                                                    src={playlist.img}
                                                    alt={playlist.title}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 select-none"
                                                    onClick={() => {
                                                        console.log('点击了最近爱听歌单:', playlist);
                                                        
                                                        handlePlaylistSelect({
                                                            id: playlist.id,
                                                            name: playlist.title,
                                                            description: playlist.description,
                                                            cover_url: playlist.img,
                                                            tracks: playlist.tracks,
                                                            plays: playlist.plays,
                                                            created_at: playlist.createdAt
                                                        });
                                                    }}
                                                />
                                            </div>
                                            <p className="text-sm font-medium text-common truncate">{playlist.title}</p>
                                            <p className="text-xs text-gray-500 truncate">{playlist.tracks}首歌曲 • {playlist.plays.toLocaleString()}次播放</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}