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
    type: String,
    ref: 'RssNews'
  }],
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

// Pre-save middleware - XP otomatik hesaplama
newsStacksSchema.pre('save', function(next) {
  if (this.isModified('news') || this.isNew) {
    this.xp = calculateXP(this.news.length);
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

module.exports = mongoose.model('NewsStacks', newsStacksSchema);
