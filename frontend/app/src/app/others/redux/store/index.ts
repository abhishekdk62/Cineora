import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../slices/authSlice';
import userSlice from '../slices/userSlice';
import adminSlice from '../slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    admin: adminSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
