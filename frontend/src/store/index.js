import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './slices/newsSlice';
import stackReducer from './slices/stackSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    news: newsReducer,
    stacks: stackReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Redux tiplerini doğru şekilde export et
export const RootState = () => store.getState();
export const AppDispatch = () => store.dispatch;
