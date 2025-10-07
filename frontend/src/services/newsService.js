import api from './api';

// ================================
// HABER (RSS NEWS) API SERVİSLERİ
// ================================

/**
 * Tüm haberleri getir - filtreleme ve sayfalama destekli
 * @param {Object} params - Query parametreleri
 * @param {string} params.pubDate - Yayın tarihi (YYYY-MM-DD)
 * @param {boolean} params.isInAnyStack - Herhangi bir yığında mı?
 * @param {boolean} params.isUsable - Kullanılabilir mi?
 * @param {string} params.category - Haber kategorisi
 * @param {number} params.limit - Maksimum sonuç sayısı
 */
export const getAllNews = async (params = {}) => {
  return await api.get('/api/news', { params });
};

/**
 * GUID'ye göre tek haber getir
 * @param {string} guid - Haberin benzersiz GUID değeri
 */
export const getNewsByGuid = async (guid) => {
  return await api.get(`/api/news/guid/${guid}`);
};

/**
 * Yeni haber oluştur
 * @param {Object} newsData - Haber verisi
 * @param {string} newsData.guid - Benzersiz GUID (zorunlu)
 * @param {string} newsData.link - Haber URL'i (zorunlu)
 * @param {string} newsData.title - Haber başlığı (zorunlu)
 * @param {string} newsData.description - Haber açıklaması (zorunlu)
 * @param {string} newsData.pubDate - Yayın tarihi RFC formatında (zorunlu)
 * @param {string} newsData.image - Haber görsel URL'i (opsiyonel)
 * @param {string} newsData.category - Haber kategorisi (opsiyonel)
 */
export const createNews = async (newsData) => {
  return await api.post('/api/news', newsData);
};

/**
 * Toplu haber oluştur - birden fazla haberi tek seferde ekle
 * @param {Array} newsArray - Haber verisi dizisi
 */
export const createBulkNews = async (newsArray) => {
  return await api.post('/api/news/bulk', newsArray);
};

/**
 * GUID'ye göre haber güncelle
 * @param {string} guid - Güncellenecek haberin GUID'i
 * @param {Object} updateData - Güncellenecek veriler
 */
export const updateNewsByGuid = async (guid, updateData) => {
  return await api.put(`/api/news/guid/${guid}`, updateData);
};

/**
 * GUID'ye göre haber sil
 * @param {string} guid - Silinecek haberin GUID'i
 */
export const deleteNewsByGuid = async (guid) => {
  return await api.delete(`/api/news/guid/${guid}`);
};

// Kullanışlı yardımcı fonksiyonlar

/**
 * Kategoriye göre haberleri getir
 * @param {string} category - Haber kategorisi
 * @param {number} limit - Maksimum sonuç sayısı
 */
export const getNewsByCategory = async (category, limit = 10) => {
  return await getAllNews({ category, limit });
};

/**
 * Son haberleri getir
 * @param {number} limit - Maksimum sonuç sayısı
 */
export const getLatestNews = async (limit = 20) => {
  return await getAllNews({ limit });
};

/**
 * Kullanılabilir haberleri getir
 * @param {number} limit - Maksimum sonuç sayısı
 */
export const getUsableNews = async (limit = 50) => {
  return await getAllNews({ isUsable: true, limit });
};

export const newsService = {
  getAllNews,
  getNewsByGuid,
  createNews,
  createBulkNews,
  updateNewsByGuid,
  deleteNewsByGuid,
  getNewsByCategory,
  getLatestNews,
  getUsableNews
};

export default newsService;
