import api from './api';

// ====================================
// HABER YIĞINLARI (STACKS) API SERVİSLERİ
// ====================================

/**
 * Tüm haber yığınlarını getir - filtreleme ve sıralama destekli
 * @param {Object} params - Query parametreleri
 * @param {string} params.status - Durum: "pending" | "approved" | "rejected"
 * @param {boolean} params.isFeatured - Öne çıkarılan mı?
 * @param {string} params.tags - Virgülle ayrılmış etiketler
 * @param {number} params.limit - Maksimum sonuç sayısı
 * @param {string} params.sortBy - Sıralama alanı: "createdAt" | "viewCount" | "title"
 * @param {string} params.sortOrder - Sıralama yönü: "asc" | "desc"
 */
export const getAllStacks = async (params = {}) => {
  return await api.get('/api/stacks', { params });
};

/**
 * ID'ye göre tek haber yığını getir (görüntülenme sayısını artırır)
 * @param {string} stackId - Haber yığınının MongoDB ObjectId değeri
 */
export const getStackById = async (stackId) => {
  return await api.get(`/api/stacks/${stackId}`);
};

/**
 * Yeni haber yığını oluştur
 * @param {Object} stackData - Haber yığını verisi
 * @param {string} stackData.title - Yığın başlığı (zorunlu)
 * @param {string} stackData.description - Açıklama (opsiyonel)
 * @param {Array} stackData.news - Haber GUID'leri dizisi (opsiyonel)
 * @param {string} stackData.status - Durum (varsayılan: "pending")
 * @param {Array} stackData.tags - Etiketler dizisi (opsiyonel)
 * @param {boolean} stackData.isFeatured - Öne çıkarılan mı? (varsayılan: false)
 */
export const createStack = async (stackData) => {
  return await api.post('/api/stacks', stackData);
};

/**
 * Haber yığını güncelle
 * @param {string} stackId - Güncellenecek yığının ID'si
 * @param {Object} updateData - Güncellenecek veriler
 */
export const updateStackById = async (stackId, updateData) => {
  return await api.put(`/api/stacks/${stackId}`, updateData);
};

/**
 * Haber yığını sil
 * @param {string} stackId - Silinecek yığının ID'si
 */
export const deleteStackById = async (stackId) => {
  return await api.delete(`/api/stacks/${stackId}`);
};

/**
 * Haber yığınına haber ekle
 * @param {string} stackId - Haber yığınının ID'si
 * @param {string} newsGuid - Eklenecek haberin GUID'i
 */
export const addNewsToStack = async (stackId, newsGuid) => {
  return await api.post(`/api/stacks/${stackId}/addNews`, { newsGuid });
};

/**
 * Haber yığınından haber çıkar
 * @param {string} stackId - Haber yığınının ID'si
 * @param {string} newsGuid - Çıkarılacak haberin GUID'i
 */
export const removeNewsFromStack = async (stackId, newsGuid) => {
  return await api.post(`/api/stacks/${stackId}/removeNews`, { newsGuid });
};

// Kullanışlı yardımcı fonksiyonlar

/**
 * Onaylanmış haber yığınlarını getir
 * @param {number} limit - Maksimum sonuç sayısı
 */
export const getApprovedStacks = async (limit = 10) => {
  return await getAllStacks({ status: 'approved', limit });
};

/**
 * Öne çıkarılan haber yığınlarını getir
 * @param {number} limit - Maksimum sonuç sayısı
 */
export const getFeaturedStacks = async (limit = 5) => {
  return await getAllStacks({ isFeatured: true, limit });
};

/**
 * En popüler haber yığınlarını getir (görüntülenme sayısına göre)
 * @param {number} limit - Maksimum sonuç sayısı
 */
export const getPopularStacks = async (limit = 10) => {
  return await getAllStacks({
    sortBy: 'viewCount',
    sortOrder: 'desc',
    limit
  });
};

/**
 * Etiketlere göre haber yığınlarını getir
 * @param {Array} tags - Etiket dizisi
 * @param {number} limit - Maksimum sonuç sayısı
 */
export const getStacksByTags = async (tags, limit = 10) => {
  return await getAllStacks({
    tags: tags.join(','),
    limit
  });
};
