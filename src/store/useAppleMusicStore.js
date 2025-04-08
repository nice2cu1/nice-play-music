import { create } from 'zustand';

const useAppleMusicStore = create((set) => ({
  appleMusicPlaylists: [],
  isLoaded: false, // 标记数据是否已加载

  // 设置Apple Music歌单
  setAppleMusicPlaylists: (playlists) => set({ 
    appleMusicPlaylists: playlists,
    isLoaded: true 
  }),

  // 重置歌单数据
  resetAppleMusicPlaylists: () => set({ 
    appleMusicPlaylists: [],
    isLoaded: false 
  }),
}));

export default useAppleMusicStore;
