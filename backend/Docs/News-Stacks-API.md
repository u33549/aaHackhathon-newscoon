# Haber Yığınları API Fonksiyonları

Bu doküman Haber Yığınları (NewsStacks) API'sinin tüm fonksiyonlarını açıklar.

## İçindekiler

- [Parametre İsimlendirme Sözleşmesi](#parametre-isimlendirme-sözleşmesi)
- [1. Tüm Haber Yığınlarını Getir](#1-tüm-haber-yığınlarını-getir)
- [2. ID'ye Göre Haber Yığını Getir](#2-idye-göre-haber-yığını-getir)
- [3. Yeni Haber Yığını Oluştur](#3-yeni-haber-yığını-oluştur)
- [4. Haber Yığını Güncelle](#4-haber-yığını-güncelle)
- [5. Haber Yığını Sil](#5-haber-yığını-sil)
- [6. Haber Yığınına Haber Ekle](#6-haber-yığınına-haber-ekle)
- [7. Haber Yığınından Haber Çıkar](#7-haber-yığınından-haber-çıkar)
- [Önemli Notlar](#önemli-notlar)

---

## Parametre İsimlendirme Sözleşmesi

- id (stackId): Haber Yığınının MongoDB ObjectId değeri
- newsId: RssNews (haber) belgesinin MongoDB ObjectId değeri
- Yazma işlemleri için x-api-key header'ı zorunludur

---

## 1. Tüm Haber Yığınlarını Getir

```http
GET /api/stacks
```

Açıklama: Haber yığınlarını filtreli şekilde getirir; her yığın için kapak görseli varsa `photoUrl` alanı eklenir. `news` alanı minimal haber bilgileriyle doldurulur (populate).

İstek Şablonu:
- Yöntem: GET
- Yol: /api/stacks
- Sorgu Parametreleri (opsiyonel):
  - status: "pending" | "approved" | "rejected"
  - isFeatured: "true" | "false"
  - tags: virgülle ayrılmış etiketler (örn: politika,gündem)
  - limit: sonuç sayısı (pozitif tam sayı)
  - sortBy: createdAt | viewCount | title (varsayılan: createdAt)
  - sortOrder: asc | desc (varsayılan: desc)

Örnek İstekler:
```
GET /api/stacks
GET /api/stacks?status=approved
GET /api/stacks?isFeatured=true
GET /api/stacks?tags=politika,gündem
GET /api/stacks?limit=2&sortBy=viewCount&sortOrder=desc
```

Örnek Yanıt (tam):
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "609e1e24a12a452a3c4c5e25",
      "title": "Gündem: Ekonomik Gelişmeler",
      "description": "Bu hafta yaşanan gelişmeler",
      "news": [
        {
          "_id": "609e1e24a12a452a3c4c5e20",
          "title": "Yeni Ekonomik Teşvik Paketi Açıklandı",
          "link": "https://example.com/news/ekonomi-paketi",
          "pubDate": "Mon, 02 Oct 2023 15:30:00 GMT",
          "image": "https://example.com/images/ekonomi-paketi.jpg",
          "category": "ekonomi"
        }
      ],
      "status": "approved",
      "viewCount": 142,
      "tags": ["ekonomi", "gündem"],
      "isFeatured": true,
      "isPhotoUpToDate": true,
      "createdAt": "2023-10-02T12:00:00.000Z",
      "updatedAt": "2023-10-02T13:00:00.000Z",
      "photoUrl": "https://res.cloudinary.com/yourcloud/image/upload/v1696258800/newsstacks/newsstack_609e1e24a12a452a3c4c5e25_1696258800.jpg"
    },
    {
      "_id": "609e1e24a12a452a3c4c5e26",
      "title": "Spor: Haftanın Maçları",
      "description": "Öne çıkan maçlar",
      "news": [],
      "status": "pending",
      "viewCount": 0,
      "tags": ["spor"],
      "isFeatured": false,
      "isPhotoUpToDate": false,
      "createdAt": "2023-10-03T08:00:00.000Z",
      "updatedAt": "2023-10-03T08:00:00.000Z",
      "photoUrl": null
    }
  ]
}
```

---

## 2. ID'ye Göre Haber Yığını Getir

```http
GET /api/stacks/:id
```

Açıklama: Tek bir haber yığınını getirir, `viewCount` değerini 1 artırır ve varsa `photoUrl` ekler. `news` alanı genişletilmiş alanlarla doldurulur (title, link, pubDate, image, category, description, guid).

İstek Şablonu:
- Yöntem: GET
- Yol: /api/stacks/:id
- URL Parametreleri:
  - id (stackId): Haber yığınının MongoDB ObjectId değeri

Örnek İstek:
```
GET /api/stacks/609e1e24a12a452a3c4c5e25
```

Örnek Yanıt (tam):
```json
{
  "success": true,
  "data": {
    "_id": "609e1e24a12a452a3c4c5e25",
    "title": "Gündem: Ekonomik Gelişmeler",
    "description": "Bu hafta yaşanan gelişmeler",
    "news": [
      {
        "_id": "609e1e24a12a452a3c4c5e20",
        "title": "Yeni Ekonomik Teşvik Paketi Açıklandı",
        "link": "https://example.com/news/ekonomi-paketi",
        "pubDate": "Mon, 02 Oct 2023 15:30:00 GMT",
        "image": "https://example.com/images/ekonomi-paketi.jpg",
        "category": "ekonomi",
        "description": "Hükümet tarafından açıklanan yeni ekonomik teşvik paketi...",
        "guid": "aa-news-20231002-001"
      }
    ],
    "status": "approved",
    "viewCount": 143,
    "tags": ["ekonomi", "gündem"],
    "isFeatured": true,
    "isPhotoUpToDate": true,
    "createdAt": "2023-10-02T12:00:00.000Z",
    "updatedAt": "2023-10-02T13:05:00.000Z",
    "photoUrl": "https://res.cloudinary.com/yourcloud/image/upload/v1696258800/newsstacks/newsstack_609e1e24a12a452a3c4c5e25_1696258800.jpg"
  }
}
```

---

## 3. Yeni Haber Yığını Oluştur

```http
POST /api/stacks
```

İstek Şablonu:
- Yöntem: POST
- Yol: /api/stacks
- Başlıklar:
  - x-api-key: YOUR_API_KEY
- Gövde (şema):
```json
{
  "title": "HABER_YIGINI_BASLIGI",
  "description": "HABER_YIGINI_ACIKLAMASI",
  "news": ["<newsId>", "<newsId>"],
  "status": "pending",
  "tags": ["ETIKET_1", "ETIKET_2"],
  "isFeatured": false
}
```

Örnek İstek (curl):
```bash
curl -X POST "http://localhost:3000/api/stacks" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "title": "Gündem: Ekonomik Gelişmeler",
    "description": "Bu hafta yaşanan gelişmeler",
    "news": ["609e1e24a12a452a3c4c5e20"],
    "status": "pending",
    "tags": ["ekonomi", "gündem"],
    "isFeatured": true
  }'
```

Örnek Yanıt (tam, 201):
```json
{
  "success": true,
  "data": {
    "_id": "609e1e24a12a452a3c4c5e25",
    "title": "Gündem: Ekonomik Gelişmeler",
    "description": "Bu hafta yaşanan gelişmeler",
    "news": [
      {
        "_id": "609e1e24a12a452a3c4c5e20",
        "title": "Yeni Ekonomik Teşvik Paketi Açıklandı",
        "link": "https://example.com/news/ekonomi-paketi",
        "pubDate": "Mon, 02 Oct 2023 15:30:00 GMT",
        "image": "https://example.com/images/ekonomi-paketi.jpg",
        "category": "ekonomi"
      }
    ],
    "status": "pending",
    "viewCount": 0,
    "tags": ["ekonomi", "gündem"],
    "isFeatured": true,
    "isPhotoUpToDate": false,
    "createdAt": "2023-10-02T12:00:00.000Z",
    "updatedAt": "2023-10-02T12:00:00.000Z"
  }
}
```

---

## 4. Haber Yığını Güncelle

```http
PUT /api/stacks/:id
```

İstek Şablonu:
- Yöntem: PUT
- Yol: /api/stacks/:id
- Başlıklar:
  - x-api-key: YOUR_API_KEY
- URL Parametreleri:
  - id (stackId): Haber yığınının MongoDB ObjectId değeri
- Gövde (opsiyonel): title, description, status, isFeatured, tags, news[]

Örnek İstek (curl):
```bash
curl -X PUT "http://localhost:3000/api/stacks/609e1e24a12a452a3c4c5e25" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "title": "Güncel: Ekonomik Gelişmeler",
    "status": "approved",
    "tags": ["ekonomi", "gündem"]
  }'
```

Örnek Yanıt (tam, 200):
```json
{
  "success": true,
  "data": {
    "_id": "609e1e24a12a452a3c4c5e25",
    "title": "Güncel: Ekonomik Gelişmeler",
    "description": "Bu hafta yaşanan gelişmeler",
    "news": [
      {
        "_id": "609e1e24a12a452a3c4c5e20",
        "title": "Yeni Ekonomik Teşvik Paketi Açıklandı",
        "link": "https://example.com/news/ekonomi-paketi",
        "pubDate": "Mon, 02 Oct 2023 15:30:00 GMT",
        "image": "https://example.com/images/ekonomi-paketi.jpg",
        "category": "ekonomi"
      }
    ],
    "status": "approved",
    "viewCount": 142,
    "tags": ["ekonomi", "gündem"],
    "isFeatured": true,
    "isPhotoUpToDate": false,
    "createdAt": "2023-10-02T12:00:00.000Z",
    "updatedAt": "2023-10-02T14:00:00.000Z"
  }
}
```

Olası Hatalar:
- 404 Haber yığını bulunamadı
- 400 Geçersiz haber ID'leri (news[] güncellenirken)

---

## 5. Haber Yığını Sil

```http
DELETE /api/stacks/:id
```

İstek Şablonu:
- Yöntem: DELETE
- Yol: /api/stacks/:id
- Başlıklar:
  - x-api-key: YOUR_API_KEY
- URL Parametreleri:
  - id (stackId): Haber yığınının MongoDB ObjectId değeri

Örnek Yanıt (200):
```json
{
  "success": true,
  "message": "Haber yığını başarıyla silindi",
  "data": {}
}
```

---

## 6. Haber Yığınına Haber Ekle

```http
POST /api/stacks/:id/addNews
```

Açıklama: Mevcut bir haber yığınına yeni bir haber (RssNews kaydı) ekler. `id (stackId)` ve `newsId` farklı kaynakları temsil eder; biri NewsStacks, diğeri RssNews belgesidir.

İstek Şablonu:
- Yöntem: POST
- Yol: /api/stacks/:id/addNews
- Başlıklar:
  - x-api-key: YOUR_API_KEY
- URL Parametreleri:
  - id (stackId): Haber Yığınının MongoDB ObjectId değeri
- Gövde (şema):
```json
{ "newsId": "EKLENECEK_HABERIN_RSSNEWS_ID" }
```

Örnek İstek (curl):
```bash
curl -X POST "http://localhost:3000/api/stacks/609e1e24a12a452a3c4c5e25/addNews" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "newsId": "609e1e24a12a452a3c4c5e20"
  }'
```

Örnek Başarılı Yanıt (tam, 200):
```json
{
  "success": true,
  "data": {
    "_id": "609e1e24a12a452a3c4c5e25",
    "title": "Gündem: Ekonomik Gelişmeler",
    "description": "Bu hafta yaşanan gelişmeler",
    "news": [
      {
        "_id": "609e1e24a12a452a3c4c5e20",
        "title": "Yeni Ekonomik Teşvik Paketi Açıklandı",
        "link": "https://example.com/news/ekonomi-paketi",
        "pubDate": "Mon, 02 Oct 2023 15:30:00 GMT",
        "image": "https://example.com/images/ekonomi-paketi.jpg",
        "category": "ekonomi"
      }
    ],
    "status": "pending",
    "viewCount": 0,
    "tags": ["ekonomi", "gündem"],
    "isFeatured": true,
    "isPhotoUpToDate": false,
    "createdAt": "2023-10-02T12:00:00.000Z",
    "updatedAt": "2023-10-02T12:10:00.000Z"
  }
}
```

Olası Hata Yanıtları:
- 404 Haber yığını bulunamadı
- 404 Haber bulunamadı
- 400 Bu haber zaten yığında mevcut

---

## 7. Haber Yığınından Haber Çıkar

```http
POST /api/stacks/:id/removeNews
```

İstek Şablonu:
- Yöntem: POST
- Yol: /api/stacks/:id/removeNews
- Başlıklar:
  - x-api-key: YOUR_API_KEY
- URL Parametreleri:
  - id (stackId): Haber yığınının MongoDB ObjectId değeri
- Gövde (şema):
```json
{ "newsId": "CIKARILACAK_HABERIN_RSSNEWS_ID" }
```

Örnek Başarılı Yanıt (tam, 200):
```json
{
  "success": true,
  "data": {
    "_id": "609e1e24a12a452a3c4c5e25",
    "title": "Gündem: Ekonomik Gelişmeler",
    "description": "Bu hafta yaşanan gelişmeler",
    "news": [],
    "status": "pending",
    "viewCount": 0,
    "tags": ["ekonomi", "gündem"],
    "isFeatured": true,
    "isPhotoUpToDate": false,
    "createdAt": "2023-10-02T12:00:00.000Z",
    "updatedAt": "2023-10-02T12:15:00.000Z"
  }
}
```

Olası Hatalar:
- 404 Haber yığını bulunamadı
- 400 Bu haber zaten yığında mevcut değil

---

## Önemli Notlar

- GET /api/stacks yanıtlarında varsa kapağın URL'si `photoUrl` alanında döner.
- Haber eklendiğinde/çıkarıldığında ilgili yığının `isPhotoUpToDate` alanı `false` yapılır (iş mantığı).
- GET /api/stacks/:id çağrısı görüntülenme sayısını artırır.
