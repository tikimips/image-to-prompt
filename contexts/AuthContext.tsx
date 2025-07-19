import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';

// Environment variable check with fallbacks
const getEnvVar = (key: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || '';
  }
  // Fallback for build environments
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Create supabase client with error handling
let supabase: any = null;
try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    console.warn('Supabase environment variables not found. Using demo mode.');
    // Create a mock client for demo purposes
    supabase = {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithOAuth: () => Promise.resolve({ error: new Error('Demo mode: Supabase not configured') }),
        signOut: () => Promise.resolve({ error: null })
      }
    };
  }
} catch (error) {
  console.error('Failed to initialize Supabase:', error);
  // Fallback mock client
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithOAuth: () => Promise.resolve({ error: new Error('Supabase initialization failed') }),
      signOut: () => Promise.resolve({ error: null })
    }
  };
}

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    if (supabase && supabase.auth) {
      supabase.auth.getSession().then(({ data: { session } }: any) => {
        setUser(session?.user || null);
        setIsLoading(false);
      }).catch((error: any) => {
        console.error('Error getting session:', error);
        setIsLoading(false);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event: string, session: any) => {
          setUser(session?.user || null);
          setIsLoading(false);
        }
      );

      return () => subscription?.unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    if (!supabase || !supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
    }
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    if (!supabase) {
      return;
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signInWithGoogle,
    signOut
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