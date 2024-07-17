import { Routes } from '@angular/router';

export const usersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/users-table/users-table.component'),
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/user-form/user-form.component'),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pages/edit-user/edit-user.component'),
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
