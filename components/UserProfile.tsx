import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Settings } from 'lucide-react';

export function UserProfile() {
  const { user, signOut, isSupabaseConfigured } = useAuth();

  if (!user) return null;

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.user_metadata?.full_name || 
           user.user_metadata?.name || 
           user.email?.split('@')[0] || 
           'User';
  };

  const getUserAvatar = () => {
    return user.user_metadata?.avatar_url || user.user_metadata?.picture;
  };

  return (
    <div className="flex items-center gap-3">
      {/* User Info */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl">
        <div className="relative">
          {getUserAvatar() ? (
            <img
              src={getUserAvatar()}
              alt="Profile"
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          )}
          {!isSupabaseConfigured && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border border-white" />
          )}
        </div>
        
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-slate-700">
            {getUserDisplayName()}
          </p>
          <p className="text-xs text-slate-500">
            {isSupabaseConfigured ? user.email : 'Demo Mode'}
          </p>
        </div>
      </div>

      {/* Settings & Sign Out */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            // TODO: Open settings modal
            console.log('Settings clicked');
          }}
          className="p-2 text-slate-600 hover:text-slate-800 hover:bg-white/80 rounded-lg transition-colors"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>
        
        <button
          onClick={signOut}
          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Sign Out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}