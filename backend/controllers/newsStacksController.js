const NewsStacks = require('../models/NewsStacks');
const RssNews = require('../models/RssNews');

// Tüm haber yığınlarını getir
exports.getAllNewsStacks = async (req, res) => {
  try {
    const {
      status,
      isFeatured,
      tags,
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

    res.status(200).json({
      success: true,
      count: newsStacks.length,
      data: newsStacks
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

    res.status(200).json({
      success: true,
      data: newsStack
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

    // Haber ID'lerinin geçerli olup olmadığını kontrol et
    if (news && news.length > 0) {
      const newsExists = await RssNews.find({ _id: { $in: news } });
      if (newsExists.length !== news.length) {
        return res.status(400).json({
          success: false,
          error: 'Bir veya daha fazla geçersiz haber ID\'si'
        });
      }

      // Haberlerin isInAnyStack durumunu güncelle
      await RssNews.updateMany(
        { _id: { $in: news } },
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

    // Eğer news array'i güncelleniyor ise
    if (req.body.news) {
      // Eski haberlerin isInAnyStack durumunu kontrol et
      const oldNewsIds = newsStack.news;
      const newNewsIds = req.body.news;

      // Eski haberlerden çıkarılan haberleri bul
      const removedNewsIds = oldNewsIds.filter(id => !newNewsIds.includes(id.toString()));

      // Çıkarılan haberlerin başka stacklerde olup olmadığını kontrol et
      for (let newsId of removedNewsIds) {
        const otherStacks = await NewsStacks.find({
          _id: { $ne: req.params.id },
          news: newsId
        });

        if (otherStacks.length === 0) {
          await RssNews.findByIdAndUpdate(newsId, { isInAnyStack: false });
        }
      }

      // Yeni eklenen haberlerin isInAnyStack durumunu güncelle
      const addedNewsIds = newNewsIds.filter(id => !oldNewsIds.some(oldId => oldId.toString() === id));
      if (addedNewsIds.length > 0) {
        await RssNews.updateMany(
          { _id: { $in: addedNewsIds } },
          { isInAnyStack: true }
        );
      }
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
    for (let newsId of newsStack.news) {
      const otherStacks = await NewsStacks.find({
        _id: { $ne: req.params.id },
        news: newsId
      });

      if (otherStacks.length === 0) {
        await RssNews.findByIdAndUpdate(newsId, { isInAnyStack: false });
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
    const { newsId } = req.body;

    const newsStack = await NewsStacks.findById(req.params.id);
    if (!newsStack) {
      return res.status(404).json({
        success: false,
        error: 'Haber yığını bulunamadı'
      });
    }

    const news = await RssNews.findById(newsId);
    if (!news) {
      return res.status(404).json({
        success: false,
        error: 'Haber bulunamadı'
      });
    }

    // Haber zaten bu stackte var mı kontrol et
    if (newsStack.news.includes(newsId)) {
      return res.status(400).json({
        success: false,
        error: 'Bu haber zaten yığında mevcut'
      });
    }

    newsStack.news.push(newsId);
    await newsStack.save();

    // Haberin isInAnyStack durumunu güncelle
    await RssNews.findByIdAndUpdate(newsId, { isInAnyStack: true });

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
    const { newsId } = req.body;

    const newsStack = await NewsStacks.findById(req.params.id);
    if (!newsStack) {
      return res.status(404).json({
        success: false,
        error: 'Haber yığını bulunamadı'
      });
    }

    // Haber bu stackte var mı kontrol et
    if (!newsStack.news.includes(newsId)) {
      return res.status(400).json({
        success: false,
        error: 'Bu haber zaten yığında mevcut değil'
      });
    }

    newsStack.news.pull(newsId);
    await newsStack.save();

    // Bu haberin başka stacklerde olup olmadığını kontrol et
    const otherStacks = await NewsStacks.find({
      _id: { $ne: req.params.id },
      news: newsId
    });

    if (otherStacks.length === 0) {
      await RssNews.findByIdAndUpdate(newsId, { isInAnyStack: false });
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
