import api from './api';

// ========================================
// HABER YIĞINI RESİMLERİ API SERVİSLERİ
// ========================================

/**
 * Tüm resimleri getir - filtreleme destekli
 * @param {Object} params - Query parametreleri
 * @param {string} params.newsStackId - Belirli bir seriın resmini filtrelemek için
 * @param {number} params.limit - Maksimum sonuç sayısı
 */
export const getAllStackImages = async (params = {}) => {
  return await api.get('/api/news-stack-images', { params });
};

/**
 * ID'ye göre resim getir
 * @param {string} imageId - Resmin MongoDB ObjectId değeri
 */
export const getStackImageById = async (imageId) => {
  return await api.get(`/api/news-stack-images/${imageId}`);
};

/**
 * NewsStack ID'ye göre resim getir
 * @param {string} newsStackId - Haber seriının MongoDB ObjectId değeri
 */
export const getStackImageByStackId = async (newsStackId) => {
  return await api.get(`/api/news-stack-images/news/${newsStackId}`);
};

/**
 * Base64 resim yükle veya güncelle
 * @param {Object} imageData - Resim verisi
 * @param {string} imageData.newsStackId - İlgili haber seriının ObjectId değeri (zorunlu)
 * @param {string} imageData.photo - Base64 görsel verisi (data URI ile) (zorunlu)
 * @param {string} imageData.originalName - Dosya adı (opsiyonel)
 */
export const uploadStackImage = async (imageData) => {
  return await api.post('/api/news-stack-images', imageData);
};

/**
 * ID'ye göre resim güncelle
 * @param {string} imageId - Resmin MongoDB ObjectId değeri
 * @param {Object} updateData - Güncellenecek veriler
 * @param {string} updateData.photo - Yeni Base64 görsel (data URI)
 * @param {string} updateData.originalName - Yeni dosya adı
 */
export const updateStackImageById = async (imageId, updateData) => {
  return await api.put(`/api/news-stack-images/${imageId}`, updateData);
};

/**
 * NewsStack ID'ye göre resim güncelle
 * @param {string} newsStackId - Haber seriının MongoDB ObjectId değeri
 * @param {Object} updateData - Güncellenecek veriler
 * @param {string} updateData.photo - Yeni Base64 görsel (data URI)
 * @param {string} updateData.originalName - Yeni dosya adı
 */
export const updateStackImageByStackId = async (newsStackId, updateData) => {
  return await api.put(`/api/news-stack-images/news/${newsStackId}`, updateData);
};

/**
 * ID'ye göre resim sil
 * @param {string} imageId - Resmin MongoDB ObjectId değeri
 */
export const deleteStackImageById = async (imageId) => {
  return await api.delete(`/api/news-stack-images/${imageId}`);
};

/**
 * NewsStack ID'ye göre resim sil
 * @param {string} newsStackId - Haber seriının MongoDB ObjectId değeri
 */
export const deleteStackImageByStackId = async (newsStackId) => {
  return await api.delete(`/api/news-stack-images/news/${newsStackId}`);
};

// Kullanışlı yardımcı fonksiyonlar

/**
 * Dosyayı Base64'e çevir - resim yükleme işlemleri için
 * @param {File} file - Yüklenecek dosya
 * @returns {Promise<string>} Base64 string (data URI formatında)
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Resim dosyasını yükle ve haber seriına ata
 * @param {string} newsStackId - Haber seriının ID'si
 * @param {File} imageFile - Yüklenecek resim dosyası
 * @param {string} originalName - Orijinal dosya adı (opsiyonel)
 */
export const uploadImageFile = async (newsStackId, imageFile, originalName = null) => {
  const base64 = await fileToBase64(imageFile);
  return await uploadStackImage({
    newsStackId,
    photo: base64,
    originalName: originalName || imageFile.name
  });
};

/**
 * Haber seriının kapak resmini güncelle
 * @param {string} newsStackId - Haber seriının ID'si
 * @param {File} imageFile - Yeni resim dosyası
 * @param {string} originalName - Orijinal dosya adı (opsiyonel)
 */
export const updateStackCoverImage = async (newsStackId, imageFile, originalName = null) => {
  const base64 = await fileToBase64(imageFile);
  return await updateStackImageByStackId(newsStackId, {
    photo: base64,
    originalName: originalName || imageFile.name
  });
};
