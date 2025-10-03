const express = require('express');
const {
  getAllNews,
  getNewsByGuid,
  createNews,
  createBulkNews,
  updateNewsByGuid,
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

// GUID'ye göre işlemler
router.route('/guid/:guid')
  .get(getNewsByGuid)
  .put(updateNewsByGuid)
  .delete(deleteNewsByGuid);

module.exports = router;
