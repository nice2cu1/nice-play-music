import { create } from 'zustand';
import { playlistAPI } from '@/axios/api';
import useUserStore from '@/store/useUserStore';

// 创建一个Promise引用，用于跟踪正在进行的请求
let fetchPromise = null;

// 创建状态管理
const useRecentlyPlayedStore = create((set, get) => ({
  // 最近爱听歌单数据
  recentItems: [],
  // 加载状态
  isLoading: false,
  // 错误信息
  error: null,
  // 上次获取时间
  lastFetched: null,

  // 获取最近爱听歌单数据
  fetchRecentItems: async () => {
    // 如果已经有数据，则直接返回
    if (get().recentItems.length > 0) {
      console.log('从缓存获取最近爱听数据');
      return get().recentItems;
    }

    // 如果已经有请求在进行中，返回该请求的Promise
    if (fetchPromise) {
      console.log('使用正在进行的最近爱听请求');
      return fetchPromise;
    }

    try {
      // 设置加载状态
      set({ isLoading: true, error: null });
      console.log('从API获取最近爱听数据');

      // 获取当前用户ID
      const userId = useUserStore.getState().user?.id || 2; // 默认使用ID 2
      
      // 发送请求获取最近爱听歌单
      fetchPromise = playlistAPI.getRecentFavoritePlaylists(userId)
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            // 格式化最近爱听数据
            const formattedItems = data.map(item => ({
              id: item.playlist_id,
              title: item.playlist_name,
              tracks: item.tracks,
              plays: item.plays,
              description: item.description,
              img: item.cover_url,
              isPublic: item.is_public
            }));
            
            // 将数据存入状态管理
            set({ 
              recentItems: formattedItems, 
              isLoading: false,
              lastFetched: new Date().toISOString()
            });
            return formattedItems;
          } else {
            throw new Error('获取的最近爱听数据格式不正确');
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
  resetRecentItems: () => {
    set({ recentItems: [], lastFetched: null });
    fetchPromise = null;
  }
}));

export default useRecentlyPlayedStore;
