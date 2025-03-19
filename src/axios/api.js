import axios from './axios';

// 用户相关API
export const userAPI = {
  // 用户登录 - 匹配 http://localhost:8080/login?identifier=email&password=pwd 格式
  login: (identifier, password) => {
    return axios.post('/login', null, { 
      params: { 
        identifier, 
        password 
      }
    });
  },
  
  // 用户注册
  register: (email, username, password) => {
    return axios.post('/register', { email, username, password });
  }
};

// 导出API
export default {
  user: userAPI
};
