// ===================================
// API KULLANIM ÖRNEKLERİ VE DEMO
// ===================================
// Bu dosya API fonksiyonlarının nasıl kullanılacağını gösterir

import {
  newsAPI,
  stacksAPI,
  imagesAPI,
  getAllNews,
  createStack,
  uploadImageFile
} from './index';

// ================================
// HABER API KULLANIM ÖRNEKLERİ
// ================================

/**
 * Son haberleri getir - örnek kullanım
 */
export const exampleGetLatestNews = async () => {
  try {
    const response = await newsAPI.getLatest(10);
    console.log('Son haberler:', response.data);
    return response;
  } catch (error) {
    console.error('Haber getirme hatası:', error.message);
    throw error;
  }
};

/**
 * Kategoriye göre haberler - örnek kullanım
 */
export const exampleGetNewsByCategory = async (category = 'gundem') => {
  try {
    const response = await newsAPI.getByCategory(category, 5);
    console.log(`${category} kategorisi haberleri:`, response.data);
    return response;
  } catch (error) {
    console.error('Kategori haberleri hatası:', error.message);
    throw error;
  }
};

/**
 * Yeni haber oluştur - örnek kullanım
 */
export const exampleCreateNews = async () => {
  try {
    const newsData = {
      guid: `news-${Date.now()}`,
      title: 'Örnek Haber Başlığı',
      description: 'Bu bir örnek haber açıklamasıdır.',
      newstext: 'Bu haberin detaylı içeriği burada yer alır. Haberin tam metni, ayrıntıları ve ek bilgiler bu alanda saklanır.',
      link: 'https://example.com/news/example',
      pubDate: new Date().toUTCString(),
      category: 'gundem',
      image: 'https://example.com/image.jpg'
    };

    const response = await newsAPI.create(newsData);
    console.log('Yeni haber oluşturuldu:', response.data);
    return response;
  } catch (error) {
    console.error('Haber oluşturma hatası:', error.message);
    throw error;
  }
};

// ====================================
// HABER YIĞINI API KULLANIM ÖRNEKLERİ
// ====================================

/**
 * CP'ye göre sıralanmış yığınları getir - örnek kullanım
 */
export const exampleGetStacksByCP = async () => {
  try {
    const response = await stacksAPI.getByCP(10);
    console.log('En yüksek CP\'li yığınlar:', response.data);
    return response.data;
  } catch (error) {
    console.error('CP sıralaması hatası:', error.message);
    throw error;
  }
};

/**
 * Öne çıkan yığınları getir - örnek kullanım
 */
export const exampleGetFeaturedStacks = async () => {
  try {
    const response = await stacksAPI.getFeatured(5);
    console.log('Öne çıkan yığınlar:', response.data);
    return response;
  } catch (error) {
    console.error('Öne çıkan yığınlar hatası:', error.message);
    throw error;
  }
};

/**
 * Yeni haber yığını oluştur - örnek kullanım
 * ÖNEMLI: En az 3 haber GUID'i gereklidir
 */
export const exampleCreateStack = async () => {
  try {
    // Önce en az 3 haber GUID'i al
    const newsResponse = await newsAPI.getUsable(5);
    const newsGuids = newsResponse.data.slice(0, 3).map(news => news.guid);

    if (newsGuids.length < 3) {
      throw new Error('En az 3 haber gereklidir. Yeterli haber bulunamadı.');
    }

    const stackData = {
      title: 'Örnek Haber Yığını',
      description: 'Bu bir örnek haber yığını açıklamasıdır.',
      news: newsGuids, // En az 3 haber GUID'i
      tags: ['örnek', 'test'],
      status: 'pending',
      isFeatured: false
    };

    const response = await stacksAPI.create(stackData);
    console.log('Yeni yığın oluşturuldu:', response.data);
    return response;
  } catch (error) {
    console.error('Yığın oluşturma hatası:', error.message);
    throw error;
  }
};

/**
 * Yığına haber ekle - örnek kullanım
 */
export const exampleAddNewsToStack = async (stackId, newsGuid) => {
  try {
    const response = await stacksAPI.addNews(stackId, newsGuid);
    console.log('Haber yığına eklendi:', response.data);
    return response;
  } catch (error) {
    console.error('Haber ekleme hatası:', error.message);
    throw error;
  }
};

/**
 * Yığından haber çıkar - örnek kullanım
 * ÖNEMLI: Çıkarıldıktan sonra en az 3 haber kalmalıdır
 */
