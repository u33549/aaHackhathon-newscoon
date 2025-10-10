import React from 'react';
import {
  Computer,
  TrendingUp,
  Science,
  LocalHospital,
  Whatshot,
  EmojiEvents,
  Share,
  School,
  Lightbulb,
  Speed,
  Psychology,
  AttachMoney,
  SportsBasketball,
  AutoStories,
  Star,
  Public,
  Article,
  MenuBook
} from '@mui/icons-material';
import LogoImage from '../assets/Logo_Newscoon.png';

// --- ICONS ---
export const LogoIcon = ({ sx, ...props }) => (
    <img
        src={LogoImage}
        alt="Newscoon Logo"
        style={{
            width: '100%',
            height: '100%',
            maxWidth: '48px',
            maxHeight: '48px',
            objectFit: 'contain',
            objectPosition: 'center',
            borderRadius: '4px',
            display: 'block',
            ...sx
        }}
        {...props}
    />
);


export const TeknolojiBadgeIcon = () => React.createElement(Computer);
export const EkonomiBadgeIcon = () => React.createElement(TrendingUp);
export const BilimBadgeIcon = () => React.createElement(Science);
export const SaglikBadgeIcon = () => React.createElement(LocalHospital);
export const FlameIcon = () => React.createElement(Whatshot);
export const AchievementIcon = () => React.createElement(EmojiEvents);
export const ShareIcon = () => React.createElement(Share);

// Icon string'lerini component'lere dönüştüren helper fonksiyon
export const getIconComponent = (iconName) => {
  const iconMap = {
    'Computer': Computer,
    'TrendingUp': TrendingUp,
    'Science': Science,
    'LocalHospital': LocalHospital,
    'Whatshot': Whatshot,
    'EmojiEvents': EmojiEvents,
    'Share': Share,
    'LogoIcon': LogoIcon,
    'School': School,
    'Lightbulb': Lightbulb,
    'Speed': Speed,
    'Psychology': Psychology,
    'AttachMoney': AttachMoney,
    'SportsBasketball': SportsBasketball,
    'AutoStories': AutoStories,
    'Star': Star,
    'Public': Public,
    'Article': Article,
    'MenuBook': MenuBook
  };

  const IconComponent = iconMap[iconName];
  if (!IconComponent) {
    return Computer; // Fallback
  }

  if (iconName === 'LogoIcon') {
    return LogoIcon;
  }

  return React.createElement(IconComponent);
};

// --- ROZETLER (Badges) - Sıfat/Unvan olanlar ---
export const allBadges = [
    // Kategori Rozetleri (6 adet)
    {
      id: 'gundem',
      name: 'Gündem Uzmanı',
      description: 'Gündem kategorisindeki ilk haberini okudun.',
      icon: 'Computer',
      color: '#3B82F6',
      checkType: 'category',
      requiredValue: 'gundem'
    },
    {
      id: 'dunya',
      name: 'Dünya Gözlemcisi',
      description: 'Dünya kategorisindeki ilk haberini okudun.',
      icon: 'Public',
      color: '#10B981',
      checkType: 'category',
      requiredValue: 'dunya'
    },
    {
      id: 'ekonomi',
      name: 'Finans Gurusu',
      description: 'Ekonomi kategorisindeki ilk haberini okudun.',
      icon: 'AttachMoney',
      color: '#F59E0B',
      checkType: 'category',
      requiredValue: 'ekonomi'
    },
    {
      id: 'spor',
      name: 'Spor Tutkunusu',
      description: 'Spor kategorisindeki ilk haberini okudun.',
      icon: 'SportsBasketball',
      color: '#8B5CF6',
      checkType: 'category',
      requiredValue: 'spor'
    },
    {
      id: 'analiz',
      name: 'Analiz Uzmanı',
      description: 'Analiz kategorisindeki ilk haberini okudun.',
      icon: 'Psychology',
      color: '#EF4444',
      checkType: 'category',
      requiredValue: 'analiz'
    },
    {
      id: 'kultur',
      name: 'Kültür Elçisi',
      description: 'Kültür kategorisindeki ilk haberini okudun.',
      icon: 'AutoStories',
      color: '#EC4899',
      checkType: 'category',
      requiredValue: 'kultur'
    },
    // Özel Sıfat Rozetleri (6 adet)
    {
      id: 'curious_mind',
      name: 'Meraklı Zihin',
      description: 'Tüm kategorilerden en az bir haber okudun.',
      icon: 'Lightbulb',
      color: '#9C27B0',
      checkType: 'badgeCount',
      requiredValue: 6
    },
    {
      id: 'news_addict',
      name: 'Haber Bağımlısı',
      description: '50 haber okudun.',
      icon: 'Article',
      color: '#FF5722',
      checkType: 'totalNewsRead',
      requiredValue: 50
    },
    {
      id: 'level_climber',
      name: 'Seviye Tırmanıcısı',
      description: '5. seviyeye ulaştın.',
      icon: 'Star',
      color: '#FFD700',
      checkType: 'level',
      requiredValue: 5
    },
    {
      id: 'stack_master',
      name: 'Yığın Ustası',
      description: '10 haber yığını tamamladın.',
      icon: 'EmojiEvents',
      color: '#4CAF50',
      checkType: 'stacksCompleted',
      requiredValue: 10
    },
    {
      id: 'streak_legend',
      name: 'Seri Efsanesi',
      description: '7 günlük okuma serisi yaptın.',
      icon: 'Whatshot',
      color: '#FF6B6B',
      checkType: 'manual',
      requiredValue: 7
    },
    {
      id: 'xp_collector',
      name: 'XP Koleksiyoncusu',
      description: 'Toplamda 1000 XP kazandın.',
      icon: 'Speed',
      color: '#00BCD4',
      checkType: 'totalXP',
      requiredValue: 1000
    }
];

