import { Routes } from '@angular/router';

import { usersRoutes } from './modules/users/users.routes';
import { authRoutes } from './modules/auth/auth.routes';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./modules/auth/auth.component'),
    children: authRoutes,
  },
  {
    path: 'users',
    loadComponent: () => import('./modules/users/user-app.component'),
    children: usersRoutes,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: route => {
      console.log({ route });
      // TODO: Inject guard to check if user is logged in
      return 'users';
    },
  },
];
