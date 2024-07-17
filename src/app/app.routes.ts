import { Routes } from '@angular/router';

import { usersRoutes } from './modules/users/users.routes';

export const routes: Routes = [
  {
    path: 'users',
    loadComponent: () => import('./modules/users/user-app.component'),
    children: usersRoutes,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: route => {
      // TODO: Inject guard to check if user is logged in
      return 'users';
    },
  },
];
