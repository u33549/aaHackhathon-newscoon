# API Endpoint'leri Referansı

Tüm endpoint'lerin hızlı referansı ve örnek filtreler.

## İçindekiler

- [Parametre İsimlendirme Sözleşmesi](#parametre-isimlendirme-sözleşmesi)
- [Haber API'leri](#haber-apileri)
- [Haber Yığınları API'leri](#haber-yığınları-apileri)
- [Haber Yığını Resimleri API'leri](#haber-yığını-resimleri-apileri)
- [Filtreleme ve Query Parametreleri](#filtreleme-ve-query-parametreleri)
  - [Haber Filtreleme](#haber-filtreleme)
  - [Haber Yığınları Filtreleme](#haber-yığınları-filtreleme)

## Parametre İsimlendirme Sözleşmesi

- guid (newsGuid): RssNews belgesinin benzersiz GUID değeri (primary key)
- id (stackId): NewsStacks belgesinin MongoDB ObjectId değeri
- id (imageId): NewsStackImages belgesinin MongoDB ObjectId değeri
- newsStackId (stackId): NewsStacks MongoDB ObjectId değeri

Not: Hızlı referans tablosu sadece endpoint kapsamını gösterir; parametrelerin ayrıntılı açıklaması ve örnekler için ilgili detay dokümanlarına bakın (Docs klasörü).

## Haber API'leri

| Endpoint | Metod | Açıklama | Parametreler |
|----------|-------|----------|-------------|
| `/api/news` | GET | Tüm haberleri listele | `pubDate`, `isInAnyStack`, `isUsable`, `category`, `limit` |
| `/api/news` | POST | Yeni haber ekle | - |
| `/api/news/bulk` | POST | Toplu haber ekle | - |
| `/api/news/guid/:guid` | GET | GUID'ye (newsGuid) göre haber getir | - |
| `/api/news/guid/:guid` | PUT | GUID'ye (newsGuid) göre haber güncelle | - |
| `/api/news/guid/:guid` | DELETE | GUID'ye (newsGuid) göre haber sil | - |

## Haber Yığınları API'leri

| Endpoint | Metod | Açıklama | Parametreler |
|----------|-------|----------|-------------|
<<<<<<< HEAD
| `/api/stacks` | GET | Tüm haber yığınlarını listele | `status`, `isFeatured`, `tags`, `categories`, `mainCategory`, `limit`, `sortBy`, `sortOrder` |
=======
| `/api/stacks` | GET | Tüm haber yığınlarını listele | `status`, `isFeatured`, `tags`, `limit`, `sortBy`, `sortOrder` |
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
| `/api/stacks` | POST | Yeni haber yığını ekle | - |
| `/api/stacks/:id` | GET | ID'ye (stackId) göre haber yığını getir | - |
| `/api/stacks/:id` | PUT | ID'ye (stackId) göre haber yığını güncelle | - |
| `/api/stacks/:id` | DELETE | ID'ye (stackId) göre haber yığını sil | - |
| `/api/stacks/:id/addNews` | POST | Haber yığınına haber ekle (stackId + newsGuid) | - |
| `/api/stacks/:id/removeNews` | POST | Haber yığınından haber çıkar (stackId + newsGuid) | - |

> Not: Haber yığınları GET yanıtlarında, varsa kapak görselinin URL'si `photoUrl` alanı olarak döner; görsel yoksa `null` olur.

## Haber Yığını Resimleri API'leri

| Endpoint | Metod | Açıklama | Parametreler |
|----------|-------|----------|-------------|
| `/api/news-stack-images` | GET | Tüm resimleri listele | `newsStackId`, `limit` |
| `/api/news-stack-images` | POST | Base64 resim yükle veya varsa güncelle (newsStackId) | - |
| `/api/news-stack-images/:id` | GET | ID'ye (imageId) göre resim getir | - |
| `/api/news-stack-images/:id` | PUT | ID'ye (imageId) göre resim güncelle | - |
| `/api/news-stack-images/:id` | DELETE | ID'ye (imageId) göre resim sil | - |
| `/api/news-stack-images/news/:newsStackId` | GET | NewsStack ID'ye (stackId) göre resim getir | - |
| `/api/news-stack-images/news/:newsStackId` | PUT | NewsStack ID'ye (stackId) göre resim güncelle | - |
| `/api/news-stack-images/news/:newsStackId` | DELETE | NewsStack ID'ye (stackId) göre resim sil | - |

## Filtreleme ve Query Parametreleri

### Haber Filtreleme

```bash
# Tarihe göre filtreleme
GET /api/news?pubDate=2023-05-21
GET /api/news?pubDate[gt]=2023-05-01&pubDate[lt]=2023-05-30

# Stack durumuna göre filtreleme
GET /api/news?isInAnyStack=true

# Kategoriye göre filtreleme
GET /api/news?category=gundem

# Kullanılabilirliğe göre filtreleme
GET /api/news?isUsable=true

# Sonuçları sınırlama
GET /api/news?limit=10

# Kombinasyon örnekleri
GET /api/news?isInAnyStack=true&limit=5&pubDate[gt]=2023-05-01
GET /api/news?category=gundem&limit=5&isUsable=true
```

### Haber Yığınları Filtreleme

```bash
# Duruma göre filtreleme
GET /api/stacks?status=approved

# Öne çıkarılan yığınlar
GET /api/stacks?isFeatured=true

# Etiketlere göre filtreleme
GET /api/stacks?tags=politika,gündem

<<<<<<< HEAD
# Kategorilere göre filtreleme
GET /api/stacks?categories=ekonomi,spor

# Ana kategoriye göre filtreleme
GET /api/stacks?mainCategory=ekonomi

=======
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
# Sıralama
GET /api/stacks?sortBy=viewCount&sortOrder=desc

# Kombinasyon örnekleri
GET /api/stacks?status=approved&isFeatured=true&limit=3
<<<<<<< HEAD
GET /api/stacks?categories=ekonomi&mainCategory=ekonomi&limit=5
=======
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
GET /api/stacks?limit=5&sortBy=viewCount&sortOrder=desc
```
