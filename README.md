# Image to Prompt - AI-Powered Image Analysis

Transform your images into detailed AI prompts with advanced computer vision analysis. Upload images via file, camera, or drag-and-drop, and generate creative prompts for AI art generation.

## 🚀 Quick Start

1. **Setup Services**: Follow the [Services Setup Guide](./SERVICES_SETUP.md) to configure all required external services
2. **Install Dependencies**: `npm install`
3. **Run Development**: `npm run dev`
4. **Deploy**: Follow the [Deployment Guide](./DEPLOYMENT.md)

## 📋 Setup Checklist

- [ ] **OpenAI API** - Get your API key from [platform.openai.com](https://platform.openai.com/api-keys)
- [ ] **Google OAuth** - Configure at [console.cloud.google.com](https://console.cloud.google.com)
- [ ] **Apple Sign-In** - Setup at [developer.apple.com](https://developer.apple.com) ($99/year)
- [ ] **GitHub Repository** - Create at [github.com](https://github.com)
- [ ] **Vercel Deployment** - Deploy at [vercel.com](https://vercel.com)

## 🔧 Configuration Files

- **[SERVICES_SETUP.md](./SERVICES_SETUP.md)** - Complete step-by-step integration guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions for multiple platforms
- **[setup-services.js](./setup-services.js)** - Interactive configuration script

## ⚡ Features

### Core Features
- **Image Upload** - File, camera, or drag-and-drop support
- **AI Analysis** - OpenAI Vision API integration for intelligent image analysis
- **Prompt Library** - Save and organize your favorite prompts
- **Query History** - Track your last 20 image analyses
- **Demo Mode** - Works without API keys for testing
- **Authentication** - Google and Apple Sign-In integration

### Technical Features
- **Smart Storage** - 2MB limit with automatic cleanup
- **Image Compression** - Optimized for performance (1024x1024px, JPEG)
- **Error Handling** - Graceful fallbacks and user feedback
- **Responsive Design** - Works on desktop and mobile
- **PWA Ready** - Installable web app
- **TypeScript** - Full type safety

## 🔒 Security & Privacy

- **No Server Required** - All processing happens in your browser
- **Local Storage** - Your images and prompts stay on your device
- **Secure Authentication** - Industry-standard OAuth integration
- **API Key Protection** - Environment variables for production

## 💰 Cost Breakdown

### Required Services:
- **OpenAI API**: $10-50/month (usage-based)
- **Apple Developer**: $99/year (for Apple Sign-In)
- **Domain**: $10-15/year (optional)

### Free Services:
- **Google OAuth**: Free
- **GitHub**: Free
- **Vercel Hosting**: Free tier available

**Total Monthly Cost**: $25-75 depending on usage

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/image-to-prompt.git
cd image-to-prompt

# Install dependencies
npm install

# Configure services (interactive)
node setup-services.js

# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production
```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

## 📚 Documentation

- **[Services Setup Guide](./SERVICES_SETUP.md)** - Complete integration instructions
- **[Deployment Guide](./DEPLOYMENT.md)** - Multi-platform deployment
- **[Guidelines](./Guidelines.md)** - Development guidelines and best practices
- **[Attributions](./Attributions.md)** - Third-party libraries and credits

## 🆘 Troubleshooting

### Common Issues

**Build Errors:**
- Ensure Node.js 18+ is installed
- Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`

**OAuth Issues:**
- Verify redirect URIs match exactly
- Check that domains are authorized in OAuth settings
- Ensure HTTPS is enabled for production

**API Errors:**
- Verify OpenAI API key is valid and has billing set up
- Check API usage limits at [platform.openai.com/usage](https://platform.openai.com/usage)
- Monitor console for detailed error messages

**Storage Issues:**
- Use the built-in storage management dialog
- Clear browser data if needed
- Images are compressed automatically

### Getting Help

1. **Check the Configuration**: Use the built-in ConfigChecker component
2. **Review Documentation**: All guides are in the project root
3. **Check Console**: Browser developer tools show detailed errors
4. **Test in Demo Mode**: Verify basic functionality without API keys

## 📞 Support Resources

- **OpenAI**: [help.openai.com](https://help.openai.com)
- **Google Cloud**: [support.google.com](https://support.google.com)
- **Apple Developer**: [developer.apple.com/support](https://developer.apple.com/support)
- **Vercel**: [vercel.com/support](https://vercel.com/support)

## 🎉 Success!

Once everything is configured and deployed, your Image to Prompt application will be live and ready to transform images into AI prompts worldwide!

**Example Live URLs:**
- Vercel: `https://image-to-prompt.vercel.app`
- Custom Domain: `https://your-domain.com`

---

Built with ❤️ using React, TypeScript, and Tailwind CSS