import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'readingRecorder',
    loadComponent: () =>
      import('./features/reading-recorder/components/reading-recorder-home/reading-recorder-home')
        .then(m => m.ReadingRecorderHome)
  }
];
