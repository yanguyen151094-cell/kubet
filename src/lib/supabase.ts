import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = import.meta.env.VITE_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || '';

const ENV_OK = !!SUPABASE_URL && !!SUPABASE_ANON_KEY;

if (!ENV_OK) {
  console.error('[supabase.ts] CRITICAL: Missing VITE_PUBLIC_SUPABASE_URL or VITE_PUBLIC_SUPABASE_ANON_KEY. Supabase will NOT work. Please set these environment variables in your deployment platform (e.g., Vercel Dashboard → Environment Variables).');
}

export const supabase = createClient(SUPABASE_URL || 'https://placeholder.helloreaddy.com', SUPABASE_ANON_KEY || 'placeholder', {
  auth: { autoRefreshToken: true, persistSession: true },
});

export function getSupabaseFunctionsUrl(functionName: string): string {
  return `${SUPABASE_URL}/functions/v1/${functionName}`;
}

export const isSupabaseReady = ENV_OK;