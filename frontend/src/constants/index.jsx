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

// --- DATA ---
export const allBadges = [
    {
      id: 'gundem',
      name: 'Gündem Uzmanı',
      description: 'Gündem kategorisindeki ilk haberini okudun.',
      icon: React.createElement(TeknolojiBadgeIcon),
      color: '#3B82F6'
    },
    {
      id: 'dunya',
      name: 'Dünya Gözlemcisi',
      description: 'Dünya kategorisindeki ilk haberini okudun.',
      icon: React.createElement(EkonomiBadgeIcon),
      color: '#10B981'
    },
    {
      id: 'ekonomi',
      name: 'Finans Gurusu',
      description: 'Ekonomi kategorisindeki ilk haberini okudun.',
      icon: React.createElement(EkonomiBadgeIcon),
      color: '#10B981'
    },
    {
      id: 'spor',
      name: 'Spor Tutkunusu',
      description: 'Spor kategorisindeki ilk haberini okudun.',
      icon: React.createElement(BilimBadgeIcon),
      color: '#8B5CF6'
    },
    {
      id: 'analiz',
      name: 'Analiz Uzmanı',
      description: 'Analiz kategorisindeki ilk haberini okudun.',
      icon: React.createElement(SaglikBadgeIcon),
      color: '#EF4444'
    },
    {
      id: 'kultur',
      name: 'Kültür Elçisi',
      description: 'Kültür kategorisindeki ilk haberini okudun.',
      icon: React.createElement(TeknolojiBadgeIcon),
      color: '#F59E0B'
    },
];

// --- GAMIFICATION CONSTANTS ---
export const levelThresholds = [
  0, 100, 250, 500, 750, 1000, 1500, 2000, 2750, 3500, 4500, 5500, 7000, 8500, 10000, 12000, 14000, 16000, 18500, 21000, 24000, 27000, 30000, 34000, 38000, 42000
];

export const allAchievements = [
    {
        id: 'beginner_reader',
        name: 'İlk Adım',
        description: 'İlk haberini tamamla.',
        icon: React.createElement(LogoIcon),
        isCompleted: ({ readArticles }) => readArticles.length >= 1
    },
    {
        id: 'curious_mind',
        name: 'Meraklı Zihin',
        description: 'Tüm kategorilerden en az bir haber oku.',
        icon: React.createElement(BilimBadgeIcon),
        isCompleted: ({ badges }) => badges.length >= 4
    },
    {
        id: 'streak_starter',
        name: 'Ateşi Yaktın',
        description: '3 günlük okuma serisine ulaş.',
        icon: React.createElement(FlameIcon),
        isCompleted: ({ streak }) => streak >= 3
    },
    {
        id: 'cp_hoarder',
        name: 'Puan Avcısı',
        description: 'Toplamda 1000 CP kazan.',
        icon: React.createElement(EkonomiBadgeIcon),
        isCompleted: ({ totalCp }) => totalCp >= 1000
    },
];

export const leaderboardData = [
    { id: 1, name: 'Kripto Kaşifi', cp: 7850, level: 12 },
    { id: 2, name: 'Veri Vandalı', cp: 7600, level: 12 },
    { id: 3, name: 'Siber Sultan', cp: 7120, level: 11 },
    { id: 4, name: 'Sen', cp: 0, level: 1, isCurrentUser: true },
    { id: 5, name: 'Algoritma Avcısı', cp: 6540, level: 10 },
    { id: 6, name: 'Piksel Profesörü', cp: 6110, level: 10 },
    { id: 7, name: 'Kod Kaptanı', cp: 5890, level: 9 },
];

export const categoryColors = {
  gundem: '#3B82F6',
  dunya: '#10B981',
  ekonomi: '#10B981',
  spor: '#8B5CF6',
  analiz: '#EF4444',
  kultur: '#F59E0B'
};
