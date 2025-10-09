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
<<<<<<< HEAD
  getStacksByTags,
  getStacksByCP,
  getLatestStacks 
=======
  getStacksByTags
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
} from './stackService';

// Haber Yığını Resimleri (Images) servisleri
export {
<<<<<<< HEAD
  getAllStackImages, 
=======
  getAllStackImages,
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
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
<<<<<<< HEAD
=======
// Re-export edilen fonksiyonları kullanarak objeler oluştur
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
import * as newsServices from './newsService';
import * as stackServices from './stackService';
import * as imageServices from './imageService';

export const newsAPI = {
  getAll: newsServices.getAllNews,
  getByGuid: newsServices.getNewsByGuid,
  create: newsServices.createNews,
  createBulk: newsServices.createBulkNews,
  update: newsServices.updateNewsByGuid,
  delete: newsServices.deleteNewsByGuid,
  getByCategory: newsServices.getNewsByCategory,
  getLatest: newsServices.getLatestNews,
  getUsable: newsServices.getUsableNews
};

export const stacksAPI = {
  getAll: stackServices.getAllStacks,
  getById: stackServices.getStackById,
  create: stackServices.createStack,
  update: stackServices.updateStackById,
  delete: stackServices.deleteStackById,
  addNews: stackServices.addNewsToStack,
  removeNews: stackServices.removeNewsFromStack,
  getApproved: stackServices.getApprovedStacks,
  getFeatured: stackServices.getFeaturedStacks,
  getPopular: stackServices.getPopularStacks,
<<<<<<< HEAD
  getByTags: stackServices.getStacksByTags,
  getByCP: stackServices.getStacksByCP,
  getLatest: stackServices.getLatestStacks 
=======
  getByTags: stackServices.getStacksByTags
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
};

export const imagesAPI = {
  getAll: imageServices.getAllStackImages,
  getById: imageServices.getStackImageById,
  getByStackId: imageServices.getStackImageByStackId,
  upload: imageServices.uploadStackImage,
  updateById: imageServices.updateStackImageById,
  updateByStackId: imageServices.updateStackImageByStackId,
  deleteById: imageServices.deleteStackImageById,
  deleteByStackId: imageServices.deleteStackImageByStackId,
  uploadFile: imageServices.uploadImageFile,
  updateCover: imageServices.updateStackCoverImage
<<<<<<< HEAD
};
=======
};
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
