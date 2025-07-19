import { supabase, isSupabaseConfigured } from './supabase';
import type { User } from '@supabase/supabase-js';

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

    if (error) throw error;
    return data;
  },

  async signOut() {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    if (!isSupabaseConfigured || !supabase) {
      return { session: null, error: null };
    }

    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!isSupabaseConfigured || !supabase) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }

    return supabase.auth.onAuthStateChange(callback);
  }
};