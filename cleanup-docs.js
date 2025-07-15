// Simple cleanup script to remove unnecessary documentation files
// Run this with: node cleanup-docs.js

import fs from 'fs';
import path from 'path';

const filesToDelete = [
  'Attributions.md',
  'BRANCH_SELECTION_GUIDE.md',
  'CHECKLIST.md',
  'CLEAN_PROJECT_GUIDE.md',
  'CLEAN_UPLOAD_INSTRUCTIONS.md',
  'COMPLETE_DEPLOYMENT_GUIDE.md',
  'COMPLETE_VERCEL_DEPLOYMENT_GUIDE.md',
  'COMPREHENSIVE_DEPLOYMENT_FIX.md',
  'COPY_THIS_TSCONFIG.md',
  'CRITICAL_CLEANUP_REQUIRED.md',
  'CURRENT_STATUS_CLEANUP_NEEDED.md',
  'DELETE_JSON_WORD.md',
  'DELETE_THESE_56_FILES_NOW.md',
  'DELETE_VERCEL_JSON.md',
  'DEPLOYMENT.md',
  'DEPLOY_TO_VERCEL_NOW.md',
  'DOWNLOAD_FIRST.md',
  'EASY_SETUP.md',
  'EXACT_DELETE_LIST.md',
  'EXACT_FILES_TO_DELETE.md',
  'EXACT_FILES_TO_EXCLUDE.md',
  'FIGMA_MAKE_DOWNLOAD.md',
  'FINAL_CLEAN_DEPLOYMENT_GUIDE.md',
  'FINAL_DEPLOYMENT_CLEANUP.md',
  'FINAL_DEPLOYMENT_FIX.md',
  'FINAL_DEPLOYMENT_SOLUTION.md',
  'FINAL_JSON_FIX.md',
  'FINAL_UPLOAD_LIST.md',
  'FIND_YOUR_FOLDER.md',
  'FIXED_DEPLOYMENT_READY.md',
  'FIX_EMPTY_GITHUB.md',
  'FIX_VERCEL_CONFIG.md',
  'FIX_VERCEL_NAME.md',
  'FRESH_START_DEPLOYMENT_GUIDE.md',
  'GITHUB_BRANCH_AND_CLEAN_UPLOAD.md',
  'GITHUB_BRANCH_FIX.md',
  'GITHUB_CHECK.md',
  'GITHUB_CLEANUP_STEPS.md',
  'GITHUB_CLEAN_UPLOAD_PLAN.md',
  'GITHUB_PREP_CHECKLIST.md',
  'GITHUB_UPLOAD_INSTRUCTIONS.md',
  'GITHUB_UPLOAD_STEPS.md',
  'HANDLE_SECRET_SCANNING_AND_DEPLOY.md',
  'HOW_TO_OPEN_FILES.md',
  'IMMEDIATE_CLEANUP_INSTRUCTIONS.md',
  'IMMEDIATE_NEXT_STEPS.md',
  'QUICK_BUILD_FIX.md',
  'QUICK_CHECKLIST.md',
  'QUICK_UPLOAD_CHECKLIST.md',
  'QUICK_VERCEL_FIX.md',
  'REMOVE_FILE_GUIDE.md',
  'REPLACE_THESE_2_FILES_ON_GITHUB.md',
  'SERVICES_SETUP.md',
  'SIMPLE_UPLOAD_GUIDE.md',
  'SIMPLE_UPLOAD_LIST.md',
  'SIMPLE_VERCEL_FIX.md',
  'STATUS_UPDATE.md',
  'STEP_BY_STEP_VERCEL_DEPLOYMENT.md',
  'STEP_BY_STEP_VERCEL_IMPORT.md',
  'TYPESCRIPT_BUILD_FIX.md',
  'UPLOAD_FIXED_FILES_NOW.md',
  'UPLOAD_FIXED_FILES_TO_GITHUB.md',
  'UPLOAD_LIST_FINAL.md',
  'UPLOAD_THESE_FILES.md',
  'URGENT_CLEANUP_THEN_DEPLOY.md',
  'VERCEL_DEPLOYMENT_STEPS.md',
  'VERCEL_NAME_FIX.md',
  'VERCEL_PROJECT_LIMIT_FIX.md',
  'VISUAL_GUIDE.md',
  'WHAT_AM_I_DOING.md',
  'deploy.sh',
  'open-setup-guide.js',
  'setup-services.js'
];

const currentDir = process.cwd();

filesToDelete.forEach(file => {
  const filePath = path.join(currentDir, file);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted: ${file}`);
    } catch (error) {
      console.log(`❌ Failed to delete: ${file} - ${error.message}`);
    }
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('\n🎉 Cleanup complete! Your repository is now much cleaner.');
console.log('📝 Kept essential files: README.md, Guidelines.md, package.json, etc.');