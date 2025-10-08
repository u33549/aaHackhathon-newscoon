import axios from 'axios';

// Axios instance oluştur - backend ile iletişim için temel yapılandırma
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '', // Proxy kullanımı için boş string
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
    // Hata durumlarını detaylı yönet
    let errorMessage = 'Bilinmeyen hata';
    let errorDetails = {};

    if (error.response) {
      // Backend'den hata yanıtı geldi
      const { status, data } = error.response;
      errorMessage = data?.message || data?.error || `HTTP ${status} Error`;
      errorDetails = {
        status,
        statusText: error.response.statusText,
        data: data,
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
      };

      console.error('Backend API Error:', {
        message: errorMessage,
        ...errorDetails,
      });
    } else if (error.request) {
      // İstek gönderildi ama yanıt alınamadı (network hatası)
      errorMessage = 'Sunucuya ulaşılamıyor (Network Error)';
      errorDetails = {
        code: error.code,
        url: error.config?.url,
      };

      console.error('Network Error:', errorDetails);
    } else {
      // İstek hazırlanırken hata oluştu
      errorMessage = error.message;
      console.error('Request Setup Error:', error.message);
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
