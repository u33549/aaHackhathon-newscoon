# Haber Yığını Resimleri API Fonksiyonları

Bu doküman Haber Yığını Resimleri (NewsStackImages) API'sini açıklar.

## İçindekiler

- [Parametre İsimlendirme Sözleşmesi](#parametre-isimlendirme-sözleşmesi)
- [1. Tüm Resimleri Getir](#1-tüm-resimleri-getir)
- [2. ID'ye Göre Resim Getir](#2-idye-göre-resim-getir)
- [3. NewsStack ID'ye Göre Resim Getir](#3-newsstack-idye-göre-resim-getir)
- [4. Base64 Resim Yükle veya Güncelle](#4-base64-resim-yükle-veya-güncelle)
- [5. ID'ye Göre Resim Güncelle](#5-idye-göre-resim-güncelle)
- [6. NewsStack ID'ye Göre Resim Güncelle](#6-newsstack-idye-göre-resim-güncelle)
- [7. ID'ye Göre Resim Sil](#7-idye-göre-resim-sil)
- [8. NewsStack ID'ye Göre Resim Sil](#8-newsstack-idye-göre-resim-sil)
- [Önemli Notlar](#önemli-notlar)

---

## Parametre İsimlendirme Sözleşmesi

- id (imageId): NewsStackImages belgesinin MongoDB ObjectId değeri
- newsStackId: NewsStacks belgesinin MongoDB ObjectId değeri

---

## 1. Tüm Resimleri Getir

```http
GET /api/news-stack-images
```

Query Parametreleri:
- newsStackId: Belirli bir yığının resmini(lerini) filtrelemek için
- limit: Dönecek maksimum kayıt sayısı

Örnekler:
```bash
GET /api/news-stack-images
GET /api/news-stack-images?newsStackId=609e1e24a12a452a3c4c5e20
GET /api/news-stack-images?limit=5
```

Örnek Yanıt (kısaltılmış):
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "<imageId>",
      "newsStackId": { "_id": "<stackId>", "title": "Stack Başlığı" },
      "photoUrl": "https://.../image.jpg",
      "cloudinaryPublicId": "newsstacks/newsstack_<stackId>_...",
      "format": "jpg",
      "width": 1200,
      "height": 630,
      "bytes": 120345
    }
  ]
}
```

---

## 2. ID'ye Göre Resim Getir

```http
GET /api/news-stack-images/:id
```

URL Parametreleri:
- id (imageId): Resmin MongoDB ObjectId değeri

Örnek Yanıt (kısaltılmış):
```json
{
  "success": true,
  "data": {
    "_id": "<imageId>",
    "newsStackId": { "_id": "<stackId>", "title": "Stack Başlığı" },
    "photoUrl": "https://.../image.jpg"
  }
}
```

Olası Hatalar:
- 404 Resim bulunamadı

---

## 3. NewsStack ID'ye Göre Resim Getir

```http
GET /api/news-stack-images/news/:newsStackId
```

URL Parametreleri:
- newsStackId: Haber yığınının MongoDB ObjectId değeri

Örnek Yanıt (kısaltılmış):
```json
{
  "success": true,
  "data": {
    "_id": "<imageId>",
    "newsStackId": { "_id": "<stackId>", "title": "Stack Başlığı" },
    "photoUrl": "https://.../image.jpg"
  }
}
```

Olası Hatalar:
- 404 Bu haber yığını için resim bulunamadı

---

## 4. Base64 Resim Yükle veya Güncelle

```http
POST /api/news-stack-images
```

Header:
- x-api-key: YOUR_API_KEY

Gövde (zorunlu alanlar):
- newsStackId: İlgili haber yığınının ObjectId değeri (zorunlu)
- photo: Base64 görsel verisi (data URI ile) (zorunlu)
- originalName: Dosya adı (opsiyonel)

Örnek İstek (curl):
```bash
curl -X POST "http://localhost:3000/api/news-stack-images" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "newsStackId": "609e1e24a12a452a3c4c5e20",
    "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA...",
    "originalName": "kapak-gorseli.jpg"
  }'
```

Örnek Yanıt (yeni oluşturma 201):
```json
{
  "success": true,
  "message": "Resim başarıyla yüklendi",
  "data": {
    "_id": "<imageId>",
    "newsStackId": { "_id": "<stackId>", "title": "Stack Başlığı" },
    "photoUrl": "https://.../image.jpg"
  }
}
```

Örnek Yanıt (güncelleme 200):
```json
{
  "success": true,
  "message": "Resim başarıyla güncellendi",
  "data": {
    "_id": "<imageId>",
    "newsStackId": { "_id": "<stackId>", "title": "Stack Başlığı" },
    "photoUrl": "https://.../image.jpg"
  }
}
```

Olası Hatalar:
- 400 NewsStack ID ve fotoğraf verisi gereklidir
- 404 Belirtilen NewsStack bulunamadı
- 500 Resim yüklenirken hata oluştu

---

## 5. ID'ye Göre Resim Güncelle

```http
PUT /api/news-stack-images/:id
```

Header:
- x-api-key: YOUR_API_KEY

URL Parametreleri:
- id (imageId): Resmin MongoDB ObjectId değeri

Gövde (opsiyonel):
- photo: Yeni Base64 görsel (data URI)
- originalName: Yeni dosya adı

Örnek İstek (curl):
```bash
curl -X PUT "http://localhost:3000/api/news-stack-images/66f0a1234567890abcdef123" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "photo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...",
    "originalName": "guncellenmis-kapak.png"
  }'
```

Örnek Yanıt:
```json
{
  "success": true,
  "message": "Resim başarıyla güncellendi",
  "data": {
    "_id": "<imageId>",
    "newsStackId": { "_id": "<stackId>", "title": "Stack Başlığı" },
    "photoUrl": "https://.../image.jpg"
  }
}
```

Olası Hatalar:
- 404 Resim bulunamadı
- 500 Resim güncellenirken hata oluştu

---

## 6. NewsStack ID'ye Göre Resim Güncelle

```http
PUT /api/news-stack-images/news/:newsStackId
```

Header:
- x-api-key: YOUR_API_KEY

URL Parametreleri:
- newsStackId: Haber yığınının MongoDB ObjectId değeri

Gövde (opsiyonel):
- photo: Yeni Base64 görsel (data URI)
- originalName: Yeni dosya adı

Örnek İstek (curl):
```bash
curl -X PUT "http://localhost:3000/api/news-stack-images/news/609e1e24a12a452a3c4c5e20" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "photo": "data:image/webp;base64,UklGRnoAAABXRUJQVlA4WAo...",
    "originalName": "yeni-kapak-gorseli.webp"
  }'
```

Örnek Yanıt:
```json
{
  "success": true,
  "message": "Resim başarıyla güncellendi",
  "data": {
    "_id": "<imageId>",
    "newsStackId": { "_id": "<stackId>", "title": "Stack Başlığı" },
    "photoUrl": "https://.../image.jpg"
  }
}
```

Olası Hatalar:
- 404 Bu haber yığını için resim bulunamadı
- 500 Resim güncellenirken hata oluştu

---

## 7. ID'ye Göre Resim Sil

```http
DELETE /api/news-stack-images/:id
```

Header:
- x-api-key: YOUR_API_KEY

URL Parametreleri:
- id (imageId): Resmin MongoDB ObjectId değeri

Örnek Yanıt:
```json
{
  "success": true,
  "message": "Resim başarıyla silindi",
  "data": {}
}
```

Olası Hatalar:
- 404 Resim bulunamadı
- 500 Resim silinirken hata oluştu

---

## 8. NewsStack ID'ye Göre Resim Sil

```http
DELETE /api/news-stack-images/news/:newsStackId
```

Header:
- x-api-key: YOUR_API_KEY

URL Parametreleri:
- newsStackId: Haber yığınının MongoDB ObjectId değeri

Örnek Yanıt:
```json
{
  "success": true,
  "message": "Resim başarıyla silindi",
  "data": {}
}
```

Olası Hatalar:
- 404 Bu haber yığını için resim bulunamadı
- 500 Resim silinirken hata oluştu

---

## Önemli Notlar

- Yazma işlemleri için `x-api-key` zorunludur
- Base64 görseller Cloudinary'ye yüklenir ve URL `photoUrl` alanında döner
- Silme işlemleri Cloudinary tarafını da temizler
