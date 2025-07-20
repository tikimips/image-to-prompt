import { createClient } from '@supabase/supabase-js';

// Safe environment variable access with proper fallbacks
const getEnvVar = (key: string): string => {
  try {
    return (import.meta.env && import.meta.env[key]) || '';
  } catch {
    return '';
  }
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Create Supabase client only if both URL and key are provided
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey &&
  supabaseUrl !== 'your_supabase_project_url' &&
  supabaseAnonKey !== 'your_supabase_anon_key'
);

// Export environment values for debugging
export const envConfig = {
  supabaseUrl,
  supabaseAnonKey,
  isConfigured: isSupabaseConfigured
};