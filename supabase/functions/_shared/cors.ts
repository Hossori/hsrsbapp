/**
 * CORS設定の共通モジュール
 *
 * ALLOWED_ORIGIN環境変数でCORSを制御します。
 * - ALLOWED_ORIGIN未設定: すべてのオリジンを許可（ローカル開発用）
 * - ALLOWED_ORIGIN設定済み: 指定したオリジンのみ許可（本番用）
 */

/**
 * 許可するオリジンを取得
 * @returns 許可するオリジン
 */
const getAllowedOrigin = (): string => {
  const allowedOrigin: string | undefined = Deno.env.get("ALLOWED_ORIGIN");
  if (!isProduction()) {
    // 開発環境
    return "*";
  } else {
    // 本番環境
    if (allowedOrigin === undefined) {
      // CORS未設定の場合
      throw new Error("ALLOWED_ORIGIN must be set in production");
    } else {
      return allowedOrigin;
    }
  }
}

/**
 * 本番環境かどうかを判定
 */
const isProduction = (): boolean => {
  return Deno.env.get("SUPABASE_URL")?.includes("supabase.co") ?? false;
};

/**
 * 開発環境用CORS Headers
 * ローカル開発時に使用（すべてのオリジンを許可）
 */
export const devCorsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * 本番環境用CORS Headers（テンプレート）
 * 実際の使用時は環境変数 ALLOWED_ORIGIN を設定してください
 */
export const prodCorsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": getAllowedOrigin(),
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  // セキュリティ強化用ヘッダー（本番環境推奨）
  "Access-Control-Allow-Credentials": "true",
};

/**
 * 環境に応じたCORS Headersを取得
 * 推奨: この関数を使用して環境に応じた設定を自動適用
 */
export const getCorsHeaders = (): Record<string, string> => {
  const origin = getAllowedOrigin();

  const headers: Record<string, string> = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

  // 本番環境ではCredentialsを許可
  if (isProduction()) {
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  return headers;
};

/**
 * CORS preflightリクエスト用のレスポンスを生成
 */
export const handleCorsPreflightRequest = (): Response => {
  return new Response(null, {
    status: 204,
    headers: {
      ...getCorsHeaders(),
      "Access-Control-Max-Age": "86400", // 24時間キャッシュ
    },
  });
};

/**
 * CORSヘッダーを含むJSONレスポンスを生成
 */
export const jsonResponse = (
  data: unknown,
  status: number = 200
): Response => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...getCorsHeaders(),
    },
  });
};

/**
 * CORSヘッダーを含むエラーレスポンスを生成
 */
export const errorResponse = (
  message: string,
  status: number = 500
): Response => {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...getCorsHeaders(),
    },
  });
};
