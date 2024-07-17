import { Routes } from '@angular/router';

export const usersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/users-table/users-table.component'),
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/create-user/create-user.component'),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pages/update-user/update-user.component'),
  },
  {
    path: 'edit/password/:id',
    loadComponent: () =>
      import('./pages/update-password/update-password.component'),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
