const RssNews = require('../models/RssNews');

// Tüm haberleri getir (filtreleme ve limitlemeli)
exports.getAllNews = async (req, res) => {
  try {
    const { pubDate, isInAnyStack, isUsable, limit = -1 } = req.query;

    // Filtreleme koşullarını oluştur
    const filter = {};

    // pubDate filtresi
    if (pubDate) {
      // pubDate tam eşleşme veya belirli bir tarihten sonra/önce (pubDate[gt], pubDate[lt] formatında)
      if (typeof pubDate === 'object') {
        Object.keys(pubDate).forEach(key => {
          filter.pubDate = filter.pubDate || {};
          filter.pubDate[`$${key}`] = pubDate[key];
        });
      } else {
        filter.pubDate = pubDate;
      }
    }

    // isInAnyStack filtresi (boolean değere dönüştür)
    if (isInAnyStack !== undefined) {
      filter.isInAnyStack = isInAnyStack === 'true';
    }

    // isUsable filtresi (boolean değere dönüştür)
    if (isUsable !== undefined) {
      filter.isUsable = isUsable === 'true';
    }

    // Sorguyu oluştur ve sırala (en yeni haberleri önce getir)
    let query = RssNews.find(filter).sort({ pubDate: -1 });

    // Limit uygula (limit -1 ise hepsini getir)
    if (limit && parseInt(limit) > 0) {
      query = query.limit(parseInt(limit));
    }

    // Sorguyu çalıştır
    const news = await query;

    res.status(200).json({
      success: true,
      count: news.length,
      data: news
    });
  } catch (error) {
    console.error('Haber getirme hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Sunucu hatası'
    });
  }
};

// ID'ye göre tek bir haber getir
exports.getNewsById = async (req, res) => {
  try {
    const news = await RssNews.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        error: 'Haber bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Sunucu hatası'
    });
  }
};

// GUID'ye göre haber getir
exports.getNewsByGuid = async (req, res) => {
  try {
    const news = await RssNews.findOne({ guid: req.params.guid });

    if (!news) {
      return res.status(404).json({
        success: false,
        error: 'Haber bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Sunucu hatası'
    });
  }
};

// Yeni haber oluştur
exports.createNews = async (req, res) => {
  try {
    // GUID kontrolü yap
    const existingNews = await RssNews.findOne({ guid: req.body.guid });

    if (existingNews) {
      return res.status(400).json({
        success: false,
        error: 'Bu GUID ile daha önce bir haber kaydedilmiş'
      });
    }

    const news = await RssNews.create(req.body);

    res.status(201).json({
      success: true,
      data: news
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);

      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Sunucu hatası'
      });
    }
  }
};

// Toplu haber oluştur (birden fazla haber eklemek için)
exports.createBulkNews = async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        error: 'Toplu ekleme için dizi formatında veri gönderilmelidir'
      });
    }

    const newsItems = req.body;
    const results = [];

    // Her bir haber için işlem yap
    for (const item of newsItems) {
      // GUID kontrolü yap
      const existingNews = await RssNews.findOne({ guid: item.guid });

      if (existingNews) {
        // Varsa güncelleme yapma, sadece bilgi ver
        results.push({
          guid: item.guid,
          status: 'skipped',
          message: 'Bu GUID ile daha önce bir haber kaydedilmiş'
        });
      } else {
        // Yoksa yeni kayıt oluştur
        const news = await RssNews.create(item);
        results.push({
          guid: item.guid,
          status: 'created',
          id: news._id
        });
      }
    }

    res.status(201).json({
      success: true,
      results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Sunucu hatası'
    });
  }
};

// Haberi güncelle
exports.updateNews = async (req, res) => {
  try {
    let news = await RssNews.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        error: 'Haber bulunamadı'
      });
    }

    news = await RssNews.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Sunucu hatası'
    });
  }
};

// GUID ile haber güncelle
exports.updateNewsByGuid = async (req, res) => {
  try {
    let news = await RssNews.findOne({ guid: req.params.guid });

    if (!news) {
      return res.status(404).json({
        success: false,
        error: 'Haber bulunamadı'
      });
    }

    news = await RssNews.findOneAndUpdate({ guid: req.params.guid }, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Sunucu hatası'
    });
  }
};

// Haberi sil
exports.deleteNews = async (req, res) => {
  try {
    const news = await RssNews.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        error: 'Haber bulunamadı'
      });
    }

    await news.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Sunucu hatası'
    });
  }
};

// GUID ile haberi sil
exports.deleteNewsByGuid = async (req, res) => {
  try {
    const news = await RssNews.findOne({ guid: req.params.guid });

    if (!news) {
      return res.status(404).json({
        success: false,
        error: 'Haber bulunamadı'
      });
    }

    await news.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Sunucu hatası'
    });
  }
};
