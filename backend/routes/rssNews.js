const express = require('express');
const {
  getAllNews,
  getNewsById,
  getNewsByGuid,
  createNews,
  createBulkNews,
  updateNews,
  updateNewsByGuid,
  deleteNews,
  deleteNewsByGuid
} = require('../controllers/rssNewsController');

const router = express.Router();

// Tüm haberler ve yeni haber oluşturma
router.route('/')
  .get(getAllNews)
  .post(createNews);

// Toplu haber ekleme
router.route('/bulk')
  .post(createBulkNews);

// ID'ye göre işlemler
router.route('/:id')
  .get(getNewsById)
  .put(updateNews)
  .delete(deleteNews);

// GUID'ye göre işlemler
router.route('/guid/:guid')
  .get(getNewsByGuid)
  .put(updateNewsByGuid)
  .delete(deleteNewsByGuid);

module.exports = router;
