import React from 'react';
import {
  Computer,
  TrendingUp,
  Science,
  LocalHospital,
  Whatshot,
  EmojiEvents,
  Share
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
    'LogoIcon': LogoIcon
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

// --- DATA ---
export const allBadges = [
    {
      id: 'gundem',
      name: 'Gündem Uzmanı',
      description: 'Gündem kategorisindeki ilk haberini okudun.',
      icon: 'Computer', // String olarak sakla
      color: '#3B82F6'
    },
    {
      id: 'dunya',
      name: 'Dünya Gözlemcisi',
      description: 'Dünya kategorisindeki ilk haberini okudun.',
      icon: 'TrendingUp', // String olarak sakla
      color: '#10B981'
    },
    {
      id: 'ekonomi',
      name: 'Finans Gurusu',
      description: 'Ekonomi kategorisindeki ilk haberini okudun.',
      icon: 'TrendingUp', // String olarak sakla
      color: '#10B981'
    },
    {
      id: 'spor',
      name: 'Spor Tutkunusu',
      description: 'Spor kategorisindeki ilk haberini okudun.',
      icon: 'Science', // String olarak sakla
      color: '#8B5CF6'
    },
    {
      id: 'analiz',
      name: 'Analiz Uzmanı',
      description: 'Analiz kategorisindeki ilk haberini okudun.',
      icon: 'LocalHospital', // String olarak sakla
      color: '#EF4444'
    },
    {
      id: 'kultur',
      name: 'Kültür Elçisi',
      description: 'Kültür kategorisindeki ilk haberini okudun.',
      icon: 'Computer', // String olarak sakla
      color: '#F59E0B'
    },
];

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

// Güncellenmiş başarım sistemi
export const allAchievements = [
    {
        id: 'beginner_reader',
        name: 'İlk Adım',
        description: 'İlk haberini tamamla.',
        icon: 'LogoIcon', // String olarak sakla
        xpReward: 50,
        isCompleted: ({ readingProgress }) => readingProgress.totalNewsRead >= 1
    },
    {
        id: 'curious_mind',
        name: 'Meraklı Zihin',
        description: 'Tüm kategorilerden en az bir haber oku.',
        icon: 'Science', // String olarak sakla
        xpReward: 100,
        isCompleted: ({ achievements }) => achievements.badges.length >= 4
    },
    {
        id: 'streak_starter',
        name: 'Ateşi Yaktın',
        description: '3 günlük okuma serisine ulaş.',
        icon: 'Whatshot', // String olarak sakla
        xpReward: 75,
        isCompleted: ({ achievements }) => achievements.streakData.current >= 3
    },
    {
        id: 'stack_master',
        name: 'Yığın Ustası',
        description: 'İlk haber yığınını tamamla.',
        icon: 'EmojiEvents', // String olarak sakla
        xpReward: 100,
        isCompleted: ({ readingProgress }) => readingProgress.totalStacksCompleted >= 1
    },
    {
        id: 'news_addict',
        name: 'Haber Bağımlısı',
        description: '50 haber oku.',
        icon: 'Computer', // String olarak sakla
        xpReward: 200,
        isCompleted: ({ readingProgress }) => readingProgress.totalNewsRead >= 50
    },
    {
        id: 'level_climber',
        name: 'Seviye Tırmanıcısı',
        description: '5. seviyeye ulaş.',
        icon: 'TrendingUp', // String olarak sakla
        xpReward: 150,
        isCompleted: ({ stats }) => stats.currentLevel >= 5
    },
    {
        id: 'streak_legend',
        name: 'Seri Efsanesi',
        description: '7 günlük okuma serisine ulaş.',
        icon: 'Whatshot', // String olarak sakla
        xpReward: 300,
        isCompleted: ({ achievements }) => achievements.streakData.current >= 7
    },
    {
        id: 'xp_collector',
        name: 'XP Koleksiyoncusu',
        description: 'Toplamda 1000 XP kazan.',
        icon: 'EmojiEvents', // String olarak sakla
        xpReward: 100,
        isCompleted: ({ stats }) => stats.totalXP >= 1000
    }
];

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
