import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth';
import { checkEnvironmentVariables } from '../utils/envCheck';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSupabaseConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { isConfigured: isSupabaseConfigured } = checkEnvironmentVariables();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        if (!isSupabaseConfigured) {
          // Demo mode - create a mock user
          setUser({
            id: 'demo-user',
            email: 'demo@promptshop.ai',
            user_metadata: { full_name: 'Demo User' }
          } as User);
          setIsLoading(false);
          return;
        }

        const { session, error } = await authService.getSession();
        if (error) {
          console.error('Session error:', error);
          setError(error.message);
        } else {
          setUser(session?.user ?? null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err instanceof Error ? err.message : 'Authentication initialization failed');
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Listen for auth changes (only if Supabase is configured)
    if (isSupabaseConfigured) {
      const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
        if (event === 'SIGNED_OUT') {
          setError(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [isSupabaseConfigured]);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      if (!isSupabaseConfigured) {
        throw new Error('Supabase not configured. Cannot sign in.');
      }

      await authService.signInWithGoogle();
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      
      if (!isSupabaseConfigured) {
        // Demo mode logout
        setUser(null);
        return;
      }

      await authService.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err instanceof Error ? err.message : 'Sign out failed');
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isSupabaseConfigured,
    signInWithGoogle,
    signOut,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}