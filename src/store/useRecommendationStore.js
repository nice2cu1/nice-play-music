import { create } from 'zustand';
import { playlistAPI } from '@/axios/api';
import { formatDuration } from '@/utils/formatters';

// 创建一个Promise引用，用于跟踪正在进行的请求
let fetchPromise = null;

// 创建状态管理
const useRecommendationStore = create((set, get) => ({
    // 今日推荐歌曲数据
    todayRecommendations: [],
    // 加载状态
    isLoading: false,
    // 错误信息
    error: null,
    // 上次获取时间
    lastFetched: null,

    // 获取今日推荐歌曲
    fetchTodayRecommendations: async () => {
        // 如果已经有数据，则直接返回
        if (get().todayRecommendations.length > 0) {
            // console.log('从缓存获取今日推荐数据');
            return get().todayRecommendations;
        }

        // 如果已经有请求在进行中，返回该请求的Promise
        if (fetchPromise) {
            // console.log('使用正在进行的今天推荐请求');
            return fetchPromise;
        }

        try {
            // 设置加载状态
            set({ isLoading: true, error: null });
            // console.log('从API获取今日推荐数据');

            // 发送请求获取今日推荐数据
            fetchPromise = playlistAPI.getPlaylistById(1)
                .then(responseData => {
                    if (responseData && responseData.songs && responseData.songs.length > 0) {
                        console.log('今日推荐数据:', responseData.songs);
                        
                        // 格式化歌曲数据
                        const formattedSongs = responseData.songs.map(song => ({
                            id: song.id,
                            title: song.title,
                            artist: song.artist,
                            songId: song.id,
                            //   img: song.cover_path || `http://8.217.105.136:5244/d/NicePlayMusic/recommend/songs/${song.id}.jpg`,
                            img: song.cover_path,
                            duration: formatDuration(song.duration),
                            // genre: song.genre,
                            file_path: song.file_path,
                            lrc_path: song.lrc_path,
                        }));

                        // 将数据存入状态管理
                        set({
                            todayRecommendations: formattedSongs,
                            isLoading: false,
                            lastFetched: new Date().toISOString()
                        });
                        return formattedSongs;
                    } else {
                        throw new Error('获取的数据格式不正确');
                    }
                })
                .catch(error => {
                    set({ error: error.message, isLoading: false });
                    throw error;
                })
                .finally(() => {
                    // 请求完成后，清除Promise引用
                    fetchPromise = null;
                });

            return fetchPromise;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            fetchPromise = null;
            throw error;
        }
    },

    // 重置状态
    resetRecommendations: () => {
        set({ todayRecommendations: [], lastFetched: null });
        fetchPromise = null;
    }
}));

export default useRecommendationStore;
