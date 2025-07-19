#!/usr/bin/env node

/**
 * Services Setup Assistant
 * Interactive script to help configure external services
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function updateAuthService(googleClientId, appleClientId) {
  const authPath = path.join(__dirname, 'services', 'auth.ts');
  let content = fs.readFileSync(authPath, 'utf8');
  
  if (googleClientId) {
    content = content.replace(
      'private readonly GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE";',
      `private readonly GOOGLE_CLIENT_ID = "${googleClientId}";`
    );
  }
  
  if (appleClientId) {
    content = content.replace(
      'private readonly APPLE_CLIENT_ID = "YOUR_APPLE_CLIENT_ID_HERE";',
      `private readonly APPLE_CLIENT_ID = "${appleClientId}";`
    );
  }
  
  fs.writeFileSync(authPath, content);
}

function updateOpenAIService(apiKey) {
  const openaiPath = path.join(__dirname, 'services', 'openai.ts');
  let content = fs.readFileSync(openaiPath, 'utf8');
  
  // Find the line with the API key and replace it
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const OPENAI_API_KEY = ')) {
      lines[i] = `const OPENAI_API_KEY = "${apiKey}";`;
      break;
    }
  }
  
  content = lines.join('\n');
  fs.writeFileSync(openaiPath, content);
}

function createEnvFile(config) {
  const envContent = `# Environment Variables for Image to Prompt App
# Add these to your deployment platform (Vercel, Netlify, etc.)

# OpenAI API Key
VITE_OPENAI_API_KEY=${config.openaiKey || 'your-openai-api-key-here'}

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=${config.googleClientId || 'your-google-client-id-here'}

# Apple Sign-In Client ID
VITE_APPLE_CLIENT_ID=${config.appleClientId || 'your-apple-client-id-here'}

# Optional: Custom domain for OAuth redirects
VITE_DOMAIN=${config.domain || 'https://your-domain.com'}
`;

  fs.writeFileSync('.env.local', envContent);
}

async function main() {
  console.log('🚀 Image to Prompt - Services Setup Assistant');
  console.log('==============================================\n');

  const config = {};

  // OpenAI API Key
  console.log('1. OpenAI API Configuration');
  console.log('   Visit: https://platform.openai.com/api-keys');
  const openaiKey = await question('   Enter your OpenAI API key (or press Enter to skip): ');
  if (openaiKey.trim()) {
    config.openaiKey = openaiKey.trim();
    updateOpenAIService(openaiKey.trim());
    console.log('   ✅ OpenAI API key configured\n');
  } else {
    console.log('   ⏭️  Skipped OpenAI configuration\n');
  }

  // Google OAuth
  console.log('2. Google OAuth Configuration');
  console.log('   Visit: https://console.cloud.google.com/');
  const googleClientId = await question('   Enter your Google OAuth Client ID (or press Enter to skip): ');
  if (googleClientId.trim()) {
    config.googleClientId = googleClientId.trim();
    console.log('   ✅ Google OAuth configured\n');
  } else {
    console.log('   ⏭️  Skipped Google OAuth configuration\n');
  }

  // Apple Sign-In
  console.log('3. Apple Sign-In Configuration');
  console.log('   Visit: https://developer.apple.com/');
  const appleClientId = await question('   Enter your Apple Service ID (or press Enter to skip): ');
  if (appleClientId.trim()) {
    config.appleClientId = appleClientId.trim();
    console.log('   ✅ Apple Sign-In configured\n');
  } else {
    console.log('   ⏭️  Skipped Apple Sign-In configuration\n');
  }

  // Update auth service if we have OAuth credentials
  if (config.googleClientId || config.appleClientId) {
    updateAuthService(config.googleClientId, config.appleClientId);
  }

  // Domain configuration
  console.log('4. Domain Configuration (Optional)');
  const domain = await question('   Enter your custom domain (e.g., https://your-app.com) or press Enter to skip: ');
  if (domain.trim()) {
    config.domain = domain.trim();
    console.log('   ✅ Domain configured\n');
  } else {
    console.log('   ⏭️  Using default domain\n');
  }

  // Create environment file
  createEnvFile(config);

  console.log('🎉 Setup Complete!');
  console.log('==================\n');

  console.log('Configuration Summary:');
  console.log(`• OpenAI API: ${config.openaiKey ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`• Google OAuth: ${config.googleClientId ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`• Apple Sign-In: ${config.appleClientId ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`• Custom Domain: ${config.domain ? '✅ Configured' : '❌ Not configured'}`);

  console.log('\nNext Steps:');
  console.log('1. Run: npm install');
  console.log('2. Run: npm run build');
  console.log('3. Deploy to Vercel, Netlify, or your preferred platform');
  console.log('\nFor detailed setup instructions, see SERVICES_SETUP.md');

  rl.close();
}

main().catch(console.error);