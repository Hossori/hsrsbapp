// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";

import {
  handleCorsPreflightRequest,
  jsonResponse,
  errorResponse,
} from "@shared/cors.ts";
import { createAuthenticatedClient } from "@shared/supabase.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return handleCorsPreflightRequest(req);
  }

  if (req.method !== "POST" && req.method !== "GET") {
    return errorResponse(req, "Method not allowed", 405);
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return errorResponse(req, "Unauthorized", 401);
    }

    // ユーザー JWT + anon key。RLS により本人の books のみ返る
    const supabase = createAuthenticatedClient(req);

    const { data, error } = await supabase
      .from("books")
      .select(
        "id, user_id, title, author, isbn, total_pages, status, rating, review, started_at, finished_at, cover_url, google_books_id, created_at, updated_at",
      )
      .order("created_at");

    if (error) {
      console.error("get-books query failed:", error.message);
      return errorResponse(req, "Failed to fetch books", 500);
    }

    return jsonResponse(req, data);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    console.error("get-books unexpected error:", detail);
    return errorResponse(req, "Internal server error", 500);
  }
});
