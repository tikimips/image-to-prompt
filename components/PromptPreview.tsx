import React, { useState } from 'react';
import { Copy, Download, Heart, Share2, Tag, Calendar, Image as ImageIcon, CheckCircle } from 'lucide-react';

interface PromptPreviewProps {
  prompt: {
    id: string;
    image?: string;
    description: string;
    prompts: string[];
    tags: string[];
    createdAt: string;
    fileName?: string;
  };
}

export function PromptPreview({ prompt }: PromptPreviewProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadPrompts = () => {
    const content = `Image Analysis Report
Generated: ${formatDate(prompt.createdAt)}
${prompt.fileName ? `File: ${prompt.fileName}` : ''}

Description:
${prompt.description}

Generated Prompts:
${prompt.prompts.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Tags:
${prompt.tags.join(', ')}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-analysis-${prompt.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(prompt.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-lg transition-colors ${
              isFavorite
                ? 'text-red-500 bg-red-50 hover:bg-red-100'
                : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
            }`}
            title="Add to favorites"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={downloadPrompts}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Download report"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Share"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Image Preview */}
      {prompt.image && (
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="aspect-video w-full bg-white rounded-lg overflow-hidden shadow-sm">
            <img
              src={prompt.image}
              alt="Analyzed image"
              className="w-full h-full object-contain"
            />
          </div>
          {prompt.fileName && (
            <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
              <ImageIcon className="h-4 w-4" />
              <span className="truncate">{prompt.fileName}</span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 space-y-6 overflow-y-auto">
        {/* Description */}
        <div>
          <h4 className="font-medium text-slate-800 mb-3">Description</h4>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-sm text-slate-700 leading-relaxed">{prompt.description}</p>
          </div>
        </div>

        {/* Generated Prompts */}
        <div>
          <h4 className="font-medium text-slate-800 mb-3">Generated Prompts</h4>
          <div className="space-y-3">
            {prompt.prompts.map((promptText, index) => (
              <div key={index} className="group bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-slate-700 leading-relaxed flex-1">{promptText}</p>
                  <button
                    onClick={() => copyToClipboard(promptText, index)}
                    className="flex-shrink-0 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Copy prompt"
                  >
                    {copiedIndex === index ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <h4 className="font-medium text-slate-800 mb-3">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {prompt.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}