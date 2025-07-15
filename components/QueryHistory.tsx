import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Copy, Share2, Clock, Save, ImageIcon, Sparkles, Wand2, Loader2 } from 'lucide-react';
import { QueryHistory as QueryHistoryType, SavedPrompt } from '../App';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { openAIService, ImageGenerationResult } from '../services/openai';

interface QueryHistoryProps {
  queries: QueryHistoryType[];
  onSave: (prompt: SavedPrompt) => void;
  onSaveFromHistory?: (prompt: SavedPrompt, queryId: string) => void;
}

export function QueryHistory({ queries, onSave, onSaveFromHistory }: QueryHistoryProps) {
  const [selectedQuery, setSelectedQuery] = useState<QueryHistoryType | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [promptName, setPromptName] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<ImageGenerationResult | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handleGenerateImage = async (query: QueryHistoryType) => {
    if (!query.prompt) return;
    
    setIsGeneratingImage(true);
    setGeneratedImage(null);
    
    try {
      const result = await openAIService.generateImage(query.prompt, query.style);
      setGeneratedImage(result);
      
      if (openAIService.isConfigured()) {
        toast.success('Image generated successfully!');
      } else {
        toast.info('Demo image generated. Configure OpenAI API key for real image generation.');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleQuerySelect = (query: QueryHistoryType) => {
    setSelectedQuery(query);
    setGeneratedImage(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Prompt copied to clipboard!');
  };

  const sharePrompt = (query: QueryHistoryType) => {
    if (navigator.share) {
      navigator.share({
        title: 'Generated AI Prompt',
        text: query.prompt,
      });
    } else {
      copyToClipboard(query.prompt);
    }
  };

  const handleSave = () => {
    if (!selectedQuery || !promptName.trim()) {
      toast.error('Please enter a name for the prompt');
      return;
    }

    const newPrompt: SavedPrompt = {
      id: Date.now().toString(),
      name: promptName,
      prompt: selectedQuery.prompt,
      imageUrl: selectedQuery.imageUrl,
      createdAt: new Date().toISOString(),
      style: selectedQuery.style
    };

    if (onSaveFromHistory) {
      onSaveFromHistory(newPrompt, selectedQuery.id);
    } else {
      onSave(newPrompt);
    }
    
    setShowSaveDialog(false);
    setPromptName('');
    toast.success('Prompt saved successfully!');
  };

  const getStyleDisplayName = (style: string) => {
    const styleMap: { [key: string]: string } = {
      'photorealistic': 'Photorealistic',
      'digital_art': 'Digital Art',
      'digital art': 'Digital Art',
      'vintage': 'Vintage',
      'minimalist': 'Minimalist',
      'abstract': 'Abstract',
      'watercolor': 'Watercolor',
      'oil_painting': 'Oil Painting',
      'oil painting': 'Oil Painting',
      'sketch': 'Sketch',
      'unknown': 'Unknown'
    };
    return styleMap[style] || style.charAt(0).toUpperCase() + style.slice(1);
  };

  if (queries.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-2">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg">No query history</h3>
            <p className="text-gray-600">Generate some prompts to see your history here!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Query History ({queries.length}/50)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {queries.map((query) => (
              <div
                key={query.id}
                onClick={() => handleQuerySelect(query)}
                className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <img
                  src={query.imageUrl}
                  alt="Query"
                  className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{query.prompt}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {query.style && query.style !== 'unknown' && (
                      <Badge variant="outline" className="text-xs">
                        {getStyleDisplayName(query.style)}
                      </Badge>
                    )}
                    {query.confidence && (
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(query.confidence * 100)}%
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">
                      {new Date(query.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedQuery && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-medium">Original Image</h3>
                  <img
                    src={selectedQuery.imageUrl}
                    alt="Original"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Generated Image Preview</h3>
                    <Button
                      onClick={() => handleGenerateImage(selectedQuery)}
                      disabled={isGeneratingImage}
                      size="sm"
                      variant="outline"
                    >
                      {isGeneratingImage ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {openAIService.isConfigured() ? 'Generating...' : 'Creating...'}
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          {openAIService.isConfigured() ? 'Generate Image' : 'Create Demo'}
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="relative">
                    {generatedImage ? (
                      <div className="space-y-2">
                        <ImageWithFallback
                          src={generatedImage.imageUrl}
                          alt="Generated image from prompt"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        {selectedQuery.style && selectedQuery.style !== 'unknown' && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary">
                              {getStyleDisplayName(selectedQuery.style)}
                            </Badge>
                          </div>
                        )}
                        <div className="text-xs text-gray-500 text-center">
                          {openAIService.isConfigured() ? 'Generated with DALL-E 3' : 'Demo image - Configure API key for real generation'}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                        <div className="text-center space-y-2">
                          <ImageIcon className="h-12 w-12 mx-auto" />
                          <p className="text-sm">Click "Generate Image" to create a preview</p>
                          <p className="text-xs text-gray-400">
                            {openAIService.isConfigured() ? 'Uses DALL-E 3 API' : 'Demo mode - uses sample images'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedQuery.confidence && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800">
                    <Sparkles className="h-4 w-4 inline mr-1" />
                    AI Analysis Confidence: {Math.round(selectedQuery.confidence * 100)}%
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Prompt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Clock className="h-4 w-4" />
                Generated on {new Date(selectedQuery.createdAt).toLocaleString()}
                {selectedQuery.style && selectedQuery.style !== 'unknown' && (
                  <>
                    <span className="mx-2">•</span>
                    <Badge variant="outline" className="text-xs">
                      {getStyleDisplayName(selectedQuery.style)}
                    </Badge>
                  </>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm leading-relaxed">{selectedQuery.prompt}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(selectedQuery.prompt)}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  onClick={() => sharePrompt(selectedQuery)}
                  variant="outline"
                  size="sm"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save to Library
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save to Library</DialogTitle>
                      <DialogDescription>
                        Save this prompt from your history to your library with a custom name.
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
                        />
                      </div>
                      {selectedQuery.style && selectedQuery.style !== 'unknown' && (
                        <div className="text-sm text-gray-600">
                          Detected style: <span className="font-medium">{getStyleDisplayName(selectedQuery.style)}</span>
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
        </div>
      )}
    </div>
  );
}