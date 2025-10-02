# Haber Yığınları API Fonksiyonları

Bu doküman Haber Yığınları (NewsStacks) API'sinin tüm fonksiyonlarını açıklar.

## İçindekiler

- [1. Tüm Haber Yığınlarını Getir](#1-tüm-haber-yığınlarını-getir)
- [2. ID'ye Göre Haber Yığını Getir](#2-idye-göre-haber-yığını-getir)
- [3. Yeni Haber Yığını Oluştur](#3-yeni-haber-yığını-oluştur)
- [4. Haber Yığını Güncelle](#4-haber-yığını-güncelle)
- [5. Haber Yığını Sil](#5-haber-yığını-sil)
- [6. Haber Yığınına Haber Ekle](#6-haber-yığınına-haber-ekle)
- [7. Haber Yığınından Haber Çıkar](#7-haber-yığınından-haber-çıkar)
- [Önemli Notlar](#önemli-notlar)

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

---

## 2. ID'ye Göre Haber Yığını Getir

```http
GET /api/stacks/:id
```

Açıklama: Tek bir haber yığınını getirir ve viewCount'u 1 artırır.

URL Parametreleri:
- id: MongoDB ObjectId

Örnek:
```bash
GET /api/stacks/609e1e24a12a452a3c4c5e20
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
  "news": ["HABER_1_ID", "HABER_2_ID"],
  "status": "pending",
  "tags": ["ETIKET_1", "ETIKET_2"],
  "isFeatured": false
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
- id: MongoDB ObjectId

Gövde (opsiyonel): title, description, status, isFeatured, tags

---

## 5. Haber Yığını Sil

```http
DELETE /api/stacks/:id
```

Header:
- x-api-key: YOUR_API_KEY

URL Parametreleri:
- id: MongoDB ObjectId

---

## 6. Haber Yığınına Haber Ekle

```http
POST /api/stacks/:id/addNews
```

Header:
- x-api-key: YOUR_API_KEY

URL Parametreleri:
- id: MongoDB ObjectId

Gövde:
```json
{ "newsId": "EKLENECEK_HABER_ID" }
```

---

## 7. Haber Yığınından Haber Çıkar

```http
POST /api/stacks/:id/removeNews
```

Header:
- x-api-key: YOUR_API_KEY

URL Parametreleri:
- id: MongoDB ObjectId

Gövde:
```json
{ "newsId": "CIKARILACAK_HABER_ID" }
```

---

## Önemli Notlar

- GET /api/stacks yanıtlarında varsa kapağın URL'si `photoUrl` alanında döner
- Haber eklendiğinde/çıkarıldığında ilgili yığının `isPhotoUpToDate` alanı `false` yapılmalıdır (iş mantığında uygulanır)
- GET /api/stacks/:id çağrısı görüntülenme sayısını artırır (controller içinde uygulanır)

