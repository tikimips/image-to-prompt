#!/usr/bin/env node

/**
 * Open Services Setup Guide
 * Simple script to open the SERVICES_SETUP.md file in your browser or editor
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const setupFilePath = path.join(__dirname, 'SERVICES_SETUP.md');

console.log('🔧 Opening Services Setup Guide...\n');

// Check if the file exists
if (!fs.existsSync(setupFilePath)) {
  console.error('❌ SERVICES_SETUP.md not found!');
  console.log('Make sure you are running this from the project root directory.');
  process.exit(1);
}

// Get file stats
const stats = fs.statSync(setupFilePath);
const fileSizeKB = Math.round(stats.size / 1024);

console.log(`📄 Found SERVICES_SETUP.md (${fileSizeKB} KB)`);
console.log(`📁 Location: ${setupFilePath}`);

// Try to open the file
const platform = process.platform;

let command;
switch (platform) {
  case 'darwin': // macOS
    command = `open "${setupFilePath}"`;
    break;
  case 'win32': // Windows
    command = `start "" "${setupFilePath}"`;
    break;
  default: // Linux and others
    command = `xdg-open "${setupFilePath}"`;
    break;
}

console.log(`\n🚀 Opening with system default application...`);

exec(command, (error) => {
  if (error) {
    console.log('⚠️  Could not open automatically. You can:');
    console.log(`\n1. Open this file manually: ${setupFilePath}`);
    console.log('2. View it in your code editor');
    console.log('3. Read it below:\n');
    
    // Display first few lines as preview
    try {
      const content = fs.readFileSync(setupFilePath, 'utf8');
      const lines = content.split('\n').slice(0, 20);
      console.log('--- PREVIEW ---');
      lines.forEach(line => console.log(line));
      console.log('...\n--- END PREVIEW ---');
      console.log(`\nFull file: ${setupFilePath}`);
    } catch (readError) {
      console.error('Could not read file:', readError.message);
    }
  } else {
    console.log('✅ Setup guide opened successfully!');
    console.log('\nThe guide includes:');
    console.log('• Step-by-step service setup instructions');
    console.log('• Cost breakdowns and signup links');
    console.log('• Integration code examples');
    console.log('• Troubleshooting tips');
  }
});

// Also provide direct instructions
console.log('\n📖 Direct Access Options:');
console.log('1. VS Code: code SERVICES_SETUP.md');
console.log('2. Terminal: cat SERVICES_SETUP.md');
console.log('3. Browser: file://' + setupFilePath);
console.log('4. Any text editor');

console.log('\n🎯 Next Steps After Reading:');
console.log('1. Sign up for required services');
console.log('2. Run: node setup-services.js');
console.log('3. Update your API keys and OAuth credentials');
console.log('4. Deploy your app to get a live URL!');