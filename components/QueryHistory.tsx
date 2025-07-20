import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Search, Trash2, Download, Filter, RotateCcw } from 'lucide-react';

interface QueryHistoryProps {
  onPromptSelect?: (prompt: any) => void;
}

// Mock history data for demo
const mockHistory = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop',
    description: 'Mountain landscape analysis completed',
    prompts: [
      'A serene mountain landscape with snow-capped peaks and alpine lake',
      'Golden hour photography of mountain reflections in crystal clear water'
    ],
    tags: ['landscape', 'mountains', 'nature'],
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    fileName: 'mountain-lake.jpg',
    status: 'completed'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=200&h=150&fit=crop',
    description: 'Forest scene analysis completed',
    prompts: [
      'Majestic forest cathedral with towering pine trees',
      'Sunbeams filtering through dense forest canopy'
    ],
    tags: ['forest', 'trees', 'nature'],
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    fileName: 'forest-cathedral.jpg',
    status: 'completed'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=150&fit=crop',
    description: 'Interior design analysis completed',
    prompts: [
      'Minimalist modern living room with clean architectural lines',
      'Scandinavian interior design with neutral color palette'
    ],
    tags: ['interior', 'modern', 'design'],
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    fileName: 'modern-living-room.jpg',
    status: 'completed'
  },
  {
    id: '4',
    image: null,
    description: 'Portrait analysis failed - unsupported format',
    prompts: [],
    tags: [],
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    fileName: 'portrait.bmp',
    status: 'failed'
  }
];

export function QueryHistory({ onPromptSelect }: QueryHistoryProps) {
  const [history, setHistory] = useState(mockHistory);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'failed'>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Filter history based on search and status
  const filteredHistory = history.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Group by date
  const groupedHistory = filteredHistory.reduce((groups, item) => {
    const date = new Date(item.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, typeof filteredHistory>);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const deleteItems = (ids: string[]) => {
    setHistory(prev => prev.filter(item => !ids.includes(item.id)));
    setSelectedItems([]);
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const clearHistory = () => {
    setHistory([]);
    setSelectedItems([]);
  };

  const retryAnalysis = (item: any) => {
    // Mock retry functionality
    console.log('Retrying analysis for:', item.fileName);
    // In a real app, this would trigger a new analysis
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {selectedItems.length > 0 && (
              <button
                onClick={() => deleteItems(selectedItems)}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
              >
                <Trash2 className="h-4 w-4" />
                Delete ({selectedItems.length})
              </button>
            )}
            
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto">
        {Object.keys(groupedHistory).length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto">
                <Clock className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <p className="font-medium text-slate-600 mb-1">No history found</p>
                <p className="text-sm text-slate-500">
                  {searchQuery ? 'Try adjusting your search' : 'Start analyzing images to see your history'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedHistory)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, items]) => (
                <div key={date}>
                  {/* Date Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <h3 className="font-medium text-slate-700">{formatDate(date)}</h3>
                    <div className="flex-1 h-px bg-slate-200"></div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`group bg-white border rounded-xl p-4 transition-all ${
                          item.status === 'completed'
                            ? 'border-slate-200 hover:border-blue-300 hover:shadow-sm cursor-pointer'
                            : 'border-red-200 bg-red-50'
                        }`}
                        onClick={() => item.status === 'completed' && onPromptSelect?.(item)}
                      >
                        <div className="flex gap-4">
                          {/* Checkbox */}
                          <div className="flex-shrink-0 pt-1">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => toggleSelection(item.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                            />
                          </div>

                          {/* Image */}
                          <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt="Analysis preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-6 h-6 bg-slate-300 rounded"></div>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <p className="font-medium text-slate-800 text-sm">
                                  {item.fileName}
                                </p>
                                <p className="text-sm text-slate-600 line-clamp-1">
                                  {item.description}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Clock className="h-3 w-3" />
                                <span>{formatTime(item.createdAt)}</span>
                                <span>•</span>
                                <span>{getRelativeTime(item.createdAt)}</span>
                              </div>
                            </div>

                            {/* Status and Actions */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {item.status === 'completed' ? 'Completed' : 'Failed'}
                                </span>
                                
                                {item.status === 'completed' && (
                                  <span className="text-xs text-slate-500">
                                    {item.prompts.length} prompts generated
                                  </span>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.status === 'failed' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      retryAnalysis(item);
                                    }}
                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Retry analysis"
                                  >
                                    <RotateCcw className="h-4 w-4" />
                                  </button>
                                )}
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteItems([item.id]);
                                  }}
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Tags */}
                            {item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {item.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {item.tags.length > 3 && (
                                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                                    +{item.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}