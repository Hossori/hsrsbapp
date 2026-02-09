# OAS定義について

## 目的

OpenAPI 定義を単一ソースとして管理し、TypeScript の型を自動生成する。
将来的にバックエンドが Spring(Kotlin) へ移行しても、同じ OAS を使い回せる構成を目指す。

## 採用した構成

- エントリは `openapi/openapi.yaml` の 1 ファイル
- 画面/機能ごとに `openapi/features/**/paths.yaml` を分割
- エントリから `$ref` で明示的に参照する

理由:

- 自動探索よりも依存関係が明確になり、ツールの互換性が高い
- 将来の変更時にどこを直すかが分かりやすい

## 採用したツール

- `openapi-typescript`
  - TypeScript の型だけを軽量に生成できる
  - フロントエンドの型安全性を高く保てる
- `@redocly/cli`
  - OpenAPI を単一ファイルにバンドルできる
  - `swagger-cli` は廃止されているため置き換え

## 生成フロー（npm scripts）

- `openapi:bundle`
  - `openapi/openapi.yaml` を `openapi/dist/openapi.yaml` にバンドル
- `openapi:typegen`
  - バンドルされた YAML から型を生成
  - 出力先: `frontend/src/generated/openapi/types.d.ts`
- `openapi:clean`
  - 一時バンドルを削除
- `openapi:generate`
  - 上記 3 つを順番に実行
