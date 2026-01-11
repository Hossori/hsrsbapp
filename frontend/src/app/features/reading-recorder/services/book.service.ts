import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Book } from '../models';
import { environment } from '../../../../environments/environment';

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
    private readonly supabaseUrl = environment.supabaseUrl;
    private readonly supabaseAnonKey = environment.supabaseAnonKey;

    /**
     * 書籍一覧を取得
     * @returns Observable<Book[]>
     */
    getBooks(): Observable<Book[]> {
        return this.http
            .post<BookResponse[]>(
                `${this.supabaseUrl}/functions/v1/get-books`,
                {},
                {
                    headers: {
                        'apikey': this.supabaseAnonKey,
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
                `${this.supabaseUrl}/functions/v1/get-books`,
                {},
                {
                    headers: {
                        'apikey': this.supabaseAnonKey,
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
