// hooks/useAuth.ts
"use client"

import { useState, useEffect } from 'react'
import { getCurrentUser, logout as logoutService } from '../../app/others/services/authServices/authService' 
import { useRouter } from 'next/navigation'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUser = async () => {
    try {
      setLoading(true)
      const userData = await getCurrentUser()
      console.log(userData);
      
      setUser(userData)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const logout = async () => {
    try {
      const success = await logoutService()
      if (success) {
        setUser(null)
        router.push('/login')
        window.location.reload() 
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const requireRole = (allowedRoles: string[]) => {
    if (loading) return { authorized: false, loading: true }
    if (!user) return { authorized: false, loading: false, redirect: '/login' }
    if (!allowedRoles.includes(user.role)) {
      return { authorized: false, loading: false, redirect: '/unauthorized' }
    }
    return { authorized: true, loading: false }
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    role: user?.role || null,
    logout,
    refetch: fetchUser,
    requireRole 
  }
}
