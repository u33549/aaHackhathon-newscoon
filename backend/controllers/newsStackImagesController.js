const NewsStackImages = require('../models/NewsStackImages');
const NewsStacks = require('../models/NewsStacks');
const cloudinary = require('../config/cloudinary');

// Tüm resimleri getir
const getAllImages = async (req, res) => {
  try {
    const { newsStackId, limit = -1 } = req.query;

    let filter = {};
    if (newsStackId) {
      filter.newsStackId = newsStackId;
    }

    let query = NewsStackImages.find(filter).populate('newsStackId', 'title description');

    if (limit !== -1 && !isNaN(limit)) {
      query = query.limit(parseInt(limit));
    }

    const images = await query.sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Resimler getirilirken hata oluştu',
      error: error.message
    });
  }
};

// ID'ye göre resim getir
const getImageById = async (req, res) => {
  try {
    const image = await NewsStackImages.findById(req.params.id).populate('newsStackId', 'title description');

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Resim bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      data: image
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Resim getirilirken hata oluştu',
      error: error.message
    });
  }
};

// NewsStack ID'ye göre resim getir
const getImageByNewsStackId = async (req, res) => {
  try {
    const image = await NewsStackImages.findOne({ newsStackId: req.params.newsStackId })
      .populate('newsStackId', 'title description');

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Bu haber yığını için resim bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      data: image
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Resim getirilirken hata oluştu',
      error: error.message
    });
  }
};

// Base64 resim yükle/güncelle
const createOrUpdateImage = async (req, res) => {
  try {
    const { newsStackId, photo, originalName } = req.body;

    // Gerekli alanları kontrol et
    if (!newsStackId || !photo) {
      return res.status(400).json({
        success: false,
        message: 'NewsStack ID ve fotoğraf verisi gereklidir'
      });
    }

    // NewsStack'in var olup olmadığını kontrol et
    const newsStack = await NewsStacks.findById(newsStackId);
    if (!newsStack) {
      return res.status(404).json({
        success: false,
        message: 'Belirtilen NewsStack bulunamadı'
      });
    }

    // Mevcut resmi kontrol et
    let existingImage = await NewsStackImages.findOne({ newsStackId });

    // Cloudinary'ye yükle
    const uploadOptions = {
      folder: 'newsstacks',
      public_id: `newsstack_${newsStackId}_${Date.now()}`,
      resource_type: 'image'
    };

    const uploadResult = await cloudinary.uploader.upload(photo, uploadOptions);

    // Eğer mevcut resim varsa, eski resmi Cloudinary'den sil
    if (existingImage) {
      try {
        await cloudinary.uploader.destroy(existingImage.cloudinaryPublicId);
      } catch (destroyError) {
        console.log('Eski resim silinirken hata:', destroyError.message);
      }
    }

    // Veritabanında güncelle veya yeni kayıt oluştur
    const imageData = {
      newsStackId,
      cloudinaryPublicId: uploadResult.public_id,
      photoUrl: uploadResult.secure_url,
      originalName: originalName || 'unknown',
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
      bytes: uploadResult.bytes
    };

    let savedImage;
    if (existingImage) {
      // Güncelle
      savedImage = await NewsStackImages.findOneAndUpdate(
        { newsStackId },
        imageData,
        { new: true, runValidators: true }
      ).populate('newsStackId', 'title description');
    } else {
      // Yeni oluştur
      savedImage = new NewsStackImages(imageData);
      await savedImage.save();
      savedImage = await NewsStackImages.findById(savedImage._id)
        .populate('newsStackId', 'title description');
    }

    // Fotoğraf yüklendiği/güncellendiği için NewsStack'teki isPhotoUpToDate'i true yap
    await NewsStacks.findByIdAndUpdate(newsStackId, { isPhotoUpToDate: true });

    res.status(existingImage ? 200 : 201).json({
      success: true,
      message: existingImage ? 'Resim başarıyla güncellendi' : 'Resim başarıyla yüklendi',
      data: savedImage
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Resim yüklenirken hata oluştu',
      error: error.message
    });
  }
};

