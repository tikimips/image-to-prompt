import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { UserProfile } from './components/UserProfile';
import { Sparkles } from 'lucide-react';

function MainApp() {
  const { user, isLoading, isAuthenticated } = useAuth();

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

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Welcome to Prompt Shop!</h2>
            <p className="text-slate-600 mb-6">
              Your AI-powered image analysis and prompt generation tool is loading...
            </p>
            
            {/* Basic status */}
            <div className="space-y-2 text-sm text-slate-500">
              <p>✅ Authentication: Working</p>
              <p>✅ User Login: {user?.email}</p>
              <p>🔧 Main Features: Loading...</p>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Debug Mode:</strong> This is a minimal version to test loading. 
                If you see this, the basic app structure is working!
              </p>
            </div>
          </div>
        </div>
      </div>
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