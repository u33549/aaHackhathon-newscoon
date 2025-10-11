# NEWSCOON - Gamified Haber Okuma Platformu

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/u33549/aaHackhathon-newscoon)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://reactjs.org/)

---

## 📋 Genel Bakış

NEWSCOON, haber okuma deneyimini oyunlaştırarak kullanıcıların bilgilenme sürecini daha etkileşimli ve motive edici hale getiren modern bir web platformudur. Platform, RSS kaynaklarından toplanan haberleri "haber yığınları" halinde organize ederek, kullanıcılara kronolojik haber okuma deneyimi sunar.

**Proje Amacı:**
- Geleneksel haber tüketim alışkanlıklarını oyunlaştırma teknikleriyle zenginleştirmek
- Kullanıcıların daha bilinçli ve düzenli haber takibi yapmalarını sağlamak
- Kronolojik ve organize haber okuma deneyimi sunmak
- Sosyal rekabet unsurlarıyla öğrenme motivasyonunu artırmak

**Hedef Kitle:**
- Odak süresi kısa bireyler
- Düzenli haber takibi yapmak isteyen bireyler
- Gamification ile motive olmayı seven kullanıcılar
- Kronolojik ve organize haber okuma deneyimi arayanlar
- Sosyal rekabet unsurlarından hoşlanan okuyucular

## 📋 İçindekiler

### 📖 **Ana Bölümler**
- [Genel Bakış](#-genel-bakış)
- [Özellikler](#-özellikler) 
- [Kurulum](#-kurulum)
- [Proje Yapısı](#-proje-yapısı)
- [Kullanılan Teknolojiler](#️-kullanılan-teknolojiler)

### 📁 **Dokümantasyon**
- [Platform Mimarisi](./Docs/ARCHITECTURE.md)
- [N8N Workflow'ları](./Docs/N8N_WORKFLOWS.md)
- [Backend API](./backend/README.md)
- [MIT Lisansı](./LICENSE)


---

## ✨ Özellikler

### Gamification Sistemi
- **XP Sistemi:** Logaritmik progression ile dengeli seviye atlama
- **Rozet Sistemi:** Çeşitli kategori ve özel rozet (Gündem Uzmanı, Dünya Gözlemcisi, vb.)
- **Başarım Sistemi:**  Farklı başarım kategorisi (Haber Bağımlısı, Seri Efsanesi, vb.)
- **Leaderboard:** Gerçek zamanlı sıralama sistemi

### Haber Yönetimi
- **Kronolojik Okuma:** Timeline bazlı haber sunumu
- **Akıllı Kategorileme:**  Konuya göre organize edilmiş haber koleksiyonları
- **İlerleme Takibi:** Okuma durumu ve progress sistemi

### 🤖 N8N Otomasyonları
- **Haber Verisi Toplama:** RSS kaynaklarından otomatik haber çekme
- **İçerik Özetleme:** AI destekli haber özetleme ve analiz
- **Haberleri Gruplama:** Benzer konuları otomatik kategorileme
- **Haber Fotoğrafı Üretme:** AI ile görsel oluşturma ve optimizasyon

### 🚀 Modern Web Teknolojileri
- **Redux State Yönetimi:** Merkezi state yönetimi ve veri akışı
- **React Router Navigasyon:** SPA navigasyon ve route yönetimi
- **Material-UI Design System:** Modern ve responsive tasarım

### 🔍 Arama ve Keşif
- **Gelişmiş Arama:** Başlık, içerik ve etiket bazlı arama
- **Kategori Filtreleri:** Dinamik filtreleme sistemi
- **Trend Analizi:** Popüler içerik algoritması

---

## 🚀 Kurulum

### Ön Gereksinimler

```bash
# Node.js kurulumunu kontrol edin
node --version  # v18.0.0 veya üzeri

# npm kurulumunu kontrol edin
npm --version   # 8.0.0 veya üzeri

# Git kurulumunu kontrol edin
git --version   # 2.30.0 veya üzeri
```

### Hızlı Kurulum

```bash
# 1. Projeyi klonlayın
git clone https://github.com/u33549/aaHackhathon-newscoon.git
cd aaHackhathon-newscoon

# 2. Backend kurulumu
cd backend
npm install
cp .env.example .env  # .env dosyasını düzenleyin
npm start

# 3. Frontend kurulumu (yeni terminal)
cd ../frontend
npm install
cp .env.example .env  # .env dosyasını düzenleyin
npm run dev
```

### Docker ile Kurulum

Docker ile kurulum, tüm sistemi (Frontend + Backend + MongoDB) tek komutla çalıştırmanızı sağlar.

#### 1. Docker Kurulumu Hazırlığı

```bash
# dockerSetup klasörüne geçin
cd dockerSetup

# .env dosyasını konfigüre edin (örnek konfigürasyon mevcuttur)
cp .env.example .env  # Eğer yoksa
nano .env  # veya favori editörünüzle düzenleyin
```

#### 2. Docker Environment (.env) Konfigürasyonu

`dockerSetup/.env` dosyasında aşağıdaki ayarları yapılandırın:

```env
# Server Ayarları
NODE_ENV=development
API_KEY=your-secure-api-key-here

# MongoDB Ayarları
MONGO_URI=your-mongodb-uri
MONGO_ADMIN_USERNAME=your-username
MONGO_ADMIN_PASSWORD=your-password

# Cloudinary Ayarları
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend Ayarları
VITE_API_BASE_URL=/api/
VITE_API_KEY=your-secure-api-key-here
VITE_PROXY_TARGET=http://localhost:3545
```

#### 3. Docker Compose ile Sistem Başlatma

```bash
# Tüm servisleri arka planda başlatın
docker-compose up -d

# Servislerin durumunu kontrol edin
docker-compose ps

# Logları takip edin (opsiyonel)
docker-compose logs -f

# Belirli bir servisin loglarını takip edin
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

#### 4. Docker Servisleri

Docker Compose aşağıdaki servisleri çalıştırır:

| Servis | Port | Açıklama |
|--------|------|----------|
| **Frontend** | `80` | React uygulaması (Nginx ile serve ediliyor) |
| **Backend** | `3545` | Express.js API servisi |
| **MongoDB** | `27017` | MongoDB veritabanı (authentication aktif) |

**Önemli Notlar:**
- Docker build process sırasında frontend ve backend klasörleri build context olarak kullanılır
- Her servis için ayrı Dockerfile'lar mevcuttur (`frontend/Dockerfile`, `backend/Dockerfile`)
- MongoDB authentication aktif olduğu için doğru credentials kullanılmalıdır
- Volume'lar MongoDB verilerini persist eder

---

## 🛠️ Kullanılan Teknolojiler

### Frontend
- **React 19** - Modern UI framework
- **Material-UI (MUI)** - Design system ve bileşenler
- **Redux Toolkit** - State yönetimi
- **React Router** - Client-side routing
- **Vite** - Build tool ve dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL veritabanı
- **Mongoose** - MongoDB ODM
- **Cloudinary** - Görsel yönetimi

### DevOps & Deployment
- **Docker** - Containerization
- **Nginx** - Reverse proxy ve static files
- **N8N** - Workflow automation

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server
- **Git** - Version control

---
