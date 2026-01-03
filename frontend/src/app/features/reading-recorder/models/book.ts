/**
 * 書籍
 */
export interface Book {
    /** 書籍ID */
    id: string;
    /** 書籍名 */
    name: string;
    /** 作成日時 */
    createdAt: string;
    /** 更新日時 */
    updatedAt: string;
    /** ユーザーID */
    userId: string;
}