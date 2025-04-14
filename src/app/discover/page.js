'use client';

import { Image, ScrollShadow } from '@heroui/react';
import { useEffect, useState, useContext } from 'react';
import { playlistAPI } from '@/axios/api';
import useAppleMusicStore from '@/store/useAppleMusicStore';
import useRecommendPlaylistStore from '@/store/useRecommendPlaylistStore';
import PlaylistContent from "@/components/layout/PlaylistContent"; // 导入PlaylistContent组件
import { MenuContext } from '@/components/context/MenuContext';

export default function DiscoverPage() {
    // 从状态管理中获取Apple Music歌单数据和方法
    const {
        appleMusicPlaylists: storeAppleMusicPlaylists,
        isLoaded: appleIsLoaded,
        setAppleMusicPlaylists
    } = useAppleMusicStore();

    // 从状态管理中获取推荐歌单数据和方法
    const {
        recommendPlaylists: storeRecommendPlaylists,
        isLoaded: recommendIsLoaded,
        setRecommendPlaylists
    } = useRecommendPlaylistStore();

    // 本地状态管理 - Apple Music歌单
    const [appleMusicPlaylists, setLocalAppleMusicPlaylists] = useState([]);
    const [isAppleLoading, setIsAppleLoading] = useState(true);
    const [appleMusicError, setAppleMusicError] = useState(null);

    // 本地状态管理 - 推荐歌单
    const [recommendPlaylists, setLocalRecommendPlaylists] = useState([]);
    const [isRecommendLoading, setIsRecommendLoading] = useState(true);
    const [recommendError, setRecommendError] = useState(null);

    // 获取MenuContext
    const menuContext = useContext(MenuContext);

    // 获取Apple Music歌单数据
    useEffect(() => {
        const fetchAppleMusicData = async () => {
            try {
                setIsAppleLoading(true);

                if (appleIsLoaded && storeAppleMusicPlaylists.length > 0) {
                    // 如果数据已经加载，直接使用状态管理中的数据
                    setLocalAppleMusicPlaylists(storeAppleMusicPlaylists);
                    setAppleMusicError(null);
                    setIsAppleLoading(false);
                } else {
                    try {
                        const response = await playlistAPI.getAppleMusicPlaylists();
                        console.log('获取Apple Music歌单:', response);

                        if (response && response.appleMusicPlaylists) {
                            // 更新本地状态和状态管理
                            setLocalAppleMusicPlaylists(response.appleMusicPlaylists);
                            setAppleMusicPlaylists(response.appleMusicPlaylists);
                            setAppleMusicError(null);
                        } else {
                            console.error('Apple Music歌单响应格式不正确:', response);
                            setAppleMusicError('获取歌单数据格式不正确');
                        }
                    } catch (error) {
                        console.error('获取Apple Music歌单失败:', error);
                        setAppleMusicError(`获取歌单失败: ${error.message}`);
                    } finally {
                        setIsAppleLoading(false);
                    }
                }
            } catch (error) {
                console.error("获取Apple Music歌单异常:", error);
                setAppleMusicError(`获取歌单异常: ${error.message}`);
                setIsAppleLoading(false);
            }
        };

        fetchAppleMusicData();
    }, [appleIsLoaded, storeAppleMusicPlaylists, setAppleMusicPlaylists]);

    // 获取推荐歌单数据
    useEffect(() => {
        const fetchRecommendPlaylistsData = async () => {
            try {
                setIsRecommendLoading(true);

                if (recommendIsLoaded && storeRecommendPlaylists.length > 0) {
                    // 如果数据已经加载，直接使用状态管理中的数据
                    setLocalRecommendPlaylists(storeRecommendPlaylists);
                    setRecommendError(null);
                    setIsRecommendLoading(false);
                } else {
                    try {
                        const response = await playlistAPI.getRecommendedPlaylists();
                        console.log('获取推荐歌单:', response);

                        if (response && response.recommendPlaylists) {
                            // 更新本地状态和状态管理
                            setLocalRecommendPlaylists(response.recommendPlaylists);
                            setRecommendPlaylists(response.recommendPlaylists);
                            setRecommendError(null);
                        } else {
                            console.error('推荐歌单响应格式不正确:', response);
                            setRecommendError('获取歌单数据格式不正确');
                        }
                    } catch (error) {
                        console.error('获取推荐歌单失败:', error);
                        setRecommendError(`获取歌单失败: ${error.message}`);
                    } finally {
                        setIsRecommendLoading(false);
                    }
                }
            } catch (error) {
                console.error("获取推荐歌单异常:", error);
                setRecommendError(`获取歌单异常: ${error.message}`);
                setIsRecommendLoading(false);
            }
        };

        fetchRecommendPlaylistsData();
    }, [recommendIsLoaded, storeRecommendPlaylists, setRecommendPlaylists]);

    // 处理Apple Music歌单点击
    const handleAppleMusicPlaylistClick = (index) => {
        const playlist = appleMusicPlaylists[index];
        console.log("点击了Apple Music歌单:", playlist);
        
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
        menuContext.setPageContent('Apple Music 歌单', playlistContentComponent);
    };

    // 处理推荐歌单点击
    const handleRecommendPlaylistClick = (index) => {
        const playlist = recommendPlaylists[index];
        console.log("点击了推荐歌单:", playlist);
        
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
        menuContext.setPageContent('推荐歌单', playlistContentComponent);
    };

    // 渲染Apple Music加载状态
    const renderAppleMusicLoadingState = () => (
        <div className="flex justify-center w-full py-8">
            <p className="text-common">加载中...</p>
        </div>
    );

    // 渲染Apple Music错误状态
    const renderAppleMusicErrorState = () => (
        <div className="flex justify-center w-full py-8">
            <p className="text-red-500">{appleMusicError}</p>
        </div>
    );

    // 渲染Apple Music空数据状态
    const renderAppleMusicEmptyState = () => (
        <div className="flex justify-center w-full py-8">
            <p className="text-gray-500">暂无Apple Music歌单</p>
        </div>
    );

    // 渲染推荐歌单加载状态
    const renderRecommendLoadingState = () => (
        <div className="flex justify-center w-full py-8">
            <p className="text-common">加载中...</p>
        </div>
    );

    // 渲染推荐歌单错误状态
    const renderRecommendErrorState = () => (
        <div className="flex justify-center w-full py-8">
            <p className="text-red-500">{recommendError}</p>
        </div>
    );

    // 渲染推荐歌单空数据状态
    const renderRecommendEmptyState = () => (
        <div className="flex justify-center w-full py-8">
            <p className="text-gray-500">暂无推荐歌单</p>
        </div>
    );

    return (
        <ScrollShadow
            className="w-full ml-8 pr-8 h-full overflow-auto"
            hideScrollBar
            size={20}
            orientation="vertical"
        >
            <div className="py-4">
                {/* By Apple Music*/}
                <div className="w-full mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl text-common">By Apple Music</h2>
                    </div>

                    {isAppleLoading ? (
                        renderAppleMusicLoadingState()
                    ) : appleMusicError ? (
                        renderAppleMusicErrorState()
                    ) : appleMusicPlaylists.length === 0 ? (
                        renderAppleMusicEmptyState()
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {appleMusicPlaylists.map((playlist, index) => (
                                <div key={playlist.id} className="flex flex-col items-center sm:items-start mb-2">
                                    <div
                                        className="relative cursor-pointer group overflow-hidden rounded-2xl w-[170px]"
                                        onClick={() => handleAppleMusicPlaylistClick(index)}
                                    >
                                        <Image
                                            src={playlist.cover_url}
                                            alt={playlist.name}
                                            className="w-[170px] h-[170px] object-cover bg-gray-800 transition-transform duration-300 group-hover:scale-105 select-none rounded-2xl"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">播放</span>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-left w-[170px]">
                                        <h3 className="text-common text-base font-medium break-words">{playlist.name}</h3>
                                        <p className="text-gray-400 text-sm mt-1 break-words">{playlist.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 推荐歌单 */}
                <div className="w-full mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl text-common">推荐歌单</h2>
                    </div>

                    {isRecommendLoading ? (
                        renderRecommendLoadingState()
                    ) : recommendError ? (
                        renderRecommendErrorState()
                    ) : recommendPlaylists.length === 0 ? (
                        renderRecommendEmptyState()
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {recommendPlaylists.map((playlist, index) => (
                                <div key={playlist.id} className="flex flex-col items-center sm:items-start mb-2">
                                    <div
                                        className="relative cursor-pointer group overflow-hidden rounded-2xl w-[170px]"
                                        onClick={() => handleRecommendPlaylistClick(index)}
                                    >
                                        <Image
                                            src={playlist.cover_url}
                                            alt={playlist.name}
                                            className="w-[170px] h-[170px] object-cover bg-gray-800 transition-transform duration-300 group-hover:scale-105 select-none rounded-2xl"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">播放</span>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-left w-[170px] flex flex-col">
                                        <h3 className="text-common text-base font-medium break-words min-h-[48px] line-clamp-2">{playlist.name}</h3>
                                        <p className="text-gray-400 text-[13px] mt-1 break-words">{playlist.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ScrollShadow>
    );
}