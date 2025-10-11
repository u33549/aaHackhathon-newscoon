# Newscoon Platform Architecture

## İçindekiler
1. [Genel Mimari](#genel-mimari)
2. [Klasör Yapısı](#klasör-yapısı)
3. [Frontend Mimarisi](#frontend-mimarisi)
4. [Backend Mimarisi](#backend-mimarisi)
5. [State Yönetimi](#state-yönetimi)
6. [API Entegrasyon Mimarisi](#api-entegrasyon-mimarisi)
7. [n8n Workflow Mimarisi](#n8n-workflow-mimarisi)
8. [Veri Akışı](#veri-akışı)
9. [Güvenlik Mimarisi](#güvenlik-mimarisi)
10. [Deployment Mimarisi](#deployment-mimarisi)

## Genel Mimari

Newscoon, haber toplama, analiz etme ve sunma için tasarlanmış modern bir web platformudur. Platform üç ana katmandan oluşur:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
│  React + MUI + Redux Toolkit + Vite                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Layer                            │
│  Node.js + Express + MongoDB + Cloudinary                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Automation Layer                          │
│  n8n Workflows + OpenAI + RSS Feeds                       │
└─────────────────────────────────────────────────────────────┘
```

## Klasör Yapısı

### Root Structure
```
aaHackhathon-newscoon/
├── backend/                 # Node.js API servisi
├── frontend/               # React web uygulaması
├── dockerSetup/           # Docker konfigürasyonları
├── Docs/                  # Dokümentasyon
├── LICENSE               # Lisans bilgisi
└── README.md            # Proje açıklaması
```

### Backend Structure
```
backend/
├── app.js                 # Express uygulaması ana dosyası
├── package.json          # NPM bağımlılıkları
├── Dockerfile           # Docker konfigürasyonu
├── .env                 # Ortam değişkenleri
├── bin/
│   └── www             # HTTP server başlatıcı
├── config/
│   ├── db.js          # MongoDB bağlantı ayarları
│   └── cloudinary.js  # Cloudinary konfigürasyonu
├── controllers/
│   ├── rssNewsController.js        # Haber CRUD işlemleri
│   ├── newsStacksController.js     # Stack CRUD işlemleri
│   └── newsStackImagesController.js # Resim yönetimi
├── middleware/
│   └── apiKeyAuth.js              # API anahtarı doğrulama
├── models/
│   ├── RssNews.js                 # Haber veri modeli
│   ├── NewsStacks.js              # Stack veri modeli
│   └── NewsStackImages.js         # Resim veri modeli
├── routes/
│   ├── index.js                   # Ana rota
│   ├── rssNews.js                # Haber rotaları
│   ├── newsStacks.js             # Stack rotaları
│   └── newsStackImages.js        # Resim rotaları
└── Docs/                         # API dokümentasyonu
    ├── API-Configuration.md
    ├── API-Endpoints.md
    ├── Data-Models.md
    ├── News-API.md
    ├── News-Stack-Images-API.md
    └── News-Stacks-API.md
```

### Frontend Structure
```
frontend/
├── src/
│   ├── App.jsx                    # Ana uygulama komponenti
│   ├── main.jsx                  # React DOM render point
│   ├── assets/                   # Statik varlıklar
│   │   └── Logo_Newscoon.png
│   ├── components/               # Yeniden kullanılabilir bileşenler
│   │   ├── cards/               # Kart bileşenleri
│   │   │   ├── FeaturedNewsCard.jsx
│   │   │   └── NewsCard.jsx
│   │   ├── common/              # Ortak bileşenler
│   │   │   └── ScrollToTop.jsx
│   │   ├── layout/              # Düzen bileşenleri
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── modals/              # Modal bileşenleri
│   │   │   ├── BadgeModal.jsx
│   │   │   └── ShareModal.jsx
│   │   ├── navigation/          # Navigasyon bileşenleri
│   │   │   ├── CategoryPills.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── notifications/       # Bildirim bileşenleri
│   │   │   ├── AchievementToast.jsx
│   │   │   ├── BadgeToast.jsx
│   │   │   ├── CelebrationPopup.jsx
│   │   │   └── ToastNotification.jsx
│   │   └── sections/           # Bölüm bileşenleri
│   │       ├── Hero.jsx
│   │       └── NewsSection.jsx
│   ├── constants/              # Sabitler ve konfigürasyon
│   │   └── index.jsx
│   ├── hooks/                  # Custom React hooks
│   │   └── redux.js
│   ├── Pages/                  # Sayfa bileşenleri
│   │   ├── mainPage.jsx       # Ana sayfa
│   │   ├── AllNewsPage.jsx    # Tüm haberler
│   │   ├── ArticlePage.jsx    # Makale detayı
│   │   ├── ReadingFlowPage.jsx # Okuma akışı
│   │   ├── StackDetailPage.jsx # Stack detayı
│   │   ├── TestPage.jsx       # Test sayfası
│   ├── services/              # API ve servis katmanı
│   │   ├── api.js            # Axios konfigürasyonu
│   │   ├── newsService.js    # Haber servisleri
│   │   ├── stackService.js   # Stack servisleri
│   │   ├── imageService.js   # Resim servisleri
│   │   ├── examples.js       # Örnek veriler
│   │   └── index.js         # Servis exports
│   ├── store/               # Redux state yönetimi
│   │   ├── index.js        # Store konfigürasyonu
│   │   └── slices/         # Redux Toolkit slices
│   │       ├── newsSlice.js    # Haber state
│   │       ├── stackSlice.js   # Stack state
│   │       ├── uiSlice.js      # UI state
│   │       └── userSlice.js    # Kullanıcı state
│   ├── theme/              # MUI tema konfigürasyonu
│   │   └── theme.js
│   └── types/              # TypeScript tip tanımları
│       └── index.js
├── public/                 # Statik dosyalar
├── index.html             # HTML template
├── package.json          # NPM bağımlılıkları
├── vite.config.js       # Vite konfigürasyonu
├── eslint.config.js     # ESLint kuralları
├── Dockerfile          # Docker konfigürasyonu
└── nginx.conf         # Nginx konfigürasyonu
```

## Frontend Mimarisi

### Komponent Hiyerarşisi

```
App
├── Header
│   ├── SearchBar
│   └── CategoryPills
├── Routes
│   ├── MainPage
│   │   ├── Hero
│   │   └── NewsSection
│   │       ├── FeaturedNewsCard
│   │       └── NewsCard[]
│   ├── AllNewsPage
│   │   └── NewsCard[]
│   ├── StackDetailPage
│   │   ├── Hero
│   │   └── NewsCard[]
│   ├── ReadingFlowPage
│   │   └── NewsCard[]
│   └── AdminDashboard
├── Footer
├── Modals
│   ├── BadgeModal
│   └── ShareModal
├── Notifications
│   ├── AchievementToast
│   ├── BadgeToast
│   ├── CelebrationPopup
│   └── ToastNotification
└── ScrollToTop
```

## Backend Mimarisi

### Katman Yapısı

```
┌─────────────────────────────────────────────────────────────┐
│                    Route Layer                              │
│  HTTP endpoints, middleware application                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Controller Layer                            │
│  Business logic, request/response handling                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Model Layer                               │
│  Data models, database interactions                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Database Layer                              │
│  MongoDB with Mongoose ODM                                 │
└─────────────────────────────────────────────────────────────┘
```

### API Endpoints

Detaylı API endpoint dokümantasyonu için: [Backend API Dokümantasyonu](../backend/Docs/API-Endpoints.md)

**Ana API Grupları:**
- **News API**: Haber CRUD işlemleri ([Detaylı Dokümantasyon](../backend/Docs/News-API.md))
- **Stacks API**: Stack CRUD işlemleri ([Detaylı Dokümantasyon](../backend/Docs/News-Stacks-API.md))  
- **Images API**: Stack resim yönetimi ([Detaylı Dokümantasyon](../backend/Docs/News-Stack-Images-API.md))

**Hızlı Referans:**
```
📰 News Endpoints        🔒 API Key
GET    /api/news         - Haber listesi
GET    /api/news/:id     - Tek haber
POST   /api/news         ✓ Haber ekleme
PUT    /api/news/:id     ✓ Haber güncelleme
DELETE /api/news/:id     ✓ Haber silme

📚 Stack Endpoints       🔒 API Key
GET    /api/stacks       - Stack listesi  
GET    /api/stacks/:id   - Tek stack
POST   /api/stacks       ✓ Stack oluşturma
PUT    /api/stacks/:id   ✓ Stack güncelleme
DELETE /api/stacks/:id   ✓ Stack silme

🖼️ Image Endpoints       🔒 API Key
GET    /api/news-stack-images              - Resim listesi
GET    /api/news-stack-images/:stackId     - Stack resimleri
POST   /api/news-stack-images              ✓ Resim ekleme
DELETE /api/news-stack-images/:id          ✓ Resim silme
```

**API Güvenlik:** 
- ✓ işaretli endpoint'ler `x-api-key` header gerektirir
- Okuma işlemleri (GET) için API key gerekmez
- Yazma işlemleri (POST/PUT/DELETE) için API key zorunludur

**Base URL:** `http://your-backend-url:port`

## State Yönetimi

### Redux Store Yapısı

```javascript
store: {
  news: {
    items: [],           // Haber listesi
    loading: false,      // Yükleme durumu
    error: null,         // Hata mesajı
    selectedNews: null,  // Seçili haber
    filters: {           // Filtreleme ayarları
      category: '',
      searchTerm: '',
      sortBy: 'pubDate'
    }
  },
  stacks: {
    items: [],           // Stack listesi
    loading: false,      // Yükleme durumu
    error: null,         // Hata mesajı
    selectedStack: null, // Seçili stack
    featuredStacks: []   // Öne çıkan stack'ler
  },
  ui: {
    theme: 'light',      // Tema ayarı
    sidebar: false,      // Sidebar görünürlüğü
    celebrationQueue: [], // Kutlama kuyruğu
    notifications: []     // Bildirim listesi
  },
  user: {
    xp: 0,              // Kullanıcı deneyim puanı
    level: 1,           // Kullanıcı seviyesi
    achievements: [],    // Başarımlar
    badges: [],         // Rozetler
    readingHistory: [], // Okuma geçmişi
    preferences: {}     // Kullanıcı tercihleri
  }
}
```

### Action Flow

```
Component → Action Creator → Thunk (API Call) → Reducer → State Update → Component Re-render
```

## API Entegrasyon Mimarisi

### Request/Response Flow

```
Frontend Component
       │
       ▼
Service Layer (api.js)
       │
       ▼ 
Axios Interceptors
  ├── Request: API Key injection
  └── Response: Error handling
       │
       ▼
Backend Express Routes
       │
       ▼
Middleware Layer
  ├── CORS handling
  ├── API Key validation
  └── Request parsing
       │
       ▼
Controller Layer
       │
       ▼
Database Operations
       │
       ▼
Response Formation
```

## n8n Workflow Mimarisi

Platform, haber toplama ve işleme için 3 ana n8n workflow'u kullanır:

### 1. Haber Toplama Workflow'u 

```
Saat Başı Tetikleme
       │
       ▼
Kategori Tanımlama (gundem, dunya, ekonomi, spor, analiz, kultur)
       │
       ▼
RSS Feed Çekme (AA.com.tr)
       │
       ▼ 
XML → JSON Dönüştürme
       │
       ▼
Haber Detay Sayfası Çekme
       │
       ▼
HTML Content Parsing
       │
       ▼
Metin Uzunluğu Kontrolü
       │
       ▼
AI Özetleme (2000+ karakter için)
       │
       ▼
Database Kaydetme
```

#### Workflow Detayları:
- **Tetikleme**: Her saat başı otomatik
- **Kaynak**: AA (Anadolu Ajansı) RSS feeds
- **Kategoriler**: 6 farklı kategori
- **AI Entegrasyonu**: OpenAI GPT ile metin özetleme
- **Output**: MongoDB'ye yapılandırılmış haber verileri

### 2. Stack Oluşturma Workflow'u

```
2 Saatte Bir Tetikleme
       │
       ▼
Database'den Haber Çekme (ilk 100)
       │
       ▼
AI Analiz (Haber Gruplandırma)
       │
       ▼
Stack Oluşturma (min 3 haber)
       │
       ▼
JSON Parse & Validation
       │
       ▼
Database Kaydetme
```

#### Workflow Detayları:
- **Tetikleme**: Her 2 saatte bir
- **AI Model**: GPT-4o with JSON mode
- **Minimum**: Stack başına 3 haber
- **Çıktı**: İlişkili haber grupları (stacks)

### 3. Foto Oluşturma Workflow'u

```
Saat Başı Tetikleme
       │
       ▼
isPhotoUpToDate=false Stack'leri Filtrele
       │
       ▼
Dinamik AI Prompt Oluşturma
       │
       ▼
OpenAI DALL-E 3 Resim Üretme
       │
       ▼
Base64 Dönüştürme
       │
       ▼
Cloudinary'ye Upload
       │
       ▼
Database Güncelleme
```

#### Workflow Detayları:
- **Tetikleme**: Saatlik kontrol
- **Filtreleme**: Sadece fotoğraf güncellenmesi gereken stack'ler
- **AI Model**: DALL-E 3 (1792x1024 resolution)
- **Prompt Engineering**: Dinamik, konu-bazlı prompt oluşturma
- **Storage**: Cloudinary integration

### Workflow Ortak Özellikleri:

#### Error Handling:
- **Retry Logic**: Başarısız işlemler için tekrar deneme
- **Continue on Error**: Bir haber/stack başarısız olsa bile diğerleri işlenmeye devam eder
- **Logging**: Detaylı console.log ile işlem takibi

#### Security:
- **API Key Management**: Güvenli API anahtarı yönetimi
- **Environment Variables**: Hassas bilgilerin güvenli saklanması

#### Performance:
- **Batch Processing**: Loop Over Items ile performanslı toplu işlem
- **Rate Limiting**: API rate limit'lerini aşmamak için kontrollü istekler
- **Data Limiting**: Stack oluşturmada ilk 100 haber ile sınırlama

## Veri Akışı

### Complete Data Flow

```
RSS Feeds (AA.com.tr)
       │
       ▼
n8n Haber Toplama
       │
       ▼
MongoDB (RssNews Collection)
       │
       ▼
n8n Stack Oluşturma (AI Grouping)
       │
       ▼
MongoDB (NewsStacks Collection)
       │
       ▼
n8n Foto Oluşturma (AI Image Gen)
       │
       ▼
Cloudinary (Image Storage)
       │
       ▼
MongoDB (NewsStackImages Collection)
       │
       ▼
Backend API (Express/MongoDB)
       │
       ▼
Frontend (React/Redux)
       │
       ▼
User Interface
```

### Data Models

Detaylı veri modelleri ve field açıklamaları için: [Backend Veri Modelleri Dokümantasyonu](../backend/Docs/Data-Models.md)

**Ana Koleksiyonlar:**
- **RssNews**: Haber verilerini saklar (AI özeti, kategori, stack durumu)
- **NewsStacks**: İlişkili haber gruplarını saklar (stack başlığı, açıklama, etiketler)
- **NewsStackImages**: Stack resimlerini saklar (Cloudinary entegrasyonu)

**İlişki Yapısı:**
```
NewsStacks (1) ←→ (N) RssNews (news array referansı)
NewsStacks (1) ←→ (1) NewsStackImages (newsStackId referansı)
```

## Güvenlik Mimarisi

### API Security
- **API Key Authentication**: Yazma işlemleri için API anahtarı gereksinimi
- **CORS Configuration**: Cross-origin istekler için güvenli konfigürasyon
- **Request Size Limiting**: 50MB limit ile DoS saldırılarını önleme
- **Environment Variables**: Hassas bilgilerin güvenli saklanması

### Data Security
- **MongoDB Connection**: Güvenli connection string
- **Cloudinary Integration**: Güvenli resim upload ve storage
- **Input Validation**: Mongoose schema validation

## Deployment Mimarisi

### Environment Configuration

#### Backend (.env)
```bash
NODE_ENV=production
PORT=your-port-id
MONGO_URI=your-mongo-connection-string
API_KEY=your-api-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Frontend (.env)
```bash
VITE_API_BASE_URL=
VITE_API_KEY=your-api-key (backend ile aynı)
VITE_PROXY_TARGET=your-backend-url
```
