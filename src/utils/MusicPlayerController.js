/**
 * 音乐播放控制器工具类
 * 负责控制歌曲播放并管理播放列表
 */
import useBannerStore from '../store/useBannerStore';
import useRankingStore from '../store/useRankingStore';
import useRecommendStore from '../store/useRecommendationStore';
import useLikedSongsStore from '../store/useLikedSongsStore';
import usePlayerStore from '../store/usePlayerStore';
import useCommonPlaylistStore from '../store/useCommonPlaylistStore';
import useUserStore from '@/store/useUserStore';
import { Howl } from 'howler';

class MusicPlayerController {

    // 单例实例
    static instance = null;

    /**
     * 获取MusicPlayerController的单例实例
     * @returns {MusicPlayerController} 单例实例
     */
    static getInstance() {
        if (!MusicPlayerController.instance) {
            MusicPlayerController.instance = new MusicPlayerController();
        }
        return MusicPlayerController.instance;
    }

    constructor() {
        // 防止直接实例化
        if (MusicPlayerController.instance) {
            return MusicPlayerController.instance;
        }

        // 播放列表
        this.playlist = [];
        // 当前播放的歌曲信息
        this.currentPlaying = null;
        // 当前播放列表ID
        this.currentPlaylistId = null;
        // 是否正在播放
        this.isPlaying = false;

        MusicPlayerController.instance = this;
    }

    playAudio(filePath) {
        if (typeof filePath !== 'string' || !filePath.trim()) {
            console.error('音频文件路径无效:', filePath);
            return;
        }

        if (this.audioPlayer && this.audioPlayer._src === filePath) {
            console.log('音频已加载，直接播放');
            this.audioPlayer.play();
            return;
        }

        if (this.audioPlayer) {
            this.audioPlayer.unload(); // 卸载当前音频
        }

        console.log(`尝试播放音频文件: ${filePath}`);

        this.audioPlayer = new Howl({
            src: [filePath],
            html5: true,
            format: ['mp3'], // 确保指定格式
            onload: () => {
                console.log('音频加载成功');
                this.audioPlayer.play();
            },
            onloaderror: (id, error) => {
                console.error(`音频加载失败: ${error}, 文件路径: ${filePath}`);
            },
            onplayerror: (id, error) => {
                console.error(`音频播放失败: ${error}, 文件路径: ${filePath}`);
                this.audioPlayer.once('unlock', () => {
                    this.audioPlayer.play();
                });
            },
            onend: () => {
                console.log('音频播放结束');
                this.playNext(); // 播放下一首歌曲
            },
        });
    }

