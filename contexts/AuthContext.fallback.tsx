import React, { createContext, useContext, useState } from 'react'
import { toast } from 'sonner'

// Simple fallback user type
interface User {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    name?: string
    avatar_url?: string
    picture?: string
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signInWithGoogle = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Show temporary message
      toast.info('Google authentication is being set up. Please check back soon!')
      setTimeout(() => {
        // Demo login for now
        setUser({
          id: 'demo-user',
          email: 'demo@promptshop.ai',
          user_metadata: {
            full_name: 'Demo User',
            name: 'Demo User'
          }
        })
        toast.success('Demo mode activated! Google OAuth coming soon.')
      }, 1500)
    } catch (error: any) {
      setError(error.message || 'Failed to sign in')
      toast.error('Sign in failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('savedPrompts')
    localStorage.removeItem('queryHistory')
    toast.success('Successfully signed out')
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signInWithGoogle,
    signOut,
    error
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}