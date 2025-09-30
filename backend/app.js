var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');

// .env dosyasından ortam değişkenlerini yükle
dotenv.config();

// MongoDB bağlantısı
const connectDB = require('./config/db');
connectDB();

// API anahtarı doğrulama middleware'i
const apiKeyAuth = require('./middleware/apiKeyAuth');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var rssNewsRouter = require('./routes/rssNews');

var app = express();

// view engine setup - frontend olmayacak, API odaklı
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// API rotaları
app.use('/api', indexRouter);
app.use('/api/users', usersRouter);

// Haber API'leri için API anahtarı doğrulama middleware'ini ekle
app.use('/api/news', apiKeyAuth, rssNewsRouter);

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

module.exports = app;
