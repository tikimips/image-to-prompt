#!/bin/bash

# Image to Prompt - Quick Deployment Script
# This script helps you deploy your application quickly

echo "🚀 Image to Prompt - Deployment Helper"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -c 2- | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available"
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Build the project
echo ""
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo ""
    echo "📝 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Image to Prompt application"
    echo "✅ Git repository initialized"
fi

echo ""
echo "🎉 Your application is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub:"
echo "   git remote add origin https://github.com/yourusername/image-to-prompt.git"
echo "   git push -u origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   - Visit vercel.com"
echo "   - Import your GitHub repository"
echo "   - Your site will be live in minutes!"
echo ""
echo "3. Or deploy to other platforms:"
echo "   - Netlify: netlify.com"
echo "   - Firebase: firebase.google.com"
echo "   - GitHub Pages: pages.github.com"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🔧 Don't forget to configure:"
echo "   - OpenAI API key in /services/openai.ts"
echo "   - OAuth credentials in /services/auth.ts"
echo ""
echo "Happy deploying! 🚀"