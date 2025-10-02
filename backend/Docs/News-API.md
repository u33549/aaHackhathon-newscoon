# Haber API Fonksiyonları

Bu doküman Haber API'sinin tüm fonksiyonlarını detaylı olarak açıklar.

## İçindekiler

- [Parametre İsimlendirme Sözleşmesi](#parametre-isimlendirme-sözleşmesi)
- [1. Tüm Haberleri Getir](#1-tüm-haberleri-getir)
- [2. ID'ye Göre Haber Getir](#2-idye-göre-haber-getir)
- [3. GUID'ye Göre Haber Getir](#3-guidye-göre-haber-getir)
- [4. Yeni Haber Oluştur](#4-yeni-haber-oluştur)
- [5. Toplu Haber Oluştur](#5-toplu-haber-oluştur)
- [6. Haber Güncelle (ID ile)](#6-haber-güncelle-id-ile)
- [7. Haber Güncelle (GUID ile)](#7-haber-güncelle-guid-ile)
- [8. Haber Sil (ID ile)](#8-haber-sil-id-ile)
- [9. Haber Sil (GUID ile)](#9-haber-sil-guid-ile)

---

## Parametre İsimlendirme Sözleşmesi

- id (newsId): RssNews belgesinin MongoDB ObjectId değeri
- guid (newsGuid): RssNews benzersiz GUID değeri

---

## 1. Tüm Haberleri Getir

```http
GET /api/news
```

Açıklama: Veritabanındaki haberleri filtreli şekilde getirir.

Query Parametreleri:
- pubDate: Yayın tarihi (örn: `pubDate[gt]=YYYY-MM-DD`)
- isInAnyStack: "true" | "false"
- isUsable: "true" | "false"
- category: "gundem" | "dunya" | "ekonomi" | "spor" | "analiz" | "kultur"
- limit: Maksimum sonuç sayısı

Örnekler:
```bash
GET /api/news?limit=10
GET /api/news?pubDate[gt]=2023-01-01
GET /api/news?isInAnyStack=false
GET /api/news?category=gundem&limit=5&isUsable=true
```

Örnek Yanıt (kısaltılmış):
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "<newsId>",
      "guid": "<newsGuid>",
      "title": "HABER_BASLIGI",
      "category": "gundem"
    }
  ]
}
```

---

## 2. ID'ye Göre Haber Getir

```http
GET /api/news/:id
```

URL Parametreleri:
- id (newsId): Haberin MongoDB ObjectId değeri

Örnek:
```bash
GET /api/news/609e1e24a12a452a3c4c5e20
```

Örnek Yanıt (kısaltılmış):
```json
{
  "success": true,
  "data": {
    "_id": "609e1e24a12a452a3c4c5e20",
    "guid": "breaking-news-2023-001",
    "title": "HABER_BASLIGI"
  }
}
```

---

## 3. GUID'ye Göre Haber Getir

```http
GET /api/news/guid/:guid
```

URL Parametreleri:
- guid (newsGuid): Haberin benzersiz GUID değeri

Örnek:
```bash
GET /api/news/guid/unique-news-identifier-12345
```

Örnek Yanıt (kısaltılmış):
```json
{
  "success": true,
  "data": {
    "_id": "609e1e24a12a452a3c4c5e20",
    "guid": "unique-news-identifier-12345",
    "title": "HABER_BASLIGI"
  }
}
```

---

## 4. Yeni Haber Oluştur

```http
POST /api/news
```

Header:
- x-api-key: YOUR_API_KEY

Gövde:
```json
{
  "guid": "BENZERSIZ_HABER_GUID",
  "link": "HABER_URL",
  "title": "HABER_BASLIGI",
  "description": "HABER_ACIKLAMASI",
  "pubDate": "YAYIN_TARIHI_RFC_FORMAT",
  "image": "HABER_GORSEL_URL",
  "category": "HABER_KATEGORISI"
}
```
Örnek İstek (curl):
```bash
curl -X POST "http://localhost:3000/api/news" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "guid": "breaking-news-2023-001",
    "link": "https://example.com/news/breaking-story",
    "title": "Önemli Gelişme: Yeni Ekonomik Paket Açıklandı",
    "description": "Hükümetten gelen son dakika açıklamasında yeni ekonomik teşvik paketi detayları paylaşıldı.",
    "pubDate": "Mon, 23 Oct 2023 15:30:00 GMT",
    "image": "https://example.com/images/economic-package.jpg",
    "category": "ekonomi"
  }'
```

Örnek Yanıt (kısaltılmış):
```json
{
  "success": true,
  "data": {
    "_id": "<newsId>",
    "guid": "breaking-news-2023-001",
    "title": "Önemli Gelişme: Yeni Ekonomik Paket Açıklandı"
  }
}
```

---

## 5. Toplu Haber Oluştur

```http
POST /api/news/bulk
```

Header:
- x-api-key: YOUR_API_KEY

Gövde (dizi):
```json
[
  { "guid": "HABER_1_GUID", "link": "HABER_1_URL", "title": "HABER_1_BASLIK", "description": "HABER_1_ACIKLAMA", "pubDate": "HABER_1_TARIH", "category": "HABER_1_KATEGORI" },
  { "guid": "HABER_2_GUID", "link": "HABER_2_URL", "title": "HABER_2_BASLIK", "description": "HABER_2_ACIKLAMA", "pubDate": "HABER_2_TARIH", "category": "HABER_2_KATEGORI" }
]
```

Örnek Yanıt:
```json
{
  "success": true,
  "results": [
    { "guid": "HABER_1_GUID", "status": "created", "id": "<newsId>" },
    { "guid": "HABER_2_GUID", "status": "skipped", "message": "Bu GUID ile daha önce bir haber kaydedilmiş" }
  ]
}
```

---

## 6. Haber Güncelle (ID ile)

```http
PUT /api/news/:id
```

Header:
- x-api-key: YOUR_API_KEY

URL Parametreleri:
- id (newsId): Haberin MongoDB ObjectId değeri

Gövde (opsiyonel alanlar): title, description, link, image, category, isInAnyStack, isUsable

Örnek İstek (curl):
```bash
curl -X PUT "http://localhost:3000/api/news/609e1e24a12a452a3c4c5e20" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "title": "Güncellendi: Ekonomik Paket Detayları Netleşti",
    "description": "Tüm detaylar açıklandı.",
    "isInAnyStack": true
  }'
```

Örnek Yanıt (kısaltılmış):
```json
{
  "success": true,
  "data": {
    "_id": "609e1e24a12a452a3c4c5e20",
    "title": "Güncellendi: Ekonomik Paket Detayları Netleşti"
  }
}
```

---

## 7. Haber Güncelle (GUID ile)

```http
PUT /api/news/guid/:guid
```

Header:
- x-api-key: YOUR_API_KEY

URL Parametreleri:
- guid (newsGuid): Haberin benzersiz GUID değeri

Gövde: 6. madde ile aynı

Örnek Yanıt (kısaltılmış):
```json
{
  "success": true,
  "data": {
    "guid": "breaking-news-2023-001",
    "title": "Son Durum: Ekonomik Paket Onaylandı"
  }
}
```

---

## 8. Haber Sil (ID ile)

```http
DELETE /api/news/:id
```

Header:
- x-api-key: YOUR_API_KEY

URL Parametreleri:
- id (newsId): Haberin MongoDB ObjectId değeri

Örnek Yanıt:
```json
{
  "success": true,
  "message": "Haber başarıyla silindi ve tüm stacklerden kaldırıldı",
  "data": {}
}
```

---

## 9. Haber Sil (GUID ile)

```http
DELETE /api/news/guid/:guid
```

Header:
- x-api-key: YOUR_API_KEY

URL Parametreleri:
- guid (newsGuid): Haberin benzersiz GUID değeri

Örnek Yanıt: 8. madde ile aynı
