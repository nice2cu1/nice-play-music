import { create } from 'zustand';
import MusicPlayerController, { playerInstance } from '../utils/MusicPlayerController';

/**
 * 播放器状态管理
 * 集中管理所有播放器相关状态，让UI和控制器共享同一个状态
 */
const usePlayerStore = create((set, get) => ({
    // 当前播放歌曲信息
    currentPlaying: null,
    // 播放列表
    playlist: [],
    // 是否正在播放
    isPlaying: false,

    // 初始化状态 - 从playerInstance获取初始状态
    initializeState: () => {
        set({
            currentPlaying: playerInstance.getCurrentPlaying(),
            playlist: playerInstance.getPlaylist(),
            isPlaying: playerInstance.isPlayingMusic()
        });
    },

    // 设置当前播放歌曲
    setCurrentPlaying: (song) => set({ currentPlaying: song }),

    // 设置播放列表
    setPlaylist: (playlist) => set({ playlist }),

    // 设置播放状态
    setIsPlaying: (isPlaying) => set({ isPlaying }),

    // 播放指定歌曲
    playSong: async (musicId, playlistId) => {
        await playerInstance.handlePlayMusic(musicId, playlistId);
        set({
            currentPlaying: playerInstance.getCurrentPlaying(),
            playlist: playerInstance.getPlaylist(),
            isPlaying: true
        });
    },

    // 暂停播放
    pauseMusic: () => {
        playerInstance.pauseMusic();
        set({ isPlaying: false });
    },

    // 继续播放
    resumeMusic: () => {
        playerInstance.resumeMusic();
        set({ isPlaying: true });
    },

    // 播放下一首
    playNext: () => {
        playerInstance.playNext();
        set({
            currentPlaying: playerInstance.getCurrentPlaying(),
            isPlaying: true
        });
    },

    // 播放上一首
    playPrevious: () => {
        playerInstance.playPrevious();
        set({
            currentPlaying: playerInstance.getCurrentPlaying(),
            isPlaying: true
        });
    },

    // 获取即将播放的歌曲
    getNextTwoSongs: () => {
        const { currentPlaying, playlist } = get();
        if (!currentPlaying || !playlist || playlist.length === 0) return [];

        const currentIndex = playlist.findIndex(
            item => item.musicId && currentPlaying.musicId &&
                item.musicId.toString() === currentPlaying.musicId.toString()
        );

        if (currentIndex === -1) return playlist.slice(0, 2);

        // 获取当前播放歌曲之后的两首歌曲
        const nextSongs = playlist.slice(currentIndex + 1, currentIndex + 3);

        // 如果没有足够的后续歌曲，可以从头循环
        if (nextSongs.length < 2 && playlist.length > 2) {
            const remainingCount = 2 - nextSongs.length;
            nextSongs.push(...playlist.slice(0, remainingCount));
        }

        return nextSongs;
    }
}));

export default usePlayerStore;
