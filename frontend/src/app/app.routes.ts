import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'readingRecorder',
    loadComponent: () =>
      import('./features/reading-recorder/reading-recorder')
        .then(m => m.ReadingRecorder)
  }
];
