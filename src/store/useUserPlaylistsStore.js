import { create } from 'zustand';

// 创建用户歌单状态存储
const useUserPlaylistsStore = create((set) => ({
  // 用户所有歌单数据
  userPlaylists: [],
  
  // 加载状态
  isLoaded: false,
  
  // 设置用户歌单
  setUserPlaylists: (playlists) => set({
    userPlaylists: playlists,
    isLoaded: true,
  }),
  
  // 重置状态
  resetUserPlaylists: () => set({
    userPlaylists: [],
    isLoaded: false,
  }),
}));

export default useUserPlaylistsStore;
