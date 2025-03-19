import axios from 'axios';
import { addToast } from '@heroui/react';

// 创建axios实例
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
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

// 响应拦截器
instance.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    // 处理响应错误
    const { response } = error;
    
    if (response) {
      // 根据状态码处理错误
      switch (response.status) {
        case 403: // 禁止访问
          addToast({
            title: "访问被拒绝",
            description: "您没有权限访问该资源",
            color: "danger",
            timeout: 3000,
          });
          break;
          
        case 404: // 资源不存在
          addToast({
            title: "资源不存在",
            description: "请求的资源不存在",
            color: "warning",
            timeout: 3000,
          });
          break;
          
        case 500: // 服务器错误
          addToast({
            title: "服务器错误",
            description: "服务器遇到了错误，请稍后再试",
            color: "danger",
            timeout: 3000,
          });
          break;
          
        default:
          addToast({
            title: "请求失败",
            description: response.data?.message || "未知错误",
            color: "danger",
            timeout: 3000,
          });
      }
    } else {
      // 网络错误
      addToast({
        title: "网络错误",
        description: "无法连接到服务器，请检查网络连接",
        color: "danger",
        timeout: 3000,
      });
    }
    
    return Promise.reject(error);
  }
);

export default instance;
