var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
var cors = require('cors'); // CORS paketini ekledim

// .env dosyasından ortam değişkenlerini yükle
dotenv.config();

// MongoDB bağlantısı
const connectDB = require('./config/db');
connectDB();

// API anahtarı doğrulama middleware'i
const apiKeyAuth = require('./middleware/apiKeyAuth');

var indexRouter = require('./routes/index');
var rssNewsRouter = require('./routes/rssNews');
var newsStacksRouter = require('./routes/newsStacks');
var newsStackImagesRouter = require('./routes/newsStackImages');

var app = express();

// CORS ayarlarını yapılandırma
app.use(cors());

// view engine setup - frontend olmayacak, API odaklı
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' })); // Base64 resimler için limiti artırdık
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// API rotaları
app.use('/api', indexRouter);

// Haber API'leri için API anahtarı doğrulama middleware'ini ekle (OPTIONS hariç)
app.use('/api/news', (req, res, next) => {
  // OPTIONS request'leri için API key kontrolü yapma
  if (req.method === 'OPTIONS') {
    return next();
  }
  // Diğer metodlar için API key kontrolü yap
  return apiKeyAuth(req, res, next);
}, rssNewsRouter);

// Haber yığınları API'leri için API anahtarı doğrulama middleware'ini ekle (OPTIONS hariç)
app.use('/api/stacks', (req, res, next) => {
  // OPTIONS request'leri için API key kontrolü yapma
  if (req.method === 'OPTIONS') {
    return next();
  }
  // Diğer metodlar için API key kontrolü yap
  return apiKeyAuth(req, res, next);
}, newsStacksRouter);

// Haber yığını resimleri API'leri - okuma işlemleri serbest, yazma işlemleri API key gerektirir
app.use('/api/news-stack-images', (req, res, next) => {
  // GET ve OPTIONS istekleri için API key kontrolü yapma
  if (req.method === 'GET' || req.method === 'OPTIONS') {
    return next();
  }
  // POST, PUT, DELETE için API key kontrolü yap
  return apiKeyAuth(req, res, next);
}, newsStackImagesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // JSON hata yanıtı döndür
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Eğer doğrudan app.js çalıştırılırsa, buradaki port ayarları kullanılacak
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
