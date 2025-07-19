import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Settings } from 'lucide-react';

export function UserProfile() {
  const { user, signOut, isSupabaseConfigured } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.user_metadata?.full_name || 
           user.user_metadata?.name || 
           user.email?.split('@')[0] || 
           'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex items-center gap-3">
      {/* User Avatar */}
      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
        {user?.user_metadata?.avatar_url ? (
          <img 
            src={user.user_metadata.avatar_url} 
            alt={getUserDisplayName()}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span>{getUserInitials()}</span>
        )}
      </div>

      {/* User Info */}
      <div className="hidden sm:block text-right">
        <p className="text-sm font-medium text-slate-800">
          {getUserDisplayName()}
        </p>
        <p className="text-xs text-slate-500">
          {user?.email}
        </p>
      </div>

      {/* Dropdown Menu */}
      <div className="relative group">
        <button className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
        </button>
        
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
          <div className="p-2">
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-sm font-medium text-slate-800">{getUserDisplayName()}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
              {!isSupabaseConfigured && (
                <span className="inline-block text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded mt-1">
                  Demo Mode
                </span>
              )}
            </div>
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}