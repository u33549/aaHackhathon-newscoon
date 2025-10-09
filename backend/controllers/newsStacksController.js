const NewsStacks = require('../models/NewsStacks');
const RssNews = require('../models/RssNews');
const NewsStackImages = require('../models/NewsStackImages');

<<<<<<< HEAD
// XP hesaplama fonksiyonu
const calculateXP = (newsCount) => {
  const randomMultiplier = Math.floor(Math.random() * (52 - 45 + 1)) + 45; // 45-52 arası
  return newsCount * randomMultiplier;
};

=======
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
// Tüm haber yığınlarını getir
exports.getAllNewsStacks = async (req, res) => {
  try {
    const {
      status,
      isFeatured,
      tags,
<<<<<<< HEAD
      categories,
      mainCategory,
=======
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
      limit = -1,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Filter objesi oluştur
    let filter = {};

    if (status !== undefined) {
      filter.status = status;
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true';
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      filter.tags = { $in: tagArray };
    }

<<<<<<< HEAD
    if (categories) {
      const categoryArray = categories.split(',').map(cat => cat.trim());
      filter.categories = { $in: categoryArray };
    }

    if (mainCategory) {
      filter.mainCategory = mainCategory;
    }

=======
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
    // Sort objesi oluştur
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    let query = NewsStacks.find(filter)
      .populate('news', 'title link pubDate image category')
      .sort(sort);

    if (limit > 0) {
      query = query.limit(parseInt(limit));
    }

    const newsStacks = await query;

    // Her stack için resim bilgisini ekle
    const newsStacksWithImages = await Promise.all(
      newsStacks.map(async (stack) => {
        const stackObj = stack.toObject();
        const image = await NewsStackImages.findOne({ newsStackId: stack._id });
        stackObj.photoUrl = image ? image.photoUrl : null;
        return stackObj;
      })
    );

    res.status(200).json({
      success: true,
      count: newsStacksWithImages.length,
      data: newsStacksWithImages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ID'ye göre haber yığını getir
exports.getNewsStackById = async (req, res) => {
  try {
    const newsStack = await NewsStacks.findById(req.params.id)
      .populate('news', 'title link pubDate image category description guid');

    if (!newsStack) {
      return res.status(404).json({
        success: false,
        error: 'Haber yığını bulunamadı'
      });
    }

    // View count'u artır
    newsStack.viewCount += 1;
    await newsStack.save();

    // Resim bilgisini ekle
    const stackObj = newsStack.toObject();
    const image = await NewsStackImages.findOne({ newsStackId: newsStack._id });
    stackObj.photoUrl = image ? image.photoUrl : null;

    res.status(200).json({
      success: true,
      data: stackObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Yeni haber yığını oluştur
exports.createNewsStack = async (req, res) => {
  try {
    const { title, description, news, status, tags, isFeatured } = req.body;

<<<<<<< HEAD
    // En az 3 haber zorunluluğu kontrolü
    if (!news || news.length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Bir haber yığını oluşturmak için en az 3 haber seçilmelidir'
      });
    }

=======
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
    // Haber GUID'lerinin geçerli olup olmadığını kontrol et
    if (news && news.length > 0) {
      const newsExists = await RssNews.find({ guid: { $in: news } });
      if (newsExists.length !== news.length) {
        return res.status(400).json({
          success: false,
          error: 'Bir veya daha fazla geçersiz haber GUID\'si'
        });
      }

      // Haberlerin isInAnyStack durumunu güncelle
      await RssNews.updateMany(
        { guid: { $in: news } },
        { isInAnyStack: true }
      );
    }

    const newsStack = await NewsStacks.create({
      title,
      description,
      news: news || [],
      status: status || 'pending',
      tags: tags || [],
      isFeatured: isFeatured || false
    });

    const populatedNewsStack = await NewsStacks.findById(newsStack._id)
      .populate('news', 'title link pubDate image category');

    res.status(201).json({
      success: true,
      data: populatedNewsStack
    });
  } catch (error) {
<<<<<<< HEAD
    // Mongoose validation hatalarını özel olarak yakala
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: validationErrors.join(', ')
      });
    }

=======
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Haber yığını güncelle
exports.updateNewsStack = async (req, res) => {
  try {
    const newsStack = await NewsStacks.findById(req.params.id);

    if (!newsStack) {
      return res.status(404).json({
        success: false,
        error: 'Haber yığını bulunamadı'
      });
    }

<<<<<<< HEAD
    // XP ve categories alanlarını request body'den kaldır - otomatik hesaplanacak
    delete req.body.xp;
    delete req.body.categories;
    delete req.body.mainCategory;

    // Eğer news array'i güncelleniyor ise
    if (req.body.news) {
      // En az 3 haber zorunluluğu kontrolü
      if (req.body.news.length < 3) {
        return res.status(400).json({
          success: false,
          error: 'Bir haber yığını için en az 3 haber gereklidir'
        });
      }

=======
    // Eğer news array'i güncelleniyor ise
    if (req.body.news) {
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
      // Eski haberlerin isInAnyStack durumunu kontrol et
      const oldNewsGuids = newsStack.news;
      const newNewsGuids = req.body.news;

      // Eski haberlerden çıkarılan haberleri bul
      const removedNewsGuids = oldNewsGuids.filter(guid => !newNewsGuids.includes(guid));

      // Çıkarılan haberlerin başka stacklerde olup olmadığını kontrol et
      for (let newsGuid of removedNewsGuids) {
        const otherStacks = await NewsStacks.find({
          _id: { $ne: req.params.id },
          news: newsGuid
        });

        if (otherStacks.length === 0) {
          await RssNews.findOneAndUpdate({ guid: newsGuid }, { isInAnyStack: false });
        }
      }

      // Yeni eklenen haberlerin isInAnyStack durumunu güncelle
      const addedNewsGuids = newNewsGuids.filter(guid => !oldNewsGuids.includes(guid));
      if (addedNewsGuids.length > 0) {
        await RssNews.updateMany(
          { guid: { $in: addedNewsGuids } },
          { isInAnyStack: true }
        );
      }

      // Haber listesi değiştiği için fotoğraf güncelliği durumunu false yap
      req.body.isPhotoUpToDate = false;
<<<<<<< HEAD

      // XP'yi yeniden hesapla
      req.body.xp = calculateXP(req.body.news.length);

      // Kategorileri yeniden hesapla
      const categoryData = await NewsStacks.calculateCategoriesFromNews(req.body.news);
      req.body.categories = categoryData.categories;
      req.body.mainCategory = categoryData.mainCategory;
=======
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
    }

    const updatedNewsStack = await NewsStacks.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('news', 'title link pubDate image category');

    res.status(200).json({
      success: true,
      data: updatedNewsStack
    });
  } catch (error) {
<<<<<<< HEAD
    // Mongoose validation hatalarını özel olarak yakala
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: validationErrors.join(', ')
      });
    }

=======
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Haber yığını sil
exports.deleteNewsStack = async (req, res) => {
  try {
    const newsStack = await NewsStacks.findById(req.params.id);

    if (!newsStack) {
      return res.status(404).json({
        success: false,
        error: 'Haber yığını bulunamadı'
      });
    }

    // Bu stackteki haberlerin başka stacklerde olup olmadığını kontrol et
    for (let newsGuid of newsStack.news) {
      const otherStacks = await NewsStacks.find({
        _id: { $ne: req.params.id },
        news: newsGuid
      });

      if (otherStacks.length === 0) {
        await RssNews.findOneAndUpdate({ guid: newsGuid }, { isInAnyStack: false });
      }
    }

    await NewsStacks.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Haber yığını başarıyla silindi',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Haber yığınına haber ekle
exports.addNewsToStack = async (req, res) => {
  try {
    const { newsGuid } = req.body;

    const newsStack = await NewsStacks.findById(req.params.id);
    if (!newsStack) {
      return res.status(404).json({
        success: false,
        error: 'Haber yığını bulunamadı'
      });
    }

    const news = await RssNews.findOne({ guid: newsGuid });
    if (!news) {
      return res.status(404).json({
        success: false,
        error: 'Haber bulunamadı'
      });
    }

    // Haber zaten bu stackte var mı kontrol et
    if (newsStack.news.includes(newsGuid)) {
      return res.status(400).json({
        success: false,
        error: 'Bu haber zaten yığında mevcut'
      });
    }

    newsStack.news.push(newsGuid);
    // Yeni haber eklendiği için fotoğraf güncelliği durumunu false yap
    newsStack.isPhotoUpToDate = false;
    await newsStack.save();

    // Haberin isInAnyStack durumunu güncelle
    await RssNews.findOneAndUpdate({ guid: newsGuid }, { isInAnyStack: true });

    const updatedNewsStack = await NewsStacks.findById(req.params.id)
      .populate('news', 'title link pubDate image category');

    res.status(200).json({
      success: true,
      data: updatedNewsStack
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Haber yığınından haber çıkar
exports.removeNewsFromStack = async (req, res) => {
  try {
    const { newsGuid } = req.body;

    const newsStack = await NewsStacks.findById(req.params.id);
    if (!newsStack) {
      return res.status(404).json({
        success: false,
        error: 'Haber yığını bulunamadı'
      });
    }

    // Haber bu stackte var mı kontrol et
    if (!newsStack.news.includes(newsGuid)) {
      return res.status(400).json({
        success: false,
        error: 'Bu haber zaten yığında mevcut değil'
      });
    }

<<<<<<< HEAD
    // En az 3 haber zorunluluğu kontrolü - haber çıkarıldıktan sonra en az 3 haber kalmalı
    if (newsStack.news.length <= 3) {
      return res.status(400).json({
        success: false,
        error: 'Bir haber yığınında en az 3 haber bulunmalıdır. Bu haberi çıkaramazsınız.'
      });
    }

=======
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
    newsStack.news.pull(newsGuid);
    // Haber çıkarıldığı için fotoğraf güncelliği durumunu false yap
    newsStack.isPhotoUpToDate = false;
    await newsStack.save();

    // Bu haberin başka stacklerde olup olmadığını kontrol et
    const otherStacks = await NewsStacks.find({
      _id: { $ne: req.params.id },
      news: newsGuid
    });

    if (otherStacks.length === 0) {
      await RssNews.findOneAndUpdate({ guid: newsGuid }, { isInAnyStack: false });
    }

    const updatedNewsStack = await NewsStacks.findById(req.params.id)
      .populate('news', 'title link pubDate image category');

    res.status(200).json({
      success: true,
      data: updatedNewsStack
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
