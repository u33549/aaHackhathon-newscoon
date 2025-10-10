import { useDispatch, useSelector } from 'react-redux';

// Redux store tiplerini kullanmak için typed hooks
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Custom hooks for specific slices
export const useNews = () => {
  return useAppSelector((state) => state.news);
};

export const useStacks = () => {
  return useAppSelector((state) => state.stacks);
};

export const useUI = () => {
  return useAppSelector((state) => state.ui);
};

// User-specific hooks with null safety - Yeni state yapısına göre güncelle
export const useUser = () => {
  return useAppSelector((state) => state.user);
};

export const useUserXP = () => {
  return useAppSelector((state) => state.user?.stats?.totalXP || 0);
};

export const useUserLevel = () => {
  return useAppSelector((state) => state.user?.stats?.currentLevel || 1);
};

export const useUserStats = () => {
  return useAppSelector((state) => state.user?.stats || {
    totalXP: 0,
    currentLevel: 1,
    currentLevelXP: 0,
    nextLevelXP: 100,
    levelProgress: 0
  });
};

export const useUserLevelProgress = () => {
  return useAppSelector((state) => state.user?.stats || {
    currentLevelXP: 0,
    nextLevelXP: 100,
    levelProgress: 0,
    hasLeveledUp: false,
    levelUpFrom: null,
    levelUpTo: null
  });
};

export const useReadingProgress = () => {
  return useAppSelector((state) => state.user?.readingProgress || {
    readStacks: [],
    currentlyReading: [],
    recentlyRead: [],
    totalStacksCompleted: 0,
    totalNewsRead: 0
  });
};

export const useUserAchievements = () => {
  return useAppSelector((state) => state.user?.achievements || {
    badges: [],
    achievements: [],
    streakData: { current: 0, longest: 0, lastDate: null }
  });
};

export const useUserBadges = () => {
  return useAppSelector((state) => state.user?.achievements?.badges || []);
};

export const useUserStreak = () => {
  return useAppSelector((state) => state.user?.achievements?.streakData || { current: 0 });
};

export const useCurrentlyReading = () => {
  return useAppSelector((state) => state.user?.readingProgress?.currentlyReading || []);
};

export const useReadStacks = () => {
  return useAppSelector((state) => state.user?.readingProgress?.readStacks || []);
};

export const useEarnedBadges = () => {
  return useAppSelector((state) => state.user?.achievements?.badges || []);
};

export const useStackProgress = (stackId) => {
  return useAppSelector((state) =>
    state.user?.readingProgress?.readStacks?.find(s => s.stackId === stackId) || null
  );
};

export const useXPForNextLevel = () => {
  return useAppSelector((state) => {
    const stats = state.user?.stats;
    if (!stats) {
      return { current: 0, max: 100 };
    }

    // Basit: mevcut level için kazanılan XP ve level için gereken toplam XP
    return {
      current: stats.currentLevelXP || 0,
      max: (stats.nextLevelXP || 100) - (stats.totalXP || 0) + (stats.currentLevelXP || 0)
    };
  });
};

// Specific selectors for common use cases
export const useNewsLoading = () => {
  return useAppSelector((state) => state.news.loading);
};

export const useNewsError = () => {
  return useAppSelector((state) => state.news.error);
};

export const useSelectedNews = () => {
  return useAppSelector((state) => state.news.selectedNews);
};

export const useStacksLoading = () => {
  return useAppSelector((state) => state.stacks.loading);
};

export const useStacksError = () => {
  return useAppSelector((state) => state.stacks.error);
};

export const useSelectedStack = () => {
  return useAppSelector((state) => state.stacks.selectedStack);
};

export const usePopularStacks = () => {
  return useAppSelector((state) => state.stacks.popularStacks);
};

export const useLatestStacks = () => {
  return useAppSelector((state) => state.stacks.latestStacks);
};

export const useGlobalLoading = () => {
  return useAppSelector((state) => state.ui.globalLoading);
};

export const useToasts = () => {
  return useAppSelector((state) => state.ui.notifications.toasts);
};

export const useSearchQuery = () => {
  return useAppSelector((state) => state.ui.searchQuery);
};

export const useActiveCategory = () => {
  return useAppSelector((state) => state.ui.activeCategory);
};
