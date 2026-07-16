/**
 * フロントエンド向け Supabase 公開設定
 * 値はビルド時に環境変数から埋め込む（anon key は公開前提・service_role は置かない）
 */
export interface SupabasePublicConfig {
  url: string;
  anonKey: string;
}

export function getSupabasePublicConfig(): SupabasePublicConfig {
  const url = process.env['SUPABASE_URL'];
  const anonKey = process.env['SUPABASE_ANON_KEY'];

  if (!url || !anonKey) {
    throw new Error(
      'SUPABASE_URL / SUPABASE_ANON_KEY が未設定です。frontend/.env を用意するか、ビルド環境変数を設定してください。',
    );
  }

  return { url, anonKey };
}
