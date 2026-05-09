import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = import.meta.env.VITE_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('[supabase.ts] Missing env vars: VITE_PUBLIC_SUPABASE_URL or VITE_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: true, persistSession: true },
});

export function getSupabaseFunctionsUrl(functionName: string): string {
  const url = `${SUPABASE_URL}/functions/v1/${functionName}`;
  return url;
}