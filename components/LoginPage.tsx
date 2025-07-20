import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, LogIn, AlertCircle, Loader2 } from 'lucide-react';

export function LoginPage() {
  const { signInWithGoogle, isLoading, error, isSupabaseConfigured } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Prompt Shop
            </h1>
            <p className="text-slate-600">AI-powered image analysis &amp; prompt generation</p>
          </div>

          {/* Login Options */}
          <div className="space-y-4">
            {isSupabaseConfigured ? (
              <button
                onClick={signInWithGoogle}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
            ) : (
              <div className="text-center space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <AlertCircle className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-blue-800 mb-2">Demo Mode Active</h3>
                  <p className="text-sm text-blue-700">
                    Supabase credentials not configured. You can explore the app in demo mode.
                  </p>
                </div>
                
                <button
                  onClick={signInWithGoogle}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                >
                  <LogIn className="h-5 w-5" />
                  Enter Demo Mode
                </button>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-500">
              Transform images into creative prompts with AI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}