// Rozet kazanma kontrolü
export const checkBadgeEarned = (badge, userData) => {
    const { checkType, requiredValue } = badge;

    switch (checkType) {
        case 'category':
            // Kategori rozeti - kullanıcının rozetlerinde var mı?
            return userData.achievements.badges.some(b => b.id === badge.id);
        case 'totalNewsRead':
            return userData.readingProgress.totalNewsRead >= requiredValue;
        case 'badgeCount':
            // Kategori rozetlerinin sayısını kontrol et (ilk 6 rozet)
            const categoryBadges = userData.achievements.badges.filter(b =>
                ['gundem', 'dunya', 'ekonomi', 'spor', 'analiz', 'kultur'].includes(b.id)
            );
            return categoryBadges.length >= requiredValue;
        case 'stacksCompleted':
            return userData.readingProgress.totalStacksCompleted >= requiredValue;
        case 'level':
            return userData.stats.currentLevel >= requiredValue;
        case 'totalXP':
            return userData.stats.totalXP >= requiredValue;
        case 'manual':
            // Manuel kontrol - MVP için direkt badge listesine bakıyoruz
            return userData.achievements.badges.some(b => b.id === badge.id);
        default:
            return false;
    }
};

// --- XP AND LEVEL CONSTANTS ---
export const XP_CONSTANTS = {
  // Her haber için XP aralığı
  NEWS_XP_MIN: 40,
  NEWS_XP_MAX: 50,

  // Level hesaplama sabitleri
  BASE_XP: 100,           // İlk level için base XP
  LEVEL_MULTIPLIER: 200,  // ln(x) çarpanı

  // Bonus XP'ler
  STACK_COMPLETION_BONUS: 25,     // Stack tamamlama bonusu
  STREAK_DAILY_BONUS: 10,         // Günlük streak bonusu
  FIRST_CATEGORY_BONUS: 50,       // İlk defa kategori okuma bonusu
  LEVEL_UP_BONUS: 100,            // Level atlama bonusu
};

// Level hesaplama fonksiyonu - ln(x) bazlı
export const calculateLevelFromXP = (totalXP) => {
  if (totalXP <= 0) return 1;

  const { BASE_XP, LEVEL_MULTIPLIER } = XP_CONSTANTS;

  let level = 1;
  let totalRequired = 0;

  while (totalRequired < totalXP) {
    const levelXP = BASE_XP + (Math.log(level) * LEVEL_MULTIPLIER);
    totalRequired += levelXP;

    if (totalRequired <= totalXP) {
      level++;
    } else {
      break;
    }
  }

  return Math.max(1, level);
};

// Yeni level threshold'ları - ln(x) sistemi için (ilk 30 level)
export const levelThresholds = (() => {
  const thresholds = [0]; // Level 1 = 0 XP
  let totalXP = 0;

  for (let level = 1; level <= 30; level++) {
    const levelXP = XP_CONSTANTS.BASE_XP + (Math.log(level) * XP_CONSTANTS.LEVEL_MULTIPLIER);
    totalXP += levelXP;
    thresholds.push(Math.floor(totalXP));
  }

  return thresholds;
})();

