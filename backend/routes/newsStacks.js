const express = require('express');
const router = express.Router();
const {
  getAllNewsStacks,
  getNewsStackById,
  createNewsStack,
  updateNewsStack,
  deleteNewsStack,
  addNewsToStack,
  removeNewsFromStack
} = require('../controllers/newsStacksController');

// GET /api/stacks - Tüm haber yığınlarını getir
router.get('/', getAllNewsStacks);

// GET /api/stacks/:id - ID'ye göre haber yığını getir
router.get('/:id', getNewsStackById);

// POST /api/stacks - Yeni haber yığını oluştur
router.post('/', createNewsStack);

// PUT /api/stacks/:id - Haber yığını güncelle
router.put('/:id', updateNewsStack);

// DELETE /api/stacks/:id - Haber yığını sil
router.delete('/:id', deleteNewsStack);

// POST /api/stacks/:id/addNews - Haber yığınına haber ekle
router.post('/:id/addNews', addNewsToStack);

// POST /api/stacks/:id/removeNews - Haber yığınından haber çıkar
router.post('/:id/removeNews', removeNewsFromStack);

module.exports = router;
