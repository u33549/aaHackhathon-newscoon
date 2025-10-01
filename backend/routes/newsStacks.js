var express = require('express');
var router = express.Router();

const {
  getAllNewsStacks,
  getNewsStackById,
  createNewsStack,
  updateNewsStack,
  deleteNewsStack,
  addNewsToStack,
  removeNewsFromStack
} = require('../controllers/newsStacksController');

// Tüm haber yığınlarını getir (GET /api/stacks)
router.get('/', getAllNewsStacks);

// ID'ye göre haber yığını getir (GET /api/stacks/:id)
router.get('/:id', getNewsStackById);

// Yeni haber yığını oluştur (POST /api/stacks)
router.post('/', createNewsStack);

// Haber yığını güncelle (PUT /api/stacks/:id)
router.put('/:id', updateNewsStack);

// Haber yığını sil (DELETE /api/stacks/:id)
router.delete('/:id', deleteNewsStack);

// Haber yığınına haber ekle (POST /api/stacks/:id/addNews)
router.post('/:id/addNews', addNewsToStack);

// Haber yığınından haber çıkar (POST /api/stacks/:id/removeNews)
router.post('/:id/removeNews', removeNewsFromStack);

module.exports = router;
