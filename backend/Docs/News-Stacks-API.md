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

---

## 1. Tüm Haber Yığınlarını Getir

```http
GET /api/stacks
```

Açıklama: Haber yığınlarını filtreli şekilde getirir.

Query Parametreleri:
- status: "pending" | "approved" | "rejected"
- isFeatured: "true" | "false"
- tags: virgülle ayrılmış etiketler
- limit: sonuç sayısı
- sortBy: createdAt | viewCount | title
- sortOrder: asc | desc

Örnekler:
```bash
GET /api/stacks
GET /api/stacks?status=approved
GET /api/stacks?isFeatured=true
GET /api/stacks?tags=politika,gündem
GET /api/stacks?limit=5&sortBy=viewCount&sortOrder=desc
```

Örnek Yanıt (kısaltılmış):
```json
{
  "success": true,
  "count": 2,
  "data": [
    { "_id": "<stackId>", "title": "Gündem", "photoUrl": null },
    { "_id": "<stackId>", "title": "Ekonomi", "photoUrl": "https://.../image.jpg" }
  ]
}
```

---

## 2. ID'ye Göre Haber Yığını Getir

```http
GET /api/stacks/:id
```

Açıklama: Tek bir haber yığınını getirir ve viewCount'u 1 artırır.

URL Parametreleri:
- id (stackId): Haber yığınının MongoDB ObjectId değeri

Örnek:
```bash
GET /api/stacks/609e1e24a12a452a3c4c5e20
```

Örnek Yanıt (kısaltılmış):
```json
{
  "success": true,
  "data": {
    "_id": "609e1e24a12a452a3c4c5e20",
    "title": "Gündem: Ekonomik Gelişmeler",
    "news": [
      { "_id": "<newsId>", "title": "Yeni Paket" }
    ],
    "viewCount": 143,
    "photoUrl": null
  }
}
```

---

## 3. Yeni Haber Yığını Oluştur

```http
POST /api/stacks
```

Header:
- x-api-key: YOUR_API_KEY

Gövde:
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
Örnek Yanıt (201):
```json
{
  "success": true,
  "data": {
    "_id": "<stackId>",
    "title": "HABER_YIGINI_BASLIGI",
    "news": [{ "_id": "<newsId>", "title": "Haber Başlığı" }],
    "status": "pending",
    "isFeatured": false
  }
}
```

---

## 4. Haber Yığını Güncelle

```http
PUT /api/stacks/:id
```

Header:
- x-api-key: YOUR_API_KEY

URL Parametreleri:
- id (stackId): Haber yığınının MongoDB ObjectId değeri

Gövde (opsiyonel): title, description, status, isFeatured, tags, news[]

Örnek İstek (curl):
```bash
curl -X PUT "http://localhost:3000/api/stacks/609e1e24a12a452a3c4c5e20" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "title": "Güncel: Ekonomik Gelişmeler",
    "status": "approved",
    "tags": ["ekonomi", "gündem"]
  }'
```

Örnek Yanıt (kısaltılmış):
```json
{
  "success": true,
  "data": { "_id": "<stackId>", "title": "Güncel: Ekonomik Gelişmeler", "status": "approved" }
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

Header:
- x-api-key: YOUR_API_KEY

URL Parametreleri:
- id (stackId): Haber yığınının MongoDB ObjectId değeri

Örnek Yanıt:
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

Açıklama: Mevcut bir haber yığınına yeni bir haber (RssNews kaydı) ekler.

Header:
- x-api-key: YOUR_API_KEY

Parametreler (karışıklığı önlemek için net isimler):
- Yol Parametresi `id` (stackId): Eklenecek haberin içinde yer alacağı Haber Yığınının MongoDB ObjectId değeri.
- Gövde alanı `newsId`: Yığına eklenecek haberin (RssNews) MongoDB ObjectId değeri.

Notlar:
- `id (stackId)` ve `newsId` farklı kaynakları temsil eder; biri NewsStacks, diğeri RssNews belgesidir.
- Aynı haber tekrar eklenmeye çalışılırsa 400 döner.

Örnek İstek (curl):
```bash
curl -X POST "http://localhost:3000/api/stacks/609e1e24a12a452a3c4c5e20/addNews" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "newsId": "609e1e24a12a452a3c4c5e25"
  }'
```

Örnek Başarılı Yanıt (200):
```json
{
  "success": true,
  "data": {
    "_id": "609e1e24a12a452a3c4c5e20",
    "title": "Gündem: Ekonomik Gelişmeler",
    "news": [ { "_id": "609e1e24a12a452a3c4c5e25", "title": "Yeni Ekonomik Paket Açıklandı" } ],
    "isPhotoUpToDate": false
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

Header:
- x-api-key: YOUR_API_KEY

URL Parametreleri:
- id (stackId): Haber yığınının MongoDB ObjectId değeri

Gövde:
```json
{ "newsId": "CIKARILACAK_HABER_ID" }
```

Örnek Yanıt (kısaltılmış):
```json
{
  "success": true,
  "message": "Haber yığından başarıyla çıkarıldı",
  "data": { "_id": "<stackId>", "isPhotoUpToDate": false }
}
```

Olası Hatalar:
- 404 Haber yığını bulunamadı
- 400 Bu haber zaten yığında mevcut değil

---

## Önemli Notlar

- GET /api/stacks yanıtlarında varsa kapağın URL'si `photoUrl` alanında döner
- Haber eklendiğinde/çıkarıldığında ilgili yığının `isPhotoUpToDate` alanı `false` yapılmalıdır (iş mantığında uygulanır)
- GET /api/stacks/:id çağrısı görüntülenme sayısını artırır (controller içinde uygulanır)
