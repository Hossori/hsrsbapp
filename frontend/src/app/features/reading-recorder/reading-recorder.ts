import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Book } from './models';
import { ReadingRecorderBookListItem } from './components/reading-recorder-book-list-item/reading-recorder-book-list-item';
import { BookService } from './services/book.service';

/**
 * 読書記録コンポーネント
 * Angular HttpClientを使用した実装（推奨）
 */
@Component({
  selector: 'app-reading-recorder',
  imports: [ReadingRecorderBookListItem],
  templateUrl: './reading-recorder.html',
  styleUrl: './reading-recorder.css',
})
export class ReadingRecorder implements OnInit {
  protected books = signal<Book[]>([]);
  private readonly bookService = inject(BookService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // サービスを使用して書籍一覧を取得
    // インターセプターにより認証ヘッダーが自動的に追加される
    this.bookService
      .getBooks()
      .pipe(takeUntilDestroyed(this.destroyRef)) // コンポーネント破棄時に自動的に購読解除
      .subscribe({
        next: (books) => this.books.set(books),
        error: (error) => {
          console.error('Failed to fetch books:', error);
          this.books.set([]);
        },
      });
  }
}
