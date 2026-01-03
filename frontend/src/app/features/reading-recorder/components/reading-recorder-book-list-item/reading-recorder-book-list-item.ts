import { Component, Input } from '@angular/core';
import { Book } from '../../models';

@Component({
  selector: 'app-reading-recorder-book-list-item',
  imports: [],
  templateUrl: './reading-recorder-book-list-item.html',
  styleUrl: './reading-recorder-book-list-item.css',
})
export class ReadingRecorderBookListItem {
  @Input() book!: Book;
}
