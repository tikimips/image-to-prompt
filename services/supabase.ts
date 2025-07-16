import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface SavedPrompt {
  id: string;
  user_id: string;
  name: string;
  prompt: string;
  image_url: string;
  style: string;
  created_at: string;
  updated_at: string;
}

export interface QueryHistory {
  id: string;
  user_id: string;
  prompt: string;
  image_url: string;
  style: string;
  confidence?: number;
  created_at: string;
}

// Saved Prompts Functions
export const savedPromptsService = {
  // Get all saved prompts for the current user
  async getAll(userId: string): Promise<SavedPrompt[]> {
    try {
      const { data, error } = await supabase
        .from('saved_prompts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved prompts:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAll saved prompts:', error);
      return [];
    }
  },

  // Save a new prompt
  async save(userId: string, prompt: Omit<SavedPrompt, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<SavedPrompt | null> {
    try {
      const { data, error } = await supabase
        .from('saved_prompts')
        .insert([
          {
            user_id: userId,
            name: prompt.name,
            prompt: prompt.prompt,
            image_url: prompt.image_url,
            style: prompt.style,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error saving prompt:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in save prompt:', error);
      return null;
    }
  },

  // Delete a saved prompt
  async delete(userId: string, promptId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('saved_prompts')
        .delete()
        .eq('id', promptId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting prompt:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in delete prompt:', error);
      return false;
    }
  },

  // Update a saved prompt
  async update(userId: string, promptId: string, updates: Partial<Pick<SavedPrompt, 'name' | 'prompt' | 'style'>>): Promise<SavedPrompt | null> {
    try {
      const { data, error } = await supabase
        .from('saved_prompts')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', promptId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating prompt:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in update prompt:', error);
      return null;
    }
  }
};

// Query History Functions
export const queryHistoryService = {
  // Get all query history for the current user
  async getAll(userId: string): Promise<QueryHistory[]> {
    try {
      const { data, error } = await supabase
        .from('query_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50); // Limit to last 50 queries

      if (error) {
        console.error('Error fetching query history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAll query history:', error);
      return [];
    }
  },

  // Add a new query to history
  async add(userId: string, query: Omit<QueryHistory, 'id' | 'user_id' | 'created_at'>): Promise<QueryHistory | null> {
    try {
      const { data, error } = await supabase
        .from('query_history')
        .insert([
          {
            user_id: userId,
            prompt: query.prompt,
            image_url: query.image_url,
            style: query.style,
            confidence: query.confidence,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding to query history:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in add query history:', error);
      return null;
    }
  },

  // Delete a query from history
  async delete(userId: string, queryId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('query_history')
        .delete()
        .eq('id', queryId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting query:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in delete query:', error);
      return false;
    }
  },

  // Clear all history for a user
  async clearAll(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('query_history')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Error clearing history:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in clear all history:', error);
      return false;
    }
  }
};

// Utility function to create tables if they don't exist
export const initializeTables = async () => {
  try {
    // The tables should be created in Supabase dashboard or via SQL
    // This is just for reference - you'll need to create these tables manually
    console.log('Tables should be created in Supabase dashboard');
  } catch (error) {
    console.error('Error initializing tables:', error);
  }
};

// SQL for creating tables (run this in Supabase SQL Editor):
export const SQL_CREATE_TABLES = `
-- Create saved_prompts table
CREATE TABLE IF NOT EXISTS saved_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  style TEXT DEFAULT 'unknown',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create query_history table
CREATE TABLE IF NOT EXISTS query_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  style TEXT DEFAULT 'unknown',
  confidence DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS saved_prompts_user_id_idx ON saved_prompts(user_id);
CREATE INDEX IF NOT EXISTS saved_prompts_created_at_idx ON saved_prompts(created_at);
CREATE INDEX IF NOT EXISTS query_history_user_id_idx ON query_history(user_id);
CREATE INDEX IF NOT EXISTS query_history_created_at_idx ON query_history(created_at);

-- Enable Row Level Security
ALTER TABLE saved_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE query_history ENABLE ROW LEVEL SECURITY;

-- Create policies for saved_prompts
CREATE POLICY "Users can view their own saved prompts" ON saved_prompts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved prompts" ON saved_prompts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved prompts" ON saved_prompts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved prompts" ON saved_prompts
    FOR DELETE USING (auth.uid() = user_id);

-- Create policies for query_history
CREATE POLICY "Users can view their own query history" ON query_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own query history" ON query_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own query history" ON query_history
    FOR DELETE USING (auth.uid() = user_id);
`;