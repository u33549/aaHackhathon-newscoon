const express = require('express');
const router = express.Router();
const {
  getAllImages,
  getImageById,
  getImageByNewsStackId,
  createOrUpdateImage,
  updateImageById,
  updateImageByNewsStackId,
  deleteImageById,
  deleteImageByNewsStackId
} = require('../controllers/newsStackImagesController');

// Tüm resimleri getir (GET)
router.get('/', getAllImages);

// ID'ye göre resim getir (GET)
router.get('/:id', getImageById);

// NewsStack ID'ye göre resim getir (GET)
router.get('/news/:newsStackId', getImageByNewsStackId);

// Base64 resim yükle/güncelle (POST) - API key gerekli
router.post('/', createOrUpdateImage);

// ID'ye göre resim güncelle (PUT) - API key gerekli
router.put('/:id', updateImageById);

// NewsStack ID'ye göre resim güncelle (PUT) - API key gerekli
router.put('/news/:newsStackId', updateImageByNewsStackId);

// ID'ye göre resim sil (DELETE) - API key gerekli
router.delete('/:id', deleteImageById);

// NewsStack ID'ye göre resim sil (DELETE) - API key gerekli
router.delete('/news/:newsStackId', deleteImageByNewsStackId);

module.exports = router;
