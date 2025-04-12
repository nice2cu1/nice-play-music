import { create } from 'zustand';
import { playlistAPI } from '@/axios/api';

// 创建一个Promise引用，用于跟踪正在进行的请求
let fetchPromise = null;

// 创建状态管理
const useRankingStore = create((set, get) => ({
  // 排行榜数据
  rankingItems: [],
  // 加载状态
  isLoading: false,
  // 错误信息
  error: null,
  // 上次获取时间
  lastFetched: null,

  // 获取排行榜数据
  fetchRankingItems: async () => {
    // 如果已经有数据，则直接返回
    if (get().rankingItems.length > 0) {
      // console.log('从缓存获取排行榜数据');
      return get().rankingItems;
    }

    // 如果已经有请求在进行中，返回该请求的Promise
    if (fetchPromise) {
      // console.log('使用正在进行的排行榜请求');
      return fetchPromise;
    }

    try {
      // 设置加载状态
      set({ isLoading: true, error: null });
      // console.log('从API获取排行榜数据');

      // 使用getPlaylistById(2)获取排行榜数据
      fetchPromise = playlistAPI.getPlaylistById(2)
        .then(responseData => {
          if (responseData && responseData.songs && responseData.songs.length > 0) {
            // 格式化排行榜数据
            const formattedItems = responseData.songs.map(song => ({
              id: song.id,
              title: song.title,
              artist: song.artist,
              songId: song.id,
              img: song.cover_path,
              file_path: song.file_path,
            }));
            
            // 将数据存入状态管理
            set({ 
              rankingItems: formattedItems, 
              isLoading: false,
              lastFetched: new Date().toISOString()
            });
            return formattedItems;
          } else {
            throw new Error('获取的排行榜数据格式不正确');
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
  resetRankingItems: () => {
    set({ rankingItems: [], lastFetched: null });
    fetchPromise = null;
  }
}));

export default useRankingStore;
