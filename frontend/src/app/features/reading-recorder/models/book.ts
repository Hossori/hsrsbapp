/**
 * 読書ステータス
 */
export type BookStatus = 'wishlist' | 'reading' | 'finished' | 'dropped';

/**
 * 書籍
 */
export interface Book {
  /** 書籍ID */
  id: string;
  /** ユーザーID */
  userId: string;
  /** 書籍タイトル */
  title: string;
  /** 著者 */
  author: string | null;
  /** ISBN */
  isbn: string | null;
  /** 総ページ数 */
  totalPages: number | null;
  /** 読書ステータス */
  status: BookStatus;
  /** 評価（1〜5）。未評価は null */
  rating: number | null;
  /** 感想・レビュー */
  review: string | null;
  /** 読書開始日 */
  startedAt: string | null;
  /** 読了日 */
  finishedAt: string | null;
  /** 表紙画像 URL */
  coverUrl: string | null;
  /** Google Books ID（将来連携用） */
  googleBooksId: string | null;
  /** 作成日時 */
  createdAt: string;
  /** 更新日時 */
  updatedAt: string;
}
