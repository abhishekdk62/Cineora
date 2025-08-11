"use client"

import { useAuth } from '@/app/utils/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface RouteGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]     
  excludedRoles?: string[]     
  allowUnauthenticated?: boolean 
}

export default function RouteGuard({ 
  children, 
  allowedRoles,
  excludedRoles,
  allowUnauthenticated = false
}: RouteGuardProps) {
  const { user, loading, isAuthenticated, role } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      
      if (excludedRoles && excludedRoles.length > 0) {
        if (isAuthenticated && role && excludedRoles.includes(role)) {
          setTimeout(() => {
            router.back()
          }, 1500)
          return
        }
        if (!isAuthenticated) {
          return
        }
      }

      if (allowedRoles && allowedRoles.length > 0) {
        if (!isAuthenticated && !allowUnauthenticated) {
          setTimeout(() => {
            router.back()
          }, 1500)
          return
        }
        
        if (isAuthenticated && !allowedRoles.includes(role || '')) {
          setTimeout(() => {
            router.back()
          }, 1500)
          return
        }
      }
    }
  }, [loading, isAuthenticated, role, router, allowedRoles, excludedRoles, allowUnauthenticated])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040404] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Please wait...</p>
        </div>
      </div>
    )
  }

  if (excludedRoles && excludedRoles.length > 0) {
    if (isAuthenticated && role && excludedRoles.includes(role)) {
      return (
        <div className="min-h-screen bg-[#040404] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400">Taking you back...</p>
          </div>
        </div>
      )
    }
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if ((!isAuthenticated && !allowUnauthenticated) || 
        (isAuthenticated && !allowedRoles.includes(role || ''))) {
      return (
        <div className="min-h-screen bg-[#040404] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400">Taking you back...</p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}
