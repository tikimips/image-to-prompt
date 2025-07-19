import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { checkEnvironmentVariables } from '../utils/envCheck';
import { supabaseConfig } from '../services/supabase';
import { Bug, ChevronDown, ChevronUp, AlertTriangle, CheckCircle } from 'lucide-react';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isSupabaseConfigured } = useAuth();
  const envCheck = checkEnvironmentVariables();

  // Only show in development or when there are issues
  const shouldShow = import.meta?.env?.DEV || !isSupabaseConfigured;

  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden max-w-sm">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 flex items-center gap-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Bug className="w-4 h-4" />
          Debug Info
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {isOpen && (
          <div className="border-t border-slate-200 p-4 space-y-4">
            {/* Environment Status */}
            <div>
              <h4 className="text-xs font-medium text-slate-800 mb-2">Environment Status</h4>
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  {envCheck.debug.envAvailable ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                  )}
                  <span>import.meta.env: {envCheck.debug.envAvailable ? 'Available' : 'Not Available'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {envCheck.isConfigured ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                  )}
                  <span>Mode: {envCheck.isConfigured ? 'Production' : 'Demo'}</span>
                </div>
              </div>
            </div>

            {/* Supabase Configuration */}
            <div>
              <h4 className="text-xs font-medium text-slate-800 mb-2">Supabase Configuration</h4>
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  {supabaseConfig.hasValidUrl ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                  )}
                  <span>URL: {supabaseConfig.hasValidUrl ? 'Valid' : 'Invalid/Missing'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {supabaseConfig.hasValidKey ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                  )}
                  <span>Key: {supabaseConfig.hasValidKey ? 'Valid' : 'Invalid/Missing'}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  URL Length: {envCheck.debug.urlLength} | Key Length: {envCheck.debug.keyLength}
                </div>
              </div>
            </div>
            
            {/* Missing Variables */}
            {!envCheck.isConfigured && envCheck.missing.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-slate-800 mb-1">Missing Variables</h4>
                <div className="text-xs text-red-600 space-y-1">
                  {envCheck.missing.map(key => (
                    <div key={key} className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {key}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* User Status */}
            <div>
              <h4 className="text-xs font-medium text-slate-800 mb-1">User Status</h4>
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  {user ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                  )}
                  <span>Authenticated: {user ? 'Yes' : 'No'}</span>
                </div>
                {user && (
                  <>
                    <div className="text-slate-600">
                      <span className="font-medium">Email:</span> {user.email}
                    </div>
                    <div className="text-slate-600">
                      <span className="font-medium">User ID:</span> 
                      <span className="font-mono text-xs break-all">{user.id}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Fix Suggestions */}
            {!envCheck.isConfigured && (
              <div className="p-2 bg-blue-50 rounded border">
                <h4 className="text-xs font-medium text-blue-800 mb-1">Quick Fix</h4>
                <p className="text-xs text-blue-700">
                  Copy .env.example to .env and add your Supabase credentials to enable full functionality.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}