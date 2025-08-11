// components/RouteGuard.tsx
"use client"

import { useAuth } from '@/app/utils/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface RouteGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
  excludedRoles?: string[]
  allowUnauthenticated?: boolean
  redirectOnAuth?: boolean
}

export default function RouteGuard({ 
  children, 
  allowedRoles,
  excludedRoles,
  allowUnauthenticated = false,
  redirectOnAuth = true
}: RouteGuardProps) {
  const { role, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && redirectOnAuth) {
      
      if (excludedRoles && excludedRoles.length > 0) {
        if (isAuthenticated && role && excludedRoles.includes(role)) {
          console.log('User should be redirected - excluded role')
          setTimeout(() => {
            const redirectPath = getRoleBasedPath(role)
            router.replace(redirectPath)
          }, 1500)
          return
        }
      }

      if (allowedRoles && allowedRoles.length > 0) {
        console.log('Checking allowed roles:', { isAuthenticated, role, allowedRoles, allowUnauthenticated })
        
        if (!isAuthenticated && !allowUnauthenticated) {
          console.log('User not authenticated - redirecting to login')
          setTimeout(() => {
            router.replace('/login')
          }, 1500)
          return
        }
        
        // Redirect if authenticated but role not allowed
        if (isAuthenticated && role && !allowedRoles.includes(role)) {
          console.log('User role not allowed - redirecting')
          setTimeout(() => {
            const redirectPath = getRoleBasedPath(role)
            router.replace(redirectPath)
          }, 1500)
          return
        }
      }
    }
  }, [loading, isAuthenticated, role, router, excludedRoles, allowedRoles, allowUnauthenticated, redirectOnAuth])

  const getRoleBasedPath = (userRole: string) => {
    switch (userRole) {
      case 'admin': return '/admin/dashboard'
      case 'owner': return '/owner/dashboard'  
      case 'user': return '/'
      default: return '/'
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#040404] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Please wait...</p>
        </div>
      </div>
    )
  }

  // Handle excluded roles UI
  if (excludedRoles && excludedRoles.length > 0) {
    if (isAuthenticated && role && excludedRoles.includes(role)) {
      if (redirectOnAuth) {
        return (
          <div className="min-h-screen bg-[#040404] flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400">Taking you back...</p>
            </div>
          </div>
        )
      } else {
        return (
          <div className="min-h-screen bg-[#040404] flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400">Access Denied</p>
              <p className="text-gray-500 text-sm mt-2">You're already logged in</p>
              <button 
                onClick={() => router.replace(getRoleBasedPath(role))}
                className="mt-4 bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )
      }
    }
  }

  // Handle allowed roles UI
  if (allowedRoles && allowedRoles.length > 0) {
    if ((!isAuthenticated && !allowUnauthenticated) || 
        (isAuthenticated && role && !allowedRoles.includes(role))) {
      if (redirectOnAuth) {
        return (
          <div className="min-h-screen bg-[#040404] flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400">Taking you back...</p>
            </div>
          </div>
        )
      } else {
        return (
          <div className="min-h-screen bg-[#040404] flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400">Access Denied</p>
              <p className="text-gray-500 text-sm mt-2">You don't have permission to view this page</p>
              {!isAuthenticated ? (
                <button 
                  onClick={() => router.replace('/login')}
                  className="mt-4 bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
                >
                  Login
                </button>
              ) : (
                <button 
                  onClick={() => router.replace(getRoleBasedPath(role!))}
                  className="mt-4 bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
                >
                  Go to Dashboard
                </button>
              )}
            </div>
          </div>
        )
      }
    }
  }

  return <>{children}</>
}
