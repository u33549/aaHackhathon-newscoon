# AA Hackathon Backend API

Bu proje, MongoDB ve Express.js kullanılarak geliştirilen bir RSS haber API'sidir. API, haber verilerinin MongoDB veritabanında saklanmasını ve CRUD (Create, Read, Update, Delete) işlemlerinin gerçekleştirilmesini sağlar.

## İçerik

- [Yapılandırma](#yapılandırma)
- [API Güvenliği](#api-güvenliği)
- [Kullanım](#kullanım)
- [API Endpoint'leri](#api-endpointleri)
  - [Haber API'leri](#haber-apileri)
  - [Haber Yığınları API'leri](#haber-yığınları-apileri)
  - [Haber Yığını Resimleri API'leri](#haber-yığını-resimleri-apileri)
- [API Fonksiyonları ve Kullanımları](#api-fonksiyonları-ve-kullanımları)
- [Veri Modeli](#veri-modeli)
- [Filtreleme ve Sınırlama](#filtreleme-ve-sınırlama)
- [Lisans](#lisans)


## Yapılandırma

Uygulama aşağıdaki yapılandırma dosyalarını kullanır:

- `.env`: Ortam değişkenleri (MongoDB URI, port, ortam, API anahtarı, Cloudinary bilgileri)
- `config/db.js`: MongoDB bağlantı ayarları
- `config/cloudinary.js`: Cloudinary ayarları (görsel yükleme)

Görsel yükleme için gerekli ortam değişkenleri:

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
API_KEY=your-secret-api-key
```

## API Güvenliği

Bu API, okuma ve yazma işlemleri için farklı yetkilendirme düzeyleri uygular:

- **Okuma İşlemleri (GET)**: Herkes tarafından erişilebilir. Kimlik doğrulama gerekmez.
- **Yazma İşlemleri (POST, PUT, DELETE)**: Sadece geçerli API anahtarına sahip kullanıcılar tarafından erişilebilir.

### API Anahtarı Kullanımı

Yazma işlemleri için isteklerinize `x-api-key` header'ı eklemeniz gerekmektedir:

```
x-api-key: your-secret-api-key
```

Örnek (cURL ile):

```bash
# GET isteği - API anahtarı gerekmez
curl http://localhost:3000/api/news

# POST isteği - API anahtarı gerekir
curl -X POST \
  http://localhost:3000/api/news \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: your-secret-api-key' \
  -d '{"guid": "unique-id", "title": "Haber Başlığı", ...}'
```

## Kullanım

API'yi kullanmak için aşağıdaki endpoint'lere HTTP istekleri gönderebilirsiniz.

### API Endpoint'leri

#### Haber API'leri

| Endpoint | Metod | Açıklama | Parametreler |
|----------|-------|----------|-------------|
| `/api/news` | GET | Tüm haberleri listele | `pubDate`, `isInAnyStack`, `isUsable`, `limit` |
| `/api/news` | POST | Yeni haber ekle | - |
| `/api/news/bulk` | POST | Toplu haber ekle | - |
| `/api/news/:id` | GET | ID'ye göre haber getir | - |
| `/api/news/:id` | PUT | ID'ye göre haber güncelle | - |
| `/api/news/:id` | DELETE | ID'ye göre haber sil | - |
| `/api/news/guid/:guid` | GET | GUID'ye göre haber getir | - |
| `/api/news/guid/:guid` | PUT | GUID'ye göre haber güncelle | - |
| `/api/news/guid/:guid` | DELETE | GUID'ye göre haber sil | - |

#### Haber Yığınları API'leri

| Endpoint | Metod | Açıklama | Parametreler |
|----------|-------|----------|-------------|
| `/api/stacks` | GET | Tüm haber yığınlarını listele | `status`, `isFeatured`, `tags`, `limit`, `sortBy`, `sortOrder` |
| `/api/stacks` | POST | Yeni haber yığını ekle | - |
| `/api/stacks/:id` | GET | ID'ye göre haber yığını getir | - |
| `/api/stacks/:id` | PUT | ID'ye göre haber yığını güncelle | - |
| `/api/stacks/:id` | DELETE | ID'ye göre haber yığını sil | - |
| `/api/stacks/:id/addNews` | POST | Haber yığınına haber ekle | - |
| `/api/stacks/:id/removeNews` | POST | Haber yığınından haber çıkar | - |

Not: Haber yığınları GET yanıtlarında, varsa kapak görselinin URL’si `photoUrl` alanı olarak döner; görsel yoksa `null` olur.

#### Haber Yığını Resimleri API'leri

| Endpoint | Metod | Açıklama | Parametreler |
|----------|-------|----------|-------------|
| `/api/news-stack-images` | GET | Tüm resimleri listele | `newsStackId`, `limit` |
| `/api/news-stack-images` | POST | Base64 resim yükle veya varsa güncelle | - |
| `/api/news-stack-images/:id` | GET | ID'ye göre resim getir | - |
| `/api/news-stack-images/:id` | PUT | ID'ye göre resim güncelle | - |
| `/api/news-stack-images/:id` | DELETE | ID'ye göre resim sil | - |
| `/api/news-stack-images/news/:newsStackId` | GET | NewsStack ID'ye göre resim getir | - |
| `/api/news-stack-images/news/:newsStackId` | PUT | NewsStack ID'ye göre resim güncelle | - |
| `/api/news-stack-images/news/:newsStackId` | DELETE | NewsStack ID'ye göre resim sil | - |

## API Fonksiyonları ve Kullanımları

### Haber API Fonksiyonları

#### 1. Tüm haberleri getir (`getAllNews`)

```
GET /api/news
```

**Açıklama:** Veritabanındaki haberleri filtreli şekilde getirir. Farklı parametrelerle filtrelenebilir ve sınırlandırılabilir.

**Query Parametreleri:**
- `pubDate`: Yayın tarihine göre filtreleme. Değer direkt tarih olabilir veya `pubDate[gt]=2023-01-01` gibi büyük/küçük karşılaştırmalar yapılabilir.
- `isInAnyStack`: "true" veya "false" değeri alır. Bir yığında olup olmadığına göre filtreleme yapar.
- `isUsable`: "true" veya "false" değeri alır. Kullanılabilir olup olmadığına göre filtreleme yapar.
- `category`: Haberin kategorisine göre filtreleme yapar. Değerler: "gundem", "dunya", "ekonomi", "spor", "analiz", "kultur".
- `limit`: Dönecek maksimum haber sayısı. Varsayılan olarak limit yok (-1).

**Dönen Değer:**
```javascript
{
  "success": true,
  "count": 25,
  "data": [
    {
      "guid": "unique-id-1",
      "title": "Haber Başlığı"
      // ...diğer alanlar...
    }
    // ...diğer haberler...
  ]
}
```

#### 2. ID'ye göre haber getir (`getNewsById`)

```
GET /api/news/:id
```

**Açıklama:** MongoDB tarafından atanan ID'ye göre tek bir haberi getirir.

**URL Parametreleri:**
- `id`: Haberin MongoDB ID'si

**Dönen Değer:**
```javascript
{
  "success": true,
  "data": {
    "guid": "unique-id-1",
    "title": "Haber Başlığı"
    // ...diğer alanlar...
  }
}
```

#### 3. GUID'ye göre haber getir (`getNewsByGuid`)

```
GET /api/news/guid/:guid
```

**Açıklama:** RSS feed'indeki GUID değerine göre haberi getirir.

**URL Parametreleri:**
- `guid`: Haberin benzersiz GUID değeri

**Dönen Değer:**
```javascript
{
  "success": true,
  "data": {
    "guid": "unique-id-1",
    "title": "Haber Başlığı"
    // ...diğer alanlar...
  }
}
```

#### 4. Yeni haber oluştur (`createNews`)

```
POST /api/news
```

**Açıklama:** Veritabanına yeni bir haber ekler. Aynı GUID ile başka bir haber varsa ekleme yapılmaz.

**Gönderilecek Veri (JSON):**
```javascript
{
  "guid": "unique-id-1",
  "link": "https://example.com/news/1",
  "title": "Haber Başlığı",
  "description": "Haberin açıklaması",
  "pubDate": "Fri, 21 May 2023 14:30:00 GMT",
  "image": "https://example.com/images/news1.jpg"
}
```

**Dönen Değer:**
```javascript
{
  "success": true,
  "data": {
    "guid": "unique-id-1",
    "title": "Haber Başlığı"
    // ...diğer alanlar...
  }
}
```

#### 5. Toplu haber oluştur (`createBulkNews`)

```
POST /api/news/bulk
```

**Açıklama:** Birden fazla haberi tek seferde ekler. Var olan GUID'ler atlanır, sadece yeni GUID'ler eklenir.

**Gönderilecek Veri (JSON):**
```javascript
[
  {
    "guid": "unique-id-1",
    "link": "https://example.com/news/1",
    "title": "Haber Başlığı 1",
    "description": "Haber açıklaması 1",
    "pubDate": "Fri, 21 May 2023 14:30:00 GMT"
  },
  {
    "guid": "unique-id-2",
    "link": "https://example.com/news/2",
    "title": "Haber Başlığı 2",
    "description": "Haber açıklaması 2",
    "pubDate": "Fri, 21 May 2023 15:00:00 GMT"
  }
]
```

**Dönen Değer:**
```javascript
{
  "success": true,
  "results": [
    {
      "guid": "unique-id-1",
      "status": "created",
      "id": "609e1e24a12a452a3c4c5e20"
    },
    {
      "guid": "unique-id-2",
      "status": "skipped",
      "message": "Bu GUID ile daha önce bir haber kaydedilmiş"
    }
  ]
}
```

#### 6. Haberi güncelle (`updateNews`)

```
PUT /api/news/:id
```

**Açıklama:** ID'ye göre haberi günceller.

**URL Parametreleri:**
- `id`: Haberin MongoDB ID'si

**Gönderilecek Veri (JSON):**
```javascript
{
  "title": "Güncellenmiş Başlık",
  "description": "Güncellenmiş açıklama",
  "isInAnyStack": true
}
```

**Dönen Değer:**
```javascript
{
  "success": true,
  "data": {
    "guid": "unique-id-1",
    "title": "Güncellenmiş Başlık"
    // ...diğer alanlar...
  }
}
```

#### 7. GUID'ye göre haberi güncelle (`updateNewsByGuid`)

```
PUT /api/news/guid/:guid
```

**Açıklama:** GUID'ye göre haberi günceller.

**URL Parametreleri:**
- `guid`: Haberin benzersiz GUID değeri

**Gönderilecek Veri (JSON):**
```javascript
{
  "title": "Güncellenmiş Başlık",
  "description": "Güncellenmiş açıklama",
  "isInAnyStack": true
}
```

**Dönen Değer:**
```javascript
{
  "success": true,
  "data": {
    "guid": "unique-id-1",
    "title": "Güncellenmiş Başlık"
    // ...diğer alanlar...
  }
}
```

#### 8. Haberi sil (`deleteNews`)

```
DELETE /api/news/:id
```

**Açıklama:** ID'ye göre haberi siler ve otomatik olarak tüm haber yığınlarından da kaldırır.

**URL Parametreleri:**
- `id`: Haberin MongoDB ID'si

**Dönen Değer:**
```javascript
{
  "success": true,
  "message": "Haber başarıyla silindi ve tüm stacklerden kaldırıldı",
  "data": {}
}
```

#### 9. GUID'ye göre haberi sil (`deleteNewsByGuid`)

```
DELETE /api/news/guid/:guid
```

**Açıklama:** GUID'ye göre haberi siler ve otomatik olarak tüm haber yığınlarından da kaldırır.

**URL Parametreleri:**
- `guid`: Haberin benzersiz GUID değeri

**Dönen Değer:**
```javascript
{
  "success": true,
  "message": "Haber başarıyla silindi ve tüm stacklerden kaldırıldı",
  "data": {}
}
```

### Haber Yığınları API Fonksiyonları

#### 1. Tüm haber yığınlarını getir (`getAllNewsStacks`)

```
GET /api/stacks
```

**Açıklama:** Veritabanındaki haber yığınlarını filtreli şekilde getirir. Farklı parametrelerle filtrelenebilir ve sınırlandırılabilir.

**Query Parametreleri:**
- `status`: "pending", "approved" veya "rejected" değeri alır. Durum değerine göre haber yığınlarını filtrelemek için kullanılır.
- `isFeatured`: "true" veya "false" değeri alır. Öne çıkarılan haber yığınlarını filtrelemek için kullanılır.
- `tags`: Etiketlere göre filtreleme yapar. Birden fazla etiket için virgülle ayırabilirsiniz.
- `limit`: Dönecek maksimum haber yığını sayısı. Varsayılan olarak limit yok (-1).
- `sortBy`: Sıralama alanı (createdAt, viewCount, title vb.). Varsayılan: "createdAt"
- `sortOrder`: Sıralama düzeni ("asc" veya "desc"). Varsayılan: "desc"

**Dönen Değer:**
```javascript
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "609e1e24a12a452a3c4c5e20",
      "title": "Haber Yığını Başlığı",
      "description": "Haber yığınının açıklaması",
      "news": [
        {
          "id": "609e1e24a12a452a3c4c5e21",
          "guid": "news-guid-1"
        }
      ],
      "status": "approved",
      "viewCount": 150,
      "tags": ["politika", "gündem"],
      "isFeatured": false,
      "createdAt": "2023-05-21T14:30:00.000Z",
      "updatedAt": "2023-05-21T14:30:00.000Z",
      "photoUrl": "https://res.cloudinary.com/.../image.jpg"
    }
  ]
}
```

#### 2. ID'ye göre haber yığını getir (`getNewsStackById`)

```
GET /api/stacks/:id
```

**Açıklama:** MongoDB tarafından atanan ID'ye göre tek bir haber yığını getirir ve görüntülenme sayısını otomatik olarak artırır.

**URL Parametreleri:**
- `id`: Haber yığınının MongoDB ID'si

**Dönen Değer:**
```javascript
{
  "success": true,
  "data": {
    "_id": "609e1e24a12a452a3c4c5e20",
    "title": "Haber Yığını Başlığı",
    "description": "Haber yığınının açıklaması",
    "news": [
      {
        "id": {
          "_id": "609e1e24a12a452a3c4c5e21",
          "title": "Haber Başlığı",
          "link": "https://example.com/news/1",
          "pubDate": "Fri, 21 May 2023 14:30:00 GMT",
          "image": "https://example.com/images/news1.jpg",
          "category": "gundem"
        },
        "guid": "news-guid-1"
      }
    ],
    "status": "approved",
    "viewCount": 151,
    "tags": ["politika", "gündem"],
    "isFeatured": false,
    "photoUrl": "https://res.cloudinary.com/.../image.jpg"
  }
}
```

#### 3. Yeni haber yığını oluştur (`createNewsStack`)

```
POST /api/stacks
```

**Açıklama:** Veritabanına yeni bir haber yığını ekler. Haber ID'lerinin geçerli olduğunu kontrol eder.

**Gönderilecek Veri (JSON):**
```javascript
{
  "title": "Haber Yığını Başlığı",
  "description": "Haber yığınının açıklaması",
  "news": [
    "609e1e24a12a452a3c4c5e21",
    "609e1e24a12a452a3c4c5e22"
  ],
  "status": "pending",
  "tags": ["politika", "gündem"],
  "isFeatured": false
}
```

**Dönen Değer:**
```javascript
{
  "success": true,
  "data": {
    "_id": "609e1e24a12a452a3c4c5e20",
    "title": "Haber Yığını Başlığı",
    "description": "Haber yığınının açıklaması",
    "news": [
      {
        "id": {
          "title": "Haber Başlığı",
          "link": "https://example.com/news/1"
        },
        "guid": "auto-filled-guid"
      }
    ],
    "status": "pending",
    "viewCount": 0,
    "tags": ["politika", "gündem"],
    "isFeatured": false
  }
}
```

#### 4. Haber yığını güncelle (`updateNewsStack`)

```
PUT /api/stacks/:id
```

**Açıklama:** ID'ye göre haber yığını günceller.

**URL Parametreleri:**
- `id`: Haber yığınının MongoDB ID'si

**Gönderilecek Veri (JSON):**
```javascript
{
  "title": "Güncellenmiş Başlık",
  "description": "Güncellenmiş açıklama",
  "status": "approved",
  "isFeatured": true,
  "tags": ["gündem", "ekonomi"]
}
```

#### 5. Haber yığını sil (`deleteNewsStack`)

```
DELETE /api/stacks/:id
```

**Açıklama:** ID'ye göre haber yığını siler.

#### 6. Haber yığınına haber ekle (`addNewsToStack`)

```
POST /api/stacks/:id/addNews
```

**Açıklama:** Mevcut bir haber yığınına yeni haber ekler.

**Gönderilecek Veri (JSON):**
```javascript
{
  "newsId": "609e1e24a12a452a3c4c5e23"
}
```

#### 7. Haber yığınından haber çıkar (`removeNewsFromStack`)

```
POST /api/stacks/:id/removeNews
```

**Açıklama:** Haber yığınından belirli bir haberi çıkarır.

**Gönderilecek Veri (JSON):**
```javascript
{
  "newsId": "609e1e24a12a452a3c4c5e23"
}
```

### Haber Yığını Resimleri API Fonksiyonları

#### 1. Tüm resimleri getir (`getAllImages`)

```
GET /api/news-stack-images
```

**Açıklama:** Haber yığını resimlerini listeleyip, isteğe bağlı filtre ve limit uygular.

**Query Parametreleri:**
- `newsStackId`: Belirli bir haber yığınının resmini(lerini) filtrelemek için.
- `limit`: Dönecek maksimum kayıt sayısı. Varsayılan: sınırsız (-1).

**Dönen Değer:**
```javascript
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "66f0a...",
      "newsStackId": {
        "_id": "66f09...",
        "title": "Stack Başlığı",
        "description": "Stack açıklaması"
      },
      "photoUrl": "https://res.cloudinary.com/.../image.jpg",
      "cloudinaryPublicId": "newsstacks/newsstack_...",
      "originalName": "kapak.jpg",
      "format": "jpg",
      "width": 1200,
      "height": 630,
      "bytes": 120345,
      "createdAt": "2025-10-02T12:00:00.000Z",
      "updatedAt": "2025-10-02T12:00:00.000Z"
    }
  ]
}
```

#### 2. ID'ye göre resim getir (`getImageById`)

```
GET /api/news-stack-images/:id
```

**Açıklama:** ID'ye göre tek bir resmi getirir.

**Dönen Değer:**
```javascript
{
  "success": true,
  "data": {
    "_id": "66f0a...",
    "newsStackId": {
      "_id": "66f09...",
      "title": "Stack Başlığı",
      "description": "Stack açıklaması"
    },
    "photoUrl": "https://res.cloudinary.com/.../image.jpg",
    "cloudinaryPublicId": "newsstacks/newsstack_...",
    "originalName": "kapak.jpg",
    "format": "jpg",
    "width": 1200,
    "height": 630,
    "bytes": 120345
  }
}
```

#### 3. NewsStack ID'ye göre resim getir (`getImageByNewsStackId`)

```
GET /api/news-stack-images/news/:newsStackId
```

**Açıklama:** Belirli bir haber yığınına ait resmi getirir.

#### 4. Base64 resim yükle veya güncelle (`createOrUpdateImage`)

```
POST /api/news-stack-images
```

**Açıklama:** Gönderilen Base64 resmi Cloudinary'ye yükler ve ilgili haber yığını ile ilişkilendirir. Aynı `newsStackId` için kayıt varsa günceller. Başarı durumunda yeni kayıt için 201, güncelleme için 200 döner.

**Gönderilecek Veri (JSON):**
```javascript
{
  "newsStackId": "66f09...", 
  "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABA...",
  "originalName": "kapak.jpg"
}
```

**Dönen Değer:**
```javascript
{
  "success": true,
  "message": "Resim başarıyla yüklendi",
  "data": {
    "_id": "66f0a...",
    "newsStackId": {
      "_id": "66f09...",
      "title": "Stack Başlığı",
      "description": "Stack açıklaması"
    },
    "photoUrl": "https://res.cloudinary.com/.../image.jpg",
    "cloudinaryPublicId": "newsstacks/newsstack_...",
    "originalName": "kapak.jpg",
    "format": "jpg",
    "width": 1200,
    "height": 630,
    "bytes": 120345
  }
}
```

> Not: Bu endpoint yazma işlemidir; `x-api-key` header'ı gerektirir.

#### 5. ID'ye göre resim güncelle (`updateImageById`)

```
PUT /api/news-stack-images/:id
```

**Açıklama:** Mevcut kaydı yeni Base64 görselle günceller veya sadece `originalName` alanını değiştirebilir.

**Gönderilecek Veri (JSON) (örnek):**
```javascript
{
  "photo": "data:image/png;base64,iVBORw0KGgo...",
  "originalName": "guncel.png"
}
```

#### 6. NewsStack ID'ye göre resim güncelle (`updateImageByNewsStackId`)

```
PUT /api/news-stack-images/news/:newsStackId
```

**Açıklama:** Belirtilen `newsStackId` kaydını günceller.

#### 7. ID'ye göre resim sil (`deleteImageById`)

```
DELETE /api/news-stack-images/:id
```

**Açıklama:** Kaydı veritabanından ve görseli Cloudinary'den siler.

#### 8. NewsStack ID'ye göre resim sil (`deleteImageByNewsStackId`)

```
DELETE /api/news-stack-images/news/:newsStackId
```

**Açıklama:** Belirtilen haber yığınına ait görseli ve kaydı siler.

## Veri Modeli

### RSS Haber Modeli

```javascript
{
  guid: String,            // Benzersiz tanımlayıcı (zorunlu)
  isPermaLink: String,     // Kalıcı link bilgisi ("true" veya "false") (varsayılan: "false")
  link: String,            // Haberin linki (zorunlu)
  title: String,           // Haber başlığı (zorunlu)
  description: String,     // Haber açıklaması (zorunlu)
  pubDate: String,         // Yayın tarihi (zorunlu)
  image: String,           // Haber görseli (opsiyonel)
  category: String,        // Haber kategorisi (zorunlu) - Değerler: ["gundem","dunya","ekonomi","spor","analiz","kultur"]
  isInAnyStack: Boolean,   // Yığında olup olmadığı (varsayılan: false)
  isUsable: Boolean,       // Kullanılabilir olup olmadığı (varsayılan: true)
  createdAt: Date,         // Oluşturulma zamanı (otomatik oluşturulur)
  updatedAt: Date          // Güncellenme zamanı (otomatik güncellenir)
}
```

### Haber Yığını Modeli (NewsStacks)

```javascript
{
  title: String,           // Yığın başlığı (zorunlu)
  description: String,     // Yığın açıklaması
  news: [                  // Haber referansları
    {
      id: ObjectId,        // RssNews tablosuna referans (zorunlu)
      guid: String         // Haberin GUID'si (zorunlu)
    }
  ],
  status: String,          // Durum ("pending", "approved", "rejected") (varsayılan: "pending")
  viewCount: Number,       // Görüntülenme sayısı (varsayılan: 0)
  tags: [String],          // Etiketler (opsiyonel)
  isFeatured: Boolean,     // Öne çıkarılma durumu (varsayılan: false)
  createdAt: Date,         // Oluşturulma zamanı (otomatik oluşturulur)
  updatedAt: Date          // Güncellenme zamanı (otomatik güncellenir)
}
```

### Haber Yığını Resim Modeli (NewsStackImages)

```javascript
{
  newsStackId: ObjectId,      // NewsStacks tablosuna referans (benzersiz & zorunlu)
  cloudinaryPublicId: String, // Cloudinary'de dosyanın public_id değeri (zorunlu)
  photoUrl: String,           // Yüklenen görselin erişim URL'si (zorunlu)
  originalName: String,       // İsteğe bağlı orijinal dosya adı
  format: String,             // Görsel formatı (jpg, png, webp ...)
  width: Number,              // Genişlik (px)
  height: Number,             // Yükseklik (px)
  bytes: Number,              // Dosya boyutu (byte)
  createdAt: Date,            // Otomatik
  updatedAt: Date             // Otomatik
}
```

## Filtreleme ve Sınırlama

API, haberleri filtrelemek ve sınırlandırmak için çeşitli parametreler sunar:

1. **Tarihe göre filtreleme**:
   ```
   GET /api/news?pubDate=2023-05-21
   GET /api/news?pubDate[gt]=2023-05-01&pubDate[lt]=2023-05-30
   ```

2. **Stack durumuna göre filtreleme**:
   ```
   GET /api/news?isInAnyStack=true
   ```

3. **Kullanılabilirliğe göre filtreleme**:
   ```
   GET /api/news?isUsable=true
   ```

4. **Sonuçları sınırlama**:
   ```
   GET /api/news?limit=10
   ```

5. **Kombinasyon**:
   ```
   GET /api/news?isInAnyStack=true&limit=5&pubDate[gt]=2023-05-01
   ```

## Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.
