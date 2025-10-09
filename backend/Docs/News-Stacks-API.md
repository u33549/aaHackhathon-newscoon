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

- newsGuid: RssNews (haber) belgesinin GUID değeri
- Yazma işlemleri için x-api-key header'ı zorunludur

**Not:** Haber referansları artık GUID üzerinden yapılır. NewsStacks modeli `news` dizisinde haber GUID'lerini tutar.

## 1. Tüm Haber Yığınlarını Getir

```http
GET /api/stacks
```

Açıklama: Haber yığınlarını filtreli şekilde getirir; her yığın için kapak görseli varsa `photoUrl` alanı eklenir. `news` alanı tüm haber bilgileriyle doldurulur (guid, title, description, newstext, link, pubDate, image, category, isInAnyStack, isUsable).

İstek Şablonu:
- Yöntem: GET
- Yol: /api/stacks
- Sorgu Parametreleri (opsiyonel):
  - status: "pending" | "approved" | "rejected"
  - isFeatured: "true" | "false"
  - tags: virgülle ayrılmış etiketler (örn: politika,gündem)
  - categories: virgülle ayrılmış kategoriler (örn: ekonomi,spor)
  - mainCategory: tek kategori (örn: ekonomi)
  - limit: sonuç sayısı (pozitif tam sayı)
  - sortBy: createdAt | viewCount | title (varsayılan: createdAt)
  - sortOrder: asc | desc (varsayılan: desc)

Örnek İstekler:
```
GET /api/stacks
GET /api/stacks?status=approved
GET /api/stacks?isFeatured=true
GET /api/stacks?tags=politika,gündem
GET /api/stacks?categories=ekonomi,spor
GET /api/stacks?mainCategory=ekonomi
GET /api/stacks?limit=2&sortBy=viewCount&sortOrder=desc
```

Örnek Yanıt (tam):
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "609e1e24a12a452a3c4c5e25",
      "title": "Gündem: Ekonomik Gelişmeler",
      "description": "Bu hafta yaşanan gelişmeler",
      "news": [
        {
          "_id": "aa-news-20231002-001",
          "guid": "aa-news-20231002-001",
          "title": "Yeni Ekonomik Teşvik Paketi Açıklandı",
          "description": "Hükümet tarafından açıklanan yeni ekonomik teşvik paketi kapsamında...",
          "newstext": "Bu haberin detaylı içeriği burada yer alır. Ekonomik teşvik paketi kapsamında yer alan tüm maddelerin açıklamaları...",
          "link": "https://example.com/news/ekonomi-paketi",
          "pubDate": "Mon, 02 Oct 2023 15:30:00 GMT",
          "image": "https://example.com/images/ekonomi-paketi.jpg",
          "category": "ekonomi",
          "isInAnyStack": true,
          "isUsable": true
        }
      ],
      "status": "approved",
      "viewCount": 142,
      "xp": 147,
      "tags": ["ekonomi", "gündem"],
      "isFeatured": true,
      "isPhotoUpToDate": true,
      "createdAt": "2023-10-02T12:00:00.000Z",
      "updatedAt": "2023-10-02T13:00:00.000Z",
      "photoUrl": "https://res.cloudinary.com/yourcloud/image/upload/v1696258800/newsstacks/newsstack_609e1e24a12a452a3c4c5e25_1696258800.jpg"
    },
    {
      "_id": "609e1e24a12a452a3c4c5e26",
      "title": "Spor: Haftanın Maçları",
      "description": "Öne çıkan maçlar",
      "news": [],
      "status": "pending",
      "viewCount": 0,
      "xp": 0,
      "tags": ["spor"],
      "isFeatured": false,
      "isPhotoUpToDate": false,
      "createdAt": "2023-10-03T08:00:00.000Z",
      "updatedAt": "2023-10-03T08:00:00.000Z",
      "photoUrl": null
    }
  ]
}
```

---

## 2. ID'ye Göre Haber Yığını Getir

```http
GET /api/stacks/:id
```

Açıklama: Tek bir haber yığınını getirir, `viewCount` değerini 1 artırır ve varsa `photoUrl` ekler. `news` alanı genişletilmiş alanlarla doldurulur (title, link, pubDate, image, category, description, guid).

İstek Şablonu:
- Yöntem: GET
- Yol: /api/stacks/:id
- URL Parametreleri:
  - id (stackId): Haber yığınının MongoDB ObjectId değeri

Örnek İstek:
```
GET /api/stacks/609e1e24a12a452a3c4c5e25
```

Örnek Yanıt (tam):
```json
{
  "success": true,
  "data": {
    "_id": "609e1e24a12a452a3c4c5e25",
    "title": "Gündem: Ekonomik Gelişmeler",
    "description": "Bu hafta yaşanan gelişmeler",
    "news": [
      {
        "_id": "aa-news-20231002-001",
        "guid": "aa-news-20231002-001",
        "title": "Yeni Ekonomik Teşvik Paketi Açıklandı",
        "description": "Hükümet tarafından açıklanan yeni ekonomik teşvik paketi kapsamında...",
        "newstext": "Bu haberin detaylı içeriği burada yer alır. Ekonomik teşvik paketi kapsamında yer alan tüm maddelerin açıklamaları...",
        "link": "https://example.com/news/ekonomi-paketi",
        "pubDate": "Mon, 02 Oct 2023 15:30:00 GMT",
        "image": "https://example.com/images/ekonomi-paketi.jpg",
        "category": "ekonomi",
        "isInAnyStack": true,
        "isUsable": true,
        "description": "Hükümet tarafından açıklanan yeni ekonomik teşvik paketi..."
      }
    ],
    "status": "approved",
    "viewCount": 143,
    "xp": 147,
    "tags": ["ekonomi", "gündem"],
    "isFeatured": true,
    "isPhotoUpToDate": true,
    "createdAt": "2023-10-02T12:00:00.000Z",
    "updatedAt": "2023-10-02T13:05:00.000Z",
    "photoUrl": "https://res.cloudinary.com/yourcloud/image/upload/v1696258800/newsstacks/newsstack_609e1e24a12a452a3c4c5e25_1696258800.jpg"
  }
}
```

---

## 3. Yeni Haber Yığını Oluştur

```http
POST /api/stacks
```

**ÖNEMLI: Bir haber yığını oluşturmak için en az 3 haber gereklidir.**

İstek Şablonu:
- Yöntem: POST
- Yol: /api/stacks
- Başlıklar:
  - x-api-key: YOUR_API_KEY
- Gövde (şema):
```json
{
  "title": "HABER_YIGINI_BASLIGI",
  "description": "HABER_YIGINI_ACIKLAMASI",
  "news": ["<newsGuid>", "<newsGuid>", "<newsGuid>"],
  "status": "pending",
  "tags": ["ETIKET_1", "ETIKET_2"],
  "isFeatured": false
}
```

**Zorunlu Alanlar:**
- `title`: Haber yığını başlığı
- `description`: Haber yığını açıklaması
- `news`: En az 3 geçerli haber GUID'i içeren dizi

**Not:** `news` dizisinde haber GUID'leri kullanılır ve en az 3 adet olmalıdır.

Örnek İstek (curl):
```bash
curl -X POST "http://localhost:3000/api/stacks" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "title": "Gündem: Ekonomik Gelişmeler",
    "description": "Bu hafta yaşanan gelişmeler",
    "news": ["aa-news-20231002-001", "aa-news-20231002-002", "aa-news-20231002-003"],
    "status": "pending",
    "tags": ["ekonomi", "gündem"],
    "isFeatured": true
  }'
