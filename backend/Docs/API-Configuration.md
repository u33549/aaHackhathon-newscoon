# API Yapılandırması

Bu doküman, kurulum, ortam değişkenleri ve güvenlik konularını kapsar.

## İçindekiler

- [Gerekli Yapılandırma Dosyaları](#gerekli-yapılandırma-dosyaları)
- [Ortam Değişkenleri (.env)](#ortam-değişkenleri-env)
- [API Güvenliği](#api-güvenliği)
  - [API Anahtarı Kullanımı](#api-anahtarı-kullanımı)
  - [Örnek İstek](#örnek-istek)

## Gerekli Yapılandırma Dosyaları

Uygulama aşağıdaki yapılandırma dosyalarını kullanır:

- `.env`: Ortam değişkenleri (MongoDB URI, port, ortam, API anahtarı, Cloudinary bilgileri)
- `config/db.js`: MongoDB bağlantı ayarları
- `config/cloudinary.js`: Cloudinary ayarları (görsel yükleme)

## Ortam Değişkenleri (.env)

```env
# MongoDB Bağlantısı
MONGODB_URI=

# Server Ayarları
PORT=
NODE_ENV=development

# API Güvenliği
API_KEY=your-secret-api-key

# Cloudinary Ayarları
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## API Güvenliği

- Okuma işlemleri (GET) herkese açık
- Yazma işlemleri (POST, PUT, DELETE) için geçerli `x-api-key` zorunlu

### API Anahtarı Kullanımı

İstek header'ında aşağıdaki gibi gönderin:

```http
x-api-key: your-secret-api-key
```

### Örnek İstek

```bash
curl -X POST "http://localhost:3000/api/news" \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-api-key" \
  -d '{
    "guid": "example-news-001",
    "title": "Örnek Haber",
    "description": "Bu bir örnek haber açıklamasıdır",
    "link": "https://example.com/news/1",
    "pubDate": "Mon, 02 Oct 2023 12:00:00 GMT",
    "category": "gundem"
  }'
```
