import api from './api';

// ====================================
// HABER YIĞINLARI (STACKS) API SERVİSLERİ
// ====================================

/**
 * Tüm haber serilarını getir - filtreleme ve sıralama destekli
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
 * ID'ye göre tek haber seriı getir (görüntülenme sayısını artırır)
 * @param {string} stackId - Haber seriının MongoDB ObjectId değeri
 */
export const getStackById = async (stackId) => {
  return await api.get(`/api/stacks/${stackId}`);
};

/**
 * Yeni haber seriı oluştur
 * @param {Object} stackData - Yığın verisi
 * @returns {Promise} API yanıtı - oluşturulan stack CP ile birlikte döner
 * @note CP otomatik hesaplanır: Haber Sayısı × (45-52 arası rastgele sayı)
 */
export const createStack = async (stackData) => {
  try {
    const response = await api.post('/news-stacks', stackData);
    return response;
  } catch (error) {
    console.error('Stack oluşturma hatası:', error);
    throw error;
  }
};

/**
 * Haber seriı güncelle
 * @param {string} stackId - Yığın ID'si
 * @param {Object} updateData - Güncellenecek veriler
 * @note CP alanı otomatik hesaplanır, güncelleme verisine dahil edilmemelidir
 */
export const updateStack = async (stackId, updateData) => {
  // CP alanını güncelleme verisinden kaldır - otomatik hesaplanır
  const { xp, ...cleanUpdateData } = updateData;
  return await api.put(`/api/stacks/${stackId}`, cleanUpdateData);
};

/**
 * Haber seriı güncelle (alias for updateStack)
 * @param {string} stackId - Yığın ID'si
 * @param {Object} updateData - Güncellenecek veriler
 */
export const updateStackById = async (stackId, updateData) => {
  return await updateStack(stackId, updateData);
};

/**
 * Haber seriı sil
 * @param {string} stackId - Silinecek seriın ID'si
 */
export const deleteStackById = async (stackId) => {
  return await api.delete(`/api/stacks/${stackId}`);
};

/**
 * Haber seriına haber ekle
 * @param {string} stackId - Haber seriının ID'si
 * @param {string} newsGuid - Eklenecek haberin GUID'i
 */
export const addNewsToStack = async (stackId, newsGuid) => {
  return await api.post(`/api/stacks/${stackId}/addNews`, { newsGuid });
};

/**
 * Haber seriından haber çıkar
 * ÖNEMLI: Haber çıkarıldıktan sonra serida en az 3 haber kalmalıdır
 * @param {string} stackId - Haber seriının ID'si
 * @param {string} newsGuid - Çıkarılacak haberin GUID'i
 */
export const removeNewsFromStack = async (stackId, newsGuid) => {
  return await api.post(`/api/stacks/${stackId}/removeNews`, { newsGuid });
};

// Kullanışlı yardımcı fonksiyonlar

/**
 * Onaylanmış haber serilarını getir
 * @param {number} limit - Maksimum sonuç sayısı
 */
export const getApprovedStacks = async (limit = 10) => {
  return await getAllStacks({ status: 'approved', limit });
};

/**
 * Öne çıkarılan haber serilarını getir
 * @param {number} limit - Maksimum sonuç sayısı
 */
export const getFeaturedStacks = async (limit = 5) => {
  return await getAllStacks({ isFeatured: true, limit });
};

/**
 * En popüler haber serilarını getir (görüntülenme sayısına göre)
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
 * Etiketlere göre haber serilarını getir
 * @param {Array} tags - Etiket dizisi
 * @param {number} limit - Maksimum sonuç sayısı
 */
export const getStacksByTags = async (tags, limit = 10) => {
  return await getAllStacks({
    tags: tags.join(','),
    limit
  });
};

/**
 * CP'ye göre sıralı haber serilarını getir (en yüksekten en düşüğe)
 * @param {number} limit - Maksimum sonuç sayısı
 */
export const getStacksByCP = async (limit = 10) => {
  return await getAllStacks({
    sortBy: 'xp',
    sortOrder: 'desc',
    limit
  });
};

/**
 * En son eklenen haber serilarını getir (oluşturulma tarihine göre)
 * @param {number} limit - Maksimum sonuç sayısı
 */
export const getLatestStacks = async (limit = 20) => {
  return await getAllStacks({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    status: 'approved', // Sadece onaylanmış stackleri getir
    limit
  });
};
