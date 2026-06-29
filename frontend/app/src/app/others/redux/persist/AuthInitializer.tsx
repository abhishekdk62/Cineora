'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '../hooks/redux';
import { clearUser, loadUserFromStorage } from '../slices/authSlice';
import { authStorage } from '../../Utils/authStorage';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const accessToken = authStorage.getAccessToken();

    if (!accessToken) {
      const persistedAuth = localStorage.getItem('persist:auth');
      if (persistedAuth) {
        try {
          const parsed = JSON.parse(persistedAuth);
          if (parsed?.isAuthenticated) {
            dispatch(clearUser());
          }
        } catch {
          authStorage.clear();
        }
      }
      return;
    }

    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');

    if (user && role) {
      dispatch(
        loadUserFromStorage({
          user: JSON.parse(user),
          token: accessToken,
          role: role as 'user' | 'admin' | 'owner',
        })
      );
    }
  }, [dispatch]);

  return <>{children}</>;
}
