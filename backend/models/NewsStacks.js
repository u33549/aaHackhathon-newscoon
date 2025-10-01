const mongoose = require('mongoose');

const newsStacksSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Başlık alanı zorunludur'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  news: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RssNews',
      required: true
    },
    guid: {
      type: String,
      required: true
    }
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
  },
  createdAt: {
    type: Date,
    default: Date.now
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
