import { createSlice } from '@reduxjs/toolkit';

// Level hesaplama fonksiyonu - ln(x) bazlı
const calculateLevelFromXP = (totalXP) => {
  if (totalXP <= 0) return 1;
  
  // ln(x) fonksiyonu ile level hesaplama
  // Her level için gereken XP artışı logaritmik olarak artar
  // Base XP = 100, her level için ln(level) * multiplier kadar daha fazla XP gerekir
  const baseXP = 100;
  const multiplier = 200;
  
  let level = 1;
  let totalRequired = 0;
  
  while (totalRequired < totalXP) {
    const levelXP = baseXP + (Math.log(level) * multiplier);
    totalRequired += levelXP;
    
    if (totalRequired <= totalXP) {
      level++;
    } else {
      break;
    }
  }
  
  return Math.max(1, level);
};

// Sonraki level için gereken XP'yi hesaplama
const calculateXPForNextLevel = (currentLevel) => {
  const baseXP = 100;
  const multiplier = 200;
  
  let totalRequired = 0;
  for (let i = 1; i <= currentLevel; i++) {
    const levelXP = baseXP + (Math.log(i) * multiplier);
    totalRequired += levelXP;
  }
  
  return totalRequired;
};

// Mevcut level için gereken minimum XP
const calculateXPForCurrentLevel = (currentLevel) => {
  if (currentLevel <= 1) return 0;
  
  const baseXP = 100;
  const multiplier = 200;
  
  let totalRequired = 0;
  for (let i = 1; i < currentLevel; i++) {
    const levelXP = baseXP + (Math.log(i) * multiplier);
    totalRequired += levelXP;
  }
  
  return totalRequired;
};

// Her haber için XP (40-50 arası rastgele)
const generateNewsXP = () => {
  return Math.floor(Math.random() * (50 - 40 + 1)) + 40;
};

