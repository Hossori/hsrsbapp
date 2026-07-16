/**
 * CORS 設定
 *
 * ALLOWED_ORIGINS: カンマ区切りの許可 Origin リスト（本番必須）
 * 例: http://localhost:4200,https://example.com
 *
 * - リクエスト Origin がリストに含まれる場合のみ反映（reflect）
 * - 本番（*.supabase.co）で未設定 / 不一致の場合は ACAO を付けない（fail-closed）
 * - ローカル（127.0.0.1 / localhost）で未設定のときのみ "*" を許容
 * - "*" のときは Credentials を付けない
 */

const LOCAL_SUPABASE_HOST_PATTERN = /localhost|127\.0\.0\.1/;

const parseAllowedOrigins = (): string[] => {
  const raw =
    Deno.env.get("ALLOWED_ORIGINS") ?? Deno.env.get("ALLOWED_ORIGIN") ?? "";
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
};

const isLocalRuntime = (): boolean => {
  const url = Deno.env.get("SUPABASE_URL") ?? "";
  return LOCAL_SUPABASE_HOST_PATTERN.test(url);
};

/**
 * 許可する Access-Control-Allow-Origin を決定する。
 * 許可できない場合は null（ヘッダー非付与 = ブラウザがブロック）。
 */
const resolveAllowedOrigin = (req: Request): string | null => {
  const requestOrigin = req.headers.get("Origin");
  const allowedOrigins = parseAllowedOrigins();

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }

  if (allowedOrigins.includes("*")) {
    return "*";
  }

  // ローカル開発のみ、未設定時は緩める
  if (isLocalRuntime() && allowedOrigins.length === 0) {
    return requestOrigin ?? "*";
  }

  return null;
};

/**
 * 環境・リクエストに応じた CORS Headers を返す
 */
export const getCorsHeaders = (req: Request): Record<string, string> => {
  const allowOrigin = resolveAllowedOrigin(req);

  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    Vary: "Origin",
  };

  if (allowOrigin) {
    headers["Access-Control-Allow-Origin"] = allowOrigin;
    if (allowOrigin !== "*") {
      headers["Access-Control-Allow-Credentials"] = "true";
    }
  }

  return headers;
};

/**
 * CORS preflight リクエスト用のレスポンス
 */
export const handleCorsPreflightRequest = (req: Request): Response => {
  return new Response(null, {
    status: 204,
    headers: {
      ...getCorsHeaders(req),
      "Access-Control-Max-Age": "86400",
    },
  });
};

/**
 * CORS ヘッダー付き JSON レスポンス
 */
export const jsonResponse = (
  req: Request,
  data: unknown,
  status: number = 200,
): Response => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...getCorsHeaders(req),
    },
  });
};

/**
 * CORS ヘッダー付きエラーレスポンス
 */
export const errorResponse = (
  req: Request,
  message: string,
  status: number = 500,
): Response => {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...getCorsHeaders(req),
    },
  });
};
