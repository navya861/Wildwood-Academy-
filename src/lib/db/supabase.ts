import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  ((supabaseAnonKey && supabaseAnonKey !== 'your-anon-public-key') || supabaseServiceKey)
);

// Client-side / Anon Supabase Client
export function getSupabaseClient() {
  if (!isSupabaseConfigured) return null;
  return createClient(supabaseUrl!, supabaseAnonKey || supabaseServiceKey!);
}

// Privileged Server-side Supabase Client (Service Role)
export function getSupabaseAdmin() {
  if (!isSupabaseConfigured || !supabaseServiceKey) return null;
  return createClient(supabaseUrl!, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
