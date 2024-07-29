import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '@core/services';

export const authGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.$isAuthenticated()) {
    router.navigate(['/auth']);
    return false;
  }

  if (isTokenExpired(authService.$tokenPayload()!.exp)) {
    authService.handleLogout();
    router.navigate(['/auth']);
    return false;
  }

  return true;
};

function isTokenExpired(expirationTime: number): boolean {
  return Date.now() >= expirationTime * 1000;
}
