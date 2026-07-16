import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSupabasePublicConfig } from './supabase-config';

let client: SupabaseClient | null = null;

/**
 * ブラウザ用 Supabase クライアント（シングルトン）
 */
export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    const { url, anonKey } = getSupabasePublicConfig();
    client = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}
