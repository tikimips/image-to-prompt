import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { UserProfile } from './components/UserProfile';
import { DebugPanel } from './components/DebugPanel';
import { Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';

function MainApp() {
  const { user, isLoading, isAuthenticated, isSupabaseConfigured } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Helper function to get user display name
  const getUserDisplayName = (user: any) => {
    if (!user) return 'User';
    return user.user_metadata?.full_name || 
           user.user_metadata?.name || 
           user.email?.split('@')[0] || 
           'User';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-3 justify-center lg:justify-start mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Prompt Shop
                </h1>
              </div>
            </div>
            <p className="text-slate-600 text-lg">AI-powered image analysis &amp; prompt generation</p>
            {/* Welcome message */}
            {user && (
              <div className="text-sm text-slate-500 mt-2 space-y-1">
                <p className="flex items-center gap-2 justify-center lg:justify-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Welcome back, <span className="font-medium">{getUserDisplayName(user)}</span>!
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <UserProfile />
          </div>
        </div>

        {/* Configuration Status Banner */}
        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-amber-800">Demo Mode Active</span>
            </div>
            <p className="text-sm text-amber-700 mt-1">
              Supabase environment variables are not configured. Some features may be limited.
            </p>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Welcome to Prompt Shop!</h2>
            <p className="text-slate-600 mb-6">
              Your AI-powered image analysis and prompt generation tool is ready to use.
            </p>
            
            {/* System Status */}
            <div className="space-y-3 text-sm mb-8">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-slate-700">Application: Running</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                {isSupabaseConfigured ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-slate-700">Authentication: Configured</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="text-slate-700">Authentication: Demo Mode</span>
                  </>
                )}
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-slate-700">User: {user?.email}</span>
              </div>
            </div>
            
            {/* Next Steps */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-left">
              <h3 className="font-semibold text-slate-800 mb-3">🚀 Ready to get started?</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Upload and analyze images with AI</li>
                <li>• Generate creative prompts automatically</li>
                <li>• Build your personal prompt library</li>
                <li>• Export and share your creations</li>
              </ul>
              
              {!isSupabaseConfigured && (
                <div className="mt-4 p-3 bg-amber-100 rounded border-l-4 border-amber-400">
                  <p className="text-xs text-amber-700">
                    <strong>Note:</strong> Add your Supabase credentials to enable full functionality and data persistence.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Debug Panel - only shows in development and when user is logged in */}
      <DebugPanel />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}