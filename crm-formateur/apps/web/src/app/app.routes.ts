import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'pipeline',
    loadComponent: () =>
      import('./features/pipeline/pipeline.component').then(m => m.PipelineComponent),
  },
  {
    path: 'contacts',
    loadComponent: () =>
      import('./features/contacts/contacts.component').then(m => m.ContactsComponent),
  },
  {
    path: 'sessions',
    loadComponent: () =>
      import('./features/sessions/sessions.component').then(m => m.SessionsComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  { path: '**', redirectTo: 'dashboard' },
];
