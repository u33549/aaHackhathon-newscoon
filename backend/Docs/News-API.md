# Haber API Fonksiyonları

Bu doküman Haber API'sinin tüm fonksiyonlarını detaylı olarak açıklar.

## İçindekiler

- [Parametre İsimlendirme Sözleşmesi](#parametre-isimlendirme-sözleşmesi)
- [1. Tüm Haberleri Getir](#1-tüm-haberleri-getir)
- [2. GUID'ye Göre Haber Getir](#2-guidye-göre-haber-getir)
- [3. Yeni Haber Oluştur](#3-yeni-haber-oluştur)
- [4. Toplu Haber Oluştur](#4-toplu-haber-oluştur)
- [5. Haber Güncelle (GUID ile)](#5-haber-güncelle-guid-ile)
- [6. Haber Sil (GUID ile)](#6-haber-sil-guid-ile)

---

## Parametre İsimlendirme Sözleşmesi

- guid (newsGuid): RssNews belgesinin benzersiz GUID değeri (primary key)

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
      "_id": "aa-news-20231002-001",
      "guid": "aa-news-20231002-001",
      "title": "HABER_BASLIGI",
      "category": "gundem"
    }
  ]
}
```

---

## 2. GUID'ye Göre Haber Getir

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
    "_id": "unique-news-identifier-12345",
    "guid": "unique-news-identifier-12345",
    "title": "HABER_BASLIGI"
  }
}
```

---

## 3. Yeni Haber Oluştur

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
<<<<<<< HEAD
  "newstext": "HABER_METNI",
=======
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
  "pubDate": "YAYIN_TARIHI_RFC_FORMAT",
  "image": "HABER_GORSEL_URL",
  "category": "HABER_KATEGORISI"
}
```

<<<<<<< HEAD
**Not:** `guid` alanı zorunludur ve benzersiz olmalıdır. `newstext` alanı opsiyoneldir.
=======
**Not:** `guid` alanı zorunludur ve benzersiz olmalıdır.
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619

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
<<<<<<< HEAD
    "newstext": "Bu metin haberin tam içeriğini ve detaylarını açıklamak için kullanılır. Haberin uzun metni burada yer alır.",
=======
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
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
    "_id": "breaking-news-2023-001",
    "guid": "breaking-news-2023-001",
    "title": "Önemli Gelişme: Yeni Ekonomik Paket Açıklandı"
  }
}
```

---

## 4. Toplu Haber Oluştur

```http
POST /api/news/bulk
```

Header:
- x-api-key: YOUR_API_KEY

Gövde (dizi):
```json
[
<<<<<<< HEAD
  { "guid": "HABER_1_GUID", "link": "HABER_1_URL", "title": "HABER_1_BASLIK", "description": "HABER_1_ACIKLAMA", "newstext": "HABER_1_METNI", "pubDate": "HABER_1_TARIH", "category": "HABER_1_KATEGORI" },
  { "guid": "HABER_2_GUID", "link": "HABER_2_URL", "title": "HABER_2_BASLIK", "description": "HABER_2_ACIKLAMA", "newstext": "HABER_2_METNI", "pubDate": "HABER_2_TARIH", "category": "HABER_2_KATEGORI" }
=======
  { "guid": "HABER_1_GUID", "link": "HABER_1_URL", "title": "HABER_1_BASLIK", "description": "HABER_1_ACIKLAMA", "pubDate": "HABER_1_TARIH", "category": "HABER_1_KATEGORI" },
  { "guid": "HABER_2_GUID", "link": "HABER_2_URL", "title": "HABER_2_BASLIK", "description": "HABER_2_ACIKLAMA", "pubDate": "HABER_2_TARIH", "category": "HABER_2_KATEGORI" }
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
]
```

Örnek Yanıt:
```json
{
  "success": true,
  "results": [
    { "guid": "HABER_1_GUID", "status": "created", "id": "HABER_1_GUID" },
    { "guid": "HABER_2_GUID", "status": "skipped", "message": "Bu GUID ile daha önce bir haber kaydedilmiş" }
  ]
}
```

---

## 5. Haber Güncelle (GUID ile)

```http
PUT /api/news/guid/:guid
```

Header:
- x-api-key: YOUR_API_KEY

URL Parametreleri:
- guid (newsGuid): Haberin benzersiz GUID değeri

<<<<<<< HEAD
Gövde (opsiyonel alanlar): title, description, newstext, link, image, category, isInAnyStack, isUsable
=======
Gövde (opsiyonel alanlar): title, description, link, image, category, isInAnyStack, isUsable
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619

Örnek İstek (curl):
```bash
curl -X PUT "http://localhost:3000/api/news/guid/breaking-news-2023-001" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "title": "Güncellendi: Ekonomik Paket Detayları Netleşti",
    "description": "Tüm detaylar açıklandı.",
<<<<<<< HEAD
    "newstext": "Güncellenmiş haber metni burada yer alır. Yeni bilgiler ve detaylar eklendi.",
=======
>>>>>>> e343038552ef02089151de6b0936c8a29bd83619
    "isInAnyStack": true
  }'
```

Örnek Yanıt (kısaltılmış):
```json
{
  "success": true,
  "data": {
    "_id": "breaking-news-2023-001",
    "guid": "breaking-news-2023-001",
    "title": "Güncellendi: Ekonomik Paket Detayları Netleşti"
  }
}
```

---

## 6. Haber Sil (GUID ile)

```http
DELETE /api/news/guid/:guid
```

Header:
- x-api-key: YOUR_API_KEY

URL Parametreleri:
- guid (newsGuid): Haberin benzersiz GUID değeri

Örnek İstek:
```bash
curl -X DELETE "http://localhost:3000/api/news/guid/breaking-news-2023-001" \
  -H "x-api-key: YOUR_API_KEY"
```

Örnek Yanıt:
```json
{
  "success": true,
  "message": "Haber başarıyla silindi ve tüm stacklerden kaldırıldı",
  "data": {}
}
```
