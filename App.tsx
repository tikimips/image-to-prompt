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
import { Camera, FileText, History, Settings, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Alert, AlertDescription } from './components/ui/alert';

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

// Storage utility functions with size management
const getStorageSize = (key: string): number => {
  const item = localStorage.getItem(key);
  return item ? new Blob([item]).size : 0;
};

const getTotalStorageSize = (): number => {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      total += getStorageSize(key);
    }
  }
  return total;
};

const compressImageData = (imageUrl: string): string => {
  // For base64 images, we can't compress much, but we can limit size
  if (imageUrl.startsWith('data:image/')) {
    // If image is too large (>100KB), show warning but only once per session
    const sizeInBytes = imageUrl.length * 0.75; // Rough base64 size estimation
    if (sizeInBytes > 100000) {
      console.warn('Large image detected, may affect storage');
      // Only show toast warning occasionally to avoid spam
      if (Math.random() < 0.3) {
        toast.warning('Large image detected');
      }
    }
  }
  return imageUrl;
};

const safeSetItem = (key: string, value: string): boolean => {
  try {
    // Check if we're approaching storage limits (aim for under 2MB total)
    const currentSize = getTotalStorageSize();
    const newItemSize = new Blob([value]).size;
    
    if (currentSize + newItemSize > 2 * 1024 * 1024) {
      console.log('Storage quota exceeded, attempting cleanup...');
      toast.warning('Storage getting full, cleaning up old data...');
      cleanupOldData();
    }
    
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded, attempting cleanup...');
      toast.error('Storage quota exceeded, attempting cleanup...');
      cleanupOldData();
      try {
        localStorage.setItem(key, value);
        toast.success('Storage cleaned up successfully');
        return true;
      } catch (retryError) {
        console.error('Storage still full after cleanup');
        toast.error('Storage still full after cleanup. Please clear some data manually.');
        return false;
      }
    }
    console.error('Storage error:', error);
    toast.error('Storage error occurred');
    return false;
  }
};

