const express = require('express');
const router = express.Router();

/* GET API durum kontrolü. */
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'API çalışıyor',
    version: '1.0.0'
  });
});

module.exports = router;
