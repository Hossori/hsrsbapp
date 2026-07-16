/**
 * Angular define（angular.json）でビルド時に置換される環境変数の型定義
 */
declare const process: {
  env: {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
  };
};
