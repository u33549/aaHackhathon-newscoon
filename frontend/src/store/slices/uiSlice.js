import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Theme ve görünüm ayarları
  theme: 'light',
  sidebarOpen: false,

  // Modal durumları
  modals: {
    badgeModal: {
      open: false,
      data: null,
    },
    confirmDialog: {
      open: false,
      title: '',
      message: '',
      onConfirm: null,
    },
  },

  // Notification durumları
  notifications: {
    toasts: [],
    achievements: [],
  },

  // Celebration queue - yeni eklendi
  celebrations: {
    queue: [], // Kutlama kuyruğu
    isShowing: false, // Şu anda bir kutlama gösteriliyor mu?
  },

  // Loading durumları
  globalLoading: false,

  // Sayfa meta bilgileri
  pageTitle: 'Newscoon',
  breadcrumbs: [],

  // Arama ve filtre durumları
  searchQuery: '',
  activeCategory: '',

  // Layout ayarları
  layout: {
    headerHeight: 64,
    footerHeight: 200,
    containerMaxWidth: 'lg',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme işlemleri
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },

    // Sidebar işlemleri
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    // Modal işlemleri
    openBadgeModal: (state, action) => {
      state.modals.badgeModal.open = true;
      state.modals.badgeModal.data = action.payload;
    },
    closeBadgeModal: (state) => {
      state.modals.badgeModal.open = false;
      state.modals.badgeModal.data = null;
    },

    openConfirmDialog: (state, action) => {
      state.modals.confirmDialog = {
        open: true,
        ...action.payload,
      };
    },
    closeConfirmDialog: (state) => {
      state.modals.confirmDialog = {
        open: false,
        title: '',
        message: '',
        onConfirm: null,
      };
    },

    // Notification işlemleri
    addToast: (state, action) => {
      const toast = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.notifications.toasts.push(toast);
    },
    removeToast: (state, action) => {
      state.notifications.toasts = state.notifications.toasts.filter(
        toast => toast.id !== action.payload
      );
    },
    clearToasts: (state) => {
      state.notifications.toasts = [];
    },

    addAchievement: (state, action) => {
      const achievement = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.notifications.achievements.push(achievement);
    },
    removeAchievement: (state, action) => {
      state.notifications.achievements = state.notifications.achievements.filter(
        achievement => achievement.id !== action.payload
      );
    },

    // Celebration queue işlemleri
    addCelebrationToQueue: (state, action) => {
      state.celebrations.queue.push(action.payload);
    },
    removeCelebrationFromQueue: (state) => {
      state.celebrations.queue.shift();
    },
    clearCelebrationQueue: (state) => {
      state.celebrations.queue = [];
    },
    setCelebrationIsShowing: (state, action) => {
      state.celebrations.isShowing = action.payload;
    },

    // Global loading
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },

    // Sayfa meta bilgileri
    setPageTitle: (state, action) => {
      state.pageTitle = action.payload;
    },
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },

    // Arama ve filtre
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
    clearSearchAndFilters: (state) => {
      state.searchQuery = '';
      state.activeCategory = '';
    },

    // Layout ayarları
    setLayoutConfig: (state, action) => {
      state.layout = { ...state.layout, ...action.payload };
    },

    // Genel reset
    resetUI: (state) => {
      return { ...initialState, theme: state.theme };
    },
  },
});

export const {
  // Theme
  setTheme,
  toggleTheme,

  // Sidebar
  setSidebarOpen,
  toggleSidebar,

  // Modals
  openBadgeModal,
  closeBadgeModal,
  openConfirmDialog,
  closeConfirmDialog,

  // Notifications
  addToast,
  removeToast,
  clearToasts,
  addAchievement,
  removeAchievement,

  // Celebration queue
  addCelebrationToQueue,
  removeCelebrationFromQueue,
  clearCelebrationQueue,
  setCelebrationIsShowing,

  // Loading
  setGlobalLoading,

  // Page meta
  setPageTitle,
  setBreadcrumbs,

  // Search & Filter
  setSearchQuery,
  setActiveCategory,
  clearSearchAndFilters,

  // Layout
  setLayoutConfig,

  // Reset
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
