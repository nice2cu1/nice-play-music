import axios from './axios';
import useUserStore from '../store/useUserStore';
import useRecommendationStore from '@/store/useRecommendationStore';
import useBannerStore from '@/store/useBannerStore';
import useRankingStore from '@/store/useRankingStore';
import useRecentlyPlayedStore from '@/store/useRecentlyPlayedStore';
import useAppleMusicStore from '@/store/useAppleMusicStore';
import useRecommendPlaylistStore from '@/store/useRecommendPlaylistStore';
import useLikedSongsStore from '@/store/useLikedSongsStore';
import useUserPlaylistsStore from '@/store/useUserPlaylistsStore';

// 用户相关API
export const userAPI = {
  // 用户登录
  login: async (identifier, password) => {
    try {
      const response = await axios.post('/user/login', null, {
        params: {
          identifier,
          password
        }
      });

      // 如果登录成功，存储用户数据到状态管理
      if (response.code === 200 && response.data) {
        // 确保响应中包含完整的用户数据
        if (!response.data.id || !response.data.username) {
          console.error('登录响应中缺少必要的用户数据:', response.data);
          throw new Error('无效的用户数据');
        }

        // 先存储用户数据到状态管理
        useUserStore.getState().login(response.data);

        // 设置cookie，有效期一年
        const oneYear = 365 * 24 * 60 * 60 * 1000;
        const expires = new Date(Date.now() + oneYear).toUTCString();
        document.cookie = `isLogin=1; path=/; expires=${expires}; SameSite=Lax`;

        console.log('登录成功，用户数据已存储:', response.data);
        console.log('登录状态:', useUserStore.getState().isLoggedIn);
      }

      return response;
    } catch (error) {
      console.error("登录失败:", error);
      throw error;
    }
  },

  // 用户注册
  register: (email, username, password) => {
    return axios.post('/register', { email, username, password });
  },

  // 注销方法
  logout: () => {
    // 清除状态 - 仅执行状态清除，不执行导航逻辑
    useUserStore.getState().logout();
    useRecommendationStore.getState().resetRecommendations();
    useBannerStore.getState().resetBannerItems();
    useRankingStore.getState().resetRankingItems();
    useRecentlyPlayedStore.getState().resetRecentItems();
    useAppleMusicStore.getState().resetAppleMusicPlaylists(); // 添加清除Apple Music歌单
    useRecommendPlaylistStore.getState().resetRecommendPlaylists(); // 添加清除推荐歌单
    useLikedSongsStore.getState().resetLikedSongs(); // 添加清除喜欢的音乐数据
    useUserPlaylistsStore.getState().resetUserPlaylists(); // 添加清除用户歌单数据

    // 确保清除cookie时使用完全相同的cookie设置
    document.cookie = "isLogin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";

    console.log('已清除登录状态和Cookie');
  }
};

// 头像上传API
export const uploadAvatar = async (fileData, filename) => {
  try {
    const response = await axios.put('/user/uploadAvatars', fileData, {
      params: {
        filename,
        userId: useUserStore.getState().user.id
      },
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    });
    return response;
  } catch (error) {
    console.error('头像上传失败:', error);
    throw error;
  }
};

// 首页轮播数据API
export const bannerAPI = {
  // 获取轮播数据
  getBannerSongs: async () => {
    try {
      console.log('获取首页轮播数据');
      const response = await axios.get('/banner-songs');
      console.log('轮播数据响应:', response);
      return response.data || response;
    } catch (error) {
      console.error('获取轮播数据失败:', error);
      throw error;
    }
  }
};

// 歌单相关API
export const playlistAPI = {
  // 获取指定ID的歌单
  getPlaylistById: async (playlistId) => {
    try {
      console.log(`发送获取歌单请求，ID: ${playlistId}`);
      const response = await axios.get(`/playlists/${playlistId}`);

      if (playlistId === 1) {
        // 如果是获取今日推荐，添加调试日志
        console.log('今日推荐API响应:', response);
      } else if (playlistId === 2) {
        // 如果是获取排行榜，添加调试日志
        console.log('排行榜API响应:', response);
      }

      return response.data || response;
    } catch (error) {
      console.error(`获取歌单ID:${playlistId}失败:`, error);
      throw error;
    }
  },

  // 获取推荐歌单列表
  getRecommendedPlaylists: async () => {
    try {
      const response = await axios.get('/playlists/recommend');
      return response;
    } catch (error) {
      console.error('获取推荐歌单失败:', error);
      throw error;
    }
  },

  // 获取Apple Music推荐歌单
  getAppleMusicPlaylists: async () => {
    try {
      const response = await axios.get('/playlists/applemusic');
      return response;
    } catch (error) {
      console.error('获取Apple Music歌单失败:', error);
      throw error;
    }
  },

  // 获取最近爱听歌单
  getRecentFavoritePlaylists: async (userId) => {
    try {
      console.log(`获取用户ID:${userId}的最近爱听歌单`);
      const response = await axios.get(`/recent-favorite-playlists/${userId}`);
      console.log('最近爱听歌单响应:', response);
      return response.data || response;
    } catch (error) {
      console.error(`获取用户ID:${userId}的最近爱听歌单失败:`, error);
      throw error;
    }
  },
  // 获取用户的所有歌单
  getUserPlaylists: async (userId) => {
    try {
      console.log(`获取用户ID:${userId}的所有歌单`);
      const response = await axios.get(`/playlists/user/${userId}`);
      console.log('用户歌单响应:', response);
      return response.data || response;
    } catch (error) {
      console.error(`获取用户ID:${userId}的歌单失败:`, error);
      throw error;
    }
  },
  // 获取"我喜欢的音乐"歌单
  getLikedSongs: async (userId) => {
    try {
      // 获取用户的所有歌单
      const response = await playlistAPI.getUserPlaylists(userId);
      console.log('获取到的用户歌单数据:', response);

      // 判断返回的数据结构，确保使用的是数组
      let playlists = [];

      // 如果是对象，检查是否有playlists属性
      if (Array.isArray(response.playlists)) {
        playlists = response.playlists;
      } else {
        // 如果没有明确的数组，尝试将对象的值转为数组
        const values = Object.values(response);
        if (values.length > 0 && Array.isArray(values[0])) {
          playlists = values[0];
        }
      }


      // 检查playlists是否为空
      if (!playlists || playlists.length === 0) {
        console.error('未找到用户歌单数据');
        throw new Error('未找到用户歌单数据');
      }

      // 在歌单列表中查找"我喜欢的音乐"
      const likedPlaylist = playlists.find(playlist =>
        playlist.name === "我喜欢的音乐"
      );

      if (!likedPlaylist) {
        console.error('未找到"我喜欢的音乐"歌单');
        throw new Error('未找到"我喜欢的音乐"歌单');
      }

      const playlistId = likedPlaylist.id || likedPlaylist.playlist_id;
      console.log(`找到"我喜欢的音乐"歌单，ID: ${playlistId}`);

      // 获取该歌单的详细内容
      const likedSongsDetail = await playlistAPI.getPlaylistById(playlistId);
      return likedSongsDetail;
    } catch (error) {
      console.error('获取"我喜欢的音乐"歌单失败:', error);
      throw error;
    }
  }

};

// 导出API
export default {
  user: userAPI,
  uploadAvatar,
  playlist: playlistAPI,
  banner: bannerAPI
};