const cleanupOldData = () => {
  try {
    // Clean up old query history first (keep only 15 most recent)
    const storedHistory = localStorage.getItem('queryHistory');
    if (storedHistory) {
      const history = JSON.parse(storedHistory);
      if (Array.isArray(history) && history.length > 15) {
        const trimmed = history.slice(0, 15);
        localStorage.setItem('queryHistory', JSON.stringify(trimmed));
        console.log(`Trimmed history from ${history.length} to ${trimmed.length} items`);
      }
    }
    
    // Clean up old saved prompts if there are too many (keep only 30 most recent)
    const storedPrompts = localStorage.getItem('savedPrompts');
    if (storedPrompts) {
      const prompts = JSON.parse(storedPrompts);
      if (Array.isArray(prompts) && prompts.length > 30) {
        const sorted = prompts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const trimmed = sorted.slice(0, 30);
        localStorage.setItem('savedPrompts', JSON.stringify(trimmed));
        console.log(`Trimmed prompts from ${prompts.length} to ${trimmed.length} items`);
      }
    }
    
    console.log('Cleanup completed');
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
};

function MainApp() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [queryHistory, setQueryHistory] = useState<QueryHistory[]>([]);
  const [activeTab, setActiveTab] = useState('upload');
  const [showStorageDialog, setShowStorageDialog] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      try {
        const stored = localStorage.getItem('savedPrompts');
        if (stored) {
          const parsed = JSON.parse(stored);
          setSavedPrompts(Array.isArray(parsed) ? parsed : []);
        }
        
        const storedHistory = localStorage.getItem('queryHistory');
        if (storedHistory) {
          const parsed = JSON.parse(storedHistory);
          setQueryHistory(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        toast.error('Error loading saved data. Starting fresh.');
      }
    }
  }, [isAuthenticated]);

  const savePrompt = (prompt: SavedPrompt) => {
    try {
      // Compress image data before saving
      const optimizedPrompt = {
        ...prompt,
        imageUrl: compressImageData(prompt.imageUrl)
      };
      
      const updated = [...savedPrompts, optimizedPrompt];
      setSavedPrompts(updated);
      
      if (!safeSetItem('savedPrompts', JSON.stringify(updated))) {
        toast.error('Failed to save prompt. Storage may be full.');
      }
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast.error('Failed to save prompt.');
    }
  };

  const addToHistory = (query: Omit<QueryHistory, 'id'>) => {
    try {
      const newQuery: QueryHistory = {
        ...query,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        imageUrl: compressImageData(query.imageUrl)
      };
      
      const updated = [newQuery, ...queryHistory].slice(0, 20); // Keep only last 20
      setQueryHistory(updated);
      
      if (!safeSetItem('queryHistory', JSON.stringify(updated))) {
        toast.error('Failed to save to history. Storage may be full.');
      }
    } catch (error) {
      console.error('Error adding to history:', error);
      toast.error('Failed to save to history.');
    }
  };

  const deletePrompt = (id: string) => {
    try {
      const updated = savedPrompts.filter(p => p.id !== id);
      setSavedPrompts(updated);
      
      if (!safeSetItem('savedPrompts', JSON.stringify(updated))) {
        toast.error('Failed to update saved prompts.');
      } else {
        toast.success('Prompt deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast.error('Failed to delete prompt.');
    }
  };

  const removeFromHistory = (id: string) => {
    try {
      const updated = queryHistory.filter(q => q.id !== id);
      setQueryHistory(updated);
      
      if (!safeSetItem('queryHistory', JSON.stringify(updated))) {
        toast.error('Failed to update history.');
      }
    } catch (error) {
      console.error('Error removing from history:', error);
      toast.error('Failed to remove from history.');
    }
  };

  const saveFromHistory = (prompt: SavedPrompt, queryId: string) => {
    try {
      // Save to prompt library
      savePrompt(prompt);
      // Remove from history
      removeFromHistory(queryId);
      toast.success('Query saved to library and removed from history!');
    } catch (error) {
      console.error('Error saving from history:', error);
      toast.error('Failed to save query.');
    }
  };

  const clearAllData = () => {
    try {
      localStorage.removeItem('savedPrompts');
      localStorage.removeItem('queryHistory');
      setSavedPrompts([]);
      setQueryHistory([]);
      setShowStorageDialog(false);
      toast.success('All data cleared successfully!');
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error('Failed to clear data.');
    }
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem('queryHistory');
      setQueryHistory([]);
      setShowStorageDialog(false);
      toast.success('History cleared successfully!');
    } catch (error) {
      console.error('Error clearing history:', error);
      toast.error('Failed to clear history.');
    }
  };

  const getStorageInfo = () => {
    const prompts = localStorage.getItem('savedPrompts');
    const history = localStorage.getItem('queryHistory');
    const promptsSize = prompts ? (new Blob([prompts]).size / 1024).toFixed(1) : '0';
    const historySize = history ? (new Blob([history]).size / 1024).toFixed(1) : '0';
    const totalSize = ((getTotalStorageSize()) / 1024).toFixed(1);
    
    return { promptsSize, historySize, totalSize };
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">Loading...</p>
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl mb-2">Image to Prompt</h1>
              <p className="text-gray-600">Generate AI prompts from your images</p>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={showStorageDialog} onOpenChange={setShowStorageDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Storage Management</DialogTitle>
                    <DialogDescription>
                      Manage your stored data and free up space if needed.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Alert>
                      <AlertDescription>
                        <div className="space-y-2">
                          <p><strong>Storage Usage:</strong></p>
                          <p>• Saved Prompts: {getStorageInfo().promptsSize} KB ({savedPrompts.length} items)</p>
                          <p>• Query History: {getStorageInfo().historySize} KB ({queryHistory.length} items)</p>
                          <p>• Total Storage: {getStorageInfo().totalSize} KB</p>
                        </div>
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-2">
                      <Button
                        onClick={clearHistory}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear History Only ({queryHistory.length} items)
                      </Button>
                      
                      <Button
                        onClick={clearAllData}
                        variant="destructive"
                        className="w-full justify-start"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All Data (History + Saved Prompts)
                      </Button>
                    </div>
                    
                    <Alert>
                      <AlertDescription className="text-sm">
                        <strong>Note:</strong> If you're experiencing storage errors, try clearing history first. 
                        Images take up the most space, so reducing the number of saved items helps prevent quota issues.
                      </AlertDescription>
                    </Alert>
                  </div>
                </DialogContent>
              </Dialog>
              <UserProfile />
            </div>
          </div>
          
          {/* Welcome message */}
          {user && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Welcome back, <span className="font-medium">{user.name}</span>!
              </p>
            </div>
          )}
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Prompt Library
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <ImageUploadSection onSave={savePrompt} onQuery={addToHistory} />
          </TabsContent>

          <TabsContent value="library" className="mt-6">
            <PromptLibrary 
              prompts={savedPrompts} 
              onDelete={deletePrompt}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <QueryHistoryComponent 
              queries={queryHistory} 
              onSave={savePrompt}
              onSaveFromHistory={saveFromHistory}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Configuration Checker - Available on all pages */}
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