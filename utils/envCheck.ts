// Safe environment variable access
const getEnvVar = (key: string): string => {
  try {
    return import.meta?.env?.[key] || '';
  } catch (error) {
    console.warn(`Failed to access environment variable ${key}:`, error);
    return '';
  }
};

export const checkEnvironmentVariables = () => {
  const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
  const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY');
  
  // Validate that we have proper values (not placeholders)
  const isValidUrl = supabaseUrl && 
    supabaseUrl !== 'your-supabase-project-url' && 
    supabaseUrl.startsWith('https://') &&
    supabaseUrl.length > 10;
    
  const isValidKey = supabaseKey && 
    supabaseKey !== 'your-supabase-anon-key' && 
    supabaseKey.length > 10;

  const isConfigured = isValidUrl && isValidKey;

  return {
    isConfigured,
    supabaseUrl,
    supabaseKey,
    hasValidUrl: isValidUrl,
    hasValidKey: isValidKey,
    missing: !isConfigured ? ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'] : [],
    // Additional debug info
    debug: {
      urlLength: supabaseUrl.length,
      keyLength: supabaseKey.length,
      urlStartsWithHttps: supabaseUrl.startsWith('https://'),
      envAvailable: typeof import.meta !== 'undefined'
    }
  };
};