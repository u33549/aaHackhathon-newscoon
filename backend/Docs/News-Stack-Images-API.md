# Haber Yığını Resimleri API Fonksiyonları

Bu doküman Haber Yığını Resimleri (NewsStackImages) API'sini açıklar.

## İçindekiler

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

## 1. Tüm Resimleri Getir

```http
GET /api/news-stack-images
```

Query Parametreleri: newsStackId, limit

Örnekler:
```bash
GET /api/news-stack-images
GET /api/news-stack-images?newsStackId=609e1e24a12a452a3c4c5e20
GET /api/news-stack-images?limit=5
```

---

## 2. ID'ye Göre Resim Getir

```http
GET /api/news-stack-images/:id
```

URL Parametreleri: id (MongoDB ObjectId)

---

## 3. NewsStack ID'ye Göre Resim Getir

```http
GET /api/news-stack-images/news/:newsStackId
```

URL Parametreleri: newsStackId (MongoDB ObjectId)

---

## 4. Base64 Resim Yükle veya Güncelle

```http
POST /api/news-stack-images
```

Header: x-api-key: YOUR_API_KEY

Gövde:
```json
{
  "newsStackId": "HABER_YIGINI_ID",
  "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...",
  "originalName": "kapak.jpg"
}
```

---

## 5. ID'ye Göre Resim Güncelle

```http
PUT /api/news-stack-images/:id
```

Header: x-api-key: YOUR_API_KEY

Gövde (opsiyonel): photo (Base64), originalName

---

## 6. NewsStack ID'ye Göre Resim Güncelle

```http
PUT /api/news-stack-images/news/:newsStackId
```

Header: x-api-key: YOUR_API_KEY

URL Parametreleri: newsStackId

---

## 7. ID'ye Göre Resim Sil

```http
DELETE /api/news-stack-images/:id
```

Header: x-api-key: YOUR_API_KEY

---

## 8. NewsStack ID'ye Göre Resim Sil

```http
DELETE /api/news-stack-images/news/:newsStackId
```

Header: x-api-key: YOUR_API_KEY

---

## Önemli Notlar

- Yazma işlemleri için `x-api-key` zorunludur
- Base64 görseller Cloudinary'ye yüklenir ve URL `photoUrl` alanında döner
- Silme işlemleri Cloudinary tarafını da temizler
