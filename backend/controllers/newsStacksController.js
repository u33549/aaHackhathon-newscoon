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
      .populate('news', 'title link pubDate image category guid')
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
      .populate('news', 'title link description pubDate image category guid');

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
      for (const newsId of news) {
        const existingNews = await RssNews.findById(newsId);
        if (!existingNews) {
          return res.status(400).json({
            success: false,
            message: `ID'si ${newsId} olan haber bulunamadı`
          });
        }
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

    // Eklenen haberlerin isInAnyStack değerini true yap
    if (news && news.length > 0) {
      await RssNews.updateMany(
        { _id: { $in: news } },
        { $set: { isInAnyStack: true } }
      );
    }

    // Populate ile detayları getir
    const populatedNewsStack = await NewsStacks.findById(newsStack._id)
      .populate('news', 'title link pubDate image category guid');

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

    // Mevcut stack'i al
    const currentStack = await NewsStacks.findById(req.params.id);
    if (!currentStack) {
      return res.status(404).json({
        success: false,
        message: 'Haber yığını bulunamadı'
      });
    }

    // Eğer news güncelleniyorsa
    if (news && news.length > 0) {
      // Yeni haberlerin geçerli olduğunu kontrol et
      for (const newsId of news) {
        const existingNews = await RssNews.findById(newsId);
        if (!existingNews) {
          return res.status(400).json({
            success: false,
            message: `ID'si ${newsId} olan haber bulunamadı`
          });
        }
      }

      // Eski haberlerin isInAnyStack durumunu kontrol et ve güncelle
      const oldNewsIds = currentStack.news;
      const newNewsIds = news;

      // Çıkarılan haberler
      const removedNewsIds = oldNewsIds.filter(id => !newNewsIds.includes(id.toString()));

      // Eklenen haberler
      const addedNewsIds = newNewsIds.filter(id => !oldNewsIds.map(n => n.toString()).includes(id));

      // Çıkarılan haberlerin başka stack'te olup olmadığını kontrol et
      for (const removedId of removedNewsIds) {
        const otherStacksCount = await NewsStacks.countDocuments({
          _id: { $ne: req.params.id },
          news: removedId
        });

        if (otherStacksCount === 0) {
          await RssNews.findByIdAndUpdate(removedId, { isInAnyStack: false });
        }
      }

      // Eklenen haberlerin isInAnyStack değerini true yap
      if (addedNewsIds.length > 0) {
        await RssNews.updateMany(
          { _id: { $in: addedNewsIds } },
          { $set: { isInAnyStack: true } }
        );
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
    ).populate('news', 'title link pubDate image category guid');

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
    const newsStack = await NewsStacks.findById(req.params.id);

    if (!newsStack) {
      return res.status(404).json({
        success: false,
        message: 'Haber yığını bulunamadı'
      });
    }

    // Stack'te olan haberlerin başka stack'lerde olup olmadığını kontrol et
    for (const newsId of newsStack.news) {
      const otherStacksCount = await NewsStacks.countDocuments({
        _id: { $ne: req.params.id },
        news: newsId
      });

      // Eğer başka stack'te yoksa isInAnyStack'i false yap
      if (otherStacksCount === 0) {
        await RssNews.findByIdAndUpdate(newsId, { isInAnyStack: false });
      }
    }

    // Stack'i sil
    await NewsStacks.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Haber yığını silindi ve haberlerin durumu güncellendi',
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

    // Stack'e haberi ekle
    const newsStack = await NewsStacks.findByIdAndUpdate(
      req.params.id,
      { $push: { news: newsId } },
      { new: true, runValidators: true }
    ).populate('news', 'title link pubDate image category guid');

    if (!newsStack) {
      return res.status(404).json({
        success: false,
        message: 'Haber yığını bulunamadı'
      });
    }

    // Haberin isInAnyStack değerini true yap
    await RssNews.findByIdAndUpdate(newsId, { isInAnyStack: true });

    res.status(200).json({
      success: true,
      message: 'Haber başarıyla eklendi ve durumu güncellendi',
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

    // Stack'ten haberi çıkar
    const newsStack = await NewsStacks.findByIdAndUpdate(
      req.params.id,
      { $pull: { news: newsId } },
      { new: true, runValidators: true }
    ).populate('news', 'title link pubDate image category guid');

    if (!newsStack) {
      return res.status(404).json({
        success: false,
        message: 'Haber yığını bulunamadı'
      });
    }

    // Haberin başka stack'lerde olup olmadığını kontrol et
    const otherStacksCount = await NewsStacks.countDocuments({
      _id: { $ne: req.params.id },
      news: newsId
    });

    // Eğer başka stack'te yoksa isInAnyStack'i false yap
    if (otherStacksCount === 0) {
      await RssNews.findByIdAndUpdate(newsId, { isInAnyStack: false });
    }

    res.status(200).json({
      success: true,
      message: 'Haber başarıyla çıkarıldı ve durumu güncellendi',
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
