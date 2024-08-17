import { Routes } from '@angular/router';

import { authGuard } from '@core/guards/auth.guard';
import { usersRoutes } from './modules/users/users.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { inject } from '@angular/core';
import { AuthService } from '@core/services';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./modules/auth/auth.component'),
    children: authRoutes,
  },
  {
    path: 'users',
    loadComponent: () => import('./modules/users/user-app.component'),
    canActivate: [authGuard],
    children: usersRoutes,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: () => {
      return inject(AuthService).$isAuthenticated() ? 'users' : 'auth';
    },
  },
];