    /**
     * 处理音乐播放事件
     * @param {string|number} musicId - 播放的歌曲ID
     * @param {string} playlistId - 歌曲所属的歌单ID
     */
    handlePlayMusic = async (musicId, playlistId = null) => {
        try {
            // 在播放新音频之前，检查并停止当前播放的音频
            if (this.isPlayingMusic()) {
                this.stopMusic();
            }
            
            // 如果是banner歌曲，从状态管理中获取数据
            if (playlistId === "bannerSong") {
                const bannerStore = useBannerStore.getState();

                // 如果轮播数据还未加载，先加载数据
                if (bannerStore.bannerItems.length === 0) {
                    await bannerStore.fetchBannerItems();
                }

                // 获取轮播数据并填入播放列表
                const bannerItems = bannerStore.bannerItems;
                this.playlist = bannerItems.map(item => {
                    // 分离歌曲名称和作者
                    const parts = item.musicName.split(' - ');
                    const title = parts[0];
                    const artist = parts.length > 1 ? parts[1] : '';

                    return {
                        musicId: item.songId,
                        title: title,
                        artist: artist,
                        imageUrl: item.imageUrl,
                        lrc_path: item.lrc_path,
                        file_path: item.file_path,
                    };
                });

                // 找到并播放指定ID的歌曲
                const songToPlay = this.playlist.find(item => item.musicId.toString() === musicId.toString());

                if (songToPlay) {
                    this.currentPlaying = {
                        ...songToPlay,
                        playlistId,
                        startTime: new Date()
                    };

                    this.currentPlaylistId = playlistId;
                    this.isPlaying = true;

                    // 在控制台输出信息
                    console.log(`正在播放歌曲: ID=${musicId}`);
                    console.log(`所属歌单: ${playlistId}`);
                    console.log(this.playlist);
                    // 当前播放歌单在歌单列表中的索引
                    const playlistIndex = this.playlist.findIndex(item => item.musicId.toString() === musicId.toString());
                    console.log(`当前播放歌单在歌单列表中的索引: ${playlistIndex}`);

                    // 实际播放逻辑
                    this.playAudio(songToPlay.file_path);
                } else {
                    console.error(`未找到ID为${musicId}的歌曲`);
                }
            }
            // 如果是排行榜歌曲，从排行榜状态管理中获取数据
            else if (playlistId === "rank") {
                const rankingStore = useRankingStore.getState();

                // 如果排行榜数据还未加载，先加载数据
                if (rankingStore.rankingItems.length === 0) {
                    await rankingStore.fetchRankingItems();
                }

                // 获取排行榜数据并填入播放列表
                const rankingItems = rankingStore.rankingItems;
                this.playlist = rankingItems.map(item => ({
                    musicId: item.songId,
                    title: item.title,
                    imageUrl: item.img,
                    artist: item.artist,
                    file_path: item.file_path,
                    lrc_path: item.lrc_path,
                }));

                // 找到并播放指定ID的歌曲
                const songToPlay = this.playlist.find(item => item.musicId.toString() === musicId.toString());

                if (songToPlay) {
                    this.currentPlaying = {
                        ...songToPlay,
                        playlistId,
                        startTime: new Date()
                    };

                    this.currentPlaylistId = playlistId;
                    this.isPlaying = true; // 设置为播放状态

                    // 在控制台输出信息
                    console.log(`正在播放排行榜歌曲: ID=${musicId}`);
                    console.log(`所属歌单: ${playlistId}`);
                    console.log(this.playlist);
                    // 当前播放歌单在歌单列表中的索引
                    const playlistIndex = this.playlist.findIndex(item => item.musicId.toString() === musicId.toString());
                    console.log(`当前播放歌单在歌单列表中的索引: ${playlistIndex}`);

                    // 实际播放逻辑
                    this.playAudio(songToPlay.file_path);
                } else {
                    console.error(`排行榜中未找到ID为${musicId}的歌曲`);
                }
            } else if (playlistId === "recommend") {

                const recommendStore = useRecommendStore.getState();
                // 如果推荐数据还未加载，先加载数据
                if (recommendStore.todayRecommendations.length === 0) {
                    await recommendStore.fetchTodayRecommendations();
                }
                // 获取推荐数据并填入播放列表
                const recommendItems = recommendStore.todayRecommendations;
                console.log("推荐歌曲数据:", recommendItems);
                
                this.playlist = recommendItems.map(item => ({
                    musicId: item.songId,
                    title: item.title,
                    imageUrl: item.img,
                    artist: item.artist,
                    file_path: item.file_path,
                    lrc_path: item.lrc_path,
                }));

                // 找到并播放指定ID的歌曲
                const songToPlay = this.playlist.find(item => item.musicId.toString() === musicId.toString());

                if (songToPlay) {
                    this.currentPlaying = {
                        ...songToPlay,
                        playlistId,
                        startTime: new Date()
                    };
                    this.currentPlaylistId = playlistId;
                    this.isPlaying = true; // 设置为播放状态

                    // 在控制台输出信息
                    console.log(`正在播放推荐歌曲: ID=${musicId}`);
                    console.log(`所属歌单: ${playlistId}`);
                    console.log(this.playlist);
                    // 当前播放歌单在歌单列表中的索引
                    const playlistIndex = this.playlist.findIndex(item => item.musicId.toString() === musicId.toString());
                    console.log(`当前播放歌单在歌单列表中的索引: ${playlistIndex}`);
                    // 当前歌曲的信息
                    console.log(`当前歌曲的信息:`, songToPlay);
                    
                    // 实际播放逻辑
                    this.playAudio(songToPlay.file_path);
                    console.log('播放路径:', songToPlay.file_path);
                    
                }
            }
            // 处理"我喜欢的音乐"播放列表
            else if (useLikedSongsStore.getState().playlistInfo &&
                playlistId === useLikedSongsStore.getState().playlistInfo.id) {
                const likedSongsStore = useLikedSongsStore.getState();

                // 获取喜欢的歌曲数据并填入播放列表
                const likedSongs = likedSongsStore.likedSongs;
                this.playlist = likedSongs.map(song => ({
                    musicId: song.id,
                    title: song.title,
                    artist: song.artist,
                    imageUrl: song.cover_path,
                    lrc_path: song.lrc_path,
                    file_path: song.file_path,
                }));

                // 找到并播放指定ID的歌曲
                const songToPlay = this.playlist.find(item => item.musicId.toString() === musicId.toString());

                if (songToPlay) {
                    this.currentPlaying = {
                        ...songToPlay,
                        playlistId,
                        startTime: new Date()
                    };

                    this.currentPlaylistId = playlistId;
                    this.isPlaying = true; // 设置为播放状态

                    // 在控制台输出信息
                    console.log(`正在播放喜欢的歌曲: ID=${musicId}`);
                    console.log(`所属歌单: ${playlistId}`);
                    console.log(this.playlist);

                    // 当前播放歌单在歌单列表中的索引
                    const playlistIndex = this.playlist.findIndex(item => item.musicId.toString() === musicId.toString());
                    console.log(`当前播放歌单在歌单列表中的索引: ${playlistIndex}`);

                    // 实际播放逻辑
                    this.playAudio(songToPlay.file_path);
                } else {
                    console.error(`喜欢的歌曲中未找到ID为${musicId}的歌曲`);
                }
            }
            // 处理用户歌单
            else if (playlistId) {
                // 通用歌单处理逻辑
                const commonPlaylistStore = useCommonPlaylistStore.getState();
                const commonPlaylistInfo = commonPlaylistStore.playlistInfo;
                const commonPlaylistSongs = commonPlaylistStore.playlist;
                
                console.log(`当前播放的歌单ID: ${playlistId}`);
                console.log(`当前播放的歌曲ID: ${musicId}`);
                console.log(`当前播放的歌单中的歌曲列表: ${JSON.stringify(commonPlaylistSongs)}`);
                console.log(`当前播放的歌单信息: ${JSON.stringify(commonPlaylistInfo)}`);

                // 检查歌单ID是否匹配
                if (commonPlaylistInfo && commonPlaylistInfo.id.toString() === playlistId.toString() && commonPlaylistSongs.length > 0) {
                    // 如果是已加载的通用歌单并且有歌曲数据
                    this.playlist = commonPlaylistSongs.map(song => ({
                        musicId: song.id,
                        title: song.title,
                        artist: song.artist,
                        imageUrl: song.img || song.cover_path,
                        lrc_path: song.lrc_path,
                        file_path: song.file_path,
                    }));

                    // 找到并播放指定ID的歌曲
                    const songToPlay = this.playlist.find(item => item.musicId.toString() === musicId.toString());

                    if (songToPlay) {
                        this.currentPlaying = {
                            ...songToPlay,
                            playlistId,
                            startTime: new Date()
                        };

                        this.currentPlaylistId = playlistId;
                        this.isPlaying = true;

                        console.log(`正在播放通用歌单歌曲: ID=${musicId}`);
                        console.log(`所属歌单: ${playlistId}`);
                        console.log(this.playlist);

                        // 实际播放逻辑
                        this.playAudio(songToPlay.file_path);
                    } else {
                        console.error(`通用歌单中未找到ID为${musicId}的歌曲`);
                    }
                } else {
                    console.error(`未找到ID为${playlistId}的歌单数据，或歌单中没有歌曲`);
                }
            }
            else {
                console.error(`未知的歌单ID: ${playlistId}`);
                return;
            }

            // 成功处理播放后，更新全局状态管理
            if (this.currentPlaying) {
                usePlayerStore.getState().setCurrentPlaying(this.currentPlaying);
                usePlayerStore.getState().setPlaylist(this.playlist);
                usePlayerStore.getState().setIsPlaying(this.isPlaying);

                // 更新selectedMusic
                useUserStore.getState().setSelectedMusic(this.currentPlaying.musicId);
                
            }
        } catch (error) {
            console.error("播放音乐时出错:", error);
        }
    };

