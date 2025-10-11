# NEWSCOON Component Guide

Bu dokümantasyon, NEWSCOON projesindeki tüm React component'lerinin detaylı açıklamalarını ve props interface'lerini içerir.

## 📋 İçindekiler

- [Component Hiyerarşisi](#component-hiyerarşisi)
- [Layout Components](#layout-components)
- [Card Components](#card-components)
- [Modal Components](#modal-components)
- [Navigation Components](#navigation-components)
- [Notification Components](#notification-components)
- [Section Components](#section-components)
- [Page Components](#page-components)
- [Common Components](#common-components)


---

## Component Hiyerarşisi

```
App.jsx
├── Layout Components
│   ├── Header.jsx
│   └── Footer.jsx
├── Page Components
│   ├── MainPage.jsx
│   ├── AllNewsPage.jsx
│   ├── StackDetailPage.jsx
│   ├── ReadingFlowPage.jsx
├── Modal Components
│   ├── BadgeModal.jsx
│   └── ShareModal.jsx
└── Notification Components
    ├── CelebrationPopup.jsx
    ├── AchievementToast.jsx
    ├── BadgeToast.jsx
    └── ToastNotification.jsx
```

---

## Layout Components

### Header.jsx

**Açıklama:** Uygulamanın üst kısmında yer alan navigation header'ı. Logo, kullanıcı seviyesi, XP progress bar ve rozet butonu içerir.

**Props Interface:**
```typescript
interface HeaderProps {
  totalCp?: number;           // Kullanıcının toplam XP'si
  level?: number;             // Kullanıcının mevcut seviyesi
  cpForNextLevel?: {          // Bir sonraki seviye için gerekli XP bilgisi
    current: number;
    max: number;
  };
  onOpenBadges?: () => void;  // Rozet modal'ını açma fonksiyonu
}
```

### Footer.jsx

**Açıklama:** Uygulamanın alt kısmında yer alan footer component'i.
---

## Card Components

### NewsCard.jsx

**Açıklama:** Haber kartları için kullanılan ana component. Hem tekli hem çoklu haber görüntüleme destekler.

**Props Interface:**
```typescript
interface NewsCardProps {
  articles?: Array<{
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    publishedAt: string;
    source: string;
    viewCount?: number;
    readTime?: number;
  }>;
  article?: Article;          // Backward compatibility
  variant?: 'horizontal' | 'vertical';
  onClick?: (article: Article) => void;
}
```
---

## Modal Components

### BadgeModal.jsx

**Açıklama:** Kullanıcının kazandığı rozetler, başarımlar ve leaderboard bilgilerini gösteren modal.

**Props Interface:**
```typescript
interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    earned: boolean;
    earnedAt?: string;
  }>;
  totalCp: number;
  earnedAchievements: Set<string>;
  level: number;
}
```

### ShareModal.jsx

**Açıklama:** İçerik paylaşımı için kullanılan modal component'i.

**Props Interface:**
```typescript
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    title: string;
    url: string;
    description?: string;
  };
}
```

---

## Navigation Components

### SearchBar.jsx

**Açıklama:** Haber arama işlevselliği sağlayan arama çubuğu component'i.

**Props Interface:**
```typescript
interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}
```

### CategoryPills.jsx

**Açıklama:** Kategori filtresi için kullanılan pill-style butonlar.

**Props Interface:**
```typescript
interface CategoryPillsProps {
  categories: Array<{
    id: string;
    name: string;
    color: string;
    icon?: string;
  }>;
  selectedCategories: string[];
  onCategoryChange: (categoryId: string) => void;
  maxVisible?: number;
}
```

---

## Notification Components

### CelebrationPopup.jsx

**Açıklama:** Seviye atlama, rozet kazanma gibi başarılar için kutlama popup'ı.

**Props Interface:**
```typescript
interface CelebrationPopupProps {
  celebrations: Array<{
    type: 'level' | 'badge' | 'achievement';
    title: string;
    description: string;
    icon?: string;
    data?: any;
  }>;
  onClose: () => void;
}
```
### AchievementToast.jsx

**Açıklama:** Başarım bildirimleri için toast component'i.

**Props Interface:**
```typescript
interface AchievementToastProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
  };
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}
```

### BadgeToast.jsx

**Açıklama:** Rozet kazanımı bildirimleri için toast component'i.

**Props Interface:**
```typescript
interface BadgeToastProps {
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
  };
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}
```

### ToastNotification.jsx

**Açıklama:** Genel bildirimler için kullanılan toast component'i.

**Props Interface:**
```typescript
interface ToastNotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

---

## Section Components

### Hero.jsx

**Açıklama:** Ana sayfa hero section component'i.

**Props Interface:**
```typescript
interface HeroProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}
```

### NewsSection.jsx

**Açıklama:** Haber listelerini gösteren section component'i.

**Props Interface:**
```typescript
interface NewsSectionProps {
  title: string;
  news: Article[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  variant?: 'grid' | 'list';
}
```

---

## Page Components

### MainPage.jsx

**Açıklama:** Ana sayfa component'i. Hero section ve haber stack'lerini içerir.

**Özellikler:**
- Hero section with featured content
- News stacks grid
- Search and filter functionality
- Infinite scroll loading

### AllNewsPage.jsx

**Açıklama:** Tüm haberleri listeleyen sayfa component'i.

**Özellikler:**
- Kapsamlı haber listesi
- Gelişmiş filtreleme seçenekleri
- Sayfa numaralandırma veya sonsuz kaydırma
- Kategoriye göre düzenleme

### StackDetailPage.jsx

**Açıklama:** Haber stack detay sayfası component'i.

**Özellikler:**
- Stack bilgisi gösterimi
- Stack içindeki makale listesi
- Okuma ilerlemesi takibi
- Paylaşım işlevi

### ReadingFlowPage.jsx

**Açıklama:** Kronolojik haber okuma deneyimi sağlayan sayfa.

**Özellikler:**
- Zaman çizelgesine dayalı okuma akışı
- İlerleme takibi
- XP kazanma sistemi
- Makaleler arasında gezinme

---

## Common Components

### ScrollToTop.jsx

**Açıklama:** Sayfa navigation'ında otomatik scroll-to-top functionality sağlar.

---

## Best Practices

### Component Structure

1. **Props Interface:** Her component için TypeScript-style props interface tanımla
2. **Default Props:** Defensive programming için default values kullan
3. **Error Boundaries:** Critical component'lerde error handling ekle
4. **Memoization:** Performance için React.memo kullan

### Styling Guidelines

1. **Material-UI Theme:** Consistent styling için theme system kullan
2. **Responsive Design:** useMediaQuery hook'u ile responsive behavior
3. **Color Consistency:** Theme colors ve constants/categoryColors kullan
4. **Spacing:** Theme spacing units kullan


