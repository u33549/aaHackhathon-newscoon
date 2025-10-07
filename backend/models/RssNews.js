const mongoose = require('mongoose');

const rssNewsSchema = new mongoose.Schema({
  _id: {
    type: String
  },
  guid: {
    type: String,
    required: [true, 'GUID alanı zorunludur'],
    unique: true
  },
  isPermaLink: {
    type: String,
    default: "false"
  },
  link: {
    type: String,
    required: [true, 'Link alanı zorunludur']
  },
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
  newstext: {
    type: String,
    trim: true
  },
  pubDate: {
    type: String,
    required: [true, 'Yayın tarihi alanı zorunludur']
  },
  image: {
    type: String
  },
  category: {
    type: String,
    enum: {
      values: ['gundem', 'dunya', 'ekonomi', 'spor', 'analiz', 'kultur'],
      message: 'Kategori sadece şunlardan biri olabilir: gundem, dunya, ekonomi, spor, analiz, kultur'
    },
    required: [true, 'Kategori alanı zorunludur']
  },
  isInAnyStack: {
    type: Boolean,
    default: false
  },
  isUsable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  _id: false
});

// guid'i _id olarak kullanmak için pre-save hook
rssNewsSchema.pre('save', function(next) {
  if (this.isNew && this.guid) {
    this._id = this.guid;
  }
  next();
});

// guid alanını virtual olarak _id'ye bağla
rssNewsSchema.virtual('id').get(function() {
  return this._id;
});

// JSON çıktısında virtuals'ı dahil et
rssNewsSchema.set('toJSON', { virtuals: true });
rssNewsSchema.set('toObject', { virtuals: true });

// İndeksler
rssNewsSchema.index({ guid: 1 }, { unique: true });

module.exports = mongoose.model('RssNews', rssNewsSchema);
