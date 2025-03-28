import axios from './axios';
import useUserStore from '../store/useUserStore';

// 用户相关API
export const userAPI = {
  // 用户登录 - 匹配 /login?identifier=email&password=pwd 格式
  login: async (identifier, password) => {
    try {
      const response = await axios.post('/login', null, {
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

    // 确保清除cookie时使用完全相同的cookie设置
    document.cookie = "isLogin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";

    console.log('已清除登录状态和Cookie');
  }
};


// 头像上传API
export const uploadAvatar = async (fileData, filename) => {
  try {
    const response = await axios.put('/uploadAvatars', fileData, {
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

// 导出API
export default {
  user: userAPI,
  uploadAvatar
};
