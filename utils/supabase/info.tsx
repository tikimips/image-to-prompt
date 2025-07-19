// Safe environment variable access
const getEnvVar = (key: string): string => {
  try {
    return import.meta?.env?.[key] || '';
  } catch (error) {
    console.warn(`Failed to access environment variable ${key}:`, error);
    return '';
  }
};

// Supabase project information with safe access
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');

export const projectId = supabaseUrl
  ? supabaseUrl.split('//')[1]?.split('.')[0] || ''
  : '';

export const publicAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Export for debugging
export const supabaseInfo = {
  url: supabaseUrl,
  projectId,
  publicAnonKey,
  isConfigured: !!(supabaseUrl && publicAnonKey)
};