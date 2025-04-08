import { create } from 'zustand';

const useRecommendPlaylistStore = create((set) => ({
  recommendPlaylists: [],
  isLoaded: false, // 标记数据是否已加载

  // 设置推荐歌单
  setRecommendPlaylists: (playlists) => set({ 
    recommendPlaylists: playlists,
    isLoaded: true 
  }),

  // 重置歌单数据
  resetRecommendPlaylists: () => set({ 
    recommendPlaylists: [],
    isLoaded: false 
  }),
}));

export default useRecommendPlaylistStore;
