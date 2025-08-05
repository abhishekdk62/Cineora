'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '../hooks/redux';
import { loadUserFromStorage } from '../slices/authSlice';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    if (token && user && role) {
      dispatch(loadUserFromStorage({
        user: JSON.parse(user),
        token,
        role: role as 'user' | 'admin'
      }));
    }
  }, [dispatch]);

  return <>{children}</>;
}
