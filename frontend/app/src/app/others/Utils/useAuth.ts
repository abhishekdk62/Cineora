'use client'

import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../redux/store/index' 
import { logoutUser } from '../redux/slices/authSlice'
import { authStorage } from './authStorage'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>() 
  const { user, role, isAuthenticated, loading } = useSelector((state: RootState) => state.auth)
  
  const logout = async () => {
    await dispatch(logoutUser())
    authStorage.clear()
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
