const mongoose = require('mongoose');

const newsStacksSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Başlık alanı zorunludur'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Açıklama alanı zorunludur'],
    trim: true
  },
  news: [{
    type: String
  }],
  categories: [{
    type: String,
    enum: ['gundem', 'dunya', 'ekonomi', 'spor', 'analiz', 'kultur'],
    trim: true
  }],
  mainCategory: {
    type: String,
    enum: ['gundem', 'dunya', 'ekonomi', 'spor', 'analiz', 'kultur'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  xp: {
    type: Number,
    default: 0,
    min: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPhotoUpToDate: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// XP hesaplama fonksiyonu
function calculateXP(newsCount) {
  const randomMultiplier = Math.floor(Math.random() * (52 - 45 + 1)) + 45; // 45-52 arası
  return newsCount * randomMultiplier;
}

// Kategorileri hesaplama metodları
newsStacksSchema.methods.updateCategories = async function() {
  if (this.news && this.news.length > 0) {
    try {
      const RssNews = mongoose.model('RssNews');
      const newsItems = await RssNews.find({ guid: { $in: this.news } }, 'category');

      // Kategorileri topla ve sayılarını hesapla
      const categoryCount = {};
      const uniqueCategories = new Set();

      newsItems.forEach(newsItem => {
        if (newsItem && newsItem.category) {
          uniqueCategories.add(newsItem.category);
          categoryCount[newsItem.category] = (categoryCount[newsItem.category] || 0) + 1;
        }
      });

      // Categories dizisini güncelle (benzersiz kategoriler)
      this.categories = Array.from(uniqueCategories);

      // En çok temsil edilen kategoriyi bul
      let maxCount = 0;
      let mainCat = null;

      for (const [category, count] of Object.entries(categoryCount)) {
        if (count > maxCount) {
          maxCount = count;
          mainCat = category;
        }
      }

      this.mainCategory = mainCat;
    } catch (error) {
      console.error('Kategoriler hesaplanırken hata:', error);
      this.categories = [];
      this.mainCategory = null;
    }
  } else {
    this.categories = [];
    this.mainCategory = null;
  }
};

// Static method for updating categories by news array
newsStacksSchema.statics.calculateCategoriesFromNews = async function(newsGuids) {
  try {
    if (!newsGuids || newsGuids.length === 0) {
      return {
        categories: [],
        mainCategory: null
      };
    }

    const RssNews = mongoose.model('RssNews');
    const newsItems = await RssNews.find({ guid: { $in: newsGuids } }, 'category');

    if (!newsItems || newsItems.length === 0) {
      return {
        categories: [],
        mainCategory: null
      };
    }

    const categoryCount = {};
    const uniqueCategories = new Set();

    newsItems.forEach(newsItem => {
      if (newsItem && newsItem.category) {
        uniqueCategories.add(newsItem.category);
        categoryCount[newsItem.category] = (categoryCount[newsItem.category] || 0) + 1;
      }
    });

    // En çok temsil edilen kategoriyi bul
    let maxCount = 0;
    let mainCategory = null;

    for (const [category, count] of Object.entries(categoryCount)) {
      if (count > maxCount) {
        maxCount = count;
        mainCategory = category;
      }
    }

    return {
      categories: Array.from(uniqueCategories),
      mainCategory: mainCategory
    };
  } catch (error) {
    console.error('Static kategori hesaplama hatası:', error);
    return {
      categories: [],
      mainCategory: null
    };
  }
};

// Pre-save middleware - XP ve kategorileri otomatik hesaplama
newsStacksSchema.pre('save', async function(next) {
  if (this.isModified('news') || this.isNew) {
    this.xp = calculateXP(this.news.length);

    // Kategorileri güncelle
    if (this.news && this.news.length > 0) {
      try {
        await this.updateCategories();
      } catch (error) {
        console.error('Kategoriler güncellenirken hata:', error);
      }
    }
  }
  next();
});

// Pre-findOneAndUpdate middleware - XP otomatik hesaplama
newsStacksSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.news || update.$set?.news || update.$push?.news || update.$pull?.news) {
    // Güncellemede news array'i değişiyorsa XP'yi yeniden hesapla
    // Bu durumda controller'da manuel olarak XP set edilecek
  }
  next();
});

// Custom validation - En az 3 haber zorunlu
newsStacksSchema.path('news').validate(function(value) {
  return value && value.length >= 3;
}, 'Bir haber yığını oluşturmak için en az 3 haber seçilmelidir');

// İndeksler
newsStacksSchema.index({ status: 1 });
newsStacksSchema.index({ isFeatured: 1 });
newsStacksSchema.index({ viewCount: -1 });
newsStacksSchema.index({ xp: -1 });
newsStacksSchema.index({ tags: 1 });
newsStacksSchema.index({ categories: 1 });
newsStacksSchema.index({ mainCategory: 1 });

module.exports = mongoose.model('NewsStacks', newsStacksSchema);