// --- BAŞARIMLAR (Achievements) - Eylem/Hedef odaklı ---
export const allAchievements = [
    // Okuma Başarımları
    {
        id: 'first_step',
        name: 'İlk Adım',
        description: 'İlk haberini tamamla.',
        icon: 'School',
        xpReward: 50,
        checkType: 'totalNewsRead',
        requiredValue: 1
    },
    {
        id: 'early_reader',
        name: 'Erken Okuyucu',
        description: '5 haber oku.',
        icon: 'MenuBook',
        xpReward: 75,
        checkType: 'totalNewsRead',
        requiredValue: 5
    },
    {
        id: 'dedicated_reader',
        name: 'Kararlı Okuyucu',
        description: '25 haber oku.',
        icon: 'Article',
        xpReward: 150,
        checkType: 'totalNewsRead',
        requiredValue: 25
    },
    {
        id: 'news_marathon',
        name: 'Haber Maratonu',
        description: '100 haber oku.',
        icon: 'Speed',
        xpReward: 350,
        checkType: 'totalNewsRead',
        requiredValue: 100
    },
    // Stack Başarımları
    {
        id: 'stack_beginner',
        name: 'Yığın Başlangıcı',
        description: 'İlk haber yığınını tamamla.',
        icon: 'EmojiEvents',
        xpReward: 100,
        checkType: 'stacksCompleted',
        requiredValue: 1
    },
    {
        id: 'stack_enthusiast',
        name: 'Yığın Meraklısı',
        description: '5 haber yığını tamamla.',
        icon: 'EmojiEvents',
        xpReward: 200,
        checkType: 'stacksCompleted',
        requiredValue: 5
    },
    {
        id: 'stack_pro',
        name: 'Yığın Profesyoneli',
        description: '20 haber yığını tamamla.',
        icon: 'EmojiEvents',
        xpReward: 500,
        checkType: 'stacksCompleted',
        requiredValue: 20
    },
    // Kategori Başarımları
    {
        id: 'category_explorer',
        name: 'Kategori Kaşifi',
        description: '3 farklı kategoriden haber oku.',
        icon: 'Public',
        xpReward: 100,
        checkType: 'badgeCount',
        requiredValue: 3
    },
    {
        id: 'category_master',
        name: 'Kategori Ustası',
        description: 'Tüm kategorilerden haber oku.',
        icon: 'Public',
        xpReward: 250,
        checkType: 'badgeCount',
        requiredValue: 6
    },
    // Level Başarımları
    {
        id: 'level_2',
        name: 'Seviye 2',
        description: '2. seviyeye ulaş.',
        icon: 'Star',
        xpReward: 75,
        checkType: 'level',
        requiredValue: 2
    },
    {
        id: 'level_3',
        name: 'Seviye 3',
        description: '3. seviyeye ulaş.',
        icon: 'Star',
        xpReward: 100,
        checkType: 'level',
        requiredValue: 3
    },
    {
        id: 'level_5',
        name: 'Seviye 5',
        description: '5. seviyeye ulaş.',
        icon: 'Star',
        xpReward: 200,
        checkType: 'level',
        requiredValue: 5
    },
    {
        id: 'level_10',
        name: 'Seviye 10',
        description: '10. seviyeye ulaş.',
        icon: 'Star',
        xpReward: 500,
        checkType: 'level',
        requiredValue: 10
    },
    // XP Başarımları
    {
        id: 'xp_500',
        name: 'İlk 500 XP',
        description: 'Toplamda 500 XP kazan.',
        icon: 'TrendingUp',
        xpReward: 75,
        checkType: 'totalXP',
        requiredValue: 500
    },
    {
        id: 'xp_1500',
        name: '1500 XP Hedefi',
        description: 'Toplamda 1500 XP kazan.',
        icon: 'TrendingUp',
        xpReward: 150,
        checkType: 'totalXP',
        requiredValue: 1500
    },
    {
        id: 'xp_3000',
        name: '3000 XP Ustası',
        description: 'Toplamda 3000 XP kazan.',
        icon: 'TrendingUp',
        xpReward: 300,
        checkType: 'totalXP',
        requiredValue: 3000
    }
];

// Achievement kontrolü için utility fonksiyon
export const checkAchievementCompleted = (achievement, userData) => {
    const { checkType, requiredValue } = achievement;

    switch (checkType) {
        case 'totalNewsRead':
            return userData.readingProgress.totalNewsRead >= requiredValue;
        case 'badgeCount':
            // Kategori rozetlerinin sayısını kontrol et
            const categoryBadges = userData.achievements.badges.filter(b =>
                ['gundem', 'dunya', 'ekonomi', 'spor', 'analiz', 'kultur'].includes(b.id)
            );
            return categoryBadges.length >= requiredValue;
        case 'stacksCompleted':
            return userData.readingProgress.totalStacksCompleted >= requiredValue;
        case 'level':
            return userData.stats.currentLevel >= requiredValue;
        case 'totalXP':
            return userData.stats.totalXP >= requiredValue;
        default:
            return false;
    }
};

// Demo leaderboard - XP bazlı
export const leaderboardData = [
    { id: 1, name: 'Haber Avcısı', xp: 2847, level: 8 },
    { id: 2, name: 'Bilgi Kurdu', xp: 2653, level: 8 },
    { id: 3, name: 'Gündem Takipçisi', xp: 2401, level: 7 },
    { id: 4, name: 'Sen', xp: 0, level: 1, isCurrentUser: true },
    { id: 5, name: 'Analiz Uzmanı', xp: 2156, level: 7 },
    { id: 6, name: 'Medya Meraklısı', xp: 1924, level: 6 },
    { id: 7, name: 'Haber Okuyucusu', xp: 1687, level: 6 },
];

export const categoryColors = {
  gundem: '#3B82F6',
  dunya: '#10B981',
  ekonomi: '#10B981',
  spor: '#8B5CF6',
  analiz: '#EF4444',
  kultur: '#F59E0B'
};
