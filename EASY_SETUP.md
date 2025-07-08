# 🚀 Easy Setup Guide - Get Your App Online in 30 Minutes!

**Don't worry - this is easier than it looks!** Just follow these steps one by one.

---

## Step 1: Get Your App Online (5 minutes)

### 1A. Create a GitHub Account
1. Go to [github.com](https://github.com)
2. Click "Sign up"
3. Choose a username (like "yourname123")
4. Use your email and create a password
5. Click "Create account"

### 1B. Upload Your App
1. In GitHub, click the green "New" button
2. Name your repository: `image-to-prompt`
3. Click "Create repository"
4. **IMPORTANT**: On the next page, look for "uploading an existing file"
5. Click that link
6. Drag ALL your app files into the box (everything you see in your folder)
7. Type "Initial upload" in the box at the bottom
8. Click "Commit changes"

### 1C. Put Your App Online
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" and choose "Continue with GitHub"
3. Click "Import Project"
4. Find your "image-to-prompt" repository and click "Import"
5. Just click "Deploy" (don't change anything)
6. Wait 2-3 minutes...
7. **🎉 Your app is now live!** You'll get a link like `https://image-to-prompt-abc123.vercel.app`

---

## Step 2: Get AI Powers (10 minutes)

Your app works now, but it's in "demo mode." To make it analyze images with real AI, you need an OpenAI account.

### 2A. Create OpenAI Account
1. Go to [platform.openai.com](https://platform.openai.com)
2. Click "Sign up"
3. Create account with your email
4. **IMPORTANT**: You'll need to add a payment method (like a credit card)
   - Don't worry - it only costs about $0.01 per image you analyze
   - You can set spending limits to control costs

### 2B. Get Your Secret Key
1. Once logged in, click "API Keys" on the left
2. Click "Create new secret key"
3. Give it a name like "Image App"
4. **COPY THE KEY** - it looks like: `sk-proj-abc123...`
5. **IMPORTANT**: Save this somewhere safe - you can't see it again!

### 2C. Add the Key to Your App
1. In your app files, find the file called `openai.ts` (it's in the `services` folder)
2. Look for line 8 that says: `const OPENAI_API_KEY = "sk-proj-..."`
3. Replace the part in quotes with your real key
4. Save the file
5. Upload this changed file to GitHub:
   - Go to your GitHub repository
   - Click on `services` folder
   - Click on `openai.ts`
   - Click the pencil icon to edit
   - Paste your new key
   - Click "Commit changes"

**Your app will automatically update in 2-3 minutes!**

---

## Step 3: Add Google Sign-In (Optional - 15 minutes)

If you want people to sign in with Google:

### 3A. Create Google Project
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click "Create Project"
3. Name it "Image to Prompt" and click "Create"
4. Wait for it to finish creating

### 3B. Enable Google Sign-In
1. In the left menu, click "APIs & Services" then "Library"
2. Search for "Google+ API"
3. Click it and press "Enable"
4. Go back to "APIs & Services" then "Credentials"
5. Click "Create Credentials" then "OAuth 2.0 Client ID"
6. Click "Configure consent screen"
7. Choose "External" and click "Create"
8. Fill in:
   - App name: "Image to Prompt"
   - User support email: your email
   - Developer contact: your email
9. Click "Save and Continue" three times
10. Click "Back to Dashboard"

### 3C. Create OAuth Credentials
1. Go to "Credentials" again
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Choose "Web application"
4. Name: "Image to Prompt"
5. Under "Authorized JavaScript origins" add:
   - `https://your-vercel-app-url.vercel.app` (use your actual URL)
6. Under "Authorized redirect URIs" add:
   - `https://your-vercel-app-url.vercel.app/auth/callback`
7. Click "Create"
8. **COPY THE CLIENT ID** - it looks like: `123456789012-abc...apps.googleusercontent.com`

### 3D. Add to Your App
1. In your app files, find `auth.ts` (in the `services` folder)
2. Look for line 15: `private readonly GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE"`
3. Replace the part in quotes with your real client ID
4. Save and upload to GitHub like you did before

---

## Step 4: Add Apple Sign-In (Optional - Skip if you want)

**This costs $99/year and is complex. You can skip this for now.**

If you really want it:
1. Go to [developer.apple.com](https://developer.apple.com)
2. Pay $99 to join the developer program
3. Follow the complex setup process (this is the hardest part)

---

## ✅ You're Done!

Your app should now be working! Here's what you have:

- **Live app** at your Vercel URL
- **AI image analysis** (if you added OpenAI key)
- **Google sign-in** (if you set it up)
- **Free hosting** forever

## 🎯 How to Use Your App

1. Go to your Vercel URL
2. Sign in with Google (or use demo mode)
3. Upload a photo
4. Get an AI-generated prompt!
5. Save prompts you like
6. View your history

## 💰 What Does This Cost?

- **GitHub**: Free
- **Vercel**: Free
- **Google OAuth**: Free
- **OpenAI**: About $0.01 per image (so $1 = 100 images)
- **Apple**: $99/year (optional)

## 🆘 If Something Goes Wrong

### App Won't Load
- Check your Vercel dashboard for errors
- Make sure all files uploaded to GitHub

### AI Not Working
- Double-check your OpenAI key is correct
- Make sure you added a payment method to OpenAI
- Check the JavaScript console for errors (press F12 in browser)

### Google Sign-In Not Working
- Make sure your URLs match exactly
- Check that your project is set up correctly

## 🎉 Congratulations!

You now have a live AI-powered app on the internet! Share your URL with friends and family.

---

**Need help?** The error messages in your browser (press F12) usually tell you what's wrong. Most issues are just typos in the setup.