export const exampleRemoveNewsFromStack = async (stackId, newsGuid) => {
  try {
    // Önce yığının durumunu kontrol et
    const stackResponse = await stacksAPI.getById(stackId);
    const currentNewsCount = stackResponse.data.news.length;

    if (currentNewsCount <= 3) {
      throw new Error(`Bu haberi çıkaramazsınız. Yığında en az 3 haber kalmalıdır. Şu anda: ${currentNewsCount} haber var.`);
    }

    const response = await stacksAPI.removeNews(stackId, newsGuid);
    console.log('Haber yığından çıkarıldı:', response.data);
    return response;
  } catch (error) {
    console.error('Haber çıkarma hatası:', error.message);
    throw error;
  }
};

// ======================================
// RESİM YÖNETİMİ KULLANIM ÖRNEKLERİ
// ======================================

/**
 * Dosya seçici ile resim yükle - örnek kullanım
 */
export const exampleUploadImageFromFile = async (stackId, fileInput) => {
  try {
    const file = fileInput.files[0];
    if (!file) {
      throw new Error('Dosya seçilmedi');
    }

    // Dosya tipini kontrol et
    if (!file.type.startsWith('image/')) {
      throw new Error('Lütfen bir resim dosyası seçin');
    }

    const response = await imagesAPI.uploadFile(stackId, file);
    console.log('Resim yüklendi:', response.data);
    return response;
  } catch (error) {
    console.error('Resim yükleme hatası:', error.message);
    throw error;
  }
};

/**
 * Yığın kapak resmini güncelle - örnek kullanım
 */
export const exampleUpdateStackCover = async (stackId, fileInput) => {
  try {
    const file = fileInput.files[0];
    if (!file) {
      throw new Error('Dosya seçilmedi');
    }

    const response = await imagesAPI.updateCover(stackId, file);
    console.log('Kapak resmi güncellendi:', response.data);
    return response;
  } catch (error) {
    console.error('Kapak güncelleme hatası:', error.message);
    throw error;
  }
};

// =======================================
// KOMPLEKSLİ İŞLEMLER - ÖRNEK SENARYOLAR
// =======================================

/**
 * Tam haber yığını workflow'u - örnek senaryo
 * 1. En az 3 haber GUID'i kontrol et
 * 2. Yığın oluştur
 * 3. Kapak resmi yükle
 * 4. Yığını onayla
 */
export const exampleCompleteStackWorkflow = async (newsGuids, coverImageFile) => {
  try {
    // 1. En az 3 haber GUID'i kontrolü
    if (!newsGuids || newsGuids.length < 3) {
      throw new Error('En az 3 haber GUID\'i gereklidir. Şu anda: ' + (newsGuids?.length || 0));
    }

    // 2. Yığın oluştur
    const stackData = {
      title: 'Gündem: Önemli Gelişmeler',
      description: 'Bugünkü önemli haberler',
      news: newsGuids, // En az 3 haber GUID'i
      tags: ['gündem', 'önemli'],
      status: 'pending'
    };

    const stackResponse = await stacksAPI.create(stackData);
    const stackId = stackResponse.data._id;

    console.log('✅ Yığın oluşturuldu:', stackId);

    // 3. Kapak resmi yükle (eğer varsa)
    if (coverImageFile) {
      const imageResponse = await imagesAPI.uploadFile(stackId, coverImageFile);
      console.log('✅ Kapak resmi yüklendi:', imageResponse.data.photoUrl);
    }

    // 4. Yığını onayla
    const updateResponse = await stacksAPI.update(stackId, {
      status: 'approved',
      isFeatured: true
    });

    console.log('✅ Yığın onaylandı:', updateResponse.data);

    return updateResponse;

  } catch (error) {
    console.error('❌ Workflow hatası:', error.message);
    throw error;
  }
};

/**
 * Haber arama ve filtreleme - örnek senaryo
 */
export const exampleSearchAndFilter = async () => {
  try {
    // Son 1 haftalık gündem haberlerini getir
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const response = await getAllNews({
      category: 'gundem',
      pubDate: `${oneWeekAgo.toISOString().split('T')[0]}`,
      isUsable: true,
      limit: 20
    });

    console.log('Filtrelenmiş haberler:', response.data);
    return response;

  } catch (error) {
    console.error('Arama hatası:', error.message);
    throw error;
  }
};
