# Haber API Fonksiyonları

Bu doküman Haber API'sinin tüm fonksiyonlarını detaylı olarak açıklar.

## İçindekiler

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

---

## 2. ID'ye Göre Haber Getir

```http
GET /api/news/:id
```

URL Parametreleri:
- id: MongoDB ObjectId

Örnek:
```bash
GET /api/news/609e1e24a12a452a3c4c5e20
```

---

## 3. GUID'ye Göre Haber Getir

```http
GET /api/news/guid/:guid
```

URL Parametreleri:
- guid: String GUID

Örnek:
```bash
GET /api/news/guid/unique-news-identifier-12345
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
  "guid": "BENZERSIZ_HABER_ID",
  "link": "HABER_URL",
  "title": "HABER_BASLIGI",
  "description": "HABER_ACIKLAMASI",
  "pubDate": "YAYIN_TARIHI_RFC_FORMAT",
  "image": "HABER_GORSEL_URL",
  "category": "HABER_KATEGORISI"
}
```
Örnek:
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

---

## 6. Haber Güncelle (ID ile)

```http
PUT /api/news/:id
```

Header:
- x-api-key: YOUR_API_KEY

URL Parametreleri:
- id: MongoDB ObjectId

Gövde (opsiyonel alanlar): title, description, link, image, category, isInAnyStack, isUsable

Örnek:
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

---

## 7. Haber Güncelle (GUID ile)

```http
PUT /api/news/guid/:guid
```

Header:
- x-api-key: YOUR_API_KEY

URL Parametreleri:
- guid: String GUID

Gövde: 6. madde ile aynı

---

## 8. Haber Sil (ID ile)

```http
DELETE /api/news/:id
```

Header:
- x-api-key: YOUR_API_KEY

URL Parametreleri:
- id: MongoDB ObjectId

---

## 9. Haber Sil (GUID ile)

```http
DELETE /api/news/guid/:guid
```

Header:
- x-api-key: YOUR_API_KEY

URL Parametreleri:
- guid: String GUID

