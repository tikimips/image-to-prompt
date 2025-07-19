import { createClient } from '@supabase/supabase-js';

// Safe environment variable access with fallbacks
const getEnvVar = (key: string): string => {
  try {
    return import.meta?.env?.[key] || '';
  } catch (error) {
    console.warn(`Failed to access environment variable ${key}:`, error);
    return '';
  }
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Validate that we have proper Supabase credentials (not placeholder values)
const isValidUrl = supabaseUrl && 
  supabaseUrl !== 'your-supabase-project-url' && 
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.length > 20;

const isValidKey = supabaseKey && 
  supabaseKey !== 'your-supabase-anon-key' && 
  supabaseKey.length > 20;

// Create Supabase client only if properly configured
export const supabase = (isValidUrl && isValidKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const isSupabaseConfigured = !!supabase;

// Export safe environment values for debugging
export const supabaseConfig = {
  url: supabaseUrl,
  hasValidUrl: isValidUrl,
  hasValidKey: isValidKey,
  isConfigured: isSupabaseConfigured
};