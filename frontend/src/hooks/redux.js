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

export const useUser = () => {
  return useAppSelector((state) => state.user);
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

// User-specific hooks
export const useUserStats = () => {
  return useAppSelector((state) => state.user.stats);
};

export const useUserProfile = () => {
  return useAppSelector((state) => state.user.profile);
};

export const useUserLevel = () => {
  return useAppSelector((state) => state.user.stats.currentLevel);
};

export const useUserXP = () => {
  return useAppSelector((state) => state.user.stats.totalXP);
};

export const useUserLevelProgress = () => {
  return useAppSelector((state) => ({
    currentLevelXP: state.user.stats.currentLevelXP,
    nextLevelXP: state.user.stats.nextLevelXP,
    progress: state.user.stats.levelProgress,
    hasLeveledUp: state.user.stats.hasLeveledUp,
    levelUpFrom: state.user.stats.levelUpFrom,
    levelUpTo: state.user.stats.levelUpTo
  }));
};

export const useReadingProgress = () => {
  return useAppSelector((state) => state.user.readingProgress);
};

export const useCurrentlyReading = () => {
  return useAppSelector((state) => state.user.readingProgress.currentlyReading);
};

export const useRecentlyRead = () => {
  return useAppSelector((state) => state.user.readingProgress.recentlyRead);
};

export const useUserAchievements = () => {
  return useAppSelector((state) => state.user.achievements);
};

export const useUserBadges = () => {
  return useAppSelector((state) => state.user.achievements.badges);
};

export const useUserStreak = () => {
  return useAppSelector((state) => state.user.achievements.streakData);
};

export const useUserPreferences = () => {
  return useAppSelector((state) => state.user.preferences);
};

export const useFavoriteCategories = () => {
  return useAppSelector((state) => state.user.preferences.favoriteCategories);
};
