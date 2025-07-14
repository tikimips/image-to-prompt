# 🖼️ Image to Prompt Generator

A powerful web application that transforms your images into AI-powered prompts using OpenAI's Vision API. Upload any image and get detailed, creative prompts perfect for AI art generation, content creation, and creative workflows.

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🤖 AI-Powered Analysis
- **OpenAI Vision Integration** - Leverages GPT-4 Vision for intelligent image analysis
- **Style Detection** - Automatically identifies artistic styles (photorealistic, digital art, vintage, etc.)
- **Confidence Scoring** - AI analysis confidence indicators for quality assurance
- **Detailed Descriptions** - Rich, creative prompts perfect for AI art generation

### 🔐 Authentication & Security
- **OAuth Integration** - Secure sign-in with Google and Apple
- **Protected Routes** - User-specific data and personalized experience
- **Demo Mode** - Try the interface without authentication setup
- **Session Persistence** - Maintains user state across sessions

### 📚 Content Management
- **Prompt Library** - Save and organize your best prompts
- **Query History** - Track all your image analysis sessions (up to 50 queries)
- **Smart Storage** - Automatic data compression and cleanup
- **Export Capabilities** - Download and share your prompts

### 🎨 User Experience
- **Responsive Design** - Works perfectly on desktop and mobile
- **Accessibility Compliant** - Full keyboard navigation and screen reader support
- **Real-time Feedback** - Instant notifications and progress indicators
- **Drag & Drop Upload** - Easy image uploading with preview

### ⚙️ Advanced Features
- **Image Compression** - Automatic optimization for storage efficiency
- **Storage Management** - Built-in tools to manage local storage quotas
- **Batch Operations** - Save, delete, and organize multiple prompts
- **Search & Filter** - Find prompts by name, style, or date

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Authentication**: OAuth 2.0 (Google, Apple)
- **AI Integration**: OpenAI Vision API
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key
- OAuth credentials (for production)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/image-to-prompt.git
   cd image-to-prompt
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure API services** (see [Configuration](#configuration))

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## ⚙️ Configuration

### OpenAI API Setup

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Update `/services/openai.ts`:
   ```typescript
   const OPENAI_API_KEY = 'your-openai-api-key-here';
   ```

### OAuth Configuration (Optional)

For production authentication, configure OAuth providers:

#### Google OAuth
1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Update `/services/auth.ts`:
   ```typescript
   const GOOGLE_CLIENT_ID = 'your-google-client-id';
   ```

#### Apple OAuth
1. Set up Sign in with Apple in [Apple Developer](https://developer.apple.com/)
2. Configure your service ID and key
3. Update `/services/auth.ts`:
   ```typescript
   const APPLE_CLIENT_ID = 'your-apple-client-id';
   ```

### Environment Variables (Recommended)

Create a `.env` file:
```env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_APPLE_CLIENT_ID=your_apple_client_id
```

## 🎯 Usage

### Basic Workflow

1. **Sign In** - Authenticate with Google, Apple, or try demo mode
2. **Upload Image** - Drag & drop or click to upload any image
3. **Generate Prompt** - AI analyzes and creates detailed prompts
4. **Save & Organize** - Add to your prompt library or keep in history
5. **Export & Share** - Copy prompts or share with others

### Advanced Features

#### Storage Management
- Monitor storage usage in Settings
- Clear history or all data when needed
- Automatic cleanup for large datasets

#### Prompt Library Organization
- Save prompts with custom names
- Filter by style or creation date
- Batch delete unwanted prompts

#### Query History
- View last 50 image analyses
- Save queries to permanent library
- Track AI confidence scores

## 🌐 Deployment

### Vercel (Recommended)

1. **Prepare your repository**
   ```bash
   # Remove unnecessary files
   rm vercel.json deploy.sh *.md (except README.md)
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push

3. **Configure production URLs**
   - Update OAuth redirect URIs
   - Set production API endpoints

### Other Platforms

The app is compatible with:
- Netlify
- Cloudflare Pages
- GitHub Pages
- Any static hosting service

## 🔧 Development

### Project Structure
```
├── components/          # React components
│   ├── ui/             # shadcn/ui components  
│   └── ...             # Feature components
├── contexts/           # React contexts
├── services/           # API integrations
├── styles/             # Global CSS and Tailwind
└── public/             # Static assets
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Development Guidelines

- **Components**: Use TypeScript for all new components
- **Styling**: Follow Tailwind CSS best practices
- **State**: Prefer React hooks and context for state management
- **API**: Keep API calls in `/services` directory
- **Types**: Define interfaces in component files or shared types

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Ensure TypeScript types are properly defined
- Follow the existing code style and formatting
- Add tests for new features
- Update documentation as needed
- Test OAuth flows in demo mode

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for the powerful Vision API
- **shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first styling approach
- **React** and **Vite** for the development foundation

## 📧 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/image-to-prompt/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Built with ❤️ by developers, for creators**

Transform your images into creative prompts and unlock new possibilities for AI-generated content!