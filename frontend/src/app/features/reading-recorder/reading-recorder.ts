import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Book } from './models';
import { ReadingRecorderBookListItem } from './components/reading-recorder-book-list-item/reading-recorder-book-list-item';

@Component({
  selector: 'app-reading-recorder',
  imports: [ReadingRecorderBookListItem],
  templateUrl: './reading-recorder.html',
  styleUrl: './reading-recorder.css',
})
export class ReadingRecorder implements OnInit {
  protected books: WritableSignal<Book[]> = signal<Book[]>([]);

  ngOnInit(): void {
    //TODO
    this.books.set([
      { id: '1', name: 'Book 1', createdAt: '2021-01-01', updatedAt: '2021-01-01', userId: '1' },
      { id: '2', name: 'Book 2', createdAt: '2021-01-01', updatedAt: '2021-01-01', userId: '1' },
    ]);
  }
}
