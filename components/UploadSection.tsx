import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { copyToClipboard, showTextForManualCopy } from './ui/utils';
import { Upload, Camera, Wand2, Save, Share2, Copy, AlertCircle, Settings, RefreshCw } from 'lucide-react';
import { SavedPrompt } from '../App';
import { toast } from 'sonner@2.0.3';
import { openAIService, OpenAIAnalysisResult } from '../services/openai';

interface ImageUploadSectionProps {
  onSave: (prompt: SavedPrompt) => void;
  onQuery: (query: { prompt: string; imageUrl: string; style: string; createdAt: string; confidence?: number }) => void;
}

export function ImageUploadSection({ onSave, onQuery }: ImageUploadSectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [promptName, setPromptName] = useState<string>('');
  const [detectedStyle, setDetectedStyle] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showApiInfo, setShowApiInfo] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<OpenAIAnalysisResult | null>(null);
  const [cameraSupported, setCameraSupported] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Check if camera/media capture is supported
  React.useEffect(() => {
    // Check if we're running in a secure context (HTTPS or localhost)
    const isSecureContext = window.isSecureContext || window.location.hostname === 'localhost';
    setCameraSupported(isSecureContext);
  }, []);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions to keep aspect ratio - more aggressive sizing
        const maxWidth = 800;
        const maxHeight = 800;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Start with lower quality for better compression
        let compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        let compressedSize = Math.round((compressedDataUrl.length * 3) / 4); // Approximate base64 to bytes
        
        // Progressively reduce quality until we get under 300KB
        let quality = 0.7;
        while (compressedSize > 300000 && quality > 0.3) {
          quality -= 0.1;
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          compressedSize = Math.round((compressedDataUrl.length * 3) / 4);
        }
        
        // Final fallback - very aggressive compression
        if (compressedSize > 300000) {
          compressedDataUrl = canvas.toDataURL('image/jpeg', 0.3);
        }
        
        resolve(compressedDataUrl);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const processImageFile = async (file: File) => {
    try {
      // Show loading state
      setIsGenerating(true);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file.');
        return;
      }
      
      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 10) {
        toast.error('File size too large. Please select an image smaller than 10MB.');
        return;
      }
      
      // Compress the image
      const compressedImage = await compressImage(file);
      
      // Check compressed size
      const compressedSizeKB = Math.round((compressedImage.length * 3) / 4) / 1024;
      if (compressedSizeKB > 300) {
        toast.warning('Large image detected, storage may be affected');
      }
      
      setSelectedImage(compressedImage);
      setGeneratedPrompt('');
      setDetectedStyle('');
      setAnalysisResult(null);
      
      toast.success(`Image loaded (${Math.round(compressedSizeKB)}KB)`);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processImageFile(file);
    }
    // Reset the input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleCameraClick = () => {
    if (!cameraSupported) {
      toast.error('Camera access requires HTTPS or localhost. Please use file upload instead.');
      return;
    }
    
    // Reset camera input to ensure it triggers correctly
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
      try {
        cameraInputRef.current.click();
      } catch (error) {
        console.error('Camera click error:', error);
        toast.error('Unable to access camera. Please use file upload instead.');
      }
    }
  };

  const handleUploadClick = () => {
    // Reset file input to ensure it triggers correctly
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragOver to false if we're leaving the drop zone entirely
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (!imageFile) {
      toast.error('Please drop an image file.');
      return;
    }

    if (files.length > 1) {
      toast.warning('Multiple files detected. Using the first image file.');
    }

    await processImageFile(imageFile);
  };

  const generatePrompt = async () => {
    if (!selectedImage) {
      toast.error('No image selected');
      return;
    }
    
    console.log('Starting prompt generation...');
    console.log('Image URL length:', selectedImage.length);
    console.log('Image starts with:', selectedImage.substring(0, 50));
    console.log('OpenAI configured:', openAIService.isConfigured());
    console.log('Should skip API:', openAIService.shouldSkipApi());
    
    setIsGenerating(true);
    
    try {
      let result: OpenAIAnalysisResult;
      
      if (openAIService.isConfigured() && !openAIService.shouldSkipApi()) {
        // Use real OpenAI Vision API
        try {
          console.log('Attempting OpenAI API call with image size:', Math.round((selectedImage.length * 3) / 4) / 1024, 'KB');
          result = await openAIService.analyzeImage(selectedImage);
          toast.success('Image analyzed with OpenAI Vision API!');
          console.log('Successfully generated prompt:', result.prompt);
          // Clear any previous errors on success
          openAIService.clearError();
        } catch (apiError) {
          // Don't log quota errors as much since they're expected
          if (!(apiError instanceof Error && apiError.message.includes('QUOTA_EXCEEDED'))) {
            console.error('OpenAI API failed, switching to demo mode:', apiError);
          }
          
          // Handle specific quota exceeded error more gracefully
          if (apiError instanceof Error && apiError.message.includes('QUOTA_EXCEEDED')) {
            // Only show quota warning once or twice, not repeatedly
            const quotaWarningKey = 'quota_warning_shown';
            const lastShown = localStorage.getItem(quotaWarningKey);
            const now = Date.now();
            
            if (!lastShown || (now - parseInt(lastShown)) > 300000) { // Show warning max once per 5 minutes
              toast.warning('OpenAI API quota exceeded. Switching to demo mode.');
              toast.info('💡 Add credits to your OpenAI account to re-enable AI analysis.');
              localStorage.setItem(quotaWarningKey, now.toString());
            }
          } else if (apiError instanceof Error && apiError.message.includes('Invalid image format')) {
            toast.error('Image format not supported. Using demo mode.');
          } else if (apiError instanceof Error && apiError.message.includes('too large')) {
            toast.error('Image too large. Please try a smaller image or use demo mode.');
          } else {
            console.error('Unexpected OpenAI API error:', apiError);
            toast.warning('OpenAI API temporarily unavailable. Using demo mode.');
          }
          
          result = await openAIService.generateMockPrompt();
        }
      } else if (openAIService.shouldSkipApi()) {
        // Skip API calls when quota is exceeded
        result = await openAIService.generateMockPrompt();
        toast.info('Using demo mode (API quota exceeded).');
      } else {
        // Use mock data when API key is not configured
        result = await openAIService.generateMockPrompt();
        toast.info('Using demo mode. Configure OpenAI API key for real analysis.');
      }
      
      setAnalysisResult(result);
      setGeneratedPrompt(result.prompt);
      setDetectedStyle(result.style);
      
      // Add to history
      onQuery({
        prompt: result.prompt,
        imageUrl: selectedImage,
        style: result.style,
        createdAt: new Date().toISOString(),
        confidence: result.confidence
      });
      
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast.error('Failed to generate prompt. Please try again.');
      
      // Last resort fallback - ensure we always have something
      try {
        const fallbackResult = await openAIService.generateMockPrompt();
        setAnalysisResult(fallbackResult);
        setGeneratedPrompt(fallbackResult.prompt);
        setDetectedStyle(fallbackResult.style);
        
        onQuery({
          prompt: fallbackResult.prompt,
          imageUrl: selectedImage,
          style: fallbackResult.style,
          createdAt: new Date().toISOString(),
          confidence: fallbackResult.confidence
        });
        
        toast.info('Using backup demo prompt.');
      } catch (fallbackError) {
        console.error('Even fallback failed:', fallbackError);
        toast.error('Complete system failure. Please refresh the page.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const clearApiError = () => {
    openAIService.clearError();
    toast.success('API status cleared. You can try again now.');
  };

  const handleSave = () => {
    if (!promptName.trim()) {
      toast.error('Please enter a name for the prompt');
      return;
    }
    
    if (!generatedPrompt) {
      toast.error('No prompt to save');
      return;
    }
    
    if (!selectedImage) {
      toast.error('No image selected');
      return;
    }

    try {
      const newPrompt: SavedPrompt = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: promptName.trim(),
        prompt: generatedPrompt,
        imageUrl: selectedImage,
        createdAt: new Date().toISOString(),
        style: detectedStyle || 'unknown'
      };

      onSave(newPrompt);
      setShowSaveDialog(false);
      setPromptName('');
      toast.success('Prompt saved successfully!');
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast.error('Failed to save prompt. Please try again.');
    }
  };

  const handleCopyToClipboard = async () => {
    if (!generatedPrompt) {
      toast.error('No prompt to copy!');
      return;
    }

    const success = await copyToClipboard(generatedPrompt);
    if (success) {
      toast.success('Prompt copied to clipboard!');
    } else {
      // Show a user-friendly modal for manual copying
      showTextForManualCopy(generatedPrompt, 'Copy Generated Prompt');
      toast.info('Please copy the text manually from the dialog.');
    }
  };

  const sharePrompt = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Generated AI Prompt',
        text: generatedPrompt,
      });
    } else {
      handleCopyToClipboard();
    }
  };

  return (
    <div className="space-y-6">
      {/* API Configuration Info */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            {openAIService.isConfigured() 
              ? (openAIService.hasQuotaError() 
                ? (openAIService.shouldSkipApi() 
                  ? "⏸️ OpenAI API quota exceeded - Cooldown mode (demo only)"
                  : "⚠️ OpenAI API quota exceeded - Demo mode active")
                : "✅ OpenAI Vision API ready - Real AI analysis enabled")
              : "🔧 Demo mode - Configure OpenAI API key for real analysis"
            }
          </span>
          <div className="flex gap-1">
            {openAIService.hasQuotaError() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearApiError}
                title="Clear API error and try again"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowApiInfo(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* API Setup Dialog */}
      <Dialog open={showApiInfo} onOpenChange={setShowApiInfo}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>OpenAI Vision API Setup</DialogTitle>
            <DialogDescription>
              Configure your OpenAI API key to enable real AI image analysis instead of demo mode.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">To enable real AI image analysis:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Sign up for an OpenAI account at <a href="https://platform.openai.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">platform.openai.com</a></li>
                <li>Generate an API key from your dashboard</li>
                <li>Open <code className="bg-gray-200 px-1 rounded">/services/openai.ts</code></li>
                <li>Replace <code className="bg-gray-200 px-1 rounded">"YOUR_OPENAI_API_KEY_HERE"</code> with your actual API key</li>
                <li>For production, use environment variables instead of hardcoding</li>
              </ol>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Note:</strong> OpenAI Vision API usage incurs costs. Check OpenAI's pricing page for current rates.
                Without an API key, the app will use demo prompts for testing purposes.
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-red-800">If you see "quota exceeded" errors:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-red-700">
                <li>Visit <a href="https://platform.openai.com/account/billing" target="_blank" rel="noopener noreferrer" className="text-red-600 underline">your OpenAI billing page</a></li>
                <li>Add credits to your account or upgrade your plan</li>
                <li>The app will automatically fall back to demo mode when quota is exceeded</li>
              </ol>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Debug & Test:</h4>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={async () => {
                  try {
                    const isWorking = await openAIService.testApiConnection();
                    if (isWorking) {
                      toast.success('✅ OpenAI API connection successful!');
                    } else {
                      toast.error('❌ OpenAI API connection failed');
                    }
                  } catch (error) {
                    toast.error('❌ API test failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
                  }
                }}
              >
                Test API Connection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Camera Support Warning */}
      {!cameraSupported && (
        <Alert>
          <Camera className="h-4 w-4" />
          <AlertDescription>
            📷 Camera access requires HTTPS or localhost. The "Take Photo" button will be disabled. Use "Upload File" instead.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upload or Drop Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drag and Drop Zone */}
          <div
            ref={dropZoneRef}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
              ${isDragOver 
                ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }
              ${selectedImage ? 'border-green-500 bg-green-50' : ''}
            `}
            onClick={handleUploadClick}
          >
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
                {isDragOver ? (
                  <Upload className="h-6 w-6 text-blue-500 animate-bounce" />
                ) : selectedImage ? (
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                ) : (
                  <Upload className="h-6 w-6 text-gray-400" />
                )}
              </div>
              
              <div>
                <p className={`text-lg font-medium ${isDragOver ? 'text-blue-600' : selectedImage ? 'text-green-600' : 'text-gray-900'}`}>
                  {isDragOver 
                    ? 'Drop your image here!' 
                    : selectedImage 
                    ? 'Image loaded successfully' 
                    : 'Drop an image here or click to browse'
                  }
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {isDragOver 
                    ? 'Release to upload your image'
                    : 'Supports JPG, PNG, GIF up to 10MB'
                  }
                </p>
              </div>
            </div>
            
            {isDragOver && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg pointer-events-none"></div>
            )}
          </div>

          {/* Alternative Upload Methods */}
          <div className="flex gap-4">
            <Button
              onClick={handleUploadClick}
              variant="outline"
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
            <Button
              onClick={handleCameraClick}
              variant="outline"
              className="flex-1"
              disabled={!cameraSupported}
              title={!cameraSupported ? "Camera requires HTTPS or localhost" : "Take a photo with your device camera"}
            >
              <Camera className="h-4 w-4 mr-2" />
              Take Photo
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-input"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
            className="hidden"
            id="camera-input"
          />

          {selectedImage && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              
              <Button
                onClick={generatePrompt}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                    {openAIService.isConfigured() && !openAIService.shouldSkipApi() ? 'Analyzing with AI...' : 'Generating...'}
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    {openAIService.isConfigured() && !openAIService.shouldSkipApi() ? 'Analyze with AI' : 'Generate Demo Prompt'}
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {generatedPrompt && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Generated Prompt</span>
              {detectedStyle && (
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {detectedStyle}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysisResult && openAIService.isConfigured() && (
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-800">
                  ✨ AI Analysis Complete • Confidence: {Math.round(analysisResult.confidence * 100)}%
                </p>
              </div>
            )}
            
            <Textarea
              value={generatedPrompt}
              onChange={(e) => setGeneratedPrompt(e.target.value)}
              className="min-h-32"
              placeholder="Generated prompt will appear here..."
            />
            
            <div className="flex gap-2">
              <Button onClick={handleCopyToClipboard} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button onClick={sharePrompt} variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Prompt</DialogTitle>
                    <DialogDescription>
                      Give your generated prompt a name to save it to your library for future use.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="prompt-name">Prompt Name</Label>
                      <Input
                        id="prompt-name"
                        value={promptName}
                        onChange={(e) => setPromptName(e.target.value)}
                        placeholder="Enter a name for your prompt"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSave();
                          }
                        }}
                      />
                    </div>
                    {detectedStyle && (
                      <div className="text-sm text-gray-600">
                        Detected style: <span className="font-medium">{detectedStyle}</span>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button onClick={handleSave} className="flex-1">
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowSaveDialog(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}