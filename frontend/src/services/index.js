// ================================
// ANA API SERVİS İNDEX DOSYASI
// ================================
// Tüm API servislerini tek yerden export et

// API instance'ı
export { default as api } from './api';

// Haber (News) servisleri
export {
  getAllNews,
  getNewsByGuid,
  createNews,
  createBulkNews,
  updateNewsByGuid,
  deleteNewsByGuid,
  getNewsByCategory,
  getLatestNews,
  getUsableNews
} from './newsService';

// Haber Yığınları (Stacks) servisleri
export {
  getAllStacks,
  getStackById,
  createStack,
  updateStackById,
  deleteStackById,
  addNewsToStack,
  removeNewsFromStack,
  getApprovedStacks,
  getFeaturedStacks,
  getPopularStacks,
  getStacksByTags
} from './stackService';

// Haber Yığını Resimleri (Images) servisleri
export {
  getAllStackImages,
  getStackImageById,
  getStackImageByStackId,
  uploadStackImage,
  updateStackImageById,
  updateStackImageByStackId,
  deleteStackImageById,
  deleteStackImageByStackId,
  fileToBase64,
  uploadImageFile,
  updateStackCoverImage
} from './imageService';

// Hızlı kullanım için gruplandırılmış objeler
export const newsAPI = {
  getAll: getAllNews,
  getByGuid: getNewsByGuid,
  create: createNews,
  createBulk: createBulkNews,
  update: updateNewsByGuid,
  delete: deleteNewsByGuid,
  getByCategory: getNewsByCategory,
  getLatest: getLatestNews,
  getUsable: getUsableNews
};

export const stacksAPI = {
  getAll: getAllStacks,
  getById: getStackById,
  create: createStack,
  update: updateStackById,
  delete: deleteStackById,
  addNews: addNewsToStack,
  removeNews: removeNewsFromStack,
  getApproved: getApprovedStacks,
  getFeatured: getFeaturedStacks,
  getPopular: getPopularStacks,
  getByTags: getStacksByTags
};

export const imagesAPI = {
  getAll: getAllStackImages,
  getById: getStackImageById,
  getByStackId: getStackImageByStackId,
  upload: uploadStackImage,
  updateById: updateStackImageById,
  updateByStackId: updateStackImageByStackId,
  deleteById: deleteStackImageById,
  deleteByStackId: deleteStackImageByStackId,
  uploadFile: uploadImageFile,
  updateCover: updateStackCoverImage
};
