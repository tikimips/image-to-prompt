import React, { useState, useCallback } from 'react';
import { Upload, Camera, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { openAIService } from '../services/openai';

interface ImageUploadSectionProps {
  onPromptGenerated?: (prompt: any) => void;
}

export function ImageUploadSection({ onPromptGenerated }: ImageUploadSectionProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    setSelectedImage(file);
    setAnalysis(null);
    setError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleImageSelect(imageFile);
    }
  }, [handleImageSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  }, [handleImageSelect]);

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const base64Data = base64.split(',')[1]; // Remove data:image/... prefix
        
        try {
          const result = await openAIService.analyzeImage(base64Data);
          setAnalysis(result);
          
          // Create prompt object for preview
          const promptData = {
            id: Date.now().toString(),
            image: imagePreview,
            description: result.description,
            prompts: result.prompts,
            tags: result.tags,
            createdAt: new Date().toISOString(),
            fileName: selectedImage.name
          };
          
          onPromptGenerated?.(promptData);
        } catch (error) {
          console.error('Analysis error:', error);
          setError('Failed to analyze image. Please try again.');
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.error('File reading error:', error);
      setError('Failed to read image file.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto">
              {selectedImage ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <Upload className="h-8 w-8 text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">
                {selectedImage ? 'Image Selected' : 'Upload an Image'}
              </h3>
              <p className="text-sm text-slate-600 mb-2">
                {selectedImage 
                  ? `${selectedImage.name} (${(selectedImage.size / 1024 / 1024).toFixed(2)} MB)`
                  : 'Drag and drop an image here, or click to browse'
                }
              </p>
              <p className="text-xs text-slate-500">
                Supports: JPG, PNG, GIF, WebP (Max 10MB)
              </p>
            </div>
          </div>
        </label>
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="aspect-video w-full max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-sm">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="mt-4 flex justify-center">
            <button
              onClick={analyzeImage}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4" />
                  Analyze Image
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="font-medium text-red-800 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="flex-1 space-y-4 bg-slate-50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-slate-800">Analysis Complete</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Description</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{analysis.description}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Generated Prompts</h4>
              <div className="space-y-2">
                {analysis.prompts.map((prompt: string, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-slate-200">
                    <p className="text-sm text-slate-700">{prompt}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}