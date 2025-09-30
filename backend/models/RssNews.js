const mongoose = require('mongoose');

const rssNewsSchema = new mongoose.Schema({
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
  timestamps: true
});

module.exports = mongoose.model('RssNews', rssNewsSchema);
