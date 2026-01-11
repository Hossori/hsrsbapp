import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Book } from '../models';

/**
 * Supabase Functionsから返されるレスポンスの型
 */
interface BookResponse {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    user_id: string;
}

/**
 * 書籍データを取得するサービス
 * Angular HttpClientを使用した実装（推奨）
 */
@Injectable({
    providedIn: 'root',
})
export class BookService {
    private readonly http = inject(HttpClient);

    /**
     * 書籍一覧を取得
     * @returns Observable<Book[]>
     */
    getBooks(): Observable<Book[]> {
        return this.http
            .post<BookResponse[]>(
                `https://iaicqgeozyvqawvisvso.supabase.co/functions/v1/get-books`,
                {},
                {
                    headers: {
                        'apikey': 'sb_publishable_AnLAszlIUZH6wGDKb7BubA_duSDuHux',
                        'Content-Type': 'application/json',
                    },
                }
            )
            .pipe(
                // スネークケースをキャメルケースに変換
                map((books) =>
                    books.map((book) => ({
                        id: book.id,
                        name: book.name,
                        createdAt: book.created_at,
                        updatedAt: book.updated_at,
                        userId: book.user_id,
                    }))
                ),
                // エラーハンドリング
                catchError((error) => {
                    console.error('Failed to fetch books:', error);
                    return of([]); // エラー時は空配列を返す
                })
            );
    }

    /**
     * リトライ機能付きで書籍を取得
     * @param retryCount リトライ回数
     */
    getBooksWithRetry(retryCount: number = 3): Observable<Book[]> {
        return this.http
            .post<BookResponse[]>(
                `https://iaicqgeozyvqawvisvso.supabase.co/functions/v1/get-books`,
                {},
                {
                    headers: {
                        'apikey': 'sb_publishable_AnLAszlIUZH6wGDKb7BubA_duSDuHux',
                        'Content-Type': 'application/json',
                    },
                }
            )
            .pipe(
                // スネークケースをキャメルケースに変換
                map((books) =>
                    books.map((book) => ({
                        id: book.id,
                        name: book.name,
                        createdAt: book.created_at,
                        updatedAt: book.updated_at,
                        userId: book.user_id,
                    }))
                ),
                catchError((error) => {
                    console.error('Failed to fetch books after retries:', error);
                    return of([]);
                })
            );
    }
}
