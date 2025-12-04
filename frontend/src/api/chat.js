import axios from 'axios';

// 從環境變數讀取 API 網址
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// 建立 axios 實例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 秒超時（AI 回應可能需要較長時間）
});

// 添加請求攔截器，自動添加 JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加響應攔截器
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token 過期或無效，清除並重定向到登入頁
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    if (error.code === 'ECONNABORTED') {
      error.message = '請求超時，請檢查網路連接';
    } else if (error.code === 'ERR_NETWORK') {
      error.message = '無法連接到伺服器，請確認後端服務是否運行';
    } else if (error.response?.data) {
      error.message = error.response.data.message || `伺服器錯誤: ${error.response.status}`;
    }
    return Promise.reject(error);
  }
);

export const chatAPI = {
  // 創建新對話
  createConversation: async (data) => {
    const response = await apiClient.post('/conversations', data);
    return response.data;
  },

  // 獲取我的所有對話
  getMyConversations: async () => {
    const response = await apiClient.get('/conversations');
    return response.data;
  },

  // 獲取單個對話詳情
  getConversation: async (conversationId) => {
    const response = await apiClient.get(`/conversations/${conversationId}`);
    return response.data;
  },

  // 發送訊息
  sendMessage: async (conversationId, message) => {
    const response = await apiClient.post('/chat/send', {
      conversationId,
      message,
    });
    return response.data;
  },
};

