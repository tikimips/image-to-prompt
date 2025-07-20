import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Heart, Calendar, Tag, Image as ImageIcon } from 'lucide-react';

interface PromptLibraryProps {
  onPromptSelect?: (prompt: any) => void;
}

// Mock data for demo purposes
const mockPrompts = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    description: 'A serene mountain landscape with snow-capped peaks reflecting in a crystal clear alpine lake during golden hour.',
    prompts: [
      'A serene mountain landscape with snow-capped peaks and alpine lake',
      'Golden hour photography of mountain reflections in crystal clear water',
      'Peaceful wilderness scene with dramatic mountain backdrop'
    ],
    tags: ['landscape', 'mountains', 'nature', 'golden hour', 'reflections'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    fileName: 'mountain-lake.jpg',
    isFavorite: true
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&h=300&fit=crop',
    description: 'A majestic forest with tall pine trees creating a natural cathedral, with rays of sunlight filtering through the canopy.',
    prompts: [
      'Majestic forest cathedral with towering pine trees',
      'Sunbeams filtering through dense forest canopy',
      'Mystical woodland scene with dramatic lighting'
    ],
    tags: ['forest', 'trees', 'sunlight', 'nature', 'mystical'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    fileName: 'forest-cathedral.jpg',
    isFavorite: false
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    description: 'A minimalist modern living room with clean lines, neutral colors, and abundant natural light.',
    prompts: [
      'Minimalist modern living room with clean architectural lines',
      'Scandinavian interior design with neutral color palette',
      'Contemporary home decor with natural lighting'
    ],
    tags: ['interior', 'modern', 'minimalist', 'architecture', 'design'],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    fileName: 'modern-living-room.jpg',
    isFavorite: false
  }
];

export function PromptLibrary({ onPromptSelect }: PromptLibraryProps) {
  const [prompts, setPrompts] = useState(mockPrompts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'favorites'>('recent');

  // Get all unique tags
  const allTags = Array.from(new Set(prompts.flatMap(p => p.tags)));

  // Filter and sort prompts
  const filteredPrompts = prompts
    .filter(prompt => {
      const matchesSearch = searchQuery === '' || 
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => prompt.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'favorites':
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleFavorite = (promptId: string) => {
    setPrompts(prev => prev.map(p => 
      p.id === promptId ? { ...p, isFavorite: !p.isFavorite } : p
    ));
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
            placeholder="Search prompts, descriptions, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          {/* View Mode */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">View:</span>
            <div className="flex border border-slate-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="favorites">Favorites First</option>
            </select>
          </div>
        </div>

        {/* Tag Filter */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Filter by tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {filteredPrompts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <p className="font-medium text-slate-600 mb-1">No prompts found</p>
                <p className="text-sm text-slate-500">
                  Try adjusting your search or filters
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
            {filteredPrompts.map((prompt) => (
              <div
                key={prompt.id}
                onClick={() => onPromptSelect?.(prompt)}
                className="group bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer"
              >
                {viewMode === 'grid' ? (
                  <div className="space-y-3">
                    {/* Image */}
                    {prompt.image && (
                      <div className="aspect-video w-full bg-slate-100 rounded-lg overflow-hidden">
                        <img
                          src={prompt.image}
                          alt="Prompt preview"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm text-slate-700 line-clamp-2 flex-1">
                          {prompt.description}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(prompt.id);
                          }}
                          className={`flex-shrink-0 p-1 rounded transition-colors ${
                            prompt.isFavorite
                              ? 'text-red-500'
                              : 'text-slate-400 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${prompt.isFavorite ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(prompt.createdAt)}</span>
                        </div>
                        <span>{prompt.prompts.length} prompts</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {prompt.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {prompt.tags.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                            +{prompt.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    {/* Image */}
                    {prompt.image && (
                      <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={prompt.image}
                          alt="Prompt preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm text-slate-700 line-clamp-2">
                          {prompt.description}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(prompt.id);
                          }}
                          className={`flex-shrink-0 p-1 rounded transition-colors ${
                            prompt.isFavorite
                              ? 'text-red-500'
                              : 'text-slate-400 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${prompt.isFavorite ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(prompt.createdAt)}</span>
                          </div>
                          <span>{prompt.prompts.length} prompts</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {prompt.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {prompt.tags.length > 4 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                            +{prompt.tags.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}