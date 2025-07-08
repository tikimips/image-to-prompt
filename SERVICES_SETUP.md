# Services Integration Guide - Image to Prompt

This guide covers all external services you need to sign up for and integrate into your Image to Prompt application.

## 🔧 Required Services

### 1. OpenAI API (Required for AI Image Analysis)
### 2. Google OAuth (Required for Google Sign-In)
### 3. Apple Developer Program (Required for Apple Sign-In)
### 4. Vercel (Recommended for Deployment)
### 5. GitHub (Required for Code Hosting)

---

## 📋 Service Setup Checklist

- [ ] OpenAI API Account
- [ ] Google Cloud Console Project
- [ ] Apple Developer Account
- [ ] GitHub Account
- [ ] Vercel Account
- [ ] Domain Registration (Optional)

---

## 🚀 Step-by-Step Integration

## 1. OpenAI API Setup

### Sign Up Process:
1. **Visit**: [platform.openai.com](https://platform.openai.com)
2. **Create Account**: Sign up with email or GitHub
3. **Verify Email**: Check your inbox and verify
4. **Add Payment Method**: Go to Settings → Billing → Add payment method
5. **Generate API Key**: Go to API Keys → Create new secret key

### Integration Steps:

**Step 1: Get Your API Key**
```bash
# Your API key will look like this:
sk-proj-abcdef123456789...
```

**Step 2: Update Your Code**Edit the `/services/openai.ts` file and replace line 8:

```typescript
// Replace this line:
const OPENAI_API_KEY = "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";

// With your actual API key:
const OPENAI_API_KEY = "sk-your-actual-api-key-here";
```

**Step 3: Test Your Integration**
- Upload an image in your app
- The app will use your OpenAI API key for analysis
- Monitor usage at [platform.openai.com/usage](https://platform.openai.com/usage)

**Cost Estimates:**
- Vision API: ~$0.01-0.03 per image analysis
- GPT-4o: ~$0.005-0.015 per request
- Budget: $10-20/month for moderate usage

---

## 2. Google OAuth Setup

### Sign Up Process:
1. **Visit**: [console.cloud.google.com](https://console.cloud.google.com)
2. **Create Account**: Use your Google account
3. **Create Project**: Click "New Project" → Enter "Image to Prompt"
4. **Enable APIs**: Enable Google+ API and Google Sign-In API
5. **Create Credentials**: Go to Credentials → Create OAuth 2.0 Client ID

### Integration Steps:

**Step 1: Configure OAuth Consent Screen**
```bash
# Go to: APIs & Services → OAuth consent screen
# Fill in:
Application name: Image to Prompt
User support email: your-email@domain.com
Developer contact: your-email@domain.com
# Add your domain in "Authorized domains"
```

**Step 2: Create OAuth 2.0 Client ID**
```bash
# Go to: APIs & Services → Credentials → Create Credentials
# Select: OAuth 2.0 Client ID
# Application type: Web application
# Name: Image to Prompt Web Client

# Authorized JavaScript origins:
http://localhost:3000
https://your-domain.com
https://your-app.vercel.app

# Authorized redirect URIs:
http://localhost:3000/auth/callback
https://your-domain.com/auth/callback
https://your-app.vercel.app/auth/callback
```

**Step 3: Get Your Client ID**
```bash
# Your Client ID will look like:
123456789012-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

**Step 4: Update Your Code**
Edit `/services/auth.ts` line 15:
```typescript
// Replace this line:
private readonly GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE";

// With your actual client ID:
private readonly GOOGLE_CLIENT_ID = "123456789012-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com";
```

**Step 5: Test Integration**
- Visit your app
- Click "Continue with Google"
- Should redirect to Google OAuth flow
- After authorization, you'll be signed in

---

## 3. Apple Sign-In Setup

### Sign Up Process:
1. **Visit**: [developer.apple.com](https://developer.apple.com)
2. **Enroll**: Join Apple Developer Program ($99/year)
3. **Wait for Approval**: Usually 24-48 hours
4. **Access Developer Portal**: Once approved

### Integration Steps:

**Step 1: Create App ID**
```bash
# Go to: Certificates, IDs & Profiles → Identifiers → App IDs
# Click: Register an App ID
# Description: Image to Prompt
# Bundle ID: com.yourcompany.imagetoprompt
# Enable: Sign In with Apple
```

**Step 2: Create Service ID**
```bash
# Go to: Certificates, IDs & Profiles → Identifiers → Services IDs
# Click: Register a Services ID
# Description: Image to Prompt Web Service
# Identifier: com.yourcompany.imagetoprompt.web
# Enable: Sign In with Apple
# Configure:
#   - Primary App ID: (select your app ID from step 1)
#   - Web Domain: your-domain.com
#   - Return URL: https://your-domain.com/auth/apple/callback
```

**Step 3: Create Private Key**
```bash
# Go to: Certificates, IDs & Profiles → Keys
# Click: Create a Key
# Name: Image to Prompt Sign In Key
# Enable: Sign In with Apple
# Download the .p8 key file
# Note the Key ID (10 characters)
```

**Step 4: Get Your Team ID**
```bash
# Go to: Membership → Team ID
# Copy your Team ID (10 characters)
```

**Step 5: Update Your Code**
Edit `/services/auth.ts` line 18:
```typescript
// Replace this line:
private readonly APPLE_CLIENT_ID = "YOUR_APPLE_CLIENT_ID_HERE";

// With your Service ID:
private readonly APPLE_CLIENT_ID = "com.yourcompany.imagetoprompt.web";
```

**Note**: Apple Sign-In requires more complex backend implementation for production. The current code provides a demo implementation.

---

## 4. GitHub Setup (Required for Deployment)

### Sign Up Process:
1. **Visit**: [github.com](https://github.com)
2. **Create Account**: Sign up with email
3. **Verify Email**: Check inbox and verify
4. **Create Repository**: Click "New" → "image-to-prompt"

### Integration Steps:

**Step 1: Push Your Code**
```bash
# In your project directory:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/image-to-prompt.git
git push -u origin main
```

**Step 2: Repository Settings**
- Make repository public (for free deployment)
- Add description: "AI-powered image to prompt generator"
- Add topics: ai, image-analysis, prompt-generation, react, typescript

---

## 5. Vercel Deployment (Recommended)

### Sign Up Process:
1. **Visit**: [vercel.com](https://vercel.com)
2. **Sign Up**: Use GitHub account
3. **Import Project**: Select your repository
4. **Deploy**: Vercel handles everything automatically

### Integration Steps:

**Step 1: Connect GitHub**
- Authorize Vercel to access your repositories
- Select "image-to-prompt" repository
- Framework: Vite (auto-detected)

**Step 2: Environment Variables**
```bash
# In Vercel dashboard → Settings → Environment Variables
# Add these (optional for enhanced security):
VITE_OPENAI_API_KEY=sk-your-api-key-here
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_APPLE_CLIENT_ID=your-apple-client-id
```

**Step 3: Deploy**
- Click "Deploy"
- Your app will be live at: `https://image-to-prompt.vercel.app`

**Step 4: Custom Domain (Optional)**
```bash
# In Vercel dashboard → Settings → Domains
# Add your domain: your-domain.com
# Update DNS records as instructed
```

---

## 6. Optional Services

### Domain Registration
**Recommended**: Namecheap, Google Domains, or Cloudflare
- Cost: $10-15/year for .com domain
- Improves professional appearance
- Required for OAuth redirect URIs

### Analytics
**Google Analytics 4**: Track user behavior
```bash
# Add to index.html:
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

### Error Monitoring
**Sentry**: Track errors in production
```bash
npm install @sentry/react
# Add to main.tsx for error tracking
```

---

## 🔧 Post-Integration Checklist

### Security
- [ ] Remove demo API keys from code
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Configure CORS properly
- [ ] Test OAuth flows thoroughly

### Performance
- [ ] Test image upload limits
- [ ] Monitor API usage and costs
- [ ] Optimize image compression
- [ ] Test on mobile devices

### Testing
- [ ] Test Google Sign-In flow
- [ ] Test Apple Sign-In flow
- [ ] Test image analysis with real API
- [ ] Test in different browsers
- [ ] Test offline behavior

### Production
- [ ] Update meta tags in index.html
- [ ] Add favicon and app icons
- [ ] Configure error pages
- [ ] Set up monitoring
- [ ] Create backup of configuration

---

## 📊 Cost Breakdown

### Required Costs:
- **Apple Developer Program**: $99/year
- **Domain Registration**: $10-15/year
- **OpenAI API**: $10-50/month (usage-based)

### Optional Costs:
- **Google Cloud**: Free tier available
- **Vercel Pro**: $20/month (for advanced features)
- **Sentry**: $26/month (for error monitoring)

### Total Monthly Cost: $25-100 depending on usage

---

## 🆘 Troubleshooting

### Common Issues:

**1. OAuth Redirect Errors**
- Verify redirect URIs match exactly
- Check that domains are properly configured
- Ensure HTTPS is enabled

**2. OpenAI API Errors**
- Check API key is valid
- Verify billing is set up
- Monitor usage limits

**3. Build/Deploy Errors**
- Check Node.js version (18+)
- Verify all dependencies are installed
- Check environment variables

**4. Authentication Issues**
- Clear browser cache
- Check console for errors
- Verify OAuth configuration

### Support Resources:
- OpenAI: [help.openai.com](https://help.openai.com)
- Google: [support.google.com](https://support.google.com)
- Apple: [developer.apple.com/support](https://developer.apple.com/support)
- Vercel: [vercel.com/support](https://vercel.com/support)