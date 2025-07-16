# 🛍️ Prompt Shop

AI-powered image analysis and prompt generation tool. Upload images and generate creative prompts using OpenAI's Vision API.

## 🌐 Live Application

**Visit**: [https://promptshop.com](https://promptshop.com)

## ✨ Features

- **🖼️ Image Upload & Analysis** - Drag & drop or click to upload images
- **🤖 AI Prompt Generation** - Powered by OpenAI Vision API
- **📚 Prompt Library** - Save and organize your favorite prompts
- **📊 Query History** - Track all your image analyses
- **🔐 Authentication** - Secure login with Google & Apple OAuth
- **📱 PWA Ready** - Install as a mobile app
- **💾 Local Storage** - All data saved locally with smart quota management
- **🎨 Multiple Style Options** - Generate prompts in different artistic styles

## 🚀 Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Authentication**: OAuth (Google & Apple)
- **AI Integration**: OpenAI Vision API
- **Storage**: Browser localStorage with compression
- **Deployment**: Vercel

## 🔧 Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/tikimips/image-to-prompt.git
   cd image-to-prompt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📝 Environment Variables

### Required:
- `VITE_OPENAI_API_KEY` - Your OpenAI API key for Vision API access

### Getting API Keys:
- **OpenAI**: Visit [OpenAI Platform](https://platform.openai.com/api-keys)

## 🔒 Privacy & Security

- **Local Storage**: All prompts and history stored locally in your browser
- **No Data Collection**: We don't store your images or prompts on servers
- **Secure Authentication**: OAuth integration with major providers
- **HTTPS Only**: All traffic encrypted with SSL certificates

## 🎯 Usage

1. **Upload Image**: Drag & drop or click to select an image
2. **Choose Style**: Select from various artistic styles
3. **Generate Prompt**: AI analyzes your image and creates a prompt
4. **Save or Share**: Add to library or copy to clipboard
5. **Manage**: View history and organize your saved prompts

## 📱 PWA Features

- Install as native app on mobile devices
- Offline-ready interface
- App shortcuts for quick access
- Mobile-optimized experience

## 🛠️ Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel (automatic via GitHub)
git push origin main
```

## 📊 Storage Management

The app includes intelligent storage management:
- Automatic cleanup when quota is reached
- Image compression for optimal storage
- Configurable limits for history and saved prompts
- Storage usage dashboard in settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Issues**: Report bugs on GitHub Issues
- **Documentation**: Check the docs/ folder
- **Contact**: Visit [promptshop.com](https://promptshop.com)

---

**Made with ❤️ for the AI community**

Visit **[promptshop.com](https://promptshop.com)** to try it out!