```

Olası Hatalar:
- 400 En az 3 haber gerekli: "Bir haber yığını oluşturmak için en az 3 haber seçilmelidir"
- 400 Geçersiz haber GUID'leri: "Bir veya daha fazla geçersiz haber GUID'si"
- 400 Validation hatası: Model seviyesi validation hataları

Örnek Yanıt (tam, 201):
```json
{
  "success": true,
  "data": {
    "_id": "609e1e24a12a452a3c4c5e25",
    "title": "Gündem: Ekonomik Gelişmeler",
    "description": "Bu hafta yaşanan gelişmeler",
    "news": [
      {
        "_id": "aa-news-20231002-001",
        "guid": "aa-news-20231002-001",
        "title": "Yeni Ekonomik Teşvik Paketi Açıklandı",
        "description": "Hükümet tarafından açıklanan yeni ekonomik teşvik paketi kapsamında...",
        "newstext": "Bu haberin detaylı içeriği burada yer alır. Ekonomik teşvik paketi kapsamında yer alan tüm maddelerin açıklamaları...",
        "link": "https://example.com/news/ekonomi-paketi",
        "pubDate": "Mon, 02 Oct 2023 15:30:00 GMT",
        "image": "https://example.com/images/ekonomi-paketi.jpg",
        "category": "ekonomi"
      }
    ],
    "status": "pending",
    "viewCount": 0,
    "tags": ["ekonomi", "gündem"],
    "isFeatured": true,
    "isPhotoUpToDate": false,
    "createdAt": "2023-10-02T12:00:00.000Z",
    "updatedAt": "2023-10-02T12:00:00.000Z"
  }
}
```

---

## 4. Haber Yığını Güncelle

```http
PUT /api/stacks/:id
```

**ÖNEMLI: Haber yığını güncellenirken news dizisi değiştiriliyorsa, en az 3 haber gereklidir.**

İstek Şablonu:
- Yöntem: PUT
- Yol: /api/stacks/:id
- Başlıklar:
  - x-api-key: YOUR_API_KEY
- URL Parametreleri:
  - id (stackId): Haber yığınının MongoDB ObjectId değeri
- Gövde (opsiyonel): title, description, status, isFeatured, tags, news[]

**Not:** 
- `news` dizisi güncellenirken haber GUID'leri kullanılır ve en az 3 adet olmalıdır.
- Sadece diğer alanlar güncelleniyorsa (title, description, status, vb.) bu kısıtlama uygulanmaz.

Örnek İstek (curl):
```bash
curl -X PUT "http://localhost:3000/api/stacks/609e1e24a12a452a3c4c5e25" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "title": "Güncel: Ekonomik Gelişmeler",
    "status": "approved",
    "tags": ["ekonomi", "gündem"]
  }'
