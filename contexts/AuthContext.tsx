import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

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

  // Safe environment variable access
  const getEnvVar = (key: string): string => {
    try {
      return (import.meta.env && import.meta.env[key]) || '';
    } catch {
      return '';
    }
  };

  // Check if Supabase is configured
  const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
  const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');
  
  const isSupabaseConfigured = !!(
    supabaseUrl && 
    supabaseAnonKey &&
    supabaseUrl !== 'your_supabase_project_url' &&
    supabaseAnonKey !== 'your_supabase_anon_key'
  );

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Demo mode - create a mock user
      setUser({
        id: 'demo-user-id',
        email: 'demo@example.com',
        user_metadata: { full_name: 'Demo User' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      } as User);
      setIsLoading(false);
      return;
    }

    if (!supabase) {
      setError('Supabase client initialization failed');
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error);
        setError(`Session error: ${error.message}`);
      } else {
        setUser(session?.user ?? null);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        if (event === 'SIGNED_OUT') {
          setError(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [isSupabaseConfigured]);

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      setError('Supabase not configured - using demo mode');
      return;
    }

    if (!supabase) {
      setError('Supabase client not available');
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) {
        setError(`Google sign-in error: ${error.message}`);
      }
    } catch (err) {
      setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      return;
    }

    if (!supabase) {
      setError('Supabase client not available');
      return;
    }

    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(`Sign out error: ${error.message}`);
      }
    } catch (err) {
      setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isSupabaseConfigured,
    signInWithGoogle,
    signOut,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}