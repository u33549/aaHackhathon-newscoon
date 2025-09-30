/**
 * API anahtarı doğrulama middleware'i
 * Sadece geçerli API anahtarına sahip isteklerin yazma işlemleri yapmasına izin verir
 */
const apiKeyAuth = (req, res, next) => {
  // GET isteklerine izin ver (herkes görüntüleyebilir)
  if (req.method === 'GET') {
    return next();
  }

  // POST, PUT, DELETE işlemleri için API anahtarı kontrolü
  const apiKey = req.header('x-api-key');

  // .env dosyasındaki API anahtarı ile kontrol
  // API_KEY=your-secret-api-key şeklinde .env dosyasında tanımlanmalı
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Bu işlem için geçerli bir API anahtarı gereklidir'
    });
  }

  next();
};

module.exports = apiKeyAuth;
