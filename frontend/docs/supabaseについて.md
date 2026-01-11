# supabase functions

- supabase functions serve によりデプロイせずともローカルで動かせる。
- 環境変数について、本番環境用のものはクラウドに置いておく。（ダッシュボードで操作あるいは cli で操作。）ローカル用のものは supabase/.env.local に置いておく。（コミットしない。）

## Deno 開発環境設定

### 目的

VSCode/Cursor で IntelliSense（補完・型情報・定義ジャンプ）を有効にする。

### 構成

```
supabase/functions/
├── deno.json          # 統一設定ファイル（import map含む）
├── _shared/           # 共通モジュール
│   ├── cors.ts
│   └── supabase.ts
└── get-books/
    └── index.ts
```

### deno.json の役割

`supabase/functions/deno.json` で以下を一元管理:

- **import map**: パスエイリアスを定義し、import 文を簡潔にする
- **compilerOptions**: Deno 用の型定義を指定

```json
{
  "imports": {
    "@supabase/supabase-js": "npm:@supabase/supabase-js@2",
    "@supabase/functions-js/edge-runtime.d.ts": "jsr:@supabase/functions-js/edge-runtime.d.ts",
    "@shared/": "./_shared/"
  }
}
```

### VSCode 設定（.vscode/settings.json）

```json
{
  "deno.path": "./node_modules/deno/deno.exe", // プロジェクトローカルの Deno を使用
  "deno.enablePaths": ["supabase/functions"], // Deno を有効にするパスを限定（frontend との競合回避）
  "deno.config": "./supabase/functions/deno.json" // deno.json の場所を明示
}
```

### プロジェクトローカルの Deno

Deno はグローバルインストールせず、npm パッケージとしてプロジェクト内に閉じ込めている:

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
import { createClient } from '@supabase/supabase-js';
import '@supabase/functions-js/edge-runtime.d.ts';

// 共通モジュール（@shared/ エイリアス）
import { getCorsHeaders } from '@shared/cors.ts';
import { createServiceRoleClient } from '@shared/supabase.ts';
```

### キャッシュ更新

IntelliSense が効かない場合:

```bash
cd supabase/functions
deno cache --reload <ファイル名>
```