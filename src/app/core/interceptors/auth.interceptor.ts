import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from '@core/services';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).$token();
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    return next(req);
  }

  return next(req);
};
