import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { copyToClipboard, showTextForManualCopy } from './ui/utils';
import { Copy, Share2, Clock, Save, ImageIcon, Sparkles } from 'lucide-react';
import { QueryHistory as QueryHistoryType, SavedPrompt } from '../App';
import { toast } from 'sonner';

interface QueryHistoryProps {
  queries: QueryHistoryType[];
  onSave: (prompt: SavedPrompt) => void;
  onSaveFromHistory?: (prompt: SavedPrompt, queryId: string) => void;
}

export function QueryHistory({ queries, onSave, onSaveFromHistory }: QueryHistoryProps) {
  const [selectedQuery, setSelectedQuery] = useState<QueryHistoryType | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [promptName, setPromptName] = useState<string>('');
  const [savingQuery, setSavingQuery] = useState<QueryHistoryType | null>(null);

  const handleCopyToClipboard = async (text: string) => {
    if (!text) {
      toast.error('No text to copy!');
      return;
    }

    const success = await copyToClipboard(text);
    if (success) {
      toast.success('Prompt copied to clipboard!');
    } else {
      showTextForManualCopy(text, 'Copy Prompt from History');
      toast.info('Please copy the text manually from the dialog.');
    }
  };

  const sharePrompt = async (query: QueryHistoryType) => {
    // Check if the Web Share API is supported and available
    if (navigator.share) {
      try {
        const shareData = {
          title: 'AI Generated Image Prompt',
          text: `Check out this AI image prompt I generated:\n\n"${query.prompt}"\n\nGenerated on ${new Date(query.createdAt).toLocaleDateString()}${query.style && query.style !== 'unknown' ? `\nStyle: ${getStyleDisplayName(query.style)}` : ''}`
        };

        await navigator.share(shareData);
        toast.success('Prompt shared successfully!');
      } catch (error) {
        // Handle different types of share errors
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            // User cancelled - don't show error or fallback
            return;
          } else if (error.name === 'NotAllowedError') {
            toast.error('Share permission denied. Please allow sharing to use this feature.');
            return;
          } else {
            console.warn('Share failed:', error.message);
            toast.error('Share failed. Please try again.');
            return;
          }
        }
        console.warn('Share failed with unknown error:', error);
        toast.error('Share failed. Please try again.');
      }
    } else {
      // Web Share API not supported - inform user
      toast.error('Native sharing is not supported on this device/browser. Use the copy button instead.');
    }
  };

  const handleSave = () => {
    const queryToSave = savingQuery || selectedQuery;
    if (!promptName.trim()) {
      toast.error('Please enter a name for the prompt');
      return;
    }
    
    if (!queryToSave) {
      toast.error('No query selected');
      return;
    }

    try {
      // Use the new handleSaveFromHistory function if available, otherwise fallback to original
      if (onSaveFromHistory && savingQuery) {
        handleSaveFromHistory(queryToSave, promptName);
      } else {
        const newPrompt: SavedPrompt = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: promptName.trim(),
          prompt: queryToSave.prompt,
          imageUrl: queryToSave.imageUrl,
          createdAt: new Date().toISOString(),
          style: queryToSave.style
        };
        onSave(newPrompt);
        toast.success('Prompt saved successfully!');
      }
      
      setShowSaveDialog(false);
      setPromptName('');
      setSavingQuery(null);
      setShowPreviewModal(false);
      setSelectedQuery(null);
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast.error('Failed to save prompt. Please try again.');
    }
  };

  const handleQuickSave = (query: QueryHistoryType, event: React.MouseEvent) => {
    event.stopPropagation();
    setSavingQuery(query);
    setPromptName('');
    setShowSaveDialog(true);
  };

  const handleSaveFromHistory = (query: QueryHistoryType, promptName: string) => {
    if (onSaveFromHistory) {
      const newPrompt: SavedPrompt = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: promptName.trim(),
        prompt: query.prompt,
        imageUrl: query.imageUrl,
        createdAt: new Date().toISOString(),
        style: query.style
      };
      onSaveFromHistory(newPrompt, query.id);
    }
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
        <CardContent className="pr-6">
          <div className="grid gap-3 max-h-96 overflow-y-auto pr-2">
            {queries.map((query) => (
              <div
                key={query.id}
                onClick={() => {
                  setSelectedQuery(query);
                  setShowPreviewModal(true);
                }}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 relative group"
              >
                <img
                  src={query.imageUrl}
                  alt="Query"
                  className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0 pr-16">
                  <p className="text-sm line-clamp-2 leading-5">{query.prompt}</p>
                  <div className="flex items-center gap-2 mt-2">
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
                <div className="absolute top-3 right-3 z-20">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleQuickSave(query, e)}
                          className="h-8 w-8 p-0"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Save to library</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Dialog for quick save from list */}
      <Dialog open={showSaveDialog} onOpenChange={(open) => {
        setShowSaveDialog(open);
        if (!open) {
          setSavingQuery(null);
          // If we came from the preview modal, reopen it
          if (selectedQuery && !open) {
            setShowPreviewModal(true);
          }
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save to Library</DialogTitle>
            <DialogDescription>
              Save this prompt to your library with a custom name. It will be removed from your history.
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
            {(savingQuery || selectedQuery)?.style && (savingQuery || selectedQuery)?.style !== 'unknown' && (
              <div className="text-sm text-gray-600">
                Detected style: <span className="font-medium">{getStyleDisplayName((savingQuery || selectedQuery)?.style || '')}</span>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                Save
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowSaveDialog(false);
                  setSavingQuery(null);
                  // If we came from the preview modal, reopen it
                  if (selectedQuery) {
                    setShowPreviewModal(true);
                  }
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Query Details
            </DialogTitle>
            <DialogDescription>
              View the full image and generated prompt details.
            </DialogDescription>
          </DialogHeader>
          
          {selectedQuery && (
            <div className="space-y-6">
              {/* Image Section */}
              <div className="space-y-3">
                <h3 className="font-medium">Original Image</h3>
                <img
                  src={selectedQuery.imageUrl}
                  alt="Original"
                  className="w-full max-h-80 object-contain rounded-lg border"
                />
              </div>

              {/* Confidence Badge */}
              {selectedQuery.confidence && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800">
                    <Sparkles className="h-4 w-4 inline mr-1" />
                    AI Analysis Confidence: {Math.round(selectedQuery.confidence * 100)}%
                  </p>
                </div>
              )}

              {/* Prompt Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
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

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => handleCopyToClipboard(selectedQuery.prompt)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => sharePrompt(selectedQuery)}
                          variant="outline"
                          size="sm"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share prompt</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" onClick={() => {
                          setSavingQuery(selectedQuery);
                          setShowPreviewModal(false);
                          setShowSaveDialog(true);
                        }}>
                          <Save className="h-4 w-4 mr-2" />
                          Save to Library
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Save to library</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}