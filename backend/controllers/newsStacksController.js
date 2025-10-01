const NewsStacks = require('../models/NewsStacks');
const RssNews = require('../models/RssNews');

// Tüm haber yığınlarını getir (filtreleme ve limitlemeli)
exports.getAllNewsStacks = async (req, res) => {
  try {
    const { isApproved, isFeatured, tags, limit = -1, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Filtreleme koşullarını oluştur
    const filter = {};

    // isApproved filtresi
    if (isApproved !== undefined) {
      filter.isApproved = isApproved === 'true';
    }

    // isFeatured filtresi
    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true';
    }

    // tags filtresi
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }

    // Sıralama ayarları
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Sorguyu oluştur ve sırala
    let query = NewsStacks.find(filter)
      .populate('news.id', 'title link pubDate image category')
      .sort(sortOptions);

    // Limit uygula
    if (limit && parseInt(limit) > 0) {
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
      message: 'Haber yığınları getirilemedi',
      error: error.message
    });
  }
};

// ID'ye göre haber yığını getir
exports.getNewsStackById = async (req, res) => {
  try {
    const newsStack = await NewsStacks.findById(req.params.id)
      .populate('news.id', 'title link description pubDate image category');

    if (!newsStack) {
      return res.status(404).json({
        success: false,
        message: 'Haber yığını bulunamadı'
      });
    }

    // Görüntülenme sayısını artır
    await NewsStacks.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

    res.status(200).json({
      success: true,
      data: newsStack
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Haber yığını getirilemedi',
      error: error.message
    });
  }
};

// Yeni haber yığını oluştur
exports.createNewsStack = async (req, res) => {
  try {
    const { title, description, news, isApproved, tags, isFeatured } = req.body;

    // Haberlerin geçerli olduğunu kontrol et
    if (news && news.length > 0) {
      for (const newsItem of news) {
        const existingNews = await RssNews.findById(newsItem.id);
        if (!existingNews) {
          return res.status(400).json({
            success: false,
            message: `ID'si ${newsItem.id} olan haber bulunamadı`
          });
        }
        // GUID'yi otomatik olarak doldur
        newsItem.guid = existingNews.guid;
      }
    }

    const newsStack = await NewsStacks.create({
      title,
      description,
      news: news || [],
      isApproved: isApproved || false,
      tags: tags || [],
      isFeatured: isFeatured || false
    });

    // Populate ile detayları getir
    const populatedNewsStack = await NewsStacks.findById(newsStack._id)
      .populate('news.id', 'title link pubDate image category');

    res.status(201).json({
      success: true,
      data: populatedNewsStack
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Haber yığını oluşturulamadı',
      error: error.message
    });
  }
};

// Haber yığını güncelle
exports.updateNewsStack = async (req, res) => {
  try {
    const { title, description, news, isApproved, tags, isFeatured } = req.body;

    // Haberlerin geçerli olduğunu kontrol et
    if (news && news.length > 0) {
      for (const newsItem of news) {
        const existingNews = await RssNews.findById(newsItem.id);
        if (!existingNews) {
          return res.status(400).json({
            success: false,
            message: `ID'si ${newsItem.id} olan haber bulunamadı`
          });
        }
        // GUID'yi otomatik olarak doldur
        newsItem.guid = existingNews.guid;
      }
    }

    const newsStack = await NewsStacks.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(news && { news }),
        ...(isApproved !== undefined && { isApproved }),
        ...(tags && { tags }),
        ...(isFeatured !== undefined && { isFeatured })
      },
      { new: true, runValidators: true }
    ).populate('news.id', 'title link pubDate image category');

    if (!newsStack) {
      return res.status(404).json({
        success: false,
        message: 'Haber yığını bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      data: newsStack
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Haber yığını güncellenemedi',
      error: error.message
    });
  }
};

// Haber yığını sil
exports.deleteNewsStack = async (req, res) => {
  try {
    const newsStack = await NewsStacks.findByIdAndDelete(req.params.id);

    if (!newsStack) {
      return res.status(404).json({
        success: false,
        message: 'Haber yığını bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Haber yığını silinemedi',
      error: error.message
    });
  }
};

// Haber yığınına haber ekle
exports.addNewsToStack = async (req, res) => {
  try {
    const { newsId } = req.body;

    // Haberin var olduğunu kontrol et
    const existingNews = await RssNews.findById(newsId);
    if (!existingNews) {
      return res.status(400).json({
        success: false,
        message: 'Haber bulunamadı'
      });
    }

    const newsStack = await NewsStacks.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          news: {
            id: newsId,
            guid: existingNews.guid
          }
        }
      },
      { new: true, runValidators: true }
    ).populate('news.id', 'title link pubDate image category');

    if (!newsStack) {
      return res.status(404).json({
        success: false,
        message: 'Haber yığını bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      data: newsStack
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Haber yığınına haber eklenemedi',
      error: error.message
    });
  }
};

// Haber yığınından haber çıkar
exports.removeNewsFromStack = async (req, res) => {
  try {
    const { newsId } = req.body;

    const newsStack = await NewsStacks.findByIdAndUpdate(
      req.params.id,
      { $pull: { news: { id: newsId } } },
      { new: true, runValidators: true }
    ).populate('news.id', 'title link pubDate image category');

    if (!newsStack) {
      return res.status(404).json({
        success: false,
        message: 'Haber yığını bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      data: newsStack
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Haber yığınından haber çıkarılamadı',
      error: error.message
    });
  }
};
