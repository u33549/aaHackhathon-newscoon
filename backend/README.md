# AA Hackathon Backend API

Bu proje, MongoDB ve Express.js kullanılarak geliştirilen bir RSS haber API'sidir. API, haber verilerinin MongoDB veritabanında saklanmasını ve CRUD (Create, Read, Update, Delete) işlemlerinin gerçekleştirilmesini sağlar.

## İçerik

- [Kurulum](#kurulum)
- [Yapılandırma](#yapılandırma)
- [Kullanım](#kullanım)
- [API Endpoint'leri](#api-endpointleri)
  - [Haber API'leri](#haber-apileri)
  - [Kullanıcı API'leri](#kullanıcı-apileri)
- [Veri Modeli](#veri-modeli)
- [Filtreleme ve Sınırlama](#filtreleme-ve-sınırlama)
- [Lisans](#lisans)

## Kurulum

Projeyi çalıştırmak için aşağıdaki adımları izleyin:

1. Projeyi bilgisayarınıza klonlayın:

```
git clone <repo_url>
cd aaHackhathon/backend
```

2. Gerekli paketleri yükleyin:

```
npm install
```

3. `.env` dosyasını oluşturun veya düzenleyin:

```
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/aahackathon
```

4. MongoDB'nin çalıştığından emin olun.

5. Uygulamayı başlatın:

```
npm start
```

## Yapılandırma

Uygulama aşağıdaki yapılandırma dosyalarını kullanır:

- `.env`: Ortam değişkenleri (MongoDB URI, port, ortam)
- `config/db.js`: MongoDB bağlantı ayarları

## Kullanım

API'yi kullanmak için aşağıdaki endpoint'lere HTTP istekleri gönderebilirsiniz.

### API Endpoint'leri

#### Haber API'leri

| Endpoint | Metod | Açıklama | Parametreler |
|----------|-------|----------|-------------|
| `/api/news` | GET | Tüm haberleri listele | `pubDate`, `isInAnyStack`, `isUsable`, `limit` |
| `/api/news` | POST | Yeni haber ekle | - |
| `/api/news/bulk` | POST | Toplu haber ekle | - |
| `/api/news/:id` | GET | ID'ye göre haber getir | - |
| `/api/news/:id` | PUT | ID'ye göre haber güncelle | - |
| `/api/news/:id` | DELETE | ID'ye göre haber sil | - |
| `/api/news/guid/:guid` | GET | GUID'ye göre haber getir | - |
| `/api/news/guid/:guid` | PUT | GUID'ye göre haber güncelle | - |
| `/api/news/guid/:guid` | DELETE | GUID'ye göre haber sil | - |

#### Kullanıcı API'leri

| Endpoint | Metod | Açıklama |
|----------|-------|----------|
| `/api/users` | GET | Tüm kullanıcıları listele |
| `/api/users` | POST | Yeni kullanıcı ekle |
| `/api/users/:id` | GET | ID'ye göre kullanıcı getir |
| `/api/users/:id` | PUT | Kullanıcı güncelle |
| `/api/users/:id` | DELETE | Kullanıcı sil |

## Veri Modeli

### RSS Haber Modeli

```javascript
{
  guid: String,            // Benzersiz tanımlayıcı (zorunlu)
  isPermaLink: String,     // Kalıcı link bilgisi ("true" veya "false")
  link: String,            // Haberin linki (zorunlu)
  title: String,           // Haber başlığı (zorunlu)
  description: String,     // Haber açıklaması (zorunlu)
  pubDate: String,         // Yayın tarihi (zorunlu)
  image: String,           // Haber görseli
  isInAnyStack: Boolean,   // Yığında olup olmadığı (varsayılan: false)
  isUsable: Boolean,       // Kullanılabilir olup olmadığı (varsayılan: true)
  createdAt: Date          // Oluşturulma tarihi
}
```

## Filtreleme ve Sınırlama

Haber API'sine yapılan GET isteklerinde aşağıdaki filtreleme ve sınırlama parametreleri kullanılabilir:

### Filtreleme

- `pubDate`: Yayın tarihine göre filtrele
- `isInAnyStack`: Yığında olup olmadığına göre filtrele (`true` veya `false`)
- `isUsable`: Kullanılabilir olup olmadığına göre filtrele (`true` veya `false`)

### Sınırlama

- `limit`: Dönecek haber sayısını sınırla (varsayılan: `-1`, yani tümü)

### Örnekler

```
# Tüm haberleri getir
GET /api/news

# Sadece kullanılabilir haberleri getir
GET /api/news?isUsable=true

# Yığında olmayan ve kullanılabilir haberleri getir
GET /api/news?isInAnyStack=false&isUsable=true

# Belirli bir tarihte yayınlanan haberleri getir
GET /api/news?pubDate=Tue, 30 Sep 2025 21:21:44 +0300

# En yeni 10 haberi getir
GET /api/news?limit=10

# En yeni 5 kullanılabilir haberi getir
GET /api/news?isUsable=true&limit=5
```

## Lisans

Bu proje [MIT Lisansı](https://opensource.org/licenses/MIT) altında lisanslanmıştır.
