import { create } from 'zustand';
import { bannerAPI } from '@/axios/api';

// 创建一个Promise引用，用于跟踪正在进行的请求
let fetchPromise = null;

// 创建状态管理
const useBannerStore = create((set, get) => ({
  // 轮播数据
  bannerItems: [],
  // 加载状态
  isLoading: false,
  // 错误信息
  error: null,
  // 上次获取时间
  lastFetched: null,

  // 获取轮播数据
  fetchBannerItems: async () => {
    // 如果已经有数据，则直接返回
    if (get().bannerItems.length > 0) {
      // console.log('从缓存获取轮播数据');
      return get().bannerItems;
    }

    // 如果已经有请求在进行中，返回该请求的Promise
    if (fetchPromise) {
      // console.log('使用正在进行的轮播数据请求');
      return fetchPromise;
    }

    try {
      // 设置加载状态
      set({ isLoading: true, error: null });
      // console.log('从API获取轮播数据');

      // 发送请求获取轮播数据
      fetchPromise = bannerAPI.getBannerSongs()
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            // 格式化轮播数据
            console.log('远程轮播数据:', data);
            const formattedItems = data.map(item => ({
              id: item.banner_id,
              title: item.banner_title,
              description: item.banner_description,
              bannerUrl: item.banner_cover_url,
              bannerCoverUrl: item.banner_cover_url,
              imageUrl: item.cover_url,
              musicName: `${item.song_title} - ${item.song_artist}`,
              lyric: item.lrc,
              songId: item.song_id,
              file_path: item.file_path,
            }));
            
            // 将数据存入状态管理
            set({ 
              bannerItems: formattedItems, 
              isLoading: false,
              lastFetched: new Date().toISOString()
            });
            return formattedItems;
          } else {
            throw new Error('获取的轮播数据格式不正确');
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
  resetBannerItems: () => {
    set({ bannerItems: [], lastFetched: null });
    fetchPromise = null;
  }
}));

export default useBannerStore;
