# AA Hackathon Backend API

Bu proje, MongoDB ve Express.js kullanılarak geliştirilen bir RSS haber API'sidir. API, haber verilerinin MongoDB veritabanında saklanmasını ve CRUD (Create, Read, Update, Delete) işlemlerinin gerçekleştirilmesini sağlar.

## İçerik

- [Kurulum](#kurulum)
- [Yapılandırma](#yapılandırma)
- [API Güvenliği](#api-güvenliği)
- [Kullanım](#kullanım)
- [API Endpoint'leri](#api-endpointleri)
  - [Haber API'leri](#haber-apileri)
  - [Kullanıcı API'leri](#kullanıcı-apileri)
- [API Fonksiyonları ve Kullanımları](#api-fonksiyonları-ve-kullanımları)
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
API_KEY=your-secret-api-key
```

4. MongoDB'nin çalıştığından emin olun.

5. Uygulamayı başlatın:

```
npm start
```

## Yapılandırma

Uygulama aşağıdaki yapılandırma dosyalarını kullanır:

- `.env`: Ortam değişkenleri (MongoDB URI, port, ortam, API anahtarı)
- `config/db.js`: MongoDB bağlantı ayarları

## API Güvenliği

Bu API, okuma ve yazma işlemleri için farklı yetkilendirme düzeyleri uygular:

- **Okuma İşlemleri (GET)**: Herkes tarafından erişilebilir. Kimlik doğrulama gerekmez.
- **Yazma İşlemleri (POST, PUT, DELETE)**: Sadece geçerli API anahtarına sahip kullanıcılar tarafından erişilebilir.

### API Anahtarı Kullanımı

Yazma işlemleri için isteklerinize `x-api-key` header'ı eklemeniz gerekmektedir:

```
x-api-key: your-secret-api-key
```

Örnek (cURL ile):

```bash
# GET isteği - API anahtarı gerekmez
curl http://localhost:3000/api/news

# POST isteği - API anahtarı gerekir
curl -X POST \
  http://localhost:3000/api/news \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: your-secret-api-key' \
  -d '{"guid": "unique-id", "title": "Haber Başlığı", ...}'
```

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

## API Fonksiyonları ve Kullanımları

### Haber API Fonksiyonları

#### 1. Tüm haberleri getir (`getAllNews`)

```
GET /api/news
```

**Açıklama:** Veritabanındaki haberleri filtreli şekilde getirir. Farklı parametrelerle filtrelenebilir ve sınırlandırılabilir.

**Query Parametreleri:**
- `pubDate`: Yayın tarihine göre filtreleme. Değer direkt tarih olabilir veya `pubDate[gt]=2023-01-01` gibi büyük/küçük karşılaştırmalar yapılabilir.
- `isInAnyStack`: "true" veya "false" değeri alır. Bir yığında olup olmadığına göre filtreleme yapar.
- `isUsable`: "true" veya "false" değeri alır. Kullanılabilir olup olmadığına göre filtreleme yapar.
- `limit`: Dönecek maksimum haber sayısı. Varsayılan olarak limit yok (-1).

**Dönen Değer:**
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "guid": "unique-id-1",
      "title": "Haber Başlığı",
      ...diğer alanlar...
    },
    ...diğer haberler...
  ]
}
```

#### 2. ID'ye göre haber getir (`getNewsById`)

```
GET /api/news/:id
```

**Açıklama:** MongoDB tarafından atanan ID'ye göre tek bir haberi getirir.

**URL Parametreleri:**
- `id`: Haberin MongoDB ID'si

**Dönen Değer:**
```json
{
  "success": true,
  "data": {
    "guid": "unique-id-1",
    "title": "Haber Başlığı",
    ...diğer alanlar...
  }
}
```

#### 3. GUID'ye göre haber getir (`getNewsByGuid`)

```
GET /api/news/guid/:guid
```

**Açıklama:** RSS feed'indeki GUID değerine göre haberi getirir.

**URL Parametreleri:**
- `guid`: Haberin benzersiz GUID değeri

**Dönen Değer:**
```json
{
  "success": true,
  "data": {
    "guid": "unique-id-1",
    "title": "Haber Başlığı",
    ...diğer alanlar...
  }
}
```

#### 4. Yeni haber oluştur (`createNews`)

```
POST /api/news
```

**Açıklama:** Veritabanına yeni bir haber ekler. Aynı GUID ile başka bir haber varsa ekleme yapılmaz.

**Gönderilecek Veri (JSON):**
```json
{
  "guid": "unique-id-1",
  "link": "https://example.com/news/1",
  "title": "Haber Başlığı",
  "description": "Haberin açıklaması",
  "pubDate": "Fri, 21 May 2023 14:30:00 GMT",
  "image": "https://example.com/images/news1.jpg"
}
```

**Dönen Değer:**
```json
{
  "success": true,
  "data": {
    "guid": "unique-id-1",
    "title": "Haber Başlığı",
    ...diğer alanlar...
  }
}
```

#### 5. Toplu haber oluştur (`createBulkNews`)

```
POST /api/news/bulk
```

**Açıklama:** Birden fazla haberi tek seferde ekler. Var olan GUID'ler atlanır, sadece yeni GUID'ler eklenir.

**Gönderilecek Veri (JSON):**
```json
[
  {
    "guid": "unique-id-1",
    "link": "https://example.com/news/1",
    "title": "Haber Başlığı 1",
    "description": "Haber açıklaması 1",
    "pubDate": "Fri, 21 May 2023 14:30:00 GMT"
  },
  {
    "guid": "unique-id-2",
    "link": "https://example.com/news/2",
    "title": "Haber Başlığı 2",
    "description": "Haber açıklaması 2",
    "pubDate": "Fri, 21 May 2023 15:00:00 GMT"
  }
]
```

**Dönen Değer:**
```json
{
  "success": true,
  "results": [
    {
      "guid": "unique-id-1",
      "status": "created",
      "id": "609e1e24a12a452a3c4c5e20"
    },
    {
      "guid": "unique-id-2",
      "status": "skipped",
      "message": "Bu GUID ile daha önce bir haber kaydedilmiş"
    }
  ]
}
```

#### 6. Haberi güncelle (`updateNews`)

```
PUT /api/news/:id
```

**Açıklama:** ID'ye göre haberi günceller.

**URL Parametreleri:**
- `id`: Haberin MongoDB ID'si

**Gönderilecek Veri (JSON):**
```json
{
  "title": "Güncellenmiş Başlık",
  "description": "Güncellenmiş açıklama",
  "isInAnyStack": true
}
```

**Dönen Değer:**
```json
{
  "success": true,
  "data": {
    "guid": "unique-id-1",
    "title": "Güncellenmiş Başlık",
    ...diğer alanlar...
  }
}
```

#### 7. GUID'ye göre haberi güncelle (`updateNewsByGuid`)

```
PUT /api/news/guid/:guid
```

**Açıklama:** GUID'ye göre haberi günceller.

**URL Parametreleri:**
- `guid`: Haberin benzersiz GUID değeri

**Gönderilecek Veri (JSON):**
```json
{
  "title": "Güncellenmiş Başlık",
  "description": "Güncellenmiş açıklama",
  "isInAnyStack": true
}
```

**Dönen Değer:**
```json
{
  "success": true,
  "data": {
    "guid": "unique-id-1",
    "title": "Güncellenmiş Başlık",
    ...diğer alanlar...
  }
}
```

#### 8. Haberi sil (`deleteNews`)

```
DELETE /api/news/:id
```

**Açıklama:** ID'ye göre haberi siler.

**URL Parametreleri:**
- `id`: Haberin MongoDB ID'si

**Dönen Değer:**
```json
{
  "success": true,
  "data": {}
}
```

#### 9. GUID'ye göre haberi sil (`deleteNewsByGuid`)

```
DELETE /api/news/guid/:guid
```

**Açıklama:** GUID'ye göre haberi siler.

**URL Parametreleri:**
- `guid`: Haberin benzersiz GUID değeri

**Dönen Değer:**
```json
{
  "success": true,
  "data": {}
}
```

## Veri Modeli

### RSS Haber Modeli

```javascript
{
  guid: String,            // Benzersiz tanımlayıcı (zorunlu)
  isPermaLink: String,     // Kalıcı link bilgisi ("true" veya "false") (varsayılan: "false")
  link: String,            // Haberin linki (zorunlu)
  title: String,           // Haber başlığı (zorunlu)
  description: String,     // Haber açıklaması (zorunlu)
  pubDate: String,         // Yayın tarihi (zorunlu)
  image: String,           // Haber görseli (opsiyonel)
  isInAnyStack: Boolean,   // Yığında olup olmadığı (varsayılan: false)
  isUsable: Boolean,       // Kullanılabilir olup olmadığı (varsayılan: true)
  createdAt: Date,         // Oluşturulma zamanı (otomatik oluşturulur)
  updatedAt: Date          // Güncellenme zamanı (otomatik güncellenir)
}
```

## Filtreleme ve Sınırlama

API, haberleri filtrelemek ve sınırlandırmak için çeşitli parametreler sunar:

1. **Tarihe göre filtreleme**:
   ```
   GET /api/news?pubDate=2023-05-21
   GET /api/news?pubDate[gt]=2023-05-01&pubDate[lt]=2023-05-30
   ```

2. **Stack durumuna göre filtreleme**:
   ```
   GET /api/news?isInAnyStack=true
   ```

3. **Kullanılabilirliğe göre filtreleme**:
   ```
   GET /api/news?isUsable=true
   ```

4. **Sonuçları sınırlama**:
   ```
   GET /api/news?limit=10
   ```

5. **Kombinasyon**:
   ```
   GET /api/news?isInAnyStack=true&limit=5&pubDate[gt]=2023-05-01
   ```

## Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.
