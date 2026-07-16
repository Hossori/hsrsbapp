import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book } from './models';
import { ReadingRecorderBookListItem } from './components/reading-recorder-book-list-item/reading-recorder-book-list-item';
import { BookService } from './services/book.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-reading-recorder',
  imports: [ReadingRecorderBookListItem, ReactiveFormsModule],
  templateUrl: './reading-recorder.html',
  styleUrl: './reading-recorder.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadingRecorder {
  protected readonly books = signal<Book[]>([]);
  protected readonly loginError = signal<string | null>(null);
  protected readonly isSubmitting = signal(false);

  protected readonly auth = inject(AuthService);
  private readonly bookService = inject(BookService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor() {
    effect((onCleanup) => {
      if (!this.auth.initialized()) {
        return;
      }
      if (!this.auth.isAuthenticated()) {
        this.books.set([]);
        return;
      }

      const subscription = this.bookService.getBooks().subscribe({
        next: (books) => this.books.set(books),
        error: (error) => {
          console.error('Failed to fetch books:', error);
          this.books.set([]);
        },
      });
      onCleanup(() => subscription.unsubscribe());
    });
  }

  protected async onLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.loginError.set(null);

    const { email, password } = this.loginForm.getRawValue();
    try {
      await this.auth.signInWithPassword(email, password);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'ログインに失敗しました';
      this.loginError.set(message);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected async onLogout(): Promise<void> {
    await this.auth.signOut();
    this.books.set([]);
  }
}
