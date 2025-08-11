// hooks/useAuth.ts
'use client'

import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../others/redux/store/index' 
import { logoutUser } from '../others/redux/slices/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>() 
  const { user, role, isAuthenticated, loading } = useSelector((state: RootState) => state.auth)
  
  const logout = async () => {
    await dispatch(logoutUser()) 
    localStorage.removeItem('role')
    window.location.href = '/login'
  }
  
  return { 
    user,
    role,
    loading,
    isAuthenticated,
    logout
  }
}
