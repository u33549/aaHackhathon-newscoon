# AA Hackathon Backend API

MongoDB ve Express.js ile geliştirilmiş RSS haber API'si. Haberleri depolar, filtreler ve yönetir.

## Hızlı Başlangıç

```bash
# Bağımlılıkları yükleyin
npm install

# .env dosyanızı hazırlayın (örnek için Docs'a bakın)

# Geliştirme sunucusunu başlatın
npm start
```

## Dokümantasyon

Detaylı dokümanlar Docs klasörüne taşındı. Her dosyada "İçindekiler" bölümü mevcuttur.

- Veri Modeli
    - Modeller ve İlişkiler: [Data-Models.md](./Docs/Data-Models.md)
- API Referansları
  - API Endpoint'leri (Hızlı referans): [API-Endpoints.md](./Docs/API-Endpoints.md)
  - Haber API'si: [News-API.md](./Docs/News-API.md)
  - Haber Yığınları API'si: [News-Stacks-API.md](./Docs/News-Stacks-API.md)
  - Haber Yığını Resimleri API'si: [News-Stack-Images-API.md](./Docs/News-Stack-Images-API.md)
- Yapılandırma ve Güvenlik
  - API Yapılandırması ve .env: [API-Configuration.md](./Docs/API-Configuration.md)

## Özellikler

- RESTful endpoint'ler ve gelişmiş filtreleme
- MongoDB/Mongoose kalıcı katman
- Cloudinary ile görsel yönetimi
- API key tabanlı yazma izni

## Proje Yapısı (kısa)

```
backend/
├─ app.js
├─ Docs/
├─ controllers/
├─ models/
├─ routes/
└─ middleware/
```

## Lisans

Bu proje MIT lisansı ile lisanslanmıştır.
