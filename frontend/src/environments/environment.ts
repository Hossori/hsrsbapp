// このファイルは環境変数のテンプレートです。
// ビルド時にangular.jsonのdefineで環境変数が注入されます。
// 秘密情報は.envファイルに保存し、このファイルには含めないでください。

// angular.jsonのdefineで注入される環境変数
// 注意: @types/nodeは使用しません。理由：
// - processはビルド時にangular.jsonのdefineで値が置換される（実行時には存在しない）
// - ブラウザアプリにNode.js型定義を混入させないため
// - 必要最小限の環境変数のみを明示的に型定義
declare const process: {
  env: {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
  };
};

export const environment = {
  production: false,
  supabaseUrl: process.env['SUPABASE_URL'] || '',
  supabaseAnonKey: process.env['SUPABASE_ANON_KEY'] || '',
};
