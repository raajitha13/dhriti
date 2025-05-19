import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // If user is logged in and tries to access login/register page, redirect to dashboard
    if (state.url === '/login' || state.url === '/register') {
      router.navigate(['/habits/dashboard']);
      return false;
    }
    // Otherwise, allow access
    return true;
  } else {
    // Not logged in, redirect to login page
    router.navigate(['/login']);
    return false;
  }
};