    /**
     * 获取当前播放状态
     * @returns {boolean} 是否正在播放
     */
    isPlayingMusic() {
        return this.isPlaying;
    }

    /**
     * 设置播放状态
     * @param {boolean} state - 播放状态
     */
    setPlayingState(state) {
        this.isPlaying = Boolean(state);
    }

    /**
     * 暂停当前播放的音乐
     */
    pauseMusic() {
        if (this.currentPlaying) {
            console.log(`暂停播放歌曲: ID=${this.currentPlaying.musicId}`);
            this.isPlaying = false;

            // 更新状态管理
            usePlayerStore.getState().setIsPlaying(false);

            this.audioPlayer.pause(); // 暂停音频播放
            return true; // 返回操作成功状态
        }
        return false;
    }

    /**
     * 继续播放当前音乐
     */
    resumeMusic() {
        if (this.currentPlaying) {
            console.log(`继续播放歌曲: ID=${this.currentPlaying.musicId}`);
            this.isPlaying = true;

            // 更新状态管理
            usePlayerStore.getState().setIsPlaying(true);

            this.audioPlayer.play(); // 继续播放音频
            return true; // 返回操作成功状态
        }
        return false;
    }

    /**
     * 停止播放当前音乐
     */
    stopMusic() {
        if (this.currentPlaying) {
            console.log(`停止播放歌曲: ID=${this.currentPlaying.musicId}`);
            this.currentPlaying = null;
            this.isPlaying = false; // 设置为非播放状态

            // 停止并卸载音频资源
            if (this.audioPlayer) {
                this.audioPlayer.stop();
                this.audioPlayer.unload();
                this.audioPlayer = null;
            }

            // 更新状态管理
            usePlayerStore.getState().setCurrentPlaying(null);
            usePlayerStore.getState().setIsPlaying(false);
        }
    }

