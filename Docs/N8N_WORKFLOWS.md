# N8N Workflow Dokümantasyonu

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Workflow'ların Listesi](#workflowların-listesi)
3. [Detaylı Workflow Açıklamaları](#detaylı-workflow-açıklamaları)
4. [Hata Yönetimi](#hata-yönetimi)

---

## Genel Bakış

NEWSCOON platformunda 3 ana N8N workflow'u bulunmaktadır. Bu workflow'lar haber toplama, işleme ve görsel oluşturma süreçlerini otomatize eder.

### Workflow'ların Rolleri:
- **Haber Toplama**: RSS kaynaklarından otomatik haber çekme
- **Haber Kategorilendirme**: AI destekli haber sınıflandırma ve seri oluşturma
- **Görsel Üretim**: AI ile haber yığınları için özel görseller oluşturma

---

## Workflow'ların Listesi

| Workflow Adı | Amaç | Trigger | Sıklık | Status |
|--------------|------|---------|--------|--------|
| **haberkayıt** | RSS haber çekme ve veritabanına kaydetme | Schedule | Her saat | 🟢 Aktif |
| **stackOluştur** | Haber kategorilendirme ve seri oluşturma | Schedule | Her 2 saat | 🟢 Aktif |
| **FotoOluştur** | Haber yığınları için AI görsel üretimi | Schedule | Her saat | 🟢 Aktif |

---

## Detaylı Workflow Açıklamaları

### 1. 📰 **haberkayıt** - Haber Toplama Workflow'u

#### **Amaç**
Anadolu Ajansı RSS kaynaklarından otomatik haber çekme, içerik analizi ve veritabanına kaydetme.

#### **Trigger Bilgileri**
- **Trigger Türü**: Schedule Trigger
- **Çalışma Sıklığı**: Her saat

#### **Workflow Şeması**
```
Schedule → Kategoriler → RSS Çek → XML Parse → Haber Loop → 
İçerik Çek → HTML Parse → Metin Analiz → AI Özetleme → DB Kaydet
```

#### **İş Akışı Adımları**

1. **Kategori Belirleme**
   - Çekilecek kategoriler: `gundem`, `dunya`, `ekonomi`, `spor`, `analiz`, `kultur`
   - Her kategori için ayrı RSS URL'i oluşturulur

2. **RSS Veri Çekme**
   - URL Pattern: `https://www.aa.com.tr/tr/rss/default?cat={kategori}`
   - XML formatında haber listesi çekilir

3. **Veri Transformation**
   - XML → JSON dönüşümü
   - Haber objelerinin standardizasyonu
   - Eksik alanların tamamlanması

4. **İçerik Analizi**
   - Her haberin linkine gidilerek tam içerik çekilir
   - HTML parse edilerek sadece ana metin elde edilir
   - Metin uzunluğu kontrolü (2000 karakter)

5. **AI Özetleme**
   - Uzun metinler için GPT-4 ile özetleme
   - Türkçe dilinde kısa ve öz özet oluşturma
   - Orijinal metnin korunması

6. **Veritabanı Kaydı**
   - Backend API'ye POST request
   - Hata durumunda retry mekanizması
   - Başarılı kayıt loglaması

#### **Kullanılan API Endpoint'leri**
- **POST** `@backend/api/news/`
- **Headers**: `x-api-key: your-api-key`

#### **Hata Yönetimi**
- HTTP timeout: 10 dakika
- Retry mekanizması aktif
- Hata durumunda workflow devam eder

---

### 2. 🎯 **stackOluştur** - Haber Kategorilendirme Workflow'u

#### **Amaç**
Mevcut haberleri AI kullanarak analiz etme, benzer haberleri gruplandırma ve "haber yığınları" oluşturma.

#### **Trigger Bilgileri**
- **Trigger Türü**: Schedule Trigger
- **Çalışma Sıklığı**: Her 2 saat

#### **Workflow Şeması**
```
Schedule → DB'den Haber Çek → Veri Hazırla → AI Analiz → 
JSON Parse → Stack Oluştur → DB'ye Kaydet
```

#### **İş Akışı Adımları**

1. **Veri Toplama**
   - Backend'den tüm haberleri çeker
   - İlk 100 haber ile sınırlandırır (performans için)
   - JSON formatında AI'ya hazırlar

2. **AI Analizi**
   - GPT-4o modeli kullanılır
   - Haberleri konularına göre gruplandırır
   - Minimum 3 haber içeren seriler oluşturur

3. **Seri Kuralları**
   - Kronolojik sıralama (pubDate)
   - Benzer konulu haberlerin gruplandırılması
   - Anlamlı seri başlıkları oluşturma
   - Uygun etiketlerin (tags) eklenmesi

4. **Stack Oluşturma**
   - Her seri için stack objesi oluşturur
   - İlgili haberleri stack'e bağlar
   - Status: "approved" olarak işaretler
   - `isPhotoUpToDate: false` (fotoğraf üretimi için)

5. **Veritabanı Kaydı**
   - Backend Stack API'sine POST
   - Her stack ayrı ayrı kaydedilir
   - Hata durumunda continue

#### **AI Prompt Özellikleri**
- **Model**: GPT-4o
- **Response Format**: JSON Object
- **Dil**: Türkçe
- **Minimum Seri Boyutu**: 3 haber
- **Maksimum İşlenen Haber**: 100

#### **Kullanılan API Endpoint'leri**
- **GET** `@backend/api/news` (veri çekme)
- **POST** `@backend/api/stacks` (stack kaydetme)

---

### 3. 🎨 **FotoOluştur** - AI Görsel Üretim Workflow'u

#### **Amaç**
Haber yığınları için AI destekli, gerçekçi ve etkileyici görseller üretme.

#### **Trigger Bilgileri**
- **Trigger Türü**: Schedule Trigger
- **Çalışma Sıklığı**: Her saat

#### **Workflow Şeması**
```
Schedule → Stack'leri Çek → Filtrele → AI Prompt Oluştur → 
OpenAI Görsel → Base64 Çevir → Backend'e Gönder → Loop
```

#### **İş Akışı Adımları**

1. **Stack Filtreleme**
   - Sadece `isPhotoUpToDate: false` olan stack'ler
   - Fotoğraf güncellenmesi gereken stack'leri belirler
   - Boş liste durumunda workflow sonlanır

2. **Dinamik Prompt Oluşturma**
   - Stack başlığı ve açıklaması analiz edilir
   - Konu kategorisine göre (savaş, ekonomi, teknoloji, spor vb.) özel prompt
   - Gerçekçilik odaklı görsel talimatları
   - Hassas konular için sembolik yaklaşım

3. **AI Görsel Üretimi**
   - **Model**: DALL-E 3 (OpenAI)
   - **Boyut**: 1792x1024 (16:9 aspect ratio)
   - **Stil**: Natural/Hyperrealistic
   - **Kalite**: 1080p

4. **Görsel İşleme**
   - Binary → Base64 dönüşümü
   - Data URI formatında hazırlama
   - Benzersiz dosya adı oluşturma

5. **Cloudinary Yükleme**
   - Backend görsel API'sine gönderme
   - Otomatik Cloudinary upload
   - URL oluşturma ve kaydetme

6. **Stack Güncelleme**
   - `isPhotoUpToDate: true` yapılır
   - Görsel URL'i stack'e bağlanır

#### **Prompt Çeşitleri**

| Konu Kategorisi | Stil Yaklaşımı | Örnek Prompt |
|----------------|----------------|--------------|
| **Savaş/Çatışma** | Sembolik sanat | "Yırtık bayrak, kırık barış güvercini heykeli" |
| **Ekonomi** | Kurumsal fotoğrafçılık | "Borsa grafikleri, modern ofis binası" |
| **Teknoloji** | Fütüristik realizam | "Yenilikçi cihaz, veri görselleştirme" |
| **Spor** | Aksiyon fotoğrafçılığı | "Sporcu anı, stadyum atmosferi" |
| **Sağlık** | Profesyonel medikal | "Laboratuvar, sembolik tıbbi ekipman" |

#### **Kullanılan API Endpoint'leri**
- **GET** `@backend/api/stacks` (stack listesi)
- **POST** `@backend/api/news-stack-images` (görsel upload)


---

## Hata Yönetimi

### Yaygın Hatalar ve Çözümleri

#### 1. **RSS Çekme Hataları**
- **Problem**: RSS feed'e erişilemiyor
- **Çözüm**: Retry mekanizması, alternatif URL'ler
- **İzleme**: HTTP status kodları

#### 2. **AI API Limitleri**
- **Problem**: OpenAI rate limit aşımı
- **Çözüm**: Exponential backoff, batch processing
- **İzleme**: API response kodları

#### 3. **Görsel Üretim Hataları**
- **Problem**: DALL-E content policy violation
- **Çözüm**: Prompt sanitization, fallback görseller
- **İzleme**: Error response analizi

#### 4. **Database Connection**
- **Problem**: Backend API'ye erişilemiyor
- **Çözüm**: Health check, retry logic
- **İzleme**: Connection timeout'ları

### Performance Optimization

1. **Batch Limitleri**
   - Haber çekme: 50 haber/batch
   - Stack oluşturma: 100 haber analizi
   - Görsel üretim: 1 görsel/request

2. **Timeout Ayarları**
   - HTTP requests: 10 dakika
   - AI processing: 5 dakika
   - File upload: 2 dakika

3. **Memory Management**
   - Base64 optimizasyonu
   - Large object cleanup
   - Garbage collection

---