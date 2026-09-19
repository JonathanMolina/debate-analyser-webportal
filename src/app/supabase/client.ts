import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ebjtumxwmcwzwidinvds.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVianR1bXh3bWN3endpZGludmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MDQyOTAsImV4cCI6MjEwNTM4MDI5MH0.tPVKw6l32HHAyU6HGu3UH-UvxFClRwnkqzoAbLu6KnM';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('<seu-projeto>'));

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});
