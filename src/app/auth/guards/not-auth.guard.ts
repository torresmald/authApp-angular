import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { computed, inject } from '@angular/core';
import { AuthStatus } from '../interfaces/auth-status.interface';

export const notAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  const userStatus = computed(() => authService.userStatus())

  if(userStatus() ===  AuthStatus.authenticated) {
    return false
  }
  return true;
};
