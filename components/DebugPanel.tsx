import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bug, ChevronDown, ChevronUp } from 'lucide-react';

export function DebugPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, isSupabaseConfigured, error } = useAuth();

  // Safe environment variable access
  const getEnvVar = (key: string): string => {
    try {
      return (import.meta.env && import.meta.env[key]) || '';
    } catch {
      return '';
    }
  };

  // Only show in development or when there are errors
  const isDev = getEnvVar('DEV') === 'true' || getEnvVar('NODE_ENV') === 'development';
  if (!isDev && !error) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-slate-800 text-white rounded-lg shadow-xl border border-slate-700 overflow-hidden">
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center gap-2 px-4 py-3 hover:bg-slate-700 transition-colors"
        >
          <Bug className="h-4 w-4" />
          <span className="text-sm font-medium">Debug Info</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 ml-auto" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-auto" />
          )}
        </button>

        {/* Debug Content */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-slate-700">
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 pt-3">
                <div>
                  <span className="text-slate-400">Environment:</span>
                  <div className="text-green-400">{isDev ? 'Development' : 'Production'}</div>
                </div>
                <div>
                  <span className="text-slate-400">Supabase:</span>
                  <div className={isSupabaseConfigured ? 'text-green-400' : 'text-amber-400'}>
                    {isSupabaseConfigured ? 'Configured' : 'Demo Mode'}
                  </div>
                </div>
              </div>
              
              {user && (
                <div className="pt-2 border-t border-slate-700">
                  <span className="text-slate-400">User ID:</span>
                  <div className="text-blue-400 break-all">{user.id}</div>
                  <span className="text-slate-400">Email:</span>
                  <div className="text-blue-400">{user.email}</div>
                </div>
              )}

              {error && (
                <div className="pt-2 border-t border-slate-700">
                  <span className="text-red-400">Error:</span>
                  <div className="text-red-300 break-words">{error}</div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-700">
                <span className="text-slate-400">Env Vars:</span>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>SUPABASE_URL:</span>
                    <span className={getEnvVar('VITE_SUPABASE_URL') ? 'text-green-400' : 'text-red-400'}>
                      {getEnvVar('VITE_SUPABASE_URL') ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>SUPABASE_ANON_KEY:</span>
                    <span className={getEnvVar('VITE_SUPABASE_ANON_KEY') ? 'text-green-400' : 'text-red-400'}>
                      {getEnvVar('VITE_SUPABASE_ANON_KEY') ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex justify-between">
<span>{'import.meta.env:'}</span>
                    <span className={getEnvVar('VITE_SUPABASE_URL') || getEnvVar('VITE_SUPABASE_ANON_KEY') ? 'text-green-400' : 'text-red-400'}>
                      {getEnvVar('VITE_SUPABASE_URL') || getEnvVar('VITE_SUPABASE_ANON_KEY') ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