```

Olası Hatalar:
- 404 Haber yığını bulunamadı
- 400 En az 3 haber gerekli: "Bir haber yığını için en az 3 haber gereklidir" (news[] güncellenirken)
- 400 Geçersiz haber GUID'leri (news[] güncellenirken)
- 400 Validation hatası: Model seviyesi validation hataları

---

## 5. Haber Yığını Sil

```http
DELETE /api/stacks/:id
```

Açıklama: Belirtilen ID'ye sahip haber yığını silinir.

İstek Şablonu:
- Yöntem: DELETE
- Yol: /api/stacks/:id
- URL Parametreleri:
  - id (stackId): Haber yığınının MongoDB ObjectId değeri

Örnek İstek:
```
DELETE /api/stacks/609e1e24a12a452a3c4c5e25
```

Örnek Yanıt (tam, 200):
```json
{
  "success": true,
  "message": "Haber yığını başarıyla silindi."
}
```

Olası Hatalar:
- 404 Haber yığını bulunamadı

---

## 6. Haber Yığınına Haber Ekle

```http
POST /api/stacks/:id/addNews
```

Açıklama: Mevcut bir haber yığınına yeni haber ekler, `viewCount` değerini 1 artırır.

İstek Şablonu:
- Yöntem: POST
- Yol: /api/stacks/:id/addNews
- Başlıklar:
  - x-api-key: YOUR_API_KEY
- URL Parametreleri:
  - id (stackId): Haber yığınının MongoDB ObjectId değeri
- Gövde (şema):
```json
{ "newsGuid": "EKLENECEK_HABERIN_GUID" }
```

**Not:** 
- `newsGuid` parametresi RssNews belgesinin GUID değeridir.
- Eklenen haber yığında zaten varsa 400 hata kodu döner.

Örnek İstek (curl):
```bash
curl -X POST "http://localhost:3000/api/stacks/609e1e24a12a452a3c4c5e25/addNews" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "newsGuid": "aa-news-20231002-001"
  }'
```

Örnek Başarılı Yanıt (tam, 200):
```json
{
  "success": true,
  "data": {
    "_id": "609e1e24a12a452a3c4c5e25",
    "title": "Gündem: Ekonomik Gelişmeler",
    "description": "Bu hafta yaşanan gelişmeler",
    "news": [
      {
        "_id": "aa-news-20231002-001",
        "guid": "aa-news-20231002-001",
        "title": "Yeni Ekonomik Teşvik Paketi Açıklandı",
        "description": "Hükümet tarafından açıklanan yeni ekonomik teşvik paketi kapsamında...",
        "newstext": "Bu haberin detaylı içeriği burada yer alır. Ekonomik teşvik paketi kapsamında yer alan tüm maddelerin açıklamaları...",
        "link": "https://example.com/news/ekonomi-paketi",
        "pubDate": "Mon, 02 Oct 2023 15:30:00 GMT",
        "image": "https://example.com/images/ekonomi-paketi.jpg",
        "category": "ekonomi"
      },
      {
        "_id": "aa-news-20231002-002",
        "guid": "aa-news-20231002-002",
        "title": "Diğer Ekonomik Haber",
        "link": "https://example.com/news/diger-haber",
        "pubDate": "Mon, 02 Oct 2023 16:30:00 GMT",
        "image": "https://example.com/images/diger-haber.jpg",
        "category": "ekonomi"
      }
    ],
    "status": "pending",
    "viewCount": 0,
    "tags": ["ekonomi", "gündem"],
    "isFeatured": true,
    "isPhotoUpToDate": false,
    "createdAt": "2023-10-02T12:00:00.000Z",
    "updatedAt": "2023-10-02T12:10:00.000Z"
  }
}
```

Olası Hatalar:
- 404 Haber yığını bulunamadı
- 400 Bu haber zaten yığında mevcut

---

## 7. Haber Yığınından Haber Çıkar

```http
POST /api/stacks/:id/removeNews
```

**ÖNEMLI: Haber çıkarıldıktan sonra yığında en az 3 haber kalmalıdır.**

İstek Şablonu:
- Yöntem: POST
- Yol: /api/stacks/:id/removeNews
- Başlıklar:
  - x-api-key: YOUR_API_KEY
- URL Parametreleri:
  - id (stackId): Haber yığınının MongoDB ObjectId değeri
- Gövde (şema):
```json
{ "newsGuid": "CIKARILACAK_HABERIN_GUID" }
```

**Not:** 
- `newsGuid` parametresi RssNews belgesinin GUID değeridir.
- Haber çıkarıldıktan sonra yığında en az 3 haber kalmalıdır.

Örnek İstek (curl):
```bash
curl -X POST "http://localhost:3000/api/stacks/609e1e24a12a452a3c4c5e25/removeNews" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "newsGuid": "aa-news-20231002-001"
  }'
