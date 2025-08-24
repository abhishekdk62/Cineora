"use client"

import { useAuth } from '@/app/utils/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!loading && redirectOnAuth && mounted) {
      // Your existing redirect logic here
      if (allowedRoles && allowedRoles.length > 0) {
        if (!isAuthenticated && !allowUnauthenticated) {
          setTimeout(() => {
            router.replace('/login')
          }, 1500)
          return
        }
        
        if (isAuthenticated && role && !allowedRoles.includes(role)) {
          const redirectPath = getRoleBasedPath(role)
          setTimeout(() => {
            router.replace(redirectPath)
          }, 1500)
          return
        }
        
        return
      }
      
      if (excludedRoles && excludedRoles.length > 0) {
        if (isAuthenticated && role && excludedRoles.includes(role)) {
          const redirectPath = getRoleBasedPath(role)
          setTimeout(() => {
            router.replace(redirectPath)
          }, 1500)
          return
        }
      }
    }
  }, [loading, isAuthenticated, role, router, excludedRoles, allowedRoles, allowUnauthenticated, redirectOnAuth, mounted])

  const getRoleBasedPath = (userRole: string) => {
    const path = (() => {
      switch (userRole) {
        case 'admin': return '/admin/dashboard'
        case 'owner': return '/owner/dashboard'  
        case 'user': return '/'
        default: return '/'
      }
    })()
    
    return path
  }

  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040404] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Please wait...</p>
        </div>
      </div>
    )
  }

  // Rest of your existing logic...
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
    
    return <>{children}</>
  }

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

  return <>{children}</>
}
