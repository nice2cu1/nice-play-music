/**
 * 音乐播放控制器工具类
 * 负责控制歌曲播放并管理播放列表
 */
import useBannerStore from '../store/useBannerStore';
import useRankingStore from '../store/useRankingStore';
import useRecommendStore from '../store/useRecommendationStore';

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

        MusicPlayerController.instance = this;
    }

    /**
     * 处理音乐播放事件
     * @param {string|number} musicId - 播放的歌曲ID
     * @param {string} playlistId - 歌曲所属的歌单ID
     */
    async handlePlayMusic(musicId, playlistId) {
        // 如果是banner歌曲，从状态管理中获取数据
        if (playlistId === "bannerSong") {
            const bannerStore = useBannerStore.getState();

            // 如果轮播数据还未加载，先加载数据
            if (bannerStore.bannerItems.length === 0) {
                await bannerStore.fetchBannerItems();
            }

            // 获取轮播数据并填入播放列表
            const bannerItems = bannerStore.bannerItems;
            this.playlist = bannerItems.map(item => ({
                musicId: item.songId,
                title: item.musicName,
                imageUrl: item.imageUrl,
                lyric: item.lyric,
                genre: item.genre
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

                // 在控制台输出信息
                console.log(`正在播放歌曲: ID=${musicId}`);
                console.log(`所属歌单: ${playlistId}`);
                console.log(this.playlist);
                // 当前播放歌单在歌单列表中的索引
                const playlistIndex = this.playlist.findIndex(item => item.musicId.toString() === musicId.toString());
                console.log(`当前播放歌单在歌单列表中的索引: ${playlistIndex}`);

                // TODO: 实际播放逻辑在这里实现
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
                title: `${item.title} - ${item.artist}`,
                imageUrl: item.img,
                artist: item.artist,
                genre: item.genre
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

                // 在控制台输出信息
                console.log(`正在播放排行榜歌曲: ID=${musicId}`);
                console.log(`所属歌单: ${playlistId}`);
                console.log(this.playlist);
                // 当前播放歌单在歌单列表中的索引
                const playlistIndex = this.playlist.findIndex(item => item.musicId.toString() === musicId.toString());
                console.log(`当前播放歌单在歌单列表中的索引: ${playlistIndex}`);

                // TODO: 实际播放逻辑在这里实现
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
            this.playlist = recommendItems.map(item => ({
                musicId: item.songId,
                title: `${item.title} - ${item.artist}`,
                imageUrl: item.img,
                artist: item.artist,
                genre: item.genre
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

                // 在控制台输出信息
                console.log(`正在播放推荐歌曲: ID=${musicId}`);
                console.log(`所属歌单: ${playlistId}`);
                console.log(this.playlist);
                // 当前播放歌单在歌单列表中的索引
                const playlistIndex = this.playlist.findIndex(item => item.musicId.toString() === musicId.toString());
                console.log(`当前播放歌单在歌单列表中的索引: ${playlistIndex}`);

            }
        }
        else {
            // 其他播放列表的处理逻辑
            // TODO: 从其他来源获取播放列表数据

            this.currentPlaying = {
                musicId,
                playlistId,
                startTime: new Date()
            };

            this.currentPlaylistId = playlistId;

            // 在控制台输出信息
            console.log(`正在播放歌曲: ID=${musicId}`);
            console.log(`所属歌单: ${playlistId}`);

            // TODO: 实际播放逻辑在这里实现
        }
    }

    /**
     * 暂停当前播放的音乐
     */
    pauseMusic() {
        if (this.currentPlaying) {
            console.log(`暂停播放歌曲: ID=${this.currentPlaying.musicId}`);

            // TODO: 实际暂停逻辑在这里实现
        }
    }

    /**
     * 继续播放当前音乐
     */
    resumeMusic() {
        if (this.currentPlaying) {
            console.log(`继续播放歌曲: ID=${this.currentPlaying.musicId}`);

            // TODO: 实际继续播放逻辑在这里实现
        }
    }

    /**
     * 停止播放当前音乐
     */
    stopMusic() {
        if (this.currentPlaying) {
            console.log(`停止播放歌曲: ID=${this.currentPlaying.musicId}`);
            this.currentPlaying = null;

            // TODO: 实际停止播放逻辑在这里实现
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
    }
}

// 导出类和单例实例
export default MusicPlayerController;
export const playerInstance = MusicPlayerController.getInstance();
