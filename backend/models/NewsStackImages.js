const mongoose = require('mongoose');

const newsStackImagesSchema = new mongoose.Schema({
  newsStackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NewsStacks',
    required: [true, 'News Stack ID alanı zorunludur'],
    unique: true
  },
  cloudinaryPublicId: {
    type: String,
    required: [true, 'Cloudinary Public ID alanı zorunludur']
  },
  photoUrl: {
    type: String,
    required: [true, 'Fotoğraf URL alanı zorunludur']
  },
  originalName: {
    type: String
  },
  format: {
    type: String
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  bytes: {
    type: Number
  }
}, {
  timestamps: true
});

// İndeksler
newsStackImagesSchema.index({ newsStackId: 1 });
newsStackImagesSchema.index({ cloudinaryPublicId: 1 });

module.exports = mongoose.model('NewsStackImages', newsStackImagesSchema);
