import axios from 'axios';
import { addToast } from '@heroui/react';

// 创建axios实例
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// 请求拦截器
instance.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    // 处理请求错误
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 创建Toast防抖
const toastControl = {
  networkErrorShown: false,
  lastErrorTime: 0,
  errorCount: 0,
  
  // 冷却时间 (ms)
  cooldown: 5000,
  
  showErrorToast(title, description, color = "danger") {
    const now = Date.now();
    
    // 如果是网络错误且在冷却期内
    if (title === "网络错误" && this.networkErrorShown) {
      this.errorCount++;
      return;
    }
    
    // 如果在冷却期内，不显示新Toast
    if (now - this.lastErrorTime < this.cooldown) {
      this.errorCount++;
      return;
    }
    
    // 显示Toast，可能包含累计的错误数量
    const errorCountText = this.errorCount > 0 ? `(+${this.errorCount}个类似错误)` : '';
    addToast({
      title: `${title} ${errorCountText}`,
      description,
      color,
      timeout: 3000,
    });
    
    // 重置状态
    this.lastErrorTime = now;
    this.errorCount = 0;
    
    // 如果是网络错误，设置标志
    if (title === "网络错误") {
      this.networkErrorShown = true;
      // 5秒后重置网络错误标志
      setTimeout(() => {
        this.networkErrorShown = false;
      }, this.cooldown);
    }
  }
};

// 响应拦截器
instance.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    const { response } = error;
    
    if (response) {
      // 根据状态码处理错误
      switch (response.status) {
        case 403:
          toastControl.showErrorToast("访问被拒绝", "您没有权限访问该资源");
          break;
        case 404:
          toastControl.showErrorToast("资源不存在", "请求的资源不存在", "warning");
          break;
        case 500:
          toastControl.showErrorToast("服务器错误", "服务器遇到了错误，请稍后再试");
          break;
        default:
          toastControl.showErrorToast("请求失败", response.data?.message || "未知错误");
      }
    } else {
      // 网络错误
      toastControl.showErrorToast("网络错误", "无法连接到服务器，请检查网络连接");
    }
    
    return Promise.reject(error);
  }
);

export default instance;
