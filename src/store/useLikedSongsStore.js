import { create } from 'zustand';

// 创建喜欢的音乐状态存储
const useLikedSongsStore = create((set) => ({
  // 喜欢的音乐列表数据
  likedSongs: [],
  
  // 歌单信息
  playlistInfo: null,
  
  // 加载状态
  isLoaded: false,
  
  // 设置喜欢的音乐列表
  setLikedSongs: (songs, playlistInfo) => set({
    likedSongs: songs,
    playlistInfo: playlistInfo,
    isLoaded: true,
  }),
  
  // 重置状态
  resetLikedSongs: () => set({
    likedSongs: [],
    playlistInfo: null,
    isLoaded: false,
  }),
}));

export default useLikedSongsStore;