// ID'ye göre resim güncelle
const updateImageById = async (req, res) => {
  try {
    const { photo, originalName } = req.body;

    const existingImage = await NewsStackImages.findById(req.params.id);
    if (!existingImage) {
      return res.status(404).json({
        success: false,
        message: 'Resim bulunamadı'
      });
    }

    let updateData = {};

    // Eğer yeni fotoğraf gönderildiyse
    if (photo) {
      // Eski resmi Cloudinary'den sil
      try {
        await cloudinary.uploader.destroy(existingImage.cloudinaryPublicId);
      } catch (destroyError) {
        console.log('Eski resim silinirken hata:', destroyError.message);
      }

      // Yeni resmi yükle
      const uploadOptions = {
        folder: 'newsstacks',
        public_id: `newsstack_${existingImage.newsStackId}_${Date.now()}`,
        resource_type: 'image'
      };

      const uploadResult = await cloudinary.uploader.upload(photo, uploadOptions);

      updateData = {
        cloudinaryPublicId: uploadResult.public_id,
        photoUrl: uploadResult.secure_url,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
        bytes: uploadResult.bytes
      };

      // Fotoğraf güncellendiği için NewsStack'teki isPhotoUpToDate'i true yap
      await NewsStacks.findByIdAndUpdate(existingImage.newsStackId, { isPhotoUpToDate: true });
    }

    if (originalName) {
      updateData.originalName = originalName;
    }

    const updatedImage = await NewsStackImages.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('newsStackId', 'title description');

    res.status(200).json({
      success: true,
      message: 'Resim başarıyla güncellendi',
      data: updatedImage
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Resim güncellenirken hata oluştu',
      error: error.message
    });
  }
};

// NewsStack ID'ye göre resim güncelle
const updateImageByNewsStackId = async (req, res) => {
  try {
    const { photo, originalName } = req.body;

    const existingImage = await NewsStackImages.findOne({ newsStackId: req.params.newsStackId });
    if (!existingImage) {
      return res.status(404).json({
        success: false,
        message: 'Bu haber yığını için resim bulunamadı'
      });
    }

    let updateData = {};

    // Eğer yeni fotoğraf gönderildiyse
    if (photo) {
      // Eski resmi Cloudinary'den sil
      try {
        await cloudinary.uploader.destroy(existingImage.cloudinaryPublicId);
      } catch (destroyError) {
        console.log('Eski resim silinirken hata:', destroyError.message);
      }

      // Yeni resmi yükle
      const uploadOptions = {
        folder: 'newsstacks',
        public_id: `newsstack_${req.params.newsStackId}_${Date.now()}`,
        resource_type: 'image'
      };

      const uploadResult = await cloudinary.uploader.upload(photo, uploadOptions);

      updateData = {
        cloudinaryPublicId: uploadResult.public_id,
        photoUrl: uploadResult.secure_url,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
        bytes: uploadResult.bytes
      };

      // Fotoğraf güncellendiği için NewsStack'teki isPhotoUpToDate'i true yap
      await NewsStacks.findByIdAndUpdate(req.params.newsStackId, { isPhotoUpToDate: true });
    }

    if (originalName) {
      updateData.originalName = originalName;
    }

    const updatedImage = await NewsStackImages.findOneAndUpdate(
      { newsStackId: req.params.newsStackId },
      updateData,
      { new: true, runValidators: true }
    ).populate('newsStackId', 'title description');

    res.status(200).json({
      success: true,
      message: 'Resim başarıyla güncellendi',
      data: updatedImage
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Resim güncellenirken hata oluştu',
      error: error.message
    });
  }
};

// ID'ye göre resim sil
const deleteImageById = async (req, res) => {
  try {
    const image = await NewsStackImages.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Resim bulunamadı'
      });
    }

    // Cloudinary'den sil
    try {
      await cloudinary.uploader.destroy(image.cloudinaryPublicId);
    } catch (cloudinaryError) {
      console.log('Cloudinary\'den resim silinirken hata:', cloudinaryError.message);
    }

    // Veritabanından sil
    await NewsStackImages.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Resim başarıyla silindi',
      data: {}
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Resim silinirken hata oluştu',
      error: error.message
    });
  }
};

// NewsStack ID'ye göre resim sil
const deleteImageByNewsStackId = async (req, res) => {
  try {
    const image = await NewsStackImages.findOne({ newsStackId: req.params.newsStackId });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Bu haber yığını için resim bulunamadı'
      });
    }

    // Cloudinary'den sil
    try {
      await cloudinary.uploader.destroy(image.cloudinaryPublicId);
    } catch (cloudinaryError) {
      console.log('Cloudinary\'den resim silinirken hata:', cloudinaryError.message);
    }

    // Veritabanından sil
    await NewsStackImages.findOneAndDelete({ newsStackId: req.params.newsStackId });

    res.status(200).json({
      success: true,
      message: 'Resim başarıyla silindi',
      data: {}
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Resim silinirken hata oluştu',
      error: error.message
    });
  }
};

module.exports = {
  getAllImages,
  getImageById,
  getImageByNewsStackId,
  createOrUpdateImage,
  updateImageById,
  updateImageByNewsStackId,
  deleteImageById,
  deleteImageByNewsStackId
};
