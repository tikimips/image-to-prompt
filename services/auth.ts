import { supabase, isSupabaseConfigured } from './supabase';

export const authService = {
  async signInWithGoogle() {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      throw error;
    }

    return data;
  },

  async signOut() {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
  },

  async getSession() {
    if (!isSupabaseConfigured || !supabase) {
      return { session: null, error: null };
    }

    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  }
};