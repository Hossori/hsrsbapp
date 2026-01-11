/**
 * Supabaseクライアント作成の共通モジュール
 *
 * Supabase Edge Functionsでは以下の環境変数が自動的に設定されます:
 * - SUPABASE_URL: Supabase APIのURL
 * - SUPABASE_ANON_KEY: 匿名キー（クライアント用、RLSが適用される）
 * - SUPABASE_SERVICE_ROLE_KEY: サービスロールキー（サーバー用、RLSをバイパス）
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabaseの設定を取得
 */
interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!url) {
    throw new Error("SUPABASE_URL is not set");
  }

  return {
    url,
    anonKey: anonKey ?? "",
    serviceRoleKey: serviceRoleKey ?? "",
  };
};

/**
 * 匿名キーを使用したSupabaseクライアントを作成
 * - RLSポリシーが適用される
 * - ユーザーの認証情報を使用する場合に推奨
 */
export const createAnonClient = (): SupabaseClient => {
  const config = getSupabaseConfig();

  if (!config.anonKey) {
    throw new Error("SUPABASE_ANON_KEY is not set");
  }

  return createClient(config.url, config.anonKey);
};

/**
 * サービスロールキーを使用したSupabaseクライアントを作成
 * - RLSをバイパスする（管理者権限）
 * - サーバーサイドの内部処理で使用
 * - 注意: このクライアントはRLSを無視するため、適切なアクセス制御を実装すること
 */
export const createServiceRoleClient = (): SupabaseClient => {
  const config = getSupabaseConfig();

  if (!config.serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

/**
 * リクエストの Authorization ヘッダーからユーザー認証済みクライアントを作成
 * - ユーザーのJWTトークンを使用
 * - RLSポリシーがユーザーに基づいて適用される
 */
export const createAuthenticatedClient = (req: Request): SupabaseClient => {
  const config = getSupabaseConfig();
  const authHeader = req.headers.get("Authorization");

  if (!authHeader) {
    throw new Error("Authorization header is required");
  }

  const token = authHeader.replace("Bearer ", "");

  return createClient(config.url, config.anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};

/**
 * 後方互換性のためのエクスポート
 * 既存コードからの移行を容易にする
 */
export { createClient } from "@supabase/supabase-js";
export type { SupabaseClient } from "@supabase/supabase-js";
