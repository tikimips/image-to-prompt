import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '../services/auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check for existing authentication on app load
    const initializeAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const user = await authService.signInWithGoogle();
      setUser(user);
      toast.success(`Welcome, ${user.name}!`);
    } catch (error) {
      console.error('Google sign-in failed:', error);
      toast.error('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithApple = async () => {
    try {
      setIsLoading(true);
      const user = await authService.signInWithApple();
      setUser(user);
      toast.success(`Welcome, ${user.name}!`);
    } catch (error) {
      console.error('Apple sign-in failed:', error);
      toast.error('Failed to sign in with Apple. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await authService.signOut();
      setUser(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out failed:', error);
      toast.error('Failed to sign out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    signInWithGoogle,
    signInWithApple,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}