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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RssNews'
  }],
  isApproved: {
    type: Boolean,
    default: false
  },
  viewCount: {
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
  }
}, {
  timestamps: true
});

// İndeksler
newsStacksSchema.index({ isApproved: 1 });
newsStacksSchema.index({ isFeatured: 1 });
newsStacksSchema.index({ viewCount: -1 });
newsStacksSchema.index({ tags: 1 });

module.exports = mongoose.model('NewsStacks', newsStacksSchema);
