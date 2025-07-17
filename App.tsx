import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster } from './components/ui/sonner';
import { ImageUploadSection } from './components/ImageUploadSection';
import { PromptLibrary } from './components/PromptLibrary';
import { QueryHistory as QueryHistoryComponent } from './components/QueryHistory';
import { LoginPage } from './components/LoginPage';
import { UserProfile } from './components/UserProfile';
import { ConfigChecker } from './components/ConfigChecker';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Camera, FileText, History, Eye, Image as ImageIcon, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';

// Simple interfaces for now
export interface SavedPrompt {
  id: string;
  name: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
  style: string;
}

export interface QueryHistory {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
  style: string;
  confidence?: number;
}

function MainApp() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [queryHistory, setQueryHistory] = useState<QueryHistory[]>([]);
  const [activeTab, setActiveTab] = useState('upload');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewPrompt, setPreviewPrompt] = useState<string | null>(null);
  const [previewStyle, setPreviewStyle] = useState<string | null>(null);

  // Load data from localStorage for now
  useEffect(() => {
    if (isAuthenticated) {
      // Load saved prompts from localStorage
      const savedPromptsData = localStorage.getItem('savedPrompts');
      if (savedPromptsData) {
        try {
          const prompts = JSON.parse(savedPromptsData);
          setSavedPrompts(prompts);
        } catch (error) {
          console.error('Error loading saved prompts:', error);
        }
      }

      // Load query history from localStorage
      const queryHistoryData = localStorage.getItem('queryHistory');
      if (queryHistoryData) {
        try {
          const queries = JSON.parse(queryHistoryData);
          setQueryHistory(queries);
        } catch (error) {
          console.error('Error loading query history:', error);
        }
      }
    }
  }, [isAuthenticated]);

  const savePrompt = (prompt: SavedPrompt) => {
    const updatedPrompts = [prompt, ...savedPrompts];
    setSavedPrompts(updatedPrompts);
    localStorage.setItem('savedPrompts', JSON.stringify(updatedPrompts));
    toast.success('Prompt saved successfully!');
  };

  const addToHistory = (query: Omit<QueryHistory, 'id'>) => {
    const newQuery = {
      ...query,
      id: Date.now().toString()
    };
    const updatedHistory = [newQuery, ...queryHistory.slice(0, 19)]; // Keep only last 20
    setQueryHistory(updatedHistory);
    localStorage.setItem('queryHistory', JSON.stringify(updatedHistory));
  };

  const deletePrompt = (id: string) => {
    const updatedPrompts = savedPrompts.filter(p => p.id !== id);
    setSavedPrompts(updatedPrompts);
    localStorage.setItem('savedPrompts', JSON.stringify(updatedPrompts));
    toast.success('Prompt deleted successfully!');
  };

  const removeFromHistory = (id: string) => {
    const updatedHistory = queryHistory.filter(q => q.id !== id);
    setQueryHistory(updatedHistory);
    localStorage.setItem('queryHistory', JSON.stringify(updatedHistory));
    toast.success('Item removed from history!');
  };

  const saveFromHistory = (prompt: SavedPrompt, queryId: string) => {
    savePrompt(prompt);
    removeFromHistory(queryId);
    toast.success('Query saved to library and removed from history!');
  };

  const updatePreview = (imageUrl: string, prompt: string, style: string) => {
    setPreviewImage(imageUrl);
    setPreviewPrompt(prompt);
    setPreviewStyle(style);
  };

  // Helper function to get user display name
  const getUserDisplayName = (user: any) => {
    if (!user) return 'User';
    return user.user_metadata?.full_name || 
           user.user_metadata?.name || 
           user.email?.split('@')[0] || 
           'User';
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <ConfigChecker />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-3 justify-center lg:justify-start mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Prompt Shop
                </h1>
              </div>
            </div>
            <p className="text-slate-600 text-lg">AI-powered image analysis &amp; prompt generation</p>
            {/* Welcome message */}
            {user && (
              <div className="text-sm text-slate-500 mt-2 space-y-1">
                <p className="flex items-center gap-2 justify-center lg:justify-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Welcome back, <span className="font-medium">{getUserDisplayName(user)}</span>!
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <UserProfile />
          </div>
        </div>

        {/* Main Content - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Navigation Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-14 p-1 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm">
                <TabsTrigger value="upload">
                  <Camera className="h-4 w-4 mr-2" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="library">
                  <FileText className="h-4 w-4 mr-2" />
                  Library ({savedPrompts.length})
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="h-4 w-4 mr-2" />
                  History ({queryHistory.length})
                </TabsTrigger>
              </TabsList>

              {/* Tab Content */}
              <TabsContent value="upload" className="mt-6">
                <ImageUploadSection 
                  onSave={savePrompt} 
                  onQuery={addToHistory}
                  onPreview={updatePreview}
                />
              </TabsContent>

              <TabsContent value="library" className="mt-6">
                <PromptLibrary 
                  prompts={savedPrompts} 
                  onDelete={deletePrompt}
                  onPreview={updatePreview}
                />
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <QueryHistoryComponent 
                  queries={queryHistory} 
                  onSave={savePrompt}
                  onSaveFromHistory={saveFromHistory}
                  onPreview={updatePreview}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="h-5 w-5 text-blue-600" />
                  Preview
                </CardTitle>
                <CardDescription>
                  View selected image and prompt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {previewImage ? (
                  <>
                    {/* Image Preview */}
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Style Badge */}
                    {previewStyle && (
                      <div className="flex justify-center">
                        <Badge 
                          variant="secondary" 
                          className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200"
                        >
                          {previewStyle}
                        </Badge>
                      </div>
                    )}
                    
                    {/* Prompt Preview */}
                    {previewPrompt && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-slate-700">Generated Prompt:</h4>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-600 max-h-48 overflow-y-auto">
                          {previewPrompt}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <ImageIcon className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                    <p className="text-sm">No image selected</p>
                    <p className="text-xs mt-1">Click on any image to preview it here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Configuration Checker */}
      <ConfigChecker />
      
      <Toaster />
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