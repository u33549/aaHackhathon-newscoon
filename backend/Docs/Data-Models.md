# Veri Modelleri

API'de kullanılan tüm veri modelleri ve ilişkileri.

## İçindekiler

- [RSS Haber Modeli (RssNews)](#rss-haber-modeli-rssnews)
- [Haber Yığını Modeli (NewsStacks)](#haber-yığını-modeli-newsstacks)
  - [Fotoğraf Güncelleme Sistemi](#fotoğraf-güncelleme-sistemi)
- [Haber Yığını Resim Modeli (NewsStackImages)](#haber-yığını-resim-modeli-newsstackimages)
- [İlişkiler](#ilişkiler)
- [Örnek Veri Yapıları](#örnek-veri-yapıları)

---

## RSS Haber Modeli (RssNews)

```javascript
{
  _id: String,             // guid değeriyle otomatik doldurulur (primary key)
  guid: String,            // Benzersiz tanımlayıcı (zorunlu, unique, index)
  isPermaLink: String,     // "true" | "false" (varsayılan: "false")
  link: String,            // Haberin URL'i (zorunlu)
  title: String,           // Başlık (zorunlu)
  description: String,     // Açıklama (zorunlu)
  pubDate: String,         // RFC 2822 tarih (zorunlu)
  image: String,           // Görsel URL (opsiyonel)
  category: String,        // "gundem" | "dunya" | "ekonomi" | "spor" | "analiz" | "kultur"
  isInAnyStack: Boolean,   // Herhangi bir yığında mı? (varsayılan: false)
  isUsable: Boolean,       // Kullanılabilirlik (varsayılan: true)
  createdAt: Date,
  updatedAt: Date
}
```

**Not:** RssNews artık `guid` alanını primary key olarak kullanır. Tüm CRUD işlemleri GUID üzerinden yapılır.

---

## Haber Yığını Modeli (NewsStacks)

```javascript
{
  title: String,           // Yığın başlığı (zorunlu)
  description: String,     // Açıklama (opsiyonel)
  news: [String],          // Haber GUID referansları
  status: String,          // "pending" | "approved" | "rejected" (varsayılan: "pending")
  viewCount: Number,       // Varsayılan: 0
  tags: [String],          // Opsiyonel
  isFeatured: Boolean,     // Varsayılan: false
  isPhotoUpToDate: Boolean,// Varsayılan: false
  createdAt: Date,
  updatedAt: Date
}
```

### Fotoğraf Güncelleme Sistemi

`isPhotoUpToDate` alanı, yığının kapağının güncel olup olmadığını belirtir.

- false olur: Haber eklendiğinde/çıkarıldığında veya liste güncellendiğinde
- true olur: Yeni kapak yüklendiğinde ya da kapak güncellendiğinde

---

## Haber Yığını Resim Modeli (NewsStackImages)

```javascript
{
  newsStackId: ObjectId,      // NewsStacks'e benzersiz referans
  cloudinaryPublicId: String, // Cloudinary public_id
  photoUrl: String,           // Erişim URL'si
  originalName: String,       // Orijinal dosya adı (opsiyonel)
  format: String,             // jpg | png | webp ...
  width: Number,              // px
  height: Number,             // px
  bytes: Number,              // byte
  createdAt: Date,
  updatedAt: Date
}
```

---

## İlişkiler

- RssNews ↔ NewsStacks: Çoktan çoğa (NewsStacks.news dizisi GUID referansları üzerinden)
- NewsStacks ↔ NewsStackImages: Bire bir (her yığının tek kapağı olur)

---

## Örnek Veri Yapıları

### Haber (RssNews)
```json
{
  "_id": "aa-news-20231002-001",
  "guid": "aa-news-20231002-001",
  "isPermaLink": "false",
  "link": "https://example.com/news/ekonomi-paketi",
  "title": "Yeni Ekonomik Teşvik Paketi Açıklandı",
  "description": "Hükümet tarafından açıklanan yeni ekonomik teşvik paketi...",
  "pubDate": "Mon, 02 Oct 2023 15:30:00 GMT",
  "image": "https://example.com/images/ekonomi-paketi.jpg",
  "category": "ekonomi",
  "isInAnyStack": true,
  "isUsable": true
}
```

### Haber Yığını (NewsStacks)
```json
{
  "_id": "609e1e24a12a452a3c4c5e25",
  "title": "Gündem: Ekonomik Gelişmeler",
  "description": "Bu hafta yaşanan gelişmeler",
  "news": [
    "aa-news-20231002-001",
    "aa-news-20231002-002"
  ],
  "status": "approved",
  "viewCount": 142,
  "tags": ["ekonomi", "gündem"],
  "isFeatured": true,
  "isPhotoUpToDate": true
}
```

### Haber Yığını Resmi (NewsStackImages)
```json
{
  "_id": "66f0a1234567890abcdef123",
  "newsStackId": "609e1e24a12a452a3c4c5e25",
  "cloudinaryPublicId": "newsstacks/newsstack_609e1e24a12a452a3c4c5e25_1696258800",
  "photoUrl": "https://res.cloudinary.com/yourcloud/image/upload/v1696258800/newsstacks/newsstack_609e1e24a12a452a3c4c5e25_1696258800.jpg",
  "originalName": "ekonomi-paketi-kapak.jpg",
  "format": "jpg",
  "width": 1200,
  "height": 630,
  "bytes": 245670
}
```
