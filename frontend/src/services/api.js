import axios from 'axios';

// Axios instance oluştur - backend ile iletişim için temel yapılandırma
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - API key gerekli isteklerde otomatik ekleme
api.interceptors.request.use(
  (config) => {
    // POST, PUT, DELETE istekleri için API key ekle
    if (['post', 'put', 'delete'].includes(config.method)) {
      const apiKey = import.meta.env.VITE_API_KEY;
      if (apiKey) {
        config.headers['x-api-key'] = apiKey;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi ve yanıt işleme
api.interceptors.response.use(
  (response) => {
    return response.data; // Backend'den gelen data kısmını doğrudan döndür
  },
  (error) => {
    // Hata durumlarını yönet
    const errorMessage = error.response?.data?.message || error.message || 'Bilinmeyen hata';
    console.error('API Error:', errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
