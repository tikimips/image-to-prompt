import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

// Define a basic User type that doesn't depend on Supabase
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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize Supabase client safely
  const initializeSupabase = async () => {
    try {
      const { supabase } = await import('../utils/supabase')
      return supabase
    } catch (error) {
      console.error('Failed to initialize Supabase:', error)
      setError('Authentication service unavailable')
      setIsLoading(false)
      return null
    }
  }

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const supabase = await initializeSupabase()
      if (!supabase) {
        setIsLoading(false)
        return
      }

      // Check if user is already logged in
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session error:', sessionError)
        setError('Failed to check authentication status')
        setIsLoading(false)
        return
      }

      if (session?.user) {
        setUser(session.user)
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email)
          
          if (session?.user) {
            setUser(session.user)
            setError(null)
            if (event === 'SIGNED_IN') {
              toast.success(`Welcome back, ${session.user.user_metadata?.full_name || session.user.email}!`)
            }
          } else {
            setUser(null)
            if (event === 'SIGNED_OUT') {
              toast.success('Successfully signed out')
            }
          }
          setIsLoading(false)
        }
      )

      // Clean up subscription on unmount
      return () => subscription?.unsubscribe()
      
    } catch (error) {
      console.error('Auth initialization error:', error)
      setError('Authentication initialization failed')
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const supabase = await initializeSupabase()
      if (!supabase) {
        throw new Error('Authentication service unavailable')
      }

      console.log('Initiating Google sign in...')
      
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (signInError) {
        console.error('Google sign in error:', signInError)
        throw signInError
      }

      console.log('Google sign in initiated successfully')
      
    } catch (error: any) {
      console.error('Sign in error:', error)
      
      // Provide helpful error messages
      if (error.message?.includes('provider is not enabled')) {
        setError('Google authentication is not yet configured. Please contact support.')
        toast.error('Google login is being set up. Please try again shortly!')
      } else {
        setError(error.message || 'Failed to sign in with Google')
        toast.error('Sign in failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const supabase = await initializeSupabase()
      if (!supabase) {
        throw new Error('Authentication service unavailable')
      }
      
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) {
        console.error('Sign out error:', signOutError)
        throw signOutError
      }
      
      // Clear local storage data when signing out
      localStorage.removeItem('savedPrompts')
      localStorage.removeItem('queryHistory')
      
      console.log('Successfully signed out')
      
    } catch (error: any) {
      console.error('Sign out error:', error)
      setError(error.message || 'Failed to sign out')
      toast.error('Sign out failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
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