    /**
     * 获取当前播放列表
     * @returns {Array} 播放列表
     */
    getPlaylist() {
        return this.playlist;
    }

    /**
     * 获取当前播放的歌曲信息
     * @returns {Object|null} 当前播放的歌曲信息
     */
    getCurrentPlaying() {
        return this.currentPlaying;
    }

    /**
     * 播放下一首歌曲
     */
    playNext() {
        if (!this.currentPlaying || this.playlist.length === 0) return;

        const currentIndex = this.playlist.findIndex(
            item => item.musicId.toString() === this.currentPlaying.musicId.toString()
        );

        if (currentIndex >= 0 && currentIndex < this.playlist.length - 1) {
            const nextSong = this.playlist[currentIndex + 1];
            this.handlePlayMusic(nextSong.musicId, this.currentPlaylistId);
        }

        // 如果当前歌曲是最后一首，则循环播放第一首
        else if (currentIndex === this.playlist.length - 1) {
            const firstSong = this.playlist[0];
            this.handlePlayMusic(firstSong.musicId, this.currentPlaylistId);
        }

    }

    /**
     * 播放上一首歌曲
     */
    playPrevious() {
        if (!this.currentPlaying || this.playlist.length === 0) return;

        const currentIndex = this.playlist.findIndex(
            item => item.musicId.toString() === this.currentPlaying.musicId.toString()
        );

        if (currentIndex > 0) {
            const prevSong = this.playlist[currentIndex - 1];
            this.handlePlayMusic(prevSong.musicId, this.currentPlaylistId);
        }

        // 如果当前歌曲是第一首，则循环播放最后一首
        else if (currentIndex === 0) {
            const lastSong = this.playlist[this.playlist.length - 1];
            this.handlePlayMusic(lastSong.musicId, this.currentPlaylistId);
        }

    }
}

// 导出类和单例实例
export default MusicPlayerController;
export const playerInstance = MusicPlayerController.getInstance();
