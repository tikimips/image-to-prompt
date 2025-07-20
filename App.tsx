import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { UserProfile } from './components/UserProfile';
import { DebugPanel } from './components/DebugPanel';
import { Sparkles, Upload, Library, History, AlertTriangle, ImageIcon } from 'lucide-react';

// Simple Upload Component
function SimpleUpload() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Upload an Image</h3>
              <p className="text-sm text-slate-600">Click to browse or drag and drop</p>
            </div>
          </div>
        </label>
      </div>
      
      {preview && (
        <div className="bg-slate-50 rounded-xl p-4">
          <img src={preview} alt="Preview" className="max-w-full h-64 object-contain mx-auto rounded-lg" />
          <p className="text-center text-sm text-slate-600 mt-3">{selectedImage?.name}</p>
        </div>
      )}
    </div>
  );
}

// Simple Library Component
function SimpleLibrary() {
  return (
    <div className="space-y-4">
      <div className="text-center py-12">
        <Library className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h3 className="font-medium text-slate-600 mb-2">Your Library</h3>
        <p className="text-sm text-slate-500">Saved prompts will appear here</p>
      </div>
    </div>
  );
}

// Simple History Component  
function SimpleHistory() {
  return (
    <div className="space-y-4">
      <div className="text-center py-12">
        <History className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h3 className="font-medium text-slate-600 mb-2">Analysis History</h3>
        <p className="text-sm text-slate-500">Your recent analyses will appear here</p>
      </div>
    </div>
  );
}

function MainApp() {
  const { user, isLoading, isAuthenticated, isSupabaseConfigured } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'library' | 'history'>('upload');

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const getUserDisplayName = (user: any) => {
    if (!user) return 'User';
    return user.user_metadata?.full_name || 
           user.user_metadata?.name || 
           user.email?.split('@')[0] || 
           'User';
  };

  const tabs = [
    { id: 'upload', label: 'Upload', icon: Upload, component: SimpleUpload },
    { id: 'library', label: 'Library', icon: Library, component: SimpleLibrary },
    { id: 'history', label: 'History', icon: History, component: SimpleHistory },
  ] as const;

  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component || SimpleUpload;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Prompt Shop
              </h1>
              <p className="text-sm text-slate-600">AI-powered image analysis</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-slate-700">
                  {getUserDisplayName(user)}
                </p>
                <p className="text-xs text-slate-500">
                  {isSupabaseConfigured ? user.email : 'Demo Mode'}
                </p>
              </div>
            )}
            <UserProfile />
          </div>
        </div>

        {/* Configuration Status Banner */}
        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="font-medium text-amber-800 text-sm">Demo Mode Active</span>
            </div>
            <p className="text-xs text-amber-700 mt-1">
              Add Supabase credentials for full functionality and data persistence.
            </p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Panel - Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm flex-1 justify-center ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 min-h-[500px]">
              <ActiveComponent />
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="xl:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl h-full min-h-[500px]">
              <div className="p-6 border-b border-slate-200">
                <h3 className="font-semibold text-slate-800 text-lg">Preview</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Generated prompts will appear here
                </p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center h-64 text-center">
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mx-auto">
                      <ImageIcon className="h-8 w-8 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-600 mb-1">No prompt selected</p>
                      <p className="text-sm text-slate-500">
                        Upload an image to generate AI prompts
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Debug Panel */}
      <DebugPanel />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}