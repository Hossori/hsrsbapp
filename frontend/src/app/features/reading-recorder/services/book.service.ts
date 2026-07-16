import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Book, BookStatus } from '../models';
import { AuthService } from '../../../core/auth.service';
import { getSupabasePublicConfig } from '../../../core/supabase-config';

/**
 * Supabase Functionsから返されるレスポンスの型
 */
interface BookResponse {
  id: string;
  user_id: string;
  title: string;
  author: string | null;
  isbn: string | null;
  total_pages: number | null;
  status: BookStatus;
  rating: number | null;
  review: string | null;
  started_at: string | null;
  finished_at: string | null;
  cover_url: string | null;
  google_books_id: string | null;
  created_at: string;
  updated_at: string;
}

function toBook(book: BookResponse): Book {
  return {
    id: book.id,
    userId: book.user_id,
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    totalPages: book.total_pages,
    status: book.status,
    rating: book.rating,
    review: book.review,
    startedAt: book.started_at,
    finishedAt: book.finished_at,
    coverUrl: book.cover_url,
    googleBooksId: book.google_books_id,
    createdAt: book.created_at,
    updatedAt: book.updated_at,
  };
}

/**
 * 書籍データを取得するサービス
 */
@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  /**
   * 書籍一覧を取得（要ログイン・RLS 適用）
   */
  getBooks(): Observable<Book[]> {
    const token = this.auth.getAccessToken();
    if (!token) {
      return throwError(() => new Error('ログインが必要です'));
    }

    const { url, anonKey } = getSupabasePublicConfig();
    const headers = new HttpHeaders({
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<BookResponse[]>(`${url}/functions/v1/get-books`, {}, { headers }).pipe(
      map((books) => books.map(toBook)),
      catchError((error) => {
        console.error('Failed to fetch books:', error);
        return of([]);
      }),
    );
  }
}
