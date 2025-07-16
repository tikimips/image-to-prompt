const fs = require('fs');
const path = require('path');

// List of files to keep (essential project files)
const keepFiles = [
  'README.md',
  'GOOGLE_OAUTH_SETUP.md',
  'package.json',
  'tsconfig.json',
  'tsconfig.node.json',
  'vite.config.ts',
  'tailwind.config.js',
  'postcss.config.js',
  'vercel.json',
  'index.html',
  'main.tsx',
  'App.tsx',
  'deploy.sh',
  'cleanup-docs.js',
  'setup-services.js',
  'open-setup-guide.js'
];

// Directories to keep entirely
const keepDirs = [
  'components',
  'contexts',
  'styles',
  'utils',
  'services',
  'public',
  'supabase',
  'node_modules',
  '.git'
];

console.log('🧹 Cleaning up unnecessary documentation files...');

// Get all files in root directory
const files = fs.readdirSync('.');
let deletedCount = 0;

files.forEach(file => {
  const filePath = path.join('.', file);
  const stat = fs.statSync(filePath);
  
  if (stat.isFile()) {
    // Check if it's a markdown file we should delete
    if (file.endsWith('.md') && !keepFiles.includes(file)) {
      console.log(`Deleting: ${file}`);
      fs.unlinkSync(filePath);
      deletedCount++;
    }
    // Delete other unnecessary files
    else if (!keepFiles.includes(file) && !file.startsWith('.')) {
      const shouldDelete = [
        'Attributions.md',
        'Guidelines.md'
      ].includes(file) || file.endsWith('.md');
      
      if (shouldDelete) {
        console.log(`Deleting: ${file}`);
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    }
  }
});

console.log(`✅ Cleanup complete! Deleted ${deletedCount} unnecessary files.`);
console.log('\n📝 Remaining essential files:');
console.log('- README.md (project documentation)');
console.log('- GOOGLE_OAUTH_SETUP.md (OAuth setup guide)');
console.log('- All source code files');
console.log('- Configuration files');

console.log('\n🚀 Ready to deploy! Run:');
console.log('git add .');
console.log('git commit -m "Clean up docs and add OAuth"');
console.log('git push');