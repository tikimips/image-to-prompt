export const checkEnvironmentVariables = () => {
  const checks = {
    supabaseUrl: {
      value: import.meta.env.VITE_SUPABASE_URL,
      present: !!import.meta.env.VITE_SUPABASE_URL,
      valid: !!import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL.startsWith('https://')
    },
    supabaseAnonKey: {
      value: import.meta.env.VITE_SUPABASE_ANON_KEY,
      present: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      valid: !!import.meta.env.VITE_SUPABASE_ANON_KEY && import.meta.env.VITE_SUPABASE_ANON_KEY.length > 50
    },
    openaiApiKey: {
      value: import.meta.env.VITE_OPENAI_API_KEY,
      present: !!import.meta.env.VITE_OPENAI_API_KEY,
      valid: !!import.meta.env.VITE_OPENAI_API_KEY && import.meta.env.VITE_OPENAI_API_KEY.startsWith('sk-')
    }
  };

  return checks;
};

export const logEnvironmentStatus = () => {
  const checks = checkEnvironmentVariables();
  
  console.log('🔧 Environment Variables Status:');
  console.log('================================');
  
  Object.entries(checks).forEach(([key, check]) => {
    const status = check.present ? (check.valid ? '✅' : '⚠️') : '❌';
    const message = check.present ? (check.valid ? 'Valid' : 'Invalid format') : 'Missing';
    
    console.log(`${status} ${key}: ${message}`);
    
    // Show partial value for debugging (only first/last few characters)
    if (check.present && check.value) {
      const maskedValue = key === 'supabaseUrl' 
        ? check.value 
        : `${check.value.substring(0, 8)}...${check.value.substring(check.value.length - 4)}`;
      console.log(`   Value: ${maskedValue}`);
    }
  });
  
  console.log('================================');
  
  return checks;
};

// Auto-run environment check in development
if (import.meta.env.DEV) {
  logEnvironmentStatus();
}