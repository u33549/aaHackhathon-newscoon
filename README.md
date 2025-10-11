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

**İçindekiler** *(Tüm dokümantasyon zamanla güncellenecek)*
- [Kurulum ve Konfigürasyon](#kurulum)
- [API Dokümantasyonu](./backend/Docs/) - Backend API referansları
- [Frontend Bileşenleri](./frontend/src/components/) - React bileşen yapısı
- [Veritabanı Modelleri](./backend/Docs/Data-Models.md) - MongoDB şemaları
- [Docker Kurulumu](./dockerSetup/) - Container tabanlı deploy

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

```bash
# Docker Compose ile tüm sistemi başlatın
cd dockerSetup
docker-compose up -d

# Servislerin durumunu kontrol edin
docker-compose ps
```

**Detaylı kurulum rehberi için:** [Kurulum Kılavuzu](#kurulum-ve-konfigürasyon-kılavuzu)

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
