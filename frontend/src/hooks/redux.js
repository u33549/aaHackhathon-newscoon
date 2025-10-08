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

export const useGlobalLoading = () => {
  return useAppSelector((state) => state.ui.globalLoading);
};

export const useToasts = () => {
  return useAppSelector((state) => state.ui.notifications.toasts);
};

export const useModals = () => {
  return useAppSelector((state) => state.ui.modals);
};

export const useTheme = () => {
  return useAppSelector((state) => state.ui.theme);
};

export const useSearchQuery = () => {
  return useAppSelector((state) => state.ui.searchQuery);
};

export const useActiveCategory = () => {
  return useAppSelector((state) => state.ui.activeCategory);
};

// New selectors
export const useAllNews = () => {
  return useAppSelector((state) => state.news.allNews);
};

export const useAllStacks = () => {
  return useAppSelector((state) => state.stacks.allStacks);
};

export const useIsDarkMode = () => {
  return useAppSelector((state) => state.ui.isDarkMode);
};

export const useCurrentUser = () => {
  return useAppSelector((state) => state.auth.currentUser);
};

export const useAuthError = () => {
  return useAppSelector((state) => state.auth.error);
};

export const useAuthLoading = () => {
  return useAppSelector((state) => state.auth.loading);
};
