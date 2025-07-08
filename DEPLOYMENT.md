# Deployment Guide - Image to Prompt

This guide will help you deploy your Image to Prompt application to various hosting platforms.

## 🚀 Quick Deploy to Vercel (Recommended)

Vercel is the recommended platform for this React application due to its excellent TypeScript support and performance optimizations.

### Prerequisites
- GitHub account
- Node.js 18+ installed locally

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/image-to-prompt.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect the framework and configure build settings
   - Click "Deploy"

3. **Your site will be live at:** `https://your-project-name.vercel.app`

### Custom Domain (Optional)
1. Go to your project dashboard on Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update your domain's DNS settings as instructed

## 🌐 Alternative Hosting Options

### Netlify
1. Push code to GitHub
2. Visit [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect GitHub and select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "homepage": "https://yourusername.github.io/image-to-prompt",
   "deploy": "gh-pages -d dist"
   ```
3. Run: `npm run build && npm run deploy`

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

## ⚙️ Environment Configuration

### For Production Deployment

1. **OpenAI API Key**
   - Edit `/services/openai.ts`
   - Replace `"sk-proj-..."` with your production API key
   - For security, use environment variables in production

2. **OAuth Configuration**
   - Edit `/services/auth.ts`
   - Replace placeholder client IDs with real OAuth credentials
   - Configure redirect URIs in Google/Apple developer consoles

3. **Environment Variables** (Recommended for production)
   ```bash
   # Create .env.local file
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   VITE_APPLE_CLIENT_ID=your_apple_client_id_here
   ```

   Then update your service files to use:
   ```typescript
   const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "fallback_key";
   ```

## 🔧 Build Optimization

The project is configured with:
- **Code splitting** for optimal loading
- **Asset optimization** with caching headers
- **TypeScript compilation** for type safety
- **Modern browser targeting** for better performance

## 🔒 Security Considerations

### Before Going Live:
1. **Remove demo API keys** from the codebase
2. **Configure CORS** for your domain in OpenAI dashboard
3. **Set up proper OAuth redirect URIs**
4. **Enable HTTPS** (handled automatically by most platforms)
5. **Configure CSP headers** for additional security

### OAuth Setup:

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Add redirect URI: `https://yourdomain.com/auth/callback`

#### Apple Sign-In:
1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Create a new App ID
3. Enable Sign In with Apple
4. Create a Service ID
5. Configure domain and redirect URL
6. Generate and download the key

## 📊 Performance Monitoring

After deployment, monitor:
- **Page load times** using Vercel Analytics or Google PageSpeed
- **Error rates** in browser console
- **API usage** in OpenAI dashboard
- **Storage usage** for user data

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check Node.js version (need 18+)
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

2. **OAuth Not Working**
   - Verify redirect URIs match exactly
   - Check that domains are authorized
   - Ensure HTTPS is enabled

3. **API Errors**
   - Verify OpenAI API key is valid
   - Check CORS settings
   - Monitor API usage limits

4. **Storage Issues**
   - Images are stored in localStorage (2-5MB limit)
   - Consider implementing cloud storage for production

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all configuration steps
3. Test with demo mode first
4. Check hosting platform documentation

## 🎉 Success!

Once deployed, your Image to Prompt application will be live and accessible worldwide. Share the URL and start transforming images into AI prompts!

**Example URLs:**
- Vercel: `https://image-to-prompt.vercel.app`
- Netlify: `https://amazing-site-name.netlify.app`
- Custom domain: `https://your-domain.com`