import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 创建用户状态存储
const useUserStore = create(
  persist(
    (set, get) => ({
      // 用户信息
      user: null,
      isLoggedIn: false,
      
      // 登录方法
      login: (userData) => {
        console.log('存储用户数据:', userData);
        set({
          user: userData,
          isLoggedIn: true,
        });
      },
      
      // 注销方法
      logout: () => set({
        user: null,
        isLoggedIn: false,
      }),
      
      // 更新用户资料
      updateProfile: (updatedData) => set((state) => ({
        user: { ...state.user, ...updatedData }
      })),
      
      // 更新头像
      updateAvatar: (avatarUrl) => set((state) => ({
        user: { ...state.user, avatar: avatarUrl }
      })),
      
      // 检查是否登录 - 新增方法
      checkAuth: () => {
        const state = get();
        // 检查用户数据和登录状态
        return state.isLoggedIn && state.user !== null;
      },
    }),
    {
      name: 'user-storage', // 持久化存储的名称
      storage: createJSONStorage(() => localStorage), // 使用localStorage存储
      // 确保敏感信息不会被过滤掉
      partialize: (state) => ({ 
        user: state.user,
        isLoggedIn: state.isLoggedIn 
      }),
    }
  )
);

// 检查初始化时的登录状态
if (typeof window !== 'undefined') {
  // 确保在客户端执行
  console.log('初始化用户状态:', useUserStore.getState());
}

export default useUserStore;
