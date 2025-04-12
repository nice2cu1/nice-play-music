import { create } from "zustand";

// 创建通用的播放列表状态存储
const useCommonPlaylistStore = create((set) => ({
  // 播放列表数据
  playlist: [],

  // 歌单信息
  playlistInfo: null,

  // 加载状态
  isLoaded: false,

  // 设置播放列表
  setPlaylist: (playlist, playlistInfo) =>
    set({
      playlist: playlist,
      playlistInfo: playlistInfo,
      isLoaded: true,
    }),

  // 重置状态
  resetPlaylist: () =>
    set({
      playlist: [],
      playlistInfo: null,
      isLoaded: false,
    }),
}));

export default useCommonPlaylistStore;