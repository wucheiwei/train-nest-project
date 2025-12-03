import axios from 'axios';

// 從環境變數讀取 API 網址，Vite 會自動處理 .env 檔案
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

console.log('API Base URL:', API_BASE_URL);

// 建立 axios 實例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 秒超時
});

// 添加請求攔截器
apiClient.interceptors.request.use(
  (config) => {
    console.log('發送請求:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('請求錯誤:', error);
    return Promise.reject(error);
  }
);

// 添加響應攔截器
apiClient.interceptors.response.use(
  (response) => {
    console.log('收到響應:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('響應錯誤:', error);
    if (error.code === 'ECONNABORTED') {
      error.message = '請求超時，請檢查網路連接';
    } else if (error.code === 'ERR_NETWORK') {
      error.message = '無法連接到伺服器，請確認後端服務是否運行';
    } else if (error.response) {
      // 伺服器有響應，但狀態碼不在 2xx 範圍內
      error.message = error.response.data?.message || `伺服器錯誤: ${error.response.status}`;
    } else if (error.request) {
      // 請求已發送但沒有收到響應
      error.message = '無法連接到伺服器，請確認後端服務是否運行在 ' + API_BASE_URL;
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (data) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
  login: async (data) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },
};