```

Örnek Başarılı Yanıt (tam, 200):
```json
{
  "success": true,
  "data": {
    "_id": "609e1e24a12a452a3c4c5e25",
    "title": "Gündem: Ekonomik Gelişmeler",
    "description": "Bu hafta yaşanan gelişmeler",
    "news": [
      {
        "_id": "aa-news-20231002-002",
        "guid": "aa-news-20231002-002",
        "title": "Diğer Ekonomik Haber",
        "link": "https://example.com/news/diger-haber",
        "pubDate": "Mon, 02 Oct 2023 16:30:00 GMT",
        "image": "https://example.com/images/diger-haber.jpg",
        "category": "ekonomi"
      },
      {
        "_id": "aa-news-20231002-003",
        "guid": "aa-news-20231002-003",
        "title": "Üçüncü Ekonomik Haber",
        "link": "https://example.com/news/ucuncu-haber",
        "pubDate": "Mon, 02 Oct 2023 17:30:00 GMT",
        "image": "https://example.com/images/ucuncu-haber.jpg",
        "category": "ekonomi"
      }
    ],
    "status": "pending",
    "viewCount": 0,
    "tags": ["ekonomi", "gündem"],
    "isFeatured": true,
    "isPhotoUpToDate": false,
    "createdAt": "2023-10-02T12:00:00.000Z",
    "updatedAt": "2023-10-02T12:15:00.000Z"
  }
}
```

Olası Hatalar:
- 404 Haber yığını bulunamadı
- 400 Bu haber zaten yığında mevcut değil
- 400 Minimum haber sayısı: "Bir haber yığınında en az 3 haber bulunmalıdır. Bu haberi çıkaramazsınız."

---

## Önemli Notlar

### XP (Experience Points) Sistemi:
- **XP Hesaplama**: XP = Haber Sayısı × (45-52 arası rastgele sayı)
- **Otomatik Hesaplama**: XP değeri otomatik olarak hesaplanır ve güncellenemez
- **Güncelleme**: Haber eklendiğinde/çıkarıldığında XP otomatik yeniden hesaplanır
- **Dışarıdan Güncelleme**: XP alanı API'den güncellenemez, otomatik hesaplanır

### Kategori Sistemi:
- **categories**: Yığındaki haberlerin benzersiz kategorilerini içeren dizi (Set benzeri davranış)
- **mainCategory**: En çok temsil edilen kategori (en fazla haberi olan kategori)
- **Otomatik Hesaplama**: Haber eklendiğinde/çıkarıldığında/güncellendiğinde kategoriler otomatik hesaplanır
- **CRUD Kısıtlamaları**: API'den manuel olarak categories ve mainCategory güncellenemez (otomatik hesaplanır)
- **Filtreleme**: categories (virgülle ayrılmış) ve mainCategory parametreleriyle filtrelenebilir

### Haber Yığını Minimum Haber Kuralları:
- **Yeni yığın oluştururken**: En az 3 haber gereklidir
- **Yığın güncellerken**: `news` dizisi değiştiriliyorsa en az 3 haber gereklidir  
- **Haber eklerken**: Kısıtlama yoktur (zaten var olan yığına ekleme)
- **Haber çıkarırken**: Çıkarıldıktan sonra en az 3 haber kalmalıdır

### Diğer Önemli Bilgiler:
- GET /api/stacks yanıtlarında varsa kapağın URL'si `photoUrl` alanında döner.
- Haber eklendiğinde/çıkarıldığında ilgili yığının `isPhotoUpToDate` alanı `false` yapılır (iş mantığı).
- GET /api/stacks/:id çağrısı görüntülenme sayısını artırır.
- Haber referansları artık GUID üzerinden yapılır, `newsId` yerine `newsGuid` kullanılır.
- Tüm yazma işlemleri için `x-api-key` header'ı zorunludur.
