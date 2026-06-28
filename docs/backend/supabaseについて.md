# supabase functions

- supabase functions serve によりデプロイせずともローカルで動かせる。
- 環境変数について、本番環境用のものはクラウドに置いておく。（ダッシュボードで操作あるいは
  cli で操作。）ローカル用のものは supabase/.env.local
  に置いておく。（コミットしない。）

## Deno 開発環境設定

### 目的

VSCode/Cursor で IntelliSense（補完・型情報・定義ジャンプ）を有効にする。

### 構成

```
supabase/functions/
├── deno.json          # 統一設定ファイル（editor向け）
├── import-map.json    # CLI向けの import map（supabase functions serve / deploy）
├── _shared/           # 共通モジュール
│   ├── cors.ts
│   └── supabase.ts
└── get-books/
    └── index.ts
```

### deno.json の役割

`supabase/functions/deno.json` で以下を一元管理:

- **import map**: `importMap` で `supabase/functions/import-map.json` を参照
- **compilerOptions**: Deno 用の型定義を指定

```json
{
  "importMap": "./import-map.json"
}
```

### supabase functions serve / deploy の import map

Supabase CLI は `import_map`
を参照するため、`supabase/functions/import-map.json` を用意し、
`supabase/config.toml` から参照する。`deno.json` は editor
向けの設定として残す。

### functions deploy の共通 import map

デプロイ時は `deno.json` の `importMap` を参照するため、
`supabase functions deploy <function-name>` を直接実行する。
`npm run functions:deploy -- <function-name>` でも同じ。

### 新しい function を作るときの注意

各 function に `deno.json` を作る必要はない。 共通の
`supabase/functions/deno.json` と `import-map.json` を使う運用。 ただし
`supabase/config.toml` に以下を追加する:

```
[functions.<function-name>]
enabled = true
verify_jwt = false
import_map = "./functions/import-map.json"
entrypoint = "./functions/<function-name>/index.ts"
```

### deno.lock について

CLI の Deno と `deno.lock` のバージョンが合わない場合はエラーになる。 その場合は
`supabase/functions/deno.lock` を削除して再デプロイする。

### VSCode 設定（.vscode/settings.json）

```json
{
  "deno.path": "./node_modules/deno/deno.exe", // プロジェクトローカルの Deno を使用
  "deno.enablePaths": ["supabase/functions"], // Deno を有効にするパスを限定（frontend との競合回避）
  "deno.config": "./supabase/functions/deno.json" // deno.json の場所を明示
}
```

### プロジェクトローカルの Deno

Deno はグローバルインストールせず、npm
パッケージとしてプロジェクト内に閉じ込めている:

```
node_modules/deno/deno.exe  ← 本体バイナリ
```

**メリット:**

- `package.json` でバージョン固定
- `npm install` でチーム全員が同じバージョンを使用
- グローバル環境を汚染しない

### import 文の書き方

import map を使うことで、`npm:` や `jsr:` プレフィックスを省略可能:

```typescript
// 外部ライブラリ
import { createClient } from "@supabase/supabase-js";
import "@supabase/functions-js/edge-runtime.d.ts";

// 共通モジュール（@shared/ エイリアス）
import { getCorsHeaders } from "@shared/cors.ts";
import { createServiceRoleClient } from "@shared/supabase.ts";
```

### キャッシュ更新

IntelliSense が効かない場合:

```bash
cd supabase/functions
deno cache --reload <ファイル名>
```
