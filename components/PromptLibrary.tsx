import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { copyToClipboard, showTextForManualCopy } from './ui/utils';
import { Eye, Copy, Share2, Trash2 } from 'lucide-react';
import { SavedPrompt } from '../App';
import { toast } from 'sonner';

interface PromptLibraryProps {
  prompts: SavedPrompt[];
  onDelete: (id: string) => void;
}

export function PromptLibrary({ prompts, onDelete }: PromptLibraryProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<SavedPrompt | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleCopyToClipboard = async (text: string) => {
    if (!text) {
      toast.error('No text to copy!');
      return;
    }

    const success = await copyToClipboard(text);
    if (success) {
      toast.success('Prompt copied to clipboard!');
    } else {
      showTextForManualCopy(text, 'Copy Saved Prompt');
      toast.info('Please copy the text manually from the dialog.');
    }
  };

  const sharePrompt = async (prompt: SavedPrompt) => {
    // Check if the Web Share API is supported and available
    if (navigator.share) {
      try {
        const shareData = {
          title: `AI Prompt: ${prompt.name}`,
          text: `Check out this AI image prompt I generated:\n\n"${prompt.prompt}"\n\nGenerated on ${formatDate(prompt.createdAt)}`
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (prompts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-2">
            <h3 className="text-lg">No prompts saved yet</h3>
            <p className="text-gray-600">Upload an image and generate your first prompt!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl">Saved Prompts</h2>
          <Badge variant="secondary">{prompts.length} prompt{prompts.length !== 1 ? 's' : ''}</Badge>
        </div>

        <div className="grid gap-4">
          {prompts.map((prompt) => (
            <Card key={prompt.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={prompt.imageUrl}
                    alt={prompt.name}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium truncate">{prompt.name}</h3>
                        <p className="text-sm text-gray-600">{formatDate(prompt.createdAt)}</p>
                      </div>
                      <div className="flex gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedPrompt(prompt);
                                setShowPreviewDialog(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View full prompt</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyToClipboard(prompt.prompt)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy to clipboard</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => sharePrompt(prompt)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Share prompt</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedPrompt(prompt);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete prompt</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {prompt.prompt}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Preview Dialog */}
        <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedPrompt?.name}</DialogTitle>
              <DialogDescription>
                View the full prompt details and image for this saved prompt.
              </DialogDescription>
            </DialogHeader>
            {selectedPrompt && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <h3 className="font-medium">Image</h3>
                  <img
                    src={selectedPrompt.imageUrl}
                    alt={selectedPrompt.name}
                    className="w-full max-h-80 object-contain rounded-lg border"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Created: {formatDate(selectedPrompt.createdAt)}</span>
                    {selectedPrompt.style && selectedPrompt.style !== 'unknown' && (
                      <>
                        <span className="mx-2">•</span>
                        <Badge variant="outline" className="text-xs">
                          {selectedPrompt.style}
                        </Badge>
                      </>
                    )}
                  </div>
                  
                  <h3 className="font-medium">Generated Prompt</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm leading-relaxed">{selectedPrompt.prompt}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleCopyToClipboard(selectedPrompt.prompt)}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    onClick={() => sharePrompt(selectedPrompt)}
                    variant="outline"
                    size="sm"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Prompt Forever</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to permanently delete "{selectedPrompt?.name}"? This action cannot be undone and you will lose this prompt forever.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => {
                  if (selectedPrompt) {
                    onDelete(selectedPrompt.id);
                    setShowDeleteDialog(false);
                    setSelectedPrompt(null);
                  }
                }}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                Delete Forever
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}