// Demo user verisi
const initialState = {
  // User bilgileri
  profile: {
    id: 'demo-user-001',
    username: 'Sen',
    displayName: 'Demo Kullanıcı',
    email: 'demo@newscoon.com',
    joinDate: new Date().toISOString(),
    avatar: null
  },

  // XP ve Level sistemi
  stats: {
    totalXP: 0,
    currentLevel: 1,
    currentLevelXP: 0, // Bu level için kazanılan XP
    nextLevelXP: 100,   // Sonraki level için gereken XP
    levelProgress: 0    // 0-100 arası progress yüzdesi
  },

  // Okunan stackler ve progress
  readingProgress: {
    readStacks: [], // { stackId, completedAt, totalNews, readNews, xpEarned }
    currentlyReading: [], // { stackId, startedAt, readNews, totalNews }
    recentlyRead: [], // Son 10 okunan stack
    totalStacksCompleted: 0,
    totalNewsRead: 0
  },

  // Rozet ve başarımlar
  achievements: {
    badges: [], // Earned badges
    achievements: [], // Unlocked achievements
    streakData: {
      current: 0,
      longest: 0,
      lastDate: null
    }
  },

  // User tercihleri
  preferences: {
    favoriteCategories: [],
    readingSpeed: 'normal', // slow, normal, fast
    notifications: {
      achievements: true,
      dailyReminder: true,
      weeklyDigest: true
    }
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // XP ve Level işlemleri
    addXP: (state, action) => {
      const xpToAdd = action.payload;
      state.stats.totalXP += xpToAdd;
      
      // Level hesapla
      const newLevel = calculateLevelFromXP(state.stats.totalXP);
      const oldLevel = state.stats.currentLevel;
      
      state.stats.currentLevel = newLevel;
      
      // Level progress hesapla
      const currentLevelMinXP = calculateXPForCurrentLevel(newLevel);
      const nextLevelMinXP = calculateXPForNextLevel(newLevel);
      const currentLevelXP = state.stats.totalXP - currentLevelMinXP;
      const levelXPRequired = nextLevelMinXP - currentLevelMinXP;
      
      state.stats.currentLevelXP = currentLevelXP;
      state.stats.nextLevelXP = nextLevelMinXP;
      state.stats.levelProgress = Math.floor((currentLevelXP / levelXPRequired) * 100);
      
      // Level atlandıysa level up event'i için flag
      if (newLevel > oldLevel) {
        state.stats.hasLeveledUp = true;
        state.stats.levelUpFrom = oldLevel;
        state.stats.levelUpTo = newLevel;
      }
    },

    clearLevelUpFlag: (state) => {
      state.stats.hasLeveledUp = false;
      state.stats.levelUpFrom = null;
      state.stats.levelUpTo = null;
    },

    // Stack okuma işlemleri
    startReadingStack: (state, action) => {
      const { stackId, totalNews } = action.payload;
      
      // Zaten okunuyor mu kontrol et
      const alreadyReading = state.readingProgress.currentlyReading.find(
        item => item.stackId === stackId
      );
      
      if (!alreadyReading) {
        state.readingProgress.currentlyReading.push({
          stackId,
          startedAt: new Date().toISOString(),
          readNews: 0,
          totalNews,
          xpEarned: 0
        });
      }
    },

    readNewsInStack: (state, action) => {
      const { stackId, newsXP } = action.payload;
      const xpToAdd = newsXP || generateNewsXP();
      
      // Currently reading'de bul
      const readingStack = state.readingProgress.currentlyReading.find(
        item => item.stackId === stackId
      );
      
      if (readingStack) {
        readingStack.readNews += 1;
        readingStack.xpEarned += xpToAdd;
        
        // Total stats güncelle
        state.readingProgress.totalNewsRead += 1;
        
        // XP ekle
        userSlice.caseReducers.addXP(state, { payload: xpToAdd });
      }
    },

    // Stack tamamlandı - XP kazan
    completeStack: (state, action) => {
      const { stackId, stackXP } = action.payload;

      const existingStack = state.readingProgress.readStacks.find(s => s.stackId === stackId);

      if (existingStack && !existingStack.completedAt) {
        // Stack'i tamamla
        existingStack.completedAt = new Date().toISOString();
        existingStack.completedNewsCount = existingStack.totalNewsCount;
        existingStack.lastReadIndex = existingStack.totalNewsCount - 1;

        // Toplam XP kazan (stack XP + completion bonus)
        state.stats.totalXP += stackXP;

        // Level hesapla
        state.stats.currentLevel = calculateLevelFromXP(state.stats.totalXP);
      }
    },

    // Rozet ve başarım işlemleri
    addBadge: (state, action) => {
      const badge = action.payload;
      const exists = state.achievements.badges.find(b => b.id === badge.id);
      
      if (!exists) {
        state.achievements.badges.push({
          ...badge,
          earnedAt: new Date().toISOString()
        });
      }
    },

    addAchievement: (state, action) => {
      const achievement = action.payload;
      const exists = state.achievements.achievements.find(a => a.id === achievement.id);
      
      if (!exists) {
        state.achievements.achievements.push({
          ...achievement,
          unlockedAt: new Date().toISOString()
        });
      }
    },

    // Tercih işlemleri
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },

    addFavoriteCategory: (state, action) => {
      const category = action.payload;
      if (!state.preferences.favoriteCategories.includes(category)) {
        state.preferences.favoriteCategories.push(category);
      }
    },

    removeFavoriteCategory: (state, action) => {
      const category = action.payload;
      state.preferences.favoriteCategories = state.preferences.favoriteCategories.filter(
        cat => cat !== category
      );
    },

    // Debug ve test işlemleri
    resetProgress: (state) => {
      state.stats = initialState.stats;
      state.readingProgress = initialState.readingProgress;
      state.achievements = initialState.achievements;
    },

    // Demo data yükleme
    loadDemoData: (state) => {
      // Demo için biraz XP ve progress ekle
      state.stats.totalXP = 750;
      state.stats.currentLevel = calculateLevelFromXP(750);
      
      const currentLevelMinXP = calculateXPForCurrentLevel(state.stats.currentLevel);
      const nextLevelMinXP = calculateXPForNextLevel(state.stats.currentLevel);
      const currentLevelXP = state.stats.totalXP - currentLevelMinXP;
      const levelXPRequired = nextLevelMinXP - currentLevelMinXP;
      
      state.stats.currentLevelXP = currentLevelXP;
      state.stats.nextLevelXP = nextLevelMinXP;
      state.stats.levelProgress = Math.floor((currentLevelXP / levelXPRequired) * 100);
      
      // Demo reading progress
      state.readingProgress.totalStacksCompleted = 5;
      state.readingProgress.totalNewsRead = 23;
      state.achievements.streakData.current = 3;
      state.achievements.streakData.longest = 7;
      state.achievements.streakData.lastDate = new Date().toISOString();
    }
  }
});

export const {
  addXP,
  clearLevelUpFlag,
  startReadingStack,
  readNewsInStack,
  completeStack,
  addBadge,
  addAchievement,
  updatePreferences,
  addFavoriteCategory,
  removeFavoriteCategory,
  resetProgress,
  loadDemoData
} = userSlice.actions;

// Selector functions
export const selectUserStats = (state) => state.user.stats;
export const selectUserLevel = (state) => state.user.stats.currentLevel;
export const selectUserXP = (state) => state.user.stats.totalXP;
export const selectReadingProgress = (state) => state.user.readingProgress;
export const selectUserAchievements = (state) => state.user.achievements;
export const selectCurrentlyReading = (state) => state.user.readingProgress.currentlyReading;
export const selectRecentlyRead = (state) => state.user.readingProgress.recentlyRead;

export default userSlice.